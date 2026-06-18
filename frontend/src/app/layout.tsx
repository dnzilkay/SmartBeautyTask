import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { CartButton } from '@/components/CartButton';
import { CartDrawer } from '@/components/CartDrawer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Smart Beauty — AI Destekli Cilt Bakım Önerileri',
  description:
    'Cilt tipini seç, yapay zeka destekli kişiselleştirilmiş cilt bakım önerilerini keşfet.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col app-background">
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/40 border-b border-white/40">
          <div className="max-w-6xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between">
            <a
              href="/"
              className="flex items-center gap-2 group"
              aria-label="Smart Beauty ana sayfa"
            >
              <span className="h-9 w-9 rounded-full bg-gradient-to-br from-rose-400 via-pink-400 to-amber-300 shadow-md group-hover:scale-105 transition-transform" />
              <span className="font-semibold tracking-tight text-slate-900">
                Smart Beauty
              </span>
            </a>
            <CartButton />
          </div>
        </header>

        <main className="flex-1 w-full max-w-6xl mx-auto px-5 md:px-8 py-12 md:py-16">
          {children}
        </main>

        <footer className="border-t border-white/40 bg-white/30 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-5 md:px-8 py-6 text-xs text-slate-500 flex items-center justify-between">
            <span>© {new Date().getFullYear()} Smart Beauty</span>
            <span className="hidden md:inline">
              Bu uygulama bir vaka çalışmasıdır. Ürünler temsilidir.
            </span>
          </div>
        </footer>

        <CartDrawer />
      </body>
    </html>
  );
}
