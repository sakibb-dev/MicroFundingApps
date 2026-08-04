import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IconArrowLeft, IconArrowRight, IconSend, IconIdBadge2, IconCameraSelfie, IconUser, IconFiles, IconCircleCheck } from '@tabler/icons-react';
import { Card, Input, TextArea, FileUpload, Button } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import api from '../../api/client';
import Stepper from './Stepper';
import SuccessScreen from './SuccessScreen';

const STEP_LABELS = ['Data Diri', 'Dokumen KYC', 'Review'];

const schema = z.object({
  namaLengkap: z.string().min(3, 'Nama lengkap wajib diisi'),
  email: z.string().min(1, 'Masukkan email yang valid').email('Masukkan email yang valid'),
  noHp: z.string().min(8, 'Nomor HP wajib diisi'),
  password: z.string().min(8, 'Kata sandi minimal 8 karakter'),
  tanggalLahir: z.string().min(1, 'Tanggal lahir wajib diisi'),
  kotaDomisili: z.string().min(1, 'Kota domisili wajib diisi'),
  alamat: z.string().min(1, 'Alamat lengkap wajib diisi'),
  noKtp: z.string().min(10, 'Nomor KTP wajib diisi (16 digit)'),
  ktpFile: z.any().refine((f) => !!f, 'Foto KTP wajib diupload'),
  selfieFile: z.any().refine((f) => !!f, 'Selfie wajib diupload'),
  agree: z.literal(true, { errorMap: () => ({ message: 'Kamu harus menyetujui Syarat & Ketentuan' }) }),
});

const STEP_FIELDS = [
  ['namaLengkap', 'email', 'noHp', 'password', 'tanggalLahir', 'kotaDomisili', 'alamat', 'noKtp'],
  ['ktpFile', 'selfieFile'],
  ['agree'],
];

export default function InvestorRegisterForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors },
    setError,
  } = useForm({ resolver: zodResolver(schema), mode: 'onBlur' });

  const values = watch();

  async function goNext() {
    const valid = await trigger(STEP_FIELDS[step - 1]);
    if (valid) setStep((s) => s + 1);
  }
  function goBack() {
    setStep((s) => s - 1);
  }

  const FIELD_MAP = {
    namaLengkap: 'nama_lengkap',
    noHp: 'no_hp',
    tanggalLahir: 'tanggal_lahir',
    kotaDomisili: 'kota_domisili',
    noKtp: 'no_ktp',
  };

  async function onSubmit(data) {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('nama_lengkap', data.namaLengkap);
      formData.append('email', data.email);
      formData.append('no_hp', data.noHp);
      formData.append('password', data.password);
      formData.append('tanggal_lahir', data.tanggalLahir);
      formData.append('kota_domisili', data.kotaDomisili);
      formData.append('alamat', data.alamat);
      formData.append('no_ktp', data.noKtp);
      formData.append('ktp', data.ktpFile);
      formData.append('selfie', data.selfieFile);

      await api.post('/auth/investor/register', formData);
      setSubmitted(true);
      toast.success('Pendaftaran terkirim. Kami akan memverifikasi dalam 1x24 jam.');
    } catch (err) {
      if (err?.response?.status === 422) {
        const apiErrors = err.response.data?.errors || {};
        Object.entries(apiErrors).forEach(([field, msgs]) => {
          const formField = Object.keys(FIELD_MAP).find((k) => FIELD_MAP[k] === field) || field;
          setError(formField, { message: msgs[0] });
        });
        setStep(1);
      } else {
        toast.error('Pendaftaran gagal dikirim. Coba lagi dalam beberapa saat.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <Card>
        <SuccessScreen
          title="Pendaftaran terkirim!"
          description="Data dan dokumenmu sedang kami verifikasi. Proses ini biasanya selesai dalam 1×24 jam — kamu akan menerima email begitu akun terverifikasi."
          infoText="Cek email secara berkala untuk update status"
        />
      </Card>
    );
  }

  return (
    <div>
      <Stepper steps={STEP_LABELS} currentStep={step} />
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && (
            <div>
              <div className="text-lg font-extrabold mb-1">Data Diri</div>
              <div className="text-[13px] text-neutral-500 mb-6">Isi data diri sesuai KTP untuk proses verifikasi.</div>

              <Input label="Nama lengkap" required placeholder="Sesuai KTP" error={errors.namaLengkap?.message} {...register('namaLengkap')} />
              <div className="grid sm:grid-cols-2 gap-3.5">
                <Input label="Email" required type="email" placeholder="nama@email.com" error={errors.email?.message} {...register('email')} />
                <Input label="Nomor HP" required placeholder="08xx-xxxx-xxxx" error={errors.noHp?.message} {...register('noHp')} />
              </div>
              <Input
                label="Kata sandi"
                required
                type="password"
                placeholder="Minimal 8 karakter"
                hint="Gunakan kombinasi huruf, angka, dan simbol."
                error={errors.password?.message}
                {...register('password')}
              />
              <div className="grid sm:grid-cols-2 gap-3.5">
                <Input label="Tanggal lahir" required type="date" error={errors.tanggalLahir?.message} {...register('tanggalLahir')} />
                <Input label="Kota domisili" required placeholder="Contoh: Jakarta Selatan" error={errors.kotaDomisili?.message} {...register('kotaDomisili')} />
              </div>
              <Input label="Nomor KTP" required placeholder="16 digit sesuai KTP" error={errors.noKtp?.message} {...register('noKtp')} />
              <TextArea label="Alamat lengkap" required placeholder="Sesuai KTP" rows={2} error={errors.alamat?.message} {...register('alamat')} />

              <div className="flex justify-end mt-6">
                <Button type="button" onClick={goNext}>
                  Lanjut ke Dokumen KYC <IconArrowRight size={16} />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="text-lg font-extrabold mb-1">Dokumen KYC</div>
              <div className="text-[13px] text-neutral-500 mb-6">Upload dokumen untuk verifikasi identitas. Tim kami memproses dalam 1×24 jam.</div>

              <FileUpload
                label="Foto KTP"
                required
                icon={IconIdBadge2}
                hint="JPG atau PNG, maks 5MB, pastikan seluruh sisi KTP terlihat jelas"
                error={errors.ktpFile?.message}
                onChange={(f) => setValue('ktpFile', f, { shouldValidate: true })}
              />
              <FileUpload
                label="Selfie sambil memegang KTP"
                required
                icon={IconCameraSelfie}
                hint="Pastikan wajah dan KTP terlihat jelas dalam satu foto"
                error={errors.selfieFile?.message}
                onChange={(f) => setValue('selfieFile', f, { shouldValidate: true })}
              />

              <div className="flex justify-between mt-6">
                <Button type="button" variant="ghost" onClick={goBack}>
                  <IconArrowLeft size={16} /> Kembali
                </Button>
                <Button type="button" onClick={goNext}>
                  Lanjut ke Review <IconArrowRight size={16} />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="text-lg font-extrabold mb-1">Review Pendaftaran</div>
              <div className="text-[13px] text-neutral-500 mb-6">Periksa kembali data sebelum mengirim pendaftaran.</div>

              <div className="bg-neutral-50 rounded p-4 mb-3.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-green-800 uppercase tracking-wide mb-2.5">
                  <IconUser size={14} /> Data Diri
                </div>
                {[
                  ['Nama lengkap', values.namaLengkap],
                  ['Email', values.email],
                  ['Nomor HP', values.noHp],
                  ['Kota domisili', values.kotaDomisili],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between text-[13px] py-1.5 border-b border-neutral-100 last:border-none">
                    <span className="text-neutral-500">{label}</span>
                    <span className="font-semibold text-right">{val || '—'}</span>
                  </div>
                ))}
              </div>
              <div className="bg-neutral-50 rounded p-4 mb-3.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-green-800 uppercase tracking-wide mb-2.5">
                  <IconFiles size={14} /> Dokumen
                </div>
                {[
                  ['Foto KTP', values.ktpFile],
                  ['Selfie + KTP', values.selfieFile],
                ].map(([label, file]) => (
                  <div key={label} className="flex justify-between text-[13px] py-1.5 border-b border-neutral-100 last:border-none">
                    <span className="text-neutral-500">{label}</span>
                    <span className="font-semibold flex items-center gap-1">
                      {file && <IconCircleCheck size={14} className="text-success" />} {file ? 'Terupload' : '—'}
                    </span>
                  </div>
                ))}
              </div>

              <label className="flex items-start gap-2.5 text-[12.5px] text-neutral-700 my-4 leading-relaxed">
                <input type="checkbox" className="mt-0.5 accent-green-600" {...register('agree')} />
                Saya menyatakan data di atas benar dan menyetujui{' '}
                <a href="#" className="text-green-700 font-semibold">
                  Syarat &amp; Ketentuan
                </a>{' '}
                serta{' '}
                <a href="#" className="text-green-700 font-semibold">
                  Kebijakan Privasi
                </a>{' '}
                MicroInvest.
              </label>
              {errors.agree && <div className="text-[11.5px] text-danger -mt-3 mb-3">{errors.agree.message}</div>}

              <div className="flex justify-between mt-2">
                <Button type="button" variant="ghost" onClick={goBack}>
                  <IconArrowLeft size={16} /> Kembali
                </Button>
                <Button type="submit" loading={submitting}>
                  Kirim Pendaftaran <IconSend size={16} />
                </Button>
              </div>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
}
