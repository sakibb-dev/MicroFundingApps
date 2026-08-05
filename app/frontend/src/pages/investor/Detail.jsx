import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  IconCheck,
  IconFileText,
  IconPhoto,
  IconAlertCircle,
} from '@tabler/icons-react';
import { Badge, Card, ProgressBar, Tabs, Chip, Table, Th, Td, Button, ConfirmDialog, EmptyState, Skeleton } from '../../components/ui';
import { formatCurrency, formatNumberInput, parseCurrencyInput, formatDate } from '../../utils/format';
import { getCategoryIcon, getCategoryStyle, INVESTMENT_AMOUNT_PRESETS } from '../../mocks/investor';
import { useUmkmDetail } from '../../api/investor';

function InfoItem({ label, value }) {
  return (
    <div className="bg-neutral-50 rounded px-3.5 py-3">
      <div className="text-[11px] text-neutral-500">{label}</div>
      <div className="text-[15px] font-bold mt-0.5 text-neutral-900">{value}</div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between text-[12.5px] text-neutral-500 mb-1.5">
      <span>{label}</span>
      <strong className="text-neutral-900">{value}</strong>
    </div>
  );
}

// No campaign-level minimum is stored server-side -- this mirrors the
// validation floor in StoreInvestmentRequest (nominal min:500000).
const MIN_INVESTMENT = 500000;

function buildDocumentList(dokumen) {
  if (!dokumen) return [];
  const list = [];
  if (dokumen.nib) list.push({ name: 'NIB Usaha', icon: 'file' });
  if (dokumen.laporan_keuangan) list.push({ name: 'Laporan Keuangan', icon: 'file' });
  if (Array.isArray(dokumen.foto_usaha) && dokumen.foto_usaha.length > 0) {
    list.push({ name: `Foto Usaha (${dokumen.foto_usaha.length} file)`, icon: 'photo' });
  }
  if (dokumen.surat_perjanjian) list.push({ name: 'Surat Perjanjian', icon: 'file' });
  return list;
}

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: raw, isLoading, isError } = useUmkmDetail(id);

  const item = useMemo(() => {
    if (!raw) return null;
    return {
      id: raw.id,
      name: raw.nama_usaha,
      category: raw.kategori,
      city: raw.kota,
      returnPct: raw.persen_bagi_hasil,
      percent: raw.persen_terkumpul,
      collected: raw.total_terkumpul,
      target: raw.target_dana,
      tenorBulan: raw.tenor_bulan,
      minInvestment: MIN_INVESTMENT,
      description: raw.deskripsi,
      tahunBerdiri: raw.tahun_berdiri,
      jumlahKaryawan: raw.jumlah_karyawan,
      omzetBulanan: raw.omzet_bulanan,
      nibVerified: Boolean(raw.dokumen?.nib),
      documents: buildDocumentList(raw.dokumen),
      investors: raw.daftar_investor || [],
    };
  }, [raw]);

  const [amount, setAmount] = useState(INVESTMENT_AMOUNT_PRESETS[1]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const estMonthly = useMemo(() => {
    if (!item) return 0;
    return Math.round(amount * (item.returnPct / 100));
  }, [amount, item]);

  const estTotal = useMemo(() => {
    if (!item) return 0;
    return estMonthly * item.tenorBulan;
  }, [estMonthly, item]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
        <Skeleton className="h-[220px] w-full rounded-lg" />
        <Skeleton className="h-[420px] w-full rounded-lg" />
      </div>
    );
  }

  if (isError || !item) {
    return (
      <Card>
        <EmptyState
          icon={IconAlertCircle}
          title="UMKM tidak ditemukan"
          body="Campaign yang kamu cari mungkin sudah tidak tersedia."
          ctaLabel="Kembali ke Home"
          onCta={() => navigate('/investor')}
        />
      </Card>
    );
  }

  const Icon = getCategoryIcon(item.category);
  const style = getCategoryStyle(item.category);
  const belowMin = amount < item.minInvestment;

  function handleInvestClick() {
    if (belowMin) return;
    setConfirmOpen(true);
  }

  function handleConfirm() {
    setConfirmOpen(false);
    navigate('/investor/transaksi', {
      state: { umkmId: item.id, umkmName: item.name, nominal: amount, estMonthly },
    });
  }

  const tabs = [
    {
      key: 'tentang',
      label: 'Tentang Usaha',
      content: (
        <div>
          <p className="text-[13.5px] text-neutral-700 leading-loose">{item.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-4">
            <InfoItem label="Tahun berdiri" value={item.tahunBerdiri || '—'} />
            <InfoItem label="Jumlah karyawan" value={item.jumlahKaryawan ? `${item.jumlahKaryawan} orang` : '—'} />
            <InfoItem label="Omzet bulanan" value={item.omzetBulanan ? formatCurrency(item.omzetBulanan) : '—'} />
          </div>
          {item.nibVerified && (
            <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-green-600">
              <IconCheck size={15} aria-hidden="true" /> NIB Terverifikasi
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'dokumen',
      label: 'Dokumen',
      content:
        item.documents.length === 0 ? (
          <EmptyState title="Belum ada dokumen" body="UMKM ini belum mengunggah dokumen publik." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {item.documents.map((doc) => (
              <div key={doc.name} className="flex items-center gap-2 bg-neutral-50 rounded px-3.5 py-3 text-[13px] text-neutral-700">
                {doc.icon === 'photo' ? (
                  <IconPhoto size={16} className="text-neutral-500 shrink-0" aria-hidden="true" />
                ) : (
                  <IconFileText size={16} className="text-neutral-500 shrink-0" aria-hidden="true" />
                )}
                {doc.name}
              </div>
            ))}
          </div>
        ),
    },
    {
      key: 'investor',
      label: 'Daftar Investor',
      content:
        item.investors.length === 0 ? (
          <EmptyState title="Belum ada investor" body="Jadilah investor pertama untuk UMKM ini." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Investor</Th>
                <Th>Nominal</Th>
                <Th>Tanggal</Th>
                <Th>% Kepemilikan</Th>
              </tr>
            </thead>
            <tbody>
              {item.investors.map((inv, i) => (
                <tr key={i}>
                  <Td>{inv.nama}</Td>
                  <Td>{formatCurrency(inv.nominal)}</Td>
                  <Td>{inv.tanggal ? formatDate(inv.tanggal) : '—'}</Td>
                  <Td>{inv.persen_kepemilikan}%</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        ),
    },
  ];

  return (
    <div>
      <div className="text-xs text-neutral-500 mb-1.5">
        <Link to="/investor" className="text-neutral-500 hover:text-neutral-700">
          Home
        </Link>{' '}
        / <span className="text-green-800 font-semibold">{item.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
        <div>
          <div className="h-[220px] rounded-lg flex items-center justify-center mb-4" style={{ background: style.bg }}>
            <Icon size={44} style={{ color: style.color }} aria-hidden="true" />
          </div>
          <div className="flex items-center flex-wrap gap-2.5 mb-1">
            <div className="text-xl font-extrabold text-neutral-900">{item.name}</div>
            <Badge variant="success" tone="green">
              {item.category}
            </Badge>
            <Badge variant="neutral" tone="green">
              {item.city}
            </Badge>
          </div>

          <Tabs tabs={tabs} tone="green" className="mt-5" />
        </div>

        <Card className="lg:sticky lg:top-7">
          <ProgressBar percent={item.percent} tone="green" size="lg" />
          <div className="flex justify-between text-[12.5px] mb-3.5 mt-2">
            <span className="font-bold text-green-800">{item.percent}% terdanai</span>
            <span className="text-neutral-500">
              {formatCurrency(item.collected)} / {formatCurrency(item.target)}
            </span>
          </div>
          <DetailRow label="Bagi hasil" value={`${item.returnPct}%/bulan`} />
          <DetailRow label="Tenor" value={`${item.tenorBulan} bulan`} />
          <DetailRow label="Minimum investasi" value={formatCurrency(item.minInvestment)} />

          <hr className="border-neutral-100 my-3.5" />

          <label htmlFor="amt-custom" className="block text-[12.5px] font-semibold text-neutral-700 mb-1.5">
            Nominal investasi
          </label>
          <div className="grid grid-cols-2 gap-2">
            {INVESTMENT_AMOUNT_PRESETS.map((preset) => (
              <Chip key={preset} tone="green" active={amount === preset} onClick={() => setAmount(preset)} className="justify-center">
                {formatCurrency(preset)}
              </Chip>
            ))}
          </div>
          <div className="relative mt-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-[13px] pointer-events-none">Rp</span>
            <input
              id="amt-custom"
              type="text"
              inputMode="numeric"
              value={formatNumberInput(amount)}
              onChange={(e) => setAmount(parseCurrencyInput(e.target.value))}
              className={`w-full pl-9 pr-3 py-2.5 border rounded text-sm font-sans outline-none transition-colors ${
                belowMin ? 'border-danger' : 'border-neutral-300 focus:border-green-400'
              }`}
            />
          </div>
          {belowMin && (
            <div className="flex items-center gap-1 text-[11.5px] text-danger mt-1.5">
              <IconAlertCircle size={13} aria-hidden="true" /> Nominal investasi minimal {formatCurrency(item.minInvestment)}.
            </div>
          )}

          <div className="bg-green-50 rounded px-3.5 py-3.5 my-3.5">
            <div className="flex justify-between text-[12.5px] mb-1.5 text-neutral-700">
              <span>Estimasi bagi hasil/bulan</span>
              <strong className="text-green-800">{formatCurrency(estMonthly)}</strong>
            </div>
            <div className="flex justify-between text-[12.5px] text-neutral-700">
              <span>Estimasi total {item.tenorBulan} bulan</span>
              <strong className="text-green-800">{formatCurrency(estTotal)}</strong>
            </div>
          </div>

          <Button variant="primary" tone="green" full disabled={belowMin} onClick={handleInvestClick}>
            Investasi Sekarang
          </Button>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        title="Konfirmasi investasi?"
        description={`Kamu akan berinvestasi ${formatCurrency(amount)} ke ${item.name}. Estimasi bagi hasil ${formatCurrency(
          estMonthly
        )}/bulan. Lanjutkan ke halaman upload bukti transfer?`}
        confirmLabel="Ya, Lanjutkan"
        cancelLabel="Batal"
        tone="green"
      />
    </div>
  );
}
