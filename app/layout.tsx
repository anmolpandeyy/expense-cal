import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

/**
 * Inter font configuration with Latin subset.
 * Used as the main font throughout the application.
 */
const inter = Inter({ subsets: ['latin'] });

/**
 * Metadata for the application.
 * Defines title and description for SEO and browser tabs.
 */
export const metadata: Metadata = {
  title: 'ExpenseCal - Expense Calculator',
  description: 'A mobile-first expense tracking application',
  manifest: '/expense-cal/manifest.json',
  themeColor: '#818cf8',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ExpenseCal',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
    icon: '/expense-cal/icons/icon-192x192.png',
    apple: '/expense-cal/icons/icon-192x192.png',
  },
};

/**
 * Root layout component for the application.
 * Wraps all pages with common HTML structure and styling.
 * 
 * @param props - Component props
 * @param props.children - Child components to render within the layout
 * @returns Root layout with children
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="ExpenseCal" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ExpenseCal" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/expense-cal/icons/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <main className="max-w-md mx-auto bg-white min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
} 