// Mock data for the Admin panel. Each page imports through the getter functions below so
// swapping to a real API later is a one-line change (replace the function body with a fetch call).

// ---------------------------------------------------------------------------
// DASHBOARD
// ---------------------------------------------------------------------------

const DASHBOARD_METRICS = {
  umkmAktif: 47,
  investorTerverifikasi: 3240,
  danaBeredar: 2_400_000_000,
  pendingKyc: 5,
  pendingTransfer: 8,
  feePlatformBulanIni: 24_500_000,
};

const RECENT_ACTIVITY = [
  { id: 1, waktu: '2 jam lalu', tipe: 'KYC baru', subjek: 'Farid Hidayat', status: 'pending' },
  { id: 2, waktu: '3 jam lalu', tipe: 'Investasi baru', subjek: 'Rp 2.000.000 ke Warung Bu Sari', status: 'pending' },
  { id: 3, waktu: '5 jam lalu', tipe: 'Pengajuan bagi hasil', subjek: 'Konveksi Maju Jaya', status: 'review' },
  { id: 4, waktu: '1 hari lalu', tipe: 'UMKM baru daftar', subjek: 'Sate Klathak Pak Bowo', status: 'approved' },
  { id: 5, waktu: '1 hari lalu', tipe: 'Transfer dikonfirmasi', subjek: 'Rp 1.500.000 dari Nabila Putri', status: 'approved' },
  { id: 6, waktu: '2 hari lalu', tipe: 'KYC ditolak', subjek: 'Wahyu Setiawan', status: 'rejected' },
];

export function getDashboardMetrics() {
  return DASHBOARD_METRICS;
}

export function getRecentActivity() {
  return RECENT_ACTIVITY;
}

// ---------------------------------------------------------------------------
// KYC
// ---------------------------------------------------------------------------

const KYC_LIST = [
  { id: 'k1', nama: 'Farid Hidayat', email: 'farid.h@email.com', tglDaftar: '2024-11-25', status: 'pending' },
  { id: 'k2', nama: 'Nabila Putri', email: 'nabila.p@email.com', tglDaftar: '2024-11-24', status: 'pending' },
  { id: 'k3', nama: 'Bagas Saputra', email: 'bagas.s@email.com', tglDaftar: '2024-11-23', status: 'pending' },
  { id: 'k4', nama: 'Citra Ramadhani', email: 'citra.r@email.com', tglDaftar: '2024-11-22', status: 'pending' },
  { id: 'k5', nama: 'Dimas Anggara', email: 'dimas.a@email.com', tglDaftar: '2024-11-21', status: 'pending' },
  { id: 'k6', nama: 'Rendra Kusuma', email: 'rendra.k@email.com', tglDaftar: '2024-11-20', status: 'approved' },
  { id: 'k7', nama: 'Sinta Marlina', email: 'sinta.m@email.com', tglDaftar: '2024-11-19', status: 'approved' },
  { id: 'k8', nama: 'Wahyu Setiawan', email: 'wahyu.s@email.com', tglDaftar: '2024-11-18', status: 'rejected' },
];

const KYC_DETAIL_BY_ID = {
  k1: { noHp: '0813-2233-4455', alamat: 'Jl. Kaliurang KM 5, Yogyakarta' },
  k2: { noHp: '0812-9988-7766', alamat: 'Jl. Malioboro No. 12, Yogyakarta' },
  k3: { noHp: '0857-1122-3344', alamat: 'Jl. Gejayan No. 8, Sleman' },
  k4: { noHp: '0821-4455-6677', alamat: 'Jl. Solo KM 8, Yogyakarta' },
  k5: { noHp: '0838-6677-8899', alamat: 'Jl. Parangtritis KM 4, Bantul' },
  k6: { noHp: '0819-2233-1122', alamat: 'Jl. Wates KM 3, Yogyakarta' },
  k7: { noHp: '0856-3344-5566', alamat: 'Jl. Magelang KM 6, Sleman' },
  k8: { noHp: '0813-9900-1122', alamat: 'Jl. Godean KM 5, Sleman' },
};

export function getKycList() {
  return KYC_LIST;
}

export function getKycDetail(id) {
  const base = KYC_LIST.find((k) => k.id === id);
  const extra = KYC_DETAIL_BY_ID[id];
  if (!base || !extra) return null;
  return { ...base, ...extra };
}

// ---------------------------------------------------------------------------
// MANAJEMEN UMKM
// ---------------------------------------------------------------------------

const UMKM_LIST = [
  { id: 'u1', namaUsaha: 'Sate Klathak Pak Bowo', kategori: 'Kuliner', targetDana: 25_000_000, status: 'pending' },
  { id: 'u2', namaUsaha: 'Kerajinan Rotan Asri', kategori: 'Kerajinan', targetDana: 18_000_000, status: 'pending' },
  { id: 'u3', namaUsaha: 'Warung Makan Bu Sari', kategori: 'Kuliner', targetDana: 60_000_000, status: 'approved' },
  { id: 'u4', namaUsaha: 'Konveksi Maju Jaya', kategori: 'Fashion', targetDana: 30_000_000, status: 'approved' },
  { id: 'u5', namaUsaha: 'Bengkel Motor Pak Haji', kategori: 'Otomotif', targetDana: 22_000_000, status: 'rejected' },
];

const UMKM_DETAIL_BY_ID = {
  u1: { persenBagiHasil: 28, kota: 'Bantul, Yogyakarta' },
  u2: { persenBagiHasil: 25, kota: 'Sleman, Yogyakarta' },
  u3: { persenBagiHasil: 30, kota: 'Yogyakarta' },
  u4: { persenBagiHasil: 30, kota: 'Bantul, Yogyakarta' },
  u5: { persenBagiHasil: 27, kota: 'Sleman, Yogyakarta' },
};

export function getUmkmList() {
  return UMKM_LIST;
}

export function getUmkmDetail(id) {
  const base = UMKM_LIST.find((u) => u.id === id);
  const extra = UMKM_DETAIL_BY_ID[id];
  if (!base || !extra) return null;
  return { ...base, ...extra };
}

// ---------------------------------------------------------------------------
// TRANSAKSI
// ---------------------------------------------------------------------------

const TRANSAKSI_LIST = [
  { id: 't1', investor: 'Farid Hidayat', umkm: 'Warung Bu Sari', nominal: 2_000_000, bukti: 'bukti.jpg', status: 'pending' },
  { id: 't2', investor: 'Nabila Putri', umkm: 'Konveksi Maju Jaya', nominal: 1_500_000, bukti: 'transfer.pdf', status: 'pending' },
  { id: 't3', investor: 'Bagas Saputra', umkm: 'Sate Klathak Pak Bowo', nominal: 3_000_000, bukti: 'bukti_tf_bagas.jpg', status: 'pending' },
  { id: 't4', investor: 'Citra Ramadhani', umkm: 'Kerajinan Rotan Asri', nominal: 1_000_000, bukti: 'transfer_citra.png', status: 'pending' },
  { id: 't5', investor: 'Dimas Anggara', umkm: 'Warung Bu Sari', nominal: 2_500_000, bukti: 'bukti_dimas.jpg', status: 'pending' },
  { id: 't6', investor: 'Sinta Marlina', umkm: 'Konveksi Maju Jaya', nominal: 1_750_000, bukti: 'tf_sinta.pdf', status: 'pending' },
  { id: 't7', investor: 'Yoga Pratama', umkm: 'Bengkel Motor Pak Haji', nominal: 2_200_000, bukti: 'bukti_yoga.jpg', status: 'pending' },
  { id: 't8', investor: 'Melati Anjani', umkm: 'Sate Klathak Pak Bowo', nominal: 900_000, bukti: 'transfer_melati.jpg', status: 'pending' },
  { id: 't9', investor: 'Rendra Kusuma', umkm: 'Bengkel Motor Pak Haji', nominal: 2_500_000, bukti: 'bukti_tf.jpg', status: 'confirmed' },
  { id: 't10', investor: 'Sinta Marlina', umkm: 'Warung Bu Sari', nominal: 1_200_000, bukti: 'tf_sinta2.jpg', status: 'confirmed' },
  { id: 't11', investor: 'Wahyu Setiawan', umkm: 'Konveksi Maju Jaya', nominal: 800_000, bukti: 'tf_wahyu.pdf', status: 'rejected' },
];

export function getTransaksiList() {
  return TRANSAKSI_LIST;
}

// ---------------------------------------------------------------------------
// BAGI HASIL
// ---------------------------------------------------------------------------

const PERSEN_BAGI_HASIL_INVESTOR = 0.3;
const PERSEN_FEE_PLATFORM = 0.05;

function hitungBagiHasil(keuntunganBersih) {
  return {
    totalBagiHasil: Math.round(keuntunganBersih * PERSEN_BAGI_HASIL_INVESTOR),
    fee: Math.round(keuntunganBersih * PERSEN_FEE_PLATFORM),
  };
}

const BAGI_HASIL_LIST = [
  {
    id: 'b1',
    umkm: 'Konveksi Maju Jaya',
    periode: 'November 2024',
    keuntunganBersih: 8_500_000,
    ...hitungBagiHasil(8_500_000),
    jumlahInvestor: 12,
    status: 'pending',
    breakdownValid: true,
  },
  {
    id: 'b2',
    umkm: 'Bengkel Motor Pak Haji',
    periode: 'November 2024',
    keuntunganBersih: 6_200_000,
    ...hitungBagiHasil(6_200_000),
    jumlahInvestor: 9,
    status: 'pending',
    breakdownValid: true,
  },
  {
    id: 'b3',
    umkm: 'Warung Kopi Bahagia',
    periode: 'November 2024',
    keuntunganBersih: 5_000_000,
    // Nilai berikut sengaja tidak konsisten dengan formula (submission bermasalah)
    // untuk mendemonstrasikan jalur validasi gagal saat admin approve.
    totalBagiHasil: 1_800_000,
    fee: 250_000,
    jumlahInvestor: 6,
    status: 'pending',
    breakdownValid: false,
  },
  {
    id: 'b4',
    umkm: 'Sate Klathak Pak Bowo',
    periode: 'Oktober 2024',
    keuntunganBersih: 7_000_000,
    ...hitungBagiHasil(7_000_000),
    jumlahInvestor: 8,
    status: 'approved',
    breakdownValid: true,
  },
  {
    id: 'b5',
    umkm: 'Warung Makan Bu Sari',
    periode: 'Oktober 2024',
    keuntunganBersih: 10_800_000,
    ...hitungBagiHasil(10_800_000),
    jumlahInvestor: 15,
    status: 'processed',
    breakdownValid: true,
  },
  {
    id: 'b6',
    umkm: 'Kerajinan Rotan Asri',
    periode: 'September 2024',
    keuntunganBersih: 4_000_000,
    ...hitungBagiHasil(4_000_000),
    jumlahInvestor: 5,
    status: 'processed',
    breakdownValid: true,
  },
  {
    id: 'b7',
    umkm: 'Toko Elektronik Jaya',
    periode: 'Oktober 2024',
    keuntunganBersih: 3_000_000,
    ...hitungBagiHasil(3_000_000),
    jumlahInvestor: 4,
    status: 'overdue',
    breakdownValid: true,
  },
];

export function getBagiHasilList() {
  return BAGI_HASIL_LIST;
}

export function getBagiHasilDetail(id) {
  return BAGI_HASIL_LIST.find((b) => b.id === id) || null;
}

// ---------------------------------------------------------------------------
// LAPORAN
// ---------------------------------------------------------------------------

const REPORT_METRICS = {
  totalTransaksiMasuk: 156_000_000,
  totalBagiHasilDiproses: 42_800_000,
  feeTerkumpul: 7_140_000,
};

const MONTHLY_FEE_SERIES = [
  { month: 'Jul', value: 4_200_000 },
  { month: 'Agu', value: 5_600_000 },
  { month: 'Sep', value: 4_900_000 },
  { month: 'Okt', value: 7_000_000 },
  { month: 'Nov', value: 8_400_000 },
];

export function getReportMetrics() {
  return REPORT_METRICS;
}

export function getMonthlyFeeSeries() {
  return MONTHLY_FEE_SERIES;
}
