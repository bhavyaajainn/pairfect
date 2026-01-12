import { Metadata } from 'next';
import LifePrioritiesClient from './LifePrioritiesClient';

export const metadata: Metadata = {
  title: "Life Priorities Quiz – Discover Your Subconscious Values | Pairfit",
  description: "What truly drives your decisions? Take our interactive Life Priorities test to rank your subconscious values and improve your relationship alignment.",
  alternates: {
    canonical: 'https://pairfit.in/quiz/life-priorities',
  },
  openGraph: {
    title: "Life Priorities Test | Pairfit - Deepen Your Connections",
    description: "Discover your psychological priorities and see how they align with your partner through this interactive ranking exercise.",
  }
};

export default function LifePrioritiesPage() {
  return <LifePrioritiesClient />;
}

