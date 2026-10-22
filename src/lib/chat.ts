// Shared chat protocol. The assistant (Claude or the on-device rules below) only *chooses an action*;
// the planner carries it out. That keeps every menu and every number coming from the nutrition engine.

import type { DishTag } from "./nutrition/dishes";
import { FOODS } from "./nutrition/foods";
import { isRedFlag, RED_FLAG_REPLY } from "./nutrition/safety";
import type { MealLog, Slot } from "./nutrition/types";

export type ChatAction = {
  type: "none" | "swap" | "log";
  member_id: string;
  slot: Slot | "";
  tags: DishTag[];
  avoid_foods: string[];
  prefer_foods: string[];
  log_status: MealLog | "";
};

export type ChatReply = { reply: string; action: ChatAction; citations: number[]; danger?: boolean };

export type ChatContextMember = {
  id: string;
  name: string;
  role: "ibu" | "anak";
  label: string;
  today: { slot: Slot; dish: string; logged: MealLog | null }[];
};

export const NO_ACTION: ChatAction = {
  type: "none", member_id: "", slot: "", tags: [], avoid_foods: [], prefer_foods: [], log_status: "",
};

export const SLOTS: Slot[] = ["sarapan", "camilan-pagi", "siang", "camilan-sore", "malam"];
export const TAGS: DishTag[] = ["pedas", "berkuah", "manis", "gurih", "goreng", "segar"];

/* ---------- On-device fallback (no API key, or the API is unreachable) ---------- */

const FOOD_WORDS: [RegExp, string[]][] = [
  [/telur|telor|egg/, ["telur"]],
  [/ayam|chicken/, ["ayam", "ayam-fillet"]],
  [/sapi|daging|beef/, ["daging-sapi"]],
  [/hati|liver/, ["hati-ayam"]],
  [/ikan|fish/, ["ikan-kembung", "ikan-lele", "ikan-nila", "salmon"]],
  [/kembung/, ["ikan-kembung"]],
  [/lele/, ["ikan-lele"]],
  [/nila/, ["ikan-nila"]],
  [/salmon/, ["salmon"]],
  [/udang|shrimp/, ["udang"]],
  [/tempe/, ["tempe"]],
  [/tahu|tofu/, ["tahu"]],
  [/susu|milk/, ["susu"]],
  [/keju|cheese/, ["keju"]],
  [/yogurt|yoghurt/, ["yogurt"]],
  [/bayam|spinach/, ["bayam"]],
  [/kangkung/, ["kangkung"]],
  [/kelor|moringa/, ["daun-kelor"]],
  [/brokoli|broccoli/, ["brokoli"]],
  [/wortel|carrot/, ["wortel"]],
  [/kentang|potato/, ["kentang"]],
  [/pisang|banana/, ["pisang"]],
  [/alpukat|avocado/, ["alpukat"]],
  [/nasi|beras|rice/, ["nasi"]],
];

const TAG_WORDS: [RegExp, DishTag][] = [
  [/pedas|pedes|spicy|sambal/, "pedas"],
  [/kuah|sup|soto|sayur bening|soup/, "berkuah"],
  [/manis|sweet/, "manis"],
  [/segar|seger|fresh|dingin/, "segar"],
  [/goreng|crispy|kriuk/, "goreng"],
  [/gurih|savory/, "gurih"],
];

function foodsIn(text: string): string[] {
  const ids = new Set<string>();
  for (const [re, foods] of FOOD_WORDS) if (re.test(text)) foods.forEach((f) => ids.add(f));
  return [...ids];
}

function slotIn(text: string): Slot | "" {
  if (/sarapan|pagi ini|breakfast/.test(text)) return "sarapan";
  if (/makan siang|siang|lunch/.test(text)) return "siang";
  if (/camilan|snack|ngemil/.test(text)) return /pagi/.test(text) ? "camilan-pagi" : "camilan-sore";
  if (/malam|dinner/.test(text)) return "malam";
  return "";
}

function memberIn(text: string, members: ChatContextMember[]): ChatContextMember | undefined {
  const byName = members.find((m) => text.includes(m.name.toLowerCase()));
  if (byName) return byName;
  if (/anak|kakak|adik|adek|si kecil|bayi|baby|toddler|balita/.test(text)) return members.find((m) => m.role === "anak" && m.today.length);
  return members.find((m) => m.role === "ibu" && m.today.length) ?? members.find((m) => m.today.length);
}

function nextSlot(member: ChatContextMember): Slot | "" {
  return member.today.find((t) => !t.logged)?.slot ?? member.today[0]?.slot ?? "";
}

export function localReply(message: string, members: ChatContextMember[]): ChatReply {
  const text = message.toLowerCase();
  if (isRedFlag(text)) return { reply: RED_FLAG_REPLY, action: NO_ACTION, citations: [], danger: true };
  const member = memberIn(text, members);
  const foods = foodsIn(text);
  const tags = TAG_WORDS.filter(([re]) => re.test(text)).map(([, t]) => t);
  const slot = member ? slotIn(text) || nextSlot(member) : "";
  const base = { ...NO_ACTION, member_id: member?.id ?? "", slot };

  if (member && /nolak|menolak|tidak mau|gak mau|nggak mau|ga mau|ogah|bosan|bosen|mual|enek|eneg|alergi|refuse/.test(text)) {
    const picky = member.role === "anak";
    return {
      reply: picky
        ? `Oke, menu ${member.name} saya ganti tanpa ${foods.length ? foods.map((f) => FOODS[f].name.toLowerCase()).join(", ") : "menu tadi"}. Makanan yang ditolak tidak perlu dihapus, coba tawarkan lagi lain hari dalam bentuk berbeda. Banyak anak perlu mencicipi berkali-kali sebelum mau menerimanya.`
        : `Oke, saya ganti dengan menu lain yang tetap memenuhi target gizimu.`,
      action: { ...base, type: "swap", avoid_foods: foods },
      citations: picky ? [6] : [3],
    };
  }
  if (member && /kulkas|tinggal|sisa|adanya|cuma ada|hanya ada/.test(text) && foods.length) {
    return {
      reply: "Saya cari menu yang memakai bahan yang ada.",
      action: { ...base, type: "swap", prefer_foods: foods },
      citations: [],
    };
  }
  if (member && /pengen|pingin|ingin|mau|ngidam|craving|kepengen/.test(text) && (tags.length || foods.length)) {
    return {
      reply: "Bisa. Menunya saya sesuaikan, target gizi hari ini tetap dihitung.",
      action: { ...base, type: "swap", tags, prefer_foods: foods },
      citations: [3],
    };
  }
  if (member && /habis|udah makan|sudah makan|dimakan semua|setengah|sebagian|separuh|tidak dimakan|gak dimakan/.test(text)) {
    const status: MealLog = /setengah|sebagian|separuh/.test(text) ? "sebagian" : /tidak dimakan|gak dimakan/.test(text) ? "tidak" : "habis";
    return { reply: "Sudah saya catat.", action: { ...base, type: "log", log_status: status }, citations: [] };
  }
  if (/mpasi|makanan pendamping/.test(text)) {
    return {
      reply: "Tahapan MPASI di Mommy Plate mengikuti pedoman WHO 2023: mulai usia 6 bulan sambil tetap menyusui, tekstur dinaikkan bertahap, dan makanan hewani diberikan setiap hari.",
      action: NO_ACTION,
      citations: [2],
    };
  }
  return {
    reply: "Saya bisa mengganti menu (misalnya \"lagi pengen yang pedas\"), mencari menu dari isi kulkas, atau mencatat makanan yang sudah dimakan. Coba ceritakan apa yang kamu butuhkan.",
    action: NO_ACTION,
    citations: [],
  };
}
