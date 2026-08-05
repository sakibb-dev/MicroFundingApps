import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ApiErrorBridge from './api/ApiErrorBridge';
import ProtectedRoute from './components/ProtectedRoute';
import { useAdminDashboard } from './api/admin';

import PublicLayout from './components/layouts/PublicLayout';
import SidebarLayoutGreen from './components/layouts/SidebarLayoutGreen';
import SidebarLayoutTeal from './components/layouts/SidebarLayoutTeal';
import { investorNav, umkmNav, adminNav } from './components/layouts/navConfig';

import LandingPage from './pages/landing/LandingPage';
import RegisterPage from './pages/register/RegisterPage';
import LoginPage from './pages/auth/LoginPage';

import InvestorHome from './pages/investor/Home';
import InvestorDetail from './pages/investor/Detail';
import InvestorTransaksi from './pages/investor/Transaksi';
import InvestorPortfolio from './pages/investor/Portfolio';
import InvestorNotifikasi from './pages/investor/Notifikasi';
import InvestorProfil from './pages/investor/Profil';

import UmkmDashboard from './pages/umkm/Dashboard';
import UmkmDaftarInvestor from './pages/umkm/DaftarInvestor';
import UmkmPengajuanBagiHasil from './pages/umkm/PengajuanBagiHasil';
import UmkmRiwayat from './pages/umkm/Riwayat';
import UmkmProfilUsaha from './pages/umkm/ProfilUsaha';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/Dashboard';
import AdminKyc from './pages/admin/Kyc';
import AdminManajemenUmkm from './pages/admin/ManajemenUmkm';
import AdminTransaksi from './pages/admin/Transaksi';
import AdminBagiHasil from './pages/admin/BagiHasil';
import AdminLaporan from './pages/admin/Laporan';
import AdminSettings from './pages/admin/Settings';

const queryClient = new QueryClient();

const KYC_STATUS_LABEL = {
  approved: 'Terverifikasi',
  pending: 'Menunggu Verifikasi',
  rejected: 'KYC Ditolak',
};

const UMKM_STATUS_LABEL = {
  approved: '● Campaign Aktif',
  pending: '● Menunggu Review',
  rejected: '● Ditolak',
};

function InvestorLayout() {
  const { user } = useAuth();
  return (
    <SidebarLayoutGreen
      navItems={investorNav}
      user={{ name: user?.name, status: KYC_STATUS_LABEL[user?.kyc_status] || 'Menunggu Verifikasi' }}
    />
  );
}
function UmkmLayout() {
  const { user } = useAuth();
  return (
    <SidebarLayoutTeal
      navItems={umkmNav}
      badgeLabel="UMKM"
      user={{ name: user?.name, status: UMKM_STATUS_LABEL[user?.umkm_status] || '● Menunggu Review' }}
    />
  );
}
function AdminLayout() {
  const { user } = useAuth();
  const { data: metrics } = useAdminDashboard();
  const navItems = adminNav.map((item) =>
    item.badgeKey ? { ...item, badge: metrics?.[item.badgeKey] ?? 0 } : item
  );
  return <SidebarLayoutTeal navItems={navItems} badgeLabel="ADMIN" user={{ name: user?.name, status: 'Super Admin' }} />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <AuthProvider>
            <ApiErrorBridge />
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
              </Route>
              <Route path="/daftar" element={<RegisterPage />} />
              <Route path="/masuk" element={<LoginPage />} />

              <Route
                path="/investor"
                element={
                  <ProtectedRoute role="investor">
                    <InvestorLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<InvestorHome />} />
                <Route path="detail/:id" element={<InvestorDetail />} />
                <Route path="transaksi" element={<InvestorTransaksi />} />
                <Route path="portfolio" element={<InvestorPortfolio />} />
                <Route path="notifikasi" element={<InvestorNotifikasi />} />
                <Route path="profil" element={<InvestorProfil />} />
              </Route>

              <Route
                path="/umkm"
                element={
                  <ProtectedRoute role="umkm">
                    <UmkmLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<UmkmDashboard />} />
                <Route path="investor" element={<UmkmDaftarInvestor />} />
                <Route path="pengajuan" element={<UmkmPengajuanBagiHasil />} />
                <Route path="riwayat" element={<UmkmRiwayat />} />
                <Route path="profil-usaha" element={<UmkmProfilUsaha />} />
              </Route>

              {/* Not linked anywhere in the public UI -- reachable only by
                  someone who already knows this exact URL. See AdminLogin. */}
              <Route path="/admin-panel/login" element={<AdminLogin />} />

              <Route
                path="/admin-panel"
                element={
                  <ProtectedRoute role="admin" loginPath="/admin-panel/login">
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="kyc" element={<AdminKyc />} />
                <Route path="umkm" element={<AdminManajemenUmkm />} />
                <Route path="transaksi" element={<AdminTransaksi />} />
                <Route path="bagi-hasil" element={<AdminBagiHasil />} />
                <Route path="laporan" element={<AdminLaporan />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
}
