// Mock data for the Investor panel. Every page under src/pages/investor imports
// from here instead of hardcoding arrays — swapping to real API calls later is a
// one-line change (replace the function body with a fetch/query call).
import { IconToolsKitchen2, IconShirt, IconTool, IconCut } from '@tabler/icons-react';

const CATEGORY_ICONS = {
  Kuliner: IconToolsKitchen2,
  Fashion: IconShirt,
  Otomotif: IconTool,
  Kerajinan: IconCut,
};

const CATEGORY_STYLES = {
  Kuliner: { bg: '#D1FAE5', color: '#065F46' },
  Fashion: { bg: '#EDE9FE', color: '#6D28D9' },
  Otomotif: { bg: '#FEF3C7', color: '#92400E' },
  Kerajinan: { bg: '#E0F2FE', color: '#075985' },
};

export const CATEGORIES = ['Kuliner', 'Fashion', 'Otomotif', 'Kerajinan'];

export function getCategoryIcon(category) {
  return CATEGORY_ICONS[category] || IconToolsKitchen2;
}

export function getCategoryStyle(category) {
  return CATEGORY_STYLES[category] || { bg: '#F3F4F6', color: '#374151' };
}

// Funding % drives the status badge/chip shown on cards — single source of
// truth so Home's filter chips and the card badges never disagree.
export function getFundingStatus(percent) {
  if (percent >= 90) return { key: 'hampir_penuh', label: `${percent}% — Segera Penuh`, variant: 'warning' };
  if (percent >= 70) return { key: 'hampir_penuh', label: 'Hampir Penuh', variant: 'warning' };
  return { key: 'aktif', label: 'Funding Aktif', variant: 'success' };
}

export const INVESTMENT_AMOUNT_PRESETS = [500000, 1000000, 2000000, 5000000];

export const REKENING_TUJUAN = {
  bank: 'Bank BCA',
  atasNama: 'PT MicroInvest Nusantara',
  nomor: '1234567890',
};

const UMKM_LIST = [
  {
    id: 'warung-bu-sari',
    name: 'Warung Makan Bu Sari',
    category: 'Kuliner',
    city: 'Yogyakarta',
    returnPct: 2.5,
    percent: 78,
    collected: 23400000,
    target: 30000000,
    daysLeft: 12,
    investorCount: 34,
    isNew: false,
    tenorBulan: 12,
    minInvestment: 500000,
    jatuhTempo: 'setiap tanggal 5',
    description:
      'Warung Makan Bu Sari telah beroperasi sejak 2018 di kawasan Malioboro, melayani rata-rata 200 pelanggan per hari dengan menu masakan Jawa khas. Dana investasi akan digunakan untuk ekspansi cabang kedua dan pembelian peralatan dapur baru.',
    tahunBerdiri: 2018,
    jumlahKaryawan: 12,
    omzetBulanan: 85000000,
    nibVerified: true,
    documents: [
      { name: 'NIB Usaha.pdf', icon: 'file' },
      { name: 'Laporan Keuangan Q3.pdf', icon: 'file' },
      { name: 'Foto Usaha (5 file)', icon: 'photo' },
      { name: 'Surat Perjanjian.pdf', icon: 'file' },
    ],
    investors: [
      { name: 'Rendra Kusuma', nominal: 2000000, tanggal: '2024-11-02', percent: 8.5 },
      { name: 'Anita Nuraini', nominal: 5000000, tanggal: '2024-11-05', percent: 21.3 },
      { name: 'Dedi Setiawan', nominal: 1500000, tanggal: '2024-11-08', percent: 6.4 },
      { name: 'Maria Indah', nominal: 3000000, tanggal: '2024-11-12', percent: 12.8 },
    ],
  },
  {
    id: 'konveksi-maju-jaya',
    name: 'Konveksi Maju Jaya',
    category: 'Fashion',
    city: 'Bandung',
    returnPct: 3.0,
    percent: 45,
    collected: 13500000,
    target: 30000000,
    daysLeft: 28,
    investorCount: 18,
    isNew: true,
    tenorBulan: 12,
    minInvestment: 500000,
    jatuhTempo: 'setiap tanggal 5',
    description:
      'Konveksi Maju Jaya memproduksi pakaian jadi untuk brand lokal dan pesanan seragam korporat sejak 2015. Dana investasi digunakan untuk membeli mesin jahit tambahan dan bahan baku produksi musim ini.',
    tahunBerdiri: 2015,
    jumlahKaryawan: 20,
    omzetBulanan: 120000000,
    nibVerified: true,
    documents: [
      { name: 'NIB Usaha.pdf', icon: 'file' },
      { name: 'Laporan Keuangan Q3.pdf', icon: 'file' },
      { name: 'Foto Usaha (4 file)', icon: 'photo' },
      { name: 'Surat Perjanjian.pdf', icon: 'file' },
    ],
    investors: [
      { name: 'Rendra Kusuma', nominal: 4000000, tanggal: '2024-11-10', percent: 21.3 },
      { name: 'Budi Santoso', nominal: 3000000, tanggal: '2024-11-14', percent: 16.0 },
      { name: 'Siti Aminah', nominal: 2500000, tanggal: '2024-11-18', percent: 13.3 },
    ],
  },
  {
    id: 'bengkel-pak-haji',
    name: 'Bengkel Motor Pak Haji',
    category: 'Otomotif',
    city: 'Surabaya',
    returnPct: 2.8,
    percent: 92,
    collected: 27600000,
    target: 30000000,
    daysLeft: 5,
    investorCount: 51,
    isNew: false,
    tenorBulan: 10,
    minInvestment: 500000,
    jatuhTempo: 'setiap tanggal 5',
    description:
      'Bengkel Motor Pak Haji melayani servis dan spare part motor di kawasan Rungkut sejak 2012. Dana investasi digunakan untuk menambah stok spare part dan peralatan diagnostik motor injeksi.',
    tahunBerdiri: 2012,
    jumlahKaryawan: 8,
    omzetBulanan: 65000000,
    nibVerified: true,
    documents: [
      { name: 'NIB Usaha.pdf', icon: 'file' },
      { name: 'Laporan Keuangan Q3.pdf', icon: 'file' },
      { name: 'Foto Usaha (6 file)', icon: 'photo' },
      { name: 'Surat Perjanjian.pdf', icon: 'file' },
    ],
    investors: [
      { name: 'Rendra Kusuma', nominal: 2500000, tanggal: '2024-11-01', percent: 9.1 },
      { name: 'Agus Wijaya', nominal: 6000000, tanggal: '2024-11-03', percent: 21.7 },
      { name: 'Fitri Handayani', nominal: 4500000, tanggal: '2024-11-06', percent: 16.3 },
    ],
  },
  {
    id: 'kopi-kenangan-lokal',
    name: 'Kopi Kenangan Lokal',
    category: 'Kuliner',
    city: 'Malang',
    returnPct: 2.3,
    percent: 30,
    collected: 6000000,
    target: 20000000,
    daysLeft: 40,
    investorCount: 9,
    isNew: true,
    tenorBulan: 12,
    minInvestment: 500000,
    jatuhTempo: 'setiap tanggal 5',
    description:
      'Kopi Kenangan Lokal adalah kedai kopi rumahan yang berkembang jadi 2 outlet sejak 2021. Dana investasi digunakan untuk membuka outlet ketiga di area kampus.',
    tahunBerdiri: 2021,
    jumlahKaryawan: 6,
    omzetBulanan: 35000000,
    nibVerified: true,
    documents: [
      { name: 'NIB Usaha.pdf', icon: 'file' },
      { name: 'Laporan Keuangan Q3.pdf', icon: 'file' },
      { name: 'Foto Usaha (3 file)', icon: 'photo' },
      { name: 'Surat Perjanjian.pdf', icon: 'file' },
    ],
    investors: [
      { name: 'Rina Puspita', nominal: 1000000, tanggal: '2024-11-09', percent: 16.7 },
      { name: 'Yoga Pratama', nominal: 800000, tanggal: '2024-11-11', percent: 13.3 },
    ],
  },
  {
    id: 'batik-sari-asri',
    name: 'Batik Sari Asri',
    category: 'Kerajinan',
    city: 'Solo',
    returnPct: 2.7,
    percent: 60,
    collected: 15000000,
    target: 25000000,
    daysLeft: 18,
    investorCount: 22,
    isNew: false,
    tenorBulan: 12,
    minInvestment: 500000,
    jatuhTempo: 'setiap tanggal 5',
    description:
      'Batik Sari Asri memproduksi batik tulis dan cap khas Solo, memasok ke butik lokal dan pasar daring sejak 2016. Dana investasi digunakan untuk membeli bahan kain dan pewarna alami dalam jumlah besar.',
    tahunBerdiri: 2016,
    jumlahKaryawan: 15,
    omzetBulanan: 55000000,
    nibVerified: true,
    documents: [
      { name: 'NIB Usaha.pdf', icon: 'file' },
      { name: 'Laporan Keuangan Q3.pdf', icon: 'file' },
      { name: 'Foto Usaha (7 file)', icon: 'photo' },
      { name: 'Surat Perjanjian.pdf', icon: 'file' },
    ],
    investors: [
      { name: 'Rendra Kusuma', nominal: 1500000, tanggal: '2024-11-07', percent: 10.0 },
      { name: 'Wulan Sari', nominal: 2000000, tanggal: '2024-11-09', percent: 13.3 },
      { name: 'Hendra Gunawan', nominal: 3500000, tanggal: '2024-11-15', percent: 23.3 },
    ],
  },
  {
    id: 'roti-bakar-mang-ujang',
    name: 'Roti Bakar Mang Ujang',
    category: 'Kuliner',
    city: 'Semarang',
    returnPct: 2.6,
    percent: 15,
    collected: 3000000,
    target: 20000000,
    daysLeft: 55,
    investorCount: 4,
    isNew: true,
    tenorBulan: 12,
    minInvestment: 500000,
    jatuhTempo: 'setiap tanggal 5',
    description:
      'Roti Bakar Mang Ujang berjualan di gerobak keliling sejak 2019 dan kini merambah ke booth tetap. Dana investasi digunakan untuk membeli gerobak booth kedua dan peralatan pemanggang.',
    tahunBerdiri: 2019,
    jumlahKaryawan: 4,
    omzetBulanan: 18000000,
    nibVerified: false,
    documents: [
      { name: 'NIB Usaha.pdf', icon: 'file' },
      { name: 'Laporan Keuangan Q3.pdf', icon: 'file' },
      { name: 'Foto Usaha (2 file)', icon: 'photo' },
      { name: 'Surat Perjanjian.pdf', icon: 'file' },
    ],
    investors: [{ name: 'Rendra Kusuma', nominal: 500000, tanggal: '2024-11-20', percent: 16.7 }],
  },
];

export function getUmkmList() {
  return UMKM_LIST;
}

export function getUmkmDetail(id) {
  return UMKM_LIST.find((u) => u.id === id);
}

const PORTFOLIO = {
  metrics: {
    totalInvestasiAktif: 7500000,
    totalBagiHasilDiterima: 562500,
    umkmAktifCount: 3,
    returnRataRata: 2.7,
  },
  activeInvestments: [
    {
      id: 1,
      umkmId: 'warung-bu-sari',
      name: 'Warung Makan Bu Sari',
      category: 'Kuliner',
      nominal: 1000000,
      percent: 8.5,
      bagiHasil: 25000,
      status: 'aktif',
    },
    {
      id: 2,
      umkmId: 'konveksi-maju-jaya',
      name: 'Konveksi Maju Jaya',
      category: 'Fashion',
      nominal: 4000000,
      percent: 21.3,
      bagiHasil: 120000,
      status: 'menunggu',
    },
    {
      id: 3,
      umkmId: 'bengkel-pak-haji',
      name: 'Bengkel Motor Pak Haji',
      category: 'Otomotif',
      nominal: 2500000,
      percent: 9.1,
      bagiHasil: 70000,
      status: 'aktif',
    },
  ],
  riwayat: [
    { id: 1, periode: 'Nov 2024', umkm: 'Warung Bu Sari', nominal: 1000000, bagiHasil: 25000, status: 'cair' },
    { id: 2, periode: 'Nov 2024', umkm: 'Bengkel Pak Haji', nominal: 2500000, bagiHasil: 70000, status: 'cair' },
    { id: 3, periode: 'Okt 2024', umkm: 'Warung Bu Sari', nominal: 1000000, bagiHasil: 24000, status: 'cair' },
    { id: 4, periode: 'Okt 2024', umkm: 'Konveksi Maju Jaya', nominal: 4000000, bagiHasil: 115000, status: 'diproses' },
  ],
};

export function getPortfolio() {
  return PORTFOLIO;
}

const NOTIFICATIONS = [
  {
    id: 1,
    type: 'bagi_hasil',
    title: 'Bagi hasil cair',
    desc: 'Rp 25.000 dari Warung Makan Bu Sari telah masuk ke rekeningmu.',
    time: '2 jam lalu',
    read: false,
  },
  {
    id: 2,
    type: 'kyc',
    title: 'KYC terverifikasi',
    desc: 'Akunmu sudah terverifikasi penuh, kamu bisa mulai berinvestasi.',
    time: '1 hari lalu',
    read: false,
  },
  {
    id: 3,
    type: 'pending',
    title: 'Investasi menunggu konfirmasi',
    desc: 'Bukti transfer Rp 4.000.000 ke Konveksi Maju Jaya sedang direview admin.',
    time: '2 hari lalu',
    read: false,
  },
  {
    id: 4,
    type: 'bagi_hasil',
    title: 'Bagi hasil cair',
    desc: 'Rp 24.000 dari Warung Makan Bu Sari telah masuk ke rekeningmu.',
    time: '1 bulan lalu',
    read: true,
  },
];

export function getNotifications() {
  return NOTIFICATIONS;
}

const PROFILE = {
  name: 'Rendra Kusuma',
  email: 'rendra.k@email.com',
  phone: '0812-3456-7890',
  city: 'Jakarta Selatan',
  bank: 'BCA',
  accountNumber: '1234567890',
  kycStatus: 'verified',
};

export function getProfile() {
  return PROFILE;
}
