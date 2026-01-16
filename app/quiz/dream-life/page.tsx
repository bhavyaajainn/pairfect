import type { Metadata } from 'next';
import DreamLifeClient from './DreamLifeClient';

export const metadata: Metadata = {
  title: "Dream Life Designer Quiz",
  description: "Design your ideal lifestyle! Choose your dream home, career, vacation style, daily routine, and more to create your perfect life vision.",
  alternates: {
    canonical: 'https://pairfit.in/quiz/dream-life',
  },
  openGraph: {
    title: "Dream Life Designer Quiz",
    description: "Create a visual mood board of your dream life with our interactive lifestyle quiz.",
  }
};

export default function DreamLifePage() {
  return <DreamLifeClient />;
}
