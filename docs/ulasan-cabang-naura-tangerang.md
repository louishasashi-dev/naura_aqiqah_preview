# Ulasan Google Maps — Cabang Tangerang

Diambil dari screenshot tanggal 26 November 2026. Semua gambar ada di folder `foto/`.

## Instruksi untuk web: waktu otomatis

1. Teks waktu (misalnya "2 minggu lalu") **jangan ditulis permanen** di HTML.
2. Simpan tanggal ulasan di atribut `data-tanggal` (format `YYYY-MM-DD`).
3. JavaScript menghitung selisih antara tanggal itu dan **hari ini** (setara `=TODAY()`), setiap halaman dibuka.
4. Tanggal di file ini **perkiraan**, dihitung mundur dari 26 November 2026. Ganti jika tahu tanggal aslinya.
5. Isi ulasan, nama, dan bintang tidak tersinkron otomatis dengan Google Maps. Kalau ulasan berubah, perbarui manual.

Contoh HTML:

```html
<span class="waktu-ulasan" data-tanggal="2026-11-12"></span>
```

Script (taruh sebelum `</body>`):

```html
<script>
function waktuRelatif(tanggal, sekarang = new Date()) {
  const [y, m, d] = tanggal.split("-").map(Number);
  const hari = Math.max(0, Math.round(
    (Date.UTC(sekarang.getFullYear(), sekarang.getMonth(), sekarang.getDate())
      - Date.UTC(y, m - 1, d)) / 86400000));
  let bulan = (sekarang.getFullYear() - y) * 12 + sekarang.getMonth() - (m - 1);
  if (sekarang.getDate() < d) bulan--;

  if (hari === 0) return "hari ini";
  if (hari === 1) return "kemarin";
  if (hari < 7) return `${hari} hari lalu`;
  if (bulan < 1) {
    const minggu = Math.floor(hari / 7);
    return minggu === 1 ? "seminggu lalu" : `${minggu} minggu lalu`;
  }
  if (bulan < 12) return bulan === 1 ? "sebulan lalu" : `${bulan} bulan lalu`;
  const tahun = Math.floor(bulan / 12);
  return tahun === 1 ? "setahun lalu" : `${tahun} tahun lalu`;
}

function perbaruiWaktu() {
  document.querySelectorAll(".waktu-ulasan[data-tanggal]").forEach(el => {
    el.textContent = waktuRelatif(el.dataset.tanggal);
  });
}

perbaruiWaktu();
setInterval(perbaruiWaktu, 60 * 60 * 1000); // untuk tab yang dibiarkan terbuka
</script>
```

## 1. Arsyila Azzahra Rahman

- **Bintang:** ★★★★★ (5/5)
- **Tanggal ulasan (perkiraan):** 2026-11-12
- **Waktu di web:** dihitung otomatis dari tanggal di atas (saat screenshot: 2 minggu lalu)
- **Foto ulasan:** `foto/ulasan-arsyila-azzahra-rahman.png`
- **Link ulasan:** 

> ketiga kalinya pesan di naura aqiqah, 2018 anak pertama, 2021 anak kedua, 2026 keponakan aku.. selain masakannya enakk, pelayanan ramah dan memuaskan + fast respon 😇 rencananya bulan depan bakal repeat order lagi, buat acara sunatan keponakan 😇 ...

## 2. Hanif Afriyan

- **Bintang:** ★★★★★ (5/5)
- **Tanggal ulasan (perkiraan):** 2026-11-12
- **Waktu di web:** dihitung otomatis dari tanggal di atas (saat screenshot: 2 minggu lalu)
- **Foto ulasan:** `foto/ulasan-hanif-afriyan.png`
- **Link ulasan:** 

> Rasa masakannya berkelas harga murah terjangkau bersih kami senang bekerja sama dengan naura aqiqah

## 3. Jafra skin care Cengkareng (Kosmeti...

- **Bintang:** ★★★★★ (5/5)
- **Tanggal ulasan (perkiraan):** 2026-10-26
- **Waktu di web:** dihitung otomatis dari tanggal di atas (saat screenshot: sebulan lalu)
- **Foto ulasan:** `foto/ulasan-jafra-skin-care-cengkareng-1.png`, `foto/ulasan-jafra-skin-care-cengkareng-2.png`
- **Link ulasan:** 

> Alhamdulillah selalu langganan urusan Aqiqah pakai Naura dari Aqiqah keponakan sampai Aqiqah anak, packingannya bagus, masakannya enak, yg pasti bonusannya ma syaa Allah banyak banget, admin responsif dan informatif. Sukses berkah selalu Naura catering&aqiqah

## 4. Suci Almeera Shalu

- **Bintang:** ★★★★★ (5/5)
- **Tanggal ulasan (perkiraan):** 2026-09-26
- **Waktu di web:** dihitung otomatis dari tanggal di atas (saat screenshot: 2 bulan lalu)
- **Foto ulasan:** `foto/ulasan-suci-almeera-shalu-1.png`, `foto/ulasan-suci-almeera-shalu-2.png`
- **Link ulasan:** 

> Masyaallah tabarakallah😍 ke-3 kalinya pakai jasa aqiqah catering by Naura aqiqah😍 selain amanah, harga bersahabat & cita rasanya yg enak daging kambingnya juga gak bau prengus👍 the best Naura aqiqah sukses dan amanah terus🫶 Insyaallah bakal jadi langganan terus😍 🫶 ...

## 5. Lia ismiati

- **Bintang:** ★★★★★ (5/5)
- **Tanggal ulasan (perkiraan):** 2026-09-26
- **Waktu di web:** dihitung otomatis dari tanggal di atas (saat screenshot: 2 bulan lalu)
- **Foto ulasan:** `foto/ulasan-lia-ismiati-1.png`, `foto/ulasan-lia-ismiati-2.png`, `foto/ulasan-lia-ismiati-3.png`
- **Link ulasan:** 

> Alhamdullillah berjalan dengan lancar Terimakasih Naura Aqiqah sudah membersamai acara aqiqah anak kami 🥰  
> Review makanan dari yg menikmatinya pada bilang enakkk dan gk bau embee nya 👍🏻  
> Semoga Naura Aqiqah sukses selalu yaa 🤲🏻 ...

## 6. Prinanti Mandalia

- **Bintang:** ★★★★★ (5/5)
- **Tanggal ulasan (perkiraan):** 2026-10-26
- **Waktu di web:** dihitung otomatis dari tanggal di atas (saat screenshot: sebulan lalu)
- **Foto ulasan:** `foto/ulasan-prinanti-mandalia.png`
- **Link ulasan:** 

> Masyaallah tabarakallah alhamdulillah berjalan dengan lancar semua aqiqah anak kedua kami , naura langganan dari anak pertama smpai anak kedua . Datang tepat waktu, makanan masih panas sampai rumah, dapat bonus souvenir tambahan karna sdh langganan terimakasih naura membantu kelancaran proses aqekah anak pertama dan ke dua kami 💖 🙏 🙏 ...

## 7. Albirru Tenta Tarigan

- **Bintang:** ★★★★★ (5/5)
- **Tanggal ulasan (perkiraan):** 2026-07-26
- **Waktu di web:** dihitung otomatis dari tanggal di atas (saat screenshot: 4 bulan lalu)
- **Foto ulasan:** `foto/ulasan-albirru-tenta-tarigan-1.png`, `foto/ulasan-albirru-tenta-tarigan-2.png`
- **Link ulasan:** 

> Pesen dadakan h+1 untuk alm Bapak saya.  
> Alhamdulillah bisa dibantu sama Naura Aqiqah.  
> kakanya informatif sekali, kurir yang anter masyaAllah tepat waktu. Saya pilih menu teriyaki + tongseng enak sekali makanya.

## 8. Eko Nur Wahyudin

- **Bintang:** ★★★★★ (5/5)
- **Tanggal ulasan (perkiraan):** 2026-08-26
- **Waktu di web:** dihitung otomatis dari tanggal di atas (saat screenshot: 3 bulan lalu)
- **Foto ulasan:** `foto/ulasan-eko-nur-wahyudin-1.png`, `foto/ulasan-eko-nur-wahyudin-2.png`
- **Link ulasan:** 

> Alhamdulillah Barakallah  
> Tasyakuran aqiqah lancar dengan Naura Aqiqah..  
> Prosesnya transparan, dan bisa sesuai dengan request...  
> Yg terpenting itu masakannya dijamin gak ngecewain...  
> Semoga berkah, sukses selalu 🙏🙏
