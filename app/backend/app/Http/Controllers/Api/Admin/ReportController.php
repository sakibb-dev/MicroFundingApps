<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\Investment;
use App\Models\PlatformFee;
use App\Models\ProfitReport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class ReportController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $monthlyFees = PlatformFee::selectRaw("to_char(periode, 'YYYY-MM') as bulan, SUM(nominal_fee) as total")
            ->where('periode', '>=', Carbon::now()->subMonths(5)->startOfMonth())
            ->groupBy('bulan')
            ->orderBy('bulan')
            ->get();

        return ApiResponse::success('OK', [
            'total_transaksi_masuk' => Investment::whereIn('status', ['confirmed', 'active'])->sum('nominal'),
            'total_bagi_hasil_diproses' => ProfitReport::where('status', 'processed')->sum('total_bagi_hasil_investor'),
            'fee_terkumpul' => PlatformFee::sum('nominal_fee'),
            'fee_per_bulan' => $monthlyFees,
        ]);
    }
}
