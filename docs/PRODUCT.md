# Mommy Plate: Brief Produk

Dokumen kerja. Semua angka harga dan target di sini adalah hipotesis yang harus diuji, bukan data.

## 1. Satu kalimat

Mommy Plate menyusun menu harian untuk ibu hamil, ibu menyusui, dan anak di masa MPASI, mengikuti selera hari itu dan budget keluarga, dengan target gizi dari AKG Kemenkes, dan setiap saran disertai rujukan yang bisa dicek.

## 2. Keputusan strategis (sudah diambil)

| Keputusan | Pilihan | Alasan |
|---|---|---|
| Model layanan | Aplikasi AI saja (tier Plus), tanpa ahli gizi di layanan harian | Modal dan effort kecil, tidak perlu merekrut tim klinis |
| Segmen | Kelas menengah atas dan atas, urban | Mampu bayar langganan, volume lebih besar dari segmen kaya saja |
| Fase awal | 1000 Hari Pertama Kehidupan: hamil, menyusui, MPASI 6 sampai 24 bulan | Masa paling panik, paling mau bayar, paling jelas dasar ilmiahnya |
| Fase berikutnya | Anak 2 sampai 12 tahun | Setelah fase awal terbukti laku |
| Platform | PWA dulu, dibungkus Capacitor ke Play Store dan App Store setelah ada traksi | Satu kode, update instan, pembayaran web tanpa potongan toko 15 sampai 30% |
| Pembayaran | Web (Midtrans atau Xendit) | Potongan sekitar 1 sampai 3%, bukan 15 sampai 30% |

## 3. Pesaing (ringkas)

Semua pemain lokal gratis: Teman Bumil (tracker dan komunitas), PrimaKu (IDAI, kurva tumbuh), Tentang Anak (menu MPASI dengan hitungan gizi), Asianparent. Tidak ada yang menyusun menu harian ibu hamil dan menyusui dengan target gizi terhitung, AI yang menyesuaikan ngidam atau penolakan anak, dan rujukan di tiap saran.

Pembanding berbayar global: The Prenatal Nutritionist USD 19.99/bulan (dengan ahli gizi), Solid Starts USD 99.99/tahun, NutriMom USD 9.99/bulan (AI saja).

Implikasi: Mommy Plate menang lewat narasi, kemudahan, dan kepercayaan (rujukan), bukan lewat fitur AI semata.

## 4. Produk dan harga (hipotesis)

| Tier | Isi | Harga |
|---|---|---|
| Gratis | Cek "aman nggak dimakan bumil?", panduan MPASI per bahan, kalkulator kebutuhan gizi, menu 3 hari | Rp0 |
| Plus bulanan | Menu harian personal, chat AI, catat sekali tap, grafik, daftar belanja | Rp149.000 (uji juga Rp99.000) |
| Plus tahunan | Sama | Rp1.490.000 |
| Paket Kehamilan | Plus sampai melahirkan, prabayar | sekitar 7x harga bulanan |
| Founding member (pre-order) | Plus 1 tahun untuk 200 pendaftar pertama | Rp799.000 |

Nilai di `src/content/site.ts` bisa diubah tanpa menyentuh tampilan.

## 5. Pengaman wajib (karena tanpa ahli gizi harian)

1. Angka gizi dihitung kode dari AKG 2019 dan TKPI 2017. AI tidak boleh mengeluarkan angka gizi sendiri.
2. Aturan larangan tertanam di kode: makanan berisiko saat hamil (ikan tinggi merkuri, makanan mentah, susu tidak dipasteurisasi, hati berlebihan, jamu), madu dan tambahan garam atau gula di bawah 1 tahun, makanan risiko tersedak.
3. Batas cakupan saat pendaftaran: diabetes gestasional, preeklamsia, anemia berat, alergi terdiagnosis, bayi prematur, gizi buruk tidak diberi menu personal dan diarahkan ke dokter.
4. Deteksi tanda bahaya (perdarahan, gerakan janin berkurang, muntah hebat, reaksi alergi): AI tidak menjawab, langsung arahkan ke dokter atau IGD.
5. Rujukan hanya dari perpustakaan terkurasi (WHO, Kemenkes, IDAI, AKG, jurnal terindeks). Tidak ada sumber, tidak ada jawaban.
6. Ahli gizi lepas per proyek: review database, aturan, resep awal, 300 pertanyaan uji sebelum rilis, audit sampel percakapan tiap bulan.
7. Tombol "laporkan jawaban", disclaimer, persetujuan data sesuai UU PDP 27/2022.

## 6. MVP

- Profil keluarga multi-anggota: hamil (trimester), menyusui, MPASI
- Menu harian otomatis dengan tombol "ganti"
- Chat AI: ngidam, anak menolak makanan, "isi kulkas saya cuma ini"
- Catat makan sekali tap dan indikator pencapaian gizi harian
- Grafik kenaikan berat badan hamil dan kurva pertumbuhan WHO
- Daftar belanja mingguan, bisa dikirim ke ART lewat WhatsApp
- Pengingat jadwal makan lewat WhatsApp (notifikasi PWA di iPhone terbatas)
- Bahasa Indonesia dan English, tema terang dan gelap

## 7. Status (22 Oktober 2026)

Aplikasi beta sudah bisa dipakai di `/app` tanpa daftar tunggu: data keluarga, menu 7 hari, catat makan, chat, kurva pertumbuhan WHO, dan daftar belanja. Data tersimpan di browser pengguna. Belum ada akun, sinkronisasi, dan pembayaran. Tabel kandungan gizi bahan masih draft dan wajib diverifikasi ahli gizi sebelum dijual.

## 8. Rencana kerja

| Minggu | Kegiatan | Ukuran berhasil |
|---|---|---|
| 1 sampai 4 | Landing page, waitlist, pre-order founding member | 100 pre-order. Di bawah 30: ubah harga atau pesan sebelum membangun |
| 2 sampai 10 | Ahli gizi lepas untuk database dan aturan, bangun MVP | Lolos 300 pertanyaan uji |
| 10 sampai 12 | Beta untuk founding member, lalu rilis | Retensi bulan pertama |

## 9. Keputusan yang masih terbuka

- Harga final setelah uji Rp99.000 vs Rp149.000
- Kebijakan perangkat: batas 2 perangkat vs paket keluarga dengan peran (Owner, Partner, Caregiver)
- Merek "Mommy Plate": cek PDKI DJKI (kelas 9, 42, 44), domain mommyplate.id/.com, dan akun IG/TikTok. Kata umum bahasa Inggris, jadi pendaftaran merek bisa lebih sulit; ada produk piring bayi "Momma Warm Plate" (Lansinoh) di kategori barang
- Status hukum layanan gizi digital tanpa tenaga kesehatan: konsultasikan ke konsultan hukum kesehatan
