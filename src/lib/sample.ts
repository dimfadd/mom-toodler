// The example family used by the landing page demo and by "try with the example family" in the app.

import type { MealLog, Member, Preferences, Slot } from "./nutrition/types";

type Measurement = { date: string; weightKg?: number; lengthCm?: number };

function shift(iso: string, days: number): string {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export const SAMPLE_IDS = { mother: "contoh-ibu", child: "contoh-anak" } as const;

/** Rina, 24 weeks pregnant, and Kakak, a girl of about 2 years 3 months. Dates are relative to `on`. */
export function sampleHousehold(on: string): {
  members: Member[];
  prefs: Preferences;
  measurements: Record<string, Measurement[]>;
  logs: Record<string, Partial<Record<Slot, MealLog>>>;
} {
  const year = Number(on.slice(0, 4));
  const members: Member[] = [
    { id: SAMPLE_IDS.mother, role: "ibu", name: "Rina", birthDate: `${year - 30}-01-01`, status: { kind: "hamil", dueDate: shift(on, 16 * 7) }, medical: [] },
    { id: SAMPLE_IDS.child, role: "anak", name: "Kakak", birthDate: shift(on, -822), sex: "P", breastfed: false, medical: [] },
  ];
  // Plausible measurements for a girl growing along the WHO median.
  const measurements = {
    [SAMPLE_IDS.child]: [
      { date: shift(on, -183), weightKg: 10.9, lengthCm: 83.5 },
      { date: shift(on, -92), weightKg: 11.4, lengthCm: 85.8 },
      { date: shift(on, -2), weightKg: 11.9, lengthCm: 88.1 },
    ],
  };
  const logs = {
    [SAMPLE_IDS.mother]: { sarapan: "habis", "camilan-pagi": "habis" } as Partial<Record<Slot, MealLog>>,
    [SAMPLE_IDS.child]: { sarapan: "sebagian" } as Partial<Record<Slot, MealLog>>,
  };
  return { members, prefs: { avoid: [], allergens: [], likesSpicy: true, weeklyBudget: 1_000_000 }, measurements, logs };
}
