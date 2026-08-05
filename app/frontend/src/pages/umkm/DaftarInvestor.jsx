import { IconUsers } from '@tabler/icons-react';
import { Card, Table, Th, Td, EmptyState, SkeletonTable } from '../../components/ui';
import { formatCurrency, formatDate } from '../../utils/format';
import { useUmkmInvestorList } from '../../api/umkm';

export default function DaftarInvestor() {
  const { data, isLoading } = useUmkmInvestorList();
  const investors = data || [];

  return (
    <div>
      <div className="mb-5">
        <div className="text-2xl font-extrabold text-neutral-900 tracking-tight">Daftar Investor</div>
        <div className="text-[13px] text-neutral-500 mt-1">
          {isLoading ? 'Memuat...' : `${investors.length} investor mendanai usahamu`}
        </div>
      </div>

      <Card padded={isLoading || investors.length === 0}>
        {isLoading ? (
          <SkeletonTable rows={5} cols={4} />
        ) : investors.length === 0 ? (
          <EmptyState
            icon={IconUsers}
            title="Belum ada investor"
            body="Investor yang mendanai usahamu akan muncul di sini."
            tone="teal"
          />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Investor</Th>
                <Th>Nominal</Th>
                <Th>% Kepemilikan</Th>
                <Th>Tanggal Investasi</Th>
              </tr>
            </thead>
            <tbody>
              {investors.map((inv, i) => (
                <tr key={i}>
                  <Td className="font-medium text-neutral-900">{inv.nama}</Td>
                  <Td>{formatCurrency(inv.nominal)}</Td>
                  <Td>{inv.persen_kepemilikan}%</Td>
                  <Td>{inv.tanggal_investasi ? formatDate(inv.tanggal_investasi) : '—'}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
