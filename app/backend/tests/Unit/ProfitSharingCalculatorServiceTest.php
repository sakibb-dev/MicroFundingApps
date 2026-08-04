<?php

namespace Tests\Unit;

use App\Exceptions\NegativeNetProfitException;
use App\Services\ProfitSharingCalculatorService;
use PHPUnit\Framework\TestCase;

class ProfitSharingCalculatorServiceTest extends TestCase
{
    private ProfitSharingCalculatorService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new ProfitSharingCalculatorService();
    }

    public function test_calculates_net_profit_and_totals_per_context_example(): void
    {
        // Worked example from MICROINVEST_CONTEXT.md section 3 / the UMKM prototype:
        // kotor 12.500.000, operasional 1.700.000, 30% bagi hasil, 5% fee.
        $result = $this->service->calculate(
            keuntunganKotor: 12_500_000,
            biayaOperasional: 1_700_000,
            persenBagiHasil: 30.0,
            persenFeePlatform: 5.0,
            investments: [
                ['investment_id' => 1, 'nominal' => 1_000_000],
                ['investment_id' => 2, 'nominal' => 4_000_000],
            ],
            totalDanaTerkumpul: 45_000_000,
        );

        $this->assertSame(10_800_000, $result['keuntungan_bersih']);
        $this->assertSame(3_240_000, $result['total_bagi_hasil_investor']);
        $this->assertSame(540_000, $result['fee_platform']);
        $this->assertSame(3_780_000, $result['total_dibayarkan']);
    }

    public function test_breakdown_sums_exactly_to_total_bagi_hasil_investor_despite_rounding(): void
    {
        // Odd numbers chosen specifically to produce rounding drift per investor
        // if naively rounded independently.
        $investments = [
            ['investment_id' => 1, 'nominal' => 333_333],
            ['investment_id' => 2, 'nominal' => 666_667],
            ['investment_id' => 3, 'nominal' => 1_000_000],
            ['investment_id' => 4, 'nominal' => 2_500_000],
            ['investment_id' => 5, 'nominal' => 4_999_999],
        ];
        $totalDana = array_sum(array_column($investments, 'nominal'));

        $result = $this->service->calculate(
            keuntunganKotor: 7_777_777,
            biayaOperasional: 123_456,
            persenBagiHasil: 33.33,
            persenFeePlatform: 5.0,
            investments: $investments,
            totalDanaTerkumpul: $totalDana,
        );

        $sum = array_sum(array_column($result['breakdown'], 'nominal_bagi_hasil'));
        $this->assertSame($result['total_bagi_hasil_investor'], $sum);

        // Guard helper should agree.
        $this->service->assertBreakdownMatchesTotal($result['breakdown'], $result['total_bagi_hasil_investor']);
        $this->addToAssertionCount(1); // no exception thrown above
    }

    public function test_total_dibayarkan_equals_bagi_hasil_plus_fee(): void
    {
        $result = $this->service->calculate(
            keuntunganKotor: 10_000_000,
            biayaOperasional: 2_000_000,
            persenBagiHasil: 25.0,
            persenFeePlatform: 5.0,
            investments: [['investment_id' => 1, 'nominal' => 1_000_000]],
            totalDanaTerkumpul: 1_000_000,
        );

        $this->assertSame(
            $result['total_bagi_hasil_investor'] + $result['fee_platform'],
            $result['total_dibayarkan']
        );
    }

    public function test_throws_when_net_profit_would_be_negative(): void
    {
        $this->expectException(NegativeNetProfitException::class);

        $this->service->calculate(
            keuntunganKotor: 1_000_000,
            biayaOperasional: 2_000_000,
            persenBagiHasil: 30.0,
            persenFeePlatform: 5.0,
            investments: [],
            totalDanaTerkumpul: 0,
        );
    }

    public function test_handles_zero_total_dana_terkumpul_without_division_error(): void
    {
        $result = $this->service->calculate(
            keuntunganKotor: 1_000_000,
            biayaOperasional: 0,
            persenBagiHasil: 30.0,
            persenFeePlatform: 5.0,
            investments: [['investment_id' => 1, 'nominal' => 500_000]],
            totalDanaTerkumpul: 0,
        );

        $this->assertSame(0.0, $result['breakdown'][0]['persen_kepemilikan']);
    }

    public function test_single_investor_receives_entire_bagi_hasil_pool(): void
    {
        $result = $this->service->calculate(
            keuntunganKotor: 5_000_000,
            biayaOperasional: 500_000,
            persenBagiHasil: 30.0,
            persenFeePlatform: 5.0,
            investments: [['investment_id' => 42, 'nominal' => 2_000_000]],
            totalDanaTerkumpul: 2_000_000,
        );

        $this->assertSame($result['total_bagi_hasil_investor'], $result['breakdown'][0]['nominal_bagi_hasil']);
        $this->assertSame(100.0, $result['breakdown'][0]['persen_kepemilikan']);
    }

    public function test_breakdown_mismatch_guard_throws_on_tampered_total(): void
    {
        $this->expectException(\App\Exceptions\BreakdownMismatchException::class);

        $this->service->assertBreakdownMatchesTotal(
            [['nominal_bagi_hasil' => 100_000], ['nominal_bagi_hasil' => 100_000]],
            totalBagiHasilInvestor: 999_999,
        );
    }
}
