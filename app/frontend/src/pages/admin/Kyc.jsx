import { useMemo, useState } from 'react';
import { IconIdBadge2, IconCameraSelfie } from '@tabler/icons-react';
import { Card, Chip, Input, TextArea, Button, Badge, Table, Th, Td, ConfirmDialog, EmptyState, SkeletonTable } from '../../components/ui';
import { formatDate } from '../../utils/format';
import { useKycList, useApproveKyc, useRejectKyc } from '../../api/admin';
import { useToast } from '../../context/ToastContext';

const STATUS_BADGE = {
  pending: { variant: 'warning', label: 'Pending' },
  approved: { variant: 'success', label: 'Approved' },
  rejected: { variant: 'danger', label: 'Ditolak' },
};

const FILTERS = [
  { key: 'all', label: 'Semua' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Ditolak' },
];

function DocViewer({ icon: Icon, label, available }) {
  return (
    <div className="bg-neutral-100 rounded-lg h-36 flex flex-col items-center justify-center gap-1.5 text-[12px] text-neutral-500">
      <Icon size={24} aria-hidden="true" />
      {label}
      {!available && <span className="text-[10.5px] text-neutral-400">Belum diunggah</span>}
    </div>
  );
}

export default function Kyc() {
  const toast = useToast();
  const [filter, setFilter] = useState('all');
  const { data, isLoading } = useKycList(filter);
  const approveKyc = useApproveKyc();
  const rejectKyc = useRejectKyc();

  const items = data || [];
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [note, setNote] = useState('');
  const [rejecting, setRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);
  const [rejectConfirmOpen, setRejectConfirmOpen] = useState(false);

  const pendingCount = items.filter((i) => i.status === 'pending').length;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.nama.toLowerCase().includes(q) || item.email.toLowerCase().includes(q));
  }, [items, search]);

  const selected = items.find((i) => i.id === selectedId) || null;

  function openReview(id) {
    setSelectedId(id);
    setNote('');
    setRejecting(false);
    setRejectReason('');
  }

  function handleApproveConfirm() {
    approveKyc.mutate(selected.id, {
      onSuccess: () => {
        setApproveConfirmOpen(false);
        toast.success(`KYC ${selected.nama} disetujui.`);
      },
      onError: () => toast.error('Gagal menyetujui KYC. Coba lagi.'),
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
    rejectKyc.mutate(
      { investorId: selected.id, alasan: rejectReason },
      {
        onSuccess: () => {
          setRejectConfirmOpen(false);
          setRejecting(false);
          toast.success(`KYC ${selected.nama} ditolak dan email pemberitahuan telah dikirim.`);
        },
        onError: () => toast.error('Gagal menolak KYC. Coba lagi.'),
      }
    );
  }

  const submitting = approveKyc.isPending || rejectKyc.isPending;

  return (
    <div>
      <div className="mb-5">
        <div className="text-[22px] font-extrabold tracking-tight text-neutral-900">Manajemen KYC Investor</div>
        <div className="text-[13px] text-neutral-500 mt-1">Review dokumen dan verifikasi identitas</div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {FILTERS.map((f) => (
          <Chip key={f.key} tone="teal" active={filter === f.key} onClick={() => setFilter(f.key)}>
            {f.label}
            {f.key === 'pending' ? ` (${pendingCount})` : ''}
          </Chip>
        ))}
      </div>

      <div className="mb-4">
        <Input
          placeholder="Cari nama atau email investor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Cari nama atau email investor"
        />
      </div>

      <Card padded={false}>
        <div className="p-3">
          {isLoading ? (
            <SkeletonTable rows={5} cols={5} />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={IconIdBadge2}
              title={filter === 'pending' ? 'Semua KYC sudah direview' : 'Tidak ada data yang cocok'}
              body={
                filter === 'pending'
                  ? 'Tidak ada pengajuan verifikasi yang menunggu saat ini.'
                  : 'Coba ubah filter atau kata kunci pencarian.'
              }
            />
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Nama</Th>
                  <Th>Email</Th>
                  <Th>Tgl Daftar</Th>
                  <Th>Status</Th>
                  <Th>Aksi</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const badge = STATUS_BADGE[item.status];
                  return (
                    <tr key={item.id}>
                      <Td className="font-medium text-neutral-900">{item.nama}</Td>
                      <Td className="text-neutral-500">{item.email}</Td>
                      <Td className="whitespace-nowrap">{formatDate(item.tanggal_daftar)}</Td>
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
          <div className="text-[15px] font-bold text-neutral-900 mb-3.5">Review — {selected.nama}</div>

          <div className="grid sm:grid-cols-2 gap-2.5 mb-4">
            <div className="text-[12.5px]">
              <span className="block text-[11px] text-neutral-500">Nama lengkap</span>
              {selected.nama}
            </div>
            <div className="text-[12.5px]">
              <span className="block text-[11px] text-neutral-500">Email</span>
              {selected.email}
            </div>
            <div className="text-[12.5px]">
              <span className="block text-[11px] text-neutral-500">No. HP</span>
              {selected.no_hp}
            </div>
            <div className="text-[12.5px]">
              <span className="block text-[11px] text-neutral-500">Alamat</span>
              {selected.alamat}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <DocViewer icon={IconIdBadge2} label="KTP" available={Boolean(selected.dokumen?.ktp)} />
            <DocViewer icon={IconCameraSelfie} label="Selfie + KTP" available={Boolean(selected.dokumen?.selfie)} />
          </div>

          <TextArea
            label="Catatan admin"
            rows={3}
            placeholder="Catatan review (opsional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={selected.status !== 'pending'}
          />

          {selected.status === 'pending' ? (
            <>
              <div className="flex gap-2.5 mt-1">
                <Button variant="danger-outline" tone="teal" onClick={() => setRejecting(true)}>
                  Tolak
                </Button>
                <Button variant="primary" tone="teal" onClick={() => setApproveConfirmOpen(true)}>
                  Approve
                </Button>
              </div>

              {rejecting && (
                <div className="mt-3 p-3 bg-red-50 rounded-lg">
                  <TextArea
                    label="Alasan penolakan"
                    required
                    rows={2}
                    placeholder="Contoh: foto KTP buram, tidak dapat diverifikasi"
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
        title="Approve KYC?"
        description={`Verifikasi identitas ${selected?.nama || ''} akan disetujui dan investor bisa mulai berinvestasi.`}
        confirmLabel="Approve"
        tone="teal"
        loading={submitting}
      />

      <ConfirmDialog
        open={rejectConfirmOpen}
        onClose={() => !submitting && setRejectConfirmOpen(false)}
        onConfirm={handleRejectConfirm}
        title="Tolak KYC ini?"
        description={`KYC ${selected?.nama || ''} akan ditolak dan email pemberitahuan berisi alasan penolakan akan dikirim ke investor.`}
        confirmLabel="Tolak"
        tone="teal"
        danger
        loading={submitting}
      />
    </div>
  );
}
