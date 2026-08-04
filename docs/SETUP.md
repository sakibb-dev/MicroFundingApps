# Setup Environment Development

## Prasyarat

| Tool | Versi minimal | Cek |
|---|---|---|
| PHP | 8.3+ (dengan extension `pdo_pgsql`) | `php -v`, `php -m \| grep pgsql` |
| Composer | 2.x | `composer -V` |
| Node.js | 18+ | `node -v` |
| npm | 9+ | `npm -v` |
| PostgreSQL | 14+, service berjalan di port 5432 | — |

## 1. Clone & database

```bash
git clone https://github.com/hidasyaqiib/MicroFundingApps.git
cd MicroFundingApps
```

Buat database kosong bernama `microinvest` di PostgreSQL lokal kamu (lewat psql, pgAdmin, TablePlus, atau tool GUI apapun).

## 2. Backend (Laravel)

```bash
cd app/backend
composer install
cp .env.example .env
php artisan key:generate
```

Edit `.env` — minimal set ini (sesuaikan kredensial Postgres kamu):

```
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=microinvest
DB_USERNAME=postgres
DB_PASSWORD=postgres

FRONTEND_URL=http://localhost:5173
```

Jalankan migration + seed akun admin default:

```bash
php artisan migrate
php artisan db:seed
```

Jalankan server di **port 8001** (frontend sudah dikonfigurasi mengarah ke port ini — lihat catatan port di bawah):

```bash
php artisan serve --port=8001
```

## 3. Frontend (React + Vite)

Di terminal baru:

```bash
cd app/frontend
npm install
cp .env.example .env
npm run dev
```

Buka `http://localhost:5173`.

## Catatan soal port

`php artisan serve` default-nya jalan di port **8000**, tapi [`app/frontend/.env.example`](../app/frontend/.env.example) mengarah ke `http://localhost:8001/api`. Ini disengaja supaya port 8000 bebas dipakai untuk keperluan lain di mesin dev — tapi konsekuensinya, **backend harus selalu dijalankan dengan `--port=8001`** kecuali kamu ubah `VITE_API_URL` di `app/frontend/.env` untuk match port yang kamu pakai.

Kalau lebih suka pakai port default 8000: ubah `VITE_API_URL=http://localhost:8000/api` di `app/frontend/.env`, lalu jalankan `php artisan serve` tanpa flag `--port`. Dengan begitu kamu juga bisa pakai shortcut `composer dev` di `app/backend` (menjalankan server + queue listener + log viewer `pail` + `npm run dev` sekaligus dalam satu command).

## Akun demo

| Role | Email | Password | Cara dapat |
|---|---|---|---|
| Admin | `admin@microinvest.id` | `password123` | Otomatis dibuat oleh `php artisan db:seed` |
| Investor | — | — | Daftar sendiri lewat halaman Register di frontend (`/register`, toggle "Investor") |
| UMKM | — | — | Daftar sendiri lewat halaman Register di frontend (toggle "UMKM") |

Investor/UMKM yang baru daftar berstatus `pending` — login sebagai **admin** untuk approve KYC-nya (Panel Admin → Manajemen KYC / Manajemen UMKM) sebelum akun tersebut bisa investasi atau campaign-nya tampil publik.

## Menjalankan test

```bash
cd app/backend
composer test
# atau: php artisan test
```

## Debugging

- **Log backend real-time**: `php artisan pail` (jalan di terminal terpisah, streaming `storage/logs/laravel.log`).
- **Step debugging PHP**: belum ada Xdebug ter-setup di repo ini. Kalau perlu breakpoint di VS Code: install extension "PHP Debug", install extension PHP `xdebug`, lalu buat `.vscode/launch.json` dengan config `Listen for Xdebug`.
- **Frontend**: React DevTools (browser extension) + browser DevTools biasa. Vite HMR otomatis reload saat file berubah, tidak perlu restart manual.
- **CORS**: `app/backend/config/cors.php` sudah `allowed_origins => ['*']` untuk kemudahan dev. Kalau deploy, sempitkan ke origin frontend yang sebenarnya.

## Troubleshooting umum

| Gejala | Kemungkinan penyebab |
|---|---|
| Frontend fetch API gagal / network error | Backend belum jalan, atau port tidak cocok dengan `VITE_API_URL` (lihat "Catatan soal port" di atas) |
| `SQLSTATE[08006]` / connection refused saat migrate | PostgreSQL service belum jalan, atau kredensial `.env` salah |
| Upload dokumen (KTP/NIB/dll) gagal | Cek `FILESYSTEM_DISK` di `.env` dan permission folder `storage/app` |
| 403 di endpoint yang seharusnya bisa diakses | Role token tidak cocok dengan role route (lihat `EnsureUserHasRole` di [ARCHITECTURE.md](ARCHITECTURE.md)), atau — khusus endpoint investasi — KYC investor belum `approved` |
