import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import ApiErrorBridge from './api/ApiErrorBridge';
import ProtectedRoute from './components/ProtectedRoute';

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

import AdminDashboard from './pages/admin/Dashboard';
import AdminKyc from './pages/admin/Kyc';
import AdminManajemenUmkm from './pages/admin/ManajemenUmkm';
import AdminTransaksi from './pages/admin/Transaksi';
import AdminBagiHasil from './pages/admin/BagiHasil';
import AdminLaporan from './pages/admin/Laporan';

const queryClient = new QueryClient();

function InvestorLayout() {
  return <SidebarLayoutGreen navItems={investorNav} user={{ name: 'Rendra Kusuma', status: 'Terverifikasi' }} />;
}
function UmkmLayout() {
  return <SidebarLayoutTeal navItems={umkmNav} badgeLabel="UMKM" user={{ name: 'Warung Bu Sari', status: '● Campaign Aktif' }} />;
}
function AdminLayout() {
  return <SidebarLayoutTeal navItems={adminNav} badgeLabel="ADMIN" user={{ name: 'Admin Utama', status: 'Super Admin' }} />;
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

              <Route
                path="/admin"
                element={
                  <ProtectedRoute role="admin">
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
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
}
