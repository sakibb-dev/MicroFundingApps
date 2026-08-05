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

        return ApiResponse::success('OK', $query->latest('periode')->get());
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
