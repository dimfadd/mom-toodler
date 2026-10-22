"use client";

import { useState } from "react";
import { Cite } from "@/components/Rich";
import { DISH_BY_ID } from "@/lib/nutrition/dishes";
import { eatenNutrients, percentOf, plannedNutrients, portionGrams } from "@/lib/nutrition/planner";
import { targetsFor } from "@/lib/nutrition/targets";
import { NUTRIENT_INFO, SLOT_INFO, type Member, type MealLog, type Slot } from "@/lib/nutrition/types";
import { logMeal, swap, today, type AppState } from "@/lib/store";
import { Alert, Button, Card, Check, NutrientBars, Ring, SOURCES, Title, displayKeys, isInfant } from "./ui";

const LOG_TEXT: Record<MealLog, string> = { habis: "Habis", sebagian: "Sebagian", tidak: "Tidak dimakan" };

export function overallPercent(member: Member, state: AppState, date: string): number | null {
  const info = targetsFor(member, date);
  const plan = state.plans[date]?.[member.id];
  if (!info.plan || !plan) return null;
  const eaten = eatenNutrients(plan, state.logs[date]?.[member.id] ?? {});
  const keys = displayKeys(member);
  return Math.round(keys.reduce((s, k) => s + Math.min(percentOf(eaten[k], info.targets[k]), 100), 0) / keys.length);
}

export function NotPlanned({ member, reason }: { member: Member; reason?: string }) {
  if (reason === "asi") {
    return (
      <Alert title={`${member.name} masih dalam masa ASI eksklusif`}>
        Sampai usia 6 bulan, bayi cukup mendapat ASI saja. Mommy Plate mulai menyusun MPASI saat {member.name} berusia 6 bulan<Cite n={2} />. Sementara itu, menu ibu menyusui sudah memperhitungkan kebutuhan tambahan menyusui, dan pertumbuhan {member.name} bisa dicatat di tab Progres.
      </Alert>
    );
  }
  if (reason === "medis") {
    return (
      <Alert tone="warn" title="Menu personal tidak dibuat">
        Karena ada kondisi kesehatan yang ditandai untuk {member.name}, menu sebaiknya disusun bersama dokter atau ahli gizi yang menangani. Kamu tetap bisa memakai daftar belanja, chat, dan pencatatan pertumbuhan.
      </Alert>
    );
  }
  return (
    <Alert tone="warn" title="Belum didukung">
      Menu untuk usia di atas 12 tahun belum tersedia.
    </Alert>
  );
}

export function TodayView({ state, member }: { state: AppState; member: Member }) {
  const date = today();
  const info = targetsFor(member, date);
  const plan = state.plans[date]?.[member.id];
  const logs = state.logs[date]?.[member.id] ?? {};
  const [loggingSlot, setLoggingSlot] = useState<Slot | null>(null);
  const [showPortion, setShowPortion] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  if (!info.plan) return <NotPlanned member={member} reason={info.reason} />;
  if (!plan) {
    return (
      <Alert tone="warn" title="Tidak ada menu yang cocok">
        Kombinasi alergi dan pantangan saat ini membuat tidak ada menu yang bisa disusun untuk {member.name}. Kurangi pantangan di Pengaturan.
      </Alert>
    );
  }

  const keys = displayKeys(member);
  const eaten = eatenNutrients(plan, logs);
  const planned = plannedNutrients(plan);
  const overall = overallPercent(member, state, date) ?? 0;
  const next = plan.meals.find((m) => !logs[m.slot]);
  const nextDish = next ? DISH_BY_ID[next.dishId] : null;
  const lowest = keys.reduce((a, b) => (percentOf(eaten[a], info.targets[a]) <= percentOf(eaten[b], info.targets[b]) ? a : b));
  const loggedCount = Object.keys(logs).length;
  const ironShort = percentOf(planned.besi, info.targets.besi) < 60;

  function doSwap(slot: Slot) {
    const id = swap(date, member.id, slot);
    setNotice(id ? `Diganti: ${DISH_BY_ID[id].name}. Target gizi tetap dihitung.` : "Belum ada menu pengganti yang cocok dengan pantanganmu.");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr] lg:items-start">
      <div className="space-y-4">
        <Card className="flex flex-col items-center gap-4 sm:flex-row">
          <Ring value={overall} label="hari ini" />
          <div className="w-full">
            <p className="mb-2 text-sm text-muted">Dari makanan yang sudah dicatat. Target {member.name}: {info.label.toLowerCase()}</p>
            <NutrientBars keys={keys} eaten={eaten} targets={info.targets} />
          </div>
        </Card>

        {next && nextDish ? (
          <Card className="border-green bg-bg">
            <p className="text-sm font-semibold text-accent">Berikutnya · {SLOT_INFO[next.slot].label} {SLOT_INFO[next.slot].time}</p>
            <p className="mt-1.5 text-xl leading-snug font-bold text-ink">{nextDish.name}</p>
            <button type="button" onClick={() => setShowPortion((v) => !v)} aria-expanded={showPortion} className="mt-1 min-h-11 text-sm font-semibold text-green underline underline-offset-4">
              {showPortion ? "Sembunyikan porsi" : `Lihat porsi untuk ${member.name}`}
            </button>
            {showPortion && (
              <ul className="mb-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted">
                {portionGrams(nextDish, next.portion).map((p) => (
                  <li key={p.name} className="flex justify-between gap-2"><span>{p.name}</span><span className="tabular-nums text-ink">{p.grams} g</span></li>
                ))}
              </ul>
            )}
            {loggingSlot === next.slot ? (
              <div className="mt-2">
                <p className="text-sm text-muted">Seberapa banyak yang dimakan?</p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {(["habis", "sebagian", "tidak"] as const).map((s) => (
                    <Button key={s} variant="ghost" onClick={() => { logMeal(date, member.id, next.slot, s); setLoggingSlot(null); setNotice(null); }}>
                      {LOG_TEXT[s]}
                    </Button>
                  ))}
                </div>
                <Button variant="quiet" onClick={() => setLoggingSlot(null)} className="mt-1">Batal</Button>
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button onClick={() => setLoggingSlot(next.slot)}>Catat</Button>
                <Button variant="ghost" onClick={() => doSwap(next.slot)}>Ganti menu</Button>
              </div>
            )}
            {notice && <p className="mt-3 text-sm text-ink" role="status">{notice}</p>}
          </Card>
        ) : (
          <Card className="text-center">
            <p className="text-lg font-bold text-ink">Semua makan hari ini sudah dicatat.</p>
            <p className="mt-1 text-sm text-muted">Menu besok sudah siap di tab Menu.</p>
          </Card>
        )}

        {loggedCount > 0 && percentOf(eaten[lowest], info.targets[lowest]) < 100 && next && (
          <Alert>
            Yang paling rendah sejauh ini: <strong>{NUTRIENT_INFO[lowest].label.toLowerCase()}</strong>. Sumbernya antara lain {SOURCES[lowest] ?? "makanan di jadwal berikutnya"}.
          </Alert>
        )}
        {isInfant(member, date) && ironShort && (
          <Alert tone="warn" title="Soal zat besi bayi">
            Kebutuhan zat besi bayi sangat tinggi dan sulit dipenuhi dari makanan rumahan saja. Tanyakan dokter anak tentang makanan terfortifikasi atau suplemen zat besi.
          </Alert>
        )}
        {member.role === "ibu" && member.status.kind === "hamil" && (
          <Alert title="Soal asam folat">
            Tabel pangan Indonesia belum mencatat folat, jadi folat tidak dihitung di sini. WHO menganjurkan suplemen zat besi dan asam folat selama kehamilan<Cite n={7} />. Ikuti dosis dari dokter atau bidanmu.
          </Alert>
        )}
      </div>

      <div>
        <Title sub={info.basis}>Jadwal hari ini</Title>
        <ol className="mt-3 divide-y divide-line rounded-2xl border border-line">
          {plan.meals.map((m) => {
            const dish = DISH_BY_ID[m.dishId];
            const log = logs[m.slot];
            return (
              <li key={m.slot} className="p-3.5">
                <div className="flex items-start gap-3">
                  <span className="w-12 shrink-0 pt-0.5 text-sm text-muted tabular-nums">{SLOT_INFO[m.slot].time}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink">{SLOT_INFO[m.slot].label}</p>
                    <p className="text-sm text-muted">{dish.name}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLoggingSlot(loggingSlot === m.slot ? null : m.slot)}
                    aria-expanded={loggingSlot === m.slot}
                    className={`flex min-h-11 shrink-0 items-center gap-1 rounded-lg px-2.5 text-xs font-semibold ${
                      log ? (log === "tidak" ? "bg-warn-soft text-warn" : "bg-green-soft text-green") : "border border-line text-muted"
                    }`}
                  >
                    {log && log !== "tidak" && <Check className="h-3 w-3" />}
                    {log ? LOG_TEXT[log] : "Catat"}
                  </button>
                </div>
                {loggingSlot === m.slot && m.slot !== next?.slot && (
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {(["habis", "sebagian", "tidak"] as const).map((s) => (
                      <Button key={s} variant="ghost" className="text-sm" onClick={() => { logMeal(date, member.id, m.slot, s); setLoggingSlot(null); }}>
                        {LOG_TEXT[s]}
                      </Button>
                    ))}
                    {log && <Button variant="quiet" className="text-sm" onClick={() => { logMeal(date, member.id, m.slot, null); setLoggingSlot(null); }}>Hapus catatan</Button>}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
