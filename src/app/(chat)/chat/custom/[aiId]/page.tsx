'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/lib/api'
import ChatInterface from '@/components/ChatInterface'

interface CustomAI {
  id: string
  name: string
  description?: string
  user_id: string
  created_at: string
  files_count: number
  total_tokens?: number
  file_count?: number
}

export default function CustomAIChatPage() {
  const params = useParams()
  const { user, isAuthenticated } = useAuth()
  const [customAI, setCustomAI] = useState<CustomAI | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const aiId = params.aiId as string

  useEffect(() => {
    if (isAuthenticated && aiId) {
      loadCustomAI()
    }
  }, [isAuthenticated, aiId])

  const loadCustomAI = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.getCustomAIDetails(aiId)

      const aiDetails: CustomAI = {
        id: response.id,
        name: response.name,
        description: response.description || '',
        user_id: response.user_id || '',
        created_at: response.created_at,
        files_count: response.files_count || response.file_count || 0,
        total_tokens: response.total_tokens,
        file_count: response.file_count
      }

      setCustomAI(aiDetails)
    } catch (error) {
      console.error('Failed to load custom AI:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-soft-warmGray">Loading AI details...</p>
        </div>
      </div>
    )
  }

  return <ChatInterface aiType="custom" aiId={aiId} />
}