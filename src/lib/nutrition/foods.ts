// Food composition per 100 g edible portion.
//
// STATUS: DRAFT. Values follow Tabel Komposisi Pangan Indonesia (TKPI) 2017 where known; items marked
// source "USDA" use USDA FoodData Central because they are missing from TKPI or could not be checked.
// TKPI could not be downloaded while building this file, so every row is `verified: false` until a
// nutritionist checks it against the official table. Replace numbers here; nothing else needs to change.
//
// Prices are rough Jakarta market estimates in rupiah per kg (or per liter), used only for budget hints.

import type { Nutrients } from "./types";

export type FoodCategory = "pokok" | "lauk-hewani" | "lauk-nabati" | "sayur" | "buah" | "susu" | "lainnya";
export type Allergen = "telur" | "susu" | "ikan" | "seafood" | "kedelai" | "kacang" | "gluten";

export type Food = {
  id: string;
  name: string;
  category: FoodCategory;
  per100g: Nutrients;
  allergens?: Allergen[];
  pricePerKg: number;
  source: "TKPI" | "USDA";
  verified: boolean;
};

type Row = [id: string, name: string, category: FoodCategory, e: number, p: number, l: number, k: number, s: number, ca: number, fe: number, price: number, allergens?: Allergen[], source?: "TKPI" | "USDA"];

const rows: Row[] = [
  // Pokok
  ["nasi", "Nasi putih", "pokok", 180, 3.0, 0.3, 39.8, 0.2, 25, 0.4, 15000],
  ["nasi-merah", "Nasi beras merah", "pokok", 149, 2.8, 0.4, 32.5, 0.3, 6, 0.8, 25000],
  ["kentang", "Kentang", "pokok", 62, 2.1, 0.2, 13.5, 0.5, 63, 0.7, 20000],
  ["ubi-jalar", "Ubi jalar kuning", "pokok", 119, 0.5, 0.4, 28.5, 2.5, 47, 0.8, 15000],
  ["roti-tawar", "Roti tawar", "pokok", 248, 8.0, 1.2, 50.0, 2.4, 10, 1.5, 45000, ["gluten"]],
  ["oat", "Oat (havermut)", "pokok", 389, 16.9, 6.9, 66.3, 10.6, 54, 4.7, 60000, ["gluten"], "USDA"],
  ["makaroni", "Makaroni (matang)", "pokok", 158, 5.8, 0.9, 30.9, 1.8, 7, 0.5, 30000, ["gluten"], "USDA"],
  ["jagung", "Jagung manis", "pokok", 86, 3.3, 1.4, 19.0, 2.0, 2, 0.5, 12000, undefined, "USDA"],
  // Lauk hewani
  ["telur", "Telur ayam", "lauk-hewani", 154, 12.4, 10.8, 0.7, 0, 86, 3.0, 30000, ["telur"]],
  ["ayam", "Daging ayam", "lauk-hewani", 298, 18.2, 25.0, 0, 0, 14, 1.5, 40000],
  ["ayam-fillet", "Ayam fillet dada", "lauk-hewani", 120, 22.5, 2.6, 0, 0, 5, 0.4, 55000, undefined, "USDA"],
  ["daging-sapi", "Daging sapi", "lauk-hewani", 201, 18.8, 14.0, 0, 0, 11, 2.8, 140000],
  ["hati-ayam", "Hati ayam", "lauk-hewani", 261, 27.4, 16.1, 1.6, 0, 118, 15.8, 30000],
  ["ikan-kembung", "Ikan kembung", "lauk-hewani", 112, 21.3, 3.4, 2.2, 0, 136, 1.5, 50000, ["ikan"]],
  ["ikan-lele", "Ikan lele", "lauk-hewani", 84, 14.8, 2.3, 0, 0, 15, 1.6, 30000, ["ikan"]],
  ["ikan-nila", "Ikan nila", "lauk-hewani", 89, 18.7, 1.0, 0, 0, 96, 1.5, 38000, ["ikan"]],
  ["salmon", "Ikan salmon", "lauk-hewani", 208, 20.4, 13.4, 0, 0, 9, 0.3, 280000, ["ikan"], "USDA"],
  ["udang", "Udang", "lauk-hewani", 91, 21.0, 0.2, 0.1, 0, 136, 8.0, 90000, ["seafood"]],
  // Lauk nabati
  ["tempe", "Tempe", "lauk-nabati", 201, 20.8, 8.8, 13.5, 1.4, 155, 4.0, 20000, ["kedelai"]],
  ["tahu", "Tahu", "lauk-nabati", 80, 10.9, 4.7, 0.8, 0.1, 223, 3.4, 15000, ["kedelai"]],
  ["kacang-hijau", "Kacang hijau", "lauk-nabati", 323, 22.9, 1.5, 56.8, 7.5, 223, 7.5, 30000],
  ["kacang-merah", "Kacang merah", "lauk-nabati", 314, 22.1, 1.1, 56.2, 4.0, 502, 10.3, 40000],
  // Sayur
  ["bayam", "Bayam", "sayur", 16, 0.9, 0.4, 2.9, 0.7, 166, 3.5, 15000],
  ["kangkung", "Kangkung", "sayur", 28, 3.4, 0.7, 3.9, 2.0, 67, 2.3, 12000],
  ["daun-kelor", "Daun kelor", "sayur", 92, 5.1, 1.6, 14.3, 8.2, 1077, 6.0, 20000],
  ["wortel", "Wortel", "sayur", 36, 1.0, 0.6, 7.9, 1.0, 45, 1.0, 15000],
  ["brokoli", "Brokoli", "sayur", 34, 2.8, 0.4, 6.6, 2.6, 47, 0.7, 40000, undefined, "USDA"],
  ["buncis", "Buncis", "sayur", 35, 2.4, 0.3, 7.7, 3.2, 65, 1.1, 20000],
  ["labu-siam", "Labu siam", "sayur", 30, 0.6, 0.1, 6.7, 1.2, 14, 0.5, 10000],
  ["labu-kuning", "Labu kuning", "sayur", 26, 1.0, 0.1, 6.5, 0.5, 21, 0.8, 12000, undefined, "USDA"],
  ["tomat", "Tomat", "sayur", 18, 0.9, 0.2, 3.9, 1.2, 10, 0.3, 15000, undefined, "USDA"],
  ["sawi", "Sawi hijau", "sayur", 28, 2.3, 0.3, 4.0, 2.5, 220, 2.9, 12000],
  ["kacang-panjang", "Kacang panjang", "sayur", 30, 2.7, 0.3, 5.3, 3.2, 49, 0.7, 15000],
  // Buah
  ["pisang", "Pisang ambon", "buah", 108, 1.0, 0.8, 24.3, 1.9, 20, 0.2, 20000],
  ["pepaya", "Pepaya", "buah", 46, 0.5, 0, 12.2, 1.6, 23, 1.7, 12000],
  ["jeruk", "Jeruk manis", "buah", 45, 0.9, 0.2, 11.2, 1.4, 33, 0.4, 30000],
  ["alpukat", "Alpukat", "buah", 85, 0.9, 6.5, 7.7, 1.4, 10, 0.9, 35000],
  ["apel", "Apel", "buah", 52, 0.3, 0.2, 13.8, 2.4, 6, 0.1, 40000, undefined, "USDA"],
  // Susu dan olahan
  ["susu", "Susu sapi segar", "susu", 61, 3.2, 3.5, 4.3, 0, 143, 1.7, 20000, ["susu"]],
  ["yogurt", "Yogurt tawar", "susu", 52, 3.3, 2.5, 4.0, 0, 120, 0.1, 50000, ["susu"]],
  ["keju", "Keju", "susu", 326, 22.8, 20.3, 13.1, 0, 777, 1.5, 120000, ["susu"]],
  // Lainnya
  ["minyak", "Minyak goreng", "lainnya", 884, 0, 100, 0, 0, 0, 0, 18000],
  ["santan", "Santan", "lainnya", 122, 2.0, 10.0, 7.6, 0, 14, 1.9, 40000],
];

export const FOODS: Record<string, Food> = Object.fromEntries(
  rows.map(([id, name, category, e, p, l, k, s, ca, fe, price, allergens, source]) => [
    id,
    {
      id,
      name,
      category,
      per100g: { energi: e, protein: p, lemak: l, karbo: k, serat: s, kalsium: ca, besi: fe },
      allergens,
      pricePerKg: price,
      source: source ?? "TKPI",
      verified: false,
    },
  ]),
);

export const DATA_VERIFIED = Object.values(FOODS).every((f) => f.verified);
