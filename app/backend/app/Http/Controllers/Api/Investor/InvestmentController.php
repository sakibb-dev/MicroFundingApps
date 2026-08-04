<?php

namespace App\Http\Controllers\Api\Investor;

use App\Enums\InvestmentStatus;
use App\Exceptions\FundingSlotInsufficientException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Investor\StoreInvestmentRequest;
use App\Http\Resources\InvestmentResource;
use App\Http\Responses\ApiResponse;
use App\Models\Investment;
use App\Models\Umkm;
use App\Services\DocumentStorageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvestmentController extends Controller
{
    public function __construct(private DocumentStorageService $documents) {}

    public function store(StoreInvestmentRequest $request): JsonResponse
    {
        $data = $request->validated();
        $investor = $request->user()->investor;
        $umkm = Umkm::findOrFail($data['umkm_id']);

        if ($data['nominal'] > $umkm->sisa_slot) {
            throw FundingSlotInsufficientException::forRemainingSlot($umkm->sisa_slot);
        }

        $investment = DB::transaction(function () use ($data, $investor, $umkm, $request) {
            // Uploading proof of transfer only moves the investment to
            // "pending_confirmation" -- it must NOT touch umkm.total_terkumpul
            // yet. That only happens once an admin confirms the transfer.
            $investment = Investment::create([
                'investor_id' => $investor->id,
                'umkm_id' => $umkm->id,
                'nominal' => $data['nominal'],
                'status' => InvestmentStatus::PendingConfirmation,
            ]);

            $investment->bukti_transfer_path = $this->documents->store(
                $request->file('bukti_transfer'),
                'investment',
                $investment->id,
                'bukti_transfer',
            );
            $investment->save();

            return $investment;
        });

        return ApiResponse::success(
            'Bukti transfer terkirim. Kami akan konfirmasi dalam 1x24 jam.',
            new InvestmentResource($investment->load('umkm')),
            201,
        );
    }

    public function index(Request $request): JsonResponse
    {
        $investments = $request->user()->investor->investments()
            ->with('umkm')
            ->latest()
            ->get();

        return ApiResponse::success('OK', InvestmentResource::collection($investments));
    }
}
