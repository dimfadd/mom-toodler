// WHO Child Growth Standards (2006), 0 to 60 months, computed with the LMS method.
// Tables in data/who-growth-0-5.json come from the WHO standard (bundled in the open pygrowup package).

import who from "./data/who-growth-0-5.json";
import type { Sex } from "./types";

type Row = [month: number, L: number, M: number, S: number];
const TABLES = who as unknown as Record<string, Row[]>;

export type Indicator = "wfa" | "lhfa"; // weight-for-age, length/height-for-age

function row(indicator: Indicator, sex: Sex, month: number): Row | null {
  const table = TABLES[`${indicator}_${sex === "L" ? "boys" : "girls"}`];
  if (!table || month < 0 || month > 60) return null;
  return table[Math.round(month)] ?? null;
}

function valueAt([, L, M, S]: Row, z: number): number {
  return L === 0 ? M * Math.exp(S * z) : M * Math.pow(1 + L * S * z, 1 / L);
}

export function zScore(indicator: Indicator, sex: Sex, month: number, value: number): number | null {
  const r = row(indicator, sex, month);
  if (!r || value <= 0) return null;
  const [, L, M, S] = r;
  let z = L === 0 ? Math.log(value / M) / S : (Math.pow(value / M, L) - 1) / (L * S);
  // WHO adjustment for weight beyond +/-3 SD (the distribution is skewed there)
  if (indicator === "wfa" && Math.abs(z) > 3) {
    const sd3 = valueAt(r, 3 * Math.sign(z));
    const sd23 = sd3 - valueAt(r, 2 * Math.sign(z));
    z = 3 * Math.sign(z) + (value - sd3) / Math.abs(sd23);
  }
  return Math.round(z * 100) / 100;
}

/** Points for drawing the -2 SD, median and +2 SD curves. */
export function curve(indicator: Indicator, sex: Sex, fromMonth: number, toMonth: number) {
  const out: { month: number; low: number; median: number; high: number }[] = [];
  for (let m = Math.max(0, Math.floor(fromMonth)); m <= Math.min(60, Math.ceil(toMonth)); m++) {
    const r = row(indicator, sex, m);
    if (r) out.push({ month: m, low: valueAt(r, -2), median: valueAt(r, 0), high: valueAt(r, 2) });
  }
  return out;
}

export type Status = { label: string; tone: "ok" | "warn" | "danger" };

// Categories follow WHO and Permenkes 2/2020 on child anthropometry.
export function classify(indicator: Indicator, z: number): Status {
  if (indicator === "lhfa") {
    if (z < -3) return { label: "Sangat pendek (stunting berat)", tone: "danger" };
    if (z < -2) return { label: "Pendek (stunting)", tone: "danger" };
    if (z > 3) return { label: "Tinggi", tone: "ok" };
    return { label: "Normal", tone: "ok" };
  }
  if (z < -3) return { label: "Berat badan sangat kurang", tone: "danger" };
  if (z < -2) return { label: "Berat badan kurang", tone: "danger" };
  if (z > 1) return { label: "Risiko berat badan lebih, cek dengan dokter", tone: "warn" };
  return { label: "Normal", tone: "ok" };
}
