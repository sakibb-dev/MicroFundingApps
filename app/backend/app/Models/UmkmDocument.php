<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class UmkmDocument extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'umkm_id', 'path_nib', 'path_laporan_keuangan', 'path_foto_usaha', 'path_surat_perjanjian',
    ];

    protected function casts(): array
    {
        return [
            'path_foto_usaha' => 'array',
        ];
    }

    public function umkm(): BelongsTo
    {
        return $this->belongsTo(Umkm::class);
    }
}
