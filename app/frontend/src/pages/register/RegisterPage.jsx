import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconArrowLeft, IconUserCircle, IconBuildingStore } from '@tabler/icons-react';
import InvestorRegisterForm from './InvestorRegisterForm';
import UmkmRegisterForm from './UmkmRegisterForm';

export default function RegisterPage() {
  const [role, setRole] = useState('investor');

  return (
    <div className="min-h-screen bg-neutral-50">
      <nav className="sticky top-0 z-40 bg-green-950 px-[5%] h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-[30px] h-[30px] bg-green-400 rounded-[7px] flex items-center justify-center font-extrabold text-sm text-green-950">
            M
          </div>
          <span className="text-base font-bold text-white">MicroInvest</span>
        </Link>
        <Link to="/" className="flex items-center gap-1.5 text-[13.5px] font-medium text-white/65 hover:text-white">
          <IconArrowLeft size={16} /> <span className="hidden sm:inline">Kembali ke Beranda</span>
        </Link>
      </nav>

      <div className="max-w-[640px] mx-auto px-5 pt-10 pb-20">
        <div className="grid grid-cols-2 gap-2.5 bg-white border border-neutral-100 rounded-lg p-1.5 mb-8">
          <button
            type="button"
            onClick={() => setRole('investor')}
            className={`flex flex-col items-center gap-1.5 py-4 px-3 rounded-[10px] transition-colors ${
              role === 'investor' ? 'bg-green-800' : 'bg-transparent'
            }`}
          >
            <IconUserCircle size={22} className={role === 'investor' ? 'text-green-400' : 'text-neutral-500'} />
            <span className={`text-[13.5px] font-bold ${role === 'investor' ? 'text-white' : 'text-neutral-700'}`}>Daftar sebagai Investor</span>
            <span className={`text-[11px] ${role === 'investor' ? 'text-green-100' : 'text-neutral-500'}`}>Danai UMKM &amp; terima bagi hasil</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('umkm')}
            className={`flex flex-col items-center gap-1.5 py-4 px-3 rounded-[10px] transition-colors ${
              role === 'umkm' ? 'bg-green-800' : 'bg-transparent'
            }`}
          >
            <IconBuildingStore size={22} className={role === 'umkm' ? 'text-green-400' : 'text-neutral-500'} />
            <span className={`text-[13.5px] font-bold ${role === 'umkm' ? 'text-white' : 'text-neutral-700'}`}>Daftar sebagai UMKM</span>
            <span className={`text-[11px] ${role === 'umkm' ? 'text-green-100' : 'text-neutral-500'}`}>Ajukan pendanaan usaha</span>
          </button>
        </div>

        {role === 'investor' ? <InvestorRegisterForm key="investor" /> : <UmkmRegisterForm key="umkm" />}

        <div className="text-center text-[13px] text-neutral-500 mt-6">
          Sudah punya akun?{' '}
          <Link to="/masuk" className="text-green-700 font-bold">
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
