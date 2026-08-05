<?php

namespace App\Models;

use App\Enums\UmkmStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Umkm extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'nama_usaha', 'kategori', 'kota', 'tahun_berdiri', 'jumlah_karyawan',
        'deskripsi', 'nib', 'target_dana', 'total_terkumpul', 'tenor_bulan',
        'persen_bagi_hasil', 'omzet_bulanan', 'status', 'catatan_admin',
        'bank', 'no_rekening',
    ];

    protected function casts(): array
    {
        return [
            'target_dana' => 'integer',
            'total_terkumpul' => 'integer',
            'omzet_bulanan' => 'integer',
            'persen_bagi_hasil' => 'decimal:2',
            'status' => UmkmStatus::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function document(): HasOne
    {
        return $this->hasOne(UmkmDocument::class);
    }

    public function investments(): HasMany
    {
        return $this->hasMany(Investment::class);
    }

    public function profitReports(): HasMany
    {
        return $this->hasMany(ProfitReport::class);
    }

    public function scopeApproved($query)
    {
        return $query->where('status', UmkmStatus::Approved);
    }

    public function scopePending($query)
    {
        return $query->where('status', UmkmStatus::Pending);
    }

    /** Public campaign listing must only ever show approved UMKM. */
    public function scopePubliclyListed($query)
    {
        return $query->approved();
    }

    protected function sisaSlot(): \Illuminate\Database\Eloquent\Casts\Attribute
    {
        return \Illuminate\Database\Eloquent\Casts\Attribute::make(
            get: fn () => max(0, $this->target_dana - $this->total_terkumpul),
        );
    }

    protected function persenTerkumpul(): \Illuminate\Database\Eloquent\Casts\Attribute
    {
        return \Illuminate\Database\Eloquent\Casts\Attribute::make(
            get: fn () => $this->target_dana > 0
                ? round(min(100, ($this->total_terkumpul / $this->target_dana) * 100), 1)
                : 0.0,
        );
    }
}
