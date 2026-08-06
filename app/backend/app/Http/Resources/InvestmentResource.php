<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvestmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $isAdmin = $request->user()?->role->value === 'admin';

        return [
            'id' => $this->id,
            'investor' => $this->whenLoaded('investor', fn () => [
                'id' => $this->investor->id,
                'nama' => $this->investor->user->name,
                // Only admin needs this -- to actually process a transfer,
                // not for display anywhere an investor or UMKM can see it.
                'rekening' => $this->when($isAdmin, fn () => [
                    'bank' => $this->investor->bank,
                    'no_rekening' => $this->investor->no_rekening,
                ]),
            ]),
            'umkm' => $this->whenLoaded('umkm', fn () => [
                'id' => $this->umkm->id,
                'nama_usaha' => $this->umkm->nama_usaha,
                'kategori' => $this->umkm->kategori,
                'rekening' => $this->when($isAdmin, fn () => [
                    'bank' => $this->umkm->bank,
                    'no_rekening' => $this->umkm->no_rekening,
                ]),
            ]),
            'nominal' => $this->nominal,
            'persen_kepemilikan' => $this->persen_kepemilikan !== null ? (float) $this->persen_kepemilikan : null,
            'status' => $this->status->value,
            'bukti_transfer_path' => $this->when($request->user()?->role->value === 'admin', $this->bukti_transfer_path),
            'confirmed_at' => $this->confirmed_at,
            'forwarded_at' => $this->when($request->user()?->role->value === 'admin', $this->forwarded_at),
            'created_at' => $this->created_at,
        ];
    }
}
