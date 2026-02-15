'use server'

import { sql } from './db'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'

export interface AuthUser {
  id: string
  email: string
  fullName: string
}

export interface SessionData {
  userId: string
  email: string
  fullName: string
  createdAt: Date
}

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
const SALT_ROUNDS = 10

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Compare a plain text password with a hashed password
 */
export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword)
}

/**
 * Generate a secure session token
 */
export function generateSessionToken(): string {
  return randomBytes(32).toString('hex')
}

/**
 * Sign up a new user
 */
export async function signUp(
  email: string,
  password: string,
  fullName: string
): Promise<AuthUser> {
  try {
    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM user_profiles WHERE email = ${email.toLowerCase()}
    `

    if (existingUser.length > 0) {
      throw new Error('Email already registered')
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const result = await sql`
      INSERT INTO user_profiles (email, full_name, password_hash, created_at, updated_at)
      VALUES (${email.toLowerCase()}, ${fullName}, ${hashedPassword}, NOW(), NOW())
      RETURNING id, email, full_name as "fullName"
    `

    if (!result.length) {
      throw new Error('Failed to create user')
    }

    return {
      id: result[0].id,
      email: result[0].email,
      fullName: result[0].fullName,
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error('Signup failed')
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string): Promise<AuthUser> {
  try {
    const result = await sql`
      SELECT id, email, full_name as "fullName", password_hash as "passwordHash"
      FROM user_profiles
      WHERE email = ${email.toLowerCase()}
    `

    if (!result.length) {
      throw new Error('Invalid email or password')
    }

    const user = result[0]
    const passwordMatch = await verifyPassword(password, user.passwordHash)

    if (!passwordMatch) {
      throw new Error('Invalid email or password')
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error('Sign in failed')
  }
}

/**
 * Create a session for a user
 */
export async function createSession(userId: string): Promise<string> {
  try {
    const token = generateSessionToken()
    const expiresAt = new Date(Date.now() + SESSION_DURATION)

    await sql`
      INSERT INTO sessions (user_id, token, expires_at, created_at)
      VALUES (${userId}, ${token}, ${expiresAt}, NOW())
    `

    return token
  } catch (error) {
    throw new Error('Failed to create session')
  }
}

/**
 * Get user from session token
 */
export async function getUserFromSession(token: string): Promise<AuthUser | null> {
  try {
    const result = await sql`
      SELECT up.id, up.email, up.full_name as "fullName"
      FROM sessions s
      JOIN user_profiles up ON s.user_id = up.id
      WHERE s.token = ${token} AND s.expires_at > NOW()
    `

    if (!result.length) {
      return null
    }

    return {
      id: result[0].id,
      email: result[0].email,
      fullName: result[0].fullName,
    }
  } catch (error) {
    return null
  }
}

/**
 * Invalidate a session
 */
export async function invalidateSession(token: string): Promise<void> {
  try {
    await sql`
      DELETE FROM sessions WHERE token = ${token}
    `
  } catch (error) {
    throw new Error('Failed to invalidate session')
  }
}

/**
 * Save quiz result
 */
export async function saveQuizResult(
  userId: string,
  answers: Record<string, unknown>,
  recommendations: unknown[],
  topCategories?: Record<string, unknown>
): Promise<string> {
  try {
    const result = await sql`
      INSERT INTO quiz_results (user_id, answers, recommendations, top_categories, created_at, completed_at)
      VALUES (${userId}, ${JSON.stringify(answers)}, ${JSON.stringify(recommendations)}, ${topCategories ? JSON.stringify(topCategories) : null}, NOW(), NOW())
      RETURNING id
    `

    if (!result.length) {
      throw new Error('Failed to save quiz result')
    }

    return result[0].id
  } catch (error) {
    throw new Error('Failed to save quiz result')
  }
}

/**
 * Get quiz results for a user
 */
export async function getQuizResults(userId: string): Promise<any[]> {
  try {
    const results = await sql`
      SELECT * FROM quiz_results
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `

    return results
  } catch (error) {
    throw new Error('Failed to fetch quiz results')
  }
}

/**
 * Delete a quiz result
 */
export async function deleteQuizResult(userId: string, resultId: string): Promise<void> {
  try {
    await sql`
      DELETE FROM quiz_results
      WHERE id = ${resultId} AND user_id = ${userId}
    `
  } catch (error) {
    throw new Error('Failed to delete quiz result')
  }
}

/**
 * Save orientation response
 */
export async function saveOrientationResponse(
  userId: string,
  questionId: string,
  responseValue: string
): Promise<string> {
  try {
    const result = await sql`
      INSERT INTO orientation_responses (user_id, question_id, response_value, created_at)
      VALUES (${userId}, ${questionId}, ${responseValue}, NOW())
      RETURNING id
    `

    if (!result.length) {
      throw new Error('Failed to save orientation response')
    }

    return result[0].id
  } catch (error) {
    throw new Error('Failed to save orientation response')
  }
}

/**
 * Get orientation responses for a user
 */
export async function getOrientationResponses(userId: string): Promise<any[]> {
  try {
    const results = await sql`
      SELECT * FROM orientation_responses
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `

    return results
  } catch (error) {
    throw new Error('Failed to fetch orientation responses')
  }
}
