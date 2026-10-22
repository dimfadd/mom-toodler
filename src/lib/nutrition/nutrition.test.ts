import { describe, expect, it } from "vitest";
import { DISH_BY_ID } from "./dishes";
import { FOODS } from "./foods";
import { classify, zScore } from "./growth";
import { percentOf, plannedNutrients, planDay, shoppingList, swapMeal } from "./planner";
import { isRedFlag } from "./safety";
import { targetsFor } from "./targets";
import type { Member, Preferences } from "./types";

const ON = "2026-10-22";
const prefs: Preferences = { avoid: [], allergens: [], likesSpicy: true, weeklyBudget: 0 };

const mom = (status: Extract<Member, { role: "ibu" }>["status"]): Member => ({
  id: "ibu", role: "ibu", name: "Rina", birthDate: "1995-05-01", status, medical: [],
});
const child = (birthDate: string, breastfed = true): Member => ({
  id: "anak", role: "anak", name: "Kakak", birthDate, sex: "P", breastfed, medical: [],
});

describe("AKG 2019 targets", () => {
  it("adds the second-trimester supplement to a 31-year-old woman", () => {
    // Due 2027-03-01 means about week 21 on 2026-10-22
    const t = targetsFor(mom({ kind: "hamil", dueDate: "2027-03-01" }), ON);
    expect(t.label).toContain("trimester 2");
    expect(t.targets.energi).toBe(2150 + 300);
    expect(t.targets.protein).toBe(60 + 10);
    expect(t.targets.besi).toBe(18 + 9);
  });

  it("adds the first-6-months breastfeeding supplement", () => {
    const t = targetsFor(mom({ kind: "menyusui", babyBirthDate: "2026-07-01" }), ON);
    expect(t.targets.energi).toBe(2150 + 330);
    expect(t.targets.protein).toBe(60 + 20);
  });

  it("does not plan food for a baby under 6 months", () => {
    expect(targetsFor(child("2026-06-01"), ON).plan).toBe(false);
  });

  it("uses the complementary-food share for a breastfed 18-month-old", () => {
    const t = targetsFor(child("2025-04-15"), ON);
    expect(t.targets.energi).toBe(550);
    expect(t.targets.besi).toBe(7); // iron stays at the full AKG
  });

  it("uses the full AKG for a 3-year-old", () => {
    expect(targetsFor(child("2023-09-01"), ON).targets.energi).toBe(1350);
  });

  it("refuses to plan when a medical condition is flagged", () => {
    const m = { ...mom({ kind: "hamil", dueDate: "2027-03-01" }), medical: ["diabetes-gestasional" as const] };
    expect(targetsFor(m, ON).plan).toBe(false);
  });
});

describe("planner", () => {
  it("builds a pregnant day close to the energy target", () => {
    const m = mom({ kind: "hamil", dueDate: "2027-03-01" });
    const plan = planDay({ member: m, date: ON, prefs, householdSize: 2, recentDishes: new Set() })!;
    expect(plan.meals).toHaveLength(5);
    const pct = percentOf(plannedNutrients(plan).energi, targetsFor(m, ON).targets.energi);
    expect(pct).toBeGreaterThan(80);
    expect(pct).toBeLessThan(125);
  });

  it("never gives liver dishes during pregnancy", () => {
    const m = mom({ kind: "hamil", dueDate: "2027-03-01" });
    for (let seed = 0; seed < 30; seed++) {
      const plan = planDay({ member: m, date: ON, prefs, householdSize: 1, recentDishes: new Set(), seed })!;
      expect(plan.meals.some((x) => DISH_BY_ID[x.dishId].avoidInPregnancy)).toBe(false);
    }
  });

  it("respects egg allergy", () => {
    const m = mom({ kind: "tidak" });
    for (let seed = 0; seed < 30; seed++) {
      const plan = planDay({ member: m, date: ON, prefs: { ...prefs, allergens: ["telur"] }, householdSize: 1, recentDishes: new Set(), seed })!;
      for (const meal of plan.meals) {
        expect(DISH_BY_ID[meal.dishId].ingredients.some(([f]) => FOODS[f].allergens?.includes("telur"))).toBe(false);
      }
    }
  });

  it("gives smooth MPASI with three meals to a 7-month-old", () => {
    const plan = planDay({ member: child("2026-03-10"), date: ON, prefs, householdSize: 2, recentDishes: new Set() })!;
    expect(plan.meals).toHaveLength(3);
    expect(plan.meals.every((x) => DISH_BY_ID[x.dishId].stage === "mpasi-halus")).toBe(true);
  });

  it("never gives spicy dishes to a toddler", () => {
    for (let seed = 0; seed < 30; seed++) {
      const plan = planDay({ member: child("2024-10-01"), date: ON, prefs, householdSize: 2, recentDishes: new Set(), seed })!;
      expect(plan.meals.some((x) => DISH_BY_ID[x.dishId].tags.includes("pedas"))).toBe(false);
    }
  });

  it("swaps a meal and honors 'avoid egg'", () => {
    const m = mom({ kind: "tidak" });
    const plan = planDay({ member: m, date: ON, prefs, householdSize: 1, recentDishes: new Set() })!;
    const swapped = swapMeal(plan, "sarapan", m, prefs, 1, { avoidFoods: ["telur"] })!;
    const dish = DISH_BY_ID[swapped.meals.find((x) => x.slot === "sarapan")!.dishId];
    expect(dish.ingredients.some(([f]) => f === "telur")).toBe(false);
  });

  it("builds a shopping list with dry rice instead of cooked rice", () => {
    const plan = planDay({ member: mom({ kind: "tidak" }), date: ON, prefs, householdSize: 1, recentDishes: new Set() })!;
    const { items } = shoppingList([plan]);
    expect(items.some((i) => i.name === "Nasi putih")).toBe(false);
  });
});

describe("WHO growth", () => {
  it("gives z close to 0 at the median", () => {
    expect(Math.abs(zScore("wfa", "P", 12, 8.95)!)).toBeLessThan(0.05);
    expect(Math.abs(zScore("lhfa", "L", 24, 87.8)!)).toBeLessThan(0.05);
  });
  it("flags stunting below -2 SD", () => {
    const z = zScore("lhfa", "P", 24, 79)!;
    expect(z).toBeLessThan(-2);
    expect(classify("lhfa", z).label).toContain("stunting");
  });
});

describe("red flags", () => {
  it("catches warning signs", () => {
    expect(isRedFlag("ada flek darah dari tadi pagi")).toBe(true);
    expect(isRedFlag("gerakan janin berkurang sejak kemarin")).toBe(true);
    expect(isRedFlag("anak saya demam tinggi")).toBe(true);
  });
  it("leaves normal food questions alone", () => {
    expect(isRedFlag("lagi pengen yang pedas siang ini")).toBe(false);
    expect(isRedFlag("anak nolak telur")).toBe(false);
  });
});
