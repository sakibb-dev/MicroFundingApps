import { useState } from 'react';
import { IconArrowsExchange, IconPaperclip } from '@tabler/icons-react';
import { Card, Chip, TextArea, Button, Badge, Table, Th, Td, ConfirmDialog, Modal, EmptyState, SkeletonTable, CopyButton, Pagination } from '../../components/ui';
import { formatCurrency } from '../../utils/format';
import { useAdminInvestmentList, useConfirmInvestment, useRejectInvestment, useForwardInvestment } from '../../api/admin';
import { useToast } from '../../context/ToastContext';

const STATUS_BADGE = {
  pending_confirmation: { variant: 'warning', label: 'Pending' },
  confirmed: { variant: 'warning', label: 'Belum Diteruskan' },
  active: { variant: 'success', label: 'Dana Diteruskan' },
  rejected: { variant: 'danger', label: 'Ditolak' },
};

const FILTERS = [
  { key: 'pending_confirmation', label: 'Pending' },
  { key: 'confirmed', label: 'Belum Diteruskan' },
  { key: 'active', label: 'Dana Diteruskan' },
  { key: 'rejected', label: 'Ditolak' },
];

export default function Transaksi() {
  const toast = useToast();
  const [filter, setFilter] = useState('pending_confirmation');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminInvestmentList(filter, page);
  const confirmInvestment = useConfirmInvestment();
  const rejectInvestment = useRejectInvestment();
  const forwardInvestment = useForwardInvestment();

  const items = data?.items || [];
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [forwardTarget, setForwardTarget] = useState(null);

  const pendingCount = filter === 'pending_confirmation' ? data?.meta?.total : undefined;

  function handleFilterChange(key) {
    setFilter(key);
    setPage(1);
  }
  const submitting = confirmInvestment.isPending || rejectInvestment.isPending || forwardInvestment.isPending;

  function handleForward() {
    forwardInvestment.mutate(
      { investmentId: forwardTarget.id },
      {
        onSuccess: () => {
          setForwardTarget(null);
          toast.success('Dana berhasil dicatat sebagai diteruskan ke UMKM.');
        },
        onError: () => toast.error('Gagal mencatat pencairan dana. Coba lagi.'),
      }
    );
  }

  function handleKonfirmasi() {
    confirmInvestment.mutate(confirmTarget.id, {
      onSuccess: () => {
        setConfirmTarget(null);
        toast.success('Transfer investasi dikonfirmasi. Invoice otomatis dikirim ke investor.');
      },
      onError: () => toast.error('Gagal mengonfirmasi transfer. Coba lagi.'),
    });
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
    rejectInvestment.mutate(
      { investmentId: rejectTarget.id, alasan: rejectReason },
      {
        onSuccess: () => {
          setRejectTarget(null);
          toast.success('Bukti transfer ditolak dan investor diberi tahu.');
        },
        onError: () => toast.error('Gagal menolak transaksi. Coba lagi.'),
      }
    );
  }

  return (
    <div>
      <div className="mb-5">
        <div className="text-[22px] font-extrabold tracking-tight text-neutral-900">Manajemen Transaksi</div>
        <div className="text-[13px] text-neutral-500 mt-1">Konfirmasi bukti transfer investasi</div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {FILTERS.map((f) => (
          <Chip key={f.key} tone="teal" active={filter === f.key} onClick={() => handleFilterChange(f.key)}>
            {f.label}
            {f.key === 'pending_confirmation' && pendingCount != null ? ` (${pendingCount})` : ''}
          </Chip>
        ))}
      </div>

      <Card padded={false}>
        <div className="p-3">
          {isLoading ? (
            <SkeletonTable rows={5} cols={6} />
          ) : items.length === 0 ? (
            <EmptyState
              icon={IconArrowsExchange}
              title="Tidak ada transaksi"
              body={
                filter === 'pending_confirmation'
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
                  <Th>Rekening Tujuan (UMKM)</Th>
                  <Th>Bukti Transfer</Th>
                  <Th>Status</Th>
                  <Th>Aksi</Th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const badge = STATUS_BADGE[item.status] || STATUS_BADGE.pending_confirmation;
                  return (
                    <tr key={item.id}>
                      <Td className="font-medium text-neutral-900">
                        {item.investor?.nama}
                        {item.investor?.rekening?.bank && (
                          <div className="flex items-center gap-1 text-[10.5px] font-normal text-neutral-400 mt-0.5">
                            {item.investor.rekening.bank} · {item.investor.rekening.no_rekening}
                            <CopyButton value={item.investor.rekening.no_rekening} />
                          </div>
                        )}
                      </Td>
                      <Td className="text-neutral-500">{item.umkm?.nama_usaha}</Td>
                      <Td className="whitespace-nowrap">{formatCurrency(item.nominal)}</Td>
                      <Td>
                        {item.umkm?.rekening?.bank ? (
                          <div className="flex items-center gap-1 whitespace-nowrap">
                            <span>
                              {item.umkm.rekening.bank} · {item.umkm.rekening.no_rekening}
                            </span>
                            <CopyButton value={item.umkm.rekening.no_rekening} />
                          </div>
                        ) : (
                          <span className="text-neutral-400">Belum diisi UMKM</span>
                        )}
                      </Td>
                      <Td>
                        <span className="inline-flex items-center gap-1.5 text-neutral-500">
                          <IconPaperclip size={14} aria-hidden="true" /> {item.bukti_transfer_path ? 'Terlampir' : '—'}
                        </span>
                      </Td>
                      <Td>
                        <Badge variant={badge.variant} tone="teal">
                          {badge.label}
                        </Badge>
                      </Td>
                      <Td>
                        {item.status === 'pending_confirmation' ? (
                          <div className="flex flex-wrap gap-2">
                            <Button variant="outline" tone="teal" size="sm" onClick={() => setConfirmTarget(item)}>
                              Konfirmasi
                            </Button>
                            <Button variant="danger-outline" tone="teal" size="sm" onClick={() => openReject(item)}>
                              Tolak
                            </Button>
                          </div>
                        ) : item.status === 'confirmed' ? (
                          <Button variant="outline" tone="teal" size="sm" onClick={() => setForwardTarget(item)}>
                            Tandai Diteruskan
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
        <Pagination meta={data?.meta} onPageChange={setPage} />
      </Card>

      <ConfirmDialog
        open={!!confirmTarget}
        onClose={() => !submitting && setConfirmTarget(null)}
        onConfirm={handleKonfirmasi}
        title="Konfirmasi transfer ini?"
        description={
          confirmTarget
            ? `Transfer ${formatCurrency(confirmTarget.nominal)} dari ${confirmTarget.investor?.nama} ke ${confirmTarget.umkm?.nama_usaha} akan dikonfirmasi dan invoice otomatis dikirim ke investor.`
            : ''
        }
        confirmLabel="Konfirmasi"
        tone="teal"
        loading={submitting}
      />

      <ConfirmDialog
        open={!!forwardTarget}
        onClose={() => !submitting && setForwardTarget(null)}
        onConfirm={handleForward}
        title="Catat dana sudah diteruskan ke UMKM?"
        description={
          forwardTarget
            ? `Konfirmasi bahwa ${formatCurrency(forwardTarget.nominal)} sudah kamu transfer manual ke ${forwardTarget.umkm?.nama_usaha}${
                forwardTarget.umkm?.rekening?.bank
                  ? ` (${forwardTarget.umkm.rekening.bank} · ${forwardTarget.umkm.rekening.no_rekening})`
                  : ''
              }. Aksi ini hanya mencatat status di sistem, tidak memindahkan dana secara otomatis.`
            : ''
        }
        confirmLabel="Sudah Diteruskan"
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
            ? `Bukti transfer dari ${rejectTarget.investor?.nama} ke ${rejectTarget.umkm?.nama_usaha} akan ditolak.`
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
