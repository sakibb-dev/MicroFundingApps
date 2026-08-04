<?php

namespace App\Http\Controllers\Api\Umkm;

use App\Http\Controllers\Controller;
use App\Http\Resources\UmkmResource;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        return ApiResponse::success('OK', new UmkmResource($request->user()->umkm));
    }

    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nama_usaha' => ['sometimes', 'string', 'min:3', 'max:255'],
            'kategori' => ['sometimes', 'string', 'max:100'],
            'kota' => ['sometimes', 'string', 'max:255'],
            'deskripsi' => ['sometimes', 'string', 'min:10'],
        ]);

        $request->user()->umkm->update($data);

        return ApiResponse::success('Perubahan tersimpan.');
    }
}
