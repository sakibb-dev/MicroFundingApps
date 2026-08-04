<?php

namespace App\Http\Controllers\Api\Umkm;

use App\Http\Controllers\Controller;
use App\Http\Resources\UmkmResource;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $umkm = $request->user()->umkm;
        $periode = Carbon::now()->startOfMonth();
        $deadline = $periode->copy()->addDays(2);

        $currentReport = $umkm->profitReports()->whereDate('periode', $periode)->first();
        $lastProcessed = $umkm->profitReports()->where('status', 'processed')->latest('periode')->first();

        return ApiResponse::success('OK', [
            'umkm' => new UmkmResource($umkm),
            'jumlah_investor' => $umkm->investments()->whereIn('status', ['confirmed', 'active'])->distinct('investor_id')->count('investor_id'),
            'bagi_hasil_bulan_lalu' => $lastProcessed?->total_bagi_hasil_investor ?? 0,
            'periode_berjalan' => $periode->toDateString(),
            'deadline_pengajuan' => $deadline->toDateString(),
            'hari_tersisa' => max(0, (int) Carbon::now()->diffInDays($deadline, false)),
            'sudah_submit_periode_ini' => (bool) $currentReport,
            'riwayat_terakhir' => $umkm->profitReports()->latest('periode')->take(3)->get(['id', 'periode', 'keuntungan_kotor', 'total_bagi_hasil_investor', 'status']),
        ]);
    }
}
