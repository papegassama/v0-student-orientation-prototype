'use server'

import { createClient } from '@/lib/supabase/server'

interface AuthUser {
  id: string
  email: string
  full_name?: string
}

/**
 * Sign up a new user with email and password
 */
export async function signUp(
  email: string,
  password: string,
  fullName: string
) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email: email.toLowerCase().trim(),
    password,
    options: {
      data: {
        full_name: fullName.trim(),
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/orientation`,
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  return {
    user: {
      id: data.user?.id || '',
      email: data.user?.email || '',
      full_name: fullName,
    } as AuthUser,
    data,
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.toLowerCase().trim(),
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  if (!data.user) {
    throw new Error('Failed to retrieve user data')
  }

  const fullName = data.user.user_metadata?.full_name || ''

  return {
    user: {
      id: data.user.id,
      email: data.user.email || '',
      full_name: fullName,
    } as AuthUser,
    session: data.session,
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message)
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  return {
    id: user.id,
    email: user.email || '',
    full_name: user.user_metadata?.full_name || '',
  }
}

/**
 * Save quiz result for current user
 */
export async function saveQuizResult(
  userId: string,
  answers: Record<string, unknown>,
  recommendations: unknown[]
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('quiz_results')
    .insert([
      {
        user_id: userId,
        answers,
        recommendations,
      },
    ])
    .select()

  if (error) {
    throw new Error(error.message)
  }

  return data?.[0]
}

/**
 * Get all quiz results for current user
 */
export async function getQuizResults(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('quiz_results')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

/**
 * Delete a quiz result
 */
export async function deleteQuizResult(userId: string, resultId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('quiz_results')
    .delete()
    .eq('id', resultId)
    .eq('user_id', userId)

  if (error) {
    throw new Error(error.message)
  }
}

/**
 * Save orientation response
 */
export async function saveOrientationResponse(
  userId: string,
  questionId: string,
  responseValue: string
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('orientation_responses')
    .insert([
      {
        user_id: userId,
        question_id: questionId,
        response_value: responseValue,
      },
    ])
    .select()

  if (error) {
    throw new Error(error.message)
  }

  return data?.[0]
}

/**
 * Get all orientation responses for current user
 */
export async function getOrientationResponses(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('orientation_responses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

/**
 * Listen to auth state changes from client
 */
export function onAuthStateChanged(
  callback: (user: AuthUser | null) => void
): () => void {
  // This is a placeholder - actual implementation would use browser events
  // The real auth state tracking happens through Supabase session cookies
  callback(null)
  return () => {}
}
