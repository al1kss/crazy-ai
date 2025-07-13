'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface AmbientOrb {
  id: number
  size: number
  x: number
  y: number
  color: string
  duration: number
  delay: number
  blur: number
  opacity: number
}

const AmbientBackground = () => {
  const [orbs, setOrbs] = useState<AmbientOrb[]>([])

  useEffect(() => {
    const generateStableOrbs = () => {
      const colors = [
        'rgba(255, 107, 157, 0.15)',
        'rgba(78, 205, 196, 0.15)',
        'rgba(168, 230, 207, 0.12)',
        'rgba(232, 90, 79, 0.1)',
      ]

      const newOrbs: AmbientOrb[] = []
      const maxOrbs = 15

      for (let i = 0; i < maxOrbs; i++) {
        newOrbs.push({
          id: i,
          size: Math.random() * 200 + 80,
          x: Math.random() * 100,
          y: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)]!,
          duration: Math.random() * 20 + 25,
          delay: Math.random() * 5,
          blur: Math.random() * 2 + 3,
          opacity: Math.random() * 0.3 + 0.1,
        })
      }

      setOrbs(newOrbs)
    }

    generateStableOrbs()

    // regenerate orbs
    const interval = setInterval(() => {
      generateStableOrbs()
    }, 60000) // 60 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary" />

      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: `blur(${orb.blur}px)`,
            opacity: orb.opacity,
          }}
          animate={{
            x: ['-10px', '10px', '-10px'],
            y: ['-15px', '15px', '-15px'],
            scale: [0.9, 1.1, 0.9],
            opacity: [orb.opacity * 0.5, orb.opacity, orb.opacity * 0.5],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {Array.from({ length: 50 }, (_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full bg-neon-blue opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 5,
            delay: Math.random() * 5,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}

      <motion.div
        className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full opacity-[0.1]"
        style={{
          background: 'radial-gradient(circle, rgba(255, 107, 157, 0.4) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [-30, 30, -30],
          y: [-20, 20, -20],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute top-3/4 right-1/4 w-72 h-72 rounded-full opacity-[0.16]"
        style={{
          background: 'radial-gradient(circle, rgba(78, 205, 196, 0.4) 0%, transparent 60%)',
          filter: 'blur(50px)',
        }}
        animate={{
          scale: [1.1, 0.9, 1.1],
          x: [20, -20, 20],
          y: [30, -30, 30],
        }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 10,
        }}
      />

      <motion.div
        className="absolute top-1/2 left-3/4 w-64 h-64 rounded-full opacity-[0.12]"
        style={{
          background: 'radial-gradient(circle, rgba(168, 230, 207, 0.5) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{
          scale: [0.8, 1.3, 0.8],
          x: [-25, 25, -25],
          y: [-15, 15, -15],
        }}
        transition={{
          duration: 50,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 20,
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.17]"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(255, 107, 157, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(78, 205, 196, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(168, 230, 207, 0.05) 0%, transparent 50%)
          `,
        }}
      />
    </div>
  )
}

export default AmbientBackground