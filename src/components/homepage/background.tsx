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
}

const AmbientBackground = () => {
  const [orbs, setOrbs] = useState<AmbientOrb[]>([])

  useEffect(() => {
    const generateOrbs = () => {
      const colors = [
        'rgba(255, 107, 157, 0.15)', // Neon pink
        'rgba(78, 205, 196, 0.15)',  // Neon blue
        'rgba(168, 230, 207, 0.12)', // Neon purple
        'rgba(232, 90, 79, 0.1)',    // Soft coral
      ]

      const newOrbs: AmbientOrb[] = []

      for (let i = 0; i < 10; i++) {
        newOrbs.push({
          id: i,
          size: Math.random() * 300 + 100, // 100px to 400px
          x: Math.random() * 100, // 0% to 100% viewport width
          y: Math.random() * 100, // 0% to 100% viewport height
          color: colors[Math.floor(Math.random() * colors.length)]!,
          duration: Math.random() * 30 + 20, // 20s to 50s
          delay: Math.random() * 10, // 0s to 10s delay
          blur: Math.random() * 3 + 2, // 2px to 5px blur
        })
      }

      setOrbs(newOrbs)
    }

    generateOrbs()
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
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
          }}
          animate={{
            x: ['-20px', '20px', '-20px'],
            y: ['-30px', '30px', '-30px'],
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(255, 107, 157, 0.3) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{
          scale: [1, 1.3, 1],
          x: [-50, 50, -50],
          y: [-30, 30, -30],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute top-3/4 right-1/4 w-80 h-80 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(78, 205, 196, 0.3) 0%, transparent 70%)',
          filter: 'blur(35px)',
        }}
        animate={{
          scale: [1.2, 0.8, 1.2],
          x: [30, -30, 30],
          y: [40, -40, 40],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 5,
        }}
      />

      <motion.div
        className="absolute top-1/2 left-3/4 w-72 h-72 rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(168, 230, 207, 0.4) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}
        animate={{
          scale: [0.9, 1.4, 0.9],
          x: [-40, 40, -40],
          y: [-20, 20, -20],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 10,
        }}
      />

      {Array.from({ length: 30 }, (_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full bg-neon-blue opacity-20"
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

      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(255, 107, 157, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(168, 230, 207, 0.1) 0%, transparent 50%)
          `,
        }}
      />
    </div>
  )
}

export default AmbientBackground