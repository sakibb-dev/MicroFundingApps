<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\KycStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RejectRequest;
use App\Http\Responses\ApiResponse;
use App\Models\AppNotification;
use App\Models\Investor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class KycController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Investor::with(['user', 'kycDocuments' => fn ($q) => $q->latest()->limit(1)]);

        if ($status = $request->query('status')) {
            $query->where('kyc_status', $status);
        }

        return ApiResponse::success('OK', $query->latest()->get()->map(fn (Investor $i) => [
            'id' => $i->id,
            'nama' => $i->user->name,
            'email' => $i->user->email,
            'tanggal_daftar' => $i->created_at->toDateString(),
            'status' => $i->kyc_status->value,
            'no_hp' => $i->no_hp,
            'alamat' => $i->alamat,
            'dokumen' => $i->kycDocuments->first() ? [
                'ktp' => $i->kycDocuments->first()->path_ktp,
                'selfie' => $i->kycDocuments->first()->path_selfie,
            ] : null,
        ]));
    }

    public function approve(Request $request, Investor $investor): JsonResponse
    {
        DB::transaction(function () use ($request, $investor) {
            $investor->update(['kyc_status' => KycStatus::Approved]);
            $investor->kycDocuments()->latest()->first()?->update([
                'status' => KycStatus::Approved,
                'reviewed_by' => $request->user()->id,
                'reviewed_at' => now(),
            ]);

            AppNotification::create([
                'user_id' => $investor->user_id,
                'tipe' => 'kyc_approved',
                'judul' => 'KYC terverifikasi',
                'deskripsi' => 'Akunmu sudah terverifikasi penuh, kamu bisa mulai berinvestasi.',
            ]);
        });

        return ApiResponse::success("KYC {$investor->user->name} disetujui.");
    }

    public function reject(RejectRequest $request, Investor $investor): JsonResponse
    {
        DB::transaction(function () use ($request, $investor) {
            $investor->update(['kyc_status' => KycStatus::Rejected]);
            $investor->kycDocuments()->latest()->first()?->update([
                'status' => KycStatus::Rejected,
                'catatan_admin' => $request->validated('alasan'),
                'reviewed_by' => $request->user()->id,
                'reviewed_at' => now(),
            ]);

            AppNotification::create([
                'user_id' => $investor->user_id,
                'tipe' => 'kyc_rejected',
                'judul' => 'Verifikasi KYC ditolak',
                'deskripsi' => "Verifikasi KYC kamu ditolak: {$request->validated('alasan')}. Ajukan ulang dengan dokumen yang jelas.",
            ]);
        });

        return ApiResponse::success('Penolakan KYC terkirim.');
    }
}
