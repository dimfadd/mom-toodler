"use client";

import { useMemo, useState } from "react";
import { formatGrams, shoppingList } from "@/lib/nutrition/planner";
import type { DayPlan } from "@/lib/nutrition/types";
import { addDays, today, type AppState } from "@/lib/store";
import { Alert, Card, Title, rupiah } from "./ui";

const CATEGORY: Record<string, string> = {
  pokok: "Makanan pokok",
  "lauk-hewani": "Lauk hewani",
  "lauk-nabati": "Lauk nabati",
  sayur: "Sayur",
  buah: "Buah",
  susu: "Susu dan olahannya",
  lainnya: "Lainnya",
};

export function ShoppingView({ state }: { state: AppState }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const { items, total } = useMemo(() => {
    const plans: DayPlan[] = [];
    for (let i = 0; i < 7; i++) {
      const day = state.plans[addDays(today(), i)] ?? {};
      for (const p of Object.values(day)) if (p) plans.push(p);
    }
    return shoppingList(plans);
  }, [state.plans]);

  if (items.length === 0) {
    return <Alert>Belum ada menu yang bisa dibuatkan daftar belanja. Isi data keluarga dulu di Pengaturan.</Alert>;
  }

  const groups = [...new Set(items.map((i) => i.category))];
  const remaining = items.filter((i) => !checked[i.foodId]);
  const budget = state.prefs.weeklyBudget;
  const text =
    "Daftar belanja minggu ini (Mommy Plate):\n" +
    remaining.map((i) => `- ${i.name} ${formatGrams(i.grams, i.foodId)}`).join("\n");

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px] lg:items-start">
      <div className="space-y-5">
        <p className="text-sm text-muted">Disusun dari menu 7 hari ke depan untuk seluruh keluarga. Jumlah sudah dibulatkan, beras dan makaroni dihitung dalam bentuk kering.</p>
        {groups.map((g) => (
          <div key={g}>
            <Title>{CATEGORY[g] ?? g}</Title>
            <ul className="mt-2 divide-y divide-line rounded-2xl border border-line">
              {items.filter((i) => i.category === g).map((i) => (
                <li key={i.foodId}>
                  <label className="flex min-h-12 cursor-pointer items-center gap-3 px-3.5">
                    <input
                      type="checkbox"
                      checked={!!checked[i.foodId]}
                      onChange={(e) => setChecked((c) => ({ ...c, [i.foodId]: e.target.checked }))}
                      className="h-5 w-5 shrink-0 accent-[var(--green)]"
                    />
                    <span className={`flex-1 ${checked[i.foodId] ? "text-muted line-through" : "text-ink"}`}>{i.name}</span>
                    <span className="text-sm text-muted tabular-nums">{formatGrams(i.grams, i.foodId)}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <Card className="space-y-3 lg:sticky lg:top-24">
        <p className="text-sm text-muted">Perkiraan belanja 7 hari</p>
        <p className="text-3xl font-bold text-ink tabular-nums">{rupiah(total)}</p>
        {budget > 0 && (
          <p className={`text-sm font-semibold ${total > budget ? "text-warn" : "text-green"}`}>
            {total > budget ? `Di atas budget ${rupiah(budget)}` : `Di bawah budget ${rupiah(budget)}`}
          </p>
        )}
        <p className="text-xs text-muted">Harga perkiraan pasar, bisa berbeda di daerahmu.</p>
        {remaining.length > 0 ? (
          <a
            href={`https://wa.me/?text=${encodeURIComponent(text)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 items-center justify-center rounded-lg bg-green px-4 font-semibold text-on-green hover:opacity-90"
          >
            Kirim {remaining.length} item ke WhatsApp
          </a>
        ) : (
          <p className="rounded-xl bg-green-soft p-3 text-center font-semibold text-green">Semua sudah dibeli.</p>
        )}
      </Card>
    </div>
  );
}
