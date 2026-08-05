import { useEffect, useState } from 'react';
import { Card, Avatar, Badge, Input, Button, Skeleton } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import { useInvestorProfile, useUpdateInvestorProfile } from '../../api/investor';

const KYC_BADGE = {
  approved: { label: 'Terverifikasi KYC', variant: 'success' },
  pending: { label: 'KYC Menunggu Verifikasi', variant: 'warning' },
  rejected: { label: 'KYC Ditolak', variant: 'danger' },
};

export default function Profil() {
  const toast = useToast();
  const { data: profile, isLoading } = useInvestorProfile();
  const updateProfile = useUpdateInvestorProfile();

  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [bank, setBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  useEffect(() => {
    if (!profile) return;
    setPhone(profile.no_hp || '');
    setCity(profile.kota_domisili || '');
    setBank(profile.bank || '');
    setAccountNumber(profile.no_rekening || '');
  }, [profile]);

  function handleSave() {
    updateProfile.mutate(
      { no_hp: phone, kota_domisili: city, bank, no_rekening: accountNumber },
      {
        onSuccess: () => toast.success('Perubahan tersimpan.'),
        onError: () => toast.error('Gagal menyimpan perubahan. Coba lagi.'),
      }
    );
  }

  if (isLoading || !profile) {
    return (
      <div>
        <div className="mb-6">
          <div className="text-2xl font-extrabold text-neutral-900 tracking-tight">Profil Saya</div>
          <div className="text-[13.5px] text-neutral-500 mt-0.5">Kelola data diri dan info rekening</div>
        </div>
        <Card>
          <Skeleton className="h-32 w-full" />
        </Card>
      </div>
    );
  }

  const kycBadge = KYC_BADGE[profile.kyc_status] || KYC_BADGE.pending;

  return (
    <div>
      <div className="mb-6">
        <div className="text-2xl font-extrabold text-neutral-900 tracking-tight">Profil Saya</div>
        <div className="text-[13.5px] text-neutral-500 mt-0.5">Kelola data diri dan info rekening</div>
      </div>

      <Card>
        <div className="flex items-center gap-3.5 mb-5">
          <Avatar name={profile.nama_lengkap} tone="green" size={56} className="!bg-green-800 text-lg" />
          <div>
            <div className="text-[15px] font-bold text-neutral-900">{profile.nama_lengkap}</div>
            <Badge variant={kycBadge.variant} tone="green" className="mt-1">
              {kycBadge.label}
            </Badge>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-x-4">
          <Input label="Nama lengkap" id="profil-nama" value={profile.nama_lengkap} disabled />
          <Input label="Email" id="profil-email" value={profile.email} disabled />
          <Input label="Nomor HP" id="profil-hp" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input label="Kota domisili" id="profil-kota" value={city} onChange={(e) => setCity(e.target.value)} />
          <Input label="Bank rekening" id="profil-bank" value={bank} onChange={(e) => setBank(e.target.value)} />
          <Input label="Nomor rekening" id="profil-rekening" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
        </div>

        <Button variant="primary" tone="green" loading={updateProfile.isPending} onClick={handleSave}>
          {updateProfile.isPending ? 'Menyimpan...' : 'Simpan perubahan'}
        </Button>
      </Card>
    </div>
  );
}
