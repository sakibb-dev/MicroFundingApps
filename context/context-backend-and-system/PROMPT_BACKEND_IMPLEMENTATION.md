# PROMPT — Implementasi Backend MicroInvest (Laravel + PostgreSQL)

> Paste prompt ini ke Claude Code setelah `CLAUDE.md` sudah ada di root project.

---

## Prompt

```
Baca CLAUDE.md sebagai acuan alur bisnis, formula perhitungan bagi hasil, dan skema database yang disarankan.

Implementasikan backend MicroInvest menggunakan Laravel + PostgreSQL, dengan prinsip: setiap fitur harus punya validasi ketat, error handling konsisten, dan tidak boleh ada state yang korup akibat race condition atau request gagal di tengah proses.

DATABASE & MODEL
Buat migration untuk seluruh tabel di CLAUDE.md section 5, dengan tambahan berikut:
- Semua tabel punya `created_at`, `updated_at`, dan soft delete (`deleted_at`) kecuali tabel log/audit
- Foreign key selalu pakai `constrained()->cascadeOnDelete()` atau `restrictOnDelete()` sesuai konteks (contoh: investment tidak boleh cascade delete kalau ada distribusi terkait — pakai restrict)
- Tambahkan kolom `status` sebagai enum yang eksplisit (Laravel enum class), bukan string bebas, untuk: kyc_documents, umkms, investments, profit_reports
- Index pada semua kolom `status` dan foreign key yang sering di-filter

Model dengan relasi lengkap (hasOne, hasMany, belongsTo) dan sertakan:
- Accessor untuk data yang perlu disamarkan (nama investor jadi inisial di tampilan publik UMKM)
- Scope query untuk status umum (`scopePending()`, `scopeApproved()`, dst)

AUTENTIKASI & OTORISASI
- 3 role: investor, umkm, admin — gunakan Laravel Policy atau Spatie Permission
- Middleware per route group memastikan investor tidak bisa akses endpoint UMKM/Admin dan sebaliknya
- KYC investor harus approved sebelum bisa akses endpoint investasi — cek ini di middleware atau Form Request, jangan hanya di frontend
- UMKM harus approved sebelum campaign muncul di listing publik — pastikan query publik selalu filter status

BUSINESS LOGIC — PERHATIAN KHUSUS
1. ProfitSharingCalculatorService
   - Implementasikan formula persis dari CLAUDE.md section 3
   - Semua perhitungan uang pakai integer (rupiah, bukan desimal float) untuk hindari floating point error — atau gunakan library seperti brick/money
   - Method ini harus pure function yang bisa di-unit-test tanpa hit database

2. Alur konfirmasi investasi
   - Saat investor upload bukti transfer → status investment jadi "pending_confirmation", BELUM mengurangi slot funding
   - Admin approve → baru status jadi "confirmed", funding UMKM bertambah, invoice PDF di-generate via queue job, email dikirim
   - Gunakan DB transaction untuk seluruh proses approve (update investment + update umkm.total_terkumpul + generate invoice) — kalau salah satu gagal, semua rollback

3. Alur pengajuan bagi hasil
   - UMKM submit → status "submitted", data breakdown per investor dihitung dan disimpan (jangan hanya dihitung on-the-fly saat approve, supaya ada jejak apa yang diajukan vs yang diapprove)
   - Admin approve → trigger job untuk generate profit_distributions per investor, kirim notifikasi ke setiap investor, update status jadi "processed"
   - Tambahkan validasi: total breakdown yang tersimpan harus sama persis dengan total_bagi_hasil (gunakan assertion/test untuk floating point drift)

4. Overdue detection
   - Buat scheduled command (Laravel Scheduler) yang jalan harian, cek profit_reports yang lewat deadline tanpa submit → ubah status jadi "overdue" dan kirim notifikasi ke UMKM

FILE UPLOAD
- Validasi tipe file: KTP/selfie/foto usaha (jpg, jpeg, png, maks 5MB), dokumen (pdf, jpg, png, maks 5MB)
- Simpan di disk terpisah per tipe dokumen dengan naming convention: `{model}_{id}_{tipe}_{timestamp}.{ext}` — hindari collision dan permudah audit
- Validasi MIME type asli (bukan cuma ekstensi) untuk cegah upload file berbahaya
- Untuk data sensitif (KTP, selfie) pertimbangkan disk private dengan signed URL yang expire, bukan public disk

VALIDASI (Form Request per endpoint)
- Buat Form Request class terpisah untuk setiap action, jangan validasi inline di controller
- Pesan error harus dalam Bahasa Indonesia, jelas, dan actionable — lihat PROMPT_FEEDBACK_SYSTEM.md untuk standar pesan
- Contoh validasi kritis:
  - Nominal investasi: minimum 500000, tidak boleh melebihi sisa slot funding UMKM (`target_dana - total_terkumpul`)
  - Keuntungan kotor harus >= biaya operasional (tidak boleh keuntungan bersih negatif tanpa approval khusus)
  - Upload KTP wajib ada sebelum submit KYC

API RESPONSE FORMAT — KONSISTEN DI SELURUH ENDPOINT
Sukses:
{
  "success": true,
  "message": "Pesan singkat dalam Bahasa Indonesia",
  "data": { ... }
}

Gagal (validasi):
{
  "success": false,
  "message": "Data yang dikirim tidak valid",
  "errors": { "nominal": ["Nominal minimum investasi adalah Rp 500.000"] }
}

Gagal (business logic, contoh: slot funding penuh):
{
  "success": false,
  "message": "Sisa slot funding tidak cukup untuk nominal ini",
  "code": "FUNDING_SLOT_INSUFFICIENT"
}

Gunakan custom Exception class per skenario bisnis penting (FundingSlotInsufficientException, KycNotVerifiedException, dll) yang di-catch di Handler.php dan otomatis di-convert ke format response di atas — jangan biarkan exception generic Laravel bocor ke response (500 tanpa konteks).

NOTIFIKASI & EMAIL
- Gunakan Laravel Notification (database + mail channel) untuk: KYC approved/rejected, UMKM approved/rejected, investasi dikonfirmasi, bagi hasil cair, pengajuan overdue
- Semua email dan notifikasi database dikirim lewat queue job, jangan synchronous — supaya request admin (approve KYC misal) tidak lambat menunggu SMTP
- Invoice dan perjanjian PDF juga di-generate via queue job, hasil disimpan, baru email dikirim dengan attachment/link

TESTING
Buat feature test untuk alur kritis minimal:
- Investor tidak bisa investasi kalau KYC belum approved
- Investasi tidak bisa melebihi sisa slot funding
- Approve bagi hasil menghasilkan total distribusi yang sama persis dengan total_bagi_hasil yang diajukan
- UMKM non-approved tidak muncul di listing publik

ENDPOINT YANG DIBUTUHKAN (kelompokkan per panel)
Sebutkan daftar endpoint lengkap dengan method + path sebelum mulai coding, supaya bisa saya review urutan prioritasnya. Mulai implementasi dari modul yang saya tentukan lebih dulu.
```

---

## Cara pakai

1. Jalankan prompt ini bertahap per modul — misalnya mulai dari **Auth + KYC**, baru **Investment flow**, baru **Profit sharing**, baru **Admin management**
2. Selalu minta Claude Code menampilkan daftar endpoint dan skema request/response dulu sebelum generate kode, supaya bisa dicek alurnya sebelum banyak kode ditulis
3. Untuk logic keuangan (ProfitSharingCalculatorService), selalu minta unit test disertakan di response yang sama
