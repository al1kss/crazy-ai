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
  const [realTimeValue, setRealTimeValue] = useState(stat.value)

  useEffect(() => {
    if (!isInView) return

    const interval = setInterval(() => {
      setRealTimeValue(prev => prev + Math.floor(Math.random() * stat.increment) + 1)
    }, Math.random() * 5000 + 3000)

    return () => clearInterval(interval)
  }, [isInView, stat.increment])

  const displayValue = isInView ? (animatedValue === stat.value ? realTimeValue : animatedValue) : 0

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

  const stats: StatItem[] = [
    {
      id: 'lines-of-code',
      label: 'Lines of Code Generated',
      value: 2456789,
      icon: <Code className="w-6 h-6" />,
      increment: 50,
      color: '#FF6B9D',
    },
    {
      id: 'active-users',
      label: 'Active Users',
      value: 12345,
      icon: <Users className="w-6 h-6" />,
      increment: 3,
      color: '#4ECDC4',
    },
    {
      id: 'chats-created',
      label: 'New Chats Created',
      value: 89234,
      icon: <MessageCircle className="w-6 h-6" />,
      increment: 25,
      color: '#A8E6CF',
    },
  ]

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