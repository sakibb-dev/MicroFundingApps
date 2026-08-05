<?php

namespace Database\Seeders;

use App\Models\PlatformSetting;
use Illuminate\Database\Seeder;

class PlatformSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            [
                'key' => 'bank_name',
                'value' => 'Bank BCA',
                'type' => 'string',
                'label' => 'Nama Bank',
                'description' => 'Bank rekening penerima dana platform (investasi masuk & bagi hasil dari UMKM).',
            ],
            [
                'key' => 'bank_account_number',
                'value' => '1234567890',
                'type' => 'string',
                'label' => 'Nomor Rekening',
                'description' => 'Nomor rekening tujuan transfer investor & UMKM.',
            ],
            [
                'key' => 'bank_account_name',
                'value' => 'PT MicroInvest Nusantara',
                'type' => 'string',
                'label' => 'Nama Pemilik Rekening',
                'description' => 'Nama sesuai buku tabungan.',
            ],
            [
                'key' => 'platform_fee_percent',
                'value' => '5',
                'type' => 'number',
                'label' => 'Fee Platform (%)',
                'description' => 'Persentase fee dipotong dari keuntungan bersih UMKM saat distribusi bagi hasil (bukan dari modal investasi).',
            ],
        ];

        foreach ($settings as $setting) {
            PlatformSetting::firstOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
