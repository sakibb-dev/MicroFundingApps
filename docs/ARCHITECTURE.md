# Arsitektur

Ringkasan keputusan desain teknis dan alasannya. Untuk konteks bisnis/produk (alur user, struktur halaman, design token), lihat [`context/MICROINVEST_CONTEXT.md`](../context/MICROINVEST_CONTEXT.md) — dokumen itu adalah sumber kebenaran untuk *requirement produk*; dokumen ini adalah sumber kebenaran untuk *keputusan implementasi*.

## Kenapa backend & frontend dipisah (bukan Laravel monolith/Inertia)

Requirement: seorang user harus bisa login sebagai **admin** di satu tab browser, dan sebagai **investor**/**umkm** di tab lain, secara bersamaan, tanpa logout.

Ini tidak bisa dicapai dengan Laravel Blade atau Inertia.js standar, karena keduanya memakai Sanctum mode SPA (cookie-based) — cookie di-share ke **semua tab** dalam satu origin browser. Login di satu tab otomatis berlaku di tab lain, yang justru bertentangan dengan requirement di atas.

**Solusi yang dipakai** (lihat `MICROINVEST_CONTEXT.md` §5.5):

- Backend: Laravel Sanctum mode **token API**, bukan cookie. `POST /api/auth/{role}/login` mengembalikan `token` di response body.
- Frontend: token disimpan di `sessionStorage` (unik per tab, tidak di-share), dikirim lewat header `Authorization: Bearer {token}` di setiap request — lihat [`app/frontend/src/api/client.js`](../app/frontend/src/api/client.js) dan [`AuthContext.jsx`](../app/frontend/src/context/AuthContext.jsx).
- Logout hanya me-revoke token milik tab tersebut (`$request->user()->currentAccessToken()->delete()` di [`AuthController::logout`](../app/backend/app/Http/Controllers/Api/Auth/AuthController.php)), bukan seluruh token user.
- Tiap token dibuat dengan **ability** = role-nya (`createToken('investor-session', ['investor'])`), lalu middleware `EnsureUserHasRole` mengecek *dua* hal: kolom `role` di DB **dan** ability token — defense in depth, supaya token yang somehow salah scope tidak bisa dipakai lintas role.

Konsekuensi dari keputusan ini: backend adalah **REST API murni** (tidak render HTML apa pun kecuali `/up` health check), frontend adalah **SPA React** yang jalan sebagai proses/dev-server terpisah. Ini juga membuka jalan kalau nanti ada kebutuhan client lain (mobile app) yang konsumsi API yang sama.

## Alur request

```
Browser (React SPA, :5173)
   │  Authorization: Bearer <token dari sessionStorage>
   ▼
Laravel API (:8001) ── routes/api.php ── middleware auth:sanctum + role:<role>
   │
   ▼
Controller → FormRequest (validasi) → Model/Service → ApiResponse (JSON seragam)
```

- Semua response API dibungkus lewat [`ApiResponse`](../app/backend/app/Http/Responses/ApiResponse.php) — bentuknya konsisten (`success`, `message`, `data`), lihat [docs/API.md](API.md).
- Error di-handle terpusat di [`bootstrap/app.php`](../app/backend/bootstrap/app.php) (`withExceptions`) — validation error, auth error, dan exception domain custom (`ApiException` dan turunannya) semua diubah jadi JSON dengan pesan Bahasa Indonesia yang user-facing.

## Kalkulasi bagi hasil

Logic keuangan yang paling sensitif di aplikasi ini — kalkulasi bagi hasil bulanan — sengaja diisolasi jadi **pure function** tanpa I/O di [`ProfitSharingCalculatorService`](../app/backend/app/Services/ProfitSharingCalculatorService.php), supaya:

1. Bisa di-unit-test tanpa DB.
2. Semua nilai uang pakai integer (rupiah), tidak pernah float — menghindari floating point drift.
3. Sisa pembulatan (rounding remainder) di-fold ke baris terakhir breakdown, supaya total breakdown selalu rekonsiliasi persis ke `total_bagi_hasil_investor` (tidak pernah selisih 1 rupiah karena pembulatan per baris).

Formula lengkap ada di `MICROINVEST_CONTEXT.md` §3 dan dikutip ulang di docblock service tersebut — kalau formula berubah, update di **kedua tempat**.

## Skema database

Lihat migration di [`app/backend/database/migrations/`](../app/backend/database/migrations/) untuk struktur kolom pasti. Ringkasan entitas & relasi:

```
users (role: investor|umkm|admin)
  │
  ├─ investors ──< kyc_documents
  │      │
  │      └─< investments >── umkms ──< umkm_documents
  │              │                        │
  │              ├─< invoices             └─< profit_reports ──< profit_distributions
  │              │                                 │
  │              └─< profit_distributions          └─< platform_fees
  │
  └─ umkms (user_id)

notifications ── polymorphic ke users
```

Status penting (dipakai untuk filter di semua panel admin):

| Enum | Nilai |
|---|---|
| `KycStatus` | `pending`, `approved`, `rejected` |
| `UmkmStatus` | `pending`, `approved`, `rejected` |
| `InvestmentStatus` | `pending_confirmation`, `confirmed`, `active`, `completed`, `rejected` |
| `ProfitReportStatus` | `draft`, `submitted`, `approved`, `processed`, `overdue`, `rejected` |
| `ProfitDistributionStatus` | `pending`, `processed`, `failed` |

## Struktur folder

```
ProjectMicroFund/
├── app/
│   ├── backend/    → Laravel 13 REST API (PHP 8.3+)
│   │   ├── app/Http/Controllers/Api/{Auth,Investor,Umkm,Admin}/  — satu namespace per role
│   │   ├── app/Services/                                          — logic domain (kalkulasi, invoice, storage)
│   │   ├── app/Models/, database/migrations/                      — data layer
│   │   └── routes/api.php                                         — satu-satunya entry point (routes/web.php nyaris kosong)
│   └── frontend/   → React 19 + Vite + Tailwind 4 SPA
│       ├── src/pages/{landing,register,investor,umkm,admin,auth}/ — satu folder per panel
│       ├── src/components/{ui,layouts}/                           — komponen reusable & layout per tema
│       ├── src/context/                                            — AuthContext (token+role), ToastContext
│       └── src/api/                                                 — axios client + interceptor error global
├── context/        → dokumen requirement produk & prototype HTML referensi (BUKAN kode jalan)
└── docs/           → dokumen ini
```

Kenapa `app/backend` dan `app/frontend` (bukan `backend/` `frontend/` langsung di root): supaya folder `context/` dan `docs/` — yang bukan kode aplikasi — jelas terpisah level dari kode yang benar-benar di-deploy. Ini pilihan gaya, bukan keharusan; kalau tim yang melanjutkan lebih familiar dengan `apps/api` + `apps/web`, rename aman dilakukan kapan saja (tidak ada dependency path hardcoded lintas folder selain lewat `.env`).

## Yang belum ada / technical debt untuk dev berikutnya

- **Test coverage masih tipis** — sudah ada beberapa test (`tests/Unit/ProfitSharingCalculatorServiceTest.php`, `tests/Feature/InvestmentFlowTest.php`, `tests/Feature/ProfitReportApprovalTest.php`) yang menutup jalur kritis (kalkulasi bagi hasil, alur investasi, approval pengajuan bagi hasil), tapi belum ada test untuk sebagian besar controller lain (KYC, review UMKM, notifikasi, dll) maupun test frontend sama sekali.
- **Tidak ada CI/CD** — belum ada GitHub Actions untuk jalankan `composer test` / lint otomatis saat PR.
- **File storage masih `local` disk** (`FILESYSTEM_DISK=local` di `.env`) — untuk produksi (dokumen KTP, NIB, dll adalah data sensitif) sebaiknya pindah ke S3 atau setara sebelum go-live, bukan cuma untuk prototype/pitching.
- **PDF invoice** (`InvoiceGeneratorService`) — cek isinya sebelum demo yang butuh fitur ini, belum diverifikasi end-to-end di audit ini.
- **Queue worker** (`QUEUE_CONNECTION=database`) perlu `php artisan queue:listen` jalan terpisah kalau ada job yang di-dispatch (misal notifikasi/email) — jangan lupa saat deploy.
