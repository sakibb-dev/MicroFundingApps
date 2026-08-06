import { Link } from 'react-router-dom';
import {
  IconMapPin,
  IconClock,
  IconShieldCheck,
  IconCash,
  IconChartBar,
  IconLock,
  IconCreditCard,
  IconStarFilled,
  IconToolsKitchen2,
  IconShirt,
  IconTool,
  IconArrowRight,
} from '@tabler/icons-react';
import { Accordion, ProgressBar, Badge } from '../../components/ui';

const UMKM_SHOWCASE = [
  {
    name: 'Warung Makan Bu Sari',
    category: 'Kuliner',
    city: 'Yogyakarta',
    icon: IconToolsKitchen2,
    bg: '#D1FAE5',
    iconColor: '#065F46',
    status: { label: 'Hampir Penuh', variant: 'warning' },
    returnPct: '2.5%',
    percent: 78,
    collected: 'Rp 23.4jt',
    target: 'Rp 30jt',
    meta: '12 hari lagi · 34 investor',
  },
  {
    name: 'Konveksi Maju Jaya',
    category: 'Fashion',
    city: 'Bandung',
    icon: IconShirt,
    bg: '#EDE9FE',
    iconColor: '#6D28D9',
    status: { label: 'Aktif', variant: 'success' },
    returnPct: '3.0%',
    percent: 45,
    collected: 'Rp 13.5jt',
    target: 'Rp 30jt',
    meta: '28 hari lagi · 18 investor',
  },
  {
    name: 'Bengkel Motor Pak Haji',
    category: 'Otomotif',
    city: 'Surabaya',
    icon: IconTool,
    bg: '#FEF3C7',
    iconColor: '#92400E',
    status: { label: '92% — Segera!', variant: 'warning' },
    returnPct: '2.8%',
    percent: 92,
    collected: 'Rp 27.6jt',
    target: 'Rp 30jt',
    meta: '5 hari lagi · 51 investor',
  },
];

const KEUNGGULAN = [
  { icon: IconShieldCheck, title: 'KYC & Audit Ketat', desc: 'Setiap investor dan UMKM melewati verifikasi identitas dan audit dokumen keuangan sebelum dapat bertransaksi.' },
  { icon: IconCash, title: 'Bagi Hasil Otomatis', desc: 'Sistem menghitung dan mendistribusikan bagi hasil proporsional setiap bulan, langsung ke rekening investor.' },
  { icon: IconChartBar, title: 'Portofolio Real-time', desc: 'Pantau semua investasi aktif, riwayat bagi hasil, dan laporan keuangan UMKM kapan saja dari dashboard.' },
  { icon: IconLock, title: 'Perjanjian Digital', desc: 'Invoice dan perjanjian investasi legal dikirim otomatis via email setiap transaksi dikonfirmasi.' },
  { icon: IconMapPin, title: 'UMKM Lokal Terverifikasi', desc: 'Fokus pada UMKM Indonesia yang telah memiliki NIB aktif, laporan keuangan, dan rekam jejak usaha nyata.' },
  { icon: IconCreditCard, title: 'Mulai dari Rp 500.000', desc: 'Investasi terjangkau untuk semua kalangan. Diversifikasi ke banyak UMKM dengan modal yang fleksibel.' },
];

const TESTIMONI = [
  {
    initials: 'RK',
    name: 'R***o K***',
    city: 'Jakarta Selatan',
    returnPct: '+2.6%/bln',
    stars: 5,
    quote:
      '"Awalnya ragu, tapi setelah 3 bulan bagi hasilnya konsisten masuk tiap tanggal 5. Prosesnya transparan, bisa pantau laporan keuangan UMKM langsung dari dashboard."',
  },
  {
    initials: 'AN',
    name: 'A***a N***',
    city: 'Bandung',
    returnPct: '+2.9%/bln',
    stars: 5,
    quote: '"Suka banget bisa investasi sambil bantu UMKM lokal. Verifikasi KYC-nya cepat, dalam 1 hari sudah bisa langsung pilih UMKM mana yang mau didanai."',
  },
  {
    initials: 'DS',
    name: 'D***i S***',
    city: 'Surabaya',
    returnPct: '+3.1%/bln',
    stars: 4,
    quote:
      '"Sudah diversifikasi ke 5 UMKM berbeda. Total bagi hasil bulan ini Rp 1.8jt dari dana yang saya investasikan. Platform ini beneran bikin UMKM dan investor sama-sama untung."',
  },
];

const FAQ_ITEMS = [
  {
    question: 'Bagaimana cara mulai berinvestasi di MicroInvest?',
    answer:
      'Daftar akun, lengkapi data diri, upload KTP dan selfie memegang KTP. Tim kami akan memverifikasi dalam 1×24 jam. Setelah status KYC approved, kamu sudah bisa mulai memilih dan mendanai UMKM.',
  },
  {
    question: 'Apakah investasi saya aman?',
    answer:
      'Semua UMKM wajib menyerahkan NIB, KTP pemilik, dan laporan keuangan 3 bulan terakhir sebelum diapprove. Perjanjian investasi berkekuatan hukum dikirim ke emailmu setiap transaksi. Namun seperti investasi lainnya, return tidak dijamin dan ada risiko bisnis.',
  },
  {
    question: 'Bagaimana cara menghitung bagi hasil?',
    answer:
      'Bagi hasil = (Nominal Investasimu / Total Dana Terkumpul) × Keuntungan Bersih UMKM × Persentase Bagi Hasil yang disepakati. Contoh: investasi Rp 1jt dari total Rp 30jt, keuntungan bersih UMKM Rp 10jt, bagi hasil 30% → kamu terima Rp 10.000.',
  },
  {
    question: 'Berapa minimal investasi?',
    answer:
      'Investasi minimum adalah Rp 500.000 per UMKM. Tidak ada batas maksimum. Kami menyarankan diversifikasi ke beberapa UMKM untuk mengurangi risiko konsentrasi.',
  },
  {
    question: 'Kapan bagi hasil dikirim ke rekening saya?',
    answer:
      'UMKM wajib mengajukan laporan keuntungan dan bagi hasil sebelum tanggal 3 setiap bulan. Setelah diverifikasi admin, distribusi ke investor dilakukan paling lambat tanggal 5 bulan berjalan.',
  },
];

function SectionEyebrow({ children, align = 'center' }) {
  return (
    <div className={`text-xs font-semibold text-green-600 tracking-[0.08em] uppercase mb-3 ${align === 'left' ? 'text-left' : 'text-center'}`}>
      {children}
    </div>
  );
}

function SectionTitle({ children, align = 'center', dark = false }) {
  return (
    <h2
      className={`text-[26px] sm:text-[34px] font-extrabold tracking-[-0.8px] mb-2.5 ${dark ? 'text-white' : 'text-neutral-900'} ${
        align === 'left' ? 'text-left' : 'text-center'
      }`}
    >
      {children}
    </h2>
  );
}

function SectionDesc({ children, align = 'center', dark = false, className = '' }) {
  return (
    <p
      className={`text-[15px] leading-relaxed max-w-[520px] mb-13 ${dark ? 'text-white/55' : 'text-neutral-500'} ${
        align === 'left' ? 'text-left mr-auto' : 'text-center mx-auto'
      } ${className}`}
    >
      {children}
    </p>
  );
}

function UmkmCard({ umkm }) {
  const Icon = umkm.icon;
  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
      <div className="h-40 relative flex items-center justify-center" style={{ background: umkm.bg }}>
        <Icon size={32} style={{ color: umkm.iconColor }} aria-hidden="true" />
        <Badge variant={umkm.status.variant} className="absolute top-3 right-3">
          {umkm.status.label}
        </Badge>
      </div>
      <div className="p-4 pt-4 pb-5">
        <div className="text-[11px] font-semibold text-neutral-500 tracking-[0.05em] uppercase mb-1">{umkm.category}</div>
        <div className="text-[15px] font-bold text-neutral-900 mb-0.5">{umkm.name}</div>
        <div className="text-xs text-neutral-500 mb-3 flex items-center gap-1">
          <IconMapPin size={12} /> {umkm.city}
        </div>
        <div className="text-xl font-extrabold text-green-600 tracking-tight">
          {umkm.returnPct} <span className="text-xs font-medium text-neutral-500">/ bulan bagi hasil</span>
        </div>
        <ProgressBar
          percent={umkm.percent}
          className="mt-2.5 mb-1.5"
          labels={[`${umkm.percent}% terdanai`, `${umkm.collected} / ${umkm.target}`]}
        />
        <div className="flex justify-between items-center mt-3.5 pt-3 border-t border-neutral-100">
          <div className="text-xs text-neutral-500 flex items-center gap-1">
            <IconClock size={12} /> {umkm.meta}
          </div>
          <Link to="/daftar" className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-green-800 text-white hover:bg-green-600 transition-colors">
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-green-950 px-[5%] pt-20 pb-16 lg:pt-24 lg:pb-20 grid lg:grid-cols-[1fr_420px] gap-12 items-center min-h-[520px]">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-green-400/10 border border-green-400/25 rounded-full px-3 py-1 text-xs font-semibold text-green-400 mb-5">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full" /> Terdaftar &amp; Diawasi OJK
          </div>
          <h1 className="text-[32px] sm:text-[42px] lg:text-[50px] font-extrabold text-white leading-[1.12] tracking-[-1.5px] mb-5">
            Investasi di UMKM Lokal,
            <br />
            Raih <em className="not-italic text-green-400">Bagi Hasil</em>
            <br />
            Setiap Bulan
          </h1>
          <p className="text-base text-white/60 leading-relaxed mb-9 max-w-[480px]">
            Danai usaha kecil menengah terverifikasi di sekitarmu. Mulai dari Rp&nbsp;500.000, dapatkan porsi bagi hasil bulanan secara transparan.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link
              to="/daftar"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[15px] font-bold text-green-950 bg-green-400 hover:bg-[#4ade80] transition-colors"
            >
              Mulai Investasi <IconArrowRight size={16} />
            </Link>
            <a
              href="#umkm"
              className="px-7 py-3.5 rounded-full text-[15px] font-semibold text-white border-[1.5px] border-white/22 hover:border-white/50 transition-colors"
            >
              Lihat UMKM
            </a>
          </div>
          <div className="flex items-center gap-2.5 mt-10">
            <div className="flex">
              {['RK', 'AN', 'DS', 'MI'].map((initials, i) => (
                <span
                  key={initials}
                  className="w-[30px] h-[30px] rounded-full border-2 border-green-950 flex items-center justify-center text-[10px] font-bold bg-green-600 text-white"
                  style={{ marginLeft: i === 0 ? 0 : -8 }}
                >
                  {initials}
                </span>
              ))}
            </div>
            <p className="text-[13px] text-white/55">
              Bergabung bersama <strong className="text-white">3.200+ investor</strong> aktif di seluruh Indonesia
            </p>
          </div>
        </div>

        <div className="hidden lg:block relative">
          <div className="bg-white rounded-[20px] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
            <div className="text-[11px] text-neutral-500 mb-1">Total bagi hasil bulan ini</div>
            <div className="text-[28px] font-extrabold text-neutral-900 tracking-tight">Rp 1.250.000</div>
            <div className="text-xs text-success font-semibold mb-3.5">↑ 2.8% dari investasi aktif</div>
            <hr className="border-neutral-100 mb-3.5" />
            {UMKM_SHOWCASE.slice(0, 2).map((u) => (
              <div key={u.name} className="mb-3">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[13px] font-semibold text-neutral-900">{u.name}</span>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-green-100 text-green-600">{u.category}</span>
                </div>
                <ProgressBar percent={u.percent} labels={[`${u.percent}% terdanai`, `${u.collected} / ${u.target}`]} />
              </div>
            ))}
          </div>
          <div className="absolute -bottom-5 -right-5 bg-green-800 rounded-2xl px-4 py-3 shadow-[0_12px_32px_rgba(0,0,0,0.3)] min-w-[160px]">
            <div className="text-[11px] text-green-200 mb-0.5">Return rata-rata</div>
            <div className="text-[22px] font-extrabold text-white">2.7%</div>
            <div className="text-[11px] text-green-200">per bulan</div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-white border-b border-neutral-100 px-[5%] py-10 grid grid-cols-1 sm:grid-cols-3">
        {[
          ['120+', 'UMKM Aktif'],
          ['Rp 2.4M', 'Dana Diinvestasikan'],
          ['3.200+', 'Investor Aktif'],
        ].map(([num, label], i) => (
          <div key={label} className={`text-center px-5 py-4 sm:py-0 relative ${i < 2 ? 'sm:after:content-[""] sm:after:absolute sm:after:right-0 sm:after:top-1/2 sm:after:-translate-y-1/2 sm:after:h-10 sm:after:w-px sm:after:bg-neutral-200' : ''}`}>
            <div className="text-4xl font-extrabold text-green-800 tracking-[-1.5px]">{num}</div>
            <div className="text-[13px] text-neutral-500 font-medium mt-0.5">{label}</div>
          </div>
        ))}
      </section>

      {/* PARTNERS */}
      <div className="px-[5%] py-7 border-b border-neutral-100">
        <div className="text-center text-xs text-neutral-400 font-medium tracking-[0.08em] uppercase mb-5">Mitra &amp; Afiliasi Terpercaya</div>
        <div className="flex items-center justify-center gap-10 flex-wrap">
          {['BRI', 'Mandiri', 'OJK', 'KEMENDAG', 'BPKM'].map((p) => (
            <span key={p} className="text-[15px] font-bold text-neutral-400 tracking-tight">
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="px-[5%] py-20 bg-neutral-50" id="how">
        <SectionEyebrow>Cara Kerja</SectionEyebrow>
        <SectionTitle>Tiga langkah untuk mulai berinvestasi</SectionTitle>
        <SectionDesc>Proses sederhana, transparan, dan aman. Dari pendaftaran hingga bagi hasil, semuanya terpantau dalam satu platform.</SectionDesc>
        <div className="grid sm:grid-cols-3 gap-6 relative">
          {[
            ['Daftar & Verifikasi KYC', 'Buat akun, isi data diri, upload KTP dan selfie. Tim kami verifikasi dalam 1×24 jam.'],
            ['Pilih UMKM & Investasikan', 'Telusuri UMKM terverifikasi, pilih yang sesuai profil risiko, dan transfer danamu langsung.'],
            ['Terima Bagi Hasil Bulanan', 'Setiap bulan terima porsi bagi hasil proporsional dari keuntungan bersih UMKM yang kamu danai.'],
          ].map(([title, desc], i) => (
            <div key={title} className="bg-white border border-neutral-200 rounded-xl p-7 relative z-10 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-green-800 text-white text-lg font-extrabold flex items-center justify-center mb-5">
                {i + 1}
              </div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">{title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* UMKM SHOWCASE */}
      <section className="px-[5%] py-20 bg-white" id="umkm">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-9">
          <div>
            <SectionEyebrow align="left">UMKM Unggulan</SectionEyebrow>
            <h2 className="text-[26px] sm:text-[34px] font-extrabold tracking-[-0.8px] text-neutral-900 mb-1.5">Pilihan UMKM hari ini</h2>
            <p className="text-[15px] text-neutral-500">Setiap UMKM telah melewati audit dokumen dan review tim analis kami.</p>
          </div>
          <Link
            to="/daftar"
            className="text-[13px] font-semibold text-green-600 border-[1.5px] border-green-600 px-[18px] py-2 rounded-full hover:bg-green-50 transition-colors whitespace-nowrap"
          >
            Lihat semua UMKM
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {UMKM_SHOWCASE.map((u) => (
            <UmkmCard key={u.name} umkm={u} />
          ))}
        </div>
      </section>

      {/* KEUNGGULAN */}
      <section className="px-[5%] py-20 bg-green-950" id="keunggulan">
        <SectionEyebrow>
          <span className="text-green-400">Kenapa MicroInvest</span>
        </SectionEyebrow>
        <SectionTitle dark>Dirancang untuk kepercayaan investor</SectionTitle>
        <SectionDesc dark>Dari verifikasi hingga distribusi bagi hasil, setiap langkah dirancang transparan dan dapat dipantau.</SectionDesc>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {KEUNGGULAN.map((f) => (
            <div key={f.title} className="bg-white/5 border border-white/[.08] rounded-xl p-7 hover:bg-white/[.08] transition-colors">
              <div className="w-11 h-11 rounded bg-green-400/15 flex items-center justify-center mb-4">
                <f.icon size={20} className="text-green-400" aria-hidden="true" />
              </div>
              <h3 className="text-[15px] font-bold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-white/55 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONI */}
      <section className="px-[5%] py-20 bg-neutral-50">
        <SectionEyebrow>Dari Investor Kami</SectionEyebrow>
        <SectionTitle>Yang mereka rasakan</SectionTitle>
        <SectionDesc>Lebih dari 3.200 investor aktif sudah mempercayakan dananya melalui MicroInvest.</SectionDesc>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONI.map((t) => (
            <div key={t.name} className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-0.5 text-amber-500 mb-3.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <IconStarFilled key={i} size={14} className={i < t.stars ? '' : 'text-neutral-200'} />
                ))}
              </div>
              <p className="text-sm text-neutral-700 leading-relaxed mb-5 italic">{t.quote}</p>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-green-800 flex items-center justify-center text-[13px] font-bold text-white">
                  {t.initials}
                </div>
                <div>
                  <div className="text-[13px] font-bold text-neutral-900">{t.name}</div>
                  <div className="text-xs text-neutral-500">{t.city}</div>
                </div>
                <div className="ml-auto text-right">
                  <span className="text-[11px] text-neutral-500 block">bagi hasil</span>
                  <strong className="text-[15px] font-extrabold text-green-600">{t.returnPct}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-[5%] py-20 bg-white" id="faq">
        <SectionEyebrow>FAQ</SectionEyebrow>
        <SectionTitle>Pertanyaan yang sering ditanyakan</SectionTitle>
        <SectionDesc className="!mb-10">Tidak menemukan jawaban? Hubungi tim kami di support@microinvest.id</SectionDesc>
        <Accordion items={FAQ_ITEMS} />
      </section>

      {/* CTA BOTTOM */}
      <section className="bg-green-800 px-[5%] py-20 text-center">
        <h2 className="text-[26px] sm:text-[40px] font-extrabold text-white tracking-[-1px] mb-3.5">Siap mulai investasi di UMKM lokal?</h2>
        <p className="text-base text-white/60 mb-9 max-w-[480px] mx-auto">
          Bergabung dengan ribuan investor yang sudah mendapatkan bagi hasil bulanan sambil membantu ekonomi lokal berkembang.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link to="/daftar" className="px-8 py-3.5 rounded-full text-[15px] font-bold text-green-800 bg-white hover:opacity-90 transition-opacity">
            Daftar Sekarang — Gratis
          </Link>
          <a href="#umkm" className="px-8 py-3.5 rounded-full text-[15px] font-semibold text-white border-2 border-white/35 hover:border-white/70 transition-colors">
            Lihat UMKM Dulu
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-green-950 px-[5%] pt-16 pb-7">
        <div className="grid sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-10 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-[30px] h-[30px] bg-green-400 rounded-[7px] flex items-center justify-center font-extrabold text-sm text-green-950">
                M
              </div>
              <span className="text-base font-bold text-white">MicroInvest</span>
            </Link>
            <p className="text-[13px] text-white/45 leading-relaxed mt-3 max-w-[240px]">
              Platform investasi UMKM berbasis bagi hasil yang transparan, terverifikasi, dan berdampak nyata bagi ekonomi lokal Indonesia.
            </p>
            <div className="inline-flex items-center gap-1.5 bg-green-400/10 border border-green-400/20 rounded px-2.5 py-1 mt-3.5 text-[11px] font-semibold text-green-400">
              <IconShieldCheck size={14} /> Terdaftar OJK
            </div>
          </div>
          {[
            ['Platform', ['Cara Kerja', 'UMKM Aktif', 'Keunggulan', 'Blog']],
            ['Investor', ['Daftar Akun', 'Panduan KYC', 'Kalkulator Return', 'Portofolio']],
            ['UMKM', ['Daftarkan Usaha', 'Syarat Pengajuan', 'Panduan Bagi Hasil']],
            ['Legal', ['Kebijakan Privasi', 'Syarat & Ketentuan', 'Perjanjian Investasi', 'Kontak']],
          ].map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-bold text-white tracking-[0.06em] uppercase mb-3.5">{title}</h4>
              {links.map((l) => (
                <a key={l} href="#" className="block text-[13px] text-white/45 hover:text-white/85 transition-colors mb-2.5">
                  {l}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div className="border-t border-white/[.08] pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-xs text-white/30">© 2026 MicroInvest. Hak cipta dilindungi.</div>
          <div className="flex gap-5">
            <a href="#" className="text-xs text-white/30 hover:text-white/60">
              Kebijakan Privasi
            </a>
            <a href="#" className="text-xs text-white/30 hover:text-white/60">
              Syarat & Ketentuan
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
