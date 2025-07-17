'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { apiClient, User } from '@/lib/api'
import { validatePassword, checkRateLimit, storeFailedAttempt } from '@/lib/auth-utils'

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, name: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing token on mount
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')

    if (savedToken && savedUser) {
      try {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user data:', error)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      }
    }

    setIsLoading(false)
  }, [])

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  useEffect(() => {
    const handleAuthRequired = () => {
      logout()
    }

    window.addEventListener('auth-required', handleAuthRequired)
    return () => window.removeEventListener('auth-required', handleAuthRequired)
  }, [logout])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const rateLimit = await checkRateLimit(email, 'login')
      if (!rateLimit.allowed) {
        throw new Error('Too many login attempts. Please try again later.')
      }

      const response = await apiClient.login(email, password)

      setToken(response.token)
      setUser(response.user)

      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('auth_user', JSON.stringify(response.user))
    } catch (error: any) {
      await storeFailedAttempt(email)
      console.error('Login error:', error)
      if (error.message.includes('401')) {
        throw new Error('Invalid email or password')
      } else if (error.message.includes('429')) {
        throw new Error('Too many attempts. Please try again later.')
      } else {
        throw new Error(error.message || 'Login failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, name: string, password: string) => {
    setIsLoading(true)
    try {
      const validation = validatePassword(password)
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '))
      }

      const rateLimit = await checkRateLimit(email, 'register')
      if (!rateLimit.allowed) {
        throw new Error('Too many registration attempts. Please try again later.')
      }

      const response = await apiClient.register(email, name, password)

      setToken(response.token)
      setUser(response.user)

      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('auth_user', JSON.stringify(response.user))
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }


  const value = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}