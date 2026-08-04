<?php

namespace Tests\Feature;

use App\Enums\KycStatus;
use App\Enums\UmkmStatus;
use App\Enums\UserRole;
use App\Models\Investor;
use App\Models\Umkm;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class InvestmentFlowTest extends TestCase
{
    use RefreshDatabase;

    private function makeInvestor(KycStatus $kycStatus): Investor
    {
        $user = User::factory()->create(['role' => UserRole::Investor]);

        return Investor::create([
            'user_id' => $user->id,
            'no_ktp' => (string) random_int(1000000000000000, 9999999999999999),
            'tanggal_lahir' => '1990-01-01',
            'no_hp' => '08123456789',
            'kota_domisili' => 'Jakarta',
            'alamat' => 'Jl. Contoh No. 1',
            'kyc_status' => $kycStatus,
        ]);
    }

    private function makeUmkm(UmkmStatus $status, int $target = 30_000_000, int $terkumpul = 0): Umkm
    {
        $user = User::factory()->create(['role' => UserRole::Umkm]);

        return Umkm::create([
            'user_id' => $user->id,
            'nama_usaha' => 'Warung Test',
            'kategori' => 'Kuliner',
            'kota' => 'Yogyakarta',
            'deskripsi' => 'Deskripsi usaha test yang cukup panjang untuk lolos validasi.',
            'target_dana' => $target,
            'total_terkumpul' => $terkumpul,
            'tenor_bulan' => 12,
            'persen_bagi_hasil' => 30,
            'status' => $status,
        ]);
    }

    public function test_investor_without_approved_kyc_cannot_invest(): void
    {
        $investor = $this->makeInvestor(KycStatus::Pending);
        $umkm = $this->makeUmkm(UmkmStatus::Approved);

        Sanctum::actingAs($investor->user, ['investor']);

        $response = $this->postJson('/api/investor/investments', [
            'umkm_id' => $umkm->id,
            'nominal' => 1_000_000,
        ]);

        $response->assertStatus(403);
        $response->assertJsonPath('code', 'KYC_NOT_VERIFIED');
    }

    public function test_investment_cannot_exceed_remaining_funding_slot(): void
    {
        $investor = $this->makeInvestor(KycStatus::Approved);
        $umkm = $this->makeUmkm(UmkmStatus::Approved, target: 10_000_000, terkumpul: 9_800_000);

        Sanctum::actingAs($investor->user, ['investor']);

        $response = $this->post('/api/investor/investments', [
            'umkm_id' => $umkm->id,
            'nominal' => 1_000_000, // remaining slot is only 200.000
            'bukti_transfer' => \Illuminate\Http\UploadedFile::fake()->image('bukti.jpg'),
        ]);

        $response->assertStatus(422);
        $response->assertJsonPath('code', 'FUNDING_SLOT_INSUFFICIENT');
    }

    public function test_confirmed_investment_within_slot_increments_umkm_total_terkumpul(): void
    {
        $investor = $this->makeInvestor(KycStatus::Approved);
        $umkm = $this->makeUmkm(UmkmStatus::Approved, target: 10_000_000, terkumpul: 0);
        $admin = User::factory()->create(['role' => UserRole::Admin]);

        Sanctum::actingAs($investor->user, ['investor']);
        $this->post('/api/investor/investments', [
            'umkm_id' => $umkm->id,
            'nominal' => 1_000_000,
            'bukti_transfer' => \Illuminate\Http\UploadedFile::fake()->image('bukti.jpg'),
        ])->assertCreated();

        $investment = $umkm->investments()->first();

        Sanctum::actingAs($admin, ['admin']);
        $this->postJson("/api/admin/investments/{$investment->id}/confirm")->assertOk();

        $this->assertSame(1_000_000, $umkm->fresh()->total_terkumpul);
        $this->assertSame('confirmed', $investment->fresh()->status->value);
    }

    public function test_unapproved_umkm_does_not_appear_in_public_listing(): void
    {
        $investor = $this->makeInvestor(KycStatus::Approved);
        $this->makeUmkm(UmkmStatus::Pending);
        $this->makeUmkm(UmkmStatus::Rejected);
        $approved = $this->makeUmkm(UmkmStatus::Approved);

        Sanctum::actingAs($investor->user, ['investor']);

        $response = $this->getJson('/api/investor/umkm');
        $response->assertOk();

        $ids = collect($response->json('data'))->pluck('id');
        $this->assertEqualsCanonicalizing([$approved->id], $ids->all());
    }
}
