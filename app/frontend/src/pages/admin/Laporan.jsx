import { Card, MetricCard, Button, Skeleton } from '../../components/ui';
import { formatCurrency } from '../../utils/format';
import { useAdminReport } from '../../api/admin';
import { useToast } from '../../context/ToastContext';

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function monthLabel(bulan) {
  const [, month] = bulan.split('-');
  return MONTH_SHORT[Number(month) - 1] || bulan;
}

export default function Laporan() {
  const toast = useToast();
  const { data, isLoading } = useAdminReport();

  function handleExport(type) {
    toast.info(`Export ${type} belum tersedia di tahap ini.`);
  }

  if (isLoading || !data) {
    return (
      <div>
        <div className="mb-5">
          <div className="text-[22px] font-extrabold tracking-tight text-neutral-900">Laporan Platform</div>
          <div className="text-[13px] text-neutral-500 mt-1">Ringkasan keuangan dan transaksi platform</div>
        </div>
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const series = data.fee_per_bulan.map((s) => ({ month: monthLabel(s.bulan), value: Number(s.total) }));
  const maxValue = Math.max(1, ...series.map((s) => s.value));

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <div className="text-[22px] font-extrabold tracking-tight text-neutral-900">Laporan Platform</div>
          <div className="text-[13px] text-neutral-500 mt-1">Ringkasan keuangan dan transaksi platform</div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" tone="teal" onClick={() => handleExport('Excel')}>
            Export Excel
          </Button>
          <Button variant="primary" tone="teal" onClick={() => handleExport('PDF')}>
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-6">
        <MetricCard label="Total Transaksi Masuk" value={formatCurrency(data.total_transaksi_masuk)} valueClassName="text-teal-700" />
        <MetricCard label="Total Bagi Hasil Diproses" value={formatCurrency(data.total_bagi_hasil_diproses)} />
        <MetricCard label="Fee Terkumpul" value={formatCurrency(data.fee_terkumpul)} valueClassName="text-teal-700" />
      </div>

      <div className="text-[15px] font-bold text-neutral-900 mb-3">Fee platform per bulan</div>
      <Card>
        {series.length === 0 ? (
          <div className="text-[13px] text-neutral-500 text-center py-6">Belum ada data fee platform.</div>
        ) : (
          <div className="flex items-end gap-4 h-[150px] pt-2.5 pb-1">
            {series.map((s) => {
              const heightPx = Math.max(8, Math.round((s.value / maxValue) * 120));
              return (
                <div key={s.month} className="flex-1 text-center">
                  <div
                    className="bg-teal-300 rounded-t-md mb-1.5 mx-auto transition-all"
                    style={{ height: `${heightPx}px` }}
                    role="img"
                    aria-label={`Fee ${s.month}: ${formatCurrency(s.value)}`}
                  />
                  <div className="text-[11px] text-neutral-500">{s.month}</div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
