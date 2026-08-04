import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconChartPie } from '@tabler/icons-react';
import { Card, MetricCard, Badge, Table, Th, Td, EmptyState } from '../../components/ui';
import { formatCurrency } from '../../utils/format';
import { getPortfolio, getCategoryIcon } from '../../mocks/investor';

const STATUS_LABEL = {
  aktif: { label: 'Aktif', className: 'text-green-600' },
  menunggu: { label: 'Menunggu', className: 'text-warning' },
};

const RIWAYAT_BADGE = {
  cair: { label: 'Cair', variant: 'success' },
  diproses: { label: 'Diproses', variant: 'warning' },
};

export default function Portfolio() {
  const navigate = useNavigate();
  const { metrics, activeInvestments, riwayat } = useMemo(() => getPortfolio(), []);
  const isEmpty = activeInvestments.length === 0 && riwayat.length === 0;

  return (
    <div>
      <div className="mb-6">
        <div className="text-2xl font-extrabold text-neutral-900 tracking-tight">Portfolio Saya</div>
        <div className="text-[13.5px] text-neutral-500 mt-0.5">Ringkasan investasi dan bagi hasil kamu</div>
      </div>

      {isEmpty ? (
        <Card>
          <EmptyState
            icon={IconChartPie}
            title="Belum ada investasi"
            body="Mulai danai UMKM pilihanmu dan dapatkan bagi hasil bulanan."
            ctaLabel="Jelajahi UMKM"
            onCta={() => navigate('/investor')}
            tone="green"
          />
        </Card>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
            <MetricCard label="Total Investasi Aktif" value={formatCurrency(metrics.totalInvestasiAktif)} />
            <MetricCard
              label="Total Bagi Hasil Diterima"
              value={formatCurrency(metrics.totalBagiHasilDiterima)}
              valueClassName="text-green-600"
            />
            <MetricCard label="UMKM Aktif" value={metrics.umkmAktifCount} />
            <MetricCard label="Return Rata-rata" value={`${metrics.returnRataRata}%/bln`} valueClassName="text-green-600" />
          </div>

          <div className="text-[15px] font-bold text-neutral-900 mb-3">Investasi aktif</div>
          {activeInvestments.length === 0 ? (
            <Card>
              <EmptyState title="Belum ada investasi aktif" body="Investasi yang sedang berjalan akan muncul di sini." />
            </Card>
          ) : (
            <Card padded={false}>
              <div className="px-5">
                {activeInvestments.map((inv) => {
                  const Icon = getCategoryIcon(inv.category);
                  const status = STATUS_LABEL[inv.status] || STATUS_LABEL.aktif;
                  return (
                    <div key={inv.id} className="flex items-center justify-between gap-3 py-3.5 border-b border-neutral-100 last:border-b-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-[10px] bg-green-100 flex items-center justify-center shrink-0">
                          <Icon size={18} className="text-green-800" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[13.5px] font-bold text-neutral-900 truncate">{inv.name}</div>
                          <div className="text-[11.5px] text-neutral-500">
                            {formatCurrency(inv.nominal)} &middot; {inv.percent}% kepemilikan
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-green-600">+{formatCurrency(inv.bagiHasil)}</div>
                        <div className={`text-[11px] mt-0.5 font-semibold ${status.className}`}>{status.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          <div className="text-[15px] font-bold text-neutral-900 mt-7 mb-3">Riwayat bagi hasil</div>
          {riwayat.length === 0 ? (
            <Card>
              <EmptyState title="Belum ada riwayat bagi hasil" body="Riwayat bagi hasil bulananmu akan muncul di sini." />
            </Card>
          ) : (
            <Card>
              <Table>
                <thead>
                  <tr>
                    <Th>Periode</Th>
                    <Th>UMKM</Th>
                    <Th>Nominal</Th>
                    <Th>Bagi Hasil</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody>
                  {riwayat.map((row) => {
                    const badge = RIWAYAT_BADGE[row.status] || RIWAYAT_BADGE.diproses;
                    return (
                      <tr key={row.id}>
                        <Td>{row.periode}</Td>
                        <Td>{row.umkm}</Td>
                        <Td>{formatCurrency(row.nominal)}</Td>
                        <Td>{formatCurrency(row.bagiHasil)}</Td>
                        <Td>
                          <Badge variant={badge.variant} tone="green">
                            {badge.label}
                          </Badge>
                        </Td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
