"use client";

import { useEffect, useRef, useState } from "react";
import { Rich } from "@/components/Rich";
import { references } from "@/content/references";
import { localReply, type ChatContextMember, type ChatReply } from "@/lib/chat";
import { DISH_BY_ID } from "@/lib/nutrition/dishes";
import { isRedFlag, RED_FLAG_REPLY } from "@/lib/nutrition/safety";
import { targetsFor } from "@/lib/nutrition/targets";
import { SLOT_INFO, type Slot } from "@/lib/nutrition/types";
import { clearChat, getState, logMeal, pushChat, swap, today, type AppState } from "@/lib/store";
import { Button } from "./ui";

const QUICK = ["Lagi pengen yang pedas", "Anak nolak telur", "Kulkas tinggal tahu, bayam, ayam", "Sarapan tadi habis"];

function context(state: AppState): ChatContextMember[] {
  const date = today();
  return state.members.map((m) => {
    const plan = state.plans[date]?.[m.id];
    const logs = state.logs[date]?.[m.id] ?? {};
    return {
      id: m.id,
      name: m.name,
      role: m.role,
      label: targetsFor(m, date).label,
      today: plan ? plan.meals.map((x) => ({ slot: x.slot, dish: DISH_BY_ID[x.dishId].name, logged: logs[x.slot] ?? null })) : [],
    };
  });
}

/** Carry out the assistant's chosen action with the planner and describe the result. */
function apply(reply: ChatReply, members: ChatContextMember[]): string {
  const a = reply.action;
  if (a.type === "none") return "";
  const member = members.find((m) => m.id === a.member_id) ?? members.find((m) => m.today.length);
  if (!member || member.today.length === 0) return "";
  const slot = (a.slot || member.today.find((t) => !t.logged)?.slot || member.today[0].slot) as Slot;
  if (!member.today.some((t) => t.slot === slot)) return "";
  if (a.type === "log" && a.log_status) {
    logMeal(today(), member.id, slot, a.log_status);
    return `Tercatat: ${SLOT_INFO[slot].label.toLowerCase()} ${member.name} ${a.log_status === "tidak" ? "tidak dimakan" : a.log_status}.`;
  }
  if (a.type === "swap") {
    const id = swap(today(), member.id, slot, { tags: a.tags, avoidFoods: a.avoid_foods, preferFoods: a.prefer_foods });
    return id
      ? `Menu ${SLOT_INFO[slot].label.toLowerCase()} ${member.name} sekarang: ${DISH_BY_ID[id].name}. Gizinya sudah dihitung ulang di tab Hari ini.`
      : "Belum ada menu yang cocok dengan permintaan itu dan pantangan keluargamu. Coba permintaan lain.";
  }
  return "";
}

export function ChatView({ state }: { state: AppState }) {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [offline, setOffline] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => endRef.current?.scrollIntoView({ block: "end" }), [state.chat.length, sending]);

  async function send(raw: string) {
    const text = raw.trim();
    if (!text || sending) return;
    setInput("");
    pushChat({ from: "user", text });
    if (isRedFlag(text)) {
      pushChat({ from: "bot", text: RED_FLAG_REPLY, danger: true });
      return;
    }
    setSending(true);
    const members = context(getState());
    let reply: ChatReply;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: getState().chat.slice(-9, -1).map((c) => ({ from: c.from, text: c.text.replace(/\[\[\d+\]\]/g, "") })),
          members,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      if (data.fallback || !data.reply) throw new Error("fallback");
      reply = data;
      setOffline(false);
    } catch {
      // No API key, offline, or the service is busy: answer with the on-device rules.
      reply = localReply(text, members);
      setOffline(true);
    }
    const result = reply.danger ? "" : apply(reply, members);
    const cites = (reply.citations ?? []).filter((n) => references.some((r) => r.id === n)).map((n) => `[[${n}]]`).join("");
    pushChat({ from: "bot", text: [reply.reply + cites, result].filter(Boolean).join("\n\n"), danger: reply.danger });
    setSending(false);
  }

  const used = references.filter((r) => state.chat.some((c) => c.text.includes(`[[${r.id}]]`)));

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-3">
      <ol className="space-y-3" aria-live="polite">
        {state.chat.length === 0 && (
          <li className="max-w-[88%] rounded-2xl rounded-bl-md border border-line bg-surface px-4 py-3 text-[15px] leading-relaxed text-ink">
            Halo. Mau ganti menu karena ngidam, anak menolak makanan, atau isi kulkas terbatas? Ceritakan saja. Saya juga bisa mencatat makanan yang sudah dimakan.
          </li>
        )}
        {state.chat.map((m, i) => (
          <li key={i} className={m.from === "user" ? "flex justify-end" : ""}>
            <div
              className={`max-w-[88%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed whitespace-pre-line ${
                m.from === "user"
                  ? "rounded-br-md bg-green text-on-green"
                  : m.danger
                    ? "rounded-bl-md border border-danger bg-danger-soft text-ink"
                    : "rounded-bl-md border border-line bg-surface text-ink"
              }`}
            >
              {m.danger && <p className="mb-1 text-sm font-bold text-danger">Perlu diperiksa tenaga kesehatan</p>}
              <Rich text={m.text} />
            </div>
          </li>
        ))}
        {sending && <li className="text-sm text-muted" role="status">Sedang menyusun jawaban...</li>}
      </ol>
      <div ref={endRef} className="scroll-mb-64 md:scroll-mb-48" />

      {(used.length > 0 || state.chat.length > 0) && (
        <div className="mt-2 space-y-3 border-t border-line pt-3">
          {used.length > 0 && (
            <>
              <p className="text-sm font-semibold text-ink">Rujukan di percakapan ini</p>
              <ol className="space-y-2">
                {used.map((r) => (
                  <li key={r.id} id={`ref-${r.id}`} className="grid scroll-mt-24 grid-cols-[1.5rem_1fr] gap-2 text-xs leading-relaxed text-muted">
                    <span className="font-semibold text-accent">{r.id}</span>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{r.citation}</a>
                  </li>
                ))}
              </ol>
            </>
          )}
          <Button variant="quiet" className="text-sm" onClick={clearChat}>Hapus percakapan</Button>
        </div>
      )}

      {/* Room for the composer, which is fixed to the bottom of the screen. */}
      <div aria-hidden="true" className="h-40" />

      {/* Always at the bottom of the screen (above the bottom navigation on phones), even when the chat is short. */}
      <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-20 border-t border-line bg-bg px-4 pt-3 pb-3 sm:px-6 md:bottom-0 md:left-60">
        <div className="mx-auto max-w-2xl space-y-2">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 md:mx-0 md:px-0">
          {QUICK.map((q) => (
            <button key={q} type="button" onClick={() => send(q)} disabled={sending} className="min-h-11 shrink-0 rounded-lg border border-line px-3 text-sm font-medium text-ink hover:bg-surface disabled:opacity-50">
              {q}
            </button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
          <label htmlFor="chat-input" className="sr-only">Tulis pesan</label>
          <input
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={600}
            placeholder="Tulis pesan..."
            className="h-12 min-w-0 flex-1 rounded-lg border border-line bg-bg px-3 text-base text-ink placeholder:text-muted"
          />
          <Button type="submit" disabled={!input.trim() || sending}>Kirim</Button>
        </form>
        {offline && <p className="text-xs text-muted">Asisten AI sedang tidak tersambung, jawaban memakai mode dasar di perangkat.</p>}
        </div>
      </div>

    </div>
  );
}
