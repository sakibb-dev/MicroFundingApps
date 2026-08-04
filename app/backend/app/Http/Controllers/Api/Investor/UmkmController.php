<?php

namespace App\Http\Controllers\Api\Investor;

use App\Http\Controllers\Controller;
use App\Http\Resources\UmkmResource;
use App\Http\Responses\ApiResponse;
use App\Models\Umkm;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UmkmController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        // Public listing must only ever surface admin-approved campaigns.
        $query = Umkm::publiclyListed()->withCount(['investments as jumlah_investor' => function ($q) {
            $q->whereIn('status', ['confirmed', 'active']);
        }]);

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nama_usaha', 'ilike', "%{$search}%")
                    ->orWhere('kategori', 'ilike', "%{$search}%");
            });
        }

        if ($kategori = $request->query('kategori')) {
            $query->where('kategori', $kategori);
        }

        $umkms = $query->latest()->get();

        return ApiResponse::success('OK', UmkmResource::collection($umkms));
    }

    public function show(Umkm $umkm): JsonResponse
    {
        if ($umkm->status->value !== 'approved') {
            return ApiResponse::error('Data yang kamu cari tidak ditemukan.', null, null, 404);
        }

        $umkm->load(['document', 'investments' => fn ($q) => $q->with('investor.user')->whereIn('status', ['confirmed', 'active'])]);

        return ApiResponse::success('OK', new UmkmResource($umkm));
    }
}
