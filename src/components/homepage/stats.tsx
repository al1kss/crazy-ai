'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Code, Users, MessageCircle, Zap } from 'lucide-react'

interface StatItem {
  id: string
  label: string
  value: number
  icon: JSX.Element
  increment: number
  color: string
}

interface ApiStatsResponse {
  total_users: number
  total_ais: number
  total_messages: number
  lines_of_code_generated: number
  last_updated: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://al1kss-safetyai.hf.space'

const useCountUp = (end: number, duration: number = 2, shouldStart: boolean = false) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!shouldStart) return

    let startTime: number | null = null
    let animationId: number

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime

      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / (duration * 1000), 1)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)

      setCount(Math.floor(end * easeOutQuart))

      if (progress < 1) {
        animationId = requestAnimationFrame(animate)
      }
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [end, duration, shouldStart])

  return count
}

const StatCard = ({ stat, index, isInView }: {
  stat: StatItem
  index: number
  isInView: boolean
}) => {
  const animatedValue = useCountUp(stat.value, 2.5, isInView)
  const displayValue = isInView ? animatedValue : 0

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.6,
        delay: index * 0.2,
        type: "spring",
        stiffness: 100
      }}
    >
      <div className="relative bg-bg-tertiary/30 backdrop-blur-md border border-soft-charcoal/30 rounded-2xl p-6 card-hover group-hover:border-neon-pink/50 transition-all duration-150">
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          style={{
            background: `radial-gradient(circle at center, ${stat.color}15 0%, transparent 70%)`,
            filter: 'blur(10px)',
          }}
        />

        <div className="relative z-10">
          <motion.div
            className="inline-flex p-3 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-150"
            style={{
              background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}10)`,
              color: stat.color
            }}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            {stat.icon}
          </motion.div>

          <div className="mb-2">
            <motion.span
              className="text-3xl md:text-4xl font-bold"
              style={{ color: stat.color }}
              key={displayValue}
            >
              {displayValue.toLocaleString()}
            </motion.span>
          </div>

          <p className="text-soft-warmGray text-sm font-medium group-hover:text-soft-cream transition-colors">
            {stat.label}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

const LiveStats = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [apiStats, setApiStats] = useState<ApiStatsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiStatsResponse = await response.json()
      setApiStats(data)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
      setError('Failed to load stats')
      setApiStats(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  useEffect(() => {
    const interval = setInterval(fetchStats, 20000) //update every 20 seconds
    return () => clearInterval(interval)
  }, [])

  const stats: StatItem[] = apiStats ? [
    {
      id: 'lines-of-code',
      label: 'Lines of Code Generated',
      value: apiStats.lines_of_code_generated,
      icon: <Code className="w-6 h-6" />,
      increment: 0,
      color: '#FF6B9D',
    },
    {
      id: 'active-users',
      label: 'Active Users',
      value: apiStats.total_users,
      icon: <Users className="w-6 h-6" />,
      increment: 0,
      color: '#4ECDC4',
    },
    {
      id: 'chats-created',
      label: 'New Chats Created',
      value: apiStats.total_messages,
      icon: <MessageCircle className="w-6 h-6" />,
      increment: 0,
      color: '#A8E6CF',
    },
  ] : []

  if (isLoading) {
    return (
      <section ref={ref} className="relative py-20 px-4 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-bg-tertiary/30 backdrop-blur-md border border-soft-charcoal/30 rounded-2xl p-6 animate-pulse">
                <div className="w-12 h-12 bg-soft-charcoal/50 rounded-xl mb-4"></div>
                <div className="h-8 bg-soft-charcoal/50 rounded mb-2"></div>
                <div className="h-4 bg-soft-charcoal/50 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error && !apiStats) {
    return (
      <section ref={ref} className="relative py-20 px-4 z-10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-6">
            <p className="text-red-400">⚠️ {error}</p>
            <button
              onClick={fetchStats}
              className="mt-4 px-4 py-2 bg-red-500/30 hover:bg-red-500/40 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} className="relative py-20 px-4 z-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.id}
              stat={stat}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default LiveStats