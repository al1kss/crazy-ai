'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Flame, Bot, Brain, Hammer, Sparkles, ArrowRight, Clock } from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'

export default function ChatPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  const aiModels = [
    {
      id: 'fire-safety',
      icon: <Flame className="w-8 h-8" />,
      title: 'Fire Safety Expert',
      description: 'Specialized knowledge in fire safety regulations, building codes, and emergency procedures.',
      isActive: true,
      gradient: 'from-red-500/20 via-orange-500/20 to-yellow-500/20',
      borderGlow: 'border-red-500/30 hover:border-red-400/50',
      iconBg: 'bg-red-100 dark:bg-red-900/40',
      iconColor: 'text-red-600 dark:text-red-400',
      route: '/chat/fire-safety'
    },
    {
      id: 'general',
      icon: <Bot className="w-8 h-8" />,
      title: 'General Assistant',
      description: 'Versatile AI for everyday tasks, questions, and general problem-solving.',
      isActive: true,
      gradient: 'from-blue-500/20 via-cyan-500/20 to-teal-500/20',
      borderGlow: 'border-blue-500/30 hover:border-blue-400/50',
      iconBg: 'bg-blue-100 dark:bg-blue-900/40',
      iconColor: 'text-blue-600 dark:text-blue-400',
      route: '/chat/general'
    },
    {
      id: 'physics',
      icon: <Brain className="w-8 h-8" />,
      title: 'Physics Tutor',
      description: 'Advanced physics concepts, problem-solving, and educational support.',
      isActive: false,
      gradient: 'from-purple-500/20 via-indigo-500/20 to-blue-500/20',
      borderGlow: 'border-purple-500/30 hover:border-purple-400/50',
      iconBg: 'bg-purple-100 dark:bg-purple-900/40',
      iconColor: 'text-purple-600 dark:text-purple-400',
      route: '/chat/physics'
    },
    {
      id: 'custom',
      icon: <Hammer className="w-8 h-8" />,
      title: 'Build Your Own',
      description: 'Upload your knowledge base and create personalized AI assistants.',
      isActive: true,
      gradient: 'from-emerald-500/20 via-green-500/20 to-lime-500/20',
      borderGlow: 'border-emerald-500/30 hover:border-emerald-400/50',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      route: '/chat/custom'
    }
  ]

  const handleModelSelect = (model: typeof aiModels[0]) => {
    if (!model.isActive) return

    if (model.id === 'custom' && !isAuthenticated) {
      alert('Please sign in to create custom AI assistants')
      return
    }

    router.push(`/chat/${model.id}`)
  }

  return (<div
          className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-800/10 to-gray-900/80 border-t border-gray-700/30 relative overflow-hidden">
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
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20">
          <motion.div
              className="text-center mb-16"
              initial={{opacity: 0, y: 30}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.8}}
          >
            <motion.div
                className="flex justify-center mb-8"
                initial={{opacity: 0, scaleX: 0}}
                animate={{opacity: 1, scaleX: 1}}
                transition={{duration: 0.6, delay: 0.2}}
            >
              <div className="h-1 w-24 bg-gradient-to-r from-neon-pink via-blue-500 to-purple-500 rounded-full"></div>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-6 leading-tight">
              Choose Your AI Assistant
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Select from our specialized AI models, each designed for specific domains and use cases.
              Start chatting with the intelligence that matches your needs.
            </p>
          </motion.div>

          <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 0.1, duration: 0.8}}
          >
            {aiModels.map((model, index) => (
                <motion.div
                    key={model.id}
                    className={`relative group cursor-pointer transition-all duration-75 ${
                        !model.isActive ? 'opacity-60 cursor-not-allowed' : ''
                    } ${model.id === 'custom' && !isAuthenticated ? 'opacity-60' : ''}`}
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: index * 0.05, duration: 0.3}}
                    whileHover={model.isActive ? {scale: 1.02, y: -5} : {}}
                    onClick={() => handleModelSelect(model)}
                >
                  <div className={`
                    relative overflow-hidden rounded-2xl border backdrop-blur-sm
                    bg-gradient-to-br ${model.gradient}
                    ${model.borderGlow}
                    ${model.isActive ? 'hover:shadow-2xl hover:shadow-purple-500/25' : ''}
                    transition-all duration-75 p-8
                    flex flex-col justify-between h-full
                  `}>

                    {model.isActive && (
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            initial={{x: '-100%'}}
                            whileHover={{x: '100%'}}
                            transition={{duration: 0.6}}
                        />
                    )}

                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-6">
                        <div className={`
                      w-16 h-16 rounded-xl ${model.iconBg} 
                      flex items-center justify-center group-hover:scale-110 transition-transform duration-300
                    `}>
                          <div className={model.iconColor}>
                            {model.icon}
                          </div>
                        </div>

                        {!model.isActive && (
                            <motion.div
                                className="flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full"
                                initial={{scale: 0}}
                                animate={{scale: 1}}
                                transition={{delay: index * 0.05}}
                            >
                              <Clock className="w-4 h-4 text-amber-400"/>
                              <span className="text-amber-400 text-sm font-medium">Coming Soon</span>
                            </motion.div>
                        )}
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-200 transition-colors">
                        {model.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed mb-6">
                        {model.description}
                      </p>

                      {model.isActive && (
                          <motion.div
                              className="flex items-center gap-2 text-blue-400 font-semibold group-hover:text-blue-300 transition-colors"
                              whileHover={{x: 5}}
                          >
                            <span>Start Chatting</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
                          </motion.div>
                      )}
                    </div>

                    <div
                        className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                    <div
                        className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                  </div>
                </motion.div>
            ))}
          </motion.div>

          <motion.div
              className="text-center mt-16 -mb-8"
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 1.2, duration: 0.6}}
          >
            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
              <Sparkles className="w-4 h-4 text-blue-400"/>
              <span>Powered by LightRAG & Cloudflare AI</span>
            </div>

            <motion.p
                className="text-gray-500 mt-4 max-w-2xl mx-auto"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{delay: 1.4, duration: 0.6}}
            >
              Each AI assistant is trained on specialized knowledge bases to provide accurate,
              contextual responses in their respective domains.
            </motion.p>
          </motion.div>
        </div>
      </div>
  )
}