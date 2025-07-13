'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Bot, Brain, Flame, Hammer, Sparkles } from 'lucide-react'
import { Analytics } from "@vercel/analytics/next"
import LiveStats from '../components/homepage/stats'

const useTypingEffect = (words: string[], speed = 110, delayBetweenWords = 2000) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentWord = words[currentWordIndex]!

    const timeout = setTimeout(() => {
      if (!isDeleting && currentText === currentWord) {
        setTimeout(() => setIsDeleting(true), delayBetweenWords)
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false)
        setCurrentWordIndex((prev) => (prev + 1) % words.length)
      } else if (isDeleting) {
        setCurrentText(currentWord.substring(0, currentText.length - 1))
      } else {
        setCurrentText(currentWord.substring(0, currentText.length + 1))
      }
    }, isDeleting ? speed / 2 : speed)

    return () => clearTimeout(timeout)
  }, [currentText, currentWordIndex, isDeleting, words, speed, delayBetweenWords])

  return currentText
}

const AIModelCard = ({ icon, title, description, comingSoon = false, isActive = false }: {
  icon: JSX.Element
  title: string
  description: string
  comingSoon?: boolean
  isActive?: boolean
}) => {
  return (
    <motion.div
      className={`relative group cursor-pointer p-6 rounded-2xl border transition-all duration-300 ${
        isActive 
          ? 'bg-gradient-to-br from-neon-pink/10 to-neon-blue/10 border-neon-pink/50 shadow-lg shadow-neon-pink/25' 
          : 'bg-bg-tertiary/50 border-soft-charcoal hover:border-neon-blue/50'
      } ${comingSoon ? 'opacity-60' : ''}`}
      whileHover={{
        scale: comingSoon ? 1 : 1.02,
        y: comingSoon ? 0 : -5,
      }}
      transition={{ duration: 0.2 }}
    >
      {comingSoon && (
        <div className="absolute -top-3 -right-3">
          <span className="bg-gradient-to-r from-neon-purple to-neon-blue text-soft-cream text-xs px-3 py-1 rounded-full font-medium">
            Coming Soon
          </span>
        </div>
      )}

      <div className={`text-3xl mb-4 ${isActive ? 'text-neon-pink' : 'text-neon-blue'}`}>
        {icon}
      </div>

      <h3 className="text-xl font-bold text-soft-cream mb-2 group-hover:text-neon-blue transition-colors">
        {title}
      </h3>

      <p className="text-soft-warmGray text-sm leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}

export default function HomePage() {
  const typingWords = ["Build with AI", "Create with AI", "Innovate with AI", "It's YourAI"]
  const typedText = useTypingEffect(typingWords, 115, 2000)

  return (
    <div className="min-h-screen">
      <Analytics />

      <section className="relative min-h-screen flex flex-col justify-center items-center px-4 overflow-hidden">
        <motion.div
            className="text-center z-10 max-w-6xl mx-auto"
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.8}}
        >
          <motion.p
              className="text-neon-blue font-medium text-lg mb-8 tracking-wide mt-10"
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: 0.3, duration: 0.6}}
          >
            Next Generation AI Assistant
          </motion.p>

          <div className="mb-2">
            <div className="relative">
              <h1 className="text-8xl md:text-7xl font-bold mb-4">
                <span className="bg-gradient-to-r from-soft-cream via-neon-blue to-neon-pink bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">
                  {typedText}
                </span>
                <motion.span
                    className="inline-block w-1 h-14 md:h-19 bg-neon-pink ml-2"
                    animate={{opacity: [1, 0]}}
                    transition={{duration: 1, repeat: Infinity}}
                />
              </h1>

              <motion.div
                className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-neon-pink via-neon-blue to-neon-purple rounded-full"
                initial={{ width: "30%" }}
                animate={{ width: `${(typedText.length / 17) * 30}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <motion.p
                className="text-2xl md:text-2xl text-soft-cream max-w-4xl mx-auto leading-relaxed mb-1 mt-14"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{delay: 0.6, duration: 0.6}}
            >
              I built this build your own AI to help coders all around the world transform their workflow with intelligent AI assistants made for professionals and enthusiasts. This tool was designed with custom made LightRAG feature integrations.
            </motion.p>

            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.8, duration: 0.6}}
            >
              <div className="w-screen max-w-none self-start text-left justify-self-center mt-0" style={{marginTop: "-40px"}}>
                <LiveStats/>
              </div>
            </motion.div>
          </div>

          <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 -mt-3"
              style={{marginTop: "-20px"}}
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: 1.0, duration: 0.6}}
          >
            <motion.button
                className="group relative bg-gradient-to-r from-neon-pink to-neon-blue text-soft-cream font-semibold px-8 py-4 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-neon-pink/50"
                whileHover={{scale: 1.05}}
                whileTap={{scale: 0.95}}
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Chatting
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
              </span>
              <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-pink"
                  initial={{x: "100%"}}
                  whileHover={{x: "0%"}}
                  transition={{duration: 0.3}}
              />
            </motion.button>

            <motion.button
                className="border border-neon-blue/50 text-neon-blue font-semibold px-8 py-4 rounded-xl hover:bg-neon-blue/10 transition-all duration-300 hover:border-neon-blue hover:shadow-lg hover:shadow-neon-blue/25"
                whileHover={{scale: 1.05}}
                whileTap={{scale: 0.95}}
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          className="z-10 w-full max-w-6xl mx-auto mb-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-soft-cream mb-4">
              Choose Your AI Assistant
            </h2>
            <p className="text-soft-warmGray text-lg max-w-2xl mx-auto">
              Select from our specialized AI models, each designed for specific domains and use cases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AIModelCard
                icon={<Flame/>}
                title="Fire Safety Expert"
                description="Specialized knowledge in fire safety regulations, building codes, and emergency procedures."
                isActive={true}
            />
            <AIModelCard
                icon={<Bot/>}
                title="General Assistant"
                description="Versatile AI for everyday tasks, questions, and general problem-solving."
                comingSoon={true}
            />
            <AIModelCard
                icon={<Brain/>}
                title="Physics Tutor"
                description="Advanced physics concepts, problem-solving, and educational support."
                comingSoon={true}
            />
            <AIModelCard
                icon={<Hammer/>}
                title="Custom AI Builder"
                description="Upload your knowledge base and create personalized AI assistants."
                comingSoon={true}
            />
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 mt-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <div className="flex items-center gap-2 text-soft-warmGray text-sm mt-10">
            <Sparkles className="w-4 h-4 text-neon-blue" />
            <span>Powered by LightRAG & Cloudflare AI</span>
          </div>
        </motion.div>
      </section>
    </div>
  )
}