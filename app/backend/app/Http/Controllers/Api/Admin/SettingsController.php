<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\PlatformSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function index(): JsonResponse
    {
        return ApiResponse::success('OK', PlatformSetting::all()->keyBy('key'));
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'bank_name' => ['required', 'string', 'max:100'],
            'bank_account_number' => ['required', 'string', 'max:30'],
            'bank_account_name' => ['required', 'string', 'max:255'],
            'platform_fee_percent' => ['required', 'numeric', 'min:0', 'max:50'],
        ]);

        foreach ($validated as $key => $value) {
            PlatformSetting::set($key, (string) $value);
        }

        return ApiResponse::success('Pengaturan berhasil disimpan.', PlatformSetting::all()->keyBy('key'));
    }
}
