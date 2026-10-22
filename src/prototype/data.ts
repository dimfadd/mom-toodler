// Sample data for the clickable prototype. None of this is real user data or a nutrition calculation:
// the real app computes targets from AKG 2019 and ingredient values from TKPI.

export type NutrientKey = "energi" | "protein" | "besi" | "folat" | "kalsium";
export type MealStatus = "habis" | "sebagian" | "tidak" | null;

export type Meal = {
  id: string;
  label: string;
  time: string;
  options: string[]; // first is the planned menu, the rest are swaps that keep the same targets
  // Share of the daily target this meal covers, in percent, per nutrient.
  covers: Partial<Record<NutrientKey, number>>;
  status: MealStatus;
};

export type Profile = {
  id: "ibu" | "anak";
  name: string;
  stage: string;
  nutrients: { key: NutrientKey; label: string }[];
  meals: Meal[];
};

export const NUTRIENT_LABELS: Record<NutrientKey, string> = {
  energi: "Energi",
  protein: "Protein",
  besi: "Zat besi",
  folat: "Folat",
  kalsium: "Kalsium",
};

export const profiles: Profile[] = [
  {
    id: "ibu",
    name: "Ibu",
    stage: "Trimester 2",
    nutrients: ["energi", "protein", "besi", "folat", "kalsium"].map((key) => ({
      key: key as NutrientKey,
      label: NUTRIENT_LABELS[key as NutrientKey],
    })),
    meals: [
      {
        id: "sarapan",
        label: "Sarapan",
        time: "07.00",
        options: ["Nasi uduk, telur dadar, tumis buncis"],
        covers: { energi: 25, protein: 22, besi: 15, folat: 20, kalsium: 15 },
        status: "habis",
      },
      {
        id: "camilan-pagi",
        label: "Camilan pagi",
        time: "10.00",
        options: ["Pisang dan yogurt"],
        covers: { energi: 10, protein: 10, besi: 5, folat: 10, kalsium: 25 },
        status: "sebagian",
      },
      {
        id: "siang",
        label: "Makan siang",
        time: "12.30",
        options: [
          "Pepes ikan kembung kemangi, nasi merah, tumis kangkung",
          "Ayam woku kemangi, nasi, tumis buncis wortel",
          "Tahu tempe bacem, sayur asem, nasi, pepaya",
        ],
        covers: { energi: 30, protein: 30, besi: 25, folat: 30, kalsium: 20 },
        status: null,
      },
      {
        id: "camilan-sore",
        label: "Camilan sore",
        time: "16.00",
        options: ["Bubur kacang hijau", "Jagung rebus dan susu"],
        covers: { energi: 10, protein: 10, besi: 15, folat: 15, kalsium: 10 },
        status: null,
      },
      {
        id: "malam",
        label: "Makan malam",
        time: "19.00",
        options: ["Semur daging sapi, sayur bayam jagung, nasi", "Ikan bakar, capcay, nasi"],
        covers: { energi: 28, protein: 30, besi: 42, folat: 28, kalsium: 30 },
        status: null,
      },
    ],
  },
  {
    id: "anak",
    name: "Kakak",
    stage: "18 bulan",
    nutrients: ["energi", "protein", "besi", "kalsium"].map((key) => ({
      key: key as NutrientKey,
      label: NUTRIENT_LABELS[key as NutrientKey],
    })),
    meals: [
      {
        id: "sarapan",
        label: "Sarapan",
        time: "07.00",
        options: ["Bubur ayam suwir dan tahu (telur ditolak, dicoba lagi besok)"],
        covers: { energi: 25, protein: 28, besi: 20, kalsium: 15 },
        status: "habis",
      },
      {
        id: "camilan-pagi",
        label: "Camilan pagi",
        time: "09.30",
        options: ["Pisang kukus"],
        covers: { energi: 10, protein: 4, besi: 5, kalsium: 5 },
        status: "habis",
      },
      {
        id: "siang",
        label: "Makan siang",
        time: "12.00",
        options: ["Nasi tim ikan, brokoli, wortel", "Nasi lembek, hati ayam, labu siam", "Makaroni daging cincang, bayam"],
        covers: { energi: 30, protein: 32, besi: 35, kalsium: 20 },
        status: null,
      },
      {
        id: "camilan-sore",
        label: "Camilan sore",
        time: "15.30",
        options: ["Puding susu", "Keju dan biskuit bayi"],
        covers: { energi: 10, protein: 8, besi: 5, kalsium: 35 },
        status: null,
      },
      {
        id: "malam",
        label: "Makan malam",
        time: "18.00",
        options: ["Nasi lembek, sup daging, wortel", "Nasi tim ayam, tempe, buncis"],
        covers: { energi: 27, protein: 30, besi: 37, kalsium: 25 },
        status: null,
      },
    ],
  },
];

// Overall share of the daily target reached, last 7 days (today is partial).
export const weekly = [
  { day: "Kam", value: 96 },
  { day: "Jum", value: 88 },
  { day: "Sab", value: 102 },
  { day: "Min", value: 74 },
  { day: "Sen", value: 91 },
  { day: "Sel", value: 99 },
  { day: "Hari ini", value: 0 }, // filled live from today's log
];

export const insights: Record<Profile["id"], { tone: "ok" | "warn"; title: string; body: string }[]> = {
  ibu: [
    { tone: "warn", title: "Zat besi kurang di 4 dari 7 hari", body: "Makan malam minggu ini sudah ditambah daging sapi dan bayam." },
    { tone: "ok", title: "Protein tercapai 6 dari 7 hari", body: "Pertahankan lauk hewani di makan siang." },
    { tone: "ok", title: "Folat tercapai 5 dari 7 hari", body: "Sayur hijau sudah masuk di hampir semua makan siang." },
  ],
  anak: [
    { tone: "warn", title: "Kalsium kurang di 3 dari 7 hari", body: "Camilan sore diganti produk susu dua hari sekali." },
    { tone: "ok", title: "Protein tercapai 6 dari 7 hari", body: "Ikan dan tahu paling sering habis." },
  ],
};

// Weight-for-age, girls 0 to 24 months. ILLUSTRATIVE values close to the WHO curves;
// the real app must load the official WHO tables.
export const growth = {
  months: [0, 3, 6, 9, 12, 15, 18, 21, 24],
  low: [2.4, 4.5, 5.7, 6.5, 7.0, 7.6, 8.1, 8.6, 9.0],
  median: [3.2, 5.8, 7.3, 8.2, 8.9, 9.6, 10.2, 10.9, 11.5],
  high: [4.2, 7.5, 9.3, 10.5, 11.5, 12.4, 13.2, 14.0, 14.8],
  child: [3.0, 5.6, 7.0, 7.9, 8.6, 9.2, 9.7],
};

export const acceptance = [
  { food: "Ikan", tries: 7, accepted: 6, note: "Sudah suka" },
  { food: "Telur", tries: 5, accepted: 2, note: "Mulai mau dalam bentuk dadar" },
  { food: "Brokoli", tries: 3, accepted: 0, note: "Masih menolak, coba lagi dalam sup" },
];

export const FOOD_GROUPS = [
  { name: "Makanan pokok", eaten: true },
  { name: "Kacang-kacangan", eaten: true },
  { name: "Susu dan olahannya", eaten: false },
  { name: "Daging, ikan, unggas", eaten: true },
  { name: "Telur", eaten: false },
  { name: "Buah dan sayur kaya vitamin A", eaten: true },
  { name: "Buah dan sayur lain", eaten: false },
  { name: "ASI", eaten: false },
];

export const shopping = [
  { group: "Lauk", items: ["Ikan kembung 500 g", "Daging sapi 300 g", "Ayam fillet 500 g", "Tahu 1 papan", "Tempe 1 papan"] },
  { group: "Sayur dan buah", items: ["Bayam 2 ikat", "Kangkung 1 ikat", "Brokoli 1 bonggol", "Wortel 500 g", "Pisang 1 sisir", "Pepaya 1/2 buah"] },
  { group: "Bahan pokok", items: ["Beras merah 1 kg", "Kacang hijau 250 g", "Yogurt tawar 500 ml"] },
];
