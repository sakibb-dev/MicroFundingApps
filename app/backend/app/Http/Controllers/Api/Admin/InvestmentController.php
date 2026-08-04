<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\InvestmentStatus;
use App\Exceptions\FundingSlotInsufficientException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RejectRequest;
use App\Http\Resources\InvestmentResource;
use App\Http\Responses\ApiResponse;
use App\Models\AppNotification;
use App\Models\Investment;
use App\Services\InvoiceGeneratorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvestmentController extends Controller
{
    public function __construct(private InvoiceGeneratorService $invoices) {}

    public function index(Request $request): JsonResponse
    {
        $query = Investment::with(['investor.user', 'umkm']);

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        } else {
            $query->pendingConfirmation();
        }

        return ApiResponse::success('OK', InvestmentResource::collection($query->latest()->get()));
    }

    public function confirm(Request $request, Investment $investment): JsonResponse
    {
        if ($investment->status !== InvestmentStatus::PendingConfirmation) {
            return ApiResponse::error('Investasi ini sudah diproses sebelumnya.', null, null, 422);
        }

        $umkm = $investment->umkm;
        if ($investment->nominal > $umkm->sisa_slot) {
            throw FundingSlotInsufficientException::forRemainingSlot($umkm->sisa_slot);
        }

        DB::transaction(function () use ($request, $investment, $umkm) {
            $umkm->increment('total_terkumpul', $investment->nominal);
            $umkm->refresh();

            $investment->update([
                'status' => InvestmentStatus::Confirmed,
                'persen_kepemilikan' => $umkm->total_terkumpul > 0
                    ? round(($investment->nominal / $umkm->total_terkumpul) * 100, 3)
                    : 0,
                'confirmed_by' => $request->user()->id,
                'confirmed_at' => now(),
            ]);

            $this->invoices->generate($investment);

            AppNotification::create([
                'user_id' => $investment->investor->user_id,
                'tipe' => 'investment_confirmed',
                'judul' => 'Investasi dikonfirmasi',
                'deskripsi' => "Investasimu ke {$umkm->nama_usaha} sudah dikonfirmasi. Invoice terkirim ke emailmu.",
            ]);
        });

        return ApiResponse::success('Transfer investasi dikonfirmasi. Invoice otomatis dikirim ke investor.');
    }

    public function reject(RejectRequest $request, Investment $investment): JsonResponse
    {
        if ($investment->status !== InvestmentStatus::PendingConfirmation) {
            return ApiResponse::error('Investasi ini sudah diproses sebelumnya.', null, null, 422);
        }

        $alasan = $request->validated('alasan');

        DB::transaction(function () use ($investment, $alasan) {
            $investment->update(['status' => InvestmentStatus::Rejected, 'catatan_admin' => $alasan]);

            AppNotification::create([
                'user_id' => $investment->investor->user_id,
                'tipe' => 'investment_rejected',
                'judul' => 'Bukti transfer ditolak',
                'deskripsi' => "Bukti transfer investasimu ke {$investment->umkm->nama_usaha} ditolak: {$alasan}.",
            ]);
        });

        return ApiResponse::success('Investasi ditolak.');
    }
}
