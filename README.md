# Mommy Plate

Aplikasi web (PWA) yang menyusun menu harian bergizi untuk ibu hamil, ibu menyusui, dan anak sampai usia 12 tahun. Strategi produk ada di [`docs/PRODUCT.md`](docs/PRODUCT.md), sistem desain di [`docs/DESIGN.md`](docs/DESIGN.md).

- `/` landing page (Bahasa Indonesia dan English, terang dan gelap), dengan demo HP interaktif memakai keluarga contoh
- `/app?contoh=1` membuka aplikasi dengan keluarga contoh (Rina hamil 24 minggu, Kakak 2 tahun) bila HP belum punya data
- `/app` aplikasinya: data keluarga, menu 7 hari, catat makan, chat, progres dan kurva pertumbuhan, daftar belanja

## Cara kerja sistem

| Bagian | Sumber | File |
|---|---|---|
| Target gizi harian | AKG 2019 (Permenkes 28/2019), termasuk tambahan hamil per trimester dan menyusui | `src/lib/nutrition/data/akg2019.json`, `targets.ts` |
| Kandungan gizi bahan | TKPI 2017, sebagian USDA. **Status draft, wajib diverifikasi ahli gizi** | `src/lib/nutrition/foods.ts` |
| Resep | 55 menu keluarga dan MPASI (halus 6 sampai 8 bulan, tim 9 sampai 11 bulan) | `src/lib/nutrition/dishes.ts` |
| Penyusun menu | Memilih kombinasi menu terbaik per orang per hari, porsi disesuaikan target energi, menghindari alergi dan pantangan, menjaga variasi dan budget | `src/lib/nutrition/planner.ts` |
| Kurva pertumbuhan | Standar Pertumbuhan Anak WHO 2006 (0 sampai 5 tahun), metode LMS | `src/lib/nutrition/growth.ts` |
| Tanda bahaya | Daftar kata yang selalu dijawab "segera ke dokter", dicek di HP dan di server | `src/lib/nutrition/safety.ts` |
| Chat | Claude memilih aksi (ganti menu, catat makan, jawab). Menu dan angka tetap dari penyusun menu. Tanpa API key, chat memakai aturan sederhana di HP | `src/app/api/chat/route.ts`, `src/lib/chat.ts` |

Data keluarga disimpan di browser pengguna (localStorage). Belum ada akun, sinkronisasi antarperangkat, atau pembayaran.

## Menjalankan

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # tes mesin gizi
npm run build && npm start
```

## Pengaturan

Salin `.env.example` menjadi `.env.local` (atau isi di Vercel → Settings → Environment Variables):

| Variabel | Fungsi |
|---|---|
| `ANTHROPIC_API_KEY` | Mengaktifkan chat AI. Tanpa ini chat tetap jalan dengan mode dasar |
| `CHAT_MODEL` | Opsional. Bawaan `claude-opus-5-5`; `claude-haiku-5-5` jauh lebih murah |
| `CHAT_DAILY_LIMIT` | Opsional. Batas pesan per IP per hari (bawaan 60) |
| `NEXT_PUBLIC_PREORDER_URL` | Opsional. Link pembayaran Midtrans/Xendit untuk penawaran founding member |

Nama merek, harga, dan kuota ada di `src/content/site.ts`. Teks landing page ada di `src/content/copy.ts`.

## Font Nexa Pro

Nexa Pro adalah font berbayar. Taruh file berlisensi di `public/fonts` (lihat `public/fonts/README.md`). Sampai file ada, situs memakai Montserrat.

## Sebelum dijual ke publik

- Ahli gizi memverifikasi `foods.ts` terhadap TKPI resmi, lalu mengubah `verified: false` menjadi `true`
- Ahli gizi meninjau resep, porsi MPASI, dan aturan tanda bahaya
- Akun pengguna, sinkronisasi, dan pembayaran langganan
- Konsultasi hukum soal layanan gizi digital dan UU PDP
