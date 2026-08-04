# PROMPT — Implementasi Frontend MicroInvest (React + Tailwind, Responsive)

> Paste prompt ini ke Claude Code setelah `CLAUDE.md` (context file) dan folder `references/` (4 HTML prototype) sudah ada di root project.

---

## Prompt

```
Baca CLAUDE.md dan seluruh file di folder references/ sebagai acuan design system, alur bisnis, dan struktur halaman.

Implementasikan frontend MicroInvest menggunakan React + Tailwind CSS, mengikuti struktur berikut:

KONTEKS TEKNIS
- Stack: Laravel + Inertia.js + React (atau React SPA terpisah dengan REST API — sebutkan pilihanmu)
- Styling: Tailwind CSS dengan token warna dari CLAUDE.md section 2 (tema hijau untuk Landing+Investor, tema teal untuk UMKM+Admin)
- Icon: @tabler/icons-react — jangan gunakan emoji sama sekali
- Font: Inter (Google Fonts atau self-hosted)

ARSITEKTUR KOMPONEN
Bangun dengan struktur atomic, reusable di seluruh panel:

1. components/ui/ (komponen dasar, dipakai lintas panel)
   - Button (variant: primary, outline, ghost — per tema warna)
   - Badge (variant: success, warning, danger, neutral)
   - Card, MetricCard
   - ProgressBar (dengan label persentase)
   - Input, TextArea, Select, FileUpload (drag & drop + preview)
   - Table (sortable, dengan empty state)
   - Modal / Dialog
   - Toast (lihat PROMPT_FEEDBACK_SYSTEM.md untuk spesifikasi lengkap)
   - Accordion (untuk FAQ)
   - Tabs
   - Avatar (inisial fallback)
   - Skeleton (loading state untuk card, table, list)

2. components/layouts/
   - SidebarLayoutGreen (Panel Investor) — sidebar putih, active state hijau
   - SidebarLayoutTeal (Panel UMKM & Admin) — sidebar putih, active state teal
   - PublicLayout (Landing Page) — navbar dark green sticky

3. pages/ per panel, sesuai struktur halaman di CLAUDE.md section 4

RESPONSIVE — WAJIB DI SETIAP HALAMAN
Breakpoint Tailwind: sm (640px), md (768px), lg (1024px), xl (1280px)

- Sidebar (Investor/UMKM/Admin): collapse jadi off-canvas drawer di bawah lg breakpoint, trigger dengan hamburger icon di top bar mobile. Tambahkan overlay gelap saat drawer terbuka, tutup dengan tap di luar area drawer atau tombol close.
- Grid UMKM (Home/Explore, Showcase landing): 3 kolom desktop → 2 kolom tablet (md) → 1 kolom mobile (di bawah sm)
- Detail UMKM: layout 2 kolom (info + action card sticky) desktop → stack vertikal di mobile, action card pindah ke bawah (bukan sticky) di mobile
- Tabel (Daftar Investor, Riwayat, Manajemen KYC/UMKM/Transaksi): scroll horizontal dengan wrapper `overflow-x-auto` di mobile, atau ubah jadi card-list di breakpoint kecil untuk tabel dengan >4 kolom
- Metric grid (4 kolom Portfolio, 3 kolom Dashboard): 2 kolom di tablet, 1 kolom di mobile
- Form (Pengajuan Bagi Hasil, Profil): 2 kolom → 1 kolom di mobile
- Navbar landing page: nav links disembunyikan di mobile, ganti hamburger menu dengan drawer

INTERAKTIVITAS YANG HARUS DIPORT DARI PROTOTYPE
- Kalkulator estimasi return (Detail UMKM investor): update on-change nominal input, gunakan useState + useMemo, format currency dengan Intl.NumberFormat('id-ID')
- Kalkulator bagi hasil (Pengajuan UMKM): keuntungan kotor - operasional = bersih, lalu breakdown per investor — port logic ini tapi hasil akhir harus divalidasi ulang oleh backend (jangan percaya kalkulasi frontend untuk data yang disimpan)
- FAQ accordion, tab switching (Detail UMKM), filter chip (Home/Explore)
- Panel review inline (Admin: KYC/UMKM/Bagi Hasil) — tampilkan sebagai modal atau expand-in-place, sertakan state loading saat submit approve/reject

STATE MANAGEMENT
- Data fetching: React Query (TanStack Query) atau Inertia's built-in page props — pilih salah satu dan konsisten di seluruh app
- Form state: react-hook-form + zod untuk validasi client-side (schema harus mirror validasi backend)
- Auth/user state: Context API, di-hydrate dari token yang tersimpan (lihat bagian AUTH STORAGE di bawah)

AUTH STORAGE — WAJIB PAKAI sessionStorage, BUKAN localStorage

Requirement penting: user harus bisa login sebagai admin di satu tab browser dan login sebagai investor/UMKM di tab lain secara bersamaan, tanpa saling logout.

- `localStorage` DAN cookie browser di-share ke SELURUH tab dalam origin yang sama — kalau token/session disimpan di situ, login di tab manapun otomatis "menular" ke tab lain. Ini penyebab masalah "harus logout dulu" yang dialami sebelumnya.
- `sessionStorage` unik PER TAB (walau origin sama, tab berbeda punya sessionStorage terpisah) — ini yang harus dipakai untuk menyimpan token auth.

Implementasi:
- Simpan token dari response login backend (lihat PROMPT_BACKEND_IMPLEMENTATION.md — token API Sanctum) ke `sessionStorage.setItem('auth_token', token)`
- Buat axios instance dengan interceptor yang otomatis menambahkan header `Authorization: Bearer ${sessionStorage.getItem('auth_token')}` di setiap request
- Saat logout: hit endpoint logout (revoke token di backend) lalu `sessionStorage.removeItem('auth_token')` — jangan clear localStorage karena tidak dipakai untuk auth
- User state (nama, role, dll) di-fetch ulang dari endpoint `/me` setiap kali app pertama kali load di tab tersebut (baca token dari sessionStorage → validasi ke backend → hydrate context), bukan disimpan manual supaya selalu sinkron dengan backend
- Kalau butuh "tetap login setelah tab ditutup dan dibuka lagi" (persistence), itu trade-off yang harus didiskusikan — sessionStorage hilang saat tab ditutup. Kalau requirement multi-role-per-tab lebih penting daripada persistence lintas sesi browser, sessionStorage tetap pilihan yang benar. Kalau butuh keduanya, pertimbangkan opsi lanjutan seperti BroadcastChannel API atau isolasi lewat subdomain per role (didiskusikan terpisah, jangan diimplementasikan default)

FORM VALIDATION (client-side, sebelum submit ke backend)
- Nominal investasi: minimum Rp 500.000, harus angka
- Upload file: validasi tipe (jpg/png/pdf) dan ukuran (maks 5MB) sebelum upload, tampilkan preview
- Field wajib: tandai dengan indicator visual, validasi on-blur bukan hanya on-submit

ACCESSIBILITY
- Semua interactive element (button, link, chip) harus keyboard-navigable dengan visible focus ring
- Form input punya label yang terasosiasi (htmlFor/id)
- Modal/drawer trap focus dan bisa ditutup dengan Escape
- Alt text untuk semua icon yang membawa makna fungsional (bukan dekoratif)

OUTPUT YANG DIHARAPKAN
Mulai dari satu panel dulu (sebutkan mana), buat:
1. Layout wrapper (sidebar + responsive behavior)
2. Semua halaman di panel tersebut sebagai komponen terpisah
3. Reusable UI components yang dipakai
4. Placeholder untuk data fetching (siap dihubungkan ke API Laravel nanti)

Jangan gunakan data dummy hardcoded di komponen final — gunakan props/API response, tapi sediakan mock data terpisah untuk development (mocks/ folder atau Storybook jika dipakai).
```

---

## Cara pakai

1. Ganti bagian **"Mulai dari satu panel dulu (sebutkan mana)"** dengan panel yang ingin dikerjakan lebih dulu — misal "Panel Investor: Home dan Detail UMKM"
2. Kerjakan panel demi panel, jangan minta semua sekaligus dalam satu prompt — kualitas kode akan lebih terjaga
3. Setelah satu panel selesai, minta review responsive-nya secara eksplisit: "Cek ulang breakpoint mobile untuk halaman ini, screenshot kalau environment mendukung"
