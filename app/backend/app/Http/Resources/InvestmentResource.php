<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvestmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'investor' => $this->whenLoaded('investor', fn () => [
                'id' => $this->investor->id,
                'nama' => $this->investor->user->name,
            ]),
            'umkm' => $this->whenLoaded('umkm', fn () => [
                'id' => $this->umkm->id,
                'nama_usaha' => $this->umkm->nama_usaha,
                'kategori' => $this->umkm->kategori,
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
