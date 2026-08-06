import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './client';
import { unwrapPaginated } from './pagination';

async function unwrap(promise) {
  const { data } = await promise;
  return data.data;
}

export function useUmkmDashboard() {
  return useQuery({
    queryKey: ['umkm', 'dashboard'],
    queryFn: () => unwrap(api.get('/umkm-panel/dashboard')),
  });
}

export function useUmkmInvestorList(page = 1) {
  return useQuery({
    queryKey: ['umkm', 'investors', page],
    queryFn: () => unwrapPaginated(api.get('/umkm-panel/investors', { params: { page } })),
  });
}

// Unpaginated -- used by the Pengajuan Bagi Hasil breakdown preview, which
// needs every investor to reconcile its totals, not just one page's worth.
export function useAllUmkmInvestors() {
  return useQuery({
    queryKey: ['umkm', 'investors', 'all'],
    queryFn: async () => (await unwrapPaginated(api.get('/umkm-panel/investors', { params: { per_page: 500 } }))).items,
  });
}

export function useProfitReports(page = 1) {
  return useQuery({
    queryKey: ['umkm', 'profit-reports', page],
    queryFn: () => unwrapPaginated(api.get('/umkm-panel/profit-reports', { params: { page } })),
  });
}

export function useSubmitProfitReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) => unwrap(api.post('/umkm-panel/profit-reports', formData)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['umkm', 'profit-reports'] });
      queryClient.invalidateQueries({ queryKey: ['umkm', 'dashboard'] });
    },
  });
}

export function usePlatformFeeInfo() {
  return useQuery({
    queryKey: ['umkm', 'platform-fee'],
    queryFn: () => unwrap(api.get('/umkm-panel/platform-fee')),
    staleTime: Infinity,
  });
}

export function useUmkmProfile() {
  return useQuery({
    queryKey: ['umkm', 'profile'],
    queryFn: () => unwrap(api.get('/umkm-panel/profile')),
  });
}

export function useUpdateUmkmProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => unwrap(api.patch('/umkm-panel/profile', payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['umkm', 'profile'] });
      queryClient.invalidateQueries({ queryKey: ['umkm', 'dashboard'] });
    },
  });
}
