// Landing page copy in Bahasa Indonesia and English.
// [[n]] marks a citation to references.ts. {key} marks a value filled from site.ts.

export type Lang = "id" | "en";

const id = {
  meta: {
    title: "Nourish: menu harian bergizi untuk ibu hamil, menyusui, dan MPASI",
    description:
      "Nourish menyusun menu harian keluarga sesuai selera, budget, dan target gizi AKG Kemenkes. Setiap saran disertai rujukan yang bisa dicek.",
  },
  nav: {
    features: "Fitur",
    trust: "Rujukan",
    pricing: "Harga",
    cta: "Daftar",
    menu: "Menu",
    close: "Tutup menu",
    themeToDark: "Ganti ke mode gelap",
    themeToLight: "Ganti ke mode terang",
    language: "Bahasa",
  },
  hero: {
    eyebrow: "Untuk ibu hamil, ibu menyusui, dan si kecil usia 6 sampai 24 bulan",
    title: "Ngidam tetap dituruti. Gizinya tetap cukup.",
    body: "Nourish menyusun menu harian keluargamu: mengikuti selera hari itu, budget belanja, dan target gizi harian dari AKG Kemenkes[[3]]. Setiap saran datang dengan rujukan yang bisa kamu cek sendiri.",
    primary: "Amankan harga founding member",
    secondary: "Masuk daftar tunggu gratis",
    note: "Beta dibuka {beta}.",
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
  why: {
    kicker: "Kenapa sekarang",
    title: "Seribu hari yang membentuk sisanya.",
    p1: "Dari awal kehamilan sampai ulang tahun kedua, kira-kira 1000 hari. Di masa ini, gizi ikut menentukan perkembangan otak dan kesehatan anak sampai dewasa, dan kekurangan yang terjadi tidak selalu bisa dikejar belakangan[[1]].",
    p2: "Hampir semua orang tua sudah tahu gizi itu penting. Yang sulit adalah menerjemahkannya jadi menu hari ini, untuk ibu yang sedang mual atau anak yang sedang menolak makan.",
    p3: "Nourish mulai dari 1000 hari pertama. Pendampingan untuk anak 2 sampai 12 tahun menyusul.",
  },
  moments: {
    kicker: "Untuk hari yang tidak sesuai rencana",
    title: "Rencana makan yang ikut menyesuaikan.",
    items: [
      {
        when: "Trimester pertama",
        problem: "Semua bau bikin mual.",
        answer:
          "Ceritakan apa yang sedang tidak bisa masuk. Nourish menyusun ulang menu dari makanan yang masih bisa kamu terima, lalu menghitung ulang sisa hari supaya target tetap terkejar.",
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
        answer: "Ketik isinya. Nourish menyusun menu dari bahan yang ada, sesuai budget minggu ini.",
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
    kicker: "Isi Nourish Plus",
    title: "Satu tempat untuk urusan makan keluarga.",
    note: "Fitur berikut sedang dibangun untuk versi beta.",
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
        title: "Dua bahasa, dua tema",
        body: "Bahasa Indonesia dan English, mode terang dan gelap.",
      },
    ],
  },
  trust: {
    kicker: "Rujukan",
    title: "Setiap saran punya sumber. Kamu bisa mengeceknya.",
    items: [
      {
        title: "Angka gizi dihitung, bukan ditebak.",
        body: "Target harian diambil dari AKG Permenkes 28/2019 dan kandungan bahan dari TKPI[[3]][[4]]. Asisten chat tidak mengarang angka.",
      },
      {
        title: "Rujukan dari sumber yang jelas.",
        body: "Hanya pedoman WHO, Kemenkes, IDAI, dan jurnal ilmiah yang bisa dibuka. Kalau sumbernya tidak ada, Nourish bilang tidak tahu.",
      },
      {
        title: "Tahu batas.",
        body: "Untuk kondisi seperti diabetes gestasional, preeklamsia, alergi yang sudah didiagnosis, atau bayi prematur, Nourish tidak membuat menu personal dan mengarahkan ke dokter.",
      },
      {
        title: "Tanda bahaya langsung diarahkan.",
        body: "Perdarahan, gerakan janin berkurang, muntah terus-menerus, atau reaksi alergi pada anak: Nourish menyarankan segera ke dokter atau IGD, bukan memberi saran menu.",
      },
    ],
    disclaimer:
      "Nourish membantu urusan dapur sehari-hari. Pemeriksaan kehamilan dan tumbuh kembang tetap di dokter dan bidanmu.",
  },
  pricing: {
    kicker: "Harga",
    title: "Harga founding member untuk {seats} pendaftar pertama.",
    plan: "Nourish Plus, 12 bulan",
    normal: "Harga normal setelah rilis {yearly} per tahun",
    perks: [
      "Semua fitur Nourish Plus selama 12 bulan",
      "Akses beta sebelum rilis umum",
      "Uang kembali penuh kalau beta belum dibuka sampai {refund}",
    ],
    cta: "Pre-order {founding}",
    ctaWaitlist: "Pesan harga founding member",
    afterTitle: "Setelah rilis",
    monthly: "Bulanan",
    yearly: "Tahunan",
    perMonth: "per bulan",
    perYear: "per tahun",
    yearlyNote: "setara {yearlyPerMonth} per bulan",
    free: "Versi gratis tetap ada: cek makanan aman untuk ibu hamil dan panduan MPASI per bahan.",
  },
  form: {
    kicker: "Daftar tunggu",
    title: "Kabari saya saat beta dibuka.",
    body: "Gratis dan tanpa kewajiban membeli. Kami kirim kabar lewat email, dan WhatsApp kalau kamu isi.",
    name: "Nama panggilan",
    email: "Email",
    whatsapp: "Nomor WhatsApp (opsional)",
    stage: "Fase saat ini",
    stagePlaceholder: "Pilih salah satu",
    stages: {
      planning: "Merencanakan kehamilan",
      pregnant: "Sedang hamil",
      breastfeeding: "Sedang menyusui",
      mpasi: "Anak usia 6 sampai 24 bulan",
      older: "Anak di atas 2 tahun",
    },
    preorder: "Saya tertarik pre-order harga founding member",
    consent:
      "Saya setuju data ini dipakai untuk menghubungi saya soal Nourish. Data tidak dijual ke pihak lain.",
    submit: "Daftarkan saya",
    submitting: "Mengirim...",
    successTitle: "Terima kasih, {name}.",
    successBody: "Kamu sudah masuk daftar tunggu. Kabar berikutnya kami kirim ke {email}.",
    again: "Daftarkan orang lain",
    errorGeneric: "Pendaftaran gagal terkirim. Coba lagi sebentar lagi.",
    errorContact: "Kalau masih gagal, kirim email ke {email}.",
    errors: {
      name: "Isi nama panggilanmu.",
      email: "Email belum valid.",
      whatsapp: "Nomor WhatsApp hanya angka, 9 sampai 15 digit.",
      stage: "Pilih fase saat ini.",
      consent: "Centang persetujuan untuk melanjutkan.",
    },
  },
  faq: {
    kicker: "Pertanyaan",
    title: "Yang sering ditanyakan sebelum mendaftar.",
    items: [
      {
        q: "Apakah Nourish menggantikan dokter kandungan, dokter anak, atau ahli gizi?",
        a: "Tidak. Nourish membantu menyusun dan mencatat menu harian. Pemeriksaan, diagnosis, dan pengobatan tetap di tenaga kesehatan.",
      },
      {
        q: "Saya punya diabetes gestasional, atau anak saya punya alergi. Apakah bisa pakai Nourish?",
        a: "Kamu tetap bisa memakai daftar belanja dan pencatatan, tapi Nourish tidak membuat menu personal untuk kondisi medis. Menu untuk kondisi ini sebaiknya disusun bersama dokter atau ahli gizi yang menanganimu.",
      },
      {
        q: "Kenapa harus bayar kalau bisa tanya chatbot gratis?",
        a: "Chatbot umum bisa menjawab pertanyaan, tapi tidak menyimpan profil keluargamu, tidak menghitung gizi dari tabel pangan Indonesia, dan tidak selalu menunjukkan sumber yang bisa dicek. Nourish menyusun menu harian lengkap, mencatat apa yang benar-benar dimakan, dan menunjukkan rujukannya.",
      },
      {
        q: "Bisa dipakai di iPhone dan Android?",
        a: "Bisa. Nourish berjalan di browser dan bisa dipasang ke layar utama seperti aplikasi biasa, di iPhone maupun Android.",
      },
      {
        q: "Anak saya sudah lebih dari 2 tahun. Apakah ada menunya?",
        a: "Fokus awal Nourish adalah kehamilan, menyusui, dan MPASI. Menu untuk anak 2 sampai 12 tahun menyusul. Masuk daftar tunggu dulu, kami kabari saat siap.",
      },
      {
        q: "Bagaimana kalau beta terlambat?",
        a: "Kalau beta belum dibuka sampai {refund}, uang pre-order dikembalikan penuh.",
      },
    ],
  },
  footer: {
    refsTitle: "Rujukan di halaman ini",
    disclaimer:
      "Nourish adalah alat bantu perencanaan makan dan tidak menggantikan saran medis. Konsultasikan kondisi kesehatan dengan dokter atau tenaga kesehatan.",
    rights: "© {year} Nourish",
    cite: "Lihat rujukan {n}",
  },
};

export type Copy = typeof id;

const en: Copy = {
  meta: {
    title: "Nourish: daily meal plans for pregnancy, breastfeeding, and first foods",
    description:
      "Nourish plans your family's daily meals around cravings, budget, and Indonesian dietary reference intakes. Every suggestion comes with a source you can check.",
  },
  nav: {
    features: "Features",
    trust: "Sources",
    pricing: "Pricing",
    cta: "Join",
    menu: "Menu",
    close: "Close menu",
    themeToDark: "Switch to dark mode",
    themeToLight: "Switch to light mode",
    language: "Language",
  },
  hero: {
    eyebrow: "For pregnant mothers, breastfeeding mothers, and little ones aged 6 to 24 months",
    title: "Cravings, honored. Nutrition, covered.",
    body: "Nourish plans your family's meals for the day around what you feel like eating, your grocery budget, and daily nutrition targets from Indonesia's dietary reference intakes (AKG)[[3]]. Every suggestion comes with a source you can check yourself.",
    primary: "Lock in the founding member price",
    secondary: "Join the free waitlist",
    note: "Beta opens {beta}.",
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
  why: {
    kicker: "Why now",
    title: "A thousand days that shape the rest.",
    p1: "From early pregnancy to a child's second birthday is roughly 1000 days. Nutrition during this window shapes brain development and health into adulthood, and early shortfalls cannot always be made up later[[1]].",
    p2: "Most parents already know nutrition matters. The hard part is turning it into today's menu, for a mother who feels queasy or a toddler who refuses to eat.",
    p3: "Nourish starts with the first 1000 days. Support for children aged 2 to 12 comes next.",
  },
  moments: {
    kicker: "For days that don't go to plan",
    title: "A meal plan that adjusts with you.",
    items: [
      {
        when: "First trimester",
        problem: "Every smell makes you nauseous.",
        answer:
          "Tell Nourish what you can't stomach right now. It rebuilds the menu from foods you can still manage, then recalculates the rest of the day so you stay on target.",
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
        answer: "Type what's there. Nourish builds a menu from what you have, within this week's budget.",
      },
      {
        when: "Every day",
        problem: "Cooking for mom, baby, and the whole household.",
        answer: "One base menu, adjusted for each family member. No need to cook three times.",
      },
    ],
  },
  features: {
    kicker: "Inside Nourish Plus",
    title: "One place for your family's meals.",
    note: "These features are being built for the beta.",
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
        title: "Two languages, two themes",
        body: "Bahasa Indonesia and English, light and dark mode.",
      },
    ],
  },
  trust: {
    kicker: "Sources",
    title: "Every suggestion has a source. You can check it.",
    items: [
      {
        title: "Nutrition numbers are calculated, not guessed.",
        body: "Daily targets come from AKG (Health Ministry Regulation 28/2019) and ingredient values from TKPI[[3]][[4]]. The chat assistant does not make up numbers.",
      },
      {
        title: "Sources you can open.",
        body: "Only guidelines from WHO, the Indonesian Ministry of Health, IDAI, and peer-reviewed journals. When there is no source, Nourish says it doesn't know.",
      },
      {
        title: "Knows its limits.",
        body: "For conditions such as gestational diabetes, preeclampsia, diagnosed allergies, or premature babies, Nourish does not create a personal menu and points you to a doctor.",
      },
      {
        title: "Warning signs go straight to care.",
        body: "Bleeding, reduced fetal movement, persistent vomiting, or an allergic reaction in a child: Nourish tells you to see a doctor or go to the ER, not what to eat.",
      },
    ],
    disclaimer:
      "Nourish helps with everyday kitchen decisions. Prenatal checkups and growth monitoring stay with your doctor and midwife.",
  },
  pricing: {
    kicker: "Pricing",
    title: "Founding member price for the first {seats} sign-ups.",
    plan: "Nourish Plus, 12 months",
    normal: "Regular price after launch {yearly} per year",
    perks: [
      "All Nourish Plus features for 12 months",
      "Beta access before public launch",
      "Full refund if the beta has not opened by {refund}",
    ],
    cta: "Pre-order for {founding}",
    ctaWaitlist: "Reserve the founding member price",
    afterTitle: "After launch",
    monthly: "Monthly",
    yearly: "Yearly",
    perMonth: "per month",
    perYear: "per year",
    yearlyNote: "about {yearlyPerMonth} per month",
    free: "A free version stays available: a pregnancy food safety checker and a first foods guide by ingredient.",
  },
  form: {
    kicker: "Waitlist",
    title: "Tell me when the beta opens.",
    body: "Free, with no obligation to buy. We'll write by email, and on WhatsApp if you add your number.",
    name: "First name",
    email: "Email",
    whatsapp: "WhatsApp number (optional)",
    stage: "Current stage",
    stagePlaceholder: "Choose one",
    stages: {
      planning: "Planning a pregnancy",
      pregnant: "Pregnant",
      breastfeeding: "Breastfeeding",
      mpasi: "Child aged 6 to 24 months",
      older: "Child over 2 years",
    },
    preorder: "I'm interested in the founding member pre-order",
    consent: "I agree that this data may be used to contact me about Nourish. It is never sold.",
    submit: "Add me to the waitlist",
    submitting: "Sending...",
    successTitle: "Thank you, {name}.",
    successBody: "You're on the waitlist. We'll send the next update to {email}.",
    again: "Sign up someone else",
    errorGeneric: "Your sign-up didn't go through. Please try again shortly.",
    errorContact: "If it keeps failing, email {email}.",
    errors: {
      name: "Please enter your first name.",
      email: "That email doesn't look right.",
      whatsapp: "WhatsApp number should be digits only, 9 to 15 long.",
      stage: "Please choose your current stage.",
      consent: "Please tick the consent box to continue.",
    },
  },
  faq: {
    kicker: "Questions",
    title: "What people ask before signing up.",
    items: [
      {
        q: "Does Nourish replace my obstetrician, pediatrician, or dietitian?",
        a: "No. Nourish helps you plan and log daily meals. Checkups, diagnosis, and treatment stay with health professionals.",
      },
      {
        q: "I have gestational diabetes, or my child has an allergy. Can I use Nourish?",
        a: "You can still use the shopping list and logging, but Nourish does not create personal menus for medical conditions. Those menus are best planned with the doctor or dietitian treating you.",
      },
      {
        q: "Why pay when I can ask a free chatbot?",
        a: "A general chatbot can answer questions, but it doesn't keep your family's profile, doesn't calculate nutrition from Indonesian food tables, and doesn't always show a source you can check. Nourish plans complete daily menus, logs what was actually eaten, and shows its sources.",
      },
      {
        q: "Does it work on iPhone and Android?",
        a: "Yes. Nourish runs in the browser and can be added to your home screen like a regular app, on iPhone and Android.",
      },
      {
        q: "My child is over 2. Is there a menu for them?",
        a: "Nourish starts with pregnancy, breastfeeding, and first foods. Menus for children aged 2 to 12 come next. Join the waitlist and we'll let you know.",
      },
      {
        q: "What if the beta is late?",
        a: "If the beta has not opened by {refund}, your pre-order is refunded in full.",
      },
    ],
  },
  footer: {
    refsTitle: "Sources on this page",
    disclaimer:
      "Nourish is a meal planning tool and does not replace medical advice. Consult a doctor or health professional about any health condition.",
    rights: "© {year} Nourish",
    cite: "See source {n}",
  },
};

export const copy: Record<Lang, Copy> = { id, en };
