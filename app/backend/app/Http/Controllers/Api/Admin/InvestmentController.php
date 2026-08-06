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
use App\Models\Umkm;
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

        $paginator = $query->latest()->paginate(15);
        $paginator->through(fn (Investment $inv) => (new InvestmentResource($inv))->resolve($request));

        return ApiResponse::success('OK', $paginator);
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
                'confirmed_by' => $request->user()->id,
                'confirmed_at' => now(),
            ]);

            // Recompute EVERY confirmed/active investor's share against the
            // new total, not just this one -- persen_kepemilikan is a
            // snapshot, so leaving earlier investors' rows untouched would
            // freeze them at whatever the pool looked like when they
            // themselves were confirmed (e.g. 100% if they were first).
            $this->recalculateOwnership($umkm);

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

    /**
     * Records that the admin has manually wired the confirmed capital on to
     * the UMKM's bank account -- this leg happens outside the app (there's
     * no payment gateway), this just closes the audit trail for it.
     */
    public function forward(Request $request, Investment $investment): JsonResponse
    {
        if ($investment->status !== InvestmentStatus::Confirmed) {
            return ApiResponse::error('Investasi ini belum dikonfirmasi atau sudah diteruskan sebelumnya.', null, null, 422);
        }

        $request->validate(['catatan' => ['nullable', 'string', 'max:1000']]);

        $investment->update([
            'status' => InvestmentStatus::Active,
            'forwarded_at' => now(),
            'admin_notes' => $request->input('catatan'),
        ]);

        return ApiResponse::success('Dana berhasil dicatat sebagai diteruskan ke UMKM.');
    }

    /**
     * ownership % = nominal / total dana terkumpul (never target_dana --
     * see MICROINVEST_CONTEXT.md section 3 and ProfitSharingCalculatorService,
     * which computes each investor's payout share the same way).
     */
    private function recalculateOwnership(Umkm $umkm): void
    {
        if ($umkm->total_terkumpul <= 0) {
            return;
        }

        Investment::where('umkm_id', $umkm->id)
            ->whereIn('status', ['confirmed', 'active'])
            ->get()
            ->each(fn (Investment $inv) => $inv->update([
                'persen_kepemilikan' => round(($inv->nominal / $umkm->total_terkumpul) * 100, 3),
            ]));
    }
}
