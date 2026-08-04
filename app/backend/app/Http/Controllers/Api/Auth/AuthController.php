<?php

namespace App\Http\Controllers\Api\Auth;

use App\Enums\KycStatus;
use App\Enums\UmkmStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterInvestorRequest;
use App\Http\Requests\Auth\RegisterUmkmRequest;
use App\Http\Resources\UserResource;
use App\Http\Responses\ApiResponse;
use App\Models\Investor;
use App\Models\KycDocument;
use App\Models\Umkm;
use App\Models\UmkmDocument;
use App\Models\User;
use App\Services\DocumentStorageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(private DocumentStorageService $documents) {}

    public function registerInvestor(RegisterInvestorRequest $request): JsonResponse
    {
        $data = $request->validated();
        $ktpFile = $request->file('ktp');
        $selfieFile = $request->file('selfie');

        $user = DB::transaction(function () use ($data, $ktpFile, $selfieFile) {
            $user = User::create([
                'name' => $data['nama_lengkap'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => UserRole::Investor,
            ]);

            $investor = Investor::create([
                'user_id' => $user->id,
                'no_ktp' => $data['no_ktp'],
                'tanggal_lahir' => $data['tanggal_lahir'],
                'no_hp' => $data['no_hp'],
                'kota_domisili' => $data['kota_domisili'],
                'alamat' => $data['alamat'],
                'kyc_status' => KycStatus::Pending,
            ]);

            KycDocument::create([
                'investor_id' => $investor->id,
                'path_ktp' => $this->documents->store($ktpFile, 'investor', $investor->id, 'ktp'),
                'path_selfie' => $this->documents->store($selfieFile, 'investor', $investor->id, 'selfie'),
                'status' => KycStatus::Pending,
            ]);

            return $user;
        });

        $token = $user->createToken('investor-session', [UserRole::Investor->value])->plainTextToken;

        return ApiResponse::success(
            'Pendaftaran terkirim. Kami akan memverifikasi dalam 1x24 jam.',
            ['user' => new UserResource($user), 'token' => $token],
            201,
        );
    }

    public function registerUmkm(RegisterUmkmRequest $request): JsonResponse
    {
        $data = $request->validated();
        $nibFile = $request->file('nib');
        $ktpFile = $request->file('ktp_pemilik');
        $laporanFile = $request->file('laporan_keuangan');
        $fotoFiles = $request->file('foto_usaha');
        $suratFile = $request->file('surat_perjanjian');

        $user = DB::transaction(function () use ($data, $nibFile, $ktpFile, $laporanFile, $fotoFiles, $suratFile) {
            $user = User::create([
                'name' => $data['nama_usaha'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => UserRole::Umkm,
            ]);

            $umkm = Umkm::create([
                'user_id' => $user->id,
                'nama_usaha' => $data['nama_usaha'],
                'kategori' => $data['kategori'],
                'kota' => $data['kota'],
                'tahun_berdiri' => $data['tahun_berdiri'] ?? null,
                'jumlah_karyawan' => $data['jumlah_karyawan'] ?? null,
                'deskripsi' => $data['deskripsi'],
                'target_dana' => $data['target_dana'],
                'total_terkumpul' => 0,
                'tenor_bulan' => $data['tenor_bulan'],
                'persen_bagi_hasil' => $data['persen_bagi_hasil'],
                'omzet_bulanan' => $data['omzet_bulanan'] ?? null,
                'status' => UmkmStatus::Pending,
            ]);

            UmkmDocument::create([
                'umkm_id' => $umkm->id,
                'path_nib' => $this->documents->store($nibFile, 'umkm', $umkm->id, 'nib'),
                'path_laporan_keuangan' => $this->documents->store($laporanFile, 'umkm', $umkm->id, 'laporan_keuangan'),
                'path_foto_usaha' => $this->documents->storeMany($fotoFiles, 'umkm', $umkm->id, 'foto_usaha'),
                'path_surat_perjanjian' => $this->documents->store($suratFile, 'umkm', $umkm->id, 'surat_perjanjian'),
            ]);
            // NOTE: ktp_pemilik is stored alongside the other UMKM documents on disk
            // but intentionally not modeled as its own column in this pass.
            $this->documents->store($ktpFile, 'umkm', $umkm->id, 'ktp_pemilik');

            return $user;
        });

        $token = $user->createToken('umkm-session', [UserRole::Umkm->value])->plainTextToken;

        return ApiResponse::success(
            'Pendaftaran usaha terkirim. Menunggu review admin.',
            ['user' => new UserResource($user), 'token' => $token],
            201,
        );
    }

    public function login(LoginRequest $request, string $role): JsonResponse
    {
        if (! in_array($role, array_column(UserRole::cases(), 'value'), true)) {
            return ApiResponse::error('Data yang kamu cari tidak ditemukan.', null, null, 404);
        }

        $credentials = $request->validated();
        $user = User::where('email', $credentials['email'])->where('role', $role)->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau kata sandi salah.'],
            ]);
        }

        $token = $user->createToken("{$role}-session", [$role])->plainTextToken;

        return ApiResponse::success('Berhasil masuk.', [
            'user' => new UserResource($user),
            'token' => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        // Revoke only the token used for THIS request/tab -- other tabs/devices
        // for the same user must stay logged in (see MICROINVEST_CONTEXT.md 5.5).
        $request->user()?->currentAccessToken()?->delete();

        return ApiResponse::success('Berhasil keluar.');
    }

    public function me(Request $request): JsonResponse
    {
        return ApiResponse::success('OK', new UserResource($request->user()));
    }
}
