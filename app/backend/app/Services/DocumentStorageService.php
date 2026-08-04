<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * Stores sensitive documents (KTP, selfie, NIB, laporan keuangan, bukti
 * transfer, ...) on the private 'local' disk (storage/app/private — never
 * publicly reachable), using a collision-proof, audit-friendly naming
 * convention: {model}_{id}_{tipe}_{timestamp}.{ext}
 */
class DocumentStorageService
{
    public function store(UploadedFile $file, string $model, int|string $id, string $tipe): string
    {
        $filename = sprintf(
            '%s_%s_%s_%d.%s',
            $model,
            $id,
            $tipe,
            now()->timestamp,
            $file->getClientOriginalExtension(),
        );

        return $file->storeAs("{$model}/{$tipe}", $filename, 'local');
    }

    /**
     * @param  UploadedFile[]  $files
     * @return string[]
     */
    public function storeMany(array $files, string $model, int|string $id, string $tipe): array
    {
        return array_values(array_map(
            fn (UploadedFile $file, int $index) => $this->store($file, $model, $id, "{$tipe}_{$index}"),
            $files,
            array_keys($files),
        ));
    }
}
