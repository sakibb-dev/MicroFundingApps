import { Card, Table, Th, Td, Badge, EmptyState, SkeletonTable } from '../../components/ui';
import { formatCurrency, formatPeriode } from '../../utils/format';
import { useProfitReports } from '../../api/umkm';

const STATUS_LABEL = {
  draft: { label: 'Draft', variant: 'neutral' },
  submitted: { label: 'Direview', variant: 'warning' },
  approved: { label: 'Disetujui', variant: 'success' },
  processed: { label: 'Selesai', variant: 'success' },
  overdue: { label: 'Terlambat', variant: 'danger' },
  rejected: { label: 'Ditolak', variant: 'danger' },
};

export default function Riwayat() {
  const { data, isLoading } = useProfitReports();
  const riwayat = data || [];

  return (
    <div>
      <div className="mb-5">
        <div className="text-2xl font-extrabold text-neutral-900 tracking-tight">Riwayat Bagi Hasil</div>
        <div className="text-[13px] text-neutral-500 mt-1">Semua pengajuan bagi hasil per periode</div>
      </div>

      <Card padded={isLoading || riwayat.length === 0}>
        {isLoading ? (
          <SkeletonTable rows={5} cols={5} />
        ) : riwayat.length === 0 ? (
          <EmptyState title="Belum ada pengajuan" body="Riwayat pengajuan bagi hasilmu akan muncul di sini." tone="teal" />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Periode</Th>
                <Th>Keuntungan Bersih</Th>
                <Th>Total Bagi Hasil</Th>
                <Th>Fee Platform</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {riwayat.map((r) => {
                const status = STATUS_LABEL[r.status] || STATUS_LABEL.submitted;
                return (
                  <tr key={r.id}>
                    <Td className="font-medium text-neutral-900">{formatPeriode(r.periode)}</Td>
                    <Td>{formatCurrency(r.keuntungan_bersih)}</Td>
                    <Td>{formatCurrency(r.total_bagi_hasil_investor)}</Td>
                    <Td>{formatCurrency(r.fee_platform)}</Td>
                    <Td>
                      <Badge variant={status.variant} tone="teal">
                        {status.label}
                      </Badge>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
