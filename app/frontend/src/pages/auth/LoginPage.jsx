import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { Card, Input, Button, Chip } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const ROLES = [
  { key: 'investor', label: 'Investor', home: '/investor' },
  { key: 'umkm', label: 'UMKM', home: '/umkm' },
  { key: 'admin', label: 'Admin', home: '/admin' },
];

const schema = z.object({
  email: z.string().min(1, 'Masukkan email yang valid').email('Masukkan email yang valid'),
  password: z.string().min(1, 'Kata sandi wajib diisi'),
});

export default function LoginPage() {
  const [role, setRole] = useState('investor');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(values) {
    setSubmitting(true);
    try {
      // TODO: wire to real POST /api/auth/{role}/login once backend is running
      await login(role, values);
      const dest = location.state?.from || ROLES.find((r) => r.key === role)?.home || '/';
      navigate(dest, { replace: true });
    } catch (err) {
      if (err?.response?.status === 422) {
        const apiErrors = err.response.data?.errors || {};
        Object.entries(apiErrors).forEach(([field, msgs]) => setError(field, { message: msgs[0] }));
      } else {
        toast.error('Email atau kata sandi salah.');
      }
    } finally {
      setSubmitting(false);
    }
  }

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

      <div className="max-w-[420px] mx-auto px-5 pt-14 pb-20">
        <h1 className="text-2xl font-extrabold text-neutral-900 text-center mb-1.5">Masuk ke MicroInvest</h1>
        <p className="text-[13.5px] text-neutral-500 text-center mb-7">Pilih jenis akun, lalu masuk dengan email dan kata sandimu.</p>

        <div className="flex gap-2 justify-center mb-6">
          {ROLES.map((r) => (
            <Chip key={r.key} active={role === r.key} onClick={() => setRole(r.key)}>
              {r.label}
            </Chip>
          ))}
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input label="Email" required type="email" placeholder="nama@email.com" error={errors.email?.message} {...register('email')} />
            <Input label="Kata sandi" required type="password" placeholder="Kata sandi" error={errors.password?.message} {...register('password')} />
            <Button type="submit" full loading={submitting} className="mt-2">
              Masuk <IconArrowRight size={16} />
            </Button>
          </form>
        </Card>

        <div className="text-center text-[13px] text-neutral-500 mt-6">
          Belum punya akun?{' '}
          <Link to="/daftar" className="text-green-700 font-bold">
            Daftar di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
