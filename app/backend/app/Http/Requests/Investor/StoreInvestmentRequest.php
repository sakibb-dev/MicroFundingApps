<?php

namespace App\Http\Requests\Investor;

use Illuminate\Foundation\Http\FormRequest;

class StoreInvestmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'umkm_id' => ['required', 'integer', 'exists:umkms,id'],
            'nominal' => ['required', 'integer', 'min:500000'],
            'bukti_transfer' => ['required', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'nominal.required' => 'Nominal investasi wajib diisi',
            'nominal.min' => 'Nominal investasi minimal Rp 500.000',
            'bukti_transfer.required' => 'Upload bukti transfer sebelum mengirim',
            'bukti_transfer.mimes' => 'Format file harus JPG, PNG, atau PDF.',
            'bukti_transfer.max' => 'Ukuran file maksimal 5MB. Kompres dulu atau pilih file lain.',
        ];
    }
}
