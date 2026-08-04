<?php

namespace App\Models;

use App\Enums\KycStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Investor extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'no_ktp', 'tanggal_lahir', 'no_hp', 'kota_domisili',
        'alamat', 'bank', 'no_rekening', 'kyc_status',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_lahir' => 'date',
            'kyc_status' => KycStatus::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function kycDocuments(): HasMany
    {
        return $this->hasMany(KycDocument::class);
    }

    public function investments(): HasMany
    {
        return $this->hasMany(Investment::class);
    }

    public function scopeKycApproved($query)
    {
        return $query->where('kyc_status', KycStatus::Approved);
    }

    public function scopeKycPending($query)
    {
        return $query->where('kyc_status', KycStatus::Pending);
    }

    public function isKycApproved(): bool
    {
        return $this->kyc_status === KycStatus::Approved;
    }
}
