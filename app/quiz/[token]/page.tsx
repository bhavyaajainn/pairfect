import { Metadata } from 'next';
import SharedQuizClient from './SharedQuizClient';
import { validateQuizLink } from '@/lib/quizService';

type Props = {
  params: { token: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  
  try {
    const result = await validateQuizLink(token);
    const quizTitle = result.data?.quiz_id?.split(/[-_]/).map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'Quiz';

    return {
      title: `${quizTitle}`,
      description: `You've been invited to take the ${quizTitle} on Pairfect. Discover your compatibility and connect on a deeper level!`,
      openGraph: {
        title: `Take the ${quizTitle} on Pairfect!`,
        description: `Connect on a deeper level through play.`,
        images: [{
          url: 'https://res.cloudinary.com/di81jpl3e/image/upload/v1767365500/share-poster_nljhm9.jpg',
          width: 1200,
          height: 1200,
          alt: 'Pairfect'
        }],
        url: `https://pairfect.app/quiz/${token}`,
      },
      twitter: {
        card: "summary_large_image",
        title: `Take the ${quizTitle} on Pairfect!`,
        description: `Connect on a deeper level through play.`,
        images: ['https://res.cloudinary.com/di81jpl3e/image/upload/v1767365500/share-poster_nljhm9.jpg'],
      }
    };
  } catch (error) {
    return {
      title: "Shared Quiz | Pairfect",
    };
  }
}

export default async function SharedQuizPage({ params }: Props) {
  const { token } = await params;
  return <SharedQuizClient token={token} />;
}
