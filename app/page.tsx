import type { Metadata } from 'next';
import LandingPage from './components/LandingPage';

export const metadata: Metadata = {
  title: "Pairfit – Find Your Perfect Match",
  description: "Discover your relationship compatibility and emotional alignment with Pairfit. Take fun, expert-designed quizzes with partners and friends to build deeper connections.",
  alternates: {
    canonical: 'https://pairfit.in/',
  },
  openGraph: {
    title: "Pairfit – Find Your Perfect Match",
    description: "Connect on a deeper level through interactive quizzes designed to reveal your perfect match and emotional alignment.",
    url: 'https://pairfit.in/',
  }
};

export default function Home() {
  return <LandingPage />;
}
