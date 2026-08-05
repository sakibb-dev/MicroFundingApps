import { useEffect, useState } from 'react';
import { Card, Input, Select, TextArea, Button, Avatar, Skeleton } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/format';
import { KATEGORI_OPTIONS } from '../../mocks/umkm';
import { BANK_OPTIONS } from '../../utils/banks';
import { useUmkmProfile, useUpdateUmkmProfile } from '../../api/umkm';

const STATUS_LABEL = {
  pending: 'Menunggu review',
  approved: 'Campaign aktif',
  rejected: 'Ditolak',
};

export default function ProfilUsaha() {
  const toast = useToast();
  const { data: profile, isLoading } = useUmkmProfile();
  const updateProfile = useUpdateUmkmProfile();

  const [namaUsaha, setNamaUsaha] = useState('');
  const [kategori, setKategori] = useState('');
  const [kota, setKota] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [bank, setBank] = useState('');
  const [noRekening, setNoRekening] = useState('');

  useEffect(() => {
    if (!profile) return;
    setNamaUsaha(profile.nama_usaha || '');
    setKategori(profile.kategori || '');
    setKota(profile.kota || '');
    setDeskripsi(profile.deskripsi || '');
    setBank(profile.rekening?.bank || '');
    setNoRekening(profile.rekening?.no_rekening || '');
  }, [profile]);

  function handleSave() {
    updateProfile.mutate(
      { nama_usaha: namaUsaha, kategori, kota, deskripsi, bank, no_rekening: noRekening },
      {
        onSuccess: () => toast.success('Perubahan tersimpan.'),
        onError: () => toast.error('Gagal menyimpan perubahan. Coba lagi.'),
      }
    );
  }

  if (isLoading || !profile) {
    return (
      <div>
        <div className="mb-5">
          <div className="text-2xl font-extrabold text-neutral-900 tracking-tight">Profil Usaha</div>
          <div className="text-[13px] text-neutral-500 mt-1">Kelola informasi dan dokumen usahamu</div>
        </div>
        <Card className="max-w-[720px]">
          <Skeleton className="h-64 w-full" />
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <div className="text-2xl font-extrabold text-neutral-900 tracking-tight">Profil Usaha</div>
        <div className="text-[13px] text-neutral-500 mt-1">Kelola informasi dan dokumen usahamu</div>
      </div>

      <Card className="max-w-[720px]">
        <div className="flex items-center gap-3.5 mb-5">
          <Avatar name={namaUsaha} tone="teal" size={54} />
          <div>
            <div className="text-[15px] font-bold text-neutral-900">{namaUsaha}</div>
            <div className="text-xs font-semibold text-teal-700">
              &#9679; {STATUS_LABEL[profile.status] || profile.status} &middot; {kategori}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            id="nama-usaha"
            label="Nama usaha"
            value={namaUsaha}
            onChange={(e) => setNamaUsaha(e.target.value)}
          />
          <Select id="kategori" label="Kategori" value={kategori} onChange={(e) => setKategori(e.target.value)}>
            {KATEGORI_OPTIONS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </Select>
          <Input id="kota" label="Kota" value={kota} onChange={(e) => setKota(e.target.value)} />
          <Input id="tahun-berdiri" label="Tahun berdiri" value={profile.tahun_berdiri || '—'} disabled />
          <Input
            id="target-dana"
            label="Target dana (Rp)"
            value={formatCurrency(profile.target_dana)}
            disabled
            hint="Target dana dan % bagi hasil terkunci setelah campaign berjalan"
          />
          <Input id="persen-bagi-hasil" label="% Bagi hasil" value={`${profile.persen_bagi_hasil}%`} disabled />
        </div>

        <div className="text-[13px] font-bold text-neutral-900 mt-2 mb-3">Rekening penerima pencairan modal</div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Select id="bank" label="Bank" value={bank} onChange={(e) => setBank(e.target.value)}>
            <option value="">Pilih bank</option>
            {BANK_OPTIONS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </Select>
          <Input id="no-rekening" label="Nomor rekening" value={noRekening} onChange={(e) => setNoRekening(e.target.value)} />
        </div>

        <TextArea
          id="deskripsi"
          label="Deskripsi usaha"
          rows={3}
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
        />

        <Button tone="teal" onClick={handleSave} loading={updateProfile.isPending}>
          {updateProfile.isPending ? 'Menyimpan...' : 'Simpan perubahan'}
        </Button>
      </Card>
    </div>
  );
}
