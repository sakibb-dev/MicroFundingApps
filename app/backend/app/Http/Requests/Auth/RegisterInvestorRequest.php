<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterInvestorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama_lengkap' => ['required', 'string', 'min:3', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'no_hp' => ['required', 'string', 'min:8', 'max:20'],
            'tanggal_lahir' => ['required', 'date', 'before:today'],
            'kota_domisili' => ['required', 'string', 'max:255'],
            'alamat' => ['required', 'string'],
            'no_ktp' => ['required', 'string', 'max:32', 'unique:investors,no_ktp'],
            'ktp' => ['required', 'file', 'mimes:jpg,jpeg,png', 'max:5120'],
            'selfie' => ['required', 'file', 'mimes:jpg,jpeg,png', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'nama_lengkap.required' => 'Nama lengkap wajib diisi',
            'email.required' => 'Masukkan email yang valid',
            'email.email' => 'Masukkan email yang valid',
            'email.unique' => 'Email ini sudah terdaftar',
            'password.min' => 'Kata sandi minimal 8 karakter',
            'no_hp.required' => 'Nomor HP wajib diisi',
            'tanggal_lahir.required' => 'Tanggal lahir wajib diisi',
            'kota_domisili.required' => 'Kota domisili wajib diisi',
            'alamat.required' => 'Alamat lengkap wajib diisi',
            'no_ktp.required' => 'Nomor KTP wajib diisi',
            'no_ktp.unique' => 'Nomor KTP ini sudah terdaftar',
            'ktp.required' => 'Foto KTP wajib diupload',
            'ktp.mimes' => 'Format file harus JPG atau PNG',
            'ktp.max' => 'Ukuran file maksimal 5MB. Kompres dulu atau pilih file lain.',
            'selfie.required' => 'Selfie wajib diupload',
            'selfie.mimes' => 'Format file harus JPG atau PNG',
            'selfie.max' => 'Ukuran file maksimal 5MB. Kompres dulu atau pilih file lain.',
        ];
    }
}
