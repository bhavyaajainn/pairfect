import type { Metadata } from 'next';
import EmotionalCompatibilityClient from './EmotionalCompatibilityClient';

export const metadata: Metadata = {
  title: "Emotional Compatibility Quiz – Deepen Your Connection | Pairfit",
  description: "How well do you understand your partner's emotional world? Take our interactive Emotional Compatibility quiz to explore response styles and build deeper bonds.",
  alternates: {
    canonical: 'https://pairfit.in/quiz/emotional-compatibility',
  },
  openGraph: {
    title: "Emotional Compatibility Quiz | Pairfit - Understanding the Heart",
    description: "Explore scenarios that reveal your emotional style and see how you align with your partner through this interactive exercise.",
  }
};

export default function EmotionalCompatibilityPage() {
  return <EmotionalCompatibilityClient />;
}
