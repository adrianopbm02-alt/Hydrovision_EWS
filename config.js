const CONFIG = {
  AUTH: {
    USER_PASSWORD: "user123",
    ADMIN_PASSWORD: "admin123"
  },
  SPREADSHEET_URL: "https://docs.google.com/spreadsheets/d/1_CONTOH_SPREADSHEET_ID/edit?usp=sharing",
  SOSIAL_MEDIA: {
    INSTAGRAM_USERNAME: "@hydrovision_ews",
    INSTAGRAM_URL: "https://www.instagram.com/hydrovision_ews",
    TIKTOK_USERNAME: "@hydrovision_ews",
    TIKTOK_URL: "https://www.tiktok.com/@hydrovision_ews",
    EMAIL_TIM: "hydrovision.pkm@gmail.com"
  },
  LOGOS: [
    { id: "tutwuri", src: "logo_tutwuri.png", alt: "Tut Wuri Handayani" },
    { id: "diktisaintek", src: "logo_diktisaintek.png", alt: "Diktisaintek Berdampak" },
    { id: "belmawa", src: "logo_belmawa.png", alt: "Belmawa" },
    { id: "simbelmawa", src: "logo_simbelmawa.png", alt: "Simbelmawa" },
    { id: "pkm", src: "logo_pkm.png", alt: "PKM" },
    { id: "polsri", src: "logo_polsri.png", alt: "Politeknik Negeri Sriwijaya" },
    { id: "hydrovision", src: "logo_hydrovision.png", alt: "Tim EWS Hydrovision" }
  ],
  DOSEN: {
    NAMA: "Arini Sucia S.T., M.T",
    JABATAN: "Dosen Pembimbing PKM KC",
    INSTANSI: "Politeknik Negeri Sriwijaya",
    FOTO: "foto_miss.jpeg"
  },
  TIM: [
    {
      NAMA: "Ridho Adriano",
      PERAN: "Ketua Tim",
      PRODI: "D3 Teknik Elektronika - Politeknik Negeri Sriwijaya",
      FOTO: "foto_ridho.jpeg",
      IS_KETUA: true
    },
    {
      NAMA: "M Rayhan Akbar",
      PERAN: "Anggota",
      PRODI: "D3 Teknik Kimia - Politeknik Negeri Sriwijaya",
      FOTO: "foto_rehan.jpeg",
      IS_KETUA: false
    },
    {
      NAMA: "Ichlasia Neylani",
      PERAN: "Anggota",
      PRODI: "D3 Teknik Kimia - Politeknik Negeri Sriwijaya",
      FOTO: "foto_lalak.jpeg",
      IS_KETUA: false
    },
    {
      NAMA: "Fathir Daniyal Yasin",
      PERAN: "Anggota",
      PRODI: "D3 Teknik Kimia - Politeknik Negeri Sriwijaya",
      FOTO: "foto_fathir.jpeg",
      IS_KETUA: false
    },
    {
      NAMA: "Aulia Rahman",
      PERAN: "Anggota",
      PRODI: "D3 Teknik Kimia - Politeknik Negeri Sriwijaya",
      FOTO: "foto_rahman.jpeg",
      IS_KETUA: false
    }
  ],
  MQTT: {
    BROKER: "broker.hivemq.com",
    PORT: 8884,
    TOPIC_TELEMETRY: "ews/musi/telemetry",
    TOPIC_COMMAND: "ews/musi/command",
    TOPIC_UPDATE_COEF: "ews/musi/update_coef"
  }
};