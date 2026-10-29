export const QUIZ_QUESTIONS = [
  {
    question: 'Berapa suhu AC yang direkomendasikan standar Ditjen EBTKE ESDM untuk efisiensi energi optimal dan kenyamanan termal tropis?',
    options: [
      { text: '16°C – 18°C (Didinginkan secepat mungkin)', correct: false },
      { text: '20°C – 22°C (Cukup dingin untuk ruangan lembap)', correct: false },
      { text: '24°C – 25°C (Keseimbangan termal & beban kompresor optimal)', correct: true },
      { text: 'Dibiarkan diatur otomatis pabrik tanpa batas', correct: false }
    ],
    explanation: 'Rekomendasi resmi ESDM dan standar ASHRAE menetapkan 24°C–25°C. Setiap 1°C di bawahnya membebani kompresor 8-10% lebih berat tanpa menambah kenyamanan sejati.'
  },
  {
    question: "Apa yang dimaksud dengan fenomena 'Vampire Draw' pada ekosistem komputasi mahasiswa?",
    options: [
      { text: 'Daya residu yang diserap adaptor charger saat tetap dicolok meski gawai dilepas', correct: true },
      { text: 'Baterai ponsel yang aus karena dipakai bermain game', correct: false },
      { text: 'Kecerahan layar komputer yang berlebihan di malam hari', correct: false },
      { text: 'Aplikasi latar belakang yang menyedot koneksi internet', correct: false }
    ],
    explanation: 'Phantom load/vampire draw menyerap 1–5W secara terus-menerus melalui induksi trafo adaptor yang tertancap ke stopkontak.'
  },
  {
    question: 'Bagaimana cara kerja sirkulator kipas angin (25W) dalam mendukung efisiensi AC ruangan?',
    options: [
      { text: 'Membantu meratakan persebaran udara dingin dan efek sejuk semilir alami', correct: true },
      { text: 'Menurunkan temperatur kamar secara kimiawi', correct: false },
      { text: 'Menghentikan kompresor AC secara paksa', correct: false },
      { text: 'Menyerap uap air secara termal', correct: false }
    ],
    explanation: 'Pergerakan angin kecil mempercepat penguapan keringat di kulit, membuat suhu 25°C terasa seperti 22°C dengan konsumsi listrik puluhan kali lebih hemat.'
  },
  {
    question: 'Tindakan digital manakah yang paling efektif menjaga umur baterai sekaligus menekan konsumsi daya laptop?',
    options: [
      { text: 'Membatasi pengisian pada 80% & menerapkan sleep mode 15 menit', correct: true },
      { text: 'Membiarkan laptop terus menyala agar tidak perlu reboot', correct: false },
      { text: 'Menggunakan screensaver grafis 3D resolusi tinggi', correct: false },
      { text: 'Mengunduh file tanpa henti sepanjang malam', correct: false }
    ],
    explanation: 'Batas 80% memelihara katoda baterai litium dan sleep mode menghentikan beban idle hingga 80 Watt pada prosesor laptop.'
  },
  {
    question: 'Mengapa efisiensi energi kampus terhubung langsung dengan target SDG 9 dan SDG 13?',
    options: [
      { text: 'Mendorong infrastruktur digital bersih (SDG 9) dan aksi nyata dekarbonisasi (SDG 13)', correct: true },
      { text: 'Hanya sekadar penghematan anggaran universitas', correct: false },
      { text: 'Karena mahasiswa dilarang memakai perangkat digital', correct: false },
      { text: 'Tidak berkaitan secara langsung', correct: false }
    ],
    explanation: 'SDG 9 menekankan pembaruan infrastruktur rendah karbon sedangkan SDG 13 menghendaki mitigasi iklim terukur di seluruh sektor konsumsi.'
  }
];
