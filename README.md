# Stunt Free

Landing page pre-order dan prototipe aplikasi Stunt Free: asisten menu harian bergizi untuk ibu hamil, ibu menyusui, dan anak usia MPASI. Strategi produk ada di [`docs/PRODUCT.md`](docs/PRODUCT.md), sistem desain di [`docs/DESIGN.md`](docs/DESIGN.md). Prototipe yang bisa diklik ada di `/app`.

Nama merek diatur di satu tempat: `name` di `src/content/site.ts`.

## Isi halaman

- Bahasa Indonesia dan English, mode terang dan gelap
- Setiap klaim kesehatan diberi nomor rujukan yang menuju daftar sumber di footer (`src/content/references.ts`)
- Form daftar tunggu dengan validasi, persetujuan data, dan opsi minat pre-order
- Tombol pre-order founding member (memakai link pembayaran Midtrans/Xendit kalau sudah diisi)

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # versi produksi
```

## Pengaturan

Salin `.env.example` menjadi `.env.local`, lalu isi:

| Variabel | Fungsi |
|---|---|
| `WAITLIST_WEBHOOK_URL` | Tujuan data pendaftar, misalnya Google Apps Script yang menulis ke Google Sheets. Kosong: data disimpan di `.data/waitlist.jsonl` di server |
| `NEXT_PUBLIC_PREORDER_URL` | Link pembayaran pre-order. Kosong: tombol pre-order membuka form daftar tunggu |

Harga, kuota founding member, tanggal beta, dan batas pengembalian dana ada di `src/content/site.ts`. Semua teks ada di `src/content/copy.ts`.

## Wajib dikonfirmasi sebelum halaman dipublikasikan

- Tanggal beta (`betaLabel`) dan janji uang kembali (`refundDeadline`) di `src/content/site.ts`
- Harga dan kuota founding member
- Email kontak (`contactEmail`)
- Hosting: Vercel tidak bisa menyimpan ke file, jadi isi `WAITLIST_WEBHOOK_URL` kalau deploy ke Vercel
