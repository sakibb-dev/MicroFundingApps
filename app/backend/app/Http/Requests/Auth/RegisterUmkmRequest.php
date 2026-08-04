<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterUmkmRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama_usaha' => ['required', 'string', 'min:3', 'max:255'],
            'kategori' => ['required', 'string', 'max:100'],
            'kota' => ['required', 'string', 'max:255'],
            'tahun_berdiri' => ['nullable', 'integer', 'min:1900', 'max:'.date('Y')],
            'jumlah_karyawan' => ['nullable', 'integer', 'min:0'],
            'deskripsi' => ['required', 'string', 'min:10'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'target_dana' => ['required', 'integer', 'min:500000'],
            'tenor_bulan' => ['required', 'integer', 'min:1', 'max:60'],
            'persen_bagi_hasil' => ['required', 'numeric', 'min:1', 'max:100'],
            'omzet_bulanan' => ['nullable', 'integer', 'min:0'],
            'nib' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
            'ktp_pemilik' => ['required', 'file', 'mimes:jpg,jpeg,png', 'max:5120'],
            'laporan_keuangan' => ['required', 'file', 'mimes:pdf', 'max:5120'],
            'foto_usaha' => ['required', 'array', 'min:1'],
            'foto_usaha.*' => ['file', 'mimes:jpg,jpeg,png', 'max:5120'],
            'surat_perjanjian' => ['required', 'file', 'mimes:pdf', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'nama_usaha.required' => 'Nama usaha wajib diisi',
            'kategori.required' => 'Pilih kategori usaha',
            'kota.required' => 'Kota usaha wajib diisi',
            'deskripsi.required' => 'Deskripsi usaha wajib diisi',
            'email.required' => 'Masukkan email yang valid',
            'email.unique' => 'Email ini sudah terdaftar',
            'password.min' => 'Kata sandi minimal 8 karakter',
            'target_dana.required' => 'Target dana wajib diisi',
            'target_dana.min' => 'Target dana minimal Rp 500.000',
            'tenor_bulan.required' => 'Tenor wajib diisi',
            'persen_bagi_hasil.required' => 'Persentase bagi hasil wajib diisi',
            'nib.required' => 'NIB wajib diupload',
            'ktp_pemilik.required' => 'KTP pemilik wajib diupload',
            'laporan_keuangan.required' => 'Upload laporan keuangan sebelum submit pengajuan.',
            'foto_usaha.required' => 'Foto usaha wajib diupload',
            'surat_perjanjian.required' => 'Surat perjanjian wajib diupload',
            '*.mimes' => 'Format file harus JPG, PNG, atau PDF.',
            '*.max' => 'Ukuran file maksimal 5MB. Kompres dulu atau pilih file lain.',
        ];
    }
}
