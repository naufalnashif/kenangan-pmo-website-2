'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useScroll } from '@/hooks/use-scroll';
import { cn } from '@/lib/utils';

export default function Header() {
  const logo = PlaceHolderImages.find(img => img.id === 'logo');
  const scrolled = useScroll(10);

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#message', label: 'Pesan' },
    { href: '#portfolio', label: 'Karya' },
    { href: '#memories', label: 'Galeri' },
    { href: '#guestbook', label: 'Ucapan' },
    { href: '#analytics', label: 'Analytics' },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      scrolled ? "glass-nav bg-background/95 border-b" : "border-b border-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 sm:h-20 items-center">
          <Link href="/" className="flex items-center space-x-3">
            {logo && (
              <Image
                src={logo.imageUrl}
                alt="Logo"
                width={40}
                height={40}
                className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
                data-ai-hint={logo.imageHint}
              />
            )}
            <span className="text-lg sm:text-xl font-black tracking-tighter uppercase text-white">
              NAUFAL NASHIF
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} onClick={(e) => scrollToSection(e, link.href)} className="hover:text-primary transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="flex flex-col space-y-6 pt-10">
                    {navLinks.map(link => (
                      <Link key={link.href} href={link.href} onClick={(e) => scrollToSection(e, link.href)} className="text-lg font-bold hover:text-primary transition-colors">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
