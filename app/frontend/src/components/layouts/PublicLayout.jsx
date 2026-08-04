import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { IconMenu2, IconX } from '@tabler/icons-react';

const NAV_LINKS = [
  { href: '/#how', label: 'Cara Kerja' },
  { href: '/#umkm', label: 'UMKM' },
  { href: '/#keunggulan', label: 'Keunggulan' },
  { href: '/#faq', label: 'FAQ' },
];

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-40 bg-green-950 border-b border-white/[.07] px-[5%] h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-[30px] h-[30px] bg-green-400 rounded-[7px] flex items-center justify-center font-extrabold text-sm text-green-950">
            M
          </div>
          <span className="text-base font-bold text-white tracking-tight">MicroInvest</span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-white/65 hover:text-white transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2.5">
          <Link
            to="/masuk"
            className="px-4 py-1.5 rounded-full text-[13px] font-semibold text-white border-[1.5px] border-white/25 hover:border-white/60 transition-colors"
          >
            Masuk
          </Link>
          <Link
            to="/daftar"
            className="px-[18px] py-1.5 rounded-full text-[13px] font-semibold text-green-950 bg-green-400 hover:bg-green-200 transition-colors"
          >
            Mulai Investasi
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Buka menu"
          className="md:hidden text-white"
        >
          <IconMenu2 size={24} />
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 max-w-[85vw] bg-green-950 p-6 flex flex-col gap-6">
            <button onClick={() => setMenuOpen(false)} aria-label="Tutup menu" className="self-end text-white/70">
              <IconX size={22} />
            </button>
            <div className="flex flex-col gap-5">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-[15px] font-medium text-white/80 hover:text-white"
                >
                  {l.label}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-2.5 mt-4">
              <Link
                to="/masuk"
                onClick={() => setMenuOpen(false)}
                className="text-center px-4 py-2.5 rounded-full text-sm font-semibold text-white border-[1.5px] border-white/25"
              >
                Masuk
              </Link>
              <Link
                to="/daftar"
                onClick={() => setMenuOpen(false)}
                className="text-center px-4 py-2.5 rounded-full text-sm font-semibold text-green-950 bg-green-400"
              >
                Mulai Investasi
              </Link>
            </div>
          </div>
        </div>
      )}

      <Outlet />
    </div>
  );
}
