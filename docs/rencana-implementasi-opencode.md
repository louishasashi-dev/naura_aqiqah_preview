# Rencana Implementasi OpenCode — Naura Aqiqah (VERSI FINAL)

Dasar: pembacaan `index.html`, `js/assets.js`, `js/site.js`, `css/style.css` (≈ seluruhnya), `daftar-aset.csv`, `claude-handover-audit.md`, dan keputusan pemilik tanggal 25 Nov 2026.
Batas verifikasi: gambar tidak dilihat, browser tidak dijalankan, folder `docs/` tidak ikut ZIP. Rasio kontras dihitung dari kode warna.

## ATURAN KERAS (berlaku untuk semua langkah)
- JANGAN membangun ulang situs atau mengubah desain/tata letak yang sudah berjalan.
- JANGAN menyentuh `docs/` dan `referensi/` (kecuali MEMBACA/menyalin maskot, Langkah 2). JANGAN menghapus, mengganti nama, atau memindah file aset; salin jika perlu.
- JANGAN menebak isi gambar. Model ini tidak bisa membaca gambar: jangan mengklaim hasil inspeksi visual. Pemeriksaan teknis (dimensi, hash, ukuran file) boleh.
- Keputusan aset di luar daftar "Keputusan yang SUDAH ADA" = belum disetujui. Berhenti dan tanya.
- JANGAN menambah package.json/dependency ke proyek. Alat uji/unduh dijalankan dari folder sementara di luar proyek.
- Situs BELUM boleh dipublikasikan sampai bagian 6 (butir tertunda) selesai.

### Aset DILARANG (jangan dipakai atau direferensikan)
`barbeque-home-bg2.webp` (lokal & URL nauraaqiqah.com), `Sate-Naura-Aqiqah.webp`, `Gulai-Naura-Aqiqah.webp`, `tongseng-Naura-aqiqah-banner.webp`, `soup-Naura-Aqiqah.webp`, `NauraPutih-min.png` (2 lokasi), `halalfix-min.png`, `koki-min.png`, `Koper-copy-min.png`, `Piring-copy-min.png`, `Sertifkat-Halal-Naura-268x380.png`, `Sertifkat-Halal-Naura.png` (ADA di disk: `assets/img/sertifikat/`), file `DALL·E-2024-05-24-23.48.32-...The-desk.webp`.

## 1. Keputusan pemilik

### SUDAH ADA
| Kode | Keputusan |
|---|---|
| D2 | Header: logo gelap → `assets/img/logo/LogoNauraAqiqah.png`. Footer: logo terang → `assets/img/logo/Naura-icon-nav-teksPutih.png` (aturan pemilik: nama berisi "putih" = terang, sisanya gelap). |
| D3 | Maskot boleh disalin (bukan dipindah) dari `docs/` ke `assets/`. |
| D4 | Hapus gambar di bagian artikel; relabel tombol WhatsApp. Teks artikel dari WordPress lama menyusul dari pemilik. |
| D5 | Font: self-host Plus Jakarta Sans; font sistem sebagai cadangan agar teks selalu tampil. (Google Fonts tidak dipakai: redundan dengan self-host. Ubah hanya jika pemilik minta.) |
| D6 | Testimoni = teks contoh. Disembunyikan sampai ulasan asli siap (pemilik menambahkan nanti). |
| D7 | Opsi A: teks tetap putih. Pink awal pada elemen bertuliskan putih digelapkan ke `#e60077` (4,53:1 dengan putih). Hover memakai pink gelap `#a8005a` (7,47:1). |
| D8 | Tombol WhatsApp mengambang: ikut. Kompresi gambar: ikut, tetapi ditunda sampai foto final dipilih. |

### TERTUNDA (JANGAN dikerjakan; jangan menebak)
| Kode | Butir | Status |
|---|---|---|
| D1 | File untuk hero dan menu1–4 (termasuk `Copy of …142241` untuk menu1) | Pemilik menyiapkan nanti. Slot tetap placeholder. |
| D9 | Teks syarat untuk tanda `*` "Free Ongkir Jabodetabek*" | Menunggu diskusi dengan owner. Jangan ubah teks/tanda `*`. |
| D10 | Teks artikel dari WordPress lama | Menunggu dari pemilik. Biarkan teks artikel yang ada. |
| D11 | Favicon dan gambar Open Graph | Belum ada pilihan gambar. Jangan menambahkan. |

## 2. Koreksi terhadap laporan audit
| Klaim | Hasil |
|---|---|
| 9 path hilang | Cocok: `assets.js` baris 7, 15, 39, 47, 55, 63, 119, 127, 135 |
| 9 slot jadi placeholder | Sebenarnya 7 slot rusak (logo ×2, hero, menu1–4) + 2 slot artikel yang disengaja. Decor 1/3/4 tidak punya slot di HTML → dampak nol |
| 15 path di config | 17 entri; 2 artikel tanpa src → 15 path berisi. Cocok |
| 56 file di assets/ | Cocok (CSV) |
| Mascot termuat | Tidak terverifikasi: path di `docs/struktur-web/gambaran-section-ui web_files/iconnaura-copy-min.png` |

## 3. Temuan yang dikerjakan sekarang
**P0**
1. Logo hilang (`assets.js:7`), header dan footer memakai satu kunci `logo` yang sama (`index.html:17, 257`). Footer butuh kunci terpisah karena logonya berbeda.
2. Maskot bergantung pada folder `docs/` (`assets.js:23`).
3. Placeholder menampilkan nama file ke pengunjung (`label` hero, `assets.js:17`).
4. Teks internal di footer: "Dibangun dengan konfigurasi aset yang mudah diganti." (`index.html:263`).
5. Testimoni berisi teks contoh bernama (`index.html:184–197`): tidak boleh tampil sebagai ulasan asli.

**P1**
6. Artikel: dua slot placeholder (`index.html:208, 217`); tombol "Baca Selengkapnya" mengarah ke WhatsApp (213, 222).
7. Kontras gagal: putih/cyan `#00c8ff` = 1,96:1 (`.eyebrow.light`); putih/pink `#ff0084` dan pink/putih = 3,76:1 (`.btn-pink`, `.package-tag`, `.doc-body > span`, `.nav-cta:hover`); bintang `#ffb300`/putih = 1,79:1.
8. `.stars` memakai `aria-label` pada `<div>` tanpa `role` (`index.html:192–194`).
9. Nav tanpa tautan `#kontak` (`index.html:22–30`).
10. Font Plus Jakarta Sans tidak dimuat (`style.css:29`).

**P2**
11. "Sudah 15th Melayani" (`index.html:81`).
12. Menu mobile: Escape tidak mengembalikan fokus; `aria-expanded` bisa tertinggal saat resize (`site.js:46–71`).
13. Tautan `target="_blank"` tanpa pemberitahuan tab baru untuk pembaca layar.
14. `scroll-margin-top` untuk header sticky belum dicek; `theme-color` belum ada.

**P3 (disetujui)**
15. Tombol WhatsApp mengambang. 16. Kompresi salinan gambar (ditunda sampai foto final).

## 4. File yang diubah
| File | Lokasi | Perubahan |
|---|---|---|
| `js/assets.js` | `logo` src (7); tambah kunci baru `logoFooter`; `mascot` src (23); label hero (17) | Langkah 1–2 |
| `index.html` | 257 (`data-asset="logoFooter"`), 263, 81, 22–30, 184–197, 192–194, 206–224, sebelum `</footer>`/`</body>` (tombol WA), `<head>` | Langkah 1–6 |
| `css/style.css` | `:root` 1–14; `.btn-pink`, `.package-tag`, `.doc-body > span`, `.nav-cta:hover`, `.eyebrow.light`, `.stars`; `.article-*`; `.footer-brand`; `@font-face` baru; kelas tombol WA | Langkah 3–6 |
| `js/site.js` | 46–71 | Langkah 5 |
| `assets/img/logo/` | salinan maskot (file baru) | Langkah 2 |
| `assets/fonts/` | file `.woff2` (baru) | Langkah 6 |

Jangan diubah: `docs/`, `referensi/`, file aset lama, `status`/`verified` di `assets.js` (tetap `ALTERNATIF`/`false`).

## 5. Langkah berurutan untuk OpenCode

**Langkah 0 — Baseline.** Salin proyek ke `..\naura_backup_<tanggal>`. Jalankan `python -m http.server 8000`; uji dengan Playwright dari folder sementara di luar proyek. Catat: slot termuat, status HTTP semua gambar (cek `response.status() >= 400` DAN `img.naturalWidth > 0`, karena 404 gambar tidak muncul sebagai `requestfailed`), overflow, JS error.

**Langkah 1 — Logo (D2).**
1. Ubah `items.logo.src` (`assets.js:7`) menjadi `assets/img/logo/LogoNauraAqiqah.png`.
2. Tambah entri `logoFooter` di `assets.js` (struktur sama dengan `logo`; `src` = `assets/img/logo/Naura-icon-nav-teksPutih.png`; `alt` "Logo Naura Aqiqah"; `status: "ALTERNATIF"`; `verified: false`; `enabled: true`).
3. `index.html:257`: ubah `data-asset="logo"` → `data-asset="logoFooter"`.
4. Pemeriksaan teknis (bukan visual): laporkan dimensi piksel kedua logo dan bandingkan rasio dengan slot (`.brand-slot` 178×54; `.footer-brand` 190×60). Jika rasio sangat berbeda atau file tampak seperti ikon kecil, laporkan ke pemilik, jangan ubah CSS sendiri.
5. Hash (sha256) `Naura-icon-nav-teksPutih.png` dibandingkan dengan SEMUA file bernama `NauraPutih-min.png` yang ada di proyek (termasuk `docs/`). Jika identik, BERHENTI dan laporkan: file itu terlarang.
6. Ganti `label` yang memuat nama file (hero, `assets.js:17`) menjadi label netral, mis. "Foto hidangan".

**Langkah 2 — Maskot (D3).** Salin `docs/struktur-web/gambaran-section-ui web_files/iconnaura-copy-min.png` ke `assets/img/logo/iconnaura-copy-min.png`. Jika nama bentrok, STOP dan tanya. Setelah salinan ada dan terverifikasi (ukuran file sama), ubah `assets.js:23` ke `assets/img/logo/iconnaura-copy-min.png`. File asli di `docs/` tidak disentuh.

**Langkah 3 — Konten & artikel (D4, D6).**
1. Hapus `index.html:263` bagian "Dibangun dengan konfigurasi aset yang mudah diganti." (pertahankan hak cipta).
2. `index.html:81`: "Sudah 15th Melayani" → "Sudah 15 Tahun Melayani".
3. Artikel: hapus kedua `<div class="article-photo asset-slot" data-asset="article1|article2">` (baris 208, 217). Sesuaikan CSS `.article-*` agar kartu tanpa foto tetap rapi (jangan mengubah gaya lain). Biarkan entri `article1/article2` di `assets.js` (tidak dipakai).
4. Relabel tombol artikel (baris 213, 222): "Baca Selengkapnya →" menjadi "Tanya via WhatsApp →". Tautan WhatsApp tetap. Teks judul/isi artikel JANGAN diubah (D10).
5. Testimoni: tambahkan atribut `hidden` pada `<section id="testimoni">` (baris 184), sisipkan komentar `<!-- TODO: ganti dengan ulasan asli pelanggan, lalu hapus atribut hidden -->`, dan hapus tautan nav "Testimoni" (baris 27). Markup tetap ada. Pastikan CSS tidak menimpa `[hidden]` dengan `display` lain.
6. JANGAN mengubah tanda `*` pada "Free Ongkir Jabodetabek*" (D9).

**Langkah 4 — Kontras & a11y (D7 opsi A).**
1. Tambah token di `:root`: `--pink-strong: #e60077;` dan `--pink-hover: #a8005a;`. Token `--pink` (`#ff0084`) dipertahankan untuk elemen dekoratif tanpa teks.
2. `.btn-pink`, `.package-tag` (latar pink, teks putih): latar → `--pink-strong`. Hover `.btn-pink` → `--pink-hover`. `.nav-cta:hover` (latar jadi pink, teks putih) → `--pink-hover`.
3. `.doc-body > span` (teks pink di atas putih): warna → `--pink-strong`.
4. `.eyebrow.light` (≈ baris 243, putih di atas cyan): ganti teks ke `--deep` dengan latar putih semi-solid. Dilarang membiarkan putih di atas cyan.
5. Bintang `.stars`: ganti warna agar ≥ 3:1 terhadap latar kartu (hitung dan tampilkan rasionya) dan tambahkan `role="img"` pada ketiga `.stars` (`index.html:192–194`, section hidden tetap diperbaiki).
6. Hitung ulang kontras semua pasangan teks/latar yang disentuh; laporkan angkanya.

**Langkah 5 — Navigasi & interaksi.**
1. Tambah `<a href="#kontak">Kontak</a>` di `index.html:22–30` sebelum `.nav-cta`.
2. Uji lebar 981–1100 px: nav tidak boleh wrap atau overflow. Jika sempit, laporkan dengan dua opsi; jangan mengubah tata letak tanpa persetujuan.
3. `site.js`: tombol Escape menutup menu dan mengembalikan fokus ke `.nav-toggle`; saat lebar jendela > 980 px, reset `is-open`, `aria-expanded="false"`, `aria-label="Buka menu"`.
4. Tambahkan `scroll-margin-top` (sekitar tinggi header sticky 76 px) pada elemen `section[id]` jika belum ada.
5. Tautan `target="_blank"`: tambahkan teks tersembunyi untuk pembaca layar "(membuka tab baru)" atau `aria-label` setara, tanpa mengubah tampilan.
6. Tambahkan `<meta name="theme-color" content="#00c8ff">`.

**Langkah 6 — Font self-host (D5) dan tombol WhatsApp (D8).**
1. Font: unduh Plus Jakarta Sans (lisensi OFL, subset Latin) dalam bentuk `.woff2` untuk bobot yang dipakai CSS (periksa `font-weight` di `style.css`; kemungkinan 500/700/800), lewat paket `@fontsource/plus-jakarta-sans` yang dipasang di folder sementara. Salin hanya file `.woff2` ke `assets/fonts/`. Tambahkan `@font-face` dengan `font-display: swap`. Tumpukan font: `"Plus Jakarta Sans", "Segoe UI", system-ui, -apple-system, sans-serif`. Jika jaringan unduh ditolak, laporkan dan minta file dari pemilik.
2. Tombol WhatsApp mengambang: satu `<a>` tetap di pojok kanan bawah (`position: fixed`, `right` dan `bottom` mengikuti `env(safe-area-inset-*)`), target sentuh minimal 48×48 px, latar `--deep`, teks putih, `aria-label="Chat WhatsApp Naura Aqiqah"`, `target="_blank" rel="noopener"`. Glyph/teks: `✆` atau "Chat WhatsApp"; JANGAN memakai logo merek WhatsApp. Tautan memakai nomor dan format URL yang sama dengan tombol "Pesan Paket" yang sudah ada. Tidak boleh menutupi tombol lain di 320 px; z-index di bawah header/menu terbuka; hormati `prefers-reduced-motion`.

**Langkah 7 — Kompresi gambar (D8) — DITUNDA.** Kerjakan hanya setelah pemilik memilih foto hero/menu1–4 (D1). Buat SALINAN di `assets/optimized/` (sisi terpanjang sekitar 800 px, JPEG kualitas sedang), file asli tidak disentuh, lalu arahkan `src` ke salinan. Laporkan ukuran sebelum/sesudah.

**Langkah 8 — Verifikasi & laporan.** Jalankan semua kriteria bagian 7. Tulis `naura-implementation-report.md` baru; ganti nama laporan lama menjadi `...-stale.md` (jangan hapus). Laporkan secara eksplisit apa yang TIDAK bisa diverifikasi (isi visual gambar, tampilan font di perangkat nyata).

## 6. Butir tertunda sebelum publikasi
1. Foto hero dan menu1–4 (D1), lalu kompresi (Langkah 7).
2. Ulasan asli untuk testimoni; lalu hapus `hidden` (D6).
3. Teks artikel dari WordPress lama (D10).
4. Teks syarat tanda `*` (D9) setelah diskusi dengan owner.
5. Favicon dan gambar Open Graph (D11).
6. Verifikasi visual manusia untuk semua slot gambar sebelum `verified: true`.

## 7. Kriteria pengujian (kondisi sekarang, foto belum dipilih)
| Uji | Target |
|---|---|
| Gambar termuat | 9 slot `naturalWidth > 0`: logo header, logo footer, mascot, aboutIcon, doc1–4 |
| Placeholder | Tepat 5 (hero, menu1–4), berlabel netral tanpa nama file. Slot artikel sudah dihapus (0) |
| HTTP gambar | 0 respons ≥ 400 untuk slot yang punya `src` valid |
| String terlarang | 0 kemunculan di `index.html`, seluruh `css/`, `js/` (cek juga `url(` di CSS) |
| Hash logo footer | Tidak sama dengan file `NauraPutih-min.png` mana pun |
| Testimoni | Section `hidden`, tautan nav Testimoni hilang, tidak ada konten terbaca |
| Kontras | Semua teks yang disentuh ≥ 4,5:1 (teks besar ≥ 3:1), dibuktikan angka. Minimal: putih/`#e60077` 4,53; putih/`#a8005a` 7,47 |
| Overflow horizontal | 0 px di 320, 390, 768, 1024, 1440 px + nav 981–1100 px |
| Keyboard | Tab melewati semua kontrol, fokus terlihat, Escape menutup menu dan fokus kembali ke tombol |
| ARIA | `aria-expanded` sinkron setelah resize; axe-core tanpa pelanggaran |
| Tombol WA mengambang | Tidak menutupi tombol lain di 320 px; target ≥ 48 px; tautan membuka WhatsApp dengan nomor benar |
| Font | `document.fonts.check` berhasil untuk bobot yang dipakai; jika file font diblokir, teks tetap tampil (font cadangan) |
| JS error | 0 |
| Setelah foto final (D1) | 13 slot gambar termuat, 0 placeholder |
