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
  IconSettings,
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

// badgeKey references a field on the admin dashboard metrics response
// (see api/admin.js useAdminDashboard) -- badges are resolved to real
// pending counts at render time in App.jsx, never hardcoded here.
export const adminNav = [
  { to: '/admin-panel', label: 'Dashboard', icon: IconLayoutDashboard, end: true },
  { to: '/admin-panel/kyc', label: 'Manajemen KYC', icon: IconIdBadge2, badgeKey: 'pending_kyc' },
  { to: '/admin-panel/umkm', label: 'Manajemen UMKM', icon: IconBuildingStore, badgeKey: 'pending_umkm' },
  { to: '/admin-panel/transaksi', label: 'Transaksi', icon: IconArrowsExchange, badgeKey: 'pending_transfer' },
  { to: '/admin-panel/bagi-hasil', label: 'Bagi Hasil', icon: IconCurrencyDollar, badgeKey: 'pending_profit_reports' },
  { to: '/admin-panel/laporan', label: 'Laporan', icon: IconReport },
  { to: '/admin-panel/settings', label: 'Pengaturan', icon: IconSettings },
];
