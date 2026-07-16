import React from 'react';
import type {Metadata} from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Providers } from './providers';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Echevaria Dental Clinic Management System',
  description: 'A responsive and role-aware dental clinic operations and billing web application.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body suppressHydrationWarning className="bg-[#F8F7F5] text-[#1F2933] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
