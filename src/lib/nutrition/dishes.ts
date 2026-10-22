// Dish library. Ingredient grams are for one standard portion (adult for family dishes, about a
// 9-month-old for MPASI dishes). The planner scales portions per family member, so these are
// proportions more than fixed amounts. Like foods.ts, this list needs a nutritionist's review.

export type DishKind = "utama" | "sarapan" | "camilan";
export type Stage = "keluarga" | "mpasi-halus" | "mpasi-tim";
export type DishTag = "pedas" | "berkuah" | "manis" | "gurih" | "goreng" | "segar";

export type Dish = {
  id: string;
  name: string;
  kind: DishKind[];
  stage: Stage;
  ingredients: [foodId: string, grams: number][];
  tags: DishTag[];
  mainProtein?: string; // food id, used for variety and the "food being introduced" tracker
  childOk?: boolean; // family dish suitable for children 12 months and up
  avoidInPregnancy?: boolean; // e.g. liver, because of its very high vitamin A content
};

export const DISHES: Dish[] = [
  // ---------- Family: breakfast ----------
  { id: "nasi-uduk-telur", name: "Nasi uduk, telur dadar, tumis buncis", kind: ["sarapan"], stage: "keluarga", ingredients: [["nasi", 150], ["santan", 20], ["telur", 55], ["buncis", 50], ["minyak", 8]], tags: ["gurih"], mainProtein: "telur", childOk: true },
  { id: "bubur-ayam", name: "Bubur ayam suwir", kind: ["sarapan"], stage: "keluarga", ingredients: [["nasi", 200], ["ayam", 50], ["wortel", 20], ["minyak", 3]], tags: ["gurih", "berkuah"], mainProtein: "ayam", childOk: true },
  { id: "oat-susu-pisang", name: "Oat susu dengan pisang", kind: ["sarapan"], stage: "keluarga", ingredients: [["oat", 40], ["susu", 200], ["pisang", 60]], tags: ["manis"], mainProtein: "susu", childOk: true },
  { id: "roti-telur-alpukat", name: "Roti, telur orak-arik, alpukat", kind: ["sarapan"], stage: "keluarga", ingredients: [["roti-tawar", 60], ["telur", 55], ["alpukat", 50], ["minyak", 3]], tags: ["gurih"], mainProtein: "telur", childOk: true },
  { id: "nasi-goreng-sayur", name: "Nasi goreng telur sayur", kind: ["sarapan"], stage: "keluarga", ingredients: [["nasi", 150], ["telur", 55], ["wortel", 30], ["sawi", 30], ["minyak", 10]], tags: ["gurih", "goreng"], mainProtein: "telur", childOk: true },
  { id: "ubi-telur-susu", name: "Ubi kukus, telur rebus, segelas susu", kind: ["sarapan"], stage: "keluarga", ingredients: [["ubi-jalar", 150], ["telur", 55], ["susu", 200]], tags: ["manis"], mainProtein: "telur", childOk: true },
  { id: "nasi-tempe-bayam", name: "Nasi, tempe orek, sayur bening bayam", kind: ["sarapan", "utama"], stage: "keluarga", ingredients: [["nasi", 150], ["tempe", 50], ["bayam", 60], ["jagung", 20], ["minyak", 7]], tags: ["gurih", "berkuah"], mainProtein: "tempe", childOk: true },

  // ---------- Family: snacks ----------
  { id: "pisang-yogurt", name: "Pisang dan yogurt tawar", kind: ["camilan"], stage: "keluarga", ingredients: [["pisang", 100], ["yogurt", 100]], tags: ["manis", "segar"], mainProtein: "yogurt", childOk: true },
  { id: "bubur-kacang-hijau", name: "Bubur kacang hijau", kind: ["camilan"], stage: "keluarga", ingredients: [["kacang-hijau", 30], ["santan", 30]], tags: ["manis", "berkuah"], mainProtein: "kacang-hijau", childOk: true },
  { id: "pepaya-potong", name: "Pepaya potong", kind: ["camilan"], stage: "keluarga", ingredients: [["pepaya", 150]], tags: ["segar", "manis"], childOk: true },
  { id: "jagung-susu", name: "Jagung rebus dan susu", kind: ["camilan"], stage: "keluarga", ingredients: [["jagung", 100], ["susu", 200]], tags: ["manis"], mainProtein: "susu", childOk: true },
  { id: "alpukat-susu", name: "Alpukat kerok dengan susu", kind: ["camilan"], stage: "keluarga", ingredients: [["alpukat", 100], ["susu", 60]], tags: ["manis", "segar"], childOk: true },
  { id: "tahu-kukus-ayam", name: "Tahu kukus isi ayam", kind: ["camilan"], stage: "keluarga", ingredients: [["tahu", 75], ["ayam-fillet", 25]], tags: ["gurih"], mainProtein: "tahu", childOk: true },
  { id: "puding-susu", name: "Puding susu", kind: ["camilan"], stage: "keluarga", ingredients: [["susu", 150]], tags: ["manis"], mainProtein: "susu", childOk: true },
  { id: "kentang-keju", name: "Kentang kukus keju", kind: ["camilan"], stage: "keluarga", ingredients: [["kentang", 100], ["keju", 15]], tags: ["gurih"], mainProtein: "keju", childOk: true },
  { id: "apel-keju", name: "Apel dan keju", kind: ["camilan"], stage: "keluarga", ingredients: [["apel", 120], ["keju", 20]], tags: ["segar"], mainProtein: "keju", childOk: true },
  { id: "jeruk", name: "Jeruk manis", kind: ["camilan"], stage: "keluarga", ingredients: [["jeruk", 150]], tags: ["segar", "manis"], childOk: true },

  // ---------- Family: lunch and dinner ----------
  { id: "pepes-kembung", name: "Pepes ikan kembung kemangi, nasi merah, tumis kangkung", kind: ["utama"], stage: "keluarga", ingredients: [["nasi-merah", 150], ["ikan-kembung", 80], ["kangkung", 75], ["minyak", 5]], tags: ["gurih"], mainProtein: "ikan-kembung", childOk: true },
  { id: "ayam-woku", name: "Ayam woku kemangi, nasi, tumis buncis wortel", kind: ["utama"], stage: "keluarga", ingredients: [["nasi", 150], ["ayam", 80], ["buncis", 50], ["wortel", 30], ["minyak", 7]], tags: ["pedas", "gurih"], mainProtein: "ayam" },
  { id: "semur-daging", name: "Semur daging sapi, sayur bayam jagung, nasi", kind: ["utama"], stage: "keluarga", ingredients: [["nasi", 150], ["daging-sapi", 70], ["bayam", 60], ["jagung", 30], ["minyak", 5]], tags: ["manis", "gurih"], mainProtein: "daging-sapi", childOk: true },
  { id: "ikan-bakar-capcay", name: "Ikan nila bakar, capcay, nasi", kind: ["utama"], stage: "keluarga", ingredients: [["nasi", 150], ["ikan-nila", 100], ["brokoli", 40], ["wortel", 30], ["sawi", 30], ["minyak", 7]], tags: ["gurih"], mainProtein: "ikan-nila", childOk: true },
  { id: "bacem-sayur-asem", name: "Tahu tempe bacem, sayur asem, nasi", kind: ["utama"], stage: "keluarga", ingredients: [["nasi", 150], ["tempe", 50], ["tahu", 50], ["kacang-panjang", 40], ["labu-siam", 40], ["jagung", 20]], tags: ["manis", "berkuah"], mainProtein: "tempe", childOk: true },
  { id: "soto-ayam", name: "Soto ayam, nasi", kind: ["utama"], stage: "keluarga", ingredients: [["nasi", 150], ["ayam", 60], ["kentang", 40], ["wortel", 20], ["minyak", 5]], tags: ["gurih", "berkuah"], mainProtein: "ayam", childOk: true },
  { id: "sup-daging", name: "Sup daging sayur, nasi", kind: ["utama"], stage: "keluarga", ingredients: [["nasi", 150], ["daging-sapi", 60], ["kentang", 60], ["wortel", 40], ["buncis", 30]], tags: ["gurih", "berkuah"], mainProtein: "daging-sapi", childOk: true },
  { id: "pecel-lele", name: "Pecel lele, lalapan, nasi", kind: ["utama"], stage: "keluarga", ingredients: [["nasi", 150], ["ikan-lele", 100], ["minyak", 15], ["tomat", 30], ["kangkung", 40]], tags: ["pedas", "goreng"], mainProtein: "ikan-lele" },
  { id: "udang-tomat", name: "Udang saus tomat, brokoli, nasi", kind: ["utama"], stage: "keluarga", ingredients: [["nasi", 150], ["udang", 80], ["tomat", 50], ["brokoli", 50], ["minyak", 7]], tags: ["gurih"], mainProtein: "udang", childOk: true },
  { id: "rendang-kelor", name: "Rendang daging, tumis daun kelor, nasi", kind: ["utama"], stage: "keluarga", ingredients: [["nasi", 150], ["daging-sapi", 70], ["santan", 40], ["daun-kelor", 40]], tags: ["pedas", "gurih"], mainProtein: "daging-sapi" },
  { id: "ayam-bakar-sop", name: "Ayam bakar, sayur sop, nasi", kind: ["utama"], stage: "keluarga", ingredients: [["nasi", 150], ["ayam", 80], ["wortel", 30], ["kentang", 40], ["buncis", 30]], tags: ["gurih", "berkuah"], mainProtein: "ayam", childOk: true },
  { id: "salmon-kentang", name: "Salmon panggang, kentang, brokoli", kind: ["utama"], stage: "keluarga", ingredients: [["kentang", 150], ["salmon", 80], ["brokoli", 60], ["minyak", 5]], tags: ["gurih"], mainProtein: "salmon", childOk: true },
  { id: "lodeh-tempe", name: "Sayur lodeh tempe, nasi", kind: ["utama"], stage: "keluarga", ingredients: [["nasi", 150], ["tempe", 50], ["labu-siam", 50], ["kacang-panjang", 30], ["santan", 40]], tags: ["gurih", "berkuah"], mainProtein: "tempe", childOk: true },
  { id: "kembung-kelor", name: "Ikan kembung goreng, tumis kelor tahu, nasi", kind: ["utama"], stage: "keluarga", ingredients: [["nasi", 150], ["ikan-kembung", 70], ["daun-kelor", 40], ["tahu", 40], ["minyak", 10]], tags: ["gurih", "goreng"], mainProtein: "ikan-kembung", childOk: true },
  { id: "sup-kacang-merah", name: "Sup kacang merah daging, nasi", kind: ["utama"], stage: "keluarga", ingredients: [["nasi", 150], ["daging-sapi", 40], ["kacang-merah", 30], ["wortel", 30], ["kentang", 40]], tags: ["gurih", "berkuah"], mainProtein: "daging-sapi", childOk: true },
  { id: "telur-balado", name: "Telur balado, tumis sawi, nasi", kind: ["utama"], stage: "keluarga", ingredients: [["nasi", 150], ["telur", 60], ["sawi", 70], ["tomat", 30], ["minyak", 10]], tags: ["pedas", "gurih"], mainProtein: "telur" },
  { id: "ayam-teriyaki", name: "Ayam fillet teriyaki, brokoli, nasi", kind: ["utama"], stage: "keluarga", ingredients: [["nasi", 150], ["ayam-fillet", 90], ["brokoli", 60], ["minyak", 5]], tags: ["manis", "gurih"], mainProtein: "ayam-fillet", childOk: true },
  { id: "makaroni-daging", name: "Makaroni daging cincang dan bayam", kind: ["utama"], stage: "keluarga", ingredients: [["makaroni", 150], ["daging-sapi", 50], ["bayam", 50], ["keju", 10]], tags: ["gurih"], mainProtein: "daging-sapi", childOk: true },
  { id: "hati-kecap", name: "Hati ayam masak kecap, tumis buncis, nasi", kind: ["utama"], stage: "keluarga", ingredients: [["nasi", 150], ["hati-ayam", 50], ["buncis", 60], ["minyak", 7]], tags: ["manis", "gurih"], mainProtein: "hati-ayam", childOk: true, avoidInPregnancy: true },

  // ---------- MPASI 6 to 8 months: smooth texture ----------
  { id: "saring-ayam-wortel", name: "Bubur saring ayam wortel", kind: ["utama"], stage: "mpasi-halus", ingredients: [["nasi", 50], ["ayam-fillet", 15], ["wortel", 15], ["minyak", 2]], tags: ["gurih"], mainProtein: "ayam-fillet" },
  { id: "saring-hati-bayam", name: "Bubur saring hati ayam bayam", kind: ["utama"], stage: "mpasi-halus", ingredients: [["nasi", 50], ["hati-ayam", 15], ["bayam", 15], ["minyak", 2]], tags: ["gurih"], mainProtein: "hati-ayam" },
  { id: "saring-kembung-labu", name: "Bubur saring ikan kembung labu kuning", kind: ["utama"], stage: "mpasi-halus", ingredients: [["nasi", 50], ["ikan-kembung", 15], ["labu-kuning", 20], ["minyak", 2]], tags: ["gurih"], mainProtein: "ikan-kembung" },
  { id: "saring-daging-kentang", name: "Bubur saring daging sapi kentang", kind: ["utama"], stage: "mpasi-halus", ingredients: [["nasi", 30], ["kentang", 40], ["daging-sapi", 15], ["minyak", 2]], tags: ["gurih"], mainProtein: "daging-sapi" },
  { id: "saring-tempe-bayam", name: "Bubur saring tempe bayam", kind: ["utama"], stage: "mpasi-halus", ingredients: [["nasi", 50], ["tempe", 15], ["bayam", 15], ["minyak", 2]], tags: ["gurih"], mainProtein: "tempe" },
  { id: "puree-pisang", name: "Puree pisang", kind: ["camilan"], stage: "mpasi-halus", ingredients: [["pisang", 50]], tags: ["manis"] },
  { id: "puree-alpukat", name: "Puree alpukat", kind: ["camilan"], stage: "mpasi-halus", ingredients: [["alpukat", 40]], tags: ["segar"] },
  { id: "puree-pepaya", name: "Puree pepaya", kind: ["camilan"], stage: "mpasi-halus", ingredients: [["pepaya", 50]], tags: ["manis"] },
  { id: "puree-labu", name: "Puree labu kuning", kind: ["camilan"], stage: "mpasi-halus", ingredients: [["labu-kuning", 50]], tags: ["manis"] },

  // ---------- MPASI 9 to 11 months: minced and soft ----------
  { id: "tim-ayam-wortel", name: "Nasi tim ayam wortel", kind: ["utama"], stage: "mpasi-tim", ingredients: [["nasi", 70], ["ayam", 20], ["wortel", 20], ["minyak", 3]], tags: ["gurih"], mainProtein: "ayam" },
  { id: "tim-telur-brokoli", name: "Nasi tim telur brokoli", kind: ["utama"], stage: "mpasi-tim", ingredients: [["nasi", 70], ["telur", 30], ["brokoli", 20], ["minyak", 2]], tags: ["gurih"], mainProtein: "telur" },
  { id: "tim-nila-buncis", name: "Nasi tim ikan nila buncis", kind: ["utama"], stage: "mpasi-tim", ingredients: [["nasi", 70], ["ikan-nila", 25], ["buncis", 20], ["minyak", 3]], tags: ["gurih"], mainProtein: "ikan-nila" },
  { id: "tim-daging-kentang", name: "Nasi tim daging kentang", kind: ["utama"], stage: "mpasi-tim", ingredients: [["nasi", 50], ["kentang", 30], ["daging-sapi", 20], ["minyak", 3]], tags: ["gurih"], mainProtein: "daging-sapi" },
  { id: "tim-hati-sawi", name: "Nasi tim hati ayam sawi", kind: ["utama"], stage: "mpasi-tim", ingredients: [["nasi", 70], ["hati-ayam", 15], ["sawi", 20], ["minyak", 3]], tags: ["gurih"], mainProtein: "hati-ayam" },
  { id: "tim-tahu-tempe", name: "Nasi tim tahu tempe bayam", kind: ["utama"], stage: "mpasi-tim", ingredients: [["nasi", 70], ["tahu", 20], ["tempe", 15], ["bayam", 20], ["minyak", 3]], tags: ["gurih"], mainProtein: "tempe" },
  { id: "pisang-kukus", name: "Pisang kukus potong", kind: ["camilan"], stage: "mpasi-tim", ingredients: [["pisang", 60]], tags: ["manis"] },
  { id: "alpukat-potong", name: "Alpukat potong lunak", kind: ["camilan"], stage: "mpasi-tim", ingredients: [["alpukat", 50]], tags: ["segar"] },
  { id: "yogurt-bayi", name: "Yogurt tawar", kind: ["camilan"], stage: "mpasi-tim", ingredients: [["yogurt", 60]], tags: ["segar"], mainProtein: "yogurt" },
  { id: "kentang-lumat", name: "Kentang kukus lumat", kind: ["camilan"], stage: "mpasi-tim", ingredients: [["kentang", 50], ["minyak", 2]], tags: ["gurih"] },
];

export const DISH_BY_ID: Record<string, Dish> = Object.fromEntries(DISHES.map((d) => [d.id, d]));
