import type { Metadata } from 'next';
import { Cormorant_Garamond, Source_Serif_4, Noto_Serif_SC } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['400', '500', '600', '700'],
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  weight: ['400', '600'],
});

const notoSerif = Noto_Serif_SC({
  variable: '--font-noto-serif',
  weight: ['400', '500', '700'],
  preload: false,
});

export const metadata: Metadata = {
  title: 'lumatale · 互动小说',
  description: 'Stories that read you back. 一个只在夜里被读到的故事。',
  metadataBase: new URL('https://lumatale.vercel.app'),
  openGraph: {
    title: 'lumatale · 互动小说',
    description: 'Stories that read you back. 一个只在夜里被读到的故事。',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${cormorant.variable} ${sourceSerif.variable} ${notoSerif.variable} antialiased h-full`}
    >
      <body className="min-h-full bg-paper text-ink">{children}</body>
    </html>
  );
}
