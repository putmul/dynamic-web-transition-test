export const QUIZ_QUESTIONS = [
  {
    question: 'Mengapa penggunaan listrik dapat berkaitan dengan emisi karbon?',
    options: [
      { text: 'Karena semua perangkat mengeluarkan CO₂ langsung dari stopkontak', correct: false },
      { text: 'Karena sebagian listrik masih dibangkitkan dengan membakar bahan bakar fosil', correct: true },
      { text: 'Karena kWh adalah jenis gas rumah kaca', correct: false },
      { text: 'Karena seluruh listrik selalu berasal dari batu bara', correct: false }
    ],
    explanation: 'Listrik merupakan energi sekunder yang dihasilkan dari berbagai sumber. Ketika pembangkit membakar batu bara atau gas, proses tersebut melepaskan CO₂. Besarnya emisi bergantung pada jumlah listrik yang digunakan dan bauran sumber energi dalam jaringan listrik.'
  },
  {
    question: 'Bagaimana peningkatan CO₂ dapat memengaruhi suhu dan iklim Bumi?',
    options: [
      { text: 'CO₂ menyerap sebagian radiasi panas sehingga efek rumah kaca menguat', correct: true },
      { text: 'CO₂ menghentikan seluruh sinar Matahari sebelum mencapai Bumi', correct: false },
      { text: 'CO₂ langsung berubah menjadi oksigen di atmosfer', correct: false },
      { text: 'CO₂ membuat suhu global selalu turun', correct: false }
    ],
    explanation: 'Gas rumah kaca seperti CO₂ menyerap dan memancarkan kembali sebagian radiasi inframerah yang dilepaskan permukaan Bumi. Jika konsentrasinya meningkat, lebih banyak panas tertahan di atmosfer sehingga suhu rata-rata global dan pola iklim dapat berubah.'
  },
  {
    question: 'Manakah urutan hubungan sebab-akibat yang paling tepat?',
    options: [
      { text: 'Konsumsi listrik → emisi → efek rumah kaca → perubahan iklim', correct: true },
      { text: 'Perubahan iklim → kWh → pembangkit → suhu ruangan', correct: false },
      { text: 'Efek rumah kaca → charger → listrik → bahan bakar fosil', correct: false },
      { text: 'Emisi → cahaya alami → kWh → pembentukan awan', correct: false }
    ],
    explanation: 'Listrik yang dibangkitkan dengan bahan bakar fosil dapat menghasilkan emisi. Emisi gas rumah kaca memperkuat panas yang tertahan di atmosfer, lalu berkontribusi pada kenaikan suhu rata-rata dan perubahan pola iklim dalam jangka panjang.'
  },
  {
    question: 'Kebiasaan manakah yang paling tepat untuk menghemat energi AC tanpa mengurangi kenyamanan secara berlebihan?',
    options: [
      { text: 'Menurunkan AC ke 16°C dan mematikan semua kipas', correct: false },
      { text: 'Menaikkan suhu AC 1–2°C, memakai kipas kecil untuk meratakan udara, dan memilih mode Sleep/Eco jika tersedia', correct: true },
      { text: 'Membiarkan AC menyala sepanjang hari agar tidak perlu bekerja ulang', correct: false },
      { text: 'Membuka pintu dan jendela saat AC sedang menyala', correct: false }
    ],
    explanation: 'Menaikkan setelan AC 1–2°C dapat menurunkan beban pendinginan, sementara kipas membantu meratakan udara dingin. Mode Sleep atau Eco juga dapat mengatur kerja perangkat secara lebih hemat. Hasilnya tetap bergantung pada ukuran ruangan, durasi penggunaan, dan kondisi AC.'
  },
  {
    question: 'Manakah kebiasaan yang paling jelas mengurangi listrik yang terpakai tanpa manfaat?',
    options: [
      { text: 'Membiarkan charger, lampu, dan perangkat berada dalam kondisi standby', correct: false },
      { text: 'Mencabut charger setelah selesai, mematikan perangkat saat tidak digunakan, dan mematikan lampu di area kosong', correct: true },
      { text: 'Menyalakan semua lampu agar ruangan tidak pernah gelap', correct: false },
      { text: 'Membiarkan laptop dan AC menyala meskipun ruangan kosong', correct: false }
    ],
    explanation: 'Mencabut charger setelah digunakan, mematikan perangkat dan AC saat tidak diperlukan, serta mematikan lampu di area kosong mencegah konsumsi listrik yang tidak memberi manfaat. Conservation Mode pada laptop terutama membantu menjaga kesehatan baterai ketika perangkat perlu tetap tercolok.'
  }
];
