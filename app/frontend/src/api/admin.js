import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './client';
import { unwrapPaginated } from './pagination';

async function unwrap(promise) {
  const { data } = await promise;
  return data.data;
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => unwrap(api.get('/admin/dashboard')),
  });
}

export function useKycList(status, page = 1) {
  return useQuery({
    queryKey: ['admin', 'kyc', status, page],
    queryFn: () => unwrapPaginated(api.get('/admin/kyc', { params: { page, ...(status && status !== 'all' ? { status } : {}) } })),
  });
}

export function useApproveKyc() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (investorId) => unwrap(api.post(`/admin/kyc/${investorId}/approve`)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'kyc'] }),
  });
}

export function useRejectKyc() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ investorId, alasan }) => unwrap(api.post(`/admin/kyc/${investorId}/reject`, { alasan })),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'kyc'] }),
  });
}

export function useAdminUmkmList(status, page = 1) {
  return useQuery({
    queryKey: ['admin', 'umkm', status, page],
    queryFn: () => unwrapPaginated(api.get('/admin/umkm', { params: { page, ...(status && status !== 'all' ? { status } : {}) } })),
  });
}

export function useApproveUmkm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (umkmId) => unwrap(api.post(`/admin/umkm/${umkmId}/approve`)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'umkm'] }),
  });
}

export function useRejectUmkm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ umkmId, alasan }) => unwrap(api.post(`/admin/umkm/${umkmId}/reject`, { alasan })),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'umkm'] }),
  });
}

export function useAdminInvestmentList(status, page = 1) {
  return useQuery({
    queryKey: ['admin', 'investments', status, page],
    queryFn: () => unwrapPaginated(api.get('/admin/investments', { params: { page, ...(status ? { status } : {}) } })),
  });
}

export function useConfirmInvestment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (investmentId) => unwrap(api.post(`/admin/investments/${investmentId}/confirm`)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'investments'] }),
  });
}

export function useRejectInvestment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ investmentId, alasan }) => unwrap(api.post(`/admin/investments/${investmentId}/reject`, { alasan })),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'investments'] }),
  });
}

export function useAdminProfitReportList(status, page = 1) {
  return useQuery({
    queryKey: ['admin', 'profit-reports', status, page],
    queryFn: () => unwrapPaginated(api.get('/admin/profit-reports', { params: { page, ...(status ? { status } : {}) } })),
  });
}

export function useProfitReportDetail(id) {
  return useQuery({
    queryKey: ['admin', 'profit-reports', 'detail', id],
    queryFn: () => unwrap(api.get(`/admin/profit-reports/${id}`)),
    enabled: id != null,
  });
}

export function useApproveProfitReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reportId) => unwrap(api.post(`/admin/profit-reports/${reportId}/approve`)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'profit-reports'] }),
  });
}

export function useRejectProfitReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reportId, alasan }) => unwrap(api.post(`/admin/profit-reports/${reportId}/reject`, { alasan })),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'profit-reports'] }),
  });
}

export function useAdminReport() {
  return useQuery({
    queryKey: ['admin', 'reports'],
    queryFn: () => unwrap(api.get('/admin/reports')),
  });
}

export function useAdminSettings() {
  return useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: () => unwrap(api.get('/admin/settings')),
  });
}

export function useUpdateAdminSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => unwrap(api.patch('/admin/settings', payload)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] }),
  });
}

export function useForwardInvestment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ investmentId, catatan }) => unwrap(api.post(`/admin/investments/${investmentId}/forward`, { catatan })),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'investments'] }),
  });
}
