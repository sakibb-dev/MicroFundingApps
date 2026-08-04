<?php

namespace App\Http\Resources;

use App\Enums\UserRole;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role->value,
            'kyc_status' => $this->when(
                $this->role === UserRole::Investor,
                fn () => $this->investor?->kyc_status?->value,
            ),
            'umkm_status' => $this->when(
                $this->role === UserRole::Umkm,
                fn () => $this->umkm?->status?->value,
            ),
        ];
    }
}
