<?php

namespace App\Http\Controllers\Api\Investor;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $investor = $request->user()->investor;

        return ApiResponse::success('OK', [
            'nama_lengkap' => $request->user()->name,
            'email' => $request->user()->email,
            'no_hp' => $investor->no_hp,
            'kota_domisili' => $investor->kota_domisili,
            'bank' => $investor->bank,
            'no_rekening' => $investor->no_rekening,
            'kyc_status' => $investor->kyc_status->value,
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'no_hp' => ['sometimes', 'string', 'min:8', 'max:20'],
            'kota_domisili' => ['sometimes', 'string', 'max:255'],
            'bank' => ['sometimes', 'nullable', 'string', 'max:100'],
            'no_rekening' => ['sometimes', 'nullable', 'string', 'max:50'],
        ]);

        $request->user()->investor->update($data);

        return ApiResponse::success('Perubahan tersimpan.');
    }
}
