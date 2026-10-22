"use client";

import { useState } from "react";
import { addDays, newId, saveHousehold, today } from "@/lib/store";
import { FOODS, type Allergen } from "@/lib/nutrition/foods";
import { MEDICAL_FLAGS } from "@/lib/nutrition/safety";
import { pregnancyWeek } from "@/lib/nutrition/targets";
import type { MedicalFlag, Member, Preferences, Sex } from "@/lib/nutrition/types";
import { Alert, Button, Card } from "./ui";

type MotherDraft = {
  include: boolean;
  id: string;
  name: string;
  age: string;
  status: "hamil" | "menyusui" | "tidak";
  week: string;
  babyBirthDate: string;
  medical: MedicalFlag[];
};
type ChildDraft = { id: string; name: string; birthDate: string; sex: Sex | ""; breastfed: boolean; medical: MedicalFlag[] };

const ALLERGENS: { id: Allergen; label: string }[] = [
  { id: "telur", label: "Telur" },
  { id: "susu", label: "Susu sapi" },
  { id: "ikan", label: "Ikan" },
  { id: "seafood", label: "Udang dan seafood" },
  { id: "kedelai", label: "Kedelai (tempe, tahu)" },
  { id: "gluten", label: "Gandum (roti, oat, makaroni)" },
];

const DISLIKES: { id: string; label: string }[] = [
  { id: "daging-sapi", label: "Daging sapi" },
  { id: "ayam", label: "Ayam" },
  { id: "hati-ayam", label: "Hati ayam" },
  { id: "ikan-lele", label: "Lele" },
  { id: "salmon", label: "Salmon" },
  { id: "tempe", label: "Tempe" },
  { id: "daun-kelor", label: "Daun kelor" },
  { id: "brokoli", label: "Brokoli" },
  { id: "santan", label: "Santan" },
];

const BUDGETS = [500_000, 1_000_000, 1_500_000, 2_500_000];

const input = "mt-1.5 block h-12 w-full rounded-lg border border-line bg-bg px-3 text-base text-ink";
const label = "text-sm font-semibold text-ink";

function initialMother(existing?: Member): MotherDraft {
  if (existing && existing.role === "ibu") {
    const t = today();
    const age = Math.floor((Date.parse(t) - Date.parse(existing.birthDate)) / (365.25 * 86_400_000));
    return {
      include: true,
      id: existing.id,
      name: existing.name,
      age: String(age),
      status: existing.status.kind,
      week: existing.status.kind === "hamil" ? String(pregnancyWeek(existing.status.dueDate, t)) : "",
      babyBirthDate: existing.status.kind === "menyusui" ? existing.status.babyBirthDate : "",
      medical: existing.medical,
    };
  }
  return { include: true, id: newId(), name: "", age: "", status: "hamil", week: "", babyBirthDate: "", medical: [] };
}

export function Onboarding({ members, prefs, onDone, onCancel }: { members: Member[]; prefs: Preferences; onDone: () => void; onCancel?: () => void }) {
  const [step, setStep] = useState(0);
  const existingMother = members.find((m) => m.role === "ibu");
  const [mother, setMother] = useState<MotherDraft>(() => ({ ...initialMother(existingMother), include: members.length === 0 || !!existingMother }));
  const [children, setChildren] = useState<ChildDraft[]>(() =>
    members.flatMap((m) => (m.role === "anak" ? [{ id: m.id, name: m.name, birthDate: m.birthDate, sex: m.sex, breastfed: m.breastfed, medical: m.medical }] : [])),
  );
  const [allergens, setAllergens] = useState<string[]>(prefs.allergens);
  const [avoid, setAvoid] = useState<string[]>(prefs.avoid);
  const [query, setQuery] = useState("");
  const [likesSpicy, setLikesSpicy] = useState(prefs.likesSpicy);
  const [budget, setBudget] = useState(String(prefs.weeklyBudget));
  const [agree, setAgree] = useState(members.length > 0);
  const [errors, setErrors] = useState<string[]>([]);

  const t = today();
  const steps = ["Keluarga", "Selera", "Kesehatan"];

  function validateFamily(): string[] {
    const e: string[] = [];
    if (!mother.include && children.length === 0) e.push("Tambahkan minimal satu anggota keluarga.");
    if (mother.include) {
      if (!mother.name.trim()) e.push("Isi nama panggilan ibu.");
      const age = Number(mother.age);
      if (!(age >= 15 && age <= 55)) e.push("Usia ibu diisi angka 15 sampai 55.");
      if (mother.status === "hamil" && !(Number(mother.week) >= 1 && Number(mother.week) <= 42)) e.push("Usia kehamilan diisi angka 1 sampai 42 minggu.");
      if (mother.status === "menyusui" && (!mother.babyBirthDate || mother.babyBirthDate > t)) e.push("Isi tanggal lahir bayi yang sedang disusui.");
    }
    children.forEach((c, i) => {
      if (!c.name.trim()) e.push(`Isi nama anak ke-${i + 1}.`);
      if (!c.birthDate || c.birthDate > t) e.push(`Isi tanggal lahir ${c.name || `anak ke-${i + 1}`}.`);
      if (!c.sex) e.push(`Pilih jenis kelamin ${c.name || `anak ke-${i + 1}`}.`);
    });
    return e;
  }

  function next() {
    if (step === 0) {
      const e = validateFamily();
      setErrors(e);
      if (e.length) return;
    }
    setErrors([]);
    setStep((s) => s + 1);
    window.scrollTo({ top: 0 });
  }

  function finish() {
    if (!agree) {
      setErrors(["Centang persetujuan untuk melanjutkan."]);
      return;
    }
    const list: Member[] = [];
    if (mother.include) {
      const birth = `${new Date().getFullYear() - Number(mother.age)}-01-01`;
      const status: Extract<Member, { role: "ibu" }>["status"] =
        mother.status === "hamil"
          ? { kind: "hamil", dueDate: addDays(t, (40 - Number(mother.week)) * 7) }
          : mother.status === "menyusui"
            ? { kind: "menyusui", babyBirthDate: mother.babyBirthDate }
            : { kind: "tidak" };
      list.push({ id: mother.id, role: "ibu", name: mother.name.trim(), birthDate: birth, status, medical: mother.medical });
    }
    for (const c of children) {
      list.push({ id: c.id, role: "anak", name: c.name.trim(), birthDate: c.birthDate, sex: c.sex as Sex, breastfed: c.breastfed, medical: c.medical });
    }
    saveHousehold(list, { allergens, avoid, likesSpicy, weeklyBudget: Math.max(0, Number(budget) || 0) });
    onDone();
  }

  const q = query.trim().toLowerCase();
  const matches = q.length >= 2 ? Object.values(FOODS).filter((f) => !avoid.includes(f.id) && (f.name.toLowerCase().includes(q) || f.id.includes(q))).slice(0, 8) : [];
  // Foods picked through the search box, shown as chips next to the common ones.
  const extra = avoid.filter((id) => !DISLIKES.some((d) => d.id === id));

  const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pt-6 pb-16 sm:px-6">
      <p className="text-sm font-semibold text-accent">Langkah {step + 1} dari {steps.length} · {steps[step]}</p>
      <div className="mt-2 flex gap-1.5" aria-hidden="true">
        {steps.map((s, i) => (
          <span key={s} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-green" : "bg-line"}`} />
        ))}
      </div>

      {step === 0 && (
        <div className="mt-6 space-y-5">
          <div>
            <h1 className="font-display text-3xl font-bold text-ink">Siapa saja yang makannya kamu urus?</h1>
            <p className="mt-2 text-muted">Data ini disimpan di HP-mu dan dipakai untuk menghitung target gizi tiap orang.</p>
          </div>

          <Card className="space-y-4 bg-bg">
            <label className="flex min-h-11 items-center gap-3 font-semibold text-ink">
              <input type="checkbox" checked={mother.include} onChange={(e) => setMother({ ...mother, include: e.target.checked })} className="h-5 w-5 accent-[var(--green)]" />
              Pantau menu ibu
            </label>
            {mother.include && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="m-name" className={label}>Nama panggilan</label>
                    <input id="m-name" className={input} value={mother.name} onChange={(e) => setMother({ ...mother, name: e.target.value })} autoComplete="given-name" />
                  </div>
                  <div>
                    <label htmlFor="m-age" className={label}>Usia (tahun)</label>
                    <input id="m-age" className={input} inputMode="numeric" value={mother.age} onChange={(e) => setMother({ ...mother, age: e.target.value.replace(/\D/g, "") })} />
                  </div>
                </div>
                <fieldset>
                  <legend className={label}>Saat ini</legend>
                  <div className="mt-2 grid gap-2 sm:grid-cols-3">
                    {([
                      ["hamil", "Sedang hamil"],
                      ["menyusui", "Sedang menyusui"],
                      ["tidak", "Tidak keduanya"],
                    ] as const).map(([id, text]) => (
                      <label key={id} className={`flex min-h-12 cursor-pointer items-center gap-2 rounded-lg border px-3 text-[15px] ${mother.status === id ? "border-green bg-green-soft font-semibold text-ink" : "border-line text-ink"}`}>
                        <input type="radio" name="m-status" checked={mother.status === id} onChange={() => setMother({ ...mother, status: id })} className="accent-[var(--green)]" />
                        {text}
                      </label>
                    ))}
                  </div>
                </fieldset>
                {mother.status === "hamil" && (
                  <div>
                    <label htmlFor="m-week" className={label}>Usia kehamilan (minggu)</label>
                    <input id="m-week" className={input} inputMode="numeric" value={mother.week} onChange={(e) => setMother({ ...mother, week: e.target.value.replace(/\D/g, "") })} placeholder="contoh: 20" />
                  </div>
                )}
                {mother.status === "menyusui" && (
                  <div>
                    <label htmlFor="m-baby" className={label}>Tanggal lahir bayi yang disusui</label>
                    <input id="m-baby" type="date" max={t} className={input} value={mother.babyBirthDate} onChange={(e) => setMother({ ...mother, babyBirthDate: e.target.value })} />
                  </div>
                )}
              </>
            )}
          </Card>

          {children.map((c, i) => (
            <Card key={c.id} className="space-y-4 bg-bg">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-ink">Anak {i + 1}</p>
                <Button variant="quiet" onClick={() => setChildren(children.filter((x) => x.id !== c.id))}>Hapus</Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor={`c-name-${c.id}`} className={label}>Nama panggilan</label>
                  <input id={`c-name-${c.id}`} className={input} value={c.name} onChange={(e) => setChildren(children.map((x) => (x.id === c.id ? { ...x, name: e.target.value } : x)))} />
                </div>
                <div>
                  <label htmlFor={`c-birth-${c.id}`} className={label}>Tanggal lahir</label>
                  <input id={`c-birth-${c.id}`} type="date" max={t} className={input} value={c.birthDate} onChange={(e) => setChildren(children.map((x) => (x.id === c.id ? { ...x, birthDate: e.target.value } : x)))} />
                </div>
              </div>
              <fieldset>
                <legend className={label}>Jenis kelamin</legend>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {([["L", "Laki-laki"], ["P", "Perempuan"]] as const).map(([id, text]) => (
                    <label key={id} className={`flex min-h-12 cursor-pointer items-center gap-2 rounded-lg border px-3 ${c.sex === id ? "border-green bg-green-soft font-semibold" : "border-line"} text-ink`}>
                      <input type="radio" name={`sex-${c.id}`} checked={c.sex === id} onChange={() => setChildren(children.map((x) => (x.id === c.id ? { ...x, sex: id } : x)))} className="accent-[var(--green)]" />
                      {text}
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="flex min-h-11 items-center gap-3 text-[15px] text-ink">
                <input type="checkbox" checked={c.breastfed} onChange={(e) => setChildren(children.map((x) => (x.id === c.id ? { ...x, breastfed: e.target.checked } : x)))} className="h-5 w-5 accent-[var(--green)]" />
                Masih minum ASI
              </label>
            </Card>
          ))}

          <Button variant="ghost" className="w-full" onClick={() => setChildren([...children, { id: newId(), name: "", birthDate: "", sex: "", breastfed: true, medical: [] }])}>
            + Tambah anak
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="mt-6 space-y-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-ink">Apa yang tidak boleh atau tidak disukai?</h1>
            <p className="mt-2 text-muted">Menu tidak akan memakai bahan yang kamu pilih di sini.</p>
          </div>
          <fieldset>
            <legend className={label}>Alergi atau pantangan seluruh keluarga</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              <Chip on={allergens.length === 0} onClick={() => setAllergens([])}>Tidak ada</Chip>
              {ALLERGENS.map((a) => (
                <Chip key={a.id} on={allergens.includes(a.id)} onClick={() => setAllergens(toggle(allergens, a.id))}>{a.label}</Chip>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className={label}>Bahan yang tidak disukai</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              <Chip on={avoid.length === 0} onClick={() => setAvoid([])}>Suka semua</Chip>
              {[...DISLIKES, ...extra.map((id) => ({ id, label: FOODS[id]?.name ?? id }))].map((a) => (
                <Chip key={a.id} on={avoid.includes(a.id)} onClick={() => setAvoid(toggle(avoid, a.id))}>{a.label}</Chip>
              ))}
            </div>
            <label htmlFor="other-food" className="mt-4 block text-sm text-ink">Ada bahan lain yang perlu dihindari? Ketik namanya</label>
            <input id="other-food" className={input} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Contoh: udang, kacang, pepaya" autoComplete="off" />
            {q.length >= 2 && (
              matches.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {matches.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => { setAvoid([...avoid, f.id]); setQuery(""); }}
                      className="flex min-h-11 items-center gap-1.5 rounded-lg border border-dashed border-green px-3 text-[15px] text-ink hover:bg-green-soft"
                    >
                      <span aria-hidden="true" className="font-bold text-green">+</span> {f.name}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-muted">&ldquo;{query.trim()}&rdquo; tidak dipakai di resep Mommy Plate, jadi tidak akan muncul di menu.</p>
              )
            )}
          </fieldset>
          <label className="flex min-h-11 items-center gap-3 text-[15px] text-ink">
            <input type="checkbox" checked={likesSpicy} onChange={(e) => setLikesSpicy(e.target.checked)} className="h-5 w-5 accent-[var(--green)]" />
            Orang dewasa di rumah suka pedas (anak tetap tidak diberi menu pedas)
          </label>
          <div>
            <label htmlFor="budget" className={label}>Budget belanja makanan per minggu (seluruh keluarga)</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {BUDGETS.map((b) => (
                <Chip key={b} on={Number(budget) === b} onClick={() => setBudget(String(b))}>Rp{b.toLocaleString("id-ID")}</Chip>
              ))}
            </div>
            <input id="budget" className={`${input} mt-3`} inputMode="numeric" value={budget} onChange={(e) => setBudget(e.target.value.replace(/\D/g, ""))} />
            <p className="mt-1.5 text-sm text-muted">Dipakai untuk memilih menu yang sesuai. Harga bahan masih perkiraan.</p>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mt-6 space-y-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-ink">Ada kondisi kesehatan khusus?</h1>
            <p className="mt-2 text-muted">Untuk kondisi di bawah, menu harus disusun bersama dokter atau ahli gizi. Mommy Plate tidak akan membuat menu personal untuk orang tersebut, tapi kamu tetap bisa memakai fitur lain.</p>
          </div>
          {[...(mother.include ? [{ id: mother.id, name: mother.name || "Ibu", who: "ibu" as const, medical: mother.medical }] : []), ...children.map((c) => ({ id: c.id, name: c.name, who: "anak" as const, medical: c.medical }))].map((p) => (
            <fieldset key={p.id}>
              <legend className={label}>{p.name}</legend>
              <div className="mt-2 space-y-1">
                {MEDICAL_FLAGS.filter((f) => f.who === "semua" || f.who === p.who).map((f) => (
                  <label key={f.id} className="flex min-h-11 items-center gap-3 text-[15px] text-ink">
                    <input
                      type="checkbox"
                      checked={p.medical.includes(f.id)}
                      onChange={() => {
                        const medical = toggle(p.medical, f.id) as MedicalFlag[];
                        if (p.who === "ibu") setMother({ ...mother, medical });
                        else setChildren(children.map((x) => (x.id === p.id ? { ...x, medical } : x)));
                      }}
                      className="h-5 w-5 shrink-0 accent-[var(--green)]"
                    />
                    {f.label}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          <Alert title="Sebelum mulai">
            Mommy Plate membantu menyusun dan mencatat menu harian. Aplikasi ini bukan pengganti pemeriksaan dokter, bidan, atau ahli gizi. Data keluargamu disimpan di perangkat ini.
            <label className="mt-3 flex min-h-11 items-center gap-3 font-semibold">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="h-5 w-5 shrink-0 accent-[var(--green)]" />
              Saya mengerti dan setuju
            </label>
          </Alert>
        </div>
      )}

      {errors.length > 0 && (
        <div className="mt-6">
          <Alert tone="warn" title="Periksa lagi">
            <ul className="list-disc pl-5">{errors.map((e) => <li key={e}>{e}</li>)}</ul>
          </Alert>
        </div>
      )}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        {step > 0 ? (
          <Button variant="ghost" onClick={() => { setErrors([]); setStep(step - 1); }}>Kembali</Button>
        ) : onCancel ? (
          <Button variant="ghost" onClick={onCancel}>Batal</Button>
        ) : <span />}
        {step < steps.length - 1 ? (
          <Button onClick={next} className="sm:min-w-40">Lanjut</Button>
        ) : (
          <Button onClick={finish} className="sm:min-w-40">Susun menu keluarga</Button>
        )}
      </div>
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`flex min-h-11 items-center gap-1.5 rounded-lg border px-3 text-[15px] ${on ? "border-green bg-green-soft font-semibold text-ink" : "border-line text-ink hover:bg-surface"}`}
    >
      {on && <svg className="h-4 w-4 text-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      {children}
    </button>
  );
}
