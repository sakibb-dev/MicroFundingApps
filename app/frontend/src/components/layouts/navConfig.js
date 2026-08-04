import {
  IconHome,
  IconChartPie,
  IconArrowsExchange,
  IconBell,
  IconUser,
  IconLayoutDashboard,
  IconUsers,
  IconFileInvoice,
  IconHistory,
  IconBuildingStore,
  IconIdBadge2,
  IconCurrencyDollar,
  IconReport,
} from '@tabler/icons-react';

export const investorNav = [
  { to: '/investor', label: 'Home', icon: IconHome, end: true },
  { to: '/investor/portfolio', label: 'Portfolio', icon: IconChartPie },
  { to: '/investor/transaksi', label: 'Transaksi', icon: IconArrowsExchange },
  { to: '/investor/notifikasi', label: 'Notifikasi', icon: IconBell },
  { to: '/investor/profil', label: 'Profil', icon: IconUser },
];

export const umkmNav = [
  { to: '/umkm', label: 'Dashboard', icon: IconLayoutDashboard, end: true },
  { to: '/umkm/investor', label: 'Daftar Investor', icon: IconUsers },
  { to: '/umkm/pengajuan', label: 'Pengajuan Bagi Hasil', icon: IconFileInvoice },
  { to: '/umkm/riwayat', label: 'Riwayat Bagi Hasil', icon: IconHistory },
  { to: '/umkm/profil-usaha', label: 'Profil Usaha', icon: IconBuildingStore },
];

export const adminNav = [
  { to: '/admin', label: 'Dashboard', icon: IconLayoutDashboard, end: true },
  { to: '/admin/kyc', label: 'Manajemen KYC', icon: IconIdBadge2, badge: 5 },
  { to: '/admin/umkm', label: 'Manajemen UMKM', icon: IconBuildingStore, badge: 2 },
  { to: '/admin/transaksi', label: 'Transaksi', icon: IconArrowsExchange, badge: 8 },
  { to: '/admin/bagi-hasil', label: 'Bagi Hasil', icon: IconCurrencyDollar, badge: 3 },
  { to: '/admin/laporan', label: 'Laporan', icon: IconReport },
];
