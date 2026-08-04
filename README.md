# MicroInvest

Platform investasi UMKM berbasis profit sharing (bagi hasil bulanan) yang menghubungkan investor individu dengan UMKM yang butuh modal usaha. Menghubungkan tiga peran: **Investor**, **UMKM**, dan **Admin**.

> Status: **prototype fungsional** — dibuat untuk keperluan pitching. Struktur, alur bisnis, dan formula kalkulasi bagi hasil sudah diimplementasi dan bisa didemokan end-to-end; belum production-hardened (lihat [docs/ARCHITECTURE.md § technical debt](docs/ARCHITECTURE.md#yang-belum-ada--technical-debt-untuk-dev-berikutnya)).

## Tech stack

- **Backend**: Laravel 13 (PHP 8.3+), REST API only — token auth via Laravel Sanctum
- **Frontend**: React 19 + Vite + Tailwind CSS 4, SPA terpisah dari backend
- **Database**: PostgreSQL

Backend dan frontend dijalankan sebagai dua proses terpisah (bukan Inertia/Blade monolith) — alasannya requirement multi-role login antar tab browser. Detail lengkap keputusan arsitektur ada di [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Quick start

Panduan lengkap (prasyarat, env vars, akun demo, troubleshooting) ada di **[docs/SETUP.md](docs/SETUP.md)**. Ringkas:

```bash
# Backend — terminal 1
cd app/backend
composer install && cp .env.example .env && php artisan key:generate
# set DB_* di .env ke database PostgreSQL kamu, lalu:
php artisan migrate --seed
php artisan serve --port=8001

# Frontend — terminal 2
cd app/frontend
npm install && cp .env.example .env
npm run dev
```

Buka `http://localhost:5173`. Akun demo admin: `admin@microinvest.id` / `password123` (dari seeder) — akun investor/UMKM daftar sendiri lewat halaman Register.

## Struktur project

```
app/
  backend/   → Laravel REST API
  frontend/  → React SPA
context/     → dokumen requirement produk & prototype HTML referensi (sumber kebenaran alur bisnis & design system)
docs/        → dokumentasi teknis (dokumen ini + arsitektur, API, setup)
```

## Dokumentasi

| Dokumen | Isi |
|---|---|
| [context/MICROINVEST_CONTEXT.md](context/MICROINVEST_CONTEXT.md) | Konteks produk: alur bisnis, formula bagi hasil, design system, struktur halaman per panel |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Keputusan teknis: kenapa backend/frontend dipisah, arsitektur auth, skema database, technical debt |
| [docs/API.md](docs/API.md) | Referensi seluruh endpoint REST API |
| [docs/SETUP.md](docs/SETUP.md) | Setup environment detail, akun demo, debugging, troubleshooting |

Untuk siapapun (manusia atau AI coding agent) yang melanjutkan development, mulai dari `docs/ARCHITECTURE.md` untuk paham *kenapa* strukturnya begini, baru masuk ke kode.
