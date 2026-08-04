<?php

namespace Tests\Feature;

use App\Enums\InvestmentStatus;
use App\Enums\UmkmStatus;
use App\Enums\UserRole;
use App\Models\Investment;
use App\Models\Investor;
use App\Models\Umkm;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProfitReportApprovalTest extends TestCase
{
    use RefreshDatabase;

    public function test_approving_profit_report_produces_distributions_matching_submitted_total(): void
    {
        $umkmUser = User::factory()->create(['role' => UserRole::Umkm]);
        $umkm = Umkm::create([
            'user_id' => $umkmUser->id,
            'nama_usaha' => 'Warung Bagi Hasil',
            'kategori' => 'Kuliner',
            'kota' => 'Solo',
            'deskripsi' => 'Deskripsi usaha test yang cukup panjang untuk lolos validasi.',
            'target_dana' => 10_000_000,
            'total_terkumpul' => 3_000_000,
            'tenor_bulan' => 12,
            'persen_bagi_hasil' => 30,
            'status' => UmkmStatus::Approved,
        ]);

        // Three confirmed investors sharing the 3.000.000 already collected.
        foreach ([1_000_000, 500_000, 1_500_000] as $nominal) {
            $investorUser = User::factory()->create(['role' => UserRole::Investor]);
            $investor = Investor::create([
                'user_id' => $investorUser->id,
                'no_ktp' => (string) random_int(1000000000000000, 9999999999999999),
                'tanggal_lahir' => '1990-01-01',
                'no_hp' => '08123456789',
                'kota_domisili' => 'Jakarta',
                'alamat' => 'Jl. Contoh No. 1',
                'kyc_status' => 'approved',
            ]);

            Investment::create([
                'investor_id' => $investor->id,
                'umkm_id' => $umkm->id,
                'nominal' => $nominal,
                'status' => InvestmentStatus::Confirmed,
                'confirmed_at' => now(),
            ]);
        }

        Sanctum::actingAs($umkmUser, ['umkm']);

        $submitResponse = $this->post('/api/umkm-panel/profit-reports', [
            'keuntungan_kotor' => 5_000_001, // deliberately odd to force rounding
            'biaya_operasional' => 700_000,
            'laporan_keuangan' => UploadedFile::fake()->create('laporan.pdf', 100),
            'konfirmasi' => true,
        ]);
        $submitResponse->assertCreated();

        $report = $umkm->profitReports()->first();
        $this->assertNotNull($report);
        $this->assertSame('submitted', $report->status->value);

        $admin = User::factory()->create(['role' => UserRole::Admin]);
        Sanctum::actingAs($admin, ['admin']);

        $approveResponse = $this->postJson("/api/admin/profit-reports/{$report->id}/approve");
        $approveResponse->assertOk();

        $report->refresh();
        $this->assertSame('processed', $report->status->value);

        // Postgres SUM() over a bigint column comes back through PDO as a numeric
        // string, not an int -- cast before comparing to avoid a false failure.
        $sumDistributed = (int) $report->distributions()->sum('nominal_bagi_hasil');
        $this->assertSame($report->total_bagi_hasil_investor, $sumDistributed);
        $this->assertTrue($report->distributions()->where('status', 'processed')->count() === 3);

        // Sanity-check the formula itself: bersih = kotor - operasional; total = bersih * 30%.
        $expectedBersih = 5_000_001 - 700_000;
        $this->assertSame($expectedBersih, $report->keuntungan_bersih);
        $this->assertSame((int) round($expectedBersih * 0.30), $report->total_bagi_hasil_investor);
    }
}
