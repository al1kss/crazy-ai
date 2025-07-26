import React from 'react'
import { motion } from 'framer-motion'

const TrustedCompanies = () => {
  const companies = [
    {
      name: "4Bricks",
      image: "/logos/4bricks.svg",
      url: "https://4bricks.io/"
    },
    {
      name: "iHub Academy",
      image: "/logos/ihub.png",
      url: "https://www.ihubacademy.online/"
    },
    {
      name: "Umnye Detki",
      image: "/logos/kids.jpg",
      url: "https://www.instagram.com/umnyedetki_osh/"
    },
    {
      name: "Azim",
      image: "/logos/azim.png",
      url: "https://azimace.com/"
    },
    {
      name: "4Bricks",
      image: "/logos/4bricks.svg",
      url: "https://4bricks.io/"
    },
    {
      name: "iHub Academy",
      image: "/logos/ihub.png",
      url: "https://www.ihubacademy.online/"
    },
    {
      name: "Umnye Detki",
      image: "/logos/kids.jpg",
      url: "https://www.instagram.com/umnyedetki_osh/"
    },
    {
      name: "Azim",
      image: "/logos/azim.png",
      url: "https://azimace.com/"
    },
          {
      name: "4Bricks",
      image: "/logos/4bricks.svg",
      url: "https://4bricks.io/"
    },
    {
      name: "iHub Academy",
      image: "/logos/ihub.png",
      url: "https://www.ihubacademy.online/"
    },
    {
      name: "Umnye Detki",
      image: "/logos/kids.jpg",
      url: "https://www.instagram.com/umnyedetki_osh/"
    },
    {
      name: "Azim",
      image: "/logos/azim.png",
      url: "https://azimace.com/"
    },
  ]

  const duplicatedCompanies = [
    {
      name: "4Bricks",
      image: "/logos/4bricks.svg",
      url: "https://4bricks.io/"
    },
    {
      name: "iHub Academy",
      image: "/logos/ihub.png",
      url: "https://www.ihubacademy.online/"
    },
    {
      name: "Umnye Detki",
      image: "/logos/kids.jpg",
      url: "https://www.instagram.com/umnyedetki_osh/"
    },
    {
      name: "Azim",
      image: "/logos/azim.png",
      url: "https://azimace.com/"
    },
    {
      name: "4Bricks",
      image: "/logos/4bricks.svg",
      url: "https://4bricks.io/"
    },
    {
      name: "iHub Academy",
      image: "/logos/ihub.png",
      url: "https://www.ihubacademy.online/"
    },
    {
      name: "Umnye Detki",
      image: "/logos/kids.jpg",
      url: "https://www.instagram.com/umnyedetki_osh/"
    },
    {
      name: "Azim",
      image: "/logos/azim.png",
      url: "https://azimace.com/"
    },
    {
      name: "4Bricks",
      image: "/logos/4bricks.svg",
      url: "https://4bricks.io/"
    },
    {
      name: "iHub Academy",
      image: "/logos/ihub.png",
      url: "https://www.ihubacademy.online/"
    },
    {
      name: "Umnye Detki",
      image: "/logos/kids.jpg",
      url: "https://www.instagram.com/umnyedetki_osh/"
    },
    {
      name: "Azim",
      image: "/logos/azim.png",
      url: "https://azimace.com/"
    },
  ]

  return (
    <section className="py-16 overflow-hidden -mb-4">
      <div className="max-w-6xl mx-auto px-4 -mt-10">
        <motion.div
            className="text-center mb-12"
            initial={{opacity: 0, y: 30}}
            whileInView={{opacity: 1, y: 0}}
            transition={{duration: 0.8}}
            viewport={{once: true}}
        >
          <motion.div
              className="z-10 w-full max-w-6xl mx-auto mb-10 bottom-10"
              initial={{opacity: 0, y: 50}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: 1.2, duration: 0.8}}
          >
            <motion.div
                className="text-center mt-16 mb-10"
                initial={{opacity: 0, y: 30}}
                whileInView={{opacity: 1, y: 0}}
                transition={{duration: 0.8}}
                viewport={{once: true}}
            >
              <motion.div
                  className="flex justify-center mb-8"
                  initial={{opacity: 0, scaleX: 0}}
                  whileInView={{opacity: 1, scaleX: 1}}
                  transition={{duration: 0.6, delay: 0.2}}
                  viewport={{once: true}}
              >
                <div
                    className="h-1 w-24 bg-gradient-to-r from-neon-pink via-neon-blue to-neon-purple rounded-full">
                </div>
              </motion.div>

              <h2 className="text-5xl font-bold bg-gradient-to-r from-soft-cream to-purple-100 bg-clip-text text-transparent mb-7">
                Trusted by Industry Leaders
              </h2>
              <p className="text-l text-soft-warmGray max-w-3xl mx-auto">
                Join thousands of professionals who trust YourAI with their custom AI assistance
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <div className="relative w-full">
        <div className="absolute inset-0 bg-gray-800/15 backdrop-blur-lg blur-2xl" />
        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-bg-primary to-transparent z-10 pointer-events-none"/>
        <div className="flex overflow-hidden -mt-4 w-full py-8">
          <motion.div
              className="flex space-x-20 min-w-max"
              animate={{x: ['0%', '-50%']}}
              transition={{
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'linear',
                duration: 40,
              }}
          >
            {duplicatedCompanies.map((company, index) => (
                <motion.a
                    key={`${company.name}-${index}`}
                    href={company.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex-shrink-0 w-64 h-40 flex items-center justify-center p-8 rounded-2xl mt-5 bottom-2.5 backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-gray-500/10 hover:border-neon-pink/30 transition-all duration-300"
                    whileHover={{
                      scale: 1.05,
                      y: -8,
                    }}
                    transition={{duration: 0.15}}
                >
                  <div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md group-hover:from-neon-blue/10 group-hover:to-neon-pink/5 transition-all duration-500"/>
                  <img
                      src={company.image}
                      alt={company.name}
                      className="relative z-10 max-w-full max-h-full object-contain filter grayscale contrast-75 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-110 transition-all duration-500"
                      style={{
                        width: 'auto',
                        height: 'auto',
                        maxWidth: '85%',
                        maxHeight: '85%',
                      }}
                  />

                  <motion.div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background:
                            'radial-gradient(circle at center, rgba(255, 107, 157, 0.15) 0%, transparent 70%)',
                        filter: 'blur(15px)',
                      }}
                  />
                </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default TrustedCompanies