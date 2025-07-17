import { redis } from './redis'

export interface PasswordValidation {
  isValid: boolean
  errors: string[]
  strength: 'weak' | 'medium' | 'strong'
}

export const validatePassword = (password: string): PasswordValidation => {
  const errors: string[] = []
  let score = 0

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  } else if (password.length >= 12) {
    score += 2
  } else {
    score += 1
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  } else {
    score += 1
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  } else {
    score += 1
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  } else {
    score += 1
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  } else {
    score += 1
  }

  let strength: 'weak' | 'medium' | 'strong' = 'weak'
  if (score >= 5) strength = 'strong'
  else if (score >= 3) strength = 'medium'

  return {
    isValid: errors.length === 0,
    errors,
    strength
  }
}

export const checkRateLimit = async (email: string, action: 'login' | 'register'): Promise<{ allowed: boolean; remaining: number }> => {
  const key = `rate_limit:${action}:${email}`
  return await redis.checkRateLimit(key, 5, 900) // 5 attempts per 15 minutes
}

export const storeFailedAttempt = async (email: string): Promise<void> => {
  const key = `failed_attempts:${email}`
  await redis.set(key, Date.now(), 3600)
}