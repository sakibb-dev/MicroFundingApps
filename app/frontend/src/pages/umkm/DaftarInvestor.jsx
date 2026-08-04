import { IconUsers } from '@tabler/icons-react';
import { Card, Table, Th, Td, EmptyState } from '../../components/ui';
import { formatCurrency, formatDate, maskName } from '../../utils/format';
import { getInvestorList, getFundingProgress } from '../../mocks/umkm';

export default function DaftarInvestor() {
  const investors = getInvestorList();
  const funding = getFundingProgress();

  return (
    <div>
      <div className="mb-5">
        <div className="text-2xl font-extrabold text-neutral-900 tracking-tight">Daftar Investor</div>
        <div className="text-[13px] text-neutral-500 mt-1">{investors.length} investor mendanai usahamu</div>
      </div>

      <Card padded={investors.length === 0}>
        {investors.length === 0 ? (
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
              {investors.map((inv) => (
                <tr key={inv.id}>
                  <Td className="font-medium text-neutral-900">{maskName(inv.nama)}</Td>
                  <Td>{formatCurrency(inv.nominal)}</Td>
                  <Td>{((inv.nominal / funding.terkumpul) * 100).toFixed(1)}%</Td>
                  <Td>{formatDate(inv.tanggal)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
