import { Metadata } from 'next';
import LandingPage from './components/LandingPage';

export const metadata: Metadata = {
  title: "Home | Pairfect - Find Your Perfect Match",
  description: "Take fun relationship quizzes with friends and discover your compatibility score. Join Pairfect today to build deeper connections.",
  openGraph: {
    title: "Pairfect | Discover Your Relationship Compatibility",
    description: "Connect on a deeper level through interactive quizzes designed to reveal your perfect match.",
  }
};

export default function Home() {
  return <LandingPage />;
}
