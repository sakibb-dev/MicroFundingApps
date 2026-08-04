<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PlatformFee extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['profit_report_id', 'nominal_fee', 'periode'];

    protected function casts(): array
    {
        return [
            'nominal_fee' => 'integer',
            'periode' => 'date',
        ];
    }

    public function profitReport(): BelongsTo
    {
        return $this->belongsTo(ProfitReport::class);
    }
}
