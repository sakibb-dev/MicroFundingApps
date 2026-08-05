import { useState } from 'react';
import { IconCurrencyDollar, IconDownload } from '@tabler/icons-react';
import { Card, Chip, TextArea, Button, Badge, Table, Th, Td, ConfirmDialog, EmptyState, SkeletonTable } from '../../components/ui';
import { formatCurrency, formatPeriode } from '../../utils/format';
import { useAdminProfitReportList, useApproveProfitReport, useRejectProfitReport } from '../../api/admin';
import { useToast } from '../../context/ToastContext';

const STATUS_BADGE = {
  submitted: { variant: 'warning', label: 'Pending' },
  approved: { variant: 'success', label: 'Approved' },
  processed: { variant: 'success', label: 'Processed' },
  overdue: { variant: 'danger', label: 'Overdue' },
  rejected: { variant: 'danger', label: 'Ditolak' },
};

const FILTERS = [
  { key: 'submitted', label: 'Pending Review' },
  { key: 'approved', label: 'Approved' },
  { key: 'processed', label: 'Processed' },
  { key: 'overdue', label: 'Overdue' },
];

export default function BagiHasil() {
  const toast = useToast();
  const [filter, setFilter] = useState('submitted');
  const { data, isLoading } = useAdminProfitReportList(filter);
  const approveReport = useApproveProfitReport();
  const rejectReport = useRejectProfitReport();

  const items = data || [];
  const [selectedId, setSelectedId] = useState(null);
  const [rejecting, setRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);
  const [rejectConfirmOpen, setRejectConfirmOpen] = useState(false);

  const selected = items.find((i) => i.id === selectedId) || null;
  const submitting = approveReport.isPending || rejectReport.isPending;

  function openReview(id) {
    setSelectedId(id);
    setRejecting(false);
    setRejectReason('');
  }

  function handleApproveConfirm() {
    approveReport.mutate(selected.id, {
      onSuccess: (res) => {
        setApproveConfirmOpen(false);
        toast.success(res.message || `Bagi hasil ${selected.umkm?.nama_usaha} diproses.`);
      },
      onError: (err) => {
        setApproveConfirmOpen(false);
        toast.error(err?.response?.data?.message || 'Gagal memproses bagi hasil. Periksa kembali data pengajuan.');
      },
    });
  }

  function handleKirimPenolakan() {
    if (!rejectReason.trim()) {
      toast.error('Isi alasan penolakan sebelum mengirim.');
      return;
    }
    setRejectConfirmOpen(true);
  }

  function handleRejectConfirm() {
    rejectReport.mutate(
      { reportId: selected.id, alasan: rejectReason },
      {
        onSuccess: () => {
          setRejectConfirmOpen(false);
          setRejecting(false);
          toast.success(`Pengajuan bagi hasil ${selected.umkm?.nama_usaha} ditolak. UMKM diberi tahu untuk mengajukan ulang.`);
        },
        onError: () => toast.error('Gagal menolak pengajuan. Coba lagi.'),
      }
    );
  }

  return (
    <div>
      <div className="mb-5">
        <div className="text-[22px] font-extrabold tracking-tight text-neutral-900">Manajemen Bagi Hasil</div>
        <div className="text-[13px] text-neutral-500 mt-1">Review pengajuan disbursement UMKM</div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {FILTERS.map((f) => (
          <Chip key={f.key} tone="teal" active={filter === f.key} onClick={() => setFilter(f.key)}>
            {f.label}
            {f.key === 'submitted' && filter === 'submitted' ? ` (${items.length})` : ''}
          </Chip>
        ))}
      </div>

      <Card padded={false}>
        <div className="p-3">
          {isLoading ? (
            <SkeletonTable rows={5} cols={7} />
          ) : items.length === 0 ? (
            <EmptyState
              icon={IconCurrencyDollar}
              title="Tidak ada pengajuan"
              body={
                filter === 'submitted'
                  ? 'Tidak ada pengajuan bagi hasil yang menunggu review saat ini.'
                  : 'Belum ada pengajuan dengan status ini.'
              }
            />
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>UMKM</Th>
                  <Th>Periode</Th>
                  <Th>Keuntungan Bersih</Th>
                  <Th>Total Bagi Hasil</Th>
                  <Th>Fee</Th>
                  <Th>Status</Th>
                  <Th>Aksi</Th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const badge = STATUS_BADGE[item.status] || STATUS_BADGE.submitted;
                  return (
                    <tr key={item.id}>
                      <Td className="font-medium text-neutral-900">{item.umkm?.nama_usaha}</Td>
                      <Td className="text-neutral-500 whitespace-nowrap">{formatPeriode(item.periode)}</Td>
                      <Td className="whitespace-nowrap">{formatCurrency(item.keuntungan_bersih)}</Td>
                      <Td className="whitespace-nowrap">{formatCurrency(item.total_bagi_hasil_investor)}</Td>
                      <Td className="whitespace-nowrap">{formatCurrency(item.fee_platform)}</Td>
                      <Td>
                        <Badge variant={badge.variant} tone="teal">
                          {badge.label}
                        </Badge>
                      </Td>
                      <Td>
                        <Button variant="outline" tone="teal" size="sm" onClick={() => openReview(item.id)}>
                          {item.status === 'submitted' ? 'Review' : 'Lihat'}
                        </Button>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </div>
      </Card>

      {selected && (
        <Card className="mt-4">
          <div className="text-[15px] font-bold text-neutral-900 mb-3.5">
            Review — {selected.umkm?.nama_usaha}, {formatPeriode(selected.periode)}
          </div>

          <div className="grid sm:grid-cols-2 gap-2.5 mb-1">
            <div className="text-[12.5px]">
              <span className="block text-[11px] text-neutral-500">Keuntungan bersih</span>
              {formatCurrency(selected.keuntungan_bersih)}
            </div>
            <div className="text-[12.5px]">
              <span className="block text-[11px] text-neutral-500">Total bagi hasil ({selected.persen_bagi_hasil_snapshot}%)</span>
              {formatCurrency(selected.total_bagi_hasil_investor)}
            </div>
            <div className="text-[12.5px]">
              <span className="block text-[11px] text-neutral-500">Fee platform ({selected.persen_fee_platform_snapshot}%)</span>
              {formatCurrency(selected.fee_platform)}
            </div>
            <div className="text-[12.5px]">
              <span className="block text-[11px] text-neutral-500">Jumlah investor</span>
              {selected.distributions_count} orang
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-teal-700 hover:text-teal-800 my-3.5"
          >
            <IconDownload size={14} aria-hidden="true" /> Lihat Laporan Keuangan (download)
          </button>

          {selected.status === 'submitted' ? (
            <>
              <div className="flex flex-wrap gap-2.5 mt-1">
                <Button variant="danger-outline" tone="teal" onClick={() => setRejecting(true)}>
                  Tolak
                </Button>
                <Button variant="primary" tone="teal" onClick={() => setApproveConfirmOpen(true)}>
                  Approve & Proses
                </Button>
              </div>

              {rejecting && (
                <div className="mt-3 p-3 bg-red-50 rounded-lg">
                  <TextArea
                    label="Alasan penolakan"
                    required
                    rows={2}
                    placeholder="Contoh: laporan keuangan tidak sesuai dengan keuntungan yang dilaporkan"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                  <Button variant="danger" tone="teal" onClick={handleKirimPenolakan}>
                    Kirim Penolakan
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-[12.5px] text-neutral-500 mt-1">
              Pengajuan ini sudah direview — status:{' '}
              <Badge variant={STATUS_BADGE[selected.status].variant} tone="teal">
                {STATUS_BADGE[selected.status].label}
              </Badge>
            </div>
          )}
        </Card>
      )}

      <ConfirmDialog
        open={approveConfirmOpen}
        onClose={() => !submitting && setApproveConfirmOpen(false)}
        onConfirm={handleApproveConfirm}
        title="Approve & proses bagi hasil?"
        description={
          selected
            ? `Distribusi bagi hasil ${selected.umkm?.nama_usaha} periode ${formatPeriode(selected.periode)} ke ${selected.distributions_count} investor akan dimulai. Aksi ini tidak bisa dibatalkan.`
            : ''
        }
        confirmLabel="Approve & Proses"
        tone="teal"
        loading={submitting}
      />

      <ConfirmDialog
        open={rejectConfirmOpen}
        onClose={() => !submitting && setRejectConfirmOpen(false)}
        onConfirm={handleRejectConfirm}
        title="Tolak pengajuan ini?"
        description={
          selected ? `Pengajuan bagi hasil ${selected.umkm?.nama_usaha} periode ${formatPeriode(selected.periode)} akan ditolak.` : ''
        }
        confirmLabel="Tolak"
        tone="teal"
        danger
        loading={submitting}
      />
    </div>
  );
}
