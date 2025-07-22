import React from 'react';
import Navigation from '@/components/Navigation';
import './globals.css';

export const metadata = {
  title: 'Minimalist Streaming Platform',
  description: 'A black and white streaming platform with Web3 integration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="min-h-screen bg-background text-foreground">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <header>
          <Navigation />
        </header>
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          {children}
        </main>
      </body>
    </html>
  );
}
