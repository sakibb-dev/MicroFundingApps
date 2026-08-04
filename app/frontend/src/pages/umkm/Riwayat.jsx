import { Card, Table, Th, Td, Badge } from '../../components/ui';
import { formatCurrency } from '../../utils/format';
import { getRiwayatBagiHasil } from '../../mocks/umkm';

function statusBadgeVariant(status) {
  if (status === 'Selesai') return 'success';
  if (status === 'Diproses' || status === 'Belum disubmit') return 'warning';
  if (status === 'Terlambat') return 'danger';
  return 'neutral';
}

export default function Riwayat() {
  const riwayat = getRiwayatBagiHasil();

  return (
    <div>
      <div className="mb-5">
        <div className="text-2xl font-extrabold text-neutral-900 tracking-tight">Riwayat Bagi Hasil</div>
        <div className="text-[13px] text-neutral-500 mt-1">Semua pengajuan bagi hasil per periode</div>
      </div>

      <Card padded={false}>
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
            {riwayat.map((r) => (
              <tr key={r.periode}>
                <Td className="font-medium text-neutral-900">{r.periode}</Td>
                <Td>{formatCurrency(r.keuntunganBersih)}</Td>
                <Td>{formatCurrency(r.totalBagiHasil)}</Td>
                <Td>{formatCurrency(r.feePlatform)}</Td>
                <Td>
                  <Badge variant={statusBadgeVariant(r.status)} tone="teal">
                    {r.status}
                  </Badge>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
