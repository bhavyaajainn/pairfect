import type { Metadata } from 'next';
import ConflictCommunicationClient from './ConflictCommunicationClient';

export const metadata: Metadata = {
  title: "Conflict & Communication Quiz – Resolve Disagreements | Pairfit",
  description: "How do you handle relationship conflict? Take our interactive Conflict and Communication quiz to discover your style and improve mutual understanding.",
  alternates: {
    canonical: 'https://pairfit.in/quiz/conflict-communication',
  },
  openGraph: {
    title: "Conflict & Communication Quiz | Pairfit - Navigating Disagreements",
    description: "Identify your communication patterns during conflict and find constructive ways to build a stronger bond with your partner.",
  }
};

export default function ConflictCommunicationPage() {
  return <ConflictCommunicationClient />;
}
