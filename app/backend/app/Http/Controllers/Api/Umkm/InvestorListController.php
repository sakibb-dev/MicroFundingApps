<?php

namespace App\Http\Controllers\Api\Umkm;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InvestorListController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $umkm = $request->user()->umkm;

        $investors = $umkm->investments()
            ->whereIn('status', ['confirmed', 'active'])
            ->with('investor.user')
            ->latest('confirmed_at')
            ->get()
            ->map(fn ($inv) => [
                'nama' => $inv->investor_name_masked,
                'nominal' => $inv->nominal,
                'persen_kepemilikan' => (float) $inv->persen_kepemilikan,
                'tanggal_investasi' => $inv->confirmed_at?->toDateString(),
            ]);

        return ApiResponse::success('OK', $investors);
    }
}
