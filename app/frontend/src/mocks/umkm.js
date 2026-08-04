// Mock data for the UMKM panel. Swap these functions for real API calls later —
// page components only ever import from here, never hardcode data inline.

const BUSINESS_PROFILE = {
  namaUsaha: 'Warung Makan Bu Sari',
  kategori: 'Kuliner',
  kota: 'Yogyakarta',
  tahunBerdiri: 2018,
  targetDana: 60000000,
  persenBagiHasil: 30,
  deskripsi:
    'Warung Makan Bu Sari telah beroperasi sejak 2018 di kawasan Malioboro, melayani rata-rata 200 pelanggan per hari dengan menu masakan Jawa khas.',
  statusLabel: 'Campaign aktif',
};

export const KATEGORI_OPTIONS = ['Kuliner', 'Fashion', 'Otomotif', 'Kerajinan'];

// Total dana terkumpul across all investors below is kept in sync with FUNDING_PROGRESS.terkumpul.
const INVESTOR_LIST = [
  { id: 1, nama: 'Rendra Kusuma', nominal: 1000000, tanggal: '2024-11-02' },
  { id: 2, nama: 'Anita Ningrum', nominal: 4000000, tanggal: '2024-11-05' },
  { id: 3, nama: 'Dedi Susanto', nominal: 2500000, tanggal: '2024-11-08' },
  { id: 4, nama: 'Made Wirawan', nominal: 3000000, tanggal: '2024-11-12' },
  { id: 5, nama: 'Budi Pratama', nominal: 5000000, tanggal: '2024-11-15' },
  { id: 6, nama: 'Sri Wahyuni', nominal: 1500000, tanggal: '2024-11-18' },
  { id: 7, nama: 'Hana Puspita', nominal: 2000000, tanggal: '2024-11-20' },
  { id: 8, nama: 'Agus Setiawan', nominal: 2000000, tanggal: '2024-11-21' },
  { id: 9, nama: 'Nina Kartika', nominal: 1000000, tanggal: '2024-11-22' },
  { id: 10, nama: 'Farid Hidayat', nominal: 3500000, tanggal: '2024-11-23' },
  { id: 11, nama: 'Lestari Wulandari', nominal: 1500000, tanggal: '2024-11-24' },
  { id: 12, nama: 'Bayu Nugroho', nominal: 2500000, tanggal: '2024-11-25' },
  { id: 13, nama: 'Citra Dewi', nominal: 1000000, tanggal: '2024-11-26' },
  { id: 14, nama: 'Eko Prasetyo', nominal: 2000000, tanggal: '2024-11-27' },
  { id: 15, nama: 'Gita Permata', nominal: 1500000, tanggal: '2024-11-28' },
  { id: 16, nama: 'Hendra Gunawan', nominal: 2000000, tanggal: '2024-11-28' },
  { id: 17, nama: 'Indah Permatasari', nominal: 1000000, tanggal: '2024-11-29' },
  { id: 18, nama: 'Joko Susilo', nominal: 8000000, tanggal: '2024-11-30' },
];

const FUNDING_PROGRESS = {
  terkumpul: 45000000,
  target: 60000000,
  sisaHariCampaign: 18,
};

const DEADLINE_INFO = {
  periode: 'November 2024',
  daysLeft: 5,
};

// Single source of truth for every bagi hasil period: kotor/ops feed the formula in
// section 3 (Keuntungan Bersih = Kotor - Ops, Total Bagi Hasil = Bersih x %BagiHasil, Fee = Bersih x %Fee).
// persenBagiHasil / feePlatformPercent come from the UMKM's agreed rate (also mirrored in BUSINESS_PROFILE.persenBagiHasil).
const FEE_PLATFORM_PERCENT = 5;

function buildPeriode(periode, keuntunganKotor, biayaOperasional, status) {
  const keuntunganBersih = keuntunganKotor - biayaOperasional;
  const totalBagiHasil = Math.round(keuntunganBersih * (BUSINESS_PROFILE.persenBagiHasil / 100));
  const feePlatform = Math.round(keuntunganBersih * (FEE_PLATFORM_PERCENT / 100));
  return {
    periode,
    keuntunganKotor,
    biayaOperasional,
    keuntunganBersih,
    totalBagiHasil,
    feePlatform,
    totalDibayarkan: totalBagiHasil + feePlatform,
    status,
  };
}

// Ordered oldest -> newest. "November 2024" is the current, not-yet-submitted period.
const RIWAYAT_BAGI_HASIL = [
  buildPeriode('Juli 2024', 9900000, 1500000, 'Terlambat'),
  buildPeriode('Agustus 2024', 10800000, 1600000, 'Diproses'),
  buildPeriode('September 2024', 12900000, 2100000, 'Selesai'),
  buildPeriode('Oktober 2024', 14300000, 1800000, 'Selesai'),
  buildPeriode('November 2024', 12500000, 1700000, 'Belum disubmit'),
].reverse();

export function getBusinessProfile() {
  return BUSINESS_PROFILE;
}

export function getInvestorList() {
  return INVESTOR_LIST;
}

export function getFundingProgress() {
  return FUNDING_PROGRESS;
}

export function getDeadlineInfo() {
  return DEADLINE_INFO;
}

export function getRiwayatBagiHasil() {
  return RIWAYAT_BAGI_HASIL;
}

// Last 3 completed/processed periods (excludes the current, not-yet-submitted period), newest first.
export function getRiwayatSingkat() {
  return RIWAYAT_BAGI_HASIL.filter((r) => r.status !== 'Belum disubmit').slice(0, 3);
}

export function getDashboardMetrics() {
  const lastCompleted = getRiwayatSingkat()[0];
  return {
    danaTerkumpul: FUNDING_PROGRESS.terkumpul,
    targetDana: FUNDING_PROGRESS.target,
    jumlahInvestor: INVESTOR_LIST.length,
    investorBaruMingguIni: 3,
    bagiHasilBulanLalu: lastCompleted ? lastCompleted.totalBagiHasil : 0,
  };
}

// Raw inputs for the Pengajuan Bagi Hasil calculator — the current (not-yet-submitted) period.
export function getCurrentPeriodInput() {
  const current = RIWAYAT_BAGI_HASIL.find((r) => r.status === 'Belum disubmit');
  return {
    periode: current.periode,
    keuntunganKotor: current.keuntunganKotor,
    biayaOperasional: current.biayaOperasional,
    persenBagiHasil: BUSINESS_PROFILE.persenBagiHasil,
    feePlatformPercent: FEE_PLATFORM_PERCENT,
    totalDanaTerkumpul: FUNDING_PROGRESS.terkumpul,
    deadlineDaysLeft: DEADLINE_INFO.daysLeft,
  };
}
