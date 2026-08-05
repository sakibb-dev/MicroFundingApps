import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './client';

async function unwrap(promise) {
  const { data } = await promise;
  return data.data;
}

export function useUmkmList(filters = {}, options = {}) {
  return useQuery({
    queryKey: ['investor', 'umkm', filters],
    queryFn: () => unwrap(api.get('/investor/umkm', { params: filters })),
    ...options,
  });
}

export function useUmkmDetail(id) {
  return useQuery({
    queryKey: ['investor', 'umkm', 'detail', id],
    queryFn: () => unwrap(api.get(`/investor/umkm/${id}`)),
    enabled: id != null,
  });
}

export function useCreateInvestment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) => unwrap(api.post('/investor/investments', formData)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investor', 'portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['investor', 'investments'] });
    },
  });
}

export function usePortfolio() {
  return useQuery({
    queryKey: ['investor', 'portfolio'],
    queryFn: () => unwrap(api.get('/investor/portfolio')),
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: ['investor', 'notifications'],
    queryFn: () => unwrap(api.get('/investor/notifications')),
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => unwrap(api.patch(`/investor/notifications/${id}/read`)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['investor', 'notifications'] }),
  });
}

export function useInvestorProfile() {
  return useQuery({
    queryKey: ['investor', 'profile'],
    queryFn: () => unwrap(api.get('/investor/profile')),
  });
}

export function usePlatformBankInfo() {
  return useQuery({
    queryKey: ['investor', 'platform-bank'],
    queryFn: () => unwrap(api.get('/investor/platform-bank')),
    staleTime: Infinity,
  });
}

export function useUpdateInvestorProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => unwrap(api.patch('/investor/profile', payload)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['investor', 'profile'] }),
  });
}
