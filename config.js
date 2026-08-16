/**
 * =======================================================
 * KONFIGURASI UTAMA DASHBOARD EWS HYDROVISION (PKM-KC 2026)
 * =======================================================
 */

const CONFIG = {
  // 1. PENGATURAN PASSWORD LOGIN
  AUTH: {
    USER_PASSWORD: "user123",
    ADMIN_PASSWORD: "admin123"
  },

  // 2. LINK SPREADSHEET HASIL LOGGING
  SPREADSHEET_URL: "https://docs.google.com/spreadsheets/d/1mjbFWxTsm2petNMwuwAvIQ-awIwClNd-xMuIs1fOXmc/edit?gid=0#gid=0",

  // 3. SOSIAL MEDIA & KONTAK RESMI TIM HYDROVISION
  SOSIAL_MEDIA: {
    INSTAGRAM_USERNAME: "@hydrovision_ews",
    INSTAGRAM_URL: "https://www.instagram.com/hydrovision_ews",
    
    TIKTOK_USERNAME: "@hydrovision_ews",
    TIKTOK_URL: "https://www.tiktok.com/@hydrovision_ews",
    
    EMAIL_TIM: "hydrovision.pkm@gmail.com"
  },

  // 4. DAFTAR 7 LOGO RESMI (URUTAN BELMAWA / DIKTI)
  LOGOS: [
    { id: "tutwuri", src: "logo_tutwuri.png", alt: "Tut Wuri Handayani" },
    { id: "diktisaintek", src: "logo_diktisaintek.png", alt: "Diktisaintek Berdampak" },
    { id: "belmawa", src: "logo_belmawa.png", alt: "Belmawa" },
    { id: "simbelmawa", src: "logo_simbelmawa.png", alt: "Simbelmawa" },
    { id: "pkm", src: "logo_pkm.png", alt: "PKM" },
    { id: "polsri", src: "logo_polsri.png", alt: "Politeknik Negeri Sriwijaya" },
    { id: "hydrovision", src: "logo_hydrovision.png", alt: "Tim EWS Hydrovision" }
  ],

  // 5. PROFIL DOSEN PEMBIMBING
  DOSEN: {
    NAMA: "Arini Sucia S.T., M.T",
    JABATAN: "Dosen Pembimbing PKM KC",
    INSTANSI: "Politeknik Negeri Sriwijaya",
    FOTO: "foto_miss.jpeg"
  },

  // 6. TIM PENELITI (KETUA & 4 ANGGOTA)
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
      FOTO: "foto_rehan.jpeg", // <-- Pastikan file foto rayhan ada di folder
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

  // 7. PARAMETER MQTT BROKER
  MQTT: {
    BROKER: "broker.hivemq.com",
    PORT: 8000,
    TOPIC_TELEMETRY: "ews/musi/telemetry",
    TOPIC_COMMAND: "ews/musi/command",
    TOPIC_UPDATE_COEF: "ews/musi/update_coef"
  }
};