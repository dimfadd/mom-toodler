// Daily targets from AKG 2019 (Permenkes 28/2019). Values in data/akg2019.json were extracted from the
// regulation's tables (via the open TableData-Business-ID-Kemenkes-RDA dataset) and match PMK 28/2019.

import akg from "./data/akg2019.json";
import { addNutrients, NUTRIENT_KEYS, type Member, type Nutrients } from "./types";

const TABLE = akg as Record<string, Nutrients>;

export function ageInMonths(birthDate: string, on: string): number {
  const b = new Date(birthDate + "T00:00:00");
  const d = new Date(on + "T00:00:00");
  let months = (d.getFullYear() - b.getFullYear()) * 12 + (d.getMonth() - b.getMonth());
  if (d.getDate() < b.getDate()) months -= 1;
  return Math.max(0, months);
}

export function pregnancyWeek(dueDate: string, on: string): number {
  const due = new Date(dueDate + "T00:00:00").getTime();
  const d = new Date(on + "T00:00:00").getTime();
  const daysLeft = Math.round((due - d) / 86_400_000);
  return Math.max(1, Math.min(42, 40 - Math.floor(daysLeft / 7)));
}

export function trimester(week: number): 1 | 2 | 3 {
  return week < 14 ? 1 : week < 28 ? 2 : 3;
}

/** Feeding stage for a child. "asi" means exclusive breastfeeding, so no food plan. */
export type ChildStage = "asi" | "mpasi-halus" | "mpasi-tim" | "keluarga";

export function childStage(months: number): ChildStage {
  if (months < 6) return "asi";
  if (months < 9) return "mpasi-halus";
  if (months < 12) return "mpasi-tim";
  return "keluarga";
}

function childGroup(months: number, sex: "L" | "P"): string {
  if (months < 6) return "0to5mo";
  if (months < 12) return "6to11mo";
  if (months < 48) return "1to3y";
  if (months < 84) return "4to6y";
  if (months < 120) return "7to9y";
  return sex === "L" ? "male_10to12y" : "female_10to12y";
}

function motherGroup(years: number): string {
  if (years < 19) return "female_16to18y";
  if (years < 30) return "female_19to29y";
  return "female_30to49y";
}

// Energy expected from complementary food for breastfed children (WHO Guiding Principles for
// Complementary Feeding of the Breastfed Child, 2003): breast milk covers the rest.
function complementaryEnergy(months: number): number {
  if (months < 9) return 200;
  if (months < 12) return 300;
  return 550;
}

export type TargetInfo = {
  targets: Nutrients;
  label: string; // e.g. "Trimester 2" or "18 bulan"
  basis: string; // human-readable explanation of where the numbers come from
  plan: boolean; // false when we deliberately do not plan meals (exclusive breastfeeding, medical flag)
  reason?: "asi" | "medis" | "usia";
};

export function targetsFor(member: Member, on: string): TargetInfo {
  if (member.role === "ibu") {
    const years = Math.floor(ageInMonths(member.birthDate, on) / 12);
    let t = { ...TABLE[motherGroup(years)] };
    let label = "Ibu";
    let basis = "AKG 2019 perempuan sesuai usia";
    if (member.status.kind === "hamil") {
      const w = pregnancyWeek(member.status.dueDate, on);
      const tri = trimester(w);
      t = addNutrients(t, TABLE[`add_pregnant_trimst${tri}`]);
      label = `Hamil ${w} minggu · trimester ${tri}`;
      basis = `AKG 2019 ditambah kebutuhan tambahan trimester ${tri}`;
    } else if (member.status.kind === "menyusui") {
      const babyMonths = ageInMonths(member.status.babyBirthDate, on);
      if (babyMonths < 12) {
        t = addNutrients(t, TABLE[babyMonths < 6 ? "add_breastfeeding_0to6m" : "add_breastfeeding_6to12m"]);
        label = `Menyusui · bayi ${babyMonths} bulan`;
        basis = `AKG 2019 ditambah kebutuhan tambahan menyusui ${babyMonths < 6 ? "6 bulan pertama" : "6 bulan kedua"}`;
      } else {
        label = "Menyusui";
      }
    }
    const medical = member.medical.length > 0;
    return { targets: round(t), label, basis, plan: !medical, reason: medical ? "medis" : undefined };
  }

  const months = ageInMonths(member.birthDate, on);
  const label = months < 24 ? `${months} bulan` : `${Math.floor(months / 12)} tahun`;
  if (member.medical.length > 0) {
    return { targets: round(TABLE[childGroup(months, member.sex)]), label, basis: "", plan: false, reason: "medis" };
  }
  if (months < 6) {
    return { targets: round(TABLE["0to5mo"]), label, basis: "ASI eksklusif sampai 6 bulan", plan: false, reason: "asi" };
  }
  if (months >= 156) {
    return { targets: round(TABLE[childGroup(months, member.sex)]), label, basis: "", plan: false, reason: "usia" };
  }
  const full = TABLE[childGroup(months, member.sex)];
  if (months < 24 && member.breastfed) {
    // Scale everything to the share of energy that should come from food, except iron: breast milk
    // carries little iron, so almost all of it has to come from complementary food.
    const ratio = complementaryEnergy(months) / full.energi;
    const t = {} as Nutrients;
    for (const k of NUTRIENT_KEYS) t[k] = full[k] * ratio;
    t.besi = full.besi;
    return {
      targets: round(t),
      label,
      basis: "Bagian kebutuhan AKG 2019 yang dipenuhi dari MPASI (sisanya dari ASI, mengikuti pedoman WHO)",
      plan: true,
    };
  }
  return { targets: round(full), label, basis: "AKG 2019 sesuai kelompok usia", plan: true };
}

function round(n: Nutrients): Nutrients {
  const out = {} as Nutrients;
  for (const k of NUTRIENT_KEYS) out[k] = Math.round(n[k] * 10) / 10;
  return out;
}
