import { Link } from 'react-router-dom';
import { IconAlertTriangle } from '@tabler/icons-react';
import { MetricCard, ProgressBar, Card, Badge, Table, Th, Td, Skeleton } from '../../components/ui';
import { formatCurrency, formatPeriode } from '../../utils/format';
import { useUmkmDashboard } from '../../api/umkm';

const DEADLINE_WARNING_THRESHOLD_DAYS = 7;

const STATUS_LABEL = {
  draft: { label: 'Draft', variant: 'neutral' },
  submitted: { label: 'Direview', variant: 'warning' },
  approved: { label: 'Disetujui', variant: 'success' },
  processed: { label: 'Selesai', variant: 'success' },
  overdue: { label: 'Terlambat', variant: 'danger' },
  rejected: { label: 'Ditolak', variant: 'danger' },
};

export default function Dashboard() {
  const { data, isLoading } = useUmkmDashboard();

  if (isLoading || !data) {
    return (
      <div>
        <div className="mb-5">
          <div className="text-2xl font-extrabold text-neutral-900 tracking-tight">Dashboard</div>
          <div className="text-[13px] text-neutral-500 mt-1">Ringkasan campaign dan bagi hasil</div>
        </div>
        <Skeleton className="h-40 w-full mb-5" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const { umkm } = data;
  const showDeadlineAlert = !data.sudah_submit_periode_ini && data.hari_tersisa <= DEADLINE_WARNING_THRESHOLD_DAYS;

  return (
    <div>
      <div className="mb-5">
        <div className="text-2xl font-extrabold text-neutral-900 tracking-tight">Dashboard</div>
        <div className="text-[13px] text-neutral-500 mt-1">Ringkasan campaign dan bagi hasil</div>
      </div>

      {showDeadlineAlert && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 sm:px-[18px] py-3.5 mb-5 flex-wrap">
          <IconAlertTriangle size={20} className="text-amber-700 shrink-0" aria-hidden="true" />
          <div className="flex-1 min-w-[200px] text-[13px] text-amber-800">
            Pengajuan bagi hasil bulan ini belum disubmit.{' '}
            <strong className="font-bold">Deadline: {data.hari_tersisa} hari lagi</strong>
          </div>
          <Link
            to="/umkm/pengajuan"
            className="inline-flex items-center justify-center gap-1.5 rounded-full font-semibold whitespace-nowrap px-5 py-2.5 text-[13.5px] bg-teal-800 text-white hover:bg-teal-700 transition-colors"
          >
            Submit sekarang
          </Link>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
        <MetricCard
          label="Dana terkumpul"
          value={formatCurrency(umkm.total_terkumpul)}
          valueClassName="text-teal-700"
          sub={`dari target ${formatCurrency(umkm.target_dana)}`}
        />
        <MetricCard label="Jumlah investor" value={`${data.jumlah_investor} orang`} />
        <MetricCard
          label="Bagi hasil bulan lalu"
          value={formatCurrency(data.bagi_hasil_bulan_lalu)}
          valueClassName="text-teal-700"
          sub="total didistribusikan"
        />
      </div>

      <Card className="text-center mb-5">
        <div className="text-4xl font-extrabold text-teal-800 tracking-tight">{umkm.persen_terkumpul}%</div>
        <div className="text-[13px] text-neutral-500 mt-1">dana terkumpul dari target campaign</div>
        <ProgressBar percent={umkm.persen_terkumpul} tone="teal" size="lg" className="max-w-[420px] mx-auto mt-4" />
        <div className="flex justify-between text-[12.5px] text-neutral-500 max-w-[420px] mx-auto mt-1.5">
          <span>{formatCurrency(umkm.total_terkumpul)} terkumpul</span>
          <span>Target {formatCurrency(umkm.target_dana)}</span>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-teal-900 text-white rounded-lg px-5 sm:px-[22px] py-[18px] mb-5">
        <div className="text-[13.5px]">
          <strong className="block text-base mb-0.5">Jatuh tempo submit bagi hasil</strong>
          {data.sudah_submit_periode_ini
            ? `Sudah disubmit — periode ${formatPeriode(data.periode_berjalan)}`
            : `${data.hari_tersisa} hari lagi — periode ${formatPeriode(data.periode_berjalan)}`}
        </div>
        {!data.sudah_submit_periode_ini && (
          <Link
            to="/umkm/pengajuan"
            className="inline-flex items-center justify-center gap-1.5 rounded-full font-semibold whitespace-nowrap px-5 py-2.5 text-[13.5px] bg-white text-teal-900 hover:bg-neutral-100 transition-colors self-start sm:self-auto"
          >
            Submit Bagi Hasil
          </Link>
        )}
      </div>

      <div className="text-[15px] font-bold text-neutral-900 mb-3">Riwayat bagi hasil terakhir</div>
      <Card padded={false}>
        <Table>
          <thead>
            <tr>
              <Th>Periode</Th>
              <Th>Keuntungan Kotor</Th>
              <Th>Total Bagi Hasil</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {data.riwayat_terakhir.map((r) => {
              const status = STATUS_LABEL[r.status] || STATUS_LABEL.submitted;
              return (
                <tr key={r.id}>
                  <Td>{formatPeriode(r.periode)}</Td>
                  <Td>{formatCurrency(r.keuntungan_kotor)}</Td>
                  <Td>{formatCurrency(r.total_bagi_hasil_investor)}</Td>
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
      </Card>
    </div>
  );
}
