<?php

namespace App\Http\Requests\Umkm;

use Illuminate\Foundation\Http\FormRequest;

class StoreProfitReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'keuntungan_kotor' => ['required', 'integer', 'min:0'],
            'biaya_operasional' => ['required', 'integer', 'min:0'],
            'laporan_keuangan' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
            'catatan' => ['nullable', 'string', 'max:1000'],
            'konfirmasi' => ['accepted'],
        ];
    }

    public function messages(): array
    {
        return [
            'keuntungan_kotor.required' => 'Isi keuntungan kotor bulan ini dengan angka yang valid.',
            'keuntungan_kotor.integer' => 'Isi keuntungan kotor bulan ini dengan angka yang valid.',
            'biaya_operasional.required' => 'Isi biaya operasional dengan angka yang valid.',
            'laporan_keuangan.required' => 'Upload laporan keuangan sebelum submit pengajuan.',
            'konfirmasi.accepted' => 'Konfirmasi bahwa data di atas benar sebelum mengirim.',
        ];
    }
}
