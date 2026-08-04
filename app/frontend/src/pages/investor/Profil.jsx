import { useMemo, useState } from 'react';
import { Card, Avatar, Badge, Input, Button } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import { getProfile } from '../../mocks/investor';

export default function Profil() {
  const toast = useToast();
  const profile = useMemo(() => getProfile(), []);

  const [phone, setPhone] = useState(profile.phone);
  const [city, setCity] = useState(profile.city);
  const [bank, setBank] = useState(profile.bank);
  const [accountNumber, setAccountNumber] = useState(profile.accountNumber);
  const [saving, setSaving] = useState(false);

  function handleSave() {
    if (saving) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Perubahan tersimpan.');
    }, 500);
  }

  return (
    <div>
      <div className="mb-6">
        <div className="text-2xl font-extrabold text-neutral-900 tracking-tight">Profil Saya</div>
        <div className="text-[13.5px] text-neutral-500 mt-0.5">Kelola data diri dan info rekening</div>
      </div>

      <Card>
        <div className="flex items-center gap-3.5 mb-5">
          <Avatar name={profile.name} tone="green" size={56} className="!bg-green-800 text-lg" />
          <div>
            <div className="text-[15px] font-bold text-neutral-900">{profile.name}</div>
            <Badge variant="success" tone="green" className="mt-1">
              Terverifikasi KYC
            </Badge>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-x-4">
          <Input label="Nama lengkap" id="profil-nama" value={profile.name} disabled />
          <Input label="Email" id="profil-email" value={profile.email} disabled />
          <Input label="Nomor HP" id="profil-hp" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input label="Kota domisili" id="profil-kota" value={city} onChange={(e) => setCity(e.target.value)} />
          <Input label="Bank rekening" id="profil-bank" value={bank} onChange={(e) => setBank(e.target.value)} />
          <Input label="Nomor rekening" id="profil-rekening" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
        </div>

        <Button variant="primary" tone="green" loading={saving} onClick={handleSave}>
          {saving ? 'Menyimpan...' : 'Simpan perubahan'}
        </Button>
      </Card>
    </div>
  );
}
