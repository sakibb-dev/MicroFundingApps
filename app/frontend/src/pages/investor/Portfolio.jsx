import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconChartPie } from '@tabler/icons-react';
import { Card, MetricCard, Badge, Table, Th, Td, EmptyState, SkeletonList } from '../../components/ui';
import { formatCurrency, formatPeriode } from '../../utils/format';
import { getCategoryIcon } from '../../mocks/investor';
import { usePortfolio } from '../../api/investor';

const STATUS_LABEL = {
  confirmed: { label: 'Aktif', className: 'text-green-600' },
  active: { label: 'Aktif', className: 'text-green-600' },
  pending_confirmation: { label: 'Menunggu Konfirmasi', className: 'text-warning' },
  rejected: { label: 'Ditolak', className: 'text-danger' },
};

const RIWAYAT_BADGE = {
  processed: { label: 'Cair', variant: 'success' },
  pending: { label: 'Diproses', variant: 'warning' },
  failed: { label: 'Gagal', variant: 'danger' },
};

export default function Portfolio() {
  const navigate = useNavigate();
  const { data, isLoading } = usePortfolio();

  const metrics = {
    totalInvestasiAktif: data?.total_investasi_aktif ?? 0,
    totalBagiHasilDiterima: data?.total_bagi_hasil_diterima ?? 0,
    umkmAktifCount: data?.umkm_aktif ?? 0,
    returnRataRata: data?.return_rata_rata ?? 0,
  };
  const activeInvestments = useMemo(
    () =>
      (data?.investasi_aktif || []).map((inv) => ({
        id: inv.id,
        umkmId: inv.umkm_id,
        name: inv.nama_usaha,
        category: inv.kategori,
        nominal: inv.nominal,
        percent: inv.persen_kepemilikan,
        bagiHasil: inv.bagi_hasil_diterima,
        status: inv.status,
      })),
    [data]
  );
  const riwayat = useMemo(
    () =>
      (data?.riwayat_bagi_hasil || []).map((r) => ({
        id: r.id,
        periode: r.periode,
        umkm: r.umkm,
        bagiHasil: r.nominal,
        status: r.status,
      })),
    [data]
  );
  const isEmpty = !isLoading && activeInvestments.length === 0 && riwayat.length === 0;

  if (isLoading) {
    return (
      <div>
        <div className="mb-6">
          <div className="text-2xl font-extrabold text-neutral-900 tracking-tight">Portfolio Saya</div>
          <div className="text-[13.5px] text-neutral-500 mt-0.5">Ringkasan investasi dan bagi hasil kamu</div>
        </div>
        <SkeletonList rows={3} />
      </div>
    );
  }

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

          <div className="text-[15px] font-bold text-neutral-900 mb-3">Investasi saya</div>
          {activeInvestments.length === 0 ? (
            <Card>
              <EmptyState title="Belum ada investasi" body="Investasi yang kamu buat akan muncul di sini." />
            </Card>
          ) : (
            <Card padded={false}>
              <div className="px-5">
                {activeInvestments.map((inv) => {
                  const Icon = getCategoryIcon(inv.category);
                  const status = STATUS_LABEL[inv.status] || STATUS_LABEL.pending_confirmation;
                  const isSettled = inv.status === 'confirmed' || inv.status === 'active';
                  return (
                    <div key={inv.id} className="flex items-center justify-between gap-3 py-3.5 border-b border-neutral-100 last:border-b-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-[10px] bg-green-100 flex items-center justify-center shrink-0">
                          <Icon size={18} className="text-green-800" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[13.5px] font-bold text-neutral-900 truncate">{inv.name}</div>
                          <div className="text-[11.5px] text-neutral-500">
                            {formatCurrency(inv.nominal)}
                            {isSettled ? ` · ${inv.percent}% kepemilikan` : ''}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        {isSettled && <div className="text-sm font-bold text-green-600">+{formatCurrency(inv.bagiHasil)}</div>}
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
                    <Th>Bagi Hasil</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody>
                  {riwayat.map((row) => {
                    const badge = RIWAYAT_BADGE[row.status] || RIWAYAT_BADGE.pending;
                    return (
                      <tr key={row.id}>
                        <Td>{formatPeriode(row.periode)}</Td>
                        <Td>{row.umkm}</Td>
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
