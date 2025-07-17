'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/lib/api'
import { motion } from 'framer-motion'
import { Plus, Hammer, FileText, Users, Clock } from 'lucide-react'
import ChatInterface from '@/components/ChatInterface'

interface CustomAI {
  id: string
  name: string
  description: string
  created_at: string
  files_count: number
  persistent_storage: boolean
  lightrag_python: boolean
}

export default function CustomChatPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [customAIs, setCustomAIs] = useState<CustomAI[]>([])
  const [selectedAI, setSelectedAI] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/chat')
      return
    }

    loadCustomAIs()
  }, [isAuthenticated, router])

  const loadCustomAIs = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.getMyAIs()
      setCustomAIs(response.ais)

      // Auto-select first AI if available
      if (response.ais.length > 0 && !selectedAI) {
        setSelectedAI(response.ais[0].id)
      }
    } catch (error) {
      console.error('Failed to load custom AIs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  if (selectedAI) {
    return <ChatInterface aiType="custom" aiId={selectedAI} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-800/10 to-gray-900/80 relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-6">
            Your Custom AI Assistants
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Create specialized AI assistants by uploading your own knowledge base
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gray-800/50 rounded-xl p-6 animate-pulse">
                <div className="w-12 h-12 bg-gray-700 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : customAIs.length === 0 ? (
          <motion.div
            className="text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-gray-800/50 rounded-2xl p-12 border border-gray-700/50">
              <Hammer className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">
                No Custom AIs Yet
              </h3>
              <p className="text-gray-400 mb-8">
                Create your first custom AI assistant by uploading knowledge files
              </p>
              <motion.button
                className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/create-ai')}
              >
                <Plus className="w-5 h-5 inline mr-2" />
                Create Custom AI
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {customAIs.map((ai, index) => (
              <motion.div
                key={ai.id}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-emerald-400/50 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-emerald-500/25"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => setSelectedAI(ai.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <Hammer className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    {new Date(ai.created_at).toLocaleDateString()}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{ai.name}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{ai.description}</p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {ai.files_count} files
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Active
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div
              className="bg-gray-800/30 backdrop-blur-sm border-2 border-dashed border-gray-600 rounded-2xl p-6 hover:border-emerald-400/50 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-h-[200px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: customAIs.length * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => router.push('/create-ai')}
            >
              <Plus className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">Create New AI</h3>
              <p className="text-sm text-gray-500 text-center">
                Upload knowledge files to create a specialized assistant
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}