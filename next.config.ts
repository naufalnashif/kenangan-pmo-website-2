import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 1. Mengaktifkan mode standalone agar Next.js membundel semua dependensi 
  // yang diperlukan ke dalam satu folder, sangat stabil untuk Docker.
  output: 'standalone',

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    // 2. Jika di Docker gambar tetap pecah/hilang, aktifkan unoptimized.
    // Ini akan melewati proses kompresi 'sharp' yang sering gagal di Linux Alpine.
    unoptimized: true,

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      // 3. Konfigurasi akses gambar dari GitHub
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;