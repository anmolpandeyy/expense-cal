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
  description: 'A simple expense calculator app',
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
      <body className={inter.className}>
        <main className="max-w-md mx-auto bg-white min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
} 