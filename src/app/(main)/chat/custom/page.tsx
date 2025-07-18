'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/lib/api'
import { motion } from 'framer-motion'
import { Plus, Hammer, FileText, Users, Clock, Edit, Trash2 } from 'lucide-react'
import {
  FaRobot, FaFire, FaBrain, FaHammer, FaRocket, FaGlobe,
  FaShieldAlt, FaCode, FaBook, FaFlask, FaGamepad, FaMagic,
  FaHeart, FaMusic, FaPalette, FaCamera, FaLeaf, FaStar,
  FaLightbulb, FaAtom, FaDna, FaMicroscope, FaChartLine, FaLock
} from 'react-icons/fa'
import CustomAIModal from '@/components/CustomAIModal'
import ChatInterface from '@/components/ChatInterface'

interface CustomAI {
  id: string
  name: string
  description: string
  created_at: string
  files_count: number
  persistent_storage: boolean
  lightrag_python: boolean
  icon?: string
  total_tokens?: number
  knowledge_size?: number
}

const AI_ICONS_MAP: { [key: string]: any } = {
  'Robot': FaRobot, 'Fire': FaFire, 'Brain': FaBrain, 'Hammer': FaHammer,
  'Rocket': FaRocket, 'Globe': FaGlobe, 'Shield': FaShieldAlt, 'Code': FaCode,
  'Book': FaBook, 'Flask': FaFlask, 'Game': FaGamepad, 'Magic': FaMagic,
  'Heart': FaHeart, 'Music': FaMusic, 'Palette': FaPalette, 'Camera': FaCamera,
  'Leaf': FaLeaf, 'Star': FaStar, 'Lightbulb': FaLightbulb, 'Atom': FaAtom,
  'DNA': FaDna, 'Microscope': FaMicroscope, 'Chart': FaChartLine, 'Lock': FaLock
}

const AI_ICON_COLORS: { [key: string]: string } = {
  'Robot': '#4ECDC4', 'Fire': '#E85A4F', 'Brain': '#A8E6CF', 'Hammer': '#FFD93D',
  'Rocket': '#6BCF7F', 'Globe': '#4D9DE0', 'Shield': '#E15554', 'Code': '#3BB273',
  'Book': '#F7931E', 'Flask': '#9B59B6', 'Game': '#FF6B9D', 'Magic': '#8E44AD',
  'Heart': '#E74C3C', 'Music': '#1ABC9C', 'Palette': '#E67E22', 'Camera': '#34495E',
  'Leaf': '#27AE60', 'Star': '#F39C12', 'Lightbulb': '#F1C40F', 'Atom': '#3498DB',
  'DNA': '#9B59B6', 'Microscope': '#2ECC71', 'Chart': '#E74C3C', 'Lock': '#95A5A6'
}

export default function CustomChatPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [customAIs, setCustomAIs] = useState<CustomAI[]>([])
  const [selectedAI, setSelectedAI] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAI, setEditingAI] = useState<CustomAI | null>(null)

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

      if (response.ais.length > 0 && !selectedAI) {
        setSelectedAI(response.ais[0].id)
      }
    } catch (error) {
      console.error('Failed to load custom AIs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateSuccess = async (aiId: string) => {
    await loadCustomAIs()
    setSelectedAI(aiId)
    setIsModalOpen(false)
    setEditingAI(null)
  }

  const handleEditAI = (ai: CustomAI) => {
    setEditingAI(ai)
    setIsModalOpen(true)
  }

  const handleDeleteAI = async (aiId: string) => {
    if (confirm('Are you sure you want to delete this AI? This action cannot be undone.')) {
      try {
        await apiClient.deleteCustomAI(aiId)
        await loadCustomAIs()
        if (selectedAI === aiId) {
          setSelectedAI(null)
        }
      } catch (error) {
        console.error('Failed to delete AI:', error)
      }
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getAIIcon = (iconName?: string) => {
    const IconComponent = AI_ICONS_MAP[iconName || 'Robot'] || FaRobot
    const color = AI_ICON_COLORS[iconName || 'Robot'] || '#4ECDC4'
    return { IconComponent, color }
  }

  if (!isAuthenticated) {
    return null
  }

  if (selectedAI) {
    return <ChatInterface aiType="custom" aiId={selectedAI} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-neon-pink/20 via-purple-500/20 to-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-teal-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 20, 0],
            rotate: [360, 180, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-neon-purple/10 to-neon-blue/10 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="h-1 w-24 bg-gradient-to-r from-neon-pink via-neon-blue to-neon-purple rounded-full"></div>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-6 leading-tight">
            Your Custom AI Assistants
          </h1>
          <p className="text-xl text-soft-warmGray max-w-3xl mx-auto leading-relaxed">
            Create a custom AI assistants by uploading your own knowledge files!
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-bg-tertiary/30 backdrop-blur-md border border-soft-charcoal/30 rounded-2xl p-6 animate-pulse">
                <div className="w-12 h-12 bg-soft-charcoal/50 rounded-xl mb-4"></div>
                <div className="h-6 bg-soft-charcoal/50 rounded mb-2"></div>
                <div className="h-4 bg-soft-charcoal/50 rounded mb-4"></div>
                <div className="h-4 bg-soft-charcoal/50 rounded w-1/2"></div>
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
            <div className="bg-bg-tertiary/30 backdrop-blur-md border border-soft-charcoal/30 rounded-2xl p-12 card-hover">
              <motion.div
                className="w-24 h-24 bg-gradient-to-br from-neon-pink/20 to-neon-blue/20 rounded-2xl flex items-center justify-center mx-auto mb-8"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <Hammer className="w-12 h-12 text-neon-blue" />
              </motion.div>

              <h3 className="text-3xl font-bold text-soft-cream mb-6">
                No Custom AIs Yet
              </h3>
              <p className="text-soft-warmGray text-lg mb-10 leading-relaxed">
                Create your first custom AI assistant by uploading knowledge files and building custom AI for your needs.
              </p>

              <motion.button
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-neon-pink to-neon-blue text-soft-cream px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-neon-pink/50 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                Create Custom AI
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {customAIs.map((ai, index) => {
              const { IconComponent, color } = getAIIcon(ai.icon)

              return (
                <motion.div
                  key={ai.id}
                  className="group relative bg-bg-tertiary/30 backdrop-blur-md border border-soft-charcoal/30 rounded-2xl p-6 card-hover hover:border-neon-pink/50 transition-all duration-300 cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  onClick={() => setSelectedAI(ai.id)}
                >
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at center, ${color}15 0%, transparent 70%)`,
                      filter: 'blur(10px)',
                    }}
                  />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <motion.div
                        className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                        style={{ backgroundColor: color + '20' }}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <IconComponent
                          className="w-6 h-6"
                          style={{ color }}
                        />
                      </motion.div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditAI(ai)
                          }}
                          className="p-2 hover:bg-neon-blue/20 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4 text-neon-blue" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteAI(ai.id)
                          }}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-soft-cream mb-2 group-hover:text-neon-blue transition-colors">
                      {ai.name}
                    </h3>
                    <p className="text-soft-warmGray text-sm mb-4 line-clamp-2 group-hover:text-soft-cream transition-colors">
                      {ai.description || 'Custom AI assistant'}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-soft-warmGray">
                        <div className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          <span>{ai.files_count || 0} files</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(ai.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-soft-warmGray">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Active</span>
                        </div>
                        {ai.knowledge_size && (
                          <span>{formatFileSize(ai.knowledge_size)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}

            <motion.div
              className="group bg-bg-tertiary/20 backdrop-blur-md border-2 border-dashed border-soft-charcoal/50 hover:border-neon-pink/50 rounded-2xl p-6 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-h-[200px] card-hover"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: customAIs.length * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => setIsModalOpen(true)}
            >
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-neon-pink/20 to-neon-blue/20 rounded-2xl flex items-center justify-center mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <Plus className="w-8 h-8 text-neon-blue group-hover:rotate-90 transition-transform duration-300" />
              </motion.div>

              <h3 className="text-lg font-semibold text-soft-cream mb-2 group-hover:text-neon-blue transition-colors">
                Create New AI
              </h3>
              <p className="text-sm text-soft-warmGray text-center group-hover:text-soft-cream transition-colors">
                Upload knowledge files to create a specialized assistant
              </p>
            </motion.div>
          </div>
        )}
      </div>

      <CustomAIModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingAI(null)
        }}
        onSuccess={handleCreateSuccess}
        editingAI={editingAI}
      />
    </div>
  )
}