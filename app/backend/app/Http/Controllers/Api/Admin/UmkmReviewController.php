<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\UmkmStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RejectRequest;
use App\Http\Resources\UmkmResource;
use App\Http\Responses\ApiResponse;
use App\Models\AppNotification;
use App\Models\Umkm;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UmkmReviewController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Umkm::with(['user', 'document']);

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        return ApiResponse::success('OK', UmkmResource::collection($query->latest()->get()));
    }

    public function approve(Umkm $umkm): JsonResponse
    {
        DB::transaction(function () use ($umkm) {
            $umkm->update(['status' => UmkmStatus::Approved]);

            AppNotification::create([
                'user_id' => $umkm->user_id,
                'tipe' => 'umkm_approved',
                'judul' => 'Pendaftaran disetujui',
                'deskripsi' => "Selamat, {$umkm->nama_usaha} sudah aktif di platform dan bisa menerima investasi.",
            ]);
        });

        return ApiResponse::success("{$umkm->nama_usaha} disetujui dan email pemberitahuan terkirim.");
    }

    public function reject(RejectRequest $request, Umkm $umkm): JsonResponse
    {
        $alasan = $request->validated('alasan');

        DB::transaction(function () use ($umkm, $alasan) {
            $umkm->update(['status' => UmkmStatus::Rejected, 'catatan_admin' => $alasan]);

            AppNotification::create([
                'user_id' => $umkm->user_id,
                'tipe' => 'umkm_rejected',
                'judul' => 'Pendaftaran ditolak',
                'deskripsi' => "Pendaftaran usahamu ditolak: {$alasan}. Kamu bisa daftar ulang dengan dokumen yang diperbaiki.",
            ]);
        });

        return ApiResponse::success('Penolakan pendaftaran UMKM terkirim.');
    }
}
