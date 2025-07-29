'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/lib/api'
import ChatInterface from '@/components/ChatInterface'
import { motion } from 'framer-motion'
import { ArrowLeft, Lock, AlertCircle } from 'lucide-react'

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
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [customAI, setCustomAI] = useState<CustomAI | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isOwner, setIsOwner] = useState(false)

  const aiId = params.aiId as string

  useEffect(() => {
    console.log('🔍 Custom AI Page useEffect triggered')
    console.log('isAuthenticated:', isAuthenticated)
    console.log('aiId:', aiId)
    console.log('user:', user)
    
    if (!isAuthenticated) {
      console.log('❌ Not authenticated, redirecting to /chat/custom')
      router.push('/chat/custom')
      return
    }

    console.log('✅ Authenticated, loading custom AI...')
    loadCustomAI()
  }, [isAuthenticated, aiId, user])

  const loadCustomAI = async () => {
    try {
      console.log('🚀 Starting loadCustomAI for aiId:', aiId)
      setIsLoading(true)

      // Get custom AI details
      console.log('📡 Calling apiClient.getCustomAIDetails...')
      const response = await apiClient.getCustomAIDetails(aiId)
      console.log('✅ API response received:', response)

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

      console.log('✅ Setting customAI and isOwner to true')
      setCustomAI(aiDetails)
      setIsOwner(true)

    } catch (error: any) {
      console.error('❌ Failed to load custom AI:', error)
      if (error.message.includes('404') || error.message.includes('not found')) {
        setError('Custom AI not found')
        setTimeout(() => {
          console.log('⏰ Redirecting to /chat/custom due to 404')
          router.push('/chat/custom')
        }, 2000)
      } else {
        setError('Failed to load AI details')
      }
    } finally {
      console.log('🏁 loadCustomAI finished, setting isLoading to false')
      setIsLoading(false)
    }
  }

  const handleBackToList = () => {
    router.push('/chat/custom')
  }

  if (!isAuthenticated) {
    return null
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

  if (error || !customAI || !isOwner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary flex items-center justify-center">
        <motion.div
          className="max-w-md mx-auto text-center p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            {error.includes('not found') ? (
              <AlertCircle className="w-10 h-10 text-red-400" />
            ) : (
              <Lock className="w-10 h-10 text-red-400" />
            )}
          </div>

          <h2 className="text-2xl font-bold text-soft-cream mb-4">
            {error.includes('not found') ? 'AI Not Found' : 'Access Denied'}
          </h2>

          <p className="text-soft-warmGray mb-8">
            {error || 'You can only access AI assistants that you created.'}
          </p>

          <motion.button
            onClick={handleBackToList}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-neon-pink to-neon-blue text-soft-cream px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-neon-pink/25 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Custom AIs
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-bg-secondary/90 border-b border-neon-pink/20 p-4 flex items-center gap-4">
        <button
          onClick={handleBackToList}
          className="p-2 hover:bg-neon-blue/20 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-neon-blue" />
        </button>

        <div className="flex-1">
          <h1 className="text-xl font-bold text-soft-cream">
            {customAI.name}
          </h1>
          {customAI.description && (
            <p className="text-sm text-soft-warmGray truncate max-w-2xl">
              {customAI.description}
            </p>
          )}
        </div>

        <div className="text-xs text-soft-warmGray">
          {customAI.files_count} files • Created {new Date(customAI.created_at).toLocaleDateString()}
        </div>
      </div>

      <div className="flex-1">
        <ChatInterface aiType="custom" aiId={aiId} />
      </div>
    </div>
  )
}