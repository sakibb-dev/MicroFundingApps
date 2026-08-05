import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './client';

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

export function useUmkmInvestorList() {
  return useQuery({
    queryKey: ['umkm', 'investors'],
    queryFn: () => unwrap(api.get('/umkm-panel/investors')),
  });
}

export function useProfitReports() {
  return useQuery({
    queryKey: ['umkm', 'profit-reports'],
    queryFn: () => unwrap(api.get('/umkm-panel/profit-reports')),
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
