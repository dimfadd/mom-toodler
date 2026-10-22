// Landing page copy in Bahasa Indonesia and English.
// [[n]] marks a citation to references.ts. {key} marks a value filled from site.ts.

import { site } from "./site";

export type Lang = "id" | "en";

const B = site.name;

const id = {
  meta: {
    title: `${B}: menu harian bergizi untuk ibu hamil, menyusui, dan MPASI`,
    description:
      `${B} menyusun menu harian keluarga sesuai selera, budget, dan target gizi AKG Kemenkes. Setiap saran disertai rujukan yang bisa dicek.`,
  },
  nav: {
    demo: "Demo",
    features: "Fitur",
    trust: "Rujukan",
    pricing: "Harga",
    cta: "Mulai",
    menu: "Menu",
    close: "Tutup menu",
    themeToDark: "Ganti ke mode gelap",
    themeToLight: "Ganti ke mode terang",
    language: "Bahasa",
  },
  hero: {
    eyebrow: "Untuk ibu hamil, ibu menyusui, dan anak sampai usia 12 tahun",
    title: "Ngidam tetap dituruti. Gizinya tetap cukup.",
    body: `${B} menyusun menu harian keluargamu: mengikuti selera hari itu, budget belanja, dan target gizi harian dari AKG Kemenkes[[3]]. Setiap saran datang dengan rujukan yang bisa kamu cek sendiri.`,
    primary: "Mulai susun menu gratis",
    secondary: "Lihat demo",
    note: "Versi beta: gratis dipakai sekarang, data keluarga tersimpan di HP-mu.",
  },
  chat: {
    caption: "Contoh percakapan. Tampilan akhir aplikasi bisa berbeda.",
    who: "Ibu, trimester 2",
    user: "Siang ini pengen yang pedas dan segar. Bosan ayam.",
    reply:
      "Bisa. Makan siang diganti pepes ikan kembung kemangi, nasi merah, dan tumis kangkung. Sambalnya dipisah supaya pedasnya bisa kamu atur.",
    status: "Menu hari ini sudah disesuaikan dengan target gizimu.",
    source: "Target dari AKG 2019",
  },
  demo: {
    kicker: "Lihat dulu sebelum mencoba",
    title: "Begini rasanya memakai Mommy Plate sehari.",
    body: "Contohnya keluarga Rina: hamil 24 minggu, dengan Kakak yang berusia 2 tahun. Menu, porsi, dan angka di layar dihitung langsung oleh mesin gizi yang sama dengan aplikasinya. Silakan ketuk layarnya.",
    pick: "Pilih layar demo",
    steps: [
      { id: "hari-ini", title: "Hari ini", body: "Satu angka untuk satu hari: berapa persen target gizi yang sudah terpenuhi. Ketuk Catat setelah makan dan lihat cincinnya bertambah." },
      { id: "menu", title: "Menu sekeluarga", body: "Porsi dalam gram untuk tiap orang. Kakak makan menu yang sama dengan ibunya, porsinya disesuaikan usia, jadi cukup masak sekali." },
      { id: "chat", title: "Chat saat ngidam", body: "Lagi pengen yang pedas? Kirim pesan, menu makan siang diganti dan gizi hari itu dihitung ulang." },
      { id: "progres", title: "Pertumbuhan anak", body: "Berat dan tinggi Kakak dibandingkan kurva WHO. Kalau mulai menjauh dari rentang normal, aplikasi memberi tahu lebih awal." },
      { id: "belanja", title: "Daftar belanja", body: "Bahan untuk seminggu dirangkum otomatis dengan perkiraan biaya, lalu bisa dikirim ke WhatsApp." },
    ],
    tryCta: "Coba dengan keluarga contoh",
    startCta: "Mulai dengan keluargaku",
    note: "Data contoh. Kandungan gizi bahan masih versi beta.",
  },
  why: {
    kicker: "Kenapa sekarang",
    title: "Seribu hari yang membentuk sisanya.",
    p1: "Dari awal kehamilan sampai ulang tahun kedua, kira-kira 1000 hari. Di masa ini, gizi ikut menentukan perkembangan otak dan kesehatan anak sampai dewasa, dan kekurangan yang terjadi tidak selalu bisa dikejar belakangan[[1]].",
    p2: "Hampir semua orang tua sudah tahu gizi itu penting. Yang sulit adalah menerjemahkannya jadi menu hari ini, untuk ibu yang sedang mual atau anak yang sedang menolak makan.",
    p3: `${B} memberi perhatian khusus pada 1000 hari pertama, dan menu tetap menyesuaikan sampai anak berusia 12 tahun.`,
  },
  moments: {
    kicker: "Untuk hari yang tidak sesuai rencana",
    title: "Rencana makan yang ikut menyesuaikan.",
    items: [
      {
        when: "Trimester pertama",
        problem: "Semua bau bikin mual.",
        answer:
          `Ceritakan apa yang sedang tidak bisa masuk. ${B} menyusun ulang menu dari makanan yang masih bisa kamu terima, lalu menghitung ulang sisa hari supaya target tetap terkejar.`,
      },
      {
        when: "Jam 7 pagi",
        problem: "Si kecil menolak telur lagi.",
        answer:
          "Tekan ganti. Protein sarapan diganti sumber lain, dan telur dijadwalkan muncul lagi dalam bentuk berbeda. Banyak anak perlu mencicipi makanan berulang kali sebelum mau menerimanya[[6]].",
      },
      {
        when: "Akhir pekan",
        problem: "Kulkas tinggal tahu, bayam, dan sisa ayam.",
        answer: `Ketik isinya. ${B} menyusun menu dari bahan yang ada, sesuai budget minggu ini.`,
      },
      {
        when: "Setiap hari",
        problem: "Masak untuk ibu, si kecil, dan seisi rumah.",
        answer:
          "Satu menu dasar disesuaikan untuk tiap anggota keluarga. Kamu tidak perlu masak tiga kali.",
      },
    ],
  },
  features: {
    kicker: `Isi ${B} Plus`,
    title: "Satu tempat untuk urusan makan keluarga.",
    note: "Semua fitur di bawah sudah bisa dicoba di versi beta.",
    demo: "Buka aplikasinya",
    lead: {
      title: "Menu harian dengan target gizi",
      body: "Sarapan sampai camilan, disusun dari target AKG 2019 sesuai fase: trimester kehamilan, menyusui, atau usia MPASI[[3]]. Kandungan gizi bahan diambil dari Tabel Komposisi Pangan Indonesia, jadi tempe, daun kelor, dan ikan kembung ikut dihitung[[4]].",
    },
    list: [
      {
        title: "Chat untuk ngidam dan penolakan",
        body: "Bilang apa yang kamu mau atau apa yang ditolak si kecil. Menu diganti, target tetap dijaga.",
      },
      {
        title: "Panduan MPASI",
        body: "Tahapan dan menu MPASI mengikuti pedoman WHO 2023 untuk usia 6 sampai 23 bulan[[2]].",
      },
      {
        title: "Catat sekali tap",
        body: "Habis, sebagian, atau tidak dimakan. Tidak perlu menimbang atau mengetik.",
      },
      {
        title: "Grafik pertumbuhan",
        body: "Berat dan panjang badan si kecil dibandingkan dengan Standar Pertumbuhan Anak WHO[[5]].",
      },
      {
        title: "Daftar belanja mingguan",
        body: "Tersusun otomatis dari menu, bisa dikirim ke WhatsApp pasangan atau asisten rumah tangga.",
      },
      {
        title: "Mode terang dan gelap",
        body: "Nyaman dipakai siang dan malam.",
      },
    ],
  },
  trust: {
    kicker: "Rujukan",
    title: "Setiap saran punya sumber. Kamu bisa mengeceknya.",
    items: [
      {
        title: "Angka gizi dihitung, bukan ditebak.",
        body: "Target harian diambil dari AKG Permenkes 28/2019 dan kandungan bahan dari TKPI[[3]][[4]]. Asisten chat tidak mengarang angka. Selama beta, data kandungan bahan sedang diverifikasi ahli gizi.",
      },
      {
        title: "Rujukan dari sumber yang jelas.",
        body: `Hanya pedoman WHO, Kemenkes, IDAI, dan jurnal ilmiah yang bisa dibuka. Kalau sumbernya tidak ada, ${B} bilang tidak tahu.`,
      },
      {
        title: "Tahu batas.",
        body: `Untuk kondisi seperti diabetes gestasional, preeklamsia, alergi yang sudah didiagnosis, atau bayi prematur, ${B} tidak membuat menu personal dan mengarahkan ke dokter.`,
      },
      {
        title: "Tanda bahaya langsung diarahkan.",
        body: `Perdarahan, gerakan janin berkurang, muntah terus-menerus, atau reaksi alergi pada anak: ${B} menyarankan segera ke dokter atau IGD, bukan memberi saran menu.`,
      },
    ],
    disclaimer:
      `${B} membantu urusan dapur sehari-hari. Pemeriksaan kehamilan dan tumbuh kembang tetap di dokter dan bidanmu.`,
  },
  pricing: {
    kicker: "Harga",
    title: "Gratis selama beta. Setelahnya, harga khusus untuk {seats} pelanggan pertama.",
    plan: `${B} Plus, 12 bulan`,
    normal: "Harga normal setelah beta {yearly} per tahun",
    perks: [
      `Semua fitur ${B} Plus selama 12 bulan`,
      "Semua fitur baru yang rilis selama 12 bulan itu",
      "Harga ini hanya untuk {seats} pelanggan pertama",
    ],
    cta: "Pre-order {founding}",
    ctaFree: "Mulai gratis sekarang",
    afterTitle: "Setelah beta",
    monthly: "Bulanan",
    yearly: "Tahunan",
    perMonth: "per bulan",
    perYear: "per tahun",
    yearlyNote: "setara {yearlyPerMonth} per bulan",
    free: "Selama beta, semua fitur bisa dipakai gratis tanpa kartu kredit.",
  },
  faq: {
    kicker: "Pertanyaan",
    title: "Yang sering ditanyakan sebelum mulai.",
    items: [
      {
        q: `Apakah ${B} menggantikan dokter kandungan, dokter anak, atau ahli gizi?`,
        a: `Tidak. ${B} membantu menyusun dan mencatat menu harian. Pemeriksaan, diagnosis, dan pengobatan tetap di tenaga kesehatan.`,
      },
      {
        q: `Saya punya diabetes gestasional, atau anak saya punya alergi. Apakah bisa pakai ${B}?`,
        a: `Kamu tetap bisa memakai daftar belanja dan pencatatan, tapi ${B} tidak membuat menu personal untuk kondisi medis. Menu untuk kondisi ini sebaiknya disusun bersama dokter atau ahli gizi yang menanganimu.`,
      },
      {
        q: "Kenapa harus bayar kalau bisa tanya chatbot gratis?",
        a: `Chatbot umum bisa menjawab pertanyaan, tapi tidak menyimpan profil keluargamu, tidak menghitung gizi dari tabel pangan Indonesia, dan tidak selalu menunjukkan sumber yang bisa dicek. ${B} menyusun menu harian lengkap, mencatat apa yang benar-benar dimakan, dan menunjukkan rujukannya.`,
      },
      {
        q: "Bisa dipakai di iPhone dan Android?",
        a: `Bisa. ${B} berjalan di browser dan bisa dipasang ke layar utama seperti aplikasi biasa, di iPhone maupun Android.`,
      },
      {
        q: "Anak saya sudah lebih dari 2 tahun. Apakah ada menunya?",
        a: "Ada. Target gizi mengikuti AKG 2019 untuk usia 1 sampai 12 tahun. Kurva pertumbuhan di aplikasi saat ini mencakup usia 0 sampai 5 tahun.",
      },
      {
        q: "Data keluarga saya disimpan di mana?",
        a: `Di browser HP-mu. Data tidak dikirim ke server, kecuali saat memakai chat: pesanmu, nama panggilan, dan menu hari ini dikirim untuk diproses asisten.`,
      },
    ],
  },
  footer: {
    refsTitle: "Rujukan di halaman ini",
    disclaimer:
      `${B} adalah alat bantu perencanaan makan dan tidak menggantikan saran medis. Konsultasikan kondisi kesehatan dengan dokter atau tenaga kesehatan.`,
    rights: `© {year} ${B}`,
    cite: "Lihat rujukan {n}",
  },
};

export type Copy = typeof id;

const en: Copy = {
  meta: {
    title: `${B}: daily meal plans for pregnancy, breastfeeding, and first foods`,
    description:
      `${B} plans your family's daily meals around cravings, budget, and Indonesian dietary reference intakes. Every suggestion comes with a source you can check.`,
  },
  nav: {
    demo: "Demo",
    features: "Features",
    trust: "Sources",
    pricing: "Pricing",
    cta: "Start",
    menu: "Menu",
    close: "Close menu",
    themeToDark: "Switch to dark mode",
    themeToLight: "Switch to light mode",
    language: "Language",
  },
  hero: {
    eyebrow: "For pregnant mothers, breastfeeding mothers, and children up to 12",
    title: "Cravings, honored. Nutrition, covered.",
    body: `${B} plans your family's meals for the day around what you feel like eating, your grocery budget, and daily nutrition targets from Indonesia's dietary reference intakes (AKG)[[3]]. Every suggestion comes with a source you can check yourself.`,
    primary: "Plan today's meals free",
    secondary: "See the demo",
    note: "Beta: free to use now, and your family's data stays on your phone.",
  },
  chat: {
    caption: "Sample conversation. The final app may look different.",
    who: "Mom, second trimester",
    user: "I want something spicy and fresh for lunch. Tired of chicken.",
    reply:
      "Sure. Lunch is now steamed mackerel pepes with basil, brown rice, and stir-fried water spinach. The sambal is on the side so you control the heat.",
    status: "Today's menu still meets your nutrition targets.",
    source: "Targets from AKG 2019",
  },
  demo: {
    kicker: "Look before you try",
    title: "A day with Mommy Plate.",
    body: "Meet Rina, 24 weeks pregnant, and her 2-year-old. The menus, portions and numbers on screen are calculated live by the same nutrition engine as the app. Go ahead and tap the screen (the app itself is in Indonesian).",
    pick: "Choose a demo screen",
    steps: [
      { id: "hari-ini", title: "Today", body: "One number for the day: how much of the nutrition target is met. Tap log after a meal and watch the ring fill." },
      { id: "menu", title: "One menu for the family", body: "Portions in grams for each person. The toddler eats the same dish as her mother, sized for her age, so you cook once." },
      { id: "chat", title: "Chat for cravings", body: "Craving something spicy? Send a message, lunch is swapped and the day's nutrition is recalculated." },
      { id: "progres", title: "Child growth", body: "Weight and height plotted against the WHO curves. If she starts drifting out of the normal range, the app flags it early." },
      { id: "belanja", title: "Shopping list", body: "A week of ingredients summed up with an estimated cost, ready to send on WhatsApp." },
    ],
    tryCta: "Try it with the example family",
    startCta: "Start with my family",
    note: "Example data. Food composition values are still in beta.",
  },
  why: {
    kicker: "Why now",
    title: "A thousand days that shape the rest.",
    p1: "From early pregnancy to a child's second birthday is roughly 1000 days. Nutrition during this window shapes brain development and health into adulthood, and early shortfalls cannot always be made up later[[1]].",
    p2: "Most parents already know nutrition matters. The hard part is turning it into today's menu, for a mother who feels queasy or a toddler who refuses to eat.",
    p3: `${B} pays special attention to the first 1000 days, and keeps adjusting menus until your child turns 12.`,
  },
  moments: {
    kicker: "For days that don't go to plan",
    title: "A meal plan that adjusts with you.",
    items: [
      {
        when: "First trimester",
        problem: "Every smell makes you nauseous.",
        answer:
          `Tell ${B} what you can't stomach right now. It rebuilds the menu from foods you can still manage, then recalculates the rest of the day so you stay on target.`,
      },
      {
        when: "7 a.m.",
        problem: "Your toddler refuses eggs again.",
        answer:
          "Tap swap. Breakfast protein comes from another source, and eggs come back later in a different form. Many children need to taste a food several times before they accept it[[6]].",
      },
      {
        when: "Weekend",
        problem: "The fridge has tofu, spinach, and leftover chicken.",
        answer: `Type what's there. ${B} builds a menu from what you have, within this week's budget.`,
      },
      {
        when: "Every day",
        problem: "Cooking for mom, baby, and the whole household.",
        answer: "One base menu, adjusted for each family member. No need to cook three times.",
      },
    ],
  },
  features: {
    kicker: `Inside ${B} Plus`,
    title: "One place for your family's meals.",
    note: "Everything below is ready to try in the beta.",
    demo: "Open the app (Indonesian)",
    lead: {
      title: "Daily menus with nutrition targets",
      body: "Breakfast to snacks, planned from AKG 2019 targets for your stage: trimester, breastfeeding, or first-foods age[[3]]. Ingredient values come from the Indonesian Food Composition Table, so tempeh, moringa leaves, and mackerel are all counted[[4]].",
    },
    list: [
      {
        title: "Chat for cravings and refusals",
        body: "Say what you want or what your little one refused. The menu changes, the targets stay.",
      },
      {
        title: "First foods guide",
        body: "Stages and menus follow the 2023 WHO guideline for ages 6 to 23 months[[2]].",
      },
      {
        title: "One-tap logging",
        body: "Finished, partly eaten, or refused. No weighing or typing.",
      },
      {
        title: "Growth charts",
        body: "Your child's weight and length compared with the WHO Child Growth Standards[[5]].",
      },
      {
        title: "Weekly shopping list",
        body: "Built from your menu, ready to send to your partner or household helper on WhatsApp.",
      },
      {
        title: "Light and dark mode",
        body: "Comfortable day and night. The app itself is in Indonesian for now.",
      },
    ],
  },
  trust: {
    kicker: "Sources",
    title: "Every suggestion has a source. You can check it.",
    items: [
      {
        title: "Nutrition numbers are calculated, not guessed.",
        body: "Daily targets come from AKG (Health Ministry Regulation 28/2019) and ingredient values from TKPI[[3]][[4]]. The chat assistant does not make up numbers. During the beta, ingredient values are being checked by a nutritionist.",
      },
      {
        title: "Sources you can open.",
        body: `Only guidelines from WHO, the Indonesian Ministry of Health, IDAI, and peer-reviewed journals. When there is no source, ${B} says it doesn't know.`,
      },
      {
        title: "Knows its limits.",
        body: `For conditions such as gestational diabetes, preeclampsia, diagnosed allergies, or premature babies, ${B} does not create a personal menu and points you to a doctor.`,
      },
      {
        title: "Warning signs go straight to care.",
        body: `Bleeding, reduced fetal movement, persistent vomiting, or an allergic reaction in a child: ${B} tells you to see a doctor or go to the ER, not what to eat.`,
      },
    ],
    disclaimer:
      `${B} helps with everyday kitchen decisions. Prenatal checkups and growth monitoring stay with your doctor and midwife.`,
  },
  pricing: {
    kicker: "Pricing",
    title: "Free during the beta. After that, a special price for the first {seats} subscribers.",
    plan: `${B} Plus, 12 months`,
    normal: "Regular price after the beta {yearly} per year",
    perks: [
      `All ${B} Plus features for 12 months`,
      "Every new feature released during those 12 months",
      "This price is only for the first {seats} subscribers",
    ],
    cta: "Pre-order for {founding}",
    ctaFree: "Start free now",
    afterTitle: "After the beta",
    monthly: "Monthly",
    yearly: "Yearly",
    perMonth: "per month",
    perYear: "per year",
    yearlyNote: "about {yearlyPerMonth} per month",
    free: "During the beta, every feature is free, no credit card needed.",
  },
  faq: {
    kicker: "Questions",
    title: "What people ask before starting.",
    items: [
      {
        q: `Does ${B} replace my obstetrician, pediatrician, or dietitian?`,
        a: `No. ${B} helps you plan and log daily meals. Checkups, diagnosis, and treatment stay with health professionals.`,
      },
      {
        q: `I have gestational diabetes, or my child has an allergy. Can I use ${B}?`,
        a: `You can still use the shopping list and logging, but ${B} does not create personal menus for medical conditions. Those menus are best planned with the doctor or dietitian treating you.`,
      },
      {
        q: "Why pay when I can ask a free chatbot?",
        a: `A general chatbot can answer questions, but it doesn't keep your family's profile, doesn't calculate nutrition from Indonesian food tables, and doesn't always show a source you can check. ${B} plans complete daily menus, logs what was actually eaten, and shows its sources.`,
      },
      {
        q: "Does it work on iPhone and Android?",
        a: `Yes. ${B} runs in the browser and can be added to your home screen like a regular app, on iPhone and Android.`,
      },
      {
        q: "My child is over 2. Is there a menu for them?",
        a: "Yes. Targets follow AKG 2019 for ages 1 to 12. Growth charts in the app currently cover ages 0 to 5.",
      },
      {
        q: "Where is my family's data stored?",
        a: "In your phone's browser. Nothing is sent to a server except when you use chat: your message, first names, and today's menu are sent to the assistant.",
      },
    ],
  },
  footer: {
    refsTitle: "Sources on this page",
    disclaimer:
      `${B} is a meal planning tool and does not replace medical advice. Consult a doctor or health professional about any health condition.`,
    rights: `© {year} ${B}`,
    cite: "See source {n}",
  },
};

export const copy: Record<Lang, Copy> = { id, en };
