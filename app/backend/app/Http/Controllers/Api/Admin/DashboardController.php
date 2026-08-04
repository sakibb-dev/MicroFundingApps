<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\Investment;
use App\Models\Investor;
use App\Models\ProfitReport;
use App\Models\Umkm;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return ApiResponse::success('OK', [
            'total_umkm_aktif' => Umkm::approved()->count(),
            'total_investor_terverifikasi' => Investor::kycApproved()->count(),
            'dana_beredar' => Umkm::approved()->sum('total_terkumpul'),
            'pending_kyc' => Investor::kycPending()->count(),
            'pending_transfer' => Investment::pendingConfirmation()->count(),
            'fee_platform_bulan_ini' => \App\Models\PlatformFee::whereMonth('periode', now()->month)
                ->whereYear('periode', now()->year)
                ->sum('nominal_fee'),
        ]);
    }
}
