'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useTime } from '@/hooks/useTime';

export default function Footer() {
  const logo = PlaceHolderImages.find(img => img.id === 'logo');
  const { currentTime, timeSinceLastDay } = useTime('2025-12-31T23:59:59');

  const socialLinks = [
    { href: "https://www.linkedin.com/in/naufalnashif/", label: "LinkedIn" },
    { href: "https://www.instagram.com/naufal.nashif/", label: "Instagram" },
    { href: "https://naufalnashif.netlify.app/", label: "Portfolio" },
  ];

  return (
    <footer className="py-24 bg-background border-t">
      <div className="max-w-7xl mx-auto px-4 text-center">
        {logo && (
          <Image
            src={logo.imageUrl}
            alt="Logo"
            width={64}
            height={64}
            className="h-16 w-16 mx-auto mb-10"
            data-ai-hint={logo.imageHint}
          />
        )}
        <div className="flex justify-center space-x-12 mb-12">
          {socialLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary font-bold transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="text-muted-foreground text-sm space-y-2">
            <p>Waktu lokal Anda saat ini: {currentTime}</p>
            <p>Terhitung {timeSinceLastDay} sejak hari terakhir saya.</p>
            <p>&copy; {new Date().getFullYear()} • Designed with heart by Naufal Nashif</p>
        </div>
      </div>
    </footer>
  );
}
