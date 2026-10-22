// Menu planner. Deterministic: the same inputs and seed always give the same plan, so a plan
// does not jump around between renders. All nutrition numbers come from foods.ts and targets.ts;
// nothing here (or in the chat assistant) invents values.

import { DISHES, DISH_BY_ID, type Dish, type DishTag } from "./dishes";
import { FOODS } from "./foods";
import { ageInMonths, childStage, targetsFor } from "./targets";
import {
  addNutrients,
  emptyNutrients,
  LOG_FACTOR,
  type DayPlan,
  type Member,
  type MealLog,
  type Nutrients,
  type PlannedMeal,
  type Preferences,
  type Slot,
} from "./types";

/* ---------- Nutrition of a dish ---------- */

export function dishNutrients(dish: Dish, portion = 1): Nutrients {
  let n = emptyNutrients();
  for (const [foodId, grams] of dish.ingredients) {
    const food = FOODS[foodId];
    if (!food) continue;
    n = addNutrients(n, food.per100g, (grams * portion) / 100);
  }
  return n;
}

export function dishCost(dish: Dish, portion = 1): number {
  return dish.ingredients.reduce((sum, [foodId, grams]) => sum + ((FOODS[foodId]?.pricePerKg ?? 0) * grams * portion) / 1000, 0);
}

export function portionGrams(dish: Dish, portion: number): { name: string; grams: number }[] {
  return dish.ingredients
    .filter(([id]) => id !== "minyak")
    .map(([id, g]) => ({ name: FOODS[id]?.name ?? id, grams: Math.max(5, Math.round((g * portion) / 5) * 5) }));
}

/* ---------- Slots and energy shares ---------- */

type SlotSpec = { slot: Slot; kind: "utama" | "sarapan" | "camilan"; share: number };

const ADULT_SLOTS: SlotSpec[] = [
  { slot: "sarapan", kind: "sarapan", share: 0.25 },
  { slot: "camilan-pagi", kind: "camilan", share: 0.1 },
  { slot: "siang", kind: "utama", share: 0.3 },
  { slot: "camilan-sore", kind: "camilan", share: 0.1 },
  { slot: "malam", kind: "utama", share: 0.25 },
];

// WHO: 2 to 3 meals at 6 to 8 months, 3 to 4 meals plus 1 to 2 snacks from 9 months.
const SLOTS_6_8: SlotSpec[] = [
  { slot: "sarapan", kind: "utama", share: 0.34 },
  { slot: "siang", kind: "utama", share: 0.33 },
  { slot: "malam", kind: "utama", share: 0.33 },
];
const SLOTS_9_11: SlotSpec[] = [
  { slot: "sarapan", kind: "utama", share: 0.28 },
  { slot: "siang", kind: "utama", share: 0.28 },
  { slot: "camilan-sore", kind: "camilan", share: 0.16 },
  { slot: "malam", kind: "utama", share: 0.28 },
];

export function slotsFor(member: Member, on: string): SlotSpec[] {
  if (member.role === "anak") {
    const stage = childStage(ageInMonths(member.birthDate, on));
    if (stage === "mpasi-halus") return SLOTS_6_8;
    if (stage === "mpasi-tim") return SLOTS_9_11;
  }
  return ADULT_SLOTS;
}

/* ---------- Candidate dishes ---------- */

export type Wish = { tags?: DishTag[]; avoidFoods?: string[]; preferFoods?: string[] };

function allowedDishes(member: Member, on: string, prefs: Preferences, kind: SlotSpec["kind"]): Dish[] {
  const months = ageInMonths(member.birthDate, on);
  const stage = member.role === "anak" ? childStage(months) : "keluarga";
  return DISHES.filter((d) => {
    if (!d.kind.includes(kind)) return false;
    if (member.role === "anak") {
      if (stage === "mpasi-halus" && d.stage !== "mpasi-halus") return false;
      // 9 to 11 months: minced dishes, plus smooth ones as a fallback
      if (stage === "mpasi-tim" && d.stage === "keluarga") return false;
      if (stage === "keluarga" && (d.stage !== "keluarga" || !d.childOk)) return false;
    } else {
      if (d.stage !== "keluarga") return false;
      if (member.status.kind === "hamil" && d.avoidInPregnancy) return false;
      if (!prefs.likesSpicy && d.tags.includes("pedas")) return false;
    }
    for (const [foodId] of d.ingredients) {
      if (prefs.avoid.includes(foodId)) return false;
      const allergens = FOODS[foodId]?.allergens ?? [];
      if (allergens.some((a) => prefs.allergens.includes(a))) return false;
    }
    return true;
  });
}

/* ---------- Scoring ---------- */

// How much each nutrient counts when comparing candidate days. Energy is handled by portion sizing.
const WEIGHTS: Partial<Record<keyof Nutrients, number>> = { protein: 3, besi: 3, kalsium: 2, serat: 1, karbo: 1, lemak: 1 };

function portionFor(dish: Dish, spec: SlotSpec, targetEnergy: number, isChild: boolean): number {
  const e = dishNutrients(dish).energi || 1;
  const raw = (targetEnergy * spec.share) / e;
  const [min, max] = isChild ? [0.25, 2.5] : [0.6, 1.8];
  return Math.round(Math.min(max, Math.max(min, raw)) * 20) / 20;
}

function scoreDay(meals: PlannedMeal[], targets: Nutrients, ctx: ScoreContext): number {
  let n = emptyNutrients();
  let cost = 0;
  const proteins: string[] = [];
  for (const m of meals) {
    const d = DISH_BY_ID[m.dishId];
    n = addNutrients(n, dishNutrients(d, m.portion));
    cost += dishCost(d, m.portion);
    if (d.mainProtein) proteins.push(d.mainProtein);
  }
  let score = 0;
  for (const [k, w] of Object.entries(WEIGHTS) as [keyof Nutrients, number][]) {
    const r = targets[k] > 0 ? n[k] / targets[k] : 1;
    score += w * Math.min(r, 1);
    if (k === "lemak" && r > 1.3) score -= (r - 1.3) * 2;
  }
  const energyRatio = targets.energi > 0 ? n.energi / targets.energi : 1;
  score -= Math.abs(1 - energyRatio) * 3;
  // Variety: the same main protein twice in a day, or a dish eaten in the last two days
  score -= (proteins.length - new Set(proteins).size) * 0.6;
  for (const m of meals) if (ctx.recentDishes.has(m.dishId)) score -= 0.7;
  // One cook, whole family: small bonus when a child eats the mother's dish
  for (const m of meals) if (ctx.sharedDishes.get(m.slot) === m.dishId) score += 0.6;
  if (ctx.dailyBudget > 0 && cost > ctx.dailyBudget) score -= ((cost - ctx.dailyBudget) / ctx.dailyBudget) * 2;
  return score;
}

type ScoreContext = { recentDishes: Set<string>; sharedDishes: Map<Slot, string>; dailyBudget: number };

/* ---------- Seeded randomness ---------- */

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function rng(seed: number) {
  let a = seed || 1;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- Planning ---------- */

export type PlanInput = {
  member: Member;
  date: string;
  prefs: Preferences;
  householdSize: number;
  recentDishes: Set<string>;
  sharedDishes?: Map<Slot, string>;
  seed?: number;
};

export function planDay(input: PlanInput): DayPlan | null {
  const { member, date, prefs } = input;
  const info = targetsFor(member, date);
  if (!info.plan) return null;
  const specs = slotsFor(member, date);
  const isChild = member.role === "anak";
  const candidates = specs.map((s) => allowedDishes(member, date, prefs, s.kind));
  if (candidates.some((c) => c.length === 0)) return null;

  const ctx: ScoreContext = {
    recentDishes: input.recentDishes,
    sharedDishes: input.sharedDishes ?? new Map(),
    dailyBudget: prefs.weeklyBudget > 0 ? prefs.weeklyBudget / 7 / Math.max(1, input.householdSize) : 0,
  };
  const random = rng(hash(`${member.id}|${date}|${input.seed ?? 0}`));
  let best: PlannedMeal[] = [];
  let bestScore = -Infinity;
  for (let i = 0; i < 300; i++) {
    const meals = specs.map((spec, j) => {
      const list = candidates[j];
      const dish = list[Math.floor(random() * list.length)];
      return { slot: spec.slot, dishId: dish.id, portion: portionFor(dish, spec, info.targets.energi, isChild) };
    });
    if (new Set(meals.map((m) => m.dishId)).size < meals.length) continue;
    const s = scoreDay(meals, info.targets, ctx);
    if (s > bestScore) {
      bestScore = s;
      best = meals;
    }
  }
  if (best.length === 0) return null;
  return { date, memberId: member.id, meals: best };
}

/** Replace one meal with the best alternative that fits the wish, keeping the rest of the day. */
export function swapMeal(
  plan: DayPlan,
  slot: Slot,
  member: Member,
  prefs: Preferences,
  householdSize: number,
  wish: Wish = {},
): DayPlan | null {
  const specs = slotsFor(member, plan.date);
  const spec = specs.find((s) => s.slot === slot);
  if (!spec) return null;
  const info = targetsFor(member, plan.date);
  const current = plan.meals.find((m) => m.slot === slot);
  const others = plan.meals.filter((m) => m.slot !== slot);
  let list = allowedDishes(member, plan.date, prefs, spec.kind).filter(
    (d) => d.id !== current?.dishId && !others.some((o) => o.dishId === d.id),
  );
  if (wish.avoidFoods?.length) list = list.filter((d) => !d.ingredients.some(([f]) => wish.avoidFoods!.includes(f)));
  if (wish.tags?.length) {
    const tagged = list.filter((d) => wish.tags!.some((t) => d.tags.includes(t)));
    if (tagged.length) list = tagged;
  }
  if (wish.preferFoods?.length) {
    const preferred = list.filter((d) => d.ingredients.some(([f]) => wish.preferFoods!.includes(f)));
    if (preferred.length) list = preferred;
  }
  if (list.length === 0) return null;
  const ctx: ScoreContext = {
    recentDishes: new Set(),
    sharedDishes: new Map(),
    dailyBudget: prefs.weeklyBudget > 0 ? prefs.weeklyBudget / 7 / Math.max(1, householdSize) : 0,
  };
  let best: PlannedMeal | null = null;
  let bestScore = -Infinity;
  for (const d of list) {
    const meal = { slot, dishId: d.id, portion: portionFor(d, spec, info.targets.energi, member.role === "anak") };
    const s = scoreDay([...others, meal], info.targets, ctx);
    if (s > bestScore) {
      bestScore = s;
      best = meal;
    }
  }
  if (!best) return null;
  return { ...plan, meals: plan.meals.map((m) => (m.slot === slot ? best! : m)) };
}

/* ---------- Intake ---------- */

export function plannedNutrients(plan: DayPlan): Nutrients {
  return plan.meals.reduce((n, m) => addNutrients(n, dishNutrients(DISH_BY_ID[m.dishId], m.portion)), emptyNutrients());
}

export function eatenNutrients(plan: DayPlan, logs: Partial<Record<Slot, MealLog>>): Nutrients {
  let n = emptyNutrients();
  for (const m of plan.meals) {
    const log = logs[m.slot];
    if (!log) continue;
    n = addNutrients(n, dishNutrients(DISH_BY_ID[m.dishId], m.portion), LOG_FACTOR[log]);
  }
  return n;
}

export function percentOf(value: number, target: number): number {
  return target > 0 ? Math.round((value / target) * 100) : 0;
}

/* ---------- Shopping list ---------- */

export type ShoppingItem = { foodId: string; name: string; category: string; grams: number; cost: number };

export function shoppingList(plans: DayPlan[]): { items: ShoppingItem[]; total: number } {
  const grams = new Map<string, number>();
  for (const plan of plans) {
    for (const m of plan.meals) {
      for (const [foodId, g] of DISH_BY_ID[m.dishId].ingredients) {
        grams.set(foodId, (grams.get(foodId) ?? 0) + g * m.portion);
      }
    }
  }
  const items: ShoppingItem[] = [];
  for (const [foodId, g] of grams) {
    const food = FOODS[foodId];
    if (!food) continue;
    // Cooked rice and pasta are bought dry: roughly 1 kg raw gives 2.5 kg cooked.
    const raw = foodId === "nasi" || foodId === "nasi-merah" || foodId === "makaroni" ? g / 2.5 : g;
    const rounded = Math.max(50, Math.ceil(raw / 50) * 50);
    items.push({ foodId, name: shoppingName(foodId, food.name), category: food.category, grams: rounded, cost: (food.pricePerKg * rounded) / 1000 });
  }
  const order = ["pokok", "lauk-hewani", "lauk-nabati", "sayur", "buah", "susu", "lainnya"];
  items.sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category) || a.name.localeCompare(b.name));
  return { items, total: items.reduce((s, i) => s + i.cost, 0) };
}

function shoppingName(foodId: string, name: string): string {
  if (foodId === "nasi") return "Beras putih";
  if (foodId === "nasi-merah") return "Beras merah";
  if (foodId === "makaroni") return "Makaroni kering";
  return name;
}

export function formatGrams(g: number, foodId?: string): string {
  const liquid = foodId === "susu" || foodId === "santan" || foodId === "minyak";
  if (g >= 1000) return `${(g / 1000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} ${liquid ? "liter" : "kg"}`;
  return `${g} ${liquid ? "ml" : "g"}`;
}
