<?php

namespace App\Models;

use App\Enums\InvestmentStatus;
use App\Support\NameMasker;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Investment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'investor_id', 'umkm_id', 'nominal', 'persen_kepemilikan', 'status',
        'bukti_transfer_path', 'catatan_admin', 'confirmed_by', 'confirmed_at',
        'forwarded_at', 'admin_notes',
    ];

    protected function casts(): array
    {
        return [
            'nominal' => 'integer',
            'persen_kepemilikan' => 'decimal:3',
            'status' => InvestmentStatus::class,
            'confirmed_at' => 'datetime',
            'forwarded_at' => 'datetime',
        ];
    }

    public function investor(): BelongsTo
    {
        return $this->belongsTo(Investor::class);
    }

    public function umkm(): BelongsTo
    {
        return $this->belongsTo(Umkm::class);
    }

    public function confirmedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'confirmed_by');
    }

    public function invoice(): HasOne
    {
        return $this->hasOne(Invoice::class);
    }

    public function profitDistributions(): HasMany
    {
        return $this->hasMany(ProfitDistribution::class);
    }

    public function scopePendingConfirmation($query)
    {
        return $query->where('status', InvestmentStatus::PendingConfirmation);
    }

    public function scopeActive($query)
    {
        return $query->whereIn('status', [InvestmentStatus::Confirmed, InvestmentStatus::Active]);
    }

    /** Investor name, masked — safe to expose on a UMKM's public investor list. */
    protected function investorNameMasked(): Attribute
    {
        return Attribute::make(
            get: fn () => NameMasker::mask($this->investor?->user?->name ?? ''),
        );
    }
}
