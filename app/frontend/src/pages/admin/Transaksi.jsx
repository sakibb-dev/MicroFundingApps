import { useMemo, useState } from 'react';
import { IconArrowsExchange, IconPaperclip } from '@tabler/icons-react';
import { Card, Chip, TextArea, Button, Badge, Table, Th, Td, ConfirmDialog, Modal, EmptyState } from '../../components/ui';
import { formatCurrency } from '../../utils/format';
import { getTransaksiList } from '../../mocks/admin';
import { useToast } from '../../context/ToastContext';

const STATUS_BADGE = {
  pending: { variant: 'warning', label: 'Pending' },
  confirmed: { variant: 'success', label: 'Terkonfirmasi' },
  rejected: { variant: 'danger', label: 'Ditolak' },
};

const FILTERS = [
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Terkonfirmasi' },
  { key: 'rejected', label: 'Ditolak' },
];

export default function Transaksi() {
  const toast = useToast();
  const [items, setItems] = useState(() => getTransaksiList());
  const [filter, setFilter] = useState('pending');
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const pendingCount = items.filter((i) => i.status === 'pending').length;

  const filtered = useMemo(() => items.filter((i) => i.status === filter), [items, filter]);

  function handleKonfirmasi() {
    setSubmitting(true);
    setTimeout(() => {
      setItems((prev) => prev.map((i) => (i.id === confirmTarget.id ? { ...i, status: 'confirmed' } : i)));
      setSubmitting(false);
      setConfirmTarget(null);
      toast.success('Transfer investasi dikonfirmasi. Invoice otomatis dikirim ke investor.');
    }, 700);
  }

  function openReject(item) {
    setRejectTarget(item);
    setRejectReason('');
  }

  function handleKirimPenolakan() {
    if (!rejectReason.trim()) {
      toast.error('Isi alasan penolakan sebelum mengirim.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setItems((prev) => prev.map((i) => (i.id === rejectTarget.id ? { ...i, status: 'rejected' } : i)));
      setSubmitting(false);
      setRejectTarget(null);
      toast.success('Bukti transfer ditolak dan investor diberi tahu.');
    }, 700);
  }

  return (
    <div>
      <div className="mb-5">
        <div className="text-[22px] font-extrabold tracking-tight text-neutral-900">Manajemen Transaksi</div>
        <div className="text-[13px] text-neutral-500 mt-1">Konfirmasi bukti transfer investasi</div>
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
              icon={IconArrowsExchange}
              title="Tidak ada transaksi"
              body={
                filter === 'pending'
                  ? 'Tidak ada bukti transfer yang menunggu konfirmasi saat ini.'
                  : 'Belum ada transaksi dengan status ini.'
              }
            />
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Investor</Th>
                  <Th>UMKM</Th>
                  <Th>Nominal</Th>
                  <Th>Bukti Transfer</Th>
                  <Th>Status</Th>
                  <Th>Aksi</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const badge = STATUS_BADGE[item.status];
                  return (
                    <tr key={item.id}>
                      <Td className="font-medium text-neutral-900">{item.investor}</Td>
                      <Td className="text-neutral-500">{item.umkm}</Td>
                      <Td className="whitespace-nowrap">{formatCurrency(item.nominal)}</Td>
                      <Td>
                        <span className="inline-flex items-center gap-1.5 text-neutral-500">
                          <IconPaperclip size={14} aria-hidden="true" /> {item.bukti}
                        </span>
                      </Td>
                      <Td>
                        <Badge variant={badge.variant} tone="teal">
                          {badge.label}
                        </Badge>
                      </Td>
                      <Td>
                        {item.status === 'pending' ? (
                          <div className="flex flex-wrap gap-2">
                            <Button variant="outline" tone="teal" size="sm" onClick={() => setConfirmTarget(item)}>
                              Konfirmasi
                            </Button>
                            <Button variant="danger-outline" tone="teal" size="sm" onClick={() => openReject(item)}>
                              Tolak
                            </Button>
                          </div>
                        ) : item.status === 'confirmed' ? (
                          <Button variant="ghost" tone="teal" size="sm" disabled>
                            Lihat Invoice
                          </Button>
                        ) : (
                          <span className="text-[12px] text-neutral-400">—</span>
                        )}
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </div>
      </Card>

      <ConfirmDialog
        open={!!confirmTarget}
        onClose={() => !submitting && setConfirmTarget(null)}
        onConfirm={handleKonfirmasi}
        title="Konfirmasi transfer ini?"
        description={
          confirmTarget
            ? `Transfer ${formatCurrency(confirmTarget.nominal)} dari ${confirmTarget.investor} ke ${confirmTarget.umkm} akan dikonfirmasi dan invoice otomatis dikirim ke investor.`
            : ''
        }
        confirmLabel="Konfirmasi"
        tone="teal"
        loading={submitting}
      />

      <Modal
        open={!!rejectTarget}
        onClose={() => !submitting && setRejectTarget(null)}
        title="Tolak bukti transfer?"
        size="sm"
        footer={
          <>
            <Button variant="ghost" tone="teal" onClick={() => setRejectTarget(null)} disabled={submitting}>
              Batal
            </Button>
            <Button variant="danger" tone="teal" onClick={handleKirimPenolakan} loading={submitting}>
              Kirim Penolakan
            </Button>
          </>
        }
      >
        <p className="text-sm text-neutral-700 mb-3">
          {rejectTarget
            ? `Bukti transfer dari ${rejectTarget.investor} ke ${rejectTarget.umkm} akan ditolak.`
            : ''}
        </p>
        <TextArea
          label="Alasan penolakan"
          required
          rows={3}
          placeholder="Contoh: bukti transfer tidak terbaca / nominal tidak sesuai"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Modal>
    </div>
  );
}
