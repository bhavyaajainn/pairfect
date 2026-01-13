import type { Metadata } from 'next';
import ResponsibilityReliabilityClient from './ResponsibilityReliabilityClient';

export const metadata: Metadata = {
  title: "Responsibility & Reliability Quiz – Manage the Chaos | Pairfit",
  description: "How do you handle responsibility in a shared environment? Take the interactive Responsibility & Reliability task to explore your management style and teamwork alignment.",
  alternates: {
    canonical: 'https://pairfit.in/quiz/responsibility-reliability',
  },
  openGraph: {
    title: "Responsibility & Reliability Quiz | Pairfit - Effective Teamwork",
    description: "Manage a high-stakes scenario to discover your prioritization style and see how you complement your partner's approach to responsibility.",
  }
};

export default function ResponsibilityReliabilityPage() {
  return <ResponsibilityReliabilityClient />;
}
