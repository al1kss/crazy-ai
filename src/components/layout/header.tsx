'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, Bot, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    { name: 'About', href: '/about' },
    { name: 'Our Team', href: '/team' },
  ]

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-xl border-b border-soft-charcoal/30"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
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
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/chat">
              <motion.button
                className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-neon-pink to-neon-blue text-soft-cream font-semibold px-6 py-2 rounded-lg hover:shadow-lg hover:shadow-neon-pink/50 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Start Chat</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>

            <button
              className="md:hidden text-soft-warmGray hover:text-neon-blue transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} //for phones
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <motion.div //for phones too
          className="md:hidden"
          initial={false}
          animate={{ height: isMobileMenuOpen ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
          style={{ overflow: 'hidden' }}
        >
          <div className="py-4 space-y-4">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-soft-warmGray hover:text-neon-blue transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link href="/chat">
              <button
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-neon-pink to-neon-blue text-soft-cream font-semibold px-6 py-3 rounded-lg mt-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Start Chat</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </motion.div>
      </nav>
    </motion.header>
  )
}

export default Header