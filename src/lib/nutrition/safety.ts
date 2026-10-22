// Warning signs that must never get a menu answer. Checked on the device before any chat request,
// and again on the server.

const PATTERNS: RegExp[] = [
  /pendarahan|perdarahan|berdarah|flek|bercak darah|keluar darah|bleeding/i,
  /gerak(an)? (janin|bayi|dedek|adek)? ?(berkurang|jarang|tidak terasa|gak terasa|nggak terasa|hilang)|janin (tidak|gak|nggak) (bergerak|gerak)|reduced (fetal|baby) movement/i,
  /ketuban (pecah|rembes)|air ketuban|waters? broke/i,
  /kejang|seizure|pingsan|tidak sadar|unconscious|faint/i,
  /sesak napas|sesak nafas|susah napas|sulit bernapas|bibir biru|can'?t breathe|trouble breathing/i,
  /bengkak (di )?(wajah|muka|bibir|lidah)|swollen (face|lips|tongue)|anafilaksis|anaphyla/i,
  /muntah terus|muntah-muntah terus|tidak bisa (makan|minum) sama sekali|vomiting (constantly|all day)|can'?t keep (food|water) down/i,
  /sakit kepala (hebat|parah|berat)|pandangan kabur|severe headache|blurred vision/i,
  /demam tinggi|panas tinggi|high fever/i,
  /diare (terus|berdarah|lebih dari)|bloody (stool|diarrh)/i,
  /dehidrasi|tidak pipis|ga pipis|gak pipis|no wet diaper/i,
  /nyeri perut (hebat|parah)|kontraksi (sebelum waktunya|terus)|severe (stomach|abdominal) pain/i,
];

export function isRedFlag(text: string): boolean {
  return PATTERNS.some((p) => p.test(text));
}

export const RED_FLAG_REPLY =
  "Ini tanda yang perlu diperiksa langsung oleh tenaga kesehatan. Segera hubungi dokter atau bidanmu, atau pergi ke IGD terdekat. Untuk keadaan darurat, telepon 119. Mommy Plate tidak memberi saran menu untuk kondisi ini.";

export const MEDICAL_FLAGS: { id: import("./types").MedicalFlag; label: string; who: "ibu" | "anak" | "semua" }[] = [
  { id: "diabetes-gestasional", label: "Diabetes gestasional", who: "ibu" },
  { id: "preeklamsia", label: "Preeklamsia atau hipertensi kehamilan", who: "ibu" },
  { id: "anemia-berat", label: "Anemia berat yang sedang diobati", who: "semua" },
  { id: "alergi-terdiagnosis", label: "Alergi makanan yang sudah didiagnosis dokter", who: "semua" },
  { id: "prematur", label: "Lahir prematur dan masih dalam pemantauan dokter", who: "anak" },
  { id: "gizi-buruk", label: "Gizi buruk atau gizi kurang yang sedang ditangani", who: "anak" },
  { id: "penyakit-lain", label: "Kondisi lain yang membutuhkan diet khusus dari dokter", who: "semua" },
];
