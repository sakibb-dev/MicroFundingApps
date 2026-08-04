<?php

namespace App\Models;

use App\Enums\ProfitDistributionStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProfitDistribution extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'profit_report_id', 'investment_id', 'nominal_bagi_hasil',
        'persen_kepemilikan_snapshot', 'status', 'tanggal_cair',
    ];

    protected function casts(): array
    {
        return [
            'nominal_bagi_hasil' => 'integer',
            'persen_kepemilikan_snapshot' => 'decimal:3',
            'status' => ProfitDistributionStatus::class,
            'tanggal_cair' => 'datetime',
        ];
    }

    public function profitReport(): BelongsTo
    {
        return $this->belongsTo(ProfitReport::class);
    }

    public function investment(): BelongsTo
    {
        return $this->belongsTo(Investment::class);
    }
}
