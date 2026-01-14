import React from 'react';
import type { Metadata } from 'next';
import Footer from '../components/Footer';
import LandingPage from '../components/LandingPage';

export const metadata: Metadata = {
  title: "Start Quiz",
  description: "Begin your journey of discovery with Pairfit. Choose from our variety of relationship and personality quizzes to start building deeper connections today.",
};

export default function StartQuizPage() {
  return <LandingPage />;
}
