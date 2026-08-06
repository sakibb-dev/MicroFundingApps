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

        // The Pengajuan Bagi Hasil breakdown preview needs the FULL list to
        // reconcile its totals (it can't just show page 1 and claim the
        // remainder), so it requests a high per_page to opt out of paging
        // -- capped so it can't be abused as an unbounded query.
        $perPage = min((int) $request->query('per_page', 15), 500);

        $investors = $umkm->investments()
            ->whereIn('status', ['confirmed', 'active'])
            ->with('investor.user')
            ->latest('confirmed_at')
            ->paginate($perPage)
            ->through(fn ($inv) => [
                'nama' => $inv->investor_name_masked,
                'nominal' => $inv->nominal,
                'persen_kepemilikan' => (float) $inv->persen_kepemilikan,
                'tanggal_investasi' => $inv->confirmed_at?->toDateString(),
            ]);

        return ApiResponse::success('OK', $investors);
    }
}
