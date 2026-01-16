import type { Metadata } from 'next';
import MoodSpectrumClient from './MoodSpectrumClient';

export const metadata: Metadata = {
  title: "Mood Spectrum Quiz",
  description: "Discover your emotional landscape. Rate the intensity of different emotions to understand your mood spectrum and emotional patterns.",
  alternates: {
    canonical: 'https://pairfit.in/quiz/mood-spectrum',
  },
  openGraph: {
    title: "Mood Spectrum Quiz",
    description: "Explore your emotional intensity across 10 different mood categories with our interactive slider-based quiz.",
  }
};

export default function MoodSpectrumPage() {
  return <MoodSpectrumClient />;
}
