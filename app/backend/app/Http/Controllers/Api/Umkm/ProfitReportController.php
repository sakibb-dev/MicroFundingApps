<?php

namespace App\Http\Controllers\Api\Umkm;

use App\Enums\ProfitReportStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Umkm\StoreProfitReportRequest;
use App\Http\Responses\ApiResponse;
use App\Models\ProfitDistribution;
use App\Models\ProfitReport;
use App\Services\DocumentStorageService;
use App\Services\ProfitSharingCalculatorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ProfitReportController extends Controller
{
    public function __construct(
        private ProfitSharingCalculatorService $calculator,
        private DocumentStorageService $documents,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $reports = $request->user()->umkm->profitReports()->latest('periode')->get();

        return ApiResponse::success('OK', $reports);
    }

    public function store(StoreProfitReportRequest $request): JsonResponse
    {
        $data = $request->validated();
        $umkm = $request->user()->umkm;
        $periode = Carbon::now()->startOfMonth();

        if ($umkm->profitReports()->whereDate('periode', $periode)->whereIn('status', ['submitted', 'approved', 'processed'])->exists()) {
            throw ValidationException::withMessages([
                'periode' => ['Pengajuan bagi hasil untuk periode ini sudah dikirim.'],
            ]);
        }

        $investments = $umkm->investments()->whereIn('status', ['confirmed', 'active'])->get(['id', 'nominal']);
        $feePlatformPercent = (float) config('microinvest.fee_platform_percent', 5.0);

        $result = $this->calculator->calculate(
            keuntunganKotor: $data['keuntungan_kotor'],
            biayaOperasional: $data['biaya_operasional'],
            persenBagiHasil: (float) $umkm->persen_bagi_hasil,
            persenFeePlatform: $feePlatformPercent,
            investments: $investments->map(fn ($inv) => ['investment_id' => $inv->id, 'nominal' => $inv->nominal])->all(),
            totalDanaTerkumpul: $umkm->total_terkumpul,
        );

        // Guard against float drift before anything is persisted.
        $this->calculator->assertBreakdownMatchesTotal($result['breakdown'], $result['total_bagi_hasil_investor']);

        $report = DB::transaction(function () use ($umkm, $periode, $data, $result, $feePlatformPercent, $request) {
            $report = ProfitReport::create([
                'umkm_id' => $umkm->id,
                'periode' => $periode,
                'keuntungan_kotor' => $data['keuntungan_kotor'],
                'biaya_operasional' => $data['biaya_operasional'],
                'keuntungan_bersih' => $result['keuntungan_bersih'],
                'persen_bagi_hasil_snapshot' => $umkm->persen_bagi_hasil,
                'persen_fee_platform_snapshot' => $feePlatformPercent,
                'total_bagi_hasil_investor' => $result['total_bagi_hasil_investor'],
                'fee_platform' => $result['fee_platform'],
                'total_dibayarkan' => $result['total_dibayarkan'],
                'catatan' => $data['catatan'] ?? null,
                'status' => ProfitReportStatus::Submitted,
                'deadline_at' => $periode->copy()->addDays(2),
                'submitted_at' => now(),
            ]);

            $report->path_laporan_keuangan = $this->documents->store(
                $request->file('laporan_keuangan'),
                'profit_report',
                $report->id,
                'laporan_keuangan',
            );
            $report->save();

            // Persist what was submitted -- NOT computed on-the-fly at approve
            // time -- so there's an audit trail of what was requested vs approved.
            foreach ($result['breakdown'] as $row) {
                ProfitDistribution::create([
                    'profit_report_id' => $report->id,
                    'investment_id' => $row['investment_id'],
                    'nominal_bagi_hasil' => $row['nominal_bagi_hasil'],
                    'persen_kepemilikan_snapshot' => $row['persen_kepemilikan'],
                    'status' => 'pending',
                ]);
            }

            return $report;
        });

        return ApiResponse::success(
            "Pengajuan bagi hasil periode {$periode->translatedFormat('F Y')} terkirim. Menunggu review admin.",
            $report,
            201,
        );
    }
}
