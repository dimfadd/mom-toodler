# Sistem Desain Mommy Plate

Setiap keputusan desain di bawah punya alasan dari cara manusia melihat, membaca, dan membentuk kebiasaan. Label keyakinan: **[Kuat]** untuk temuan riset yang mapan, **[Sedang]** untuk temuan yang konsisten tapi bergantung konteks, **[Lemah]** untuk klaim populer yang bukti ilmiahnya tipis.

Aplikasinya ada di `/app`.

## 1. Pengguna dan kondisinya

- Ibu hamil: sering mual dan lelah, membuka aplikasi sambil melakukan hal lain.
- Ibu dengan bayi: satu tangan menggendong, perhatian terpecah, sering cemas soal "cukup nggak ya".
- Kesimpulan desain: setiap layar harus bisa dipahami dalam beberapa detik, bisa dipakai dengan satu jempol, dan tidak boleh membuat pengguna merasa bersalah.

## 2. Warna

| Peran | Terang | Gelap | Alasan |
|---|---|---|---|
| Latar | Krem `#fbf7f0` | Hijau sangat gelap `#121a16` | Lebih lembut di mata daripada putih murni untuk membaca lama, terasa seperti dapur, bukan rumah sakit |
| Utama | Hijau daun `#2e5a43` | `#8cc5a2` | Hijau diasosiasikan dengan alam, kesehatan, dan "aman" **[Sedang: asosiasi warna dipelajari secara budaya, bukan bawaan]** |
| Aksen | Terakota `#a34a24` | `#e58a5f` | Hanya untuk rujukan dan label kecil. Satu aksen yang konsisten membuat mata belajar artinya |
| Perhatian | Oker `#8a5a00` | `#e0b04a` | Untuk "perlu ditambah". Sengaja bukan merah supaya tidak memicu panik |
| Bahaya | Merah `#b42318` | `#f97066` | **Hanya** untuk tanda bahaya medis. Kalau merah dipakai untuk hal kecil, orang belajar mengabaikannya |

Aturan:
- **Warna tidak pernah berdiri sendiri.** Setiap status selalu disertai ikon dan kata (Tercapai, Perlu perhatian). Sekitar 8% laki-laki punya buta warna merah-hijau **[Kuat]**, termasuk ayah yang ikut memakai aplikasi.
- **Kontras minimal WCAG AA** (4,5:1 untuk teks biasa) di kedua tema. Semua pasangan warna di atas sudah dicek.
- Palet dibatasi: 2 warna inti, 1 aksen, ditambah warna status. Semakin sedikit warna, semakin cepat orang memahami artinya **[Sedang]**.
- Catatan jujur: klaim populer seperti "oranye menambah nafsu makan" atau "hijau menenangkan" buktinya lemah **[Lemah]**. Yang terbukti kuat adalah kontras, konsistensi, dan makna yang dipelajari.

## 3. Tipografi

- **Satu keluarga huruf: Nexa Pro** (geometris, berbayar dari Fontfabric) untuk judul dan teks. Bentuk huruf yang bulat dan rapi terasa modern dan ramah, cocok untuk merek premium yang tetap hangat.
- **Cadangan: Montserrat** (gratis, geometris, bentuknya paling dekat). Dipakai otomatis sampai file Nexa Pro berlisensi ditaruh di `public/fonts`.
- Font geometris lebih lebar dari font biasa, jadi judul diberi `tracking-tight` dan logo dijaga tetap satu baris di HP.
- Ukuran teks minimal 15 sampai 16 px di HP. Panjang baris 45 sampai 75 karakter karena itu rentang paling nyaman dibaca **[Sedang]**.
- Angka penting (persentase, harga, gram) memakai angka sejajar (tabular) supaya mudah dibandingkan.

## 4. Tata letak dan interaksi

| Prinsip | Penerapan |
|---|---|
| **Jangkauan jempol** (Fitts's law: target besar dan dekat lebih cepat disentuh **[Kuat]**) | Navigasi di bawah layar, tombol utama tinggi 48 px, semua target sentuh minimal 44 px |
| **Sedikit pilihan, keputusan cepat** (Hick's law **[Kuat]**) | Beranda hanya punya satu aksi utama: "Catat" atau "Ganti menu" untuk makan berikutnya |
| **Pola yang sudah dikenal** (Jakob's law **[Sedang]**) | Chat mirip WhatsApp, navigasi bawah mirip aplikasi populer, cincin progres mirip aplikasi olahraga |
| **Detail muncul saat dibutuhkan** (progressive disclosure) | Beranda menampilkan ringkasan, detail tren dan kurva ada di tab Progres |
| **Desain yang indah terasa lebih mudah dipakai** (aesthetic-usability effect **[Sedang]**) | Alasan tampilan tetap dibuat rapi walaupun fungsinya sederhana |

## 5. Grafik

| Kebutuhan | Bentuk | Alasan |
|---|---|---|
| Ringkasan hari ini | Cincin | Satu angka besar dipahami sekilas. Cincin yang hampir penuh mendorong orang menyelesaikannya (goal-gradient effect **[Sedang]**) |
| Per nutrisi | Batang horizontal | Panjang lebih mudah dibandingkan daripada sudut atau luas **[Kuat]**, jadi tidak memakai pie chart |
| 7 hari terakhir | Batang vertikal dengan garis target putus-putus | Langsung terlihat hari mana yang di bawah target |
| Pertumbuhan anak | Garis dengan pita rentang normal WHO | Format yang sama dengan buku KIA dan dokter anak, jadi orang tua sudah familiar |
| Pengenalan makanan | Deretan titik | Setiap percobaan terlihat. Orang tua melihat kemajuan walaupun anak belum mau |

Aturan grafik: label ditulis langsung di grafik (bukan legenda jauh), setiap grafik punya kalimat kesimpulan dalam teks, dan data yang belum resmi diberi label "ilustrasi".

## 6. Membentuk kebiasaan tanpa rasa bersalah

Kerangka Fogg (perilaku terjadi saat motivasi, kemampuan, dan pemicu bertemu **[Sedang]**):
- **Pemicu:** pengingat WhatsApp di jam makan, karena aplikasi ini paling sering dibuka orang Indonesia.
- **Kemampuan:** mencatat cukup satu ketukan (Habis, Sebagian, Tidak dimakan), tanpa menimbang atau mengetik.
- **Motivasi:** cincin yang terisi, catatan "Protein tercapai 6 dari 7 hari", dan titik kemajuan pengenalan makanan.

Yang sengaja **dihindari**:
- **Streak yang bisa putus.** Ibu hamil dan ibu bayi sudah cukup cemas. Yang dipakai adalah "5 dari 7 hari", bukan "streak kamu hilang".
- **Bahasa menyalahkan.** Bukan "Kamu gagal memenuhi zat besi", tapi "Zat besi paling rendah. Menu sisa hari ini sudah menghitungnya." Selalu disertai solusi.
- **Dark pattern** seperti hitung mundur palsu, sisa kuota palsu, atau pembatalan langganan yang dipersulit.

## 7. Kepercayaan

- Nomor rujukan kecil berwarna terakota di setiap klaim, bisa diklik ke sumbernya.
- Tanda bahaya medis tampil berbeda (kotak merah, judul "Perlu diperiksa dokter") dan tidak pernah dijawab dengan saran menu.
- Data contoh selalu diberi label. Jangan pernah menampilkan angka yang terlihat resmi padahal belum dihitung.

## 8. Mode gelap dan bahasa

- Tema mengikuti pengaturan HP, bisa diganti manual, dan pilihan disimpan.
- Mode gelap bukan sekadar warna dibalik: hijau dan aksen dibuat lebih terang supaya kontras tetap AA.
- Bahasa Indonesia sebagai bawaan, English tersedia di landing page. Prototipe aplikasi baru dalam Bahasa Indonesia.

## 9. Hasil review warna (Oktober 2026)

Palet dipertahankan. Alasannya:
- **Hijau sebagai warna utama** cocok untuk produk makanan dan kesehatan: asosiasi segar, alami, dan aman. Asosiasi ini dipelajari secara budaya, tapi konsisten di pasar Indonesia **[Sedang]**.
- **Krem sebagai latar** membuat halaman terasa seperti dapur dan buku resep, bukan klinik. Ini penting untuk ibu yang sudah cukup cemas.
- **Terakota hanya untuk rujukan dan label** memberi kehangatan tanpa bersaing dengan tombol utama.
- **Merah dipakai hanya untuk tanda bahaya** supaya tetap punya arti saat benar-benar muncul.
- Yang tidak diubah karena buktinya lemah: klaim "oranye menambah nafsu makan" atau "pink lebih keibuan" **[Lemah]**. Mengganti warna hanya berdasarkan klaim itu berisiko membuat tampilan generik tanpa manfaat yang terbukti.

## 10. Responsif

| Lebar | Tata letak |
|---|---|
| HP (< 768 px) | Satu kolom, navigasi bawah di aplikasi, tombol selebar layar |
| Tablet (768 sampai 1023 px) | Landing tetap satu kolom supaya judul tidak terjepit. Aplikasi memakai navigasi samping |
| iPad landscape dan PC (≥ 1024 px) | Landing dua kolom di hero, alasan, dan rujukan. Aplikasi dua kolom di Hari ini, Progres, dan Belanja |
