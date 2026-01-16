"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plane, Clock, Share2, MapPin, AlertCircle, Calendar, Hotel, Palmtree, Utensils } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { saveQuizResponse, getUserQuizResponse } from '@/lib/quizService';
import Button from '../../components/Button';
import AuthModal from '../../components/AuthModal';
import styles from './quiz.module.css';
import { TRAVEL_DESTINATIONS } from '@/lib/quizData';

interface QuizProps {
  isShared?: boolean;
  onComplete?: (answers: any) => void;
  respondentName?: string;
}

type FlightClass = 'economy' | 'premiumEconomy' | 'business';
type MealPlan = 'budget' | 'midRange' | 'fineDining';

export default function TravelPlannerClient({ isShared, onComplete, respondentName }: QuizProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [gameState, setGameState] = useState<'details' | 'playing' | 'result'>(isShared ? 'playing' : 'details');
  const [saving, setSaving] = useState(false);
  const [hasTakenBefore, setHasTakenBefore] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Dubai destination (hardcoded)
  const destination = TRAVEL_DESTINATIONS.find(d => d.id === 'dubai')!;
  
  // Quiz state
  const [budget, setBudget] = useState(300000);
  const [duration, setDuration] = useState(5);
  const [flightClass, setFlightClass] = useState<FlightClass>('economy');
  
  // Hotel state: nights per category
  const [hotelNights, setHotelNights] = useState({
    threeStar: 5,
    fourStar: 0,
    fiveStar: 0
  });

  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [mealPlan, setMealPlan] = useState<MealPlan>('budget');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Sync hotel nights total when duration changes
  useEffect(() => {
    const totalAssigned = hotelNights.threeStar + hotelNights.fourStar + hotelNights.fiveStar;
    if (totalAssigned !== duration) {
      // Reset to default distribution if duration changes
      setHotelNights({
        threeStar: duration,
        fourStar: 0,
        fiveStar: 0
      });
    }
  }, [duration]);

  useEffect(() => {
    async function checkPreviousResponse() {
      if (user && !isShared) {
        try {
          const response = await getUserQuizResponse(user.id, 'travel_planner');
          if (response) {
            setHasTakenBefore(true);
          }
        } catch (error) {
          console.error('Error checking previous response:', error);
        }
      }
    }
    checkPreviousResponse();
  }, [user, isShared]);

  const handleStart = () => {
    if (!user && !isShared) {
      setIsAuthModalOpen(true);
      return;
    }
    setGameState('playing');
  };

  const calculateTotalCost = () => {
    // Flight cost (for 2 people)
    const flightCost = (destination.flights[flightClass].min + destination.flights[flightClass].max) / 2 * 2;
    
    // Hotel cost (sum of nights * price per night * 1 room)
    // Price per night average
    const p3 = (destination.hotels.threeStar.min + destination.hotels.threeStar.max) / 2;
    const p4 = (destination.hotels.fourStar.min + destination.hotels.fourStar.max) / 2;
    const p5 = (destination.hotels.fiveStar.min + destination.hotels.fiveStar.max) / 2;
    
    const hotelCost = (hotelNights.threeStar * p3) + (hotelNights.fourStar * p4) + (hotelNights.fiveStar * p5);
    
    // Activities cost
    const activitiesCost = selectedActivities.reduce((total, activityName) => {
      const activity = destination.activities.find(a => a.name === activityName);
      return total + (activity?.cost || 0) * 2; // for 2 people
    }, 0);
    
    // Meals cost (per day * duration * 2 people)
    const mealsCost = destination.meals[mealPlan] * duration * 2;
    
    return flightCost + hotelCost + activitiesCost + mealsCost;
  };

  const toggleActivity = (activityName: string) => {
    setSelectedActivities(prev => 
      prev.includes(activityName)
        ? prev.filter(a => a !== activityName)
        : [...prev, activityName]
    );
  };

  const handleHotelChange = (category: 'threeStar' | 'fourStar' | 'fiveStar', value: number) => {
    const newVal = Math.max(0, value);
    setHotelNights(prev => ({ ...prev, [category]: newVal }));
  };

  const totalAssignedNights = hotelNights.threeStar + hotelNights.fourStar + hotelNights.fiveStar;
  const isNightsValid = totalAssignedNights === duration;

  const handleComplete = async () => {
    const totalCost = calculateTotalCost();
    
    if (totalCost > budget || !isNightsValid) {
      return;
    }

    const itinerary = {
      budget,
      destination: destination.name,
      duration,
      flightClass,
      hotelNights,
      selectedActivities,
      mealPlan,
      totalCost,
    };

    setGameState('result');
    if (isShared && onComplete) {
      onComplete(itinerary);
      return;
    }
    if (user) {
      setSaving(true);
      try {
        await saveQuizResponse(user.id, 'travel_planner', itinerary);
      } catch (error) {
        console.error('Error saving quiz response:', error);
      } finally {
        setSaving(false);
      }
    }
  };

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(destination.activities.map(a => a.category || 'Other')))];
  
  const filteredActivities = activeCategory === 'All' 
    ? destination.activities 
    : destination.activities.filter(a => a.category === activeCategory);

  if (gameState === 'details') {
    return (
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={24} />
          <span>Back to Home</span>
        </Link>

        <div className={styles.detailsView}>
          <div className={styles.detailsIcon}>
            <Plane size={64} color="#3b82f6" />
          </div>
          <h1 className={styles.detailsTitle}>Dubai Travel Planner</h1>
          <p className={styles.detailsDescription}>
            Plan your dream Dubai vacation! Customize your trip duration, split your stay between luxury and budget hotels, 
            and explore over 20+ curated activities.
          </p>

          <div className={styles.detailsInfoGrid}>
            <div className={styles.infoItem}>
              <Clock size={20} />
              <span>5-30 Days</span>
            </div>
            <div className={styles.infoItem}>
              <MapPin size={20} />
              <span>Dubai, UAE</span>
            </div>
            <div className={styles.infoItem}>
              <Share2 size={20} />
              <span>Budget Planning</span>
            </div>
          </div>

          <div className={styles.detailsSection}>
            <h3>What You&apos;ll Plan</h3>
            <ul className={styles.detailsList}>
              <li><strong>Flexible Duration:</strong> Choose exactly how long you want to stay.</li>
              <li><strong>Split Stays:</strong> Mix and match hotels! Spend a few nights in luxury and the rest in comfort.</li>
              <li><strong>Activities Galore:</strong> Choose from 20+ experiences including beach clubs, theme parks, and culture.</li>
              <li><strong>Smart Budget:</strong> Real-time cost tracking ensures you stick to your limit.</li>
            </ul>
          </div>

          <div className={styles.detailsActions}>
            <Button size="lg" onClick={handleStart} className={styles.startBtn}>
              {hasTakenBefore ? 'Plan Another Trip' : 'Start Planning'}
            </Button>
            {!user && (
              <p className={styles.loginHint}>Login to save and share your travel plans.</p>
            )}
          </div>
        </div>

        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
        />
      </div>
    );
  }

  const totalCost = calculateTotalCost();
  const remainingBudget = budget - totalCost;
  const isOverBudget = remainingBudget < 0;

  return (
    <div className={styles.container}>
      <button 
        onClick={() => gameState === 'playing' ? setGameState('details') : router.push('/dashboard')} 
        className={styles.backLink} 
      >
        <ArrowLeft size={24} />
        <span>{gameState === 'playing' ? 'Exit Planner' : 'Dashboard'}</span>
      </button>

      <div className={styles.quizContainer}>
        <header className={styles.header}>
          <h1 className={styles.title}>Dubai Travel Planner</h1>
          {gameState === 'playing' && (
            <div className={styles.budgetTracker}>
              <div className={styles.budgetInfo}>
                <span>Budget: ₹{budget.toLocaleString()}</span>
                <span className={isOverBudget ? styles.overBudget : styles.underBudget}>
                  {isOverBudget ? 'Over' : 'Remaining'}: ₹{Math.abs(remainingBudget).toLocaleString()}
                </span>
              </div>
              <div className={styles.budgetBar}>
                <div 
                  className={styles.budgetBarFill} 
                  style={{ 
                    width: `${Math.min((totalCost / budget) * 100, 100)}%`,
                    backgroundColor: isOverBudget ? '#EF4444' : '#22C55E'
                  }}
                />
              </div>
            </div>
          )}
        </header>

        {gameState === 'playing' ? (
          <div className={styles.singlePageForm}>
            {/* Budget & Duration Section */}
            <div className={styles.formGrid}>
                <div className={styles.formSection}>
                    <h2 className={styles.sectionTitle}>
                        <div className={styles.titleIcon}><Utensils size={24} /></div>
                        Set Your Budget
                    </h2>
                    <div className={styles.budgetInput}>
                        <span className={styles.currencySymbol}>₹</span>
                        <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(parseInt(e.target.value) || 0)}
                        className={styles.budgetField}
                        step="10000"
                        min="50000"
                        />
                    </div>
                </div>

                <div className={styles.formSection}>
                    <h2 className={styles.sectionTitle}>
                        <div className={styles.titleIcon}><Calendar size={24} /></div>
                        Trip Duration
                    </h2>
                    <div className={styles.durationInputContainer}>
                        <input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
                            className={styles.durationField}
                            min="1"
                            max="30"
                        />
                        <span className={styles.daysLabel}>Days</span>
                    </div>
                    <p className={styles.helperText}>Customizable from 1 to 30 days</p>
                </div>
            </div>

            {/* Flights Section */}
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>
                <div className={styles.titleIcon}><Plane size={24} /></div>
                Choose Flight Class
              </h2>
              <div className={styles.optionsList}>
                {[
                  { key: 'economy', label: 'Economy', range: destination.flights.economy },
                  { key: 'premiumEconomy', label: 'Premium Economy', range: destination.flights.premiumEconomy },
                  { key: 'business', label: 'Business Class', range: destination.flights.business },
                ].map((option) => (
                  <button
                    key={option.key}
                    className={`${styles.optionCard} ${flightClass === option.key ? styles.selected : ''}`}
                    onClick={() => setFlightClass(option.key as FlightClass)}
                  >
                    <div className={styles.optionContent}>
                      <h4>{option.label}</h4>
                      <p className={styles.priceRange}>
                        ₹{option.range.min.toLocaleString()} - ₹{option.range.max.toLocaleString()} (for 2)
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Hotels Section */}
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>
                <div className={styles.titleIcon}><Hotel size={24} /></div>
                Plan Your Stay
              </h2>
              <p className={styles.sectionDescription}>
                Allocate your <strong>{duration} nights</strong> across different hotel categories. Mixed stays allowed!
              </p>
              
              <div className={`${styles.hotelValidation} ${isNightsValid ? styles.valid : styles.invalid}`}>
                {isNightsValid 
                    ? `✓ ${totalAssignedNights}/${duration} nights assigned` 
                    : `⚠️ ${totalAssignedNights}/${duration} nights assigned. Please adjust.`}
              </div>

              <div className={styles.hotelGrid}>
                {[
                  { key: 'threeStar', label: '3-Star Hotel', range: destination.hotels.threeStar },
                  { key: 'fourStar', label: '4-Star Hotel', range: destination.hotels.fourStar },
                  { key: 'fiveStar', label: '5-Star Hotel', range: destination.hotels.fiveStar },
                ].map((option) => (
                  <div key={option.key} className={styles.hotelCardInput}>
                    <div className={styles.hotelImage}>
                        <Image src={option.range.imageSrc} alt={option.label} fill style={{ objectFit: 'cover' }} />
                        <div className={styles.hotelOverlay}>
                            <h4>{option.label}</h4>
                        </div>
                    </div>
                    <div className={styles.hotelContent}>
                        <p className={styles.priceRange}>₹{option.range.min.toLocaleString()} - ₹{option.range.max.toLocaleString()} / night</p>
                        <div className={styles.nightsInput}>
                            <label>Nights:</label>
                            <input 
                                type="number" 
                                min="0" 
                                max={duration}
                                value={hotelNights[option.key as keyof typeof hotelNights]}
                                onChange={(e) => handleHotelChange(option.key as any, parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <p className={styles.totalNightsCost}>
                            Subtotal: ₹{(((option.range.min + option.range.max) / 2) * hotelNights[option.key as keyof typeof hotelNights]).toLocaleString()}
                        </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activities Section */}
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>
                <div className={styles.titleIcon}><Palmtree size={24} /></div>
                Select Activities
              </h2>
              
              <div className={styles.categoryTabs}>
                {categories.map(cat => (
                    <button 
                        key={cat}
                        className={`${styles.categoryTab} ${activeCategory === cat ? styles.active : ''}`}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
              </div>

              <div className={styles.activitiesGrid}>
                {filteredActivities.map((activity) => (
                  <div
                    key={activity.name}
                    className={`${styles.activityCard} ${selectedActivities.includes(activity.name) ? styles.selected : ''}`}
                    onClick={() => toggleActivity(activity.name)}
                  >
                    <div className={styles.activityImage}>
                      <Image src={activity.imageSrc} alt={activity.name} fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div className={styles.activityInfo}>
                      <h4>{activity.name}</h4>
                      <p className={styles.activityCategory}>{activity.category}</p>
                      <p className={styles.activityPrice}>
                        {activity.cost === 0 ? 'Free' : `₹${activity.cost.toLocaleString()} × 2`}
                      </p>
                    </div>
                    {selectedActivities.includes(activity.name) && (
                      <div className={styles.selectedBadge}>✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Meals Section */}
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>
                <div className={styles.titleIcon}><Utensils size={24} /></div>
                Choose Meal Plan
              </h2>
              <div className={styles.optionsList}>
                {[
                  { key: 'budget', label: 'Budget Meals', cost: destination.meals.budget },
                  { key: 'midRange', label: 'Mid-Range Dining', cost: destination.meals.midRange },
                  { key: 'fineDining', label: 'Fine Dining', cost: destination.meals.fineDining },
                ].map((option) => (
                  <button
                    key={option.key}
                    className={`${styles.optionCard} ${mealPlan === option.key ? styles.selected : ''}`}
                    onClick={() => setMealPlan(option.key as MealPlan)}
                  >
                    <div className={styles.optionContent}>
                      <h4>{option.label}</h4>
                      <p className={styles.priceRange}>₹{option.cost.toLocaleString()} per person per day</p>
                      <p className={styles.totalNights}>
                        Total: ₹{(option.cost * duration * 2).toLocaleString()} ({duration} days, 2 people)
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message if Over Budget */}
            {(isOverBudget || !isNightsValid) && (
              <div className={styles.errorMessage}>
                <AlertCircle size={20} />
                <div>
                  <strong>{isOverBudget ? 'Budget Exceeded!' : 'Invalid Hotel Nights'}</strong>
                  {isOverBudget && (
                      <p>Your itinerary costs ₹{totalCost.toLocaleString()}, which is ₹{Math.abs(remainingBudget).toLocaleString()} over your budget.</p>
                  )}
                  {!isNightsValid && (
                      <p>You have assigned {totalAssignedNights} nights, but your trip is {duration} days.</p>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className={styles.submitSection}>
              <Button 
                onClick={handleComplete}
                className={styles.submitButton}
                disabled={isOverBudget || !isNightsValid}
              >
                {isOverBudget 
                    ? 'Reduce Costs to Continue' 
                    : !isNightsValid 
                        ? 'Fix Hotel Nights to Continue'
                        : 'Complete Itinerary'}
              </Button>
            </div>
          </div>
        ) : (
          <div className={styles.resultCard}>
            <h2 className={styles.resultTitle}>Your Dubai Itinerary</h2>
            <p className={styles.resultDescription}>
              Here&apos;s your complete travel plan for Dubai!
            </p>
            
            {saving && (
              <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' }}>
                Saving your itinerary...
              </p>
            )}

            <div className={styles.itinerarySummary}>
              <div className={styles.summaryItem}>
                <strong>Destination:</strong> {destination.name}, {destination.country}
              </div>
              <div className={styles.summaryItem}>
                <strong>Duration:</strong> {duration} days
              </div>
              <div className={styles.summaryItem}>
                <strong>Flight Class:</strong> {flightClass === 'economy' ? 'Economy' : flightClass === 'premiumEconomy' ? 'Premium Economy' : 'Business'}
              </div>
              <div className={styles.summaryItem}>
                <strong>Hotel Breakdown:</strong>
                <ul style={{ margin: 0, paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                    {hotelNights.threeStar > 0 && <li>3-Star: {hotelNights.threeStar} nights</li>}
                    {hotelNights.fourStar > 0 && <li>4-Star: {hotelNights.fourStar} nights</li>}
                    {hotelNights.fiveStar > 0 && <li>5-Star: {hotelNights.fiveStar} nights</li>}
                </ul>
              </div>
              <div className={styles.summaryItem}>
                <strong>Activities:</strong> {selectedActivities.length} selected
              </div>
              <div className={styles.summaryItem}>
                <strong>Meal Plan:</strong> {mealPlan === 'budget' ? 'Budget' : mealPlan === 'midRange' ? 'Mid-Range' : 'Fine Dining'}
              </div>
            </div>

            <div className={styles.costBreakdown}>
              <h3>Cost Breakdown</h3>
              <div className={styles.costItem}>
                <span>Flights (2 people):</span>
                <span>₹{(((destination.flights[flightClass].min + destination.flights[flightClass].max) / 2) * 2).toLocaleString()}</span>
              </div>
              <div className={styles.costItem}>
                <span>Hotels (Total):</span>
                <span>₹{((hotelNights.threeStar * (destination.hotels.threeStar.min + destination.hotels.threeStar.max)/2) + 
                          (hotelNights.fourStar * (destination.hotels.fourStar.min + destination.hotels.fourStar.max)/2) + 
                          (hotelNights.fiveStar * (destination.hotels.fiveStar.min + destination.hotels.fiveStar.max)/2)).toLocaleString()}</span>
              </div>
              <div className={styles.costItem}>
                <span>Activities:</span>
                <span>₹{selectedActivities.reduce((total, name) => {
                  const activity = destination.activities.find(a => a.name === name);
                  return total + (activity?.cost || 0) * 2;
                }, 0).toLocaleString()}</span>
              </div>
              <div className={styles.costItem}>
                <span>Meals ({duration} days, 2 people):</span>
                <span>₹{(destination.meals[mealPlan] * duration * 2).toLocaleString()}</span>
              </div>
              <div className={`${styles.costItem} ${styles.totalCost}`}>
                <strong>Total Cost:</strong>
                <strong>₹{totalCost.toLocaleString()}</strong>
              </div>
              <div className={`${styles.costItem} ${styles.underBudget}`}>
                <span>Under Budget:</span>
                <span>₹{Math.abs(remainingBudget).toLocaleString()}</span>
              </div>
            </div>

            <div className={styles.resultActions}>
              <Button 
                onClick={() => router.push('/dashboard')}
                className={styles.backButton}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
