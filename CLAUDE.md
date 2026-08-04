# CLAUDE.md

Konteks project untuk Claude Code. Baca dokumen ini dulu sebelum mengerjakan task apapun di repo ini.

## Apa project ini

MicroInvest — platform investasi UMKM berbasis profit sharing. Lihat [README.md](README.md) untuk overview singkat.

## Dokumen wajib dibaca sebelum implementasi fitur

1. **[context/MICROINVEST_CONTEXT.md](context/MICROINVEST_CONTEXT.md)** — sumber kebenaran untuk requirement produk: alur bisnis per role (investor/UMKM/admin), formula kalkulasi bagi hasil, design token (2 tema warna: hijau untuk investor, teal untuk UMKM+admin), struktur halaman per panel, skema database.
2. **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — keputusan implementasi: kenapa backend (Laravel API) dan frontend (React SPA) dipisah total, arsitektur auth token-per-tab, di mana logic kalkulasi bagi hasil hidup.
3. **[docs/API.md](docs/API.md)** — daftar endpoint yang sudah ada. Cek dulu sebelum bikin endpoint baru, siapa tahu sudah ada.
4. `context/context-frontend/*.html` dan `context/context-backend-and-system/*.md` — prototype HTML & prompt implementasi awal yang dipakai untuk generate kode saat ini. Referensi visual/struktur, **bukan untuk di-copy langsung**.

## Aturan penting yang sering dilanggar kalau tidak baca context dulu

- **Jangan** pindahkan auth ke cookie/session Laravel default (Breeze/Inertia SPA mode) — itu akan merusak requirement multi-role login antar tab. Auth harus tetap token Sanctum + `sessionStorage` di frontend. Lihat `docs/ARCHITECTURE.md`.
- **Jangan** pakai `float`/`double` untuk nilai uang di backend — semua nominal rupiah harus `int`. Lihat `ProfitSharingCalculatorService`.
- Kalau ubah formula bagi hasil, update di **dua tempat**: `context/MICROINVEST_CONTEXT.md` §3 dan docblock `ProfitSharingCalculatorService`.
- Dua tema warna (`green-*` untuk investor, `teal-*` untuk UMKM & admin) sudah didefinisikan sebagai CSS variable di `app/frontend/src/index.css` — jangan hardcode hex baru, pakai token yang sudah ada.
- Backend jalan di port **8001** (bukan default Laravel 8000) karena `app/frontend/.env` sudah di-hardcode ke situ — lihat `docs/SETUP.md` kalau mau ganti port.

## Kalau menambah endpoint atau halaman baru

Update `docs/API.md` (untuk endpoint baru) atau struktur folder di `docs/ARCHITECTURE.md` (untuk halaman/panel baru) di PR yang sama — dokumen ini dipakai developer lain (dan Claude Code sesi berikutnya) untuk onboarding, jangan biarkan basi.
