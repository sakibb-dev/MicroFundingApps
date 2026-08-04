<?php

namespace App\Services;

use App\Exceptions\BreakdownMismatchException;
use App\Exceptions\NegativeNetProfitException;

/**
 * Pure calculation service for the monthly profit-sharing formula
 * (see MICROINVEST_CONTEXT.md section 3). Contains no I/O — every input is
 * passed in and every output is returned, so it can be unit tested without
 * touching the database.
 *
 * Formula:
 *   Keuntungan Bersih         = Keuntungan Kotor - Biaya Operasional
 *   Total Bagi Hasil Investor = Keuntungan Bersih x % Bagi Hasil
 *   Bagi Hasil per Investor   = (Nominal Investasi / Total Dana Terkumpul) x Total Bagi Hasil Investor
 *   Fee Platform               = Keuntungan Bersih x % Fee Platform
 *   Total Dibayarkan UMKM      = Total Bagi Hasil Investor + Fee Platform
 *
 * All monetary values are integers (rupiah) — never floats — to avoid
 * floating point drift. The per-investor breakdown reconciles exactly to
 * total_bagi_hasil_investor by folding rounding remainder into the last row.
 */
class ProfitSharingCalculatorService
{
    /**
     * @param  array<int, array{investment_id: int, nominal: int}>  $investments
     * @return array{
     *   keuntungan_bersih: int,
     *   total_bagi_hasil_investor: int,
     *   fee_platform: int,
     *   total_dibayarkan: int,
     *   breakdown: array<int, array{investment_id: int, persen_kepemilikan: float, nominal_bagi_hasil: int}>,
     * }
     *
     * @throws NegativeNetProfitException
     */
    public function calculate(
        int $keuntunganKotor,
        int $biayaOperasional,
        float $persenBagiHasil,
        float $persenFeePlatform,
        array $investments,
        int $totalDanaTerkumpul,
    ): array {
        $keuntunganBersih = $keuntunganKotor - $biayaOperasional;

        if ($keuntunganBersih < 0) {
            throw NegativeNetProfitException::make();
        }

        $totalBagiHasilInvestor = (int) round($keuntunganBersih * $persenBagiHasil / 100);
        $feePlatform = (int) round($keuntunganBersih * $persenFeePlatform / 100);
        $totalDibayarkan = $totalBagiHasilInvestor + $feePlatform;

        $breakdown = $this->distributeBreakdown($investments, $totalDanaTerkumpul, $totalBagiHasilInvestor);

        return [
            'keuntungan_bersih' => $keuntunganBersih,
            'total_bagi_hasil_investor' => $totalBagiHasilInvestor,
            'fee_platform' => $feePlatform,
            'total_dibayarkan' => $totalDibayarkan,
            'breakdown' => $breakdown,
        ];
    }

    /**
     * @param  array<int, array{investment_id: int, nominal: int}>  $investments
     * @return array<int, array{investment_id: int, persen_kepemilikan: float, nominal_bagi_hasil: int}>
     */
    private function distributeBreakdown(array $investments, int $totalDanaTerkumpul, int $totalBagiHasilInvestor): array
    {
        $breakdown = [];
        $allocated = 0;
        $count = count($investments);

        foreach (array_values($investments) as $index => $investment) {
            $persenKepemilikan = $totalDanaTerkumpul > 0
                ? round(($investment['nominal'] / $totalDanaTerkumpul) * 100, 3)
                : 0.0;

            $isLast = $index === $count - 1;
            if ($isLast) {
                // Fold rounding remainder into the last row so the sum of the
                // breakdown always reconciles exactly to total_bagi_hasil_investor.
                $nominalBagiHasil = $totalBagiHasilInvestor - $allocated;
            } else {
                $nominalBagiHasil = $totalDanaTerkumpul > 0
                    ? (int) round(($investment['nominal'] / $totalDanaTerkumpul) * $totalBagiHasilInvestor)
                    : 0;
                $allocated += $nominalBagiHasil;
            }

            $breakdown[] = [
                'investment_id' => $investment['investment_id'],
                'persen_kepemilikan' => $persenKepemilikan,
                'nominal_bagi_hasil' => $nominalBagiHasil,
            ];
        }

        return $breakdown;
    }

    /**
     * Guards against drift between a previously-stored breakdown (what was
     * submitted) and the total it should sum to (what was approved).
     *
     * @param  array<int, array{nominal_bagi_hasil: int}>  $breakdown
     *
     * @throws BreakdownMismatchException
     */
    public function assertBreakdownMatchesTotal(array $breakdown, int $totalBagiHasilInvestor): void
    {
        $sum = array_sum(array_column($breakdown, 'nominal_bagi_hasil'));

        if ($sum !== $totalBagiHasilInvestor) {
            throw BreakdownMismatchException::make();
        }
    }
}
