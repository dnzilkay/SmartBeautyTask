import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
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
        <header className="sticky top-0 z-30 border-b border-white/50 bg-[#fdf7f4]/65 backdrop-blur-2xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 md:px-8">
            <Link
              href="/"
              className="group flex items-center gap-3"
              aria-label="Smart Beauty ana sayfa"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full border border-white/80 bg-white/65 shadow-md transition-transform group-hover:scale-105">
                <span className="h-4 w-4 rounded-full bg-gradient-to-br from-rose-400 via-fuchsia-400 to-sky-400 shadow-inner" />
              </span>
              <span>
                <span className="block font-semibold leading-none tracking-tight text-slate-950">
                  Smart Beauty
                </span>
                <span className="mt-1 hidden text-[9px] font-semibold uppercase tracking-[0.19em] text-slate-400 sm:block">
                  AI Skin Match
                </span>
              </span>
            </Link>
            <CartButton />
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-7 sm:px-5 md:px-8 md:py-10">
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
