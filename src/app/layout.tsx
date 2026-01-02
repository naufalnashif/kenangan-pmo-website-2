import type {Metadata} from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from "@/components/ui/toaster";
import VisitorTracker from '@/components/visitor-tracker';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Farewell Message - Naufal Nashif',
  description: 'A farewell message from Naufal Nashif to the PMO OJK team.',
  icons: {
    icon: 'https://raw.githubusercontent.com/naufalnashif/naufalnashif.github.io/main/assets/img/my-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased custom-scrollbar")}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <VisitorTracker />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
