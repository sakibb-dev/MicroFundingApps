import { useState } from 'react';
import { IconBuildingStore, IconFileText, IconChartBar, IconIdBadge2, IconPhoto } from '@tabler/icons-react';
import { Card, Chip, TextArea, Button, Badge, Table, Th, Td, ConfirmDialog, EmptyState, SkeletonTable } from '../../components/ui';
import { formatCurrency } from '../../utils/format';
import { useAdminUmkmList, useApproveUmkm, useRejectUmkm } from '../../api/admin';
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
    <div className="bg-neutral-100 rounded-lg h-32 flex flex-col items-center justify-center gap-1.5 text-[12px] text-neutral-500 text-center px-2">
      <Icon size={24} aria-hidden="true" />
      {label}
      {available === false && <span className="text-[10.5px] text-neutral-400">Belum diunggah</span>}
    </div>
  );
}

export default function ManajemenUmkm() {
  const toast = useToast();
  const [filter, setFilter] = useState('all');
  const { data, isLoading } = useAdminUmkmList(filter);
  const approveUmkm = useApproveUmkm();
  const rejectUmkm = useRejectUmkm();

  const items = data || [];
  const [selectedId, setSelectedId] = useState(null);
  const [note, setNote] = useState('');
  const [rejecting, setRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);
  const [rejectConfirmOpen, setRejectConfirmOpen] = useState(false);

  const pendingCount = items.filter((i) => i.status === 'pending').length;
  const selected = items.find((i) => i.id === selectedId) || null;

  function openReview(id) {
    setSelectedId(id);
    setNote('');
    setRejecting(false);
    setRejectReason('');
  }

  function handleApproveConfirm() {
    approveUmkm.mutate(selected.id, {
      onSuccess: () => {
        setApproveConfirmOpen(false);
        toast.success(`${selected.nama_usaha} disetujui dan email pemberitahuan terkirim.`);
      },
      onError: () => toast.error('Gagal menyetujui UMKM. Coba lagi.'),
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
    rejectUmkm.mutate(
      { umkmId: selected.id, alasan: rejectReason },
      {
        onSuccess: () => {
          setRejectConfirmOpen(false);
          setRejecting(false);
          toast.success('Pendaftaran ditolak, email pemberitahuan telah dikirim.');
        },
        onError: () => toast.error('Gagal menolak UMKM. Coba lagi.'),
      }
    );
  }

  const submitting = approveUmkm.isPending || rejectUmkm.isPending;

  return (
    <div>
      <div className="mb-5">
        <div className="text-[22px] font-extrabold tracking-tight text-neutral-900">Manajemen UMKM</div>
        <div className="text-[13px] text-neutral-500 mt-1">Review pendaftaran usaha baru</div>
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
          {isLoading ? (
            <SkeletonTable rows={5} cols={5} />
          ) : items.length === 0 ? (
            <EmptyState
              icon={IconBuildingStore}
              title={filter === 'pending' ? 'Semua pendaftaran sudah direview' : 'Tidak ada data yang cocok'}
              body={
                filter === 'pending'
                  ? 'Tidak ada pendaftaran UMKM yang menunggu review saat ini.'
                  : 'Coba ubah filter untuk melihat data lain.'
              }
            />
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Nama Usaha</Th>
                  <Th>Kategori</Th>
                  <Th>Target Dana</Th>
                  <Th>Status</Th>
                  <Th>Aksi</Th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const badge = STATUS_BADGE[item.status];
                  return (
                    <tr key={item.id}>
                      <Td className="font-medium text-neutral-900">{item.nama_usaha}</Td>
                      <Td className="text-neutral-500">{item.kategori}</Td>
                      <Td className="whitespace-nowrap">{formatCurrency(item.target_dana)}</Td>
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
          <div className="text-[15px] font-bold text-neutral-900 mb-3.5">Review — {selected.nama_usaha}</div>

          <div className="grid sm:grid-cols-2 gap-2.5 mb-4">
            <div className="text-[12.5px]">
              <span className="block text-[11px] text-neutral-500">Kategori</span>
              {selected.kategori}
            </div>
            <div className="text-[12.5px]">
              <span className="block text-[11px] text-neutral-500">Target dana</span>
              {formatCurrency(selected.target_dana)}
            </div>
            <div className="text-[12.5px]">
              <span className="block text-[11px] text-neutral-500">% bagi hasil</span>
              {selected.persen_bagi_hasil}%
            </div>
            <div className="text-[12.5px]">
              <span className="block text-[11px] text-neutral-500">Kota</span>
              {selected.kota}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <DocViewer icon={IconFileText} label="NIB Usaha" available={Boolean(selected.dokumen?.nib)} />
            <DocViewer icon={IconChartBar} label="Laporan Keuangan" available={Boolean(selected.dokumen?.laporan_keuangan)} />
            <DocViewer icon={IconIdBadge2} label="KTP Pemilik" />
            <DocViewer
              icon={IconPhoto}
              label="Foto Usaha"
              available={Array.isArray(selected.dokumen?.foto_usaha) && selected.dokumen.foto_usaha.length > 0}
            />
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
              <div className="flex flex-wrap gap-2.5 mt-1">
                <Button variant="danger-outline" tone="teal" onClick={() => setRejecting(true)}>
                  Tolak
                </Button>
                <Button variant="primary" tone="teal" onClick={() => setApproveConfirmOpen(true)}>
                  Approve & Kirim Email
                </Button>
              </div>

              {rejecting && (
                <div className="mt-3 p-3 bg-red-50 rounded-lg">
                  <TextArea
                    label="Alasan penolakan"
                    required
                    rows={2}
                    placeholder="Contoh: laporan keuangan tidak lengkap"
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
              Pendaftaran ini sudah direview — status:{' '}
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
        title="Approve pendaftaran UMKM?"
        description={`${selected?.nama_usaha || ''} akan tampil sebagai campaign aktif di platform dan email pemberitahuan dikirim ke pemilik usaha.`}
        confirmLabel="Approve"
        tone="teal"
        loading={submitting}
      />

      <ConfirmDialog
        open={rejectConfirmOpen}
        onClose={() => !submitting && setRejectConfirmOpen(false)}
        onConfirm={handleRejectConfirm}
        title="Tolak pendaftaran ini?"
        description={`Pendaftaran ${selected?.nama_usaha || ''} akan ditolak dan email pemberitahuan berisi alasan penolakan akan dikirim.`}
        confirmLabel="Tolak"
        tone="teal"
        danger
        loading={submitting}
      />
    </div>
  );
}
