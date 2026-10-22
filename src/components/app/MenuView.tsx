"use client";

import { useState } from "react";
import { DISH_BY_ID } from "@/lib/nutrition/dishes";
import { percentOf, plannedNutrients, portionGrams } from "@/lib/nutrition/planner";
import { targetsFor } from "@/lib/nutrition/targets";
import { NUTRIENT_INFO, SLOT_INFO, type Member } from "@/lib/nutrition/types";
import { addDays, regenerateDay, swap, today, type AppState } from "@/lib/store";
import { Alert, Button, Card, displayKeys } from "./ui";
import { NotPlanned } from "./TodayView";

const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export function MenuView({ state, member }: { state: AppState; member: Member }) {
  const start = today();
  const [offset, setOffset] = useState(0);
  const [open, setOpen] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const date = addDays(start, offset);
  const info = targetsFor(member, date);
  const plan = state.plans[date]?.[member.id];

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(addDays(start, i) + "T00:00:00");
    return { i, name: i === 0 ? "Hari ini" : DAY_NAMES[d.getDay()], date: d.getDate() };
  });

  return (
    <div className="space-y-4">
      <div role="tablist" aria-label="Pilih hari" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {days.map((d) => (
          <button
            key={d.i}
            role="tab"
            type="button"
            aria-selected={offset === d.i}
            onClick={() => { setOffset(d.i); setNotice(null); }}
            className={`flex min-h-14 min-w-16 shrink-0 flex-col items-center justify-center rounded-lg px-3 text-sm font-semibold ${offset === d.i ? "bg-ink text-bg" : "border border-line text-ink hover:bg-surface"}`}
          >
            <span>{d.name}</span>
            <span className={`text-xs font-normal ${offset === d.i ? "opacity-80" : "text-muted"}`}>{d.date}</span>
          </button>
        ))}
      </div>

      {!info.plan ? (
        <NotPlanned member={member} reason={info.reason} />
      ) : !plan ? (
        <Alert tone="warn" title="Tidak ada menu yang cocok">Kurangi pantangan di Pengaturan supaya menu bisa disusun.</Alert>
      ) : (
        <>
          <Card className="bg-bg">
            <p className="text-sm text-muted">Perkiraan gizi menu ini untuk {member.name}</p>
            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
              {displayKeys(member).map((k) => {
                const pct = percentOf(plannedNutrients(plan)[k], info.targets[k]);
                return (
                  <li key={k}>
                    <span className="text-muted">{NUTRIENT_INFO[k].label} </span>
                    <span className={`font-semibold tabular-nums ${pct >= 90 ? "text-green" : "text-warn"}`}>{pct}%</span>
                  </li>
                );
              })}
            </ul>
          </Card>

          {notice && <p className="text-sm text-ink" role="status">{notice}</p>}

          <ul className="grid gap-3 md:grid-cols-2">
            {plan.meals.map((m) => {
              const dish = DISH_BY_ID[m.dishId];
              const key = `${date}-${m.slot}`;
              return (
                <li key={m.slot}>
                  <Card className="h-full bg-bg">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-sm font-semibold text-accent">{SLOT_INFO[m.slot].label}</p>
                      <p className="text-sm text-muted tabular-nums">{SLOT_INFO[m.slot].time}</p>
                    </div>
                    <p className="mt-1 font-bold text-ink">{dish.name}</p>
                    <div className="mt-1 flex flex-wrap gap-x-4">
                      <Button variant="quiet" className="text-sm" onClick={() => setOpen(open === key ? null : key)}>
                        {open === key ? "Tutup porsi" : "Porsi"}
                      </Button>
                      <Button
                        variant="quiet"
                        className="text-sm"
                        onClick={() => {
                          const id = swap(date, member.id, m.slot);
                          setNotice(id ? `${SLOT_INFO[m.slot].label} diganti: ${DISH_BY_ID[id].name}.` : "Belum ada pengganti yang cocok.");
                        }}
                      >
                        Ganti menu ini
                      </Button>
                    </div>
                    {open === key && (
                      <ul className="mt-1 space-y-0.5 text-sm text-muted">
                        {portionGrams(dish, m.portion).map((p) => (
                          <li key={p.name} className="flex justify-between gap-2"><span>{p.name}</span><span className="tabular-nums text-ink">{p.grams} g</span></li>
                        ))}
                      </ul>
                    )}
                  </Card>
                </li>
              );
            })}
          </ul>
          <Button variant="ghost" onClick={() => { regenerateDay(date, member.id); setNotice("Menu hari ini disusun ulang."); }}>
            Susun ulang menu hari ini
          </Button>
        </>
      )}
    </div>
  );
}
