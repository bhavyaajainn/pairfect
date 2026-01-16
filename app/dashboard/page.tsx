"use client";

import Link from 'next/link';
import { Heart, Film, Pizza, Plane, Music, Scale, Sparkles, HeartHandshake, MessageCircle, ClipboardCheck, Users, RefreshCw, Share2, CheckCircle } from 'lucide-react';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getUserQuizResponses, getUserMatches, deleteNamedQuizResponse } from '@/lib/quizService';
import { useNotification } from '@/app/context/NotificationContext';
import Button from '../components/Button';
import Card from '../components/Card';
import ShareModal from '@/app/components/ShareModal';
import MatchCard from '@/app/components/MatchCard';
import MatchDetailsModal from '@/app/components/MatchDetailsModal';
import styles from './page.module.css';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { showAlert, showConfirm } = useNotification();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'quizzes' | 'matches'>('quizzes');
  const [completedQuizzes, setCompletedQuizzes] = useState<Set<string>>(new Set());
  const [matches, setMatches] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    quiz: 'all',
    score: 'all'
  });
  const [loading, setLoading] = useState(true);
  const [shareModal, setShareModal] = useState<{ isOpen: boolean; quizId: string; quizTitle: string; quizDescription: string }>({
    isOpen: false,
    quizId: '',
    quizTitle: '',
    quizDescription: ''
  });
  const [detailsModal, setDetailsModal] = useState<{ isOpen: boolean; match: any; creatorAnswers: any }>({
    isOpen: false,
    match: null,
    creatorAnswers: null
  });

  const quizzes = [
    { 
      id: 'life_priorities', 
      icon: <Scale size={24} />, 
      title: 'Life Priorities', 
      description: 'Drag and drop to rank life events and reveal your subconscious priorities.', 
      questions: '5 items',
      href: '/quiz/life-priorities'
    },
    { 
      id: 'emotional_compatibility', 
      icon: <HeartHandshake size={24} />, 
      title: 'Emotional Compatibility', 
      description: 'See how you emotionally respond to different situations.', 
      questions: '10 questions',
      href: '/quiz/emotional-compatibility'
    },
    { 
      id: 'conflict_communication', 
      icon: <MessageCircle size={24} />, 
      title: 'Conflict & Communication', 
      description: 'Understand how you handle disagreement and communication.', 
      questions: '5 questions',
      href: '/quiz/conflict-communication'
    },
    {
      id: 'responsibility_reliability',
      title: "Responsibility & Reliability",
      description: "Can you handle the chaos of a wedding day?",
      icon: <ClipboardCheck size={24} />,
      questions: "6 tasks",
      href: '/quiz/responsibility-reliability',
      color: "bg-blue-100 text-blue-600"
    },
    {
      id: 'partner_preferences',
      title: "Partner Preferences",
      description: "Discover your ideal partner traits in this rapid-fire choice game.",
      icon: <Users size={24} />,
      questions: "10 choices",
      href: '/quiz/partner-preferences',
      color: "bg-pink-100 text-pink-600"
    },
    {
      id: 'mood_spectrum',
      title: "Mood Spectrum",
      description: "Rate your emotional intensity across 10 different mood categories.",
      icon: <Heart size={24} />,
      questions: "10 emotions",
      href: '/quiz/mood-spectrum',
      color: "bg-purple-100 text-purple-600"
    },
    {
      id: 'travel_planner',
      title: "Travel Itinerary Planner",
      description: "Plan your dream vacation with custom budget and detailed itinerary.",
      icon: <Plane size={24} />,
      questions: "7 steps",
      href: '/quiz/travel-planner',
      color: "bg-blue-100 text-blue-600"
    },
    {
      id: 'dream_life',
      title: "Dream Life Designer",
      description: "Create a visual mood board of your ideal lifestyle across 6 categories.",
      icon: <Sparkles size={24} />,
      questions: "6 categories",
      href: '/quiz/dream-life',
      color: "bg-pink-100 text-pink-600"
    }
  ];

  useEffect(() => {
    async function loadData() {
      if (authLoading) return;

      if (!user) {
        router.push('/');
        return;
      }

      try {
        const responses = await getUserQuizResponses(user.id);
        const completed = new Set<string>(responses.map((r: any) => String(r.quiz_id)));
        setCompletedQuizzes(completed);
      } catch (error) {
        console.error('Error loading quiz responses:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user, authLoading, router]);

  // Re-fetch matches when switching to the matches tab to ensure data is fresh
  useEffect(() => {
    if (activeTab === 'matches' && user) {
      getUserMatches(user.id).then(setMatches).catch(console.error);
    }
  }, [activeTab, user]);

  const handleCreateLink = (quizId: string, quizTitle: string, quizDescription: string) => {
    setShareModal({
      isOpen: true,
      quizId,
      quizTitle,
      quizDescription
    });
  };

  const filteredMatches = matches.filter(match => {
    const matchesSearch = match.respondent_name.toLowerCase().includes(filters.search.toLowerCase());
    const matchesQuiz = filters.quiz === 'all' || match.quiz_id === filters.quiz;
    
    let matchesScore = true;
    if (filters.score === 'high') matchesScore = match.match_percentage >= 90;
    else if (filters.score === 'medium') matchesScore = match.match_percentage >= 60 && match.match_percentage < 90;
    else if (filters.score === 'low') matchesScore = match.match_percentage < 60;
    else if (filters.score === 'pending') matchesScore = !match.answers || Object.keys(match.answers).length === 0;

    return matchesSearch && matchesQuiz && matchesScore;
  });

  const handleViewMatch = async (match: any) => {
    if (!user) return;
    
    try {
      // Fetch the creator's answers for this specific quiz
      const responses = await getUserQuizResponses(user.id);
      const creatorResponse = responses.find((r: any) => r.quiz_id === match.quiz_id);
      
      if (creatorResponse) {
        setDetailsModal({
          isOpen: true,
          match,
          creatorAnswers: creatorResponse.answers
        });
      } else {
        showAlert('Missing Data', 'We couldn\'t find your original answers for this quiz. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching creator answers:', error);
      showAlert('Error', 'We encountered a problem loading the match details. Please try again.');
    }
  };

  const handleDeleteMatch = async (id: string) => {
    showConfirm(
      'Delete Match',
      'Are you sure you want to delete this match? This action cannot be undone.',
      async () => {
        try {
          await deleteNamedQuizResponse(id);
          setMatches(prev => prev.filter(m => m.id !== id));
        } catch (error) {
          console.error('Error deleting match:', error);
          showAlert('Error', 'We couldn\'t delete the match. Please try again.');
        }
      }
    );
  };

  return (
    <div className={styles.container}>
      
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'quizzes' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('quizzes')}
          >
            Quizzes
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'matches' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('matches')}
          >
            My Matches
          </button>
        </div>
      </div>

      <main className={styles.content}>
        {activeTab === 'quizzes' ? (
          <div className={styles.grid}>
            {quizzes.map((quiz) => {
              const isCompleted = completedQuizzes.has(quiz.id);
              
              return (
                <Card key={quiz.id} hoverEffect className={styles.quizCard}>
                  <div className={styles.quizCardContent}>
                    <div className={styles.cardHeader}>
                      <div className={styles.quizIcon}>{quiz.icon}</div>
                      <div className={styles.headerBadges}>
                        {isCompleted && (
                          <span className={styles.completedBadge}>
                            <CheckCircle size={14} /> Completed
                          </span>
                        )}
                        <span className={styles.badge}>{quiz.questions}</span>
                      </div>
                    </div>
                    <div className={styles.cardBody}>
                      <h3 className={styles.quizTitle}>{quiz.title}</h3>
                      <p className={styles.quizDescription}>{quiz.description}</p>
                    </div>
                    
                    <div className={styles.cardFooter}>
                      {loading ? (
                        <Button disabled fullWidth>Loading...</Button>
                      ) : isCompleted ? (
                        <div className={styles.buttonGroup}>
                          <Link href={quiz.href} style={{ flex: 1 }}>
                            <Button variant="outline" fullWidth>
                              <RefreshCw size={16} style={{ marginRight: '0.5rem' }} />
                              Try Again
                            </Button>
                          </Link>
                          <Button 
                            variant="secondary" 
                            onClick={() => handleCreateLink(quiz.id, quiz.title, quiz.description)}
                            className={styles.shareButton}
                          >
                            <Share2 size={16} />
                          </Button>
                        </div>
                      ) : (
                        <Link href={quiz.href} style={{ width: '100%', display: 'block' }}>
                          <Button fullWidth>Start Quiz</Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className={styles.matchesSection}>
            <div className={styles.filterBar}>
              <div className={styles.filterGroup}>
                <input 
                  type="text" 
                  placeholder="Search by name..." 
                  className={styles.filterInput}
                  value={filters.search}
                  onChange={e => setFilters({...filters, search: e.target.value})}
                />
              </div>
              <div className={styles.filterGroup}>
                <select 
                  className={styles.filterSelect}
                  value={filters.quiz}
                  onChange={e => setFilters({...filters, quiz: e.target.value})}
                >
                  <option value="all">All Quizzes</option>
                  {quizzes.map(q => (
                    <option key={q.id} value={q.id}>{q.title}</option>
                  ))}
                </select>
              </div>
              <div className={styles.filterGroup}>
                <select 
                  className={styles.filterSelect}
                  value={filters.score}
                  onChange={e => setFilters({...filters, score: e.target.value})}
                >
                  <option value="all">All Scores</option>
                  <option value="high">High (&gt;90%)</option>
                  <option value="medium">Medium (60-90%)</option>
                  <option value="low">Low (&lt;60%)</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            <div className={styles.matchesList}>
              {filteredMatches.length > 0 ? (
                filteredMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    id={match.id}
                    respondentName={match.respondent_name}
                    quizTitle={match.quiz_id}
                    matchPercentage={match.match_percentage || 0}
                    date={match.created_at}
                    answers={match.answers}
                    onView={() => handleViewMatch(match)}
                    onDelete={handleDeleteMatch}
                  />
                ))
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>🔍</div>
                  <h2>No matches found</h2>
                  <p>Try adjusting your filters to find what you're looking for.</p>
                  <Button onClick={() => setFilters({ search: '', quiz: 'all', score: 'all' })}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <ShareModal 
        isOpen={shareModal.isOpen}
        onClose={() => setShareModal({ ...shareModal, isOpen: false })}
        quizId={shareModal.quizId}
        quizTitle={shareModal.quizTitle}
        quizDescription={shareModal.quizDescription}
      />

      <MatchDetailsModal
        isOpen={detailsModal.isOpen}
        onClose={() => setDetailsModal({ ...detailsModal, isOpen: false })}
        match={detailsModal.match}
        creatorAnswers={detailsModal.creatorAnswers}
      />
    </div>
  );
}
