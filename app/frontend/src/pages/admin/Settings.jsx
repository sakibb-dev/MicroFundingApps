import { useEffect, useState } from 'react';
import { Card, Input, Button, Skeleton } from '../../components/ui';
import { BANK_OPTIONS } from '../../utils/banks';
import { useAdminSettings, useUpdateAdminSettings } from '../../api/admin';
import { useToast } from '../../context/ToastContext';

export default function Settings() {
  const toast = useToast();
  const { data: settings, isLoading } = useAdminSettings();
  const updateSettings = useUpdateAdminSettings();

  const [bankName, setBankName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankAccountName, setBankAccountName] = useState('');
  const [feePercent, setFeePercent] = useState('');

  useEffect(() => {
    if (!settings) return;
    setBankName(settings.bank_name?.value || '');
    setBankAccountNumber(settings.bank_account_number?.value || '');
    setBankAccountName(settings.bank_account_name?.value || '');
    setFeePercent(settings.platform_fee_percent?.value || '');
  }, [settings]);

  function handleSave() {
    updateSettings.mutate(
      {
        bank_name: bankName,
        bank_account_number: bankAccountNumber,
        bank_account_name: bankAccountName,
        platform_fee_percent: feePercent,
      },
      {
        onSuccess: () => toast.success('Pengaturan berhasil disimpan.'),
        onError: (err) => {
          const msg = err?.response?.data?.errors ? Object.values(err.response.data.errors)[0]?.[0] : null;
          toast.error(msg || 'Gagal menyimpan pengaturan. Coba lagi.');
        },
      }
    );
  }

  if (isLoading) {
    return (
      <div>
        <div className="mb-5">
          <div className="text-[22px] font-extrabold tracking-tight text-neutral-900">Pengaturan Platform</div>
          <div className="text-[13px] text-neutral-500 mt-1">Rekening tujuan transfer & fee platform</div>
        </div>
        <Skeleton className="h-72 w-full max-w-[560px]" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <div className="text-[22px] font-extrabold tracking-tight text-neutral-900">Pengaturan Platform</div>
        <div className="text-[13px] text-neutral-500 mt-1">Rekening tujuan transfer & fee platform</div>
      </div>

      <Card className="max-w-[560px]">
        <div className="text-[15px] font-bold text-neutral-900 mb-1">Rekening Tujuan Transfer</div>
        <div className="text-[12.5px] text-neutral-500 mb-4">
          Ditampilkan ke investor saat konfirmasi investasi, dan jadi acuan UMKM saat transfer bagi hasil.
        </div>

        <label htmlFor="bank-name" className="block text-[12.5px] font-semibold text-neutral-700 mb-1.5">
          Bank
        </label>
        <select
          id="bank-name"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          className="w-full mb-3.5 px-3.5 py-2.5 border border-neutral-300 rounded text-[13.5px] font-sans outline-none focus:border-teal-500 transition-colors bg-white"
        >
          <option value="">Pilih bank</option>
          {BANK_OPTIONS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        <Input
          id="bank-account-number"
          label="Nomor rekening"
          value={bankAccountNumber}
          onChange={(e) => setBankAccountNumber(e.target.value)}
        />
        <Input
          id="bank-account-name"
          label="Nama pemilik rekening"
          value={bankAccountName}
          onChange={(e) => setBankAccountName(e.target.value)}
        />

        <hr className="border-neutral-100 my-4" />

        <div className="text-[15px] font-bold text-neutral-900 mb-1">Fee Platform</div>
        <div className="text-[12.5px] text-neutral-500 mb-4">
          Persentase dari keuntungan bersih UMKM yang dipotong sebagai pendapatan platform saat distribusi bagi hasil.
        </div>
        <Input
          id="fee-percent"
          label="Fee platform (%)"
          inputMode="decimal"
          value={feePercent}
          onChange={(e) => setFeePercent(e.target.value.replace(/[^0-9.]/g, ''))}
        />

        <Button tone="teal" onClick={handleSave} loading={updateSettings.isPending} className="mt-2">
          {updateSettings.isPending ? 'Menyimpan...' : 'Simpan Pengaturan'}
        </Button>
      </Card>
    </div>
  );
}
