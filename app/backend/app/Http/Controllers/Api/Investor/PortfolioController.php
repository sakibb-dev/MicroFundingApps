<?php

namespace App\Http\Controllers\Api\Investor;

use App\Http\Controllers\Controller;
use App\Http\Resources\InvestmentResource;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PortfolioController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $investor = $request->user()->investor;
        $investments = $investor->investments()->with('umkm')->get();
        $active = $investments->whereIn('status', ['confirmed', 'active']);

        $distributions = \App\Models\ProfitDistribution::whereIn('investment_id', $investments->pluck('id'))->get();
        $totalBagiHasil = $distributions->where('status', 'processed')->sum('nominal_bagi_hasil');
        $avgReturnPct = $active->avg('persen_kepemilikan');

        return ApiResponse::success('OK', [
            'total_investasi_aktif' => $active->sum('nominal'),
            'total_bagi_hasil_diterima' => $totalBagiHasil,
            'umkm_aktif' => $active->pluck('umkm_id')->unique()->count(),
            'investasi_aktif' => InvestmentResource::collection($active->values()),
            'riwayat_bagi_hasil' => $distributions->map(fn ($d) => [
                'id' => $d->id,
                'nominal' => $d->nominal_bagi_hasil,
                'status' => $d->status->value,
                'tanggal_cair' => $d->tanggal_cair,
            ])->values(),
        ]);
    }
}
