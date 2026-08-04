<?php

namespace App\Models;

use App\Enums\ProfitReportStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProfitReport extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'umkm_id', 'periode', 'keuntungan_kotor', 'biaya_operasional', 'keuntungan_bersih',
        'persen_bagi_hasil_snapshot', 'persen_fee_platform_snapshot', 'total_bagi_hasil_investor',
        'fee_platform', 'total_dibayarkan', 'path_laporan_keuangan', 'catatan', 'status',
        'catatan_admin', 'deadline_at', 'submitted_at', 'approved_by', 'approved_at',
    ];

    protected function casts(): array
    {
        return [
            'periode' => 'date',
            'keuntungan_kotor' => 'integer',
            'biaya_operasional' => 'integer',
            'keuntungan_bersih' => 'integer',
            'persen_bagi_hasil_snapshot' => 'decimal:2',
            'persen_fee_platform_snapshot' => 'decimal:2',
            'total_bagi_hasil_investor' => 'integer',
            'fee_platform' => 'integer',
            'total_dibayarkan' => 'integer',
            'status' => ProfitReportStatus::class,
            'deadline_at' => 'date',
            'submitted_at' => 'datetime',
            'approved_at' => 'datetime',
        ];
    }

    public function umkm(): BelongsTo
    {
        return $this->belongsTo(Umkm::class);
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function distributions(): HasMany
    {
        return $this->hasMany(ProfitDistribution::class);
    }

    public function platformFee(): HasMany
    {
        return $this->hasMany(PlatformFee::class);
    }

    public function scopeSubmitted($query)
    {
        return $query->where('status', ProfitReportStatus::Submitted);
    }

    public function scopeOverdue($query)
    {
        return $query->where('status', ProfitReportStatus::Overdue);
    }
}
