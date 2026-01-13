import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { NotificationProvider } from "./context/NotificationContext";
import ErrorBoundary from "./components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Pairfit | Find Your Perfect Match through Fun Quizzes",
    template: "%s | Pairfit"
  },
  description: "Discover your compatibility with friends and partners through interactive and meaningful relationship quizzes. Build stronger bonds with Pairfit.",
  keywords: ["relationship quiz", "compatibility test", "pairfit", "emotional compatibility", "couple quizzes", "get to know someone"],
  authors: [{ name: "Pairfit Team" }],
  openGraph: {
    title: "Pairfit | Relationship Compatibility Quizzes",
    description: "Discover your compatibility score and connect on a Deeper level through play.",
    url: "https://pairfit.app",
    siteName: "Pairfit",
    images: [
      {
        url: "https://res.cloudinary.com/di81jpl3e/image/upload/v1767365500/share-poster_nljhm9.jpg",
        width: 1200,
        height: 630,
        alt: "Pairfit - Connect on a deeper level",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pairfit | Find Your Perfect Match",
    description: "Take fun quizzes with friends and discover your compatibility score.",
    images: ["https://res.cloudinary.com/di81jpl3e/image/upload/v1767365500/share-poster_nljhm9.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'icon', url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'icon', url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ErrorBoundary>
          <NotificationProvider>
            <Navbar />
            {children}
          </NotificationProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
