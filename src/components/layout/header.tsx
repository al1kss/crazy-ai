'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { User, LogOut, Menu, X, Bot, ArrowRight, Flame, Bot as GeneralBot, Brain, Hammer, Clock } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import AuthModal from '../AuthModal'
import { useRouter } from 'next/navigation'

const Header = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()

  const navigationItems = [
    { name: 'About', href: '/about' },
    { name: 'Our Team', href: '/team' },
    { name: 'Feedback', href: '/feedback' },
  ]

  const aiModels = [
    {
      id: 'fire-safety',
      icon: <Flame className="w-5 h-5" />,
      title: 'Fire Safety Expert',
      description: 'Specialized knowledge in fire safety regulations, building codes, and emergency procedures.',
      isActive: true,
      route: '/chat/fire-safety',
      gradient: 'from-red-500/20 via-orange-500/20 to-yellow-500/20',
      borderGlow: 'border-red-500/30 hover:border-red-400/50',
      iconBg: 'bg-red-100 dark:bg-red-900/40',
      iconColor: 'text-red-600 dark:text-red-400',
    },
    {
      id: 'general',
      icon: <GeneralBot className="w-5 h-5" />,
      title: 'General Assistant',
      description: 'Versatile AI for everyday tasks, questions, and general problem-solving.',
      isActive: false,
      route: '/chat/general',
      gradient: 'from-blue-500/20 via-cyan-500/20 to-teal-500/20',
      borderGlow: 'border-blue-500/30 hover:border-blue-400/50',
      iconBg: 'bg-blue-100 dark:bg-blue-900/40',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      id: 'physics',
      icon: <Brain className="w-5 h-5" />,
      title: 'Physics Tutor',
      description: 'Advanced physics concepts, problem-solving, and educational support.',
      isActive: false,
      route: '/chat/physics',
      gradient: 'from-purple-500/20 via-indigo-500/20 to-blue-500/20',
      borderGlow: 'border-purple-500/30 hover:border-purple-400/50',
      iconBg: 'bg-purple-100 dark:bg-purple-900/40',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      id: 'custom',
      icon: <Hammer className="w-5 h-5" />,
      title: 'Build Your Own',
      description: 'Upload your knowledge base and create personalized AI assistants.',
      isActive: true,
      route: '/chat/custom',
      gradient: 'from-emerald-500/20 via-green-500/20 to-lime-500/20',
      borderGlow: 'border-emerald-500/30 hover:border-emerald-400/50',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
  ]

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthModalMode(mode)
    setIsAuthModalOpen(true)
    setIsDropdownOpen(false) // Close dropdown when opening modal
  }

  const handleModelSelect = (model: typeof aiModels[0]) => {
    if (!model.isActive) return

    setIsDropdownOpen(false) // Close dropdown

    if (model.id === 'custom' && !isAuthenticated) {
      openAuthModal('login')
      return
    }

    router.push(model.route)
  }

  const handleStartChatClick = () => {
    if (isAuthenticated) {
      setIsDropdownOpen(!isDropdownOpen)
    } else {
      openAuthModal('login')
    }
  }

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-navy-900/80 border-b border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div
              className="relative"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-neon-pink to-neon-blue rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-soft-cream" />
              </div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-neon-pink to-neon-blue rounded-lg blur-md opacity-50"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-soft-cream to-neon-blue bg-clip-text text-transparent group-hover:from-neon-pink group-hover:to-neon-blue transition-all duration-300">
              YourAI
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-soft-warmGray hover:text-neon-blue transition-colors duration-300 font-medium relative group"
              >
                {item.name}
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-pink to-neon-blue origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                />
              </Link>
            ))}

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{user?.name}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                  <div className="relative">
                    <motion.button
                      onClick={handleStartChatClick}
                      className="flex items-center space-x-1 bg-gradient-to-r from-neon-pink to-neon-blue text-soft-cream text-sm font-medium px-4 py-2 rounded-md hover:shadow-md hover:shadow-neon-pink/40 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Start Chat
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <motion.div
                        className="absolute top-full mt-2 right-0 bg-navy-800 border border-white/10 rounded-lg shadow-lg p-4 z-50 min-w-[300px]"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {aiModels.map((model, index) => (
                          <motion.div
                            key={model.id}
                            className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer transition-all duration-300 ${
                              !model.isActive ? 'opacity-60 cursor-not-allowed' : 'hover:bg-navy-700'
                            }`}
                            onClick={() => handleModelSelect(model)}
                            whileHover={model.isActive ? { scale: 1.02 } : {}}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index, duration: 0.3 }}
                          >
                            <div className={`
                              w-10 h-10 rounded-lg ${model.iconBg} 
                              flex items-center justify-center flex-shrink-0
                              ${model.iconColor}
                            `}>
                              {model.icon}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-300 font-medium">{model.title}</p>
                              <p className="text-xs text-gray-400 line-clamp-2">{model.description}</p>
                              {!model.isActive && (
                                <div className="flex items-center gap-1 mt-1">
                                  <Clock className="w-3 h-3 text-amber-400" />
                                  <span className="text-amber-400 text-xs">Coming Soon</span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Sign In
                  </button>
                  <motion.button
                    onClick={() => openAuthModal('login')}
                    className="flex items-center space-x-1 bg-gradient-to-r from-neon-pink to-neon-blue text-soft-cream text-sm font-medium px-4 py-2 rounded-md hover:shadow-md hover:shadow-neon-pink/40 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start Chat
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          <button
            className="md:hidden text-soft-warmGray hover:text-neon-blue transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-navy-800 border-t border-white/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-gray-300 hover:text-white transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {isAuthenticated ? (
                <div className="space-y-4 border-t border-white/10 pt-4">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <User className="w-4 h-4" />
                    <span>{user?.name}</span>
                  </div>
                  {aiModels.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        handleModelSelect(model)
                        setIsMobileMenuOpen(false)
                      }}
                      className={`block w-full text-left text-gray-300 hover:text-white transition-colors font-medium ${
                        !model.isActive ? 'opacity-60 cursor-not-allowed' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3 p-2">
                        <div className={`
                          w-8 h-8 rounded-md ${model.iconBg} 
                          flex items-center justify-center
                          ${model.iconColor}
                        `}>
                          {model.icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{model.title}</p>
                          <p className="text-xs text-gray-400">{model.description}</p>
                          {!model.isActive && (
                            <div className="flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3 text-amber-400" />
                              <span className="text-amber-400 text-xs">Coming Soon</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      logout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="block w-full text-left text-gray-400 hover:text-white transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-4 border-t border-white/10 pt-4">
                  <button
                    onClick={() => {
                      openAuthModal('login')
                      setIsMobileMenuOpen(false)
                    }}
                    className="block w-full text-left text-gray-300 hover:text-white transition-colors"
                  >
                    Sign In
                  </button>
                  <motion.button
                      onClick={handleStartChatClick}
                      className="flex items-center space-x-1 bg-gradient-to-r from-neon-pink to-neon-blue text-soft-cream text-sm font-medium px-4 py-2 rounded-md hover:shadow-md hover:shadow-neon-pink/40 transition-all duration-300"
                      whileHover={{scale: 1.05}}
                      whileTap={{scale: 0.95}}
                  >
                    Start Chat
                    <ArrowRight className="w-4 h-4"/>
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </nav>

      {isDropdownOpen && (
          <div
              className="fixed inset-0 z-30"
              onClick={() => setIsDropdownOpen(false)}
          />
      )}

      <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authModalMode}
      />
    </motion.header>
  )
}

export default Header