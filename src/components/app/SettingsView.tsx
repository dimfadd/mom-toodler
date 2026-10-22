"use client";

import { useState } from "react";
import { ThemeToggle } from "@/components/Header";
import { references } from "@/content/references";
import { DATA_VERIFIED } from "@/lib/nutrition/foods";
import { targetsFor } from "@/lib/nutrition/targets";
import { resetAll, today, type AppState } from "@/lib/store";
import { Alert, Button, Card, Title, rupiah } from "./ui";

export function SettingsView({ state, onEdit }: { state: AppState; onEdit: () => void }) {
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
      <div className="space-y-4">
        <Card className="space-y-3">
          <Title>Keluarga</Title>
          <ul className="divide-y divide-line">
            {state.members.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-3 py-2.5">
                <span className="font-semibold text-ink">{m.name}</span>
                <span className="text-right text-sm text-muted">{targetsFor(m, today()).label}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted">Budget mingguan {rupiah(state.prefs.weeklyBudget)} · {state.prefs.allergens.length + state.prefs.avoid.length} pantangan</p>
          <Button variant="ghost" onClick={onEdit}>Ubah data keluarga</Button>
        </Card>

        <Card className="flex items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-ink">Tampilan</p>
            <p className="text-sm text-muted">Mode terang atau gelap</p>
          </div>
          <ThemeToggle />
        </Card>

        <Card className="space-y-3">
          <Title>Data di perangkat ini</Title>
          <p className="text-sm text-muted">Semua data keluarga, menu, dan catatan disimpan di browser HP ini. Data tidak dikirim ke server, kecuali saat memakai chat: pesanmu, nama panggilan, dan menu hari ini dikirim untuk diproses asisten. Menghapus data browser akan menghapus semuanya.</p>
          {confirm ? (
            <div className="flex flex-wrap gap-2">
              <Button variant="danger" onClick={() => { resetAll(); setConfirm(false); }}>Ya, hapus semua</Button>
              <Button variant="ghost" onClick={() => setConfirm(false)}>Batal</Button>
            </div>
          ) : (
            <Button variant="ghost" onClick={() => setConfirm(true)}>Hapus semua data</Button>
          )}
        </Card>
      </div>

      <div className="space-y-4">
        {!DATA_VERIFIED && (
          <Alert tone="warn" title="Versi beta">
            Target gizi memakai AKG 2019 resmi. Kandungan gizi bahan makanan masih dalam proses verifikasi ahli gizi terhadap Tabel Komposisi Pangan Indonesia, jadi angka bisa berubah.
          </Alert>
        )}
        <Card className="space-y-3">
          <Title>Sumber data dan rujukan</Title>
          <ol className="space-y-3">
            {references.map((r) => (
              <li key={r.id} id={`ref-${r.id}`} className="grid scroll-mt-24 grid-cols-[1.5rem_1fr] gap-2 text-sm leading-relaxed text-muted">
                <span className="font-semibold text-accent">{r.id}</span>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{r.citation}</a>
              </li>
            ))}
          </ol>
          <p className="text-sm text-muted">Kurva pertumbuhan memakai tabel Standar Pertumbuhan Anak WHO (2006). Kategori status gizi mengikuti WHO dan Permenkes 2/2020.</p>
        </Card>
        <p className="text-sm text-muted">Mommy Plate adalah alat bantu perencanaan makan dan tidak menggantikan saran medis.</p>
      </div>
    </div>
  );
}
