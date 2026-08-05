<?php

namespace App\Http\Controllers\Api\Umkm;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\PlatformSetting;
use Illuminate\Http\JsonResponse;

class PlatformInfoController extends Controller
{
    /**
     * Fee percent used for the live preview on the Pengajuan Bagi Hasil form.
     * The authoritative number is still computed server-side on submit by
     * ProfitSharingCalculatorService -- this just keeps the preview honest
     * if an admin changes the rate via Settings.
     */
    public function feeInfo(): JsonResponse
    {
        return ApiResponse::success('OK', [
            'fee_platform_percent' => (float) PlatformSetting::get('platform_fee_percent', config('microinvest.fee_platform_percent', 5.0)),
        ]);
    }
}
