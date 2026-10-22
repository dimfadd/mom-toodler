export const NUTRIENT_KEYS = ["energi", "protein", "lemak", "karbo", "serat", "kalsium", "besi"] as const;
export type NutrientKey = (typeof NUTRIENT_KEYS)[number];
export type Nutrients = Record<NutrientKey, number>;

export const NUTRIENT_INFO: Record<NutrientKey, { label: string; unit: string }> = {
  energi: { label: "Energi", unit: "kkal" },
  protein: { label: "Protein", unit: "g" },
  lemak: { label: "Lemak", unit: "g" },
  karbo: { label: "Karbohidrat", unit: "g" },
  serat: { label: "Serat", unit: "g" },
  kalsium: { label: "Kalsium", unit: "mg" },
  besi: { label: "Zat besi", unit: "mg" },
};

export function emptyNutrients(): Nutrients {
  return { energi: 0, protein: 0, lemak: 0, karbo: 0, serat: 0, kalsium: 0, besi: 0 };
}

export function addNutrients(a: Nutrients, b: Nutrients, factor = 1): Nutrients {
  const out = { ...a };
  for (const k of NUTRIENT_KEYS) out[k] += b[k] * factor;
  return out;
}

export type Sex = "L" | "P";

export type MotherStatus =
  | { kind: "hamil"; dueDate: string } // ISO date (HPL); trimester is derived from it
  | { kind: "menyusui"; babyBirthDate: string }
  | { kind: "tidak" };

export type MedicalFlag =
  | "diabetes-gestasional"
  | "preeklamsia"
  | "anemia-berat"
  | "alergi-terdiagnosis"
  | "prematur"
  | "gizi-buruk"
  | "penyakit-lain";

export type Member =
  | {
      id: string;
      role: "ibu";
      name: string;
      birthDate: string;
      status: MotherStatus;
      medical: MedicalFlag[];
    }
  | {
      id: string;
      role: "anak";
      name: string;
      birthDate: string;
      sex: Sex;
      breastfed: boolean; // still receiving breast milk (matters for 6 to 23 months)
      medical: MedicalFlag[];
    };

export type Preferences = {
  avoid: string[]; // food ids never to use (allergy, dislike, religion)
  allergens: string[]; // allergen tags to exclude for everyone
  likesSpicy: boolean;
  weeklyBudget: number; // rupiah for the whole household
};

export type Slot = "sarapan" | "camilan-pagi" | "siang" | "camilan-sore" | "malam";
export const SLOT_INFO: Record<Slot, { label: string; time: string }> = {
  sarapan: { label: "Sarapan", time: "07.00" },
  "camilan-pagi": { label: "Camilan pagi", time: "10.00" },
  siang: { label: "Makan siang", time: "12.30" },
  "camilan-sore": { label: "Camilan sore", time: "16.00" },
  malam: { label: "Makan malam", time: "19.00" },
};

export type PlannedMeal = { slot: Slot; dishId: string; portion: number };
export type DayPlan = { date: string; memberId: string; meals: PlannedMeal[] };

export type MealLog = "habis" | "sebagian" | "tidak";
export const LOG_FACTOR: Record<MealLog, number> = { habis: 1, sebagian: 0.5, tidak: 0 };
