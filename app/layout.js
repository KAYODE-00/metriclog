import { Fraunces, Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600'],
});
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600'],
});
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
});

export const metadata = {
  title: 'metric — a blog',
  description: 'measurements of an ordinary life',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${plexMono.variable}`}>
      <body className="font-sans">
        <Providers>
          <Navbar />
          <main className="max-w-3xl mx-auto px-6 min-h-[60vh]">{children}</main>
          <footer className="border-t border-hairline mt-20 py-8 text-center text-xs font-mono text-inksoft">
            every entry measured — words, minutes, and the space between
          </footer>
        </Providers>
      </body>
    </html>
  );
}
