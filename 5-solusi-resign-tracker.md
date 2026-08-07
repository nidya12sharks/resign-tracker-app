# 5 Alternatif Solusi: Sistem Tracking Proses Resign Karyawan

**Constraint yang jadi acuan:** Pihak terkait (atasan, IT, Finance, GA) bukan user harian — solusi harus bisa dipakai tanpa training panjang, idealnya tanpa login.

---

## Solusi 1: Checklist Tracker Sederhana (Single Page, HR-Only Update)
Satu halaman berisi daftar karyawan resign dengan checklist status clearance (Atasan, IT, Finance, GA). Hanya HR yang bisa update status — hasil koordinasi manual (WA/telepon) tetap diinput manual oleh HR ke sistem.

**Kelemahan:**
- HR tetap jadi single point of update — tidak menyelesaikan pain point utama yaitu "harus chase pihak lain"
- Tidak ada visibility real-time buat pihak lain, karena hanya HR yang bisa lihat & edit
- Rawan human error kalau HR lupa update setelah dapat info dari WA

---

## Solusi 2: Multi-Role Dashboard dengan Link Unik per Approver
Tiap pihak (atasan, IT, Finance, GA) mendapat link unik per kasus resign untuk update status tugas mereka sendiri, tanpa perlu login/akun.

**Kelemahan:**
- Link bisa hilang, lupa, atau ke-forward ke orang salah — tidak ada kontrol otomatis
- Tanpa layanan notifikasi tambahan (email/WA), tetap butuh HR untuk mengirim link secara manual
- Keamanan lemah: siapapun yang punya link bisa update status, tanpa verifikasi identitas

---

## Solusi 3: Sistem dengan Notifikasi Email Otomatis
Sama seperti solusi 2, tapi ditambah pengiriman email otomatis ke pihak terkait setiap kali ada perubahan status atau kasus baru dibuka.

**Kelemahan:**
- Butuh setup layanan email (SMTP/Resend/dst) — menambah kompleksitas teknis & biaya untuk tim non-tech maintain jangka panjang
- Email berisiko masuk folder spam/promosi, terutama di email korporat dengan filter ketat
- Kalau layanan email gagal (limit terlampaui, dsb), seluruh alur notifikasi macet tanpa disadari

---

## Solusi 4: Kanban Board Visual (Drag & Drop ala Trello)
HR dan pihak terkait menggeser "kartu" nama karyawan antar kolom: Resign Diajukan → Approval Atasan → Clearance IT → Clearance Finance → Clearance GA → Selesai.

**Kelemahan:**
- Kalau semua orang bebas drag kartu, rawan salah geser tanpa validasi (misal lompat kolom padahal syarat belum lengkap)
- Visual bagus untuk overview, tapi kurang detail untuk kebutuhan audit (siapa approve, kapan, catatan apa)
- Butuh effort lebih di frontend (drag & drop interaction) dibanding solusi berbasis form biasa

---

## Solusi 5: Formulir + Auto-Generate Dokumen
Begitu semua status clearance "selesai", sistem otomatis membuat draft surat referensi kerja / surat keterangan siap ditandatangani.

**Kelemahan:**
- Kompleksitas paling tinggi untuk dibangun (perlu template generation dokumen) — berisiko terlalu ambisius untuk waktu pengerjaan bootcamp yang terbatas
- Kalau template surat berubah-ubah sesuai kebijakan, perlu maintenance rutin di kode, bukan cuma di dokumen
- Fitur ini "nice to have" tapi bukan inti masalah utama (visibility & tracking), jadi berisiko menghabiskan waktu di fitur sekunder
