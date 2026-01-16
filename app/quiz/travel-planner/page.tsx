import type { Metadata } from 'next';
import TravelPlannerClient from './TravelPlannerClient';

export const metadata: Metadata = {
  title: "Dubai Travel Planner Quiz",
  description: "Plan your dream Dubai vacation! Set your budget and create a detailed itinerary with flights, hotels, activities, and meals for 2 people. Budget validation ensures you stay within limits.",
  alternates: {
    canonical: 'https://pairfit.in/quiz/travel-planner',
  },
  openGraph: {
    title: "Dubai Travel Planner Quiz",
    description: "Design your perfect Dubai trip with our interactive travel planner. Set your budget and get a complete itinerary with real-time cost tracking.",
  }
};

export default function TravelPlannerPage() {
  return <TravelPlannerClient />;
}
