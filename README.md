<div align="center">
  <img src="https://raw.githubusercontent.com/naufalnashif/public-assets/main/kenangan-pmo/assets/pmo.png" alt="Project Banner" width="150" style="border-radius: 20%;"/>
  <h1><strong>Website Perpisahan PMO OJK</strong></h1>
  <p>Sebuah website perpisahan interaktif yang didedikasikan untuk rekan-rekan di PMO OJK, dibangun dengan Next.js, Firebase, dan Genkit AI.</p>
  
  <p>
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
    <img src="https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google-gemini&logoColor=white" alt="Google Gemini" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  </p>
</div>

---

**Kenangan PMO** adalah sebuah proyek website perpisahan yang modern dan personal. Dibuat bukan hanya sebagai halaman statis, tetapi sebagai sebuah pengalaman interaktif yang penuh dengan kenangan, pesan personal, dan sentuhan teknologi AI untuk memberikan kejutan unik bagi setiap pengunjung.

## ✨ Fitur Unggulan

Proyek ini dilengkapi dengan berbagai fitur canggih untuk menciptakan pengalaman yang tak terlupakan:

- **💌 Pesan Selamat Datang Personal**: Pengunjung disambut dengan pesan khusus yang didedikasikan untuk mereka melalui parameter URL (`?to=Nama`), menciptakan sentuhan personal sejak awal.
- **🤖 Gacha AI & Koleksi**: Sistem "Hadiah Kejutan" yang didukung oleh **Google Gemini (Genkit)** untuk menghasilkan hadiah virtual unik. Pengguna dapat mengoleksi hingga 5 hadiah terakhir di `localStorage`.
  - **Probabilitas Hadiah**: Sistem kelangkaan yang dapat diatur (Common, Rare, Epic, Super Epic).
  - **Manajemen Koleksi**: Pengguna dapat melihat, membuka kembali, dan menghapus hadiah dari koleksi mereka.
- **🎵 Pemutar Audio Interaktif**: Pengguna dapat memilih musik latar dari beberapa pilihan lagu yang tersedia untuk menyesuaikan suasana saat menjelajahi situs.
- **🔥 Real-time Guestbook & Analytics**:
  - **Buku Tamu**: Pengunjung dapat meninggalkan pesan dan doa yang akan ditampilkan secara *real-time* menggunakan **Firebase Firestore**.
  - **Dasbor Analitik**: Visualisasi data kunjungan (total, unik, dan harian) yang diambil langsung dari Firestore dan ditampilkan dalam bentuk grafik menggunakan **Recharts**.
- **🎨 UI/UX Modern & Responsif**:
  - **Desain Modern**: Antarmuka yang dibangun dengan **ShadCN/UI** dan **Tailwind CSS**.
  - **Mode Gelap & Terang**: Tema yang dapat disesuaikan oleh pengguna.
  - **Animasi Halus**: Efek *scroll-reveal*, transisi, dan *glow* yang memanjakan mata.
- **🖼️ Galeri Kenangan & Portofolio**: Seksi galeri foto dan *carousel* proyek untuk menampilkan jejak langkah dan karya yang telah dibuat.
- **❄️ Efek Musiman**: Efek visual seperti kembang api atau salju yang muncul secara otomatis pada hari-hari spesial (misalnya Tahun Baru atau Natal).

## 🚀 Tumpukan Teknologi

- **Framework**: **Next.js 15** (App Router & Turbopack)
- **Bahasa**: **TypeScript**
- **Styling**: **Tailwind CSS** dengan **ShadCN/UI** untuk komponen siap pakai.
- **AI Generatif**: **Google Gemini** melalui **Genkit** untuk fitur Gacha.
- **Backend & Database**: **Firebase** (Firestore untuk database real-time dan Analytics).
- **Animasi & Grafik**: **Framer Motion** (implisit melalui ShadCN), **Recharts** untuk grafik.

## 🛠️ Menjalankan Proyek Secara Lokal

Untuk menjalankan proyek ini di lingkungan pengembangan Anda, ikuti langkah-langkah berikut:

1.  **Clone Repositori**
    ```bash
    git clone https://github.com/naufalnashif/kenangan-pmo.git
    cd kenangan-pmo
    ```

2.  **Instal Dependensi**
    ```bash
    npm install
    ```

3.  **Konfigurasi Environment Variables**
    Buat file `.env` di root proyek dan tambahkan konfigurasi yang diperlukan.

    - **Firebase**: Pastikan Anda memiliki konfigurasi Firebase di `src/lib/firebase.ts`. Anda mungkin perlu membuat proyek Firebase Anda sendiri dan menempelkan konfigurasinya di sana.
      ```typescript
      // src/lib/firebase.ts
      const firebaseConfig = {
        apiKey: "AIXXXXXXXXXXXXXXXXXXX",
        authDomain: "your-project-id.firebaseapp.com",
        projectId: "your-project-id",
        storageBucket: "your-project-id.appspot.com",
        messagingSenderId: "...",
        appId: "...",
        measurementId: "..."
      };
      ```
    - **Gemini API Key**: Untuk fitur Gacha AI, Anda memerlukan API Key dari Google AI Studio.
      ```.env
      GEMINI_API_KEY="AIzaSy...Your...API...Key"
      ```

4.  **Jalankan Server Pengembangan**
    ```bash
    npm run dev
    ```
    Aplikasi akan berjalan di `http://localhost:9002`.

5.  **Akses Fitur Personalisasi**
    Untuk melihat pesan selamat datang yang dipersonalisasi, tambahkan parameter `?to=` ke URL. Contoh:
    ```
    http://localhost:9002/?to=NamaAnda
    ```

---

Didesain dan dikembangkan dengan ❤️ oleh Naufal Nashif.