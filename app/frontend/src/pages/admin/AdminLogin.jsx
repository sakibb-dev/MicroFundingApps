import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IconArrowRight, IconShieldLock } from '@tabler/icons-react';
import { Card, Input, Button } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

// Intentionally not linked from anywhere in the public UI (navbar, /masuk,
// footer, etc). Only reachable by someone who already knows this exact URL.
// Actual access control still happens server-side via the admin-scoped
// Sanctum token and ProtectedRoute below -- this page just removes the
// discovery path, it isn't the security boundary itself.
const schema = z.object({
  email: z.string().min(1, 'Masukkan email yang valid').email('Masukkan email yang valid'),
  password: z.string().min(1, 'Kata sandi wajib diisi'),
});

export default function AdminLogin() {
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
      await login('admin', values);
      const dest = location.state?.from || '/admin-panel';
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
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-5">
      <div className="w-full max-w-[380px]">
        <div className="flex flex-col items-center mb-7">
          <div className="w-11 h-11 bg-teal-800 rounded-xl flex items-center justify-center mb-3">
            <IconShieldLock size={22} className="text-white" />
          </div>
          <h1 className="text-xl font-extrabold text-neutral-900">Admin Panel</h1>
          <p className="text-[13px] text-neutral-500 mt-1">MicroInvest — akses internal</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input label="Email" required type="email" placeholder="admin@microinvest.id" error={errors.email?.message} {...register('email')} />
            <Input label="Kata sandi" required type="password" placeholder="Kata sandi" error={errors.password?.message} {...register('password')} />
            <Button type="submit" full loading={submitting} tone="teal" className="mt-2">
              Masuk <IconArrowRight size={16} />
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
