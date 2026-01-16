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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://pairfit.in'),
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
    url: "https://pairfit.in",
    siteName: "Pairfit",
    images: [
      {
        url: "/share-poster.png",
        width: 1200,
        height: 1200,
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
    images: ["/share-poster.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Pairfit",
                "url": "https://pairfit.in",
                "logo": "https://pairfit.in/icon.png"
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Pairfit",
                "url": "https://pairfit.in",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://pairfit.in/dashboard?search={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": "Sitelinks",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Emotional Compatibility Quiz",
                    "url": "https://pairfit.in/quiz/emotional-compatibility"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "About Pairfit",
                    "url": "https://pairfit.in/about"
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "Contact",
                    "url": "https://pairfit.in/contact"
                  },
                  {
                    "@type": "ListItem",
                    "position": 4,
                    "name": "Start Quiz",
                    "url": "https://pairfit.in/start-quiz"
                  },
                  {
                    "@type": "ListItem",
                    "position": 5,
                    "name": "Life Priorities Quiz",
                    "url": "https://pairfit.in/quiz/life-priorities"
                  },
                  {
                    "@type": "ListItem",
                    "position": 6,
                    "name": "Conflict & Communication Quiz",
                    "url": "https://pairfit.in/quiz/conflict-communication"
                  }
                ]
              }
            ])
          }}
        />
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
