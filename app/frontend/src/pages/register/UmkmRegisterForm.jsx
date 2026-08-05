import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  IconArrowLeft,
  IconArrowRight,
  IconSend,
  IconFileCertificate,
  IconChartBar,
  IconPhoto,
  IconFileText,
  IconBuildingStore,
  IconCash,
  IconFiles,
  IconCircleCheck,
} from '@tabler/icons-react';
import { Card, Input, TextArea, Select, FileUpload, CameraCapture, Button } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import api from '../../api/client';
import { formatNumberInput, parseCurrencyInput } from '../../utils/format';
import { BANK_OPTIONS } from '../../utils/banks';
import Stepper from './Stepper';
import SuccessScreen from './SuccessScreen';

const STEP_LABELS = ['Info Usaha', 'Info Pendanaan', 'Dokumen', 'Review'];

const CATEGORIES = ['Kuliner', 'Fashion', 'Otomotif', 'Kerajinan', 'Jasa'];

const schema = z.object({
  namaUsaha: z.string().min(3, 'Nama usaha wajib diisi'),
  kategori: z.string().min(1, 'Pilih kategori usaha'),
  kotaUsaha: z.string().min(1, 'Kota usaha wajib diisi'),
  tahunBerdiri: z.string().min(4, 'Tahun berdiri wajib diisi'),
  jumlahKaryawan: z.string().optional(),
  deskripsi: z.string().min(10, 'Deskripsi usaha wajib diisi'),
  email: z.string().min(1, 'Masukkan email yang valid').email('Masukkan email yang valid'),
  password: z.string().min(8, 'Kata sandi minimal 8 karakter'),
  targetDana: z.string().min(1, 'Target dana wajib diisi'),
  tenor: z.string().min(1, 'Tenor wajib diisi'),
  persenBagiHasil: z.string().min(1, 'Persentase bagi hasil wajib diisi'),
  omzetBulanan: z.string().optional(),
  bank: z.string().min(1, 'Bank wajib dipilih'),
  noRekening: z.string().min(1, 'Nomor rekening wajib diisi'),
  nibFile: z.any().refine((f) => !!f, 'NIB wajib diupload'),
  ktpFile: z.any().refine((f) => !!f, 'KTP pemilik wajib diupload'),
  laporanFile: z.any().refine((f) => !!f, 'Laporan keuangan wajib diupload'),
  fotoUsahaFile: z.any().refine((f) => !!f, 'Foto usaha wajib diupload'),
  suratFile: z.any().refine((f) => !!f, 'Surat perjanjian wajib diupload'),
  agree: z.literal(true, { errorMap: () => ({ message: 'Kamu harus menyetujui Syarat & Ketentuan' }) }),
});

const STEP_FIELDS = [
  ['namaUsaha', 'kategori', 'kotaUsaha', 'tahunBerdiri', 'deskripsi', 'email', 'password'],
  ['targetDana', 'tenor', 'persenBagiHasil', 'bank', 'noRekening'],
  ['nibFile', 'ktpFile', 'laporanFile', 'fotoUsahaFile', 'suratFile'],
  ['agree'],
];

export default function UmkmRegisterForm() {
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
    namaUsaha: 'nama_usaha',
    kotaUsaha: 'kota',
    tahunBerdiri: 'tahun_berdiri',
    jumlahKaryawan: 'jumlah_karyawan',
    targetDana: 'target_dana',
    tenor: 'tenor_bulan',
    persenBagiHasil: 'persen_bagi_hasil',
    omzetBulanan: 'omzet_bulanan',
    noRekening: 'no_rekening',
    ktpFile: 'ktp_pemilik',
    nibFile: 'nib',
    laporanFile: 'laporan_keuangan',
    fotoUsahaFile: 'foto_usaha',
    suratFile: 'surat_perjanjian',
  };

  async function onSubmit(data) {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('nama_usaha', data.namaUsaha);
      formData.append('kategori', data.kategori);
      formData.append('kota', data.kotaUsaha);
      formData.append('tahun_berdiri', data.tahunBerdiri);
      if (data.jumlahKaryawan) formData.append('jumlah_karyawan', data.jumlahKaryawan);
      formData.append('deskripsi', data.deskripsi);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('target_dana', parseCurrencyInput(data.targetDana));
      formData.append('tenor_bulan', data.tenor);
      formData.append('persen_bagi_hasil', data.persenBagiHasil);
      if (data.omzetBulanan) formData.append('omzet_bulanan', parseCurrencyInput(data.omzetBulanan));
      formData.append('bank', data.bank);
      formData.append('no_rekening', data.noRekening);
      formData.append('nib', data.nibFile);
      formData.append('ktp_pemilik', data.ktpFile);
      formData.append('laporan_keuangan', data.laporanFile);
      (Array.isArray(data.fotoUsahaFile) ? data.fotoUsahaFile : [data.fotoUsahaFile]).forEach((f) => {
        formData.append('foto_usaha[]', f);
      });
      formData.append('surat_perjanjian', data.suratFile);

      await api.post('/auth/umkm/register', formData);
      setSubmitted(true);
      toast.success('Pendaftaran usaha terkirim. Menunggu review admin.');
    } catch (err) {
      if (err?.response?.status === 422) {
        const apiErrors = err.response.data?.errors || {};
        const formFields = Object.entries(apiErrors).map(([field, msgs]) => {
          const baseField = field.replace(/\.\d+$|\[\]$/, '');
          const formField = Object.keys(FIELD_MAP).find((k) => FIELD_MAP[k] === baseField) || field;
          setError(formField, { message: msgs[0] });
          return formField;
        });
        // Jump to the earliest step that actually contains an errored field,
        // instead of always step 1 -- otherwise errors on step 2/3 fields
        // are invisible because that step isn't rendered.
        const earliestStep = formFields.reduce((earliest, field) => {
          const stepIndex = STEP_FIELDS.findIndex((fields) => fields.includes(field));
          return stepIndex === -1 ? earliest : Math.min(earliest, stepIndex + 1);
        }, STEP_FIELDS.length);
        setStep(earliestStep);
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
          title="Pendaftaran usaha terkirim!"
          description="Tim kami akan meninjau data dan dokumen usahamu. Setelah disetujui, campaign akan tampil di platform dan bisa mulai menerima investasi."
          infoText="Kami akan mengirim email begitu status pendaftaran berubah"
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
              <div className="text-lg font-extrabold mb-1">Informasi Usaha</div>
              <div className="text-[13px] text-neutral-500 mb-6">Ceritakan tentang usahamu kepada calon investor.</div>

              <Input label="Nama usaha" required placeholder="Contoh: Warung Makan Bu Sari" error={errors.namaUsaha?.message} {...register('namaUsaha')} />
              <div className="grid sm:grid-cols-2 gap-3.5">
                <Select label="Kategori usaha" required error={errors.kategori?.message} {...register('kategori')} defaultValue="">
                  <option value="">Pilih kategori</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
                <Input label="Kota usaha" required placeholder="Contoh: Yogyakarta" error={errors.kotaUsaha?.message} {...register('kotaUsaha')} />
              </div>
              <div className="grid sm:grid-cols-2 gap-3.5">
                <Input label="Tahun berdiri" required type="number" placeholder="Contoh: 2018" error={errors.tahunBerdiri?.message} {...register('tahunBerdiri')} />
                <Input label="Jumlah karyawan" type="number" placeholder="Contoh: 12" {...register('jumlahKaryawan')} />
              </div>
              <TextArea
                label="Deskripsi usaha"
                required
                rows={3}
                placeholder="Ceritakan produk, layanan, dan keunikan usahamu"
                error={errors.deskripsi?.message}
                {...register('deskripsi')}
              />
              <div className="grid sm:grid-cols-2 gap-3.5">
                <Input label="Email pemilik usaha" required type="email" error={errors.email?.message} {...register('email')} />
                <Input label="Kata sandi" required type="password" error={errors.password?.message} {...register('password')} />
              </div>

              <div className="flex justify-end mt-6">
                <Button type="button" onClick={goNext}>
                  Lanjut ke Info Pendanaan <IconArrowRight size={16} />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="text-lg font-extrabold mb-1">Informasi Pendanaan</div>
              <div className="text-[13px] text-neutral-500 mb-6">Tentukan target dana dan skema bagi hasil untuk investor.</div>

              <div className="grid sm:grid-cols-2 gap-3.5">
                <Input
                  label="Target dana"
                  required
                  placeholder="Contoh: 30.000.000"
                  hint="Nominal dalam Rupiah"
                  inputMode="numeric"
                  error={errors.targetDana?.message}
                  value={values.targetDana ? formatNumberInput(values.targetDana) : ''}
                  onChange={(e) =>
                    setValue('targetDana', String(parseCurrencyInput(e.target.value) || ''), { shouldValidate: true })
                  }
                />
                <Input label="Tenor (bulan)" required type="number" placeholder="Contoh: 12" error={errors.tenor?.message} {...register('tenor')} />
              </div>
              <Input
                label="Persentase bagi hasil untuk investor"
                required
                placeholder="Contoh: 30"
                hint="Persentase dari keuntungan bersih bulanan yang dibagikan ke seluruh investor secara proporsional"
                error={errors.persenBagiHasil?.message}
                {...register('persenBagiHasil')}
              />
              <Input
                label="Estimasi omzet bulanan"
                placeholder="Contoh: 85.000.000"
                inputMode="numeric"
                value={values.omzetBulanan ? formatNumberInput(values.omzetBulanan) : ''}
                onChange={(e) => setValue('omzetBulanan', String(parseCurrencyInput(e.target.value) || ''))}
              />

              <div className="text-[13px] font-bold text-neutral-900 mt-2 mb-3">Rekening penerima pencairan modal</div>
              <div className="grid sm:grid-cols-2 gap-3.5">
                <Select label="Bank" required error={errors.bank?.message} {...register('bank')} defaultValue="">
                  <option value="">Pilih bank</option>
                  {BANK_OPTIONS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </Select>
                <Input
                  label="Nomor rekening"
                  required
                  placeholder="Sesuai buku tabungan usaha"
                  error={errors.noRekening?.message}
                  {...register('noRekening')}
                />
              </div>

              <div className="flex justify-between mt-6">
                <Button type="button" variant="ghost" onClick={goBack}>
                  <IconArrowLeft size={16} /> Kembali
                </Button>
                <Button type="button" onClick={goNext}>
                  Lanjut ke Dokumen <IconArrowRight size={16} />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="text-lg font-extrabold mb-1">Dokumen Legalitas &amp; Keuangan</div>
              <div className="text-[13px] text-neutral-500 mb-6">Semua dokumen akan direview tim kami sebelum campaign tampil di platform.</div>

              <div className="grid sm:grid-cols-2 gap-3.5 mb-1">
                <FileUpload
                  label="NIB (Nomor Induk Berusaha)"
                  required
                  icon={IconFileCertificate}
                  hint="PDF atau JPG, maks 5MB"
                  error={errors.nibFile?.message}
                  onChange={(f) => setValue('nibFile', f, { shouldValidate: true })}
                />
                <CameraCapture
                  label="KTP Pemilik Usaha"
                  required
                  facingMode="environment"
                  hint="Gunakan kamera belakang, pastikan seluruh sisi KTP terlihat jelas"
                  error={errors.ktpFile?.message}
                  onChange={(f) => setValue('ktpFile', f, { shouldValidate: true })}
                />
                <FileUpload
                  label="Laporan Keuangan 3 Bulan Terakhir"
                  required
                  icon={IconChartBar}
                  hint="PDF, maks 5MB"
                  error={errors.laporanFile?.message}
                  onChange={(f) => setValue('laporanFile', f, { shouldValidate: true })}
                />
                <FileUpload
                  label="Foto Usaha"
                  required
                  icon={IconPhoto}
                  multiple
                  hint="Bisa lebih dari 1 file, maks 5MB per file"
                  error={errors.fotoUsahaFile?.message}
                  onChange={(f) => setValue('fotoUsahaFile', f, { shouldValidate: true })}
                />
              </div>
              <FileUpload
                label="Surat Perjanjian Bermaterai"
                required
                icon={IconFileText}
                hint="Template bisa diunduh di halaman bantuan — PDF, maks 5MB"
                error={errors.suratFile?.message}
                onChange={(f) => setValue('suratFile', f, { shouldValidate: true })}
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

          {step === 4 && (
            <div>
              <div className="text-lg font-extrabold mb-1">Review Pendaftaran</div>
              <div className="text-[13px] text-neutral-500 mb-6">Periksa kembali data sebelum mengirim ke tim review.</div>

              <div className="bg-neutral-50 rounded p-4 mb-3.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-green-800 uppercase tracking-wide mb-2.5">
                  <IconBuildingStore size={14} /> Info Usaha
                </div>
                {[
                  ['Nama usaha', values.namaUsaha],
                  ['Kategori', values.kategori],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between text-[13px] py-1.5 border-b border-neutral-100 last:border-none">
                    <span className="text-neutral-500">{label}</span>
                    <span className="font-semibold">{val || '—'}</span>
                  </div>
                ))}
              </div>
              <div className="bg-neutral-50 rounded p-4 mb-3.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-green-800 uppercase tracking-wide mb-2.5">
                  <IconCash size={14} /> Pendanaan
                </div>
                <div className="flex justify-between text-[13px] py-1.5 border-b border-neutral-100">
                  <span className="text-neutral-500">Target dana</span>
                  <span className="font-semibold">{values.targetDana ? `Rp ${formatNumberInput(values.targetDana)}` : '—'}</span>
                </div>
                <div className="flex justify-between text-[13px] py-1.5 border-b border-neutral-100">
                  <span className="text-neutral-500">Bagi hasil investor</span>
                  <span className="font-semibold">{values.persenBagiHasil ? `${values.persenBagiHasil}%` : '—'}</span>
                </div>
                <div className="flex justify-between text-[13px] py-1.5">
                  <span className="text-neutral-500">Rekening</span>
                  <span className="font-semibold">{values.bank ? `${values.bank} — ${values.noRekening || ''}` : '—'}</span>
                </div>
              </div>
              <div className="bg-neutral-50 rounded p-4 mb-3.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-green-800 uppercase tracking-wide mb-2.5">
                  <IconFiles size={14} /> Dokumen
                </div>
                {[
                  ['NIB', values.nibFile],
                  ['KTP Pemilik', values.ktpFile],
                  ['Laporan Keuangan', values.laporanFile],
                  ['Foto Usaha', values.fotoUsahaFile],
                  ['Surat Perjanjian', values.suratFile],
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
                Saya menyatakan seluruh data dan dokumen di atas benar, dan menyetujui{' '}
                <a href="#" className="text-green-700 font-semibold">
                  Syarat &amp; Ketentuan
                </a>{' '}
                serta{' '}
                <a href="#" className="text-green-700 font-semibold">
                  Perjanjian Kemitraan
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
