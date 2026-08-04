import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Input, TextArea, FileUpload, Button, ConfirmDialog, Badge, Table, Th, Td } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatNumberInput, parseCurrencyInput, maskName } from '../../utils/format';
import { getCurrentPeriodInput, getInvestorList } from '../../mocks/umkm';

const VISIBLE_BREAKDOWN_COUNT = 3;

export default function PengajuanBagiHasil() {
  const toast = useToast();
  const navigate = useNavigate();
  const period = getCurrentPeriodInput();
  const investors = getInvestorList();

  const [kotor, setKotor] = useState(period.keuntunganKotor);
  const [ops, setOps] = useState(period.biayaOperasional);
  const [laporanFile, setLaporanFile] = useState(null);
  const [laporanError, setLaporanError] = useState('');
  const [catatan, setCatatan] = useState('');
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [confirmCheckError, setConfirmCheckError] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Formula (MICROINVEST_CONTEXT.md section 3):
  //   Keuntungan Bersih = Keuntungan Kotor - Biaya Operasional
  //   Total Bagi Hasil Investor = Keuntungan Bersih x % Bagi Hasil
  //   Bagi Hasil per Investor = (Nominal Investasi Investor / Total Dana Terkumpul) x Total Bagi Hasil Investor
  //   Fee Platform = Keuntungan Bersih x % Fee Platform
  //   Total Dibayarkan UMKM = Total Bagi Hasil Investor + Fee Platform
  const calc = useMemo(() => {
    const bersih = kotor - ops;
    const isNegative = bersih < 0;
    const totalBagiHasilInvestor = isNegative ? 0 : Math.round(bersih * (period.persenBagiHasil / 100));
    const feePlatform = isNegative ? 0 : Math.round(bersih * (period.feePlatformPercent / 100));
    const totalDibayarkan = totalBagiHasilInvestor + feePlatform;

    const visibleInvestors = investors.slice(0, VISIBLE_BREAKDOWN_COUNT).map((inv) => ({
      ...inv,
      bagiHasil: isNegative
        ? 0
        : Math.round((inv.nominal / period.totalDanaTerkumpul) * totalBagiHasilInvestor),
    }));
    const visibleSum = visibleInvestors.reduce((sum, inv) => sum + inv.bagiHasil, 0);
    const remainingCount = investors.length - visibleInvestors.length;
    // Reconcile the aggregate row against the rounded total so the sum of all rows always equals
    // totalBagiHasilInvestor exactly (avoids rupiah drift from per-row rounding).
    const remainingSum = totalBagiHasilInvestor - visibleSum;

    return { bersih, isNegative, totalBagiHasilInvestor, feePlatform, totalDibayarkan, visibleInvestors, remainingCount, remainingSum };
  }, [kotor, ops, investors, period]);

  function handleFileChange(file) {
    setLaporanFile(file);
    if (file) setLaporanError('');
  }

  function handleSubmitClick() {
    let hasError = false;
    if (!laporanFile) {
      const msg = 'Upload laporan keuangan sebelum submit pengajuan.';
      setLaporanError(msg);
      toast.error(msg);
      hasError = true;
    }
    if (!confirmChecked) {
      setConfirmCheckError('Centang konfirmasi sebelum mengirim pengajuan.');
      hasError = true;
    }
    if (hasError) return;
    setConfirmDialogOpen(true);
  }

  function handleConfirmSubmit() {
    setSubmitting(true);
    // Placeholder for the real submit API call.
    setTimeout(() => {
      setSubmitting(false);
      setConfirmDialogOpen(false);
      toast.success(`Pengajuan bagi hasil periode ${period.periode} terkirim. Menunggu review admin.`);
      navigate('/umkm/riwayat');
    }, 500);
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-3 flex-wrap mb-5">
        <div>
          <div className="text-xs text-neutral-500 mb-1">Dashboard / Pengajuan Bagi Hasil</div>
          <div className="text-xl font-extrabold text-neutral-900 tracking-tight">
            Pengajuan Bagi Hasil &mdash; {period.periode}
          </div>
        </div>
        <Badge variant="warning" tone="teal">
          Belum disubmit
        </Badge>
      </div>

      <div className="max-w-[680px]">
        <Card>
          <div className="text-[15px] font-bold text-neutral-900 mb-4">1. Input keuangan</div>

          <div className="grid sm:grid-cols-2 gap-x-4">
            <Input id="periode" label="Periode" value={period.periode} disabled />
            <Input
              id="kotor"
              label="Keuntungan kotor bulan ini (Rp)"
              required
              inputMode="numeric"
              value={formatNumberInput(kotor)}
              onChange={(e) => setKotor(parseCurrencyInput(e.target.value))}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-x-4">
            <Input
              id="ops"
              label="Biaya operasional (Rp)"
              required
              inputMode="numeric"
              value={formatNumberInput(ops)}
              onChange={(e) => setOps(parseCurrencyInput(e.target.value))}
              error={
                calc.isNegative
                  ? 'Biaya operasional tidak boleh melebihi keuntungan kotor. Periksa kembali angkanya.'
                  : undefined
              }
            />
            <Input
              id="bersih"
              label="Keuntungan bersih"
              disabled
              value={formatCurrency(calc.bersih)}
              className={calc.isNegative ? 'text-danger font-bold' : ''}
            />
          </div>

          <div className="bg-teal-50 rounded-lg px-4 sm:px-[18px] py-4 my-4">
            <div className="flex justify-between text-[13px] text-neutral-700 mb-2">
              <span>Keuntungan bersih</span>
              <strong className="text-teal-800">{formatCurrency(calc.bersih)}</strong>
            </div>
            <div className="flex justify-between text-[13px] text-neutral-700 mb-2">
              <span>Total bagi hasil investor ({period.persenBagiHasil}%)</span>
              <strong className="text-teal-800">{formatCurrency(calc.totalBagiHasilInvestor)}</strong>
            </div>

            <hr className="border-t border-black/5 my-2.5" />

            <Table className="text-xs" minWidth="360px">
              <thead>
                <tr>
                  <Th>Investor</Th>
                  <Th>Nominal</Th>
                  <Th>%</Th>
                  <Th>Bagi hasil</Th>
                </tr>
              </thead>
              <tbody>
                {calc.visibleInvestors.map((inv) => (
                  <tr key={inv.id}>
                    <Td>{maskName(inv.nama)}</Td>
                    <Td>{formatCurrency(inv.nominal)}</Td>
                    <Td>{((inv.nominal / period.totalDanaTerkumpul) * 100).toFixed(1)}%</Td>
                    <Td>{formatCurrency(inv.bagiHasil)}</Td>
                  </tr>
                ))}
                {calc.remainingCount > 0 && (
                  <tr>
                    <Td className="text-neutral-500">+ {calc.remainingCount} investor lainnya</Td>
                    <Td></Td>
                    <Td></Td>
                    <Td>{formatCurrency(calc.remainingSum)}</Td>
                  </tr>
                )}
              </tbody>
            </Table>

            <hr className="border-t border-black/5 my-2.5" />

            <div className="flex justify-between text-[13px] text-neutral-700 mb-2">
              <span>Fee platform ({period.feePlatformPercent}%)</span>
              <strong className="text-teal-800">{formatCurrency(calc.feePlatform)}</strong>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-700">Total dibayarkan UMKM</span>
              <strong className="text-teal-900">{formatCurrency(calc.totalDibayarkan)}</strong>
            </div>
          </div>

          <div className="text-[15px] font-bold text-neutral-900 mb-4 mt-6">2. Upload dokumen</div>

          <FileUpload
            id="laporan"
            label="Laporan keuangan bulan ini"
            required
            hint="PDF/gambar, maks 5MB"
            error={laporanError}
            onChange={handleFileChange}
          />

          <TextArea
            id="catatan"
            label="Catatan tambahan (opsional)"
            rows={3}
            placeholder="Contoh: penjualan meningkat karena promo akhir tahun"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
          />

          <div className="flex items-start gap-2 my-3.5">
            <input
              type="checkbox"
              id="confirm"
              checked={confirmChecked}
              onChange={(e) => {
                setConfirmChecked(e.target.checked);
                if (e.target.checked) setConfirmCheckError('');
              }}
              className="mt-0.5 accent-teal-800"
            />
            <label htmlFor="confirm" className="text-[12.5px] text-neutral-700">
              Saya menyatakan data di atas benar dan sesuai laporan keuangan
            </label>
          </div>
          {confirmCheckError && <div className="text-[11.5px] text-danger -mt-2.5 mb-3.5">{confirmCheckError}</div>}

          <Button tone="teal" full disabled={calc.isNegative} onClick={handleSubmitClick}>
            Submit Pengajuan
          </Button>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirmSubmit}
        title="Kirim pengajuan bagi hasil?"
        description="Pastikan data keuangan dan dokumen yang kamu unggah sudah benar. Setelah dikirim, pengajuan akan masuk antrian review admin dan tidak bisa diedit."
        confirmLabel="Kirim Pengajuan"
        tone="teal"
        loading={submitting}
      />
    </div>
  );
}
