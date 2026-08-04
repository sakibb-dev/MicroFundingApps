# MicroInvest — Project Context untuk Claude Code

> Platform investasi UMKM berbasis profit sharing (bagi hasil bulanan) yang menghubungkan investor individu dengan UMKM yang butuh modal usaha.

Dokumen ini adalah context tunggal untuk memulai development di Laravel + React + Tailwind + PostgreSQL. Referensi visual HTML prototype ada di 4 file terpisah (landing, investor, umkm, admin) — gunakan sebagai acuan struktur komponen, bukan untuk di-copy langsung (karena masih vanilla HTML/CSS/JS, perlu dikonversi ke komponen React + Tailwind classes).

---

## 1. Tech Stack

- **Backend**: Laravel 11 (API + Inertia.js atau REST API terpisah — pilih sesuai preferensi tim)
- **Frontend**: React 18 + Tailwind CSS
- **Database**: PostgreSQL
- **Auth**: Laravel Sanctum / Breeze (multi-guard: investor, umkm, admin)
- **File storage**: dokumen KTP, NIB, laporan keuangan, foto usaha, bukti transfer → Laravel filesystem (local/S3)
- **PDF generation**: invoice & perjanjian investasi (barryvdh/laravel-dompdf atau spatie/laravel-pdf)

---

## 2. Design System — 2 Tema Terpisah

Aplikasi punya **dua tema visual** yang dipisahkan berdasarkan audiens:

| Grup Panel | Tema | Warna Utama |
|---|---|---|
| Landing Page + Panel Investor | **Tema Hijau** (publik & investor) | `#0A1F14` dark green, `#22C55E` accent |
| Panel UMKM + Panel Admin | **Tema Teal** (internal/manajemen) | `#085041` teal, sidebar putih |

### 2.1 Tema Hijau (Landing Page & Panel Investor)

```css
--green-950: #0A1F14;   /* navbar dark, hero bg */
--green-800: #1B4332;   /* primary button, heading accent */
--green-600: #166534;   /* hover states */
--green-500: #16A34A;
--green-400: #22C55E;   /* CTA accent, progress fill */
--green-200: #86EFAC;
--green-100: #D1FAE5;   /* tint background, badge */
--green-50:  #F0FDF4;
```

### 2.2 Tema Teal (Panel UMKM & Panel Admin)

```css
--teal-900: #04342C;   /* countdown card, dark accents */
--teal-800: #085041;   /* primary button, active sidebar text */
--teal-700: #0F6E56;   /* hover states */
--teal-500: #1D9E75;   /* progress fill */
--teal-300: #5DCAA5;
--teal-100: #9FE1CB;
--teal-50:  #E1F5EE;   /* tint background, active sidebar bg */
```

Kedua tema pakai sidebar **putih** dengan active-state warna masing-masing (bukan sidebar gelap) — konsisten antar 4 panel: hijau untuk investor, teal untuk UMKM dan admin.

### 2.3 Neutral & Semantic (dipakai di semua tema)

```css
--neutral-900: #111827;  /* body text */
--neutral-700: #374151;
--neutral-500: #6B7280;  /* muted text */
--neutral-300: #D1D5DB;  /* border */
--neutral-100: #F3F4F6;  /* subtle bg / hairline border */
--neutral-50:  #F9FAFB;  /* page bg */
--white:       #FFFFFF;  /* card bg */

--success: #10B981;
--danger:  #EF4444;
--warning: #F59E0B;
```

### 2.4 Typography

- Font: **Inter** (400, 500, 600, 700, 800)
- Scale: Display 40px/800, H1 32px/800, H2 24px/800, H3 18px/700, Body 14px/400, Caption 11-12px/500

### 2.5 Layout tokens

- Border radius: `8px` controls, `12-14px` cards, `9999px` pills/badges
- Sidebar width: `230-240px` fixed
- Shadow: minimal — `0 4px 12px rgba(0,0,0,0.08-0.10)` hanya untuk hover card, default flat dengan border `1px solid var(--neutral-100)`

### 2.6 Icon

**Gunakan Tabler Icons** (outline style) — jangan pakai emoji di UI produksi.
- Web: `@tabler/icons-react` — `import { IconHome, IconChartPie } from '@tabler/icons-react'`
- CDN reference (prototype): `https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css`

Icon mapping yang dipakai di prototype (jadi acuan konsistensi):

| Konteks | Icon Tabler |
|---|---|
| Home / Dashboard | `IconHome`, `IconLayoutDashboard` |
| Portfolio | `IconChartPie` |
| Transaksi | `IconArrowsExchange` |
| Notifikasi | `IconBell` |
| Profil | `IconUser` |
| Daftar Investor | `IconUsers` |
| Pengajuan Bagi Hasil | `IconFileInvoice` |
| Riwayat | `IconHistory` |
| Profil Usaha | `IconBuildingStore` |
| KYC | `IconIdBadge2` |
| Manajemen UMKM | `IconBuildingStore` |
| Bagi Hasil (admin) | `IconCurrencyDollar` |
| Laporan | `IconReport` |
| Kategori Kuliner | `IconToolsKitchen2` |
| Kategori Fashion | `IconShirt` |
| Kategori Otomotif | `IconTool` |
| Kategori Kerajinan | `IconCut` |
| Upload dokumen | `IconPaperclip`, `IconFileText` |
| KTP / selfie | `IconIdBadge2`, `IconCameraSelfie` |
| Verifikasi/sukses | `IconCheck`, `IconShieldCheck` |
| Lokasi | `IconMapPin` |
| Waktu/countdown | `IconClock` |
| Uang/bagi hasil | `IconCash`, `IconCurrencyDollar` |
| Search | `IconSearch` |
| Alert/warning | `IconAlertTriangle` |

---

## 3. Konteks Bisnis & Alur

### Model bisnis
Investor mendanai UMKM → UMKM lapor keuntungan bulanan → sistem hitung bagi hasil proporsional → distribusi ke investor, dipotong fee platform.

### Alur Investor
```
Landing Page → Daftar (data diri + KTP + selfie) → Verifikasi KYC admin (1x24 jam)
→ Login → Home (list UMKM) → Detail UMKM → Investasi (pilih nominal + upload bukti transfer)
→ Konfirmasi admin → Invoice PDF + perjanjian via email
→ Bulanan: notifikasi bagi hasil masuk → pantau di Portfolio
```

### Alur UMKM
```
Form pendaftaran (nama usaha, kategori, target dana, % bagi hasil,
  NIB + KTP + laporan keuangan 3bln + foto usaha + surat perjanjian)
→ Review admin → Approved → campaign tampil di platform
→ Bulanan: upload laporan keuangan → input keuntungan kotor
→ Sistem hitung otomatis bagi hasil per investor → Submit pengajuan → admin proses
```

### Alur Admin
```
Dashboard overview → Review KYC (approve/tolak + alasan)
→ Review pendaftaran UMKM (approve/tolak + alasan + email)
→ Konfirmasi bukti transfer → generate invoice otomatis
→ Review pengajuan bagi hasil UMKM → approve → proses distribusi ke investor
→ Pantau laporan keuangan platform
```

### Formula perhitungan bagi hasil (penting untuk backend logic)

```
Keuntungan Bersih = Keuntungan Kotor - Biaya Operasional
Total Bagi Hasil Investor = Keuntungan Bersih × % Bagi Hasil (disepakati di awal, misal 30%)
Bagi Hasil per Investor = (Nominal Investasi Investor / Total Dana Terkumpul) × Total Bagi Hasil Investor
Fee Platform = Keuntungan Bersih × % Fee Platform (misal 5%)
Total Dibayarkan UMKM = Total Bagi Hasil Investor + Fee Platform
```

---

## 4. Struktur Halaman per Panel

### 4.0 Halaman Pendaftaran (publik, tema hijau)
File: `microinvest-register.html` — satu halaman dengan toggle di atas untuk memilih daftar sebagai **Investor** atau **UMKM**, masing-masing multi-step wizard:

- **Investor** (3 step): Data Diri → Dokumen KYC (upload KTP + selfie) → Review & submit
- **UMKM** (4 step): Info Usaha → Info Pendanaan (target dana, tenor, % bagi hasil) → Dokumen (NIB, KTP pemilik, laporan keuangan, foto usaha, surat perjanjian) → Review & submit

Pola yang dipakai: stepper progress bar di atas, satu step terlihat dalam satu waktu (`display:none`/`active` toggle), validasi inline per field, dropzone upload dengan preview nama file, halaman sukses terpisah setelah submit (bukan modal/alert).

### 4.1 Landing Page (publik, tema hijau)
1. Navbar (logo, nav links, CTA Masuk + Mulai Investasi)
2. Hero (headline + card mockup bagi hasil + floating stat)
3. Stats bar (UMKM aktif, dana diinvestasikan, investor aktif)
4. Partner/mitra logos
5. Cara kerja (3 langkah: Daftar → Pilih UMKM → Terima Bagi Hasil)
6. Showcase UMKM (grid card dengan progress funding)
7. Keunggulan platform (6 fitur grid, bg dark green)
8. Testimoni investor (disamarkan nama)
9. FAQ accordion
10. CTA bottom + Footer

### 4.2 Panel Investor (tema hijau, sidebar putih + active hijau)
- **Home/Explore**: search + filter kategori, chip status, grid card UMKM (progress bar, return %, countdown)
- **Detail UMKM**: tab (Tentang Usaha / Dokumen / Daftar Investor disamarkan), sticky action card dengan kalkulator estimasi return real-time, form pilih nominal
- **Transaksi**: ringkasan investasi, info rekening tujuan, upload bukti transfer
- **Portfolio**: 4 metric card (total investasi, total bagi hasil, UMKM aktif, return rata-rata), list investasi aktif, tabel riwayat bagi hasil
- **Notifikasi**: list dengan unread indicator (bagi hasil masuk, status KYC, konfirmasi investasi)
- **Profil**: data diri, status KYC, info rekening bank

### 4.3 Panel UMKM (tema teal, sidebar putih + active teal)
- **Dashboard**: alert banner deadline, 3 metric card, progress funding besar, countdown card bagi hasil, riwayat singkat
- **Daftar Investor**: tabel investor (inisial nama disamarkan, nominal, % kepemilikan, tanggal)
- **Pengajuan Bagi Hasil**: form input keuntungan kotor + biaya operasional → kalkulasi otomatis breakdown per investor + fee platform, upload laporan keuangan, checkbox konfirmasi, submit
- **Riwayat Bagi Hasil**: tabel per periode dengan status (Submitted/Approved/Processed/Overdue)
- **Profil Usaha**: edit info UMKM, kategori, deskripsi, target dana, % bagi hasil

### 4.4 Panel Admin (tema teal, sidebar putih + active teal — SAMA dengan Panel UMKM)
- **Dashboard**: alert pending items (KYC, transaksi), metric grid (UMKM aktif, investor, dana beredar, fee platform), tabel aktivitas terbaru
- **Manajemen KYC**: filter tab (Semua/Pending/Approved/Ditolak), tabel investor, panel review inline dengan doc viewer (KTP + selfie), tombol Approve/Tolak (dengan form alasan penolakan)
- **Manajemen UMKM**: sama seperti KYC tapi dokumen NIB + laporan keuangan + foto usaha, approve mengirim email otomatis
- **Manajemen Transaksi**: tabel bukti transfer pending, tombol konfirmasi → generate invoice otomatis
- **Manajemen Bagi Hasil**: tabel pengajuan disbursement UMKM, panel review breakdown per investor, approve → trigger proses distribusi
- **Laporan**: metric ringkasan (transaksi masuk, bagi hasil diproses, fee terkumpul), grafik fee per bulan, export Excel/PDF

**Catatan penting**: Panel UMKM dan Panel Admin menggunakan tema visual yang identik (teal, sidebar putih) karena keduanya adalah panel manajemen/internal — bedanya hanya pada menu dan scope data yang bisa diakses.

---

## 5. Rekomendasi Skema Database (PostgreSQL)

Tabel inti yang perlu ada (sesuaikan dengan Eloquent migration Laravel):

```
users                    -- shared table, punya role: investor | umkm | admin
investors                -- profil investor: no_ktp, alamat, no_rekening, bank, kyc_status
umkms                     -- profil UMKM: nama_usaha, kategori, kota, nib, target_dana,
                             persen_bagi_hasil, status (pending/approved/rejected), deskripsi
kyc_documents             -- foreign key ke investors: path_ktp, path_selfie, status, catatan_admin
umkm_documents            -- foreign key ke umkms: path_nib, path_laporan_keuangan,
                             path_foto_usaha, path_surat_perjanjian
investments                -- investor_id, umkm_id, nominal, persen_kepemilikan,
                             status (pending/confirmed/active/completed), bukti_transfer_path
invoices                  -- investment_id, nomor_invoice, path_pdf, tanggal_terbit
profit_reports             -- umkm_id, periode, keuntungan_kotor, biaya_operasional,
                             keuntungan_bersih, status (draft/submitted/approved/processed/overdue)
profit_distributions       -- profit_report_id, investment_id, nominal_bagi_hasil, status, tanggal_cair
notifications              -- polymorphic: user_id, tipe, judul, deskripsi, is_read
platform_fees               -- profit_report_id, nominal_fee, periode
```

Index penting: `umkms.status`, `investments.status`, `profit_reports.status`, `kyc_documents.status` — karena semua panel admin berbasis filter status ini.

---

## 5.5 Arsitektur Auth — Wajib Mendukung Multi-Role Login Antar Tab

Requirement: user harus bisa login sebagai admin di satu tab browser dan investor/UMKM di tab lain secara bersamaan, tanpa harus logout dulu.

**Root cause kalau ini gagal**: cookie dan `localStorage` di-share ke seluruh tab dalam satu origin browser. Kalau auth disimpan di salah satu dari keduanya (termasuk Laravel Sanctum mode SPA/cookie-based default), login di tab manapun otomatis berlaku juga di tab lain.

**Solusi**:
- Backend: Laravel Sanctum mode **token API** (bukan SPA/cookie) — token dikembalikan di response body saat login, bukan di-set sebagai cookie
- Frontend: simpan token di **`sessionStorage`** (unik per tab), kirim via header `Authorization: Bearer {token}` di setiap request
- Logout hanya me-revoke token yang aktif di tab tersebut, bukan seluruh token milik user

Lihat detail lengkap di `PROMPT_BACKEND_IMPLEMENTATION.md` (bagian AUTENTIKASI & OTORISASI) dan `PROMPT_FRONTEND_IMPLEMENTATION.md` (bagian AUTH STORAGE).

---

## 6. Rekomendasi Struktur Folder

```
app/
  Models/
    User.php, Investor.php, Umkm.php, Investment.php,
    ProfitReport.php, ProfitDistribution.php, KycDocument.php, UmkmDocument.php
  Http/Controllers/
    Investor/  (HomeController, DetailUmkmController, PortfolioController, ...)
    Umkm/      (DashboardController, ProfitReportController, ...)
    Admin/     (KycController, UmkmManagementController, ProfitDistributionController, ...)
  Services/
    ProfitSharingCalculator.php   -- logic perhitungan bagi hasil (lihat formula section 3)
    InvoiceGeneratorService.php

resources/js/
  Pages/
    Landing/
    Investor/   (Home, Detail, Transaksi, Portfolio, Notifikasi, Profil)
    Umkm/       (Dashboard, DaftarInvestor, PengajuanBagiHasil, Riwayat, ProfilUsaha)
    Admin/      (Dashboard, Kyc, ManajemenUmkm, Transaksi, BagiHasil, Laporan)
  Components/
    ui/          -- Button, Badge, Card, ProgressBar, Sidebar (reusable, styled dgn Tailwind)
    layouts/     -- SidebarLayoutGreen.jsx (investor), SidebarLayoutTeal.jsx (umkm+admin)

tailwind.config.js  -- extend theme.colors dengan token di section 2.1 & 2.2
```

### Tailwind config suggestion

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      green: { 50:'#F0FDF4',100:'#D1FAE5',200:'#86EFAC',400:'#22C55E',500:'#16A34A',600:'#166534',800:'#1B4332',950:'#0A1F14' },
      teal:  { 50:'#E1F5EE',100:'#9FE1CB',300:'#5DCAA5',500:'#1D9E75',700:'#0F6E56',800:'#085041',900:'#04342C' },
    },
    fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    borderRadius: { DEFAULT: '8px', lg: '14px' },
  }
}
```

---

## 7. File Referensi Visual (prototype HTML)

4 file HTML statis (vanilla, sudah pakai Tabler Icons, tanpa emoji) sebagai acuan struktur dan interaksi — convert ke komponen React + Tailwind saat implementasi nyata:

- `microinvest-landing.html` — Landing Page lengkap
- `microinvest-panel-investor.html` — 6 halaman investor (SPA-style sidebar nav)
- `microinvest-panel-umkm.html` — 5 halaman UMKM
- `microinvest-panel-admin.html` — 6 halaman admin

Setiap file punya JS sederhana untuk page-switching dan kalkulasi real-time (estimasi return, breakdown bagi hasil) — logic ini yang perlu di-port ke React state + backend Laravel Service untuk kalkulasi resmi.

---

## 8. Cara pakai dokumen ini di Claude Code

Saat mulai project baru di VS Code:
1. Taruh file ini di root project sebagai `CLAUDE.md` atau `.claude/context.md`
2. Sertakan juga 4 file HTML prototype di folder `references/`
3. Prompt awal ke Claude Code: "Baca CLAUDE.md dan references/, buatkan struktur Laravel + React + Tailwind untuk [halaman spesifik], ikuti design token dan struktur folder yang sudah ditentukan"
