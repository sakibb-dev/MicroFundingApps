import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconIdBadge2, IconCreditCard } from '@tabler/icons-react';
import { Card, MetricCard, Button, Badge, Table, Th, Td, Skeleton } from '../../components/ui';
import { formatCurrency, formatRelativeTime } from '../../utils/format';
import { useAdminDashboard, useKycList, useAdminUmkmList } from '../../api/admin';

const STATUS_BADGE = {
  pending: { variant: 'warning', label: 'Pending' },
  approved: { variant: 'success', label: 'Approved' },
  rejected: { variant: 'danger', label: 'Ditolak' },
};

// No unified activity-log endpoint exists on the backend -- this merges the
// two admin review queues we already fetch elsewhere (KYC + UMKM
// registrations) into a "recent activity" feed. It intentionally does not
// cover investment/profit-report events since the admin investment endpoint
// only ever returns one status at a time (no combined-status query).
function buildActivity(kycItems, umkmItems) {
  const fromKyc = kycItems.map((k) => ({
    id: `kyc-${k.id}`,
    at: k.tanggal_daftar,
    tipe: 'Pendaftaran KYC',
    subjek: k.nama,
    status: k.status,
  }));
  const fromUmkm = umkmItems.map((u) => ({
    id: `umkm-${u.id}`,
    at: u.created_at,
    tipe: 'UMKM baru daftar',
    subjek: u.nama_usaha,
    status: u.status,
  }));
  return [...fromKyc, ...fromUmkm]
    .sort((a, b) => new Date(b.at) - new Date(a.at))
    .slice(0, 6);
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: metrics, isLoading: metricsLoading } = useAdminDashboard();
  const { data: kycItems, isLoading: kycLoading } = useKycList('all');
  const { data: umkmItems, isLoading: umkmLoading } = useAdminUmkmList('all');

  const activity = useMemo(
    () => buildActivity(kycItems?.items || [], umkmItems?.items || []),
    [kycItems, umkmItems]
  );
  const isLoading = metricsLoading || kycLoading || umkmLoading;

  if (isLoading || !metrics) {
    return (
      <div>
        <div className="mb-5">
          <div className="text-[22px] font-extrabold tracking-tight text-neutral-900">Dashboard Admin</div>
          <div className="text-[13px] text-neutral-500 mt-1">Overview metrik platform MicroInvest</div>
        </div>
        <Skeleton className="h-24 w-full mb-5" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <div className="text-[22px] font-extrabold tracking-tight text-neutral-900">Dashboard Admin</div>
        <div className="text-[13px] text-neutral-500 mt-1">Overview metrik platform MicroInvest</div>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex-1 min-w-[240px] flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <IconIdBadge2 size={20} className="text-danger shrink-0" aria-hidden="true" />
          <div className="text-[12.5px] text-neutral-700 flex-1">
            <strong className="block text-[13.5px] text-neutral-900">{metrics.pending_kyc} KYC investor</strong>
            menunggu review
          </div>
          <Button variant="outline" tone="teal" size="sm" onClick={() => navigate('/admin-panel/kyc')}>
            Review
          </Button>
        </div>
        <div className="flex-1 min-w-[240px] flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          <IconCreditCard size={20} className="text-warning shrink-0" aria-hidden="true" />
          <div className="text-[12.5px] text-neutral-700 flex-1">
            <strong className="block text-[13.5px] text-neutral-900">{metrics.pending_transfer} bukti transfer</strong>
            menunggu konfirmasi
          </div>
          <Button variant="outline" tone="teal" size="sm" onClick={() => navigate('/admin-panel/transaksi')}>
            Review
          </Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-3.5">
        <MetricCard label="Total UMKM Aktif" value={metrics.total_umkm_aktif} />
        <MetricCard label="Total Investor Terverifikasi" value={metrics.total_investor_terverifikasi.toLocaleString('id-ID')} />
        <MetricCard label="Dana Beredar" value={formatCurrency(metrics.dana_beredar)} valueClassName="text-teal-700" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-6">
        <MetricCard label="Pending KYC" value={metrics.pending_kyc} valueClassName="text-warning" />
        <MetricCard label="Pending Konfirmasi Transfer" value={metrics.pending_transfer} valueClassName="text-danger" />
        <MetricCard label="Fee Platform Bulan Ini" value={formatCurrency(metrics.fee_platform_bulan_ini)} valueClassName="text-teal-700" />
      </div>

      <div className="text-[15px] font-bold text-neutral-900 mb-3">Aktivitas terbaru</div>
      <Card padded={false}>
        <div className="p-3">
          {activity.length === 0 ? (
            <div className="text-[13px] text-neutral-500 text-center py-6">Belum ada aktivitas.</div>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Waktu</Th>
                  <Th>Tipe</Th>
                  <Th>Subjek</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {activity.map((item) => {
                  const badge = STATUS_BADGE[item.status] || STATUS_BADGE.pending;
                  return (
                    <tr key={item.id}>
                      <Td className="text-neutral-500 whitespace-nowrap">{formatRelativeTime(item.at)}</Td>
                      <Td>{item.tipe}</Td>
                      <Td className="font-medium text-neutral-900">{item.subjek}</Td>
                      <Td>
                        <Badge variant={badge.variant} tone="teal">
                          {badge.label}
                        </Badge>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  );
}
