<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UmkmResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nama_usaha' => $this->nama_usaha,
            'kategori' => $this->kategori,
            'kota' => $this->kota,
            'tahun_berdiri' => $this->tahun_berdiri,
            'jumlah_karyawan' => $this->jumlah_karyawan,
            'deskripsi' => $this->deskripsi,
            'target_dana' => $this->target_dana,
            'total_terkumpul' => $this->total_terkumpul,
            'sisa_slot' => $this->sisa_slot,
            'persen_terkumpul' => $this->persen_terkumpul,
            'tenor_bulan' => $this->tenor_bulan,
            'persen_bagi_hasil' => (float) $this->persen_bagi_hasil,
            'omzet_bulanan' => $this->omzet_bulanan,
            'status' => $this->status->value,
            'jumlah_investor' => $this->when(
                $this->relationLoaded('investments'),
                fn () => $this->investments->whereIn('status', ['confirmed', 'active'])->pluck('investor_id')->unique()->count(),
            ),
            'dokumen' => $this->whenLoaded('document', fn () => [
                'nib' => $this->document->path_nib,
                'ktp_pemilik' => $this->document->path_ktp_pemilik,
                'laporan_keuangan' => $this->document->path_laporan_keuangan,
                'foto_usaha' => $this->document->path_foto_usaha,
                'surat_perjanjian' => $this->document->path_surat_perjanjian,
            ]),
            'daftar_investor' => $this->whenLoaded('investments', fn () => $this->investments
                ->whereIn('status', ['confirmed', 'active'])
                ->map(fn ($inv) => [
                    'nama' => $inv->investor_name_masked,
                    'nominal' => $inv->nominal,
                    'persen_kepemilikan' => (float) $inv->persen_kepemilikan,
                    'tanggal' => $inv->confirmed_at?->toDateString(),
                ])->values()),
            // Private account details -- only the UMKM owner or an admin
            // ever needs this (admin to send funds, owner to manage it).
            // Never exposed to investors browsing campaigns.
            'rekening' => $this->when(
                $request->user()?->role->value === 'admin' || $request->user()?->id === $this->user_id,
                fn () => ['bank' => $this->bank, 'no_rekening' => $this->no_rekening],
            ),
            'created_at' => $this->created_at,
        ];
    }
}
