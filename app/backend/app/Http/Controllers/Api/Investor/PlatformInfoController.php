<?php

namespace App\Http\Controllers\Api\Investor;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\PlatformSetting;
use Illuminate\Http\JsonResponse;

class PlatformInfoController extends Controller
{
    /**
     * Bank account investors transfer investment funds to. Deliberately
     * exposes only the destination account, not the fee percent or any
     * other admin-only setting.
     */
    public function bankInfo(): JsonResponse
    {
        return ApiResponse::success('OK', [
            'bank' => PlatformSetting::get('bank_name'),
            'nomor' => PlatformSetting::get('bank_account_number'),
            'atas_nama' => PlatformSetting::get('bank_account_name'),
        ]);
    }
}
