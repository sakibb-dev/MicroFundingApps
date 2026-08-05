<?php

namespace App\Http\Controllers\Api\Investor;

use App\Http\Controllers\Controller;
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

        $distributions = \App\Models\ProfitDistribution::whereIn('investment_id', $investments->pluck('id'))
            ->with('investment.umkm', 'profitReport')
            ->get();
        $totalBagiHasil = $distributions->where('status', 'processed')->sum('nominal_bagi_hasil');
        $avgReturnPct = $active->avg('persen_kepemilikan');

        // Grouped so each active investment card can show what it has paid
        // out so far, not just its principal -- distributions don't carry
        // their own umkm/nominal context so this can't reuse InvestmentResource.
        $bagiHasilByInvestment = $distributions->where('status', 'processed')
            ->groupBy('investment_id')
            ->map(fn ($rows) => $rows->sum('nominal_bagi_hasil'));

        return ApiResponse::success('OK', [
            'total_investasi_aktif' => $active->sum('nominal'),
            'total_bagi_hasil_diterima' => $totalBagiHasil,
            'umkm_aktif' => $active->pluck('umkm_id')->unique()->count(),
            'return_rata_rata' => $avgReturnPct !== null ? round((float) $avgReturnPct, 2) : 0,
            'investasi_aktif' => $active->values()->map(fn ($inv) => [
                'id' => $inv->id,
                'umkm_id' => $inv->umkm_id,
                'nama_usaha' => $inv->umkm->nama_usaha,
                'kategori' => $inv->umkm->kategori,
                'nominal' => $inv->nominal,
                'persen_kepemilikan' => $inv->persen_kepemilikan !== null ? (float) $inv->persen_kepemilikan : null,
                'status' => $inv->status->value,
                'bagi_hasil_diterima' => $bagiHasilByInvestment->get($inv->id, 0),
            ]),
            'riwayat_bagi_hasil' => $distributions->map(fn ($d) => [
                'id' => $d->id,
                'umkm' => $d->investment?->umkm?->nama_usaha,
                'periode' => $d->profitReport?->periode,
                'nominal' => $d->nominal_bagi_hasil,
                'status' => $d->status->value,
                'tanggal_cair' => $d->tanggal_cair,
            ])->values(),
        ]);
    }
}
