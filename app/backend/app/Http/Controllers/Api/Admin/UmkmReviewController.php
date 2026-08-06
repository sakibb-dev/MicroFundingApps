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
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class UmkmReviewController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Umkm::with(['user', 'document']);

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $paginator = $query->latest()->paginate(15);
        $paginator->through(fn (Umkm $u) => (new UmkmResource($u))->resolve($request));

        return ApiResponse::success('OK', $paginator);
    }

    /**
     * Streams the actual file bytes for review -- same rationale as
     * Admin\KycController::document(). foto_usaha is an array, so it takes
     * an extra ?index= query param to pick which photo.
     */
    public function document(Request $request, Umkm $umkm): StreamedResponse|JsonResponse
    {
        $type = $request->route('type');
        $doc = $umkm->document;

        $path = match ($type) {
            'nib' => $doc?->path_nib,
            'ktp_pemilik' => $doc?->path_ktp_pemilik,
            'laporan_keuangan' => $doc?->path_laporan_keuangan,
            'surat_perjanjian' => $doc?->path_surat_perjanjian,
            'foto_usaha' => $doc?->path_foto_usaha[(int) $request->query('index', 0)] ?? null,
            default => null,
        };

        if (! $path || ! Storage::disk('local')->exists($path)) {
            return ApiResponse::error('Dokumen tidak ditemukan.', null, null, 404);
        }

        return Storage::disk('local')->response($path);
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
