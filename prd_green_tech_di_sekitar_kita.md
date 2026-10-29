# Product Requirements Document (PRD)
**Nama Proyek:** Green Tech di Sekitar Kita: Kampanye Efisiensi Energi Perangkat Digital dan Pendingin Ruangan (SDG 9 & SDG 13 dalam Aksi)  
**Bentuk Luaran:** Prototipe Aplikasi Web Interaktif (*Single-Page Application*) & Kampanye Video *Motion Graphics*  
**Target Pengguna:** Mahasiswa dan masyarakat di lingkungan sekitar kampus/tempat kos  
**Status Dokumen:** Draft 1.0  

---

## 1. Latar Belakang & Tujuan Proyek

### 1.1 Judul Proyek
**"Green Tech di Sekitar Kita: Kampanye Efisiensi Energi Perangkat Digital dan Pendingin Ruangan (SDG 9 & SDG 13 dalam Aksi)"**

### 1.2 Latar Belakang Proyek
* **a. Urgensi SDG dalam Konteks Masyarakat & Kampus:**  
  **SDG 9 (Industri, Inovasi, dan Infrastruktur)** dan **SDG 13 (Aksi Iklim)** sangat krusial karena aktivitas harian masyarakat modern—khususnya mahasiswa—sangat bergantung pada penggunaan perangkat elektronik (laptop, PC, *handphone*) serta pendingin ruangan (AC/kipas angin). Konsumsi energi fosil yang tinggi untuk menopang perangkat-perangkat tersebut berkontribusi langsung pada peningkatan emisi karbon dan laju perubahan iklim global. Oleh karena itu, inovasi pola pikir dan pemanfaatan teknologi hijau (*green technology*) skala mikro di tingkat keseharian sangat dibutuhkan.
* **b. Pernyataan Masalah atau Kebutuhan Masyarakat:**  
  Berdasarkan observasi di lingkungan kampus dan tempat kos/masyarakat sekitar, kesadaran terhadap penggunaan perangkat elektronik dan pendingin ruangan (AC) sering kali berlebihan (*overuse*) dan tidak hemat energi (misalnya: AC dibiarkan menyala di ruangan kosong, laptop/HP di-*charge* berlebihan, atau sirkulasi ruangan buruk sehingga memaksa AC bekerja terlalu berat). Diperlukan media edukasi yang mudah dipahami serta instrumen praktis agar masyarakat sadar dan mampu menerapkan efisiensi energi secara nyata dalam kehidupan sehari-hari.

### 1.3 Tujuan Proyek
* **a. Tujuan Substansial (SDG):**  
  Untuk mencapai target **SDG 9** (mendorong inovasi dan praktik infrastruktur digital yang berkelanjutan) sebagai SDG Utama dan **SDG 13** (mengambil tindakan cepat untuk memerangi perubahan iklim lewat pengurangan jejak karbon dari konsumsi energi harian) sebagai SDG Sekunder.
* **b. Tujuan Pengembangan Keterampilan:**  
  Untuk mengembangkan keterampilan mahasiswa dalam kerja sama tim, riset lapangan/data, pemecahan masalah nyata, serta penguasaan literasi digital.
* **c. Tujuan Solusi & Kesadaran:**  
  Untuk menyediakan solusi berkelanjutan berupa purwarupa (*prototipe*) alat bantu digital/kalkulator energi sederhana serta video edukasi *motion graphics* guna meningkatkan kesadaran masyarakat kampus dan lingkungan sekitar tentang pentingnya efisiensi penggunaan perangkat dan pendingin ruangan.

---

## 2. Alur Pengguna (*User Flow*)

Aplikasi dirancang sebagai *Single-Page Web Application (SPA)* dengan pendekatan alur cerita (*storytelling*) linier agar pengguna mendapatkan edukasi utuh sekaligus menyumbang data riset bagi evaluasi proyek:

1. **Tahap 1 — Edukasi & Kesadaran (*Awareness*):** Pengguna membuka halaman utama, berinteraksi dengan **Infografis Dinamis**, dan menonton **Embedded Video Motion Graphics**.
2. **Tahap 2 — Audit & Simulasi (*Action & Prototype*):** Pengguna memilih klasifikasi perangkat yang mereka gunakan pada **Kalkulator Jejak Energi**, melihat perbandingan konsumsi saat ini vs kondisi "Optimal" (berbasis data riset jurnal), serta menerima **Rekomendasi Personal**.
3. **Tahap 3 — Evaluasi Pengetahuan (*Assessment*):** Pengguna mengerjakan **Kuis Interaktif** singkat untuk mengukur tingkat pemahaman pasca-edukasi.

---

## 3. Spesifikasi Fungsional per Fitur (*Feature Requirements*)

### 3.1 Fitur 1: Halaman Infografis Dinamis & *Embedded Video*
Berfungsi sebagai media kampanye kesadaran publik untuk menjelaskan konsep *Green Tech* dan dampak penggunaan perangkat berlebih dengan bahasa awam.

| Kode | Komponen Fitur | Deskripsi & Spesifikasi Fungsional | Kriteria Penerimaan (*Acceptance Criteria*) |
| :--- | :--- | :--- | :--- |
| **F1.1** | **Hero Section & Pengantar SDG** | Menampilkan judul proyek, pengenalan singkat keterkaitan perangkat harian (laptop/HP/AC) dengan konsumsi listrik dan emisi karbon (SDG 9 & SDG 13). | Teks ringkas, hierarki visual jelas, dan responsif di layar HP maupun desktop. |
| **F1.2** | **Infografis Dinamis** | Komponen visual interaktif (seperti *interactive cards*, *tabs*, atau *accordion*) yang membedah dampak *overuse* perangkat elektronik dan prinsip efisiensi teknologi hijau (misal: cara kerja beban kompresor AC dan manajemen daya komputasi). | Elemen visual merespons interaksi pengguna (klik/*hover*) dan menyajikan fakta berbasis literatur secara ringkas. |
| **F1.3** | **Embedded Video Player** | Pemutar video terintegrasi (YouTube Embed / HTML5 Video) yang menayangkan video edukasi *motion graphics* kelompok. | Video dapat diputar langsung di dalam halaman web tanpa mengarahkan pengguna keluar dari situs. |
| **F1.4** | **CTA Navigasi ke Kalkulator** | Tombol aksi (*Call-to-Action*) yang mengarahkan pengguna untuk mulai menghitung jejak energi mereka sendiri setelah menonton video. | Menggeser layar secara halus (*smooth scroll*) menuju bagian Kalkulator Jejak Energi. |

---

### 3.2 Fitur 2: Kalkulator Jejak Energi, Komparasi "Optimal", & Rekomendasi Personal
Berfungsi sebagai prototipe alat bantu digital utama serta instrumen untuk mengukur potensi penghematan energi komunitas.

| Kode | Komponen Fitur | Deskripsi & Spesifikasi Fungsional | Kriteria Penerimaan (*Acceptance Criteria*) |
| :--- | :--- | :--- | :--- |
| **F2.1** | **Input Klasifikasi Perangkat (*No Manual Watt Input*)** | Pengguna tidak perlu mengetahui atau mengetik Watt perangkat secara manual. Input dibagi menjadi:<br>1. **Perangkat Komputasi & Gawai:** Pilihan klasifikasi (Laptop Standar/Ultrabook, Laptop Gaming/Workstation, PC Desktop Standar, PC Gaming/Render, Smartphone), durasi pemakaian (jam/hari), dan kebiasaan daya (misal: *Sleep mode* aktif vs menyala terus / *overcharging*).<br>2. **Pendingin Ruangan:** Pilihan klasifikasi (AC 1/2 PK, AC 1 PK, AC 1.5–2 PK, Kipas Angin Kecil, Kipas Angin Besar), durasi pemakaian (jam/hari), dan rentang suhu AC ($<20^\circ\text{C}$, $20^\circ\text{C}-23^\circ\text{C}$, $\ge 24^\circ\text{C}$). | Form menggunakan komponen *dropdown*, *pill selector*, atau *slider* ($0-24\text{ jam}$) yang intuitif dengan validasi input (tidak bisa bernilai negatif). |
| **F2.2** | **Mesin Kalkulasi Berbasis Data Jurnal** | Menghitung total konsumsi listrik bulanan ($\text{kWh}$) dan jejak emisi karbon ($\text{kg CO}_2$) menggunakan tabel parameter daya (*lookup table*) dan pengali efisiensi yang diambil dari referensi jurnal ilmiah/standar ESDM. | Perhitungan berjalan instan di sisi klien (*client-side*) saat pengguna menekan tombol hitung atau mengubah parameter tanpa memuat ulang halaman. |
| **F2.3** | **Komparasi Aktual vs "Optimal"** | Menampilkan perbandingan berdampingan atau grafik visual:<br>• **Penggunaan Saat Ini:** Estimasi $\text{kWh}$ dan $\text{kg CO}_2$ per bulan berdasarkan kebiasaan pengguna.<br>• **Penggunaan Optimal (*Green Tech*):** Estimasi $\text{kWh}$ dan $\text{kg CO}_2$ jika menggunakan parameter efisiensi optimal berdasarkan jurnal (misal: suhu AC $24^\circ\text{C}-25^\circ\text{C}$, manajemen daya *Eco/Balanced*, pemotongan waktu *idle*).<br>• **Potensi Penghematan:** Selisih penghematan energi ($\Delta \text{kWh}$) dan pengurangan emisi ($\Delta \text{kg CO}_2$). | Menampilkan angka aktual, angka optimal, serta persentase dan nominal selisih penghematan secara kontras dan mudah dibaca. |
| **F2.4** | **Generator Rekomendasi Personal** | Menampilkan daftar saran praktis yang disesuaikan dengan input paling boros dari pengguna (*conditional rendering*).<br>• *Contoh:* Jika input suhu AC $<20^\circ\text{C}$, tampilkan rekomendasi menaikkan suhu ke $24^\circ\text{C}$ dengan bantuan sirkulasi kipas angin. Jika memilih Laptop Gaming $>6\text{ jam}$, tampilkan rekomendasi pengaturan *Power Mode* dan pembatas pengisian baterai. | Hanya rekomendasi yang relevan dengan profil pemborosan pengguna yang dimunculkan di layar hasil. |

#### Rumus Dasar Kalkulasi (Acuan Teknis untuk Tim Pengembang)
* **Konsumsi Energi Aktual ($\text{kWh/bulan}$):**
  $$\text{kWh}_{\text{aktual}} = \sum \left( \frac{P_{\text{klasifikasi}} \times \alpha_{\text{kebiasaan}} \times t_{\text{aktual}} \times 30}{1000} \right)$$
  *(Di mana $P_{\text{klasifikasi}}$ adalah daya rata-rata perangkat dalam Watt dari literatur jurnal, $\alpha_{\text{kebiasaan}}$ adalah faktor beban tambahan seperti suhu AC ekstrem, dan $t_{\text{aktual}}$ adalah durasi jam/hari).*
* **Konsumsi Energi Optimal ($\text{kWh/bulan}$):**
  $$\text{kWh}_{\text{optimal}} = \sum \left( \frac{P_{\text{klasifikasi}} \times \alpha_{\text{optimal}} \times t_{\text{efektif}} \times 30}{1000} \right)$$
  *(Di mana $\alpha_{\text{optimal}}$ adalah koefisien efisiensi perangkat pada pengaturan optimal jurnal, dan $t_{\text{efektif}}$ adalah jam pemakaian setelah dikurangi potensi waktu idle/standby).*
* **Jejak Karbon ($\text{kg CO}_2\text{/bulan}$):**
  $$\text{Emisi CO}_2 = \text{kWh} \times EF_{\text{listrik}}$$
  *(Di mana $EF_{\text{listrik}}$ adalah faktor emisi jaringan listrik, nilai acuan akan disesuaikan dengan literatur jurnal yang digunakan).*

---

### 3.3 Fitur 3: Kuis Interaktif
Berfungsi sebagai instrumen evaluasi untuk mengukur peningkatan pengetahuan masyarakat/mahasiswa setelah menyimak infografis, video, dan simulasi kalkulator.

| Kode | Komponen Fitur | Deskripsi & Spesifikasi Fungsional | Kriteria Penerimaan (*Acceptance Criteria*) |
| :--- | :--- | :--- | :--- |
| **F3.1** | **Daftar Pertanyaan Kuis** | Menampilkan 5 pertanyaan pilihan ganda seputar materi *Green Tech*, efisiensi pendingin ruangan, dan penghematan daya perangkat digital. | Pengguna dapat memilih jawaban dengan mudah dan terdapat indikator progres soal (misal: Soal 1 dari 5). |
| **F3.2** | **Umpan Balik & Pembahasan Instan** | Menampilkan status benar/salah beserta penjelasan ilmiah singkat setiap kali pengguna menjawab soal atau di akhir sesi kuis. | Penjelasan tampil jelas untuk memperkuat pemahaman konsep *Green Tech* pengguna. |
| **F3.3** | **Skor Akhir & Rangkuman Evaluasi** | Menghitung skor total (skala $0-100$) dan menampilkan kartu rangkuman yang berisi skor literasi pengguna beserta potensi penghematan $\text{kWh}$ & $\text{kg CO}_2$ dari kalkulator sebelumnya. | Skor dihitung dengan akurat dan terdapat opsi untuk mengulang kuis atau membagikan hasil kampanye. |

---

## 4. Kebutuhan Data & Metrik Evaluasi Proyek

Untuk memenuhi ketentuan laporan proyek berbasis SDGs, sistem mendukung pengumpulan metrik evaluasi berikut:

1. **Struktur Data Parameter Riset (*Static JSON Config*):**
   * Semua angka Watt klasifikasi perangkat dan persentase efisiensi "Optimal" disimpan dalam satu konfigurasi terpusat di dalam kode agar mudah diperbarui oleh Tim Riset setelah kajian jurnal rampung.
2. **Pencatatan Data Responden (*Data Logging* untuk Laporan Akhir):**
   * Integrasi opsional ke penyimpanan ringan (seperti Google Sheets API / Form / Database) untuk merekam data anonim setiap sesi pengguna:
     * **Jumlah Peserta Terlibat:** Dihitung dari total pengguna yang menyelesaikan simulasi kalkulator dan kuis.
     * **Jumlah Energi & Emisi yang Dihemat:** Dihitung dari rata-rata dan akumulasi selisih $(\text{kWh}_{\text{aktual}} - \text{kWh}_{\text{optimal}})$ serta $(\text{CO}_{2\text{ aktual}} - \text{CO}_{2\text{ optimal}})$ dari seluruh pengguna.
     * **Peningkatan Pengetahuan:** Diukur dari distribusi skor yang diperoleh responden pada fitur Kuis Interaktif.

---

## 5. Kebutuhan Non-Fungsional (*Non-Functional Requirements*)

* **Desain Responsif (*Mobile-First*):** Antarmuka wajib tampil rapi dan mudah dioperasikan baik di layar *smartphone* (media utama penyebaran kampanye di kalangan mahasiswa) maupun di layar laptop/komputer.
* **Prinsip *Green Web Design*:** Ukuran halaman web, aset grafis (menggunakan format SVG/WebP), dan *script* dioptimalkan agar hemat kuota serta ringan dijalankan pada perangkat spesifikasi rendah.
* **Akses Tanpa Hambatan (*No Login Required*):** Pengguna dapat langsung mencoba seluruh fitur (Infografis, Video, Kalkulator, dan Kuis) tanpa perlu melakukan registrasi akun.