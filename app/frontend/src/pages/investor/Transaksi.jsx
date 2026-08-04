import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IconPaperclip } from '@tabler/icons-react';
import { Card, FileUpload, Button } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/format';
import { getUmkmList, REKENING_TUJUAN } from '../../mocks/investor';

export default function Transaksi() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  // Falls back to a sensible default so the page still renders something
  // meaningful if reached directly (e.g. via the sidebar) instead of from
  // the Detail page's "Investasi Sekarang" confirm flow.
  const fallback = getUmkmList()[0];
  const state = location.state || {
    umkmId: fallback.id,
    umkmName: fallback.name,
    nominal: fallback.minInvestment,
    estMonthly: Math.round(fallback.minInvestment * (fallback.returnPct / 100)),
  };

  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit() {
    if (!file || submitting) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success('Bukti transfer terkirim. Kami akan konfirmasi dalam 1x24 jam.');
      navigate('/investor/portfolio');
    }, 600);
  }

  return (
    <div>
      <div className="text-xs text-neutral-500 mb-1.5">
        <Link to={`/investor/detail/${state.umkmId}`} className="text-neutral-500 hover:text-neutral-700">
          {state.umkmName}
        </Link>{' '}
        / <span className="text-green-800 font-semibold">Investasi</span>
      </div>
      <div className="text-2xl font-extrabold text-neutral-900 mb-5">Konfirmasi Investasi</div>

      <div className="max-w-[520px]">
        <Card>
          <div className="text-[13px] font-bold text-neutral-900 mb-3.5">Ringkasan Investasi</div>
          <div className="flex justify-between text-[12.5px] mb-1.5 text-neutral-700">
            <span>UMKM</span>
            <strong className="text-neutral-900">{state.umkmName}</strong>
          </div>
          <div className="flex justify-between text-[12.5px] mb-1.5 text-neutral-700">
            <span>Nominal investasi</span>
            <strong className="text-neutral-900">{formatCurrency(state.nominal)}</strong>
          </div>
          <div className="flex justify-between text-[12.5px] text-neutral-700">
            <span>Estimasi bagi hasil/bln</span>
            <strong className="text-green-600">{formatCurrency(state.estMonthly)}</strong>
          </div>

          <hr className="border-neutral-100 my-3.5" />

          <div className="text-[13px] font-bold text-neutral-900 mb-2.5">Transfer ke rekening</div>
          <div className="bg-neutral-50 rounded px-3.5 py-3 mb-4">
            <div className="text-[11px] text-neutral-500">
              {REKENING_TUJUAN.bank} — a.n. {REKENING_TUJUAN.atasNama}
            </div>
            <div className="text-[15px] font-bold mt-0.5 text-neutral-900">{REKENING_TUJUAN.nomor}</div>
          </div>

          <FileUpload label="Upload bukti transfer" icon={IconPaperclip} onChange={setFile} required />

          <Button variant="primary" tone="green" full className="mt-2" loading={submitting} disabled={!file} onClick={handleSubmit}>
            {submitting ? 'Mengirim...' : 'Kirim Konfirmasi'}
          </Button>
        </Card>
      </div>
    </div>
  );
}
