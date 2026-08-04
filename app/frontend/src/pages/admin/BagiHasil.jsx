import { useMemo, useState } from 'react';
import { IconCurrencyDollar, IconDownload } from '@tabler/icons-react';
import { Card, Chip, TextArea, Button, Badge, Table, Th, Td, ConfirmDialog, EmptyState } from '../../components/ui';
import { formatCurrency } from '../../utils/format';
import { getBagiHasilList } from '../../mocks/admin';
import { useToast } from '../../context/ToastContext';

const STATUS_BADGE = {
  pending: { variant: 'warning', label: 'Pending' },
  approved: { variant: 'success', label: 'Approved' },
  processed: { variant: 'success', label: 'Processed' },
  overdue: { variant: 'danger', label: 'Overdue' },
  rejected: { variant: 'danger', label: 'Ditolak' },
};

const FILTERS = [
  { key: 'pending', label: 'Pending Review' },
  { key: 'approved', label: 'Approved' },
  { key: 'processed', label: 'Processed' },
  { key: 'overdue', label: 'Overdue' },
];

export default function BagiHasil() {
  const toast = useToast();
  const [items, setItems] = useState(() => getBagiHasilList());
  const [filter, setFilter] = useState('pending');
  const [selectedId, setSelectedId] = useState(null);
  const [rejecting, setRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);
  const [rejectConfirmOpen, setRejectConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const pendingCount = items.filter((i) => i.status === 'pending').length;

  const filtered = useMemo(() => items.filter((i) => i.status === filter), [items, filter]);

  const selected = items.find((i) => i.id === selectedId) || null;

  function openReview(id) {
    setSelectedId(id);
    setRejecting(false);
    setRejectReason('');
  }

  function handleApproveConfirm() {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setApproveConfirmOpen(false);
      if (!selected.breakdownValid) {
        toast.error('Total breakdown tidak sesuai dengan total bagi hasil. Periksa kembali data pengajuan.');
        return;
      }
      setItems((prev) => prev.map((i) => (i.id === selected.id ? { ...i, status: 'processed' } : i)));
      toast.success(
        `Bagi hasil ${selected.umkm} periode ${selected.periode} diproses. Distribusi ke ${selected.jumlahInvestor} investor dimulai.`
      );
    }, 700);
  }

  function handleKirimPenolakan() {
    if (!rejectReason.trim()) {
      toast.error('Isi alasan penolakan sebelum mengirim.');
      return;
    }
    setRejectConfirmOpen(true);
  }

  function handleRejectConfirm() {
    setSubmitting(true);
    setTimeout(() => {
      setItems((prev) => prev.map((i) => (i.id === selected.id ? { ...i, status: 'rejected' } : i)));
      setSubmitting(false);
      setRejectConfirmOpen(false);
      setRejecting(false);
      toast.success(`Pengajuan bagi hasil ${selected.umkm} ditolak. UMKM diberi tahu untuk mengajukan ulang.`);
    }, 700);
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
            {f.key === 'pending' ? ` (${pendingCount})` : ''}
          </Chip>
        ))}
      </div>

      <Card padded={false}>
        <div className="p-3">
          {filtered.length === 0 ? (
            <EmptyState
              icon={IconCurrencyDollar}
              title="Tidak ada pengajuan"
              body={
                filter === 'pending'
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
                {filtered.map((item) => {
                  const badge = STATUS_BADGE[item.status];
                  return (
                    <tr key={item.id}>
                      <Td className="font-medium text-neutral-900">{item.umkm}</Td>
                      <Td className="text-neutral-500 whitespace-nowrap">{item.periode}</Td>
                      <Td className="whitespace-nowrap">{formatCurrency(item.keuntunganBersih)}</Td>
                      <Td className="whitespace-nowrap">{formatCurrency(item.totalBagiHasil)}</Td>
                      <Td className="whitespace-nowrap">{formatCurrency(item.fee)}</Td>
                      <Td>
                        <Badge variant={badge.variant} tone="teal">
                          {badge.label}
                        </Badge>
                      </Td>
                      <Td>
                        <Button variant="outline" tone="teal" size="sm" onClick={() => openReview(item.id)}>
                          {item.status === 'pending' ? 'Review' : 'Lihat'}
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
            Review — {selected.umkm}, {selected.periode}
          </div>

          <div className="grid sm:grid-cols-2 gap-2.5 mb-1">
            <div className="text-[12.5px]">
              <span className="block text-[11px] text-neutral-500">Keuntungan bersih</span>
              {formatCurrency(selected.keuntunganBersih)}
            </div>
            <div className="text-[12.5px]">
              <span className="block text-[11px] text-neutral-500">Total bagi hasil (30%)</span>
              {formatCurrency(selected.totalBagiHasil)}
            </div>
            <div className="text-[12.5px]">
              <span className="block text-[11px] text-neutral-500">Fee platform (5%)</span>
              {formatCurrency(selected.fee)}
            </div>
            <div className="text-[12.5px]">
              <span className="block text-[11px] text-neutral-500">Jumlah investor</span>
              {selected.jumlahInvestor} orang
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-teal-700 hover:text-teal-800 my-3.5"
          >
            <IconDownload size={14} aria-hidden="true" /> Lihat Laporan Keuangan (download)
          </button>

          {selected.status === 'pending' ? (
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
            ? `Distribusi bagi hasil ${selected.umkm} periode ${selected.periode} ke ${selected.jumlahInvestor} investor akan dimulai. Aksi ini tidak bisa dibatalkan.`
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
          selected ? `Pengajuan bagi hasil ${selected.umkm} periode ${selected.periode} akan ditolak.` : ''
        }
        confirmLabel="Tolak"
        tone="teal"
        danger
        loading={submitting}
      />
    </div>
  );
}
