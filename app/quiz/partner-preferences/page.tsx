import type { Metadata } from 'next';
import PartnerPreferencesClient from './PartnerPreferencesClient';

export const metadata: Metadata = {
  title: "Partner Preferences Quiz – Alignment & Lifestyle Match | Pairfit",
  description: "What do you value most in a partner? Take the interactive Partner Preferences quiz to define your ideal lifestyle alignment and future goals with a partner.",
  alternates: {
    canonical: 'https://pairfit.in/quiz/partner-preferences',
  },
  openGraph: {
    title: "Partner Preferences Quiz | Pairfit - Build Your Ideal Profile",
    description: "Define your lifestyle and relationship values through our interactive choice-based quiz. See how you match with your partner.",
  }
};

export default function PartnerPreferencesPage() {
  return <PartnerPreferencesClient />;
}
