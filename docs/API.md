# API Reference

Base URL (dev): `http://localhost:8001/api`

Sumber kebenaran endpoint adalah [`app/backend/routes/api.php`](../app/backend/routes/api.php) — dokumen ini adalah ringkasannya. Kalau ada endpoint baru ditambahkan, update file ini juga.

## Format response

Semua endpoint mengembalikan JSON dengan bentuk seragam (lihat [`ApiResponse`](../app/backend/app/Http/Responses/ApiResponse.php)):

**Sukses**
```json
{ "success": true, "message": "Berhasil masuk.", "data": { ... } }
```

**Error**
```json
{ "success": false, "message": "Data yang dikirim tidak valid", "errors": { "email": ["..."] }, "code": null }
```

`errors` hanya muncul untuk validation error (422). `code` dipakai untuk error domain custom (lihat `app/Exceptions/`), misal KYC belum diverifikasi.

## Autentikasi

Token-based (Sanctum, **bukan** cookie) — lihat [ARCHITECTURE.md](ARCHITECTURE.md#kenapa-backend--frontend-dipisah-bukan-laravel-monolithinertia) untuk alasannya.

1. Register atau login → response berisi `data.token`.
2. Simpan token itu (frontend pakai `sessionStorage`, unik per tab).
3. Kirim di setiap request selanjutnya: header `Authorization: Bearer {token}`.

| Method | Endpoint | Auth | Body | Keterangan |
|---|---|---|---|---|
| POST | `/auth/investor/register` | – | multipart: `nama_lengkap, email, password, no_hp, tanggal_lahir, kota_domisili, alamat, no_ktp, ktp (file), selfie (file)` | Buat akun investor + kirim dokumen KYC (status awal `pending`) |
| POST | `/auth/umkm/register` | – | multipart: `nama_usaha, kategori, kota, deskripsi, email, password, target_dana, tenor_bulan, persen_bagi_hasil, nib (file), ktp_pemilik (file), laporan_keuangan (file), foto_usaha[] (file[]), surat_perjanjian (file)` | Buat akun UMKM + campaign (status awal `pending`) |
| POST | `/auth/{role}/login` | – | `email, password` — `role` = `investor`\|`umkm`\|`admin` | Admin **tidak** bisa self-register, hanya lewat seeder/DB langsung |
| POST | `/auth/logout` | ✅ (semua role) | – | Revoke token tab ini saja |
| GET | `/me` | ✅ (semua role) | – | Data user yang sedang login |

## Investor (`/api/investor/*`, middleware `role:investor`)

| Method | Endpoint | Extra middleware | Keterangan |
|---|---|---|---|
| GET | `/umkm` | – | List campaign UMKM (untuk halaman Home/Explore) |
| GET | `/umkm/{umkm}` | – | Detail campaign |
| POST | `/investments` | `kyc.approved` | Buat investasi baru — **diblokir kalau KYC investor belum `approved`** |
| GET | `/investments` | – | Riwayat investasi milik investor ybs |
| GET | `/portfolio` | – | Ringkasan portfolio (total investasi, bagi hasil, dst) |
| GET | `/notifications` | – | List notifikasi |
| PATCH | `/notifications/{notification}/read` | – | Tandai sudah dibaca |
| GET | `/profile` | – | Profil investor |
| PATCH | `/profile` | – | Update profil |

## UMKM (`/api/umkm-panel/*`, middleware `role:umkm`)

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/dashboard` | Metric dashboard UMKM |
| GET | `/investors` | Daftar investor di campaign ybs (nama disamarkan) |
| GET | `/profit-reports` | Riwayat pengajuan bagi hasil |
| POST | `/profit-reports` | Submit pengajuan bagi hasil bulanan — trigger `ProfitSharingCalculatorService` |
| GET | `/profile` | Profil usaha |
| PATCH | `/profile` | Update profil usaha |

## Admin (`/api/admin/*`, middleware `role:admin`)

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/dashboard` | Metric dashboard admin |
| GET | `/kyc` | List pengajuan KYC investor |
| POST | `/kyc/{investor}/approve` | Approve KYC |
| POST | `/kyc/{investor}/reject` | Tolak KYC (body: alasan) |
| GET | `/umkm` | List pengajuan UMKM |
| POST | `/umkm/{umkm}/approve` | Approve UMKM → campaign tampil publik |
| POST | `/umkm/{umkm}/reject` | Tolak UMKM (body: alasan) |
| GET | `/investments` | List bukti transfer investasi |
| POST | `/investments/{investment}/confirm` | Konfirmasi transfer → generate invoice |
| POST | `/investments/{investment}/reject` | Tolak investasi |
| GET | `/profit-reports` | List pengajuan bagi hasil UMKM |
| POST | `/profit-reports/{profitReport}/approve` | Approve → trigger distribusi ke investor |
| POST | `/profit-reports/{profitReport}/reject` | Tolak pengajuan |
| GET | `/reports` | Laporan/ringkasan platform |

## Kode error domain (`code` di error response)

Dilempar dari `app/Exceptions/` sebagai `ApiException` turunan — dicek di [`bootstrap/app.php`](../app/backend/bootstrap/app.php):

- `FundingSlotInsufficientException` — sisa slot dana campaign tidak cukup untuk nominal investasi yang diajukan
- `KycNotVerifiedException` — investor coba investasi sebelum KYC di-approve
- `NegativeNetProfitException` — keuntungan kotor UMKM lebih kecil dari biaya operasional
- `BreakdownMismatchException` — breakdown bagi hasil per investor tidak rekonsiliasi ke total (guard integritas data)
