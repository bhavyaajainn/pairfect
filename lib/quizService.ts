import { supabase } from './supabase';
import { PARTNER_PREFERENCES_QUESTIONS } from './quizData';

export interface QuizResponse {
  userId: string;
  quizId: string;
  answers: any;
}

export interface NamedQuizResponse {
  quizId: string;
  respondentName: string;
  answers: any;
  matchPercentage?: number;
}

/**
 * Save authenticated user's quiz response
 */
export async function saveQuizResponse(userId: string, quizId: string, answers: any) {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data, error } = await supabase
    .from('user_quiz_responses')
    .upsert({
      user_id: userId,
      quiz_id: quizId,
      answers,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,quiz_id'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get user's quiz response
 */
export async function getUserQuizResponse(userId: string, quizId: string) {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data, error } = await supabase
    .from('user_quiz_responses')
    .select('*')
    .eq('user_id', userId)
    .eq('quiz_id', quizId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
  return data;
}

/**
 * Get all quiz responses for a user
 */
export async function getUserQuizResponses(userId: string) {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data, error } = await supabase
    .from('user_quiz_responses')
    .select('quiz_id, answers, created_at, updated_at')
    .eq('user_id', userId);

  if (error) throw error;
  return data || [];
}

/**
 * Save named quiz response (from shared link)
 */
export async function saveNamedQuizResponse(
  quizId: string,
  respondentName: string,
  answers: any,
  matchPercentage?: number
) {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data, error } = await supabase
    .from('named_quiz_responses')
    .upsert({
      quiz_id: quizId,
      respondent_name: respondentName,
      answers,
      match_percentage: matchPercentage,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'quiz_id,respondent_name'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get named responses for a quiz
 */
export async function getNamedQuizResponses(quizId: string) {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data, error } = await supabase
    .from('named_quiz_responses')
    .select('*')
    .eq('quiz_id', quizId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Delete a named quiz response
 */
export async function deleteNamedQuizResponse(id: string) {
  if (!supabase) throw new Error("Supabase client not initialized");

  // 1. Get the response first to find the link_token
  const { data: responseData, error: fetchError } = await supabase
    .from('named_quiz_responses')
    .select('link_token')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error('Error fetching named response for deletion:', fetchError);
    // Continue nicely ? or throw? Let's throw to handle upstream
    throw fetchError; 
  }

  // 2. Delete the response
  const { error } = await supabase
    .from('named_quiz_responses')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting named response:', error);
    throw error;
  }

  // 3. Delete the associated Link if it exists
  if (responseData && responseData.link_token) {
    const { error: linkError } = await supabase
      .from('quiz_links')
      .delete()
      .eq('token', responseData.link_token);

    if (linkError) {
      console.error('Error deleting associated quiz link:', linkError);
      // We don't throw here strictly, as the primary goal (deleting the match) succeeded.
      // But logging is good.
    }
  }
}

/**
 * Generate a random token
 */
function generateToken(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Create a shareable quiz link
 */
export async function createQuizLink(quizId: string, respondentName: string, userId: string) {
  if (!supabase) throw new Error("Supabase client not initialized");
  // Check if respondent name is already used by this user for this quiz
  const { data: existingLinks, error: checkError } = await supabase
    .from('quiz_links')
    .select('id')
    .eq('created_by', userId)
    .eq('quiz_id', quizId)
    .eq('respondent_name', respondentName);

  if (checkError) throw checkError;
  if (existingLinks && existingLinks.length > 0) {
    throw new Error(`You have already created a link for "${respondentName}" for this quiz.`);
  }

  const token = generateToken(24);
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  const { data, error } = await supabase
    .from('quiz_links')
    .insert({
      quiz_id: quizId,
      token,
      expires_at: expiresAt.toISOString(),
      created_by: userId,
      respondent_name: respondentName,
      used: false
    })
    .select()
    .single();

  if (error) throw error;

  // 3. Pre-insert into named_quiz_responses with empty answers
  // This ensures the match exists and can be updated later
  const { error: responseError } = await supabase
    .from('named_quiz_responses')
    .insert({
      quiz_id: quizId,
      respondent_name: respondentName,
      answers: {}, // Empty answers initially
      match_percentage: 0,
      link_token: token
    });

  if (responseError) {
    console.error('Error pre-inserting response:', responseError);
    // We don't throw here to avoid breaking the link creation if the response insert fails
  }

  return data;
}

/**
 * Validate a quiz link token
 */
export async function validateQuizLink(token: string) {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data, error } = await supabase
    .from('quiz_links')
    .select('*')
    .eq('token', token)
    .single();

  if (error) {
    return { valid: false, error: 'Link not found' };
  }
  
  // ALWAYS check if a response already exists for this token
  const { data: responseData, error: responseError } = await supabase
    .from('named_quiz_responses')
    .select('id, answers')
    .eq('link_token', token)
    .maybeSingle();

  // A response is only "submitted" if the answers JSON is not empty
  const hasAnswers = responseData && responseData.answers && Object.keys(responseData.answers).length > 0;
  const alreadySubmitted = !!hasAnswers;

  if (alreadySubmitted) {
    return { 
      valid: false, 
      error: 'This link has already been used', 
      data,
      alreadySubmitted: true,
      respondentAnswers: responseData.answers,
      creatorId: data.created_by
    };
  }
  
  if (data.used) {
    return { 
      valid: false, 
      error: 'This link has already been used', 
      data,
      alreadySubmitted: false // Marked as used but no response found (maybe expired or deleted)
    };
  }
  
  const expiresAt = new Date(data.expires_at);
  if (expiresAt < new Date()) return { valid: false, error: 'This link has expired', data };

  return { valid: true, data };
}

/**
 * Submit a shared quiz response via standard update (triggers will handle validation)
 */
export async function submitSharedResponse(
  token: string,
  respondentName: string,
  answers: any,
  matchPercentage: number = 0
) {
  if (!supabase) throw new Error("Supabase client not initialized");
  console.log('Submitting shared response via Trigger:', { token, respondentName });
  
  // 1. Fetch the creator's answers to calculate match percentage
  const { data: linkData, error: linkError } = await supabase
    .from('quiz_links')
    .select('created_by, quiz_id')
    .eq('token', token)
    .single();

  if (linkError) throw linkError;

  const { data: creatorResponse, error: creatorError } = await supabase
    .from('user_quiz_responses')
    .select('answers')
    .eq('user_id', linkData.created_by)
    .eq('quiz_id', linkData.quiz_id)
    .single();

  if (creatorError) throw new Error('Could not find creator answers for comparison');

  // 2. Calculate match percentage
  let calculatedMatch = 0;
  const creatorAnswers = creatorResponse.answers;

  // Normalize creator answers for partner_preferences if it's an array (Legacy format support)
  let normalizedCreatorAnswers = creatorAnswers;
  if (linkData.quiz_id === 'partner_preferences' && Array.isArray(creatorAnswers)) {
    console.log('Normalizing legacy array answers for partner_preferences');
    normalizedCreatorAnswers = {};
    creatorAnswers.forEach((ans: any, idx: number) => {
      // Find question by category
      const q = PARTNER_PREFERENCES_QUESTIONS.find((q: any) => q.category === ans.category);
      if (q) {
        normalizedCreatorAnswers[q.id] = ans.choice;
      }
    });
  }
  
  if (linkData.quiz_id === 'life_priorities') {
    // For life priorities, we compare the order
    // Simple matching: how many items are in the same position?
    let matches = 0;
    const total = creatorAnswers.length;
    for (let i = 0; i < total; i++) {
      if (creatorAnswers[i].id === answers[i].id) matches++;
    }
    calculatedMatch = Math.round((matches / total) * 100);
  } else if (linkData.quiz_id === 'responsibility_reliability') {
    // For responsibility, compare selected task IDs
    const creatorSet = new Set(creatorAnswers);
    const respondentSet = new Set(answers);
    let matches = 0;
    creatorSet.forEach(id => {
      if (respondentSet.has(id)) matches++;
    });
    // Match is (common tasks / max possible tasks)
    calculatedMatch = Math.round((matches / 6) * 100);
  } else {
    // For other quizzes (key-value pairs)
    let matches = 0;
    let total = 0;
    for (const key in normalizedCreatorAnswers) {
      total++;
      if (normalizedCreatorAnswers[key] === answers[key]) matches++;
    }
    calculatedMatch = Math.round((matches / total) * 100);
  }

  // 3. Update the existing record with calculated match and answers
  const { data, error } = await supabase
    .from('named_quiz_responses')
    .update({
      answers: answers,
      match_percentage: calculatedMatch,
      updated_at: new Date().toISOString()
    })
    .eq('link_token', token)
    .select()
    .single();

  if (error) {
    console.error('Submission Error:', error);
    throw error;
  }
  return { success: true, data };
}

/**
 * Fetch all matches (respondent responses) for a user's quizzes
 */
export async function getUserMatches(userId: string) {
  if (!supabase) throw new Error("Supabase client not initialized");
  console.log('Fetching matches for user:', userId);
  
  // 1. Get all links created by this user
  const { data: userLinks, error: linksError } = await supabase
    .from('quiz_links')
    .select('token, quiz_id, respondent_name')
    .eq('created_by', userId);

  if (linksError) {
    console.error('Error fetching user links:', linksError);
    throw linksError;
  }

  if (!userLinks || userLinks.length === 0) {
    console.log('No links found for user');
    return [];
  }

  const tokens = userLinks.map((l: any) => l.token).filter(Boolean);
  
  // 2. Fetch responses. We try to find them by link_token first.
  // We use a more robust query that handles the "No matches yet" issue.
  const { data, error } = await supabase
    .from('named_quiz_responses')
    .select('*')
    .or(`link_token.in.(${tokens.join(',')})`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching named responses:', error);
    // Fallback: If token search fails, try searching by quiz_id and respondent_name pairs
    // (This is slower but more reliable for old data)
    console.log('Attempting fallback search...');
    const fallbackResults = [];
    for (const link of userLinks) {
      const { data: resp } = await supabase
        .from('named_quiz_responses')
        .select('*')
        .eq('quiz_id', link.quiz_id)
        .eq('respondent_name', link.respondent_name)
        .maybeSingle();
      if (resp) fallbackResults.push(resp);
    }
    return fallbackResults;
  }

  console.log(`Found ${data?.length || 0} matches:`, data);
  return data;
}

/**
 * Generate shareable link for a quiz (Legacy - replaced by token system)
 */
export function generateShareLink(userId: string, quizId: string): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  // This is now handled by createQuizLink which returns a token
  return `${baseUrl}/quiz/shared?u=${userId}&q=${quizId}`;
}
