import { useNavigate } from 'react-router-dom';
import { IconIdBadge2, IconCreditCard } from '@tabler/icons-react';
import { Card, MetricCard, Button, Badge, Table, Th, Td } from '../../components/ui';
import { formatCurrency } from '../../utils/format';
import { getDashboardMetrics, getRecentActivity } from '../../mocks/admin';

const STATUS_BADGE = {
  pending: { variant: 'warning', label: 'Pending' },
  review: { variant: 'warning', label: 'Review' },
  approved: { variant: 'success', label: 'Approved' },
  rejected: { variant: 'danger', label: 'Ditolak' },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const metrics = getDashboardMetrics();
  const activity = getRecentActivity();

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
            <strong className="block text-[13.5px] text-neutral-900">{metrics.pendingKyc} KYC investor</strong>
            menunggu review
          </div>
          <Button variant="outline" tone="teal" size="sm" onClick={() => navigate('/admin/kyc')}>
            Review
          </Button>
        </div>
        <div className="flex-1 min-w-[240px] flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          <IconCreditCard size={20} className="text-warning shrink-0" aria-hidden="true" />
          <div className="text-[12.5px] text-neutral-700 flex-1">
            <strong className="block text-[13.5px] text-neutral-900">{metrics.pendingTransfer} bukti transfer</strong>
            menunggu konfirmasi
          </div>
          <Button variant="outline" tone="teal" size="sm" onClick={() => navigate('/admin/transaksi')}>
            Review
          </Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-3.5">
        <MetricCard label="Total UMKM Aktif" value={metrics.umkmAktif} />
        <MetricCard label="Total Investor Terverifikasi" value={metrics.investorTerverifikasi.toLocaleString('id-ID')} />
        <MetricCard label="Dana Beredar" value={formatCurrency(metrics.danaBeredar)} valueClassName="text-teal-700" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-6">
        <MetricCard label="Pending KYC" value={metrics.pendingKyc} valueClassName="text-warning" />
        <MetricCard label="Pending Konfirmasi Transfer" value={metrics.pendingTransfer} valueClassName="text-danger" />
        <MetricCard label="Fee Platform Bulan Ini" value={formatCurrency(metrics.feePlatformBulanIni)} valueClassName="text-teal-700" />
      </div>

      <div className="text-[15px] font-bold text-neutral-900 mb-3">Aktivitas terbaru</div>
      <Card padded={false}>
        <div className="p-3">
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
                const badge = STATUS_BADGE[item.status];
                return (
                  <tr key={item.id}>
                    <Td className="text-neutral-500 whitespace-nowrap">{item.waktu}</Td>
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
        </div>
      </Card>
    </div>
  );
}
