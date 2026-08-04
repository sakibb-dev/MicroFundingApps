# PROMPT — Feedback System MicroInvest (Error, Success, Warning, Empty State)

> Paste prompt ini setelah frontend dan backend dasar sudah berjalan. Sistem ini menjembatani respons backend (PROMPT_BACKEND_IMPLEMENTATION.md) dengan tampilan di frontend (PROMPT_FRONTEND_IMPLEMENTATION.md).

---

## Prompt

```
Implementasikan sistem feedback menyeluruh untuk MicroInvest — mencakup notifikasi sukses, error, warning, loading state, dan empty state. Tujuannya: user tidak pernah bingung apakah aksinya berhasil, gagal, atau sedang diproses.

1. TOAST NOTIFICATION COMPONENT
Buat komponen Toast yang bisa dipanggil dari mana saja (via context/hook, contoh: useToast().success(...)):

Variant dan styling (ikuti token warna CLAUDE.md):
- success: bg hijau/teal-50 (sesuai tema panel aktif), border kiri success (#10B981), icon IconCircleCheck
- error: bg merah muda, border kiri danger (#EF4444), icon IconAlertCircle
- warning: bg kuning muda, border kiri warning (#F59E0B), icon IconAlertTriangle
- info: bg neutral-50, border kiri neutral-500, icon IconInfoCircle

Perilaku:
- Muncul di pojok kanan atas (desktop) / bawah tengah (mobile), auto-dismiss 4 detik untuk success/info, TIDAK auto-dismiss untuk error (user harus close manual atau baca dulu)
- Bisa stack beberapa toast sekaligus, maksimal 3 terlihat, sisanya antre
- Punya tombol close (X) di semua variant

2. GLOBAL ERROR INTERCEPTOR (frontend)
Pasang di axios/fetch wrapper:
- Response 422 (validasi): tampilkan pesan per-field di form (inline, di bawah input terkait), JANGAN hanya toast generik
- Response 401: redirect ke halaman login + toast "Sesi kamu berakhir. Masuk lagi untuk melanjutkan."
- Response 403: toast "Kamu tidak punya akses untuk melakukan ini."
- Response 404: toast "Data yang kamu cari tidak ditemukan."
- Response 429: toast "Terlalu banyak percobaan. Tunggu beberapa saat lalu coba lagi."
- Response 500 / network error: toast "Ada gangguan di server kami. Coba lagi dalam beberapa saat." — JANGAN tampilkan pesan teknis/stack trace ke user
- Response dengan `code` spesifik (dari custom exception backend, contoh FUNDING_SLOT_INSUFFICIENT): map ke pesan yang sudah disiapkan di tabel bawah, bukan pesan generik dari `message` field kalau ada yang lebih baik

3. TABEL PESAN — per skenario aplikasi (Bahasa Indonesia, aktif, actionable, tanpa prefix "Error:")

INVESTOR
| Skenario | Pesan |
|---|---|
| KYC belum lengkap saat coba investasi | "Lengkapi verifikasi KYC dulu sebelum berinvestasi. Cek status di halaman Profil." |
| KYC masih pending | "KYC kamu sedang direview. Biasanya selesai dalam 1x24 jam." |
| KYC ditolak | "Verifikasi KYC kamu ditolak: {alasan dari admin}. Ajukan ulang dengan dokumen yang jelas." |
| Nominal investasi di bawah minimum | "Nominal investasi minimal Rp 500.000." |
| Nominal melebihi sisa slot funding | "Nominal melebihi sisa slot funding. Sisa slot: Rp {jumlah}." |
| Upload bukti transfer gagal (ukuran) | "Ukuran file maksimal 5MB. Kompres dulu atau pilih file lain." |
| Upload bukti transfer gagal (tipe) | "Format file harus JPG, PNG, atau PDF." |
| Investasi berhasil dikirim | "Bukti transfer terkirim. Kami akan konfirmasi dalam 1x24 jam." |
| Investasi dikonfirmasi admin | "Investasimu ke {nama UMKM} sudah dikonfirmasi. Invoice terkirim ke emailmu." |
| Bagi hasil cair | "Rp {jumlah} dari {nama UMKM} sudah masuk ke rekeningmu." |

UMKM
| Skenario | Pesan |
|---|---|
| Submit pengajuan bagi hasil berhasil | "Pengajuan bagi hasil periode {bulan} terkirim. Menunggu review admin." |
| Keuntungan kotor kosong/invalid | "Isi keuntungan kotor bulan ini dengan angka yang valid." |
| Keuntungan bersih negatif | "Biaya operasional tidak boleh melebihi keuntungan kotor. Periksa kembali angkanya." |
| Laporan keuangan belum diupload | "Upload laporan keuangan sebelum submit pengajuan." |
| Pengajuan mendekati deadline | "Deadline pengajuan bagi hasil tinggal {n} hari. Submit sekarang untuk hindari status terlambat." |
| Pengajuan terlambat (overdue) | "Pengajuan bulan {bulan} sudah lewat deadline. Segera hubungi admin untuk tindak lanjut." |
| Pendaftaran UMKM ditolak | "Pendaftaran usahamu ditolak: {alasan dari admin}. Kamu bisa daftar ulang dengan dokumen yang diperbaiki." |
| Pendaftaran UMKM disetujui | "Selamat, {nama usaha} sudah aktif di platform dan bisa menerima investasi." |

ADMIN
| Skenario | Pesan |
|---|---|
| Approve KYC | "KYC {nama investor} disetujui." |
| Tolak KYC tanpa alasan diisi | "Isi alasan penolakan sebelum mengirim." |
| Approve UMKM | "{nama usaha} disetujui dan email pemberitahuan terkirim." |
| Konfirmasi transfer | "Transfer investasi dikonfirmasi. Invoice otomatis dikirim ke investor." |
| Approve bagi hasil | "Bagi hasil {nama usaha} periode {bulan} diproses. Distribusi ke {n} investor dimulai." |
| Approve gagal (data breakdown tidak sesuai) | "Total breakdown tidak sesuai dengan total bagi hasil. Periksa kembali data pengajuan." |

UMUM / SISTEM
| Skenario | Pesan |
|---|---|
| Tidak ada koneksi internet | "Kamu sedang offline. Periksa koneksi internet dan coba lagi." |
| Form belum lengkap saat submit | "Lengkapi semua kolom wajib sebelum melanjutkan." |
| Aksi berhasil disimpan (generic) | "Perubahan tersimpan." |
| Sesi berakhir | "Sesi kamu berakhir. Masuk lagi untuk melanjutkan." |

4. EMPTY STATES (bukan error, tapi bagian dari feedback system)
Setiap halaman list/tabel butuh empty state yang jelas, bukan tabel kosong tanpa konteks:

| Halaman | Judul | Body | CTA |
|---|---|---|---|
| Home/Explore (belum ada UMKM sesuai filter) | "Tidak ada UMKM yang cocok" | "Coba ubah kata kunci atau filter kategori." | Reset filter |
| Portfolio (investor belum pernah investasi) | "Belum ada investasi" | "Mulai danai UMKM pilihanmu dan dapatkan bagi hasil bulanan." | Jelajahi UMKM |
| Notifikasi (kosong) | "Belum ada notifikasi" | "Notifikasi tentang investasi dan bagi hasil akan muncul di sini." | — |
| UMKM: Daftar Investor (belum ada investor) | "Belum ada investor" | "Investor yang mendanai usahamu akan muncul di sini." | — |
| Admin: KYC pending (semua sudah direview) | "Semua KYC sudah direview" | "Tidak ada pengajuan verifikasi yang menunggu saat ini." | — |

5. LOADING & OPTIMISTIC FEEDBACK
- Tombol yang trigger request async (Submit, Approve, Konfirmasi): disabled + tampilkan spinner + ubah teks sementara ("Menyimpan..." bukan hilangkan teks lama), jangan biarkan bisa diklik dobel
- List/tabel saat fetch pertama: skeleton loader, BUKAN spinner di tengah halaman kosong
- Perubahan status (misal approve KYC di tabel admin): update baris secara optimistic, rollback dengan toast error kalau request gagal

6. CONFIRMATION DIALOG untuk aksi kritis/tidak bisa dibatalkan
Wajib ada dialog konfirmasi sebelum eksekusi untuk:
- Submit pengajuan bagi hasil (UMKM) — karena akan masuk antrian review admin
- Approve/Tolak KYC, UMKM, Transaksi, Bagi Hasil (Admin) — terutama Tolak, karena butuh alasan
- Investasi Sekarang (Investor) — konfirmasi nominal sebelum lanjut ke halaman upload bukti transfer

Dialog: judul jelas ("Kirim pengajuan bagi hasil?"), body singkat konsekuensinya, 2 tombol (batal = ghost, konfirmasi = primary sesuai tema panel).

OUTPUT YANG DIHARAPKAN
1. Komponen Toast + hook useToast
2. Axios/fetch interceptor dengan mapping error di atas
3. Komponen EmptyState reusable (icon + judul + body + CTA opsional)
4. Komponen ConfirmDialog reusable
5. Terapkan ke minimal satu alur penuh dulu sebagai contoh (misalnya alur investasi investor dari klik "Investasi Sekarang" sampai toast konfirmasi) sebelum saya minta diterapkan ke alur lain.
```

---

## Cara pakai

1. Jalankan setelah struktur dasar frontend + backend sudah ada, supaya toast dan interceptor bisa langsung dites dengan endpoint asli
2. Minta satu alur penuh dulu sebagai contoh (poin 5 di output) — supaya polanya jelas sebelum diterapkan ke semua fitur
3. Tabel pesan di atas bisa ditambah manual di prompt kalau ada skenario error baru yang ditemukan pas testing
