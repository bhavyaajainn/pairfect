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
    default: "Pairfect | Find Your Perfect Match through Fun Quizzes",
    template: "%s | Pairfect"
  },
  description: "Discover your compatibility with friends and partners through interactive and meaningful relationship quizzes. Build stronger bonds with Pairfect.",
  keywords: ["relationship quiz", "compatibility test", "pairfect", "emotional compatibility", "couple quizzes", "get to know someone"],
  authors: [{ name: "Pairfect Team" }],
  openGraph: {
    title: "Pairfect | Relationship Compatibility Quizzes",
    description: "Discover your compatibility score and connect on a Deeper level through play.",
    url: "https://pairfect.app",
    siteName: "Pairfect",
    images: [
      {
        url: "https://res.cloudinary.com/di81jpl3e/image/upload/v1767365500/share-poster_nljhm9.jpg",
        width: 1200,
        height: 630,
        alt: "Pairfect - Connect on a deeper level",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pairfect | Find Your Perfect Match",
    description: "Take fun quizzes with friends and discover your compatibility score.",
    images: ["https://res.cloudinary.com/di81jpl3e/image/upload/v1767365500/share-poster_nljhm9.jpg"],
  },
  robots: {
    index: true,
    follow: true,
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
