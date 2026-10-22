import Anthropic from "@anthropic-ai/sdk";
import { NO_ACTION, SLOTS, TAGS, type ChatContextMember, type ChatReply } from "@/lib/chat";
import { references } from "@/content/references";
import { FOODS } from "@/lib/nutrition/foods";
import { isRedFlag, RED_FLAG_REPLY } from "@/lib/nutrition/safety";

/*
  Chat assistant. Claude reads the family's plan for today and picks one action (swap a meal, log a
  meal, or just answer). The browser then runs that action through the nutrition engine, so Claude
  never writes menus or nutrition numbers itself.

  Needs ANTHROPIC_API_KEY. Without it this route answers { fallback: true } and the app uses its on-device rules.
  CHAT_MODEL can switch the model (for example to claude-haiku-5-5 to lower cost).
*/

const MODEL = process.env.CHAT_MODEL || "claude-opus-5-5";
const MAX_MESSAGE = 600;
const DAILY_LIMIT = Number(process.env.CHAT_DAILY_LIMIT || 60);

// Basic per-IP limit. It lives in memory, so it resets when the server restarts; replace it with
// per-account limits once accounts exist.
const usage = new Map<string, { day: string; count: number }>();

const SYSTEM = `Kamu adalah asisten gizi di aplikasi Mommy Plate untuk ibu hamil, ibu menyusui, dan anak sampai 12 tahun di Indonesia.

Tugasmu: memahami permintaan pengguna lalu memilih SATU aksi, dan menulis balasan singkat yang hangat dalam bahasa yang sama dengan pengguna (Bahasa Indonesia santai, sapa dengan "kamu").

Aksi:
- "swap": pengguna ingin mengganti menu (ngidam, bosan, anak menolak makanan, isi kulkas terbatas, alergi). Isi member_id, slot (kosongkan bila tidak disebut, aplikasi memilih jadwal makan berikutnya), tags sesuai keinginan rasa, avoid_foods untuk bahan yang ditolak, prefer_foods untuk bahan yang diinginkan atau tersedia.
- "log": pengguna melaporkan makanan sudah dimakan. Isi member_id, slot, dan log_status (habis, sebagian, tidak).
- "none": pertanyaan umum.

Aturan:
- Jangan menulis nama menu baru atau angka gizi (kalori, gram, persen). Aplikasi yang menyusun menu dan menghitung gizi, lalu menampilkannya di bawah balasanmu.
- Jangan mendiagnosis, meresepkan obat, atau suplemen dengan dosis. Untuk kondisi medis, arahkan ke dokter atau bidan.
- Bila ada tanda bahaya (perdarahan, gerakan janin berkurang, kejang, sesak napas, muntah terus, demam tinggi, reaksi alergi berat), balas hanya dengan anjuran segera ke dokter atau IGD dan aksi "none".
- Untuk anak yang menolak makanan: jangan memaksa; sarankan menawarkan lagi lain hari dalam bentuk berbeda.
- Untuk ibu hamil: hindari menyarankan makanan mentah atau setengah matang, ikan tinggi merkuri, hati dalam jumlah banyak, alkohol, dan jamu.
- Balasan maksimal 3 kalimat.
- Kutip rujukan hanya dari daftar di bawah dengan nomornya di "citations". Bila tidak ada yang relevan, biarkan kosong. Jangan menyebut sumber lain.

Daftar rujukan:
${references.map((r) => `${r.id}. ${r.citation}`).join("\n")}

ID bahan yang boleh dipakai untuk avoid_foods dan prefer_foods:
${Object.values(FOODS).map((f) => `${f.id} (${f.name})`).join(", ")}`;

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["reply", "action", "citations"],
  properties: {
    reply: { type: "string" },
    citations: { type: "array", items: { type: "integer", enum: references.map((r) => r.id) } },
    action: {
      type: "object",
      additionalProperties: false,
      required: ["type", "member_id", "slot", "tags", "avoid_foods", "prefer_foods", "log_status"],
      properties: {
        type: { type: "string", enum: ["none", "swap", "log"] },
        member_id: { type: "string" },
        slot: { type: "string", enum: ["", ...SLOTS] },
        tags: { type: "array", items: { type: "string", enum: TAGS } },
        avoid_foods: { type: "array", items: { type: "string", enum: Object.keys(FOODS) } },
        prefer_foods: { type: "array", items: { type: "string", enum: Object.keys(FOODS) } },
        log_status: { type: "string", enum: ["", "habis", "sebagian", "tidak"] },
      },
    },
  },
} as const;

type Body = {
  message?: string;
  history?: { from: "user" | "bot"; text: string }[];
  members?: ChatContextMember[];
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }
  const message = String(body.message ?? "").trim().slice(0, MAX_MESSAGE);
  if (!message) return Response.json({ error: "empty" }, { status: 400 });

  if (isRedFlag(message)) {
    const reply: ChatReply = { reply: RED_FLAG_REPLY, action: NO_ACTION, citations: [], danger: true };
    return Response.json(reply);
  }

  // No key configured: tell the app to use its on-device rules (200, so browsers do not log an error).
  if (!process.env.ANTHROPIC_API_KEY) return Response.json({ fallback: true });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const day = new Date().toISOString().slice(0, 10);
  const used = usage.get(ip);
  const count = used && used.day === day ? used.count : 0;
  if (count >= DAILY_LIMIT) return Response.json({ error: "limit" }, { status: 429 });
  usage.set(ip, { day, count: count + 1 });

  const members = (body.members ?? []).slice(0, 8);
  const history = (body.history ?? []).slice(-8);
  const context = `Keluarga dan menu hari ini (JSON):\n${JSON.stringify(members)}`;

  const messages: Anthropic.Beta.BetaMessageParam[] = [];
  for (const h of history) messages.push({ role: h.from === "user" ? "user" : "assistant", content: h.text.slice(0, MAX_MESSAGE) });
  messages.push({ role: "user", content: `${context}\n\nPesan pengguna: ${message}` });
  // The API requires the first message to come from the user.
  while (messages.length && messages[0].role !== "user") messages.shift();

  const client = new Anthropic();
  try {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 2000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
      output_config: { effort: "low", format: { type: "json_schema", schema: SCHEMA } },
      messages,
    });
    if (response.stop_reason === "refusal") {
      return Response.json({ reply: "Maaf, saya tidak bisa membantu permintaan itu. Coba tanyakan hal lain seputar menu keluarga.", action: NO_ACTION, citations: [] } satisfies ChatReply);
    }
    const text = response.content.find((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")?.text ?? "";
    const parsed = JSON.parse(text) as ChatReply;
    // Never let a model reply bypass the red-flag rule.
    if (isRedFlag(parsed.reply)) parsed.danger = true;
    return Response.json(parsed);
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) return Response.json({ error: "busy" }, { status: 429 });
    if (error instanceof Anthropic.AuthenticationError) return Response.json({ error: "no_key" }, { status: 503 });
    if (error instanceof Anthropic.APIError) {
      console.error("chat: API error", error.status, error.message);
      return Response.json({ error: "upstream" }, { status: 502 });
    }
    console.error("chat: unexpected", error);
    return Response.json({ error: "upstream" }, { status: 502 });
  }
}
