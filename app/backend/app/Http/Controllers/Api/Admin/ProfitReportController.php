<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\ProfitDistributionStatus;
use App\Enums\ProfitReportStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RejectRequest;
use App\Http\Responses\ApiResponse;
use App\Models\AppNotification;
use App\Models\PlatformFee;
use App\Models\ProfitReport;
use App\Services\ProfitSharingCalculatorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProfitReportController extends Controller
{
    public function __construct(private ProfitSharingCalculatorService $calculator) {}

    public function index(Request $request): JsonResponse
    {
        $query = ProfitReport::with('umkm')->withCount('distributions');

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        } else {
            $query->submitted();
        }

        return ApiResponse::success('OK', $query->latest('periode')->paginate(15));
    }

    /**
     * Per-investor breakdown with bank details, so an admin can actually
     * process the disbursement transfers -- not returned on index() since
     * every list row loading its own distributions would be N+1.
     */
    public function show(ProfitReport $profitReport): JsonResponse
    {
        $profitReport->load(['umkm', 'distributions.investment.investor.user']);

        return ApiResponse::success('OK', [
            'id' => $profitReport->id,
            'periode' => $profitReport->periode,
            'status' => $profitReport->status->value,
            'keuntungan_kotor' => $profitReport->keuntungan_kotor,
            'biaya_operasional' => $profitReport->biaya_operasional,
            'keuntungan_bersih' => $profitReport->keuntungan_bersih,
            'persen_bagi_hasil_snapshot' => (float) $profitReport->persen_bagi_hasil_snapshot,
            'persen_fee_platform_snapshot' => (float) $profitReport->persen_fee_platform_snapshot,
            'total_bagi_hasil_investor' => $profitReport->total_bagi_hasil_investor,
            'fee_platform' => $profitReport->fee_platform,
            'total_dibayarkan' => $profitReport->total_dibayarkan,
            'catatan' => $profitReport->catatan,
            'umkm' => [
                'id' => $profitReport->umkm->id,
                'nama_usaha' => $profitReport->umkm->nama_usaha,
                'rekening' => ['bank' => $profitReport->umkm->bank, 'no_rekening' => $profitReport->umkm->no_rekening],
            ],
            'distribusi' => $profitReport->distributions->map(fn ($d) => [
                'id' => $d->id,
                'investor_nama' => $d->investment?->investor?->user?->name,
                'rekening' => [
                    'bank' => $d->investment?->investor?->bank,
                    'no_rekening' => $d->investment?->investor?->no_rekening,
                ],
                'persen_kepemilikan' => (float) $d->persen_kepemilikan_snapshot,
                'nominal_bagi_hasil' => $d->nominal_bagi_hasil,
                'status' => $d->status->value,
            ]),
        ]);
    }

    public function approve(Request $request, ProfitReport $profitReport): JsonResponse
    {
        if ($profitReport->status !== ProfitReportStatus::Submitted) {
            return ApiResponse::error('Pengajuan ini sudah diproses sebelumnya.', null, null, 422);
        }

        $distributions = $profitReport->distributions()->with('investment.investor')->get();

        // Re-verify the stored breakdown still reconciles to the stored total
        // before money moves -- defense against tampering or partial writes.
        $this->calculator->assertBreakdownMatchesTotal(
            $distributions->map(fn ($d) => ['nominal_bagi_hasil' => $d->nominal_bagi_hasil])->all(),
            $profitReport->total_bagi_hasil_investor,
        );

        DB::transaction(function () use ($request, $profitReport, $distributions) {
            $profitReport->update([
                'status' => ProfitReportStatus::Processed,
                'approved_by' => $request->user()->id,
                'approved_at' => now(),
            ]);

            PlatformFee::create([
                'profit_report_id' => $profitReport->id,
                'nominal_fee' => $profitReport->fee_platform,
                'periode' => $profitReport->periode,
            ]);

            foreach ($distributions as $distribution) {
                $distribution->update([
                    'status' => ProfitDistributionStatus::Processed,
                    'tanggal_cair' => now(),
                ]);

                AppNotification::create([
                    'user_id' => $distribution->investment->investor->user_id,
                    'tipe' => 'profit_disbursed',
                    'judul' => 'Bagi hasil cair',
                    'deskripsi' => "Rp {$distribution->nominal_bagi_hasil} dari {$profitReport->umkm->nama_usaha} sudah masuk ke rekeningmu.",
                ]);
            }
        });

        $bulan = $profitReport->periode->translatedFormat('F Y');

        return ApiResponse::success(
            "Bagi hasil {$profitReport->umkm->nama_usaha} periode {$bulan} diproses. Distribusi ke {$distributions->count()} investor dimulai."
        );
    }

    public function reject(RejectRequest $request, ProfitReport $profitReport): JsonResponse
    {
        if ($profitReport->status !== ProfitReportStatus::Submitted) {
            return ApiResponse::error('Pengajuan ini sudah diproses sebelumnya.', null, null, 422);
        }

        $alasan = $request->validated('alasan');

        DB::transaction(function () use ($profitReport, $alasan) {
            $profitReport->update(['status' => ProfitReportStatus::Rejected, 'catatan_admin' => $alasan]);
            $profitReport->distributions()->update(['status' => ProfitDistributionStatus::Failed]);

            AppNotification::create([
                'user_id' => $profitReport->umkm->user_id,
                'tipe' => 'profit_report_rejected',
                'judul' => 'Pengajuan bagi hasil ditolak',
                'deskripsi' => "Pengajuan bagi hasil ditolak: {$alasan}.",
            ]);
        });

        return ApiResponse::success('Penolakan pengajuan bagi hasil terkirim.');
    }
}
