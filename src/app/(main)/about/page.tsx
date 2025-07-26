'use client'

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Brain } from 'lucide-react'
import { 
  FaGithub, 
  FaLinkedin, 
  FaInstagram, 
  FaCode, 
  FaUsers, 
  FaStar, 
  FaGitAlt,
  FaHeart,
  FaCoffee,
  FaRocket
} from 'react-icons/fa'
import { HiSparkles } from "react-icons/hi2";

const AboutPage = () => {
  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/al1kss",
      icon: FaGithub,
      color: "hover:text-white",
      description: "Check out my code"
    },
    {
      name: "LinkedIn", 
      href: "https://www.linkedin.com/in/alikhan-abdykaimov/",
      icon: FaLinkedin,
      color: "hover:text-blue-400",
      description: "Professional network"
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/al1k.ss/",
      icon: FaInstagram, 
      color: "hover:text-pink-400",
      description: "Life updates"
    }
  ]

  const achievements = [
    {
      icon: <FaStar className="w-6 h-6" />,
      title: "LightRAG Contributor",
      description: "First-ever Cloudflare Workers AI integration",
      color: "text-yellow-400"
    },
    {
      icon: <FaGitAlt className="w-6 h-6" />,
      title: "Open Source Impact", 
      description: "#2 trending repo for 150+ consecutive days",
      color: "text-green-400"
    },
    {
      icon: <FaCode className="w-6 h-6" />,
      title: "Custom Architecture",
      description: "Every pixel crafted from scratch",
      color: "text-blue-400"
    },
    {
      icon: <FaUsers className="w-6 h-6" />,
      title: "Global Accessibility",
      description: "Serverless deployment for millions",
      color: "text-purple-400"
    }
  ]

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
          className="text-center mb-20"
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
            More Than Just Another
            <br />
            <span className="text-neon-pink">ChatGPT Wrapper</span>
          </h1>
          
          <motion.p
            className="text-xl text-soft-warmGray max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            You know what's funny? When I started this project, I thought building AI chatbots meant
            plugging into some API and getting a basic chat interface for free. 
            <span className="text-neon-blue font-medium"> Oh Boy, I was wrong 😅</span>
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="bg-bg-tertiary/30 backdrop-blur-md border border-soft-charcoal/30 rounded-2xl p-8 card-hover h-[763px]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-neon-pink/20 to-neon-blue/20 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-neon-blue" />
                </div>
                <h2 className="text-2xl font-bold text-soft-cream">The Innovation</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-neon-pink mb-3">Contributing to Open Source</h3>
                  <p className="text-soft-warmGray leading-relaxed">
                    I'm proud to have contributed a <strong className="text-soft-cream">major feature</strong> to the 
                    <a href="https://github.com/HKUDS/LightRAG" className="text-neon-blue hover:text-neon-pink transition-colors mx-1">
                      LightRAG repo
                    </a> 
                    ; aka the first-ever <strong className="text-neon-blue">Cloudflare Workers AI integration</strong>!
                    This isn't just any repo its <strong className="text-yellow-400">#2 trending repository</strong> for 150+ consecutive days. And the feature is the important part of this project
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-neon-blue mb-3">What's LightRAG?</h3>
                  <p className="text-soft-warmGray leading-relaxed">
                    Think of it as a super-smart way for AI to understand and remember information. Instead of just 
                    dumping text into AI, LightRAG creates a "knowledge graph", like a web of connected ideas that
                    helps AI give you much better, more contextual answers using mathematical models.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-neon-purple mb-3">My Contribution</h3>
                  <p className="text-soft-warmGray leading-relaxed">
                    Before my integration, LightRAG users had to run everything manually on their computers. 
                    I created a seamless bridge to Cloudflare's global edge network, meaning millions can now use 
                    LightRAG without local setup. Smart fallbacks, lightning fast, globally accessible.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="bg-bg-tertiary/30 backdrop-blur-md border border-soft-charcoal/30 rounded-2xl p-8 card-hover">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
                  <FaHeart className="w-6 h-6 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-soft-cream">About Me</h2>
              </div>

              <div className="space-y-6">
                <div className="text-center">
                  <motion.div
                    className="w-24 h-24 bg-gradient-to-br from-neon-pink/20 to-neon-blue/20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-soft-cream"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    AA
                  </motion.div>
                  <h3 className="text-xl font-bold text-soft-cream mb-2">Alikhan Abdykaimov</h3>
                  <p className="text-neon-blue font-medium">Full-Stack Developer & A Future Engineer</p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-neon-pink mb-3">Technical Background</h4>
                  <p className="text-soft-warmGray leading-relaxed mb-4">
                    I'm passionate about creating beautiful, functional projects that solve real problems.
                    My journey started with web development, but I've since expanded into game development, engineering, and real-life problem solutions.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-bg-primary/50 rounded-lg p-3">
                      <span className="text-neon-blue font-medium">Frontend:</span>
                      <p className="text-soft-warmGray">React, Next.js, TypeScript</p>
                    </div>
                    <div className="bg-bg-primary/50 rounded-lg p-3">
                      <span className="text-neon-pink font-medium">Backend:</span>
                      <p className="text-soft-warmGray">Python, FastAPI, Node.js</p>
                    </div>
                    <div className="bg-bg-primary/50 rounded-lg p-3">
                      <span className="text-neon-purple font-medium">AI/ML:</span>
                      <p className="text-soft-warmGray">LightRAG, Cloudflare</p>
                    </div>
                    <div className="bg-bg-primary/50 rounded-lg p-3">
                      <span className="text-green-400 font-medium">Cloud:</span>
                      <p className="text-soft-warmGray">Vercel, Blob, Upstash</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-neon-blue mb-4">Connect With Me</h4>
                  <div className="flex gap-4">
                    {socialLinks.map((social, index) => {
                      const IconComponent = social.icon
                      return (
                        <motion.a
                          key={social.name}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`group flex items-center gap-3 bg-bg-primary/50 hover:bg-bg-primary/80 rounded-lg p-3 transition-all duration-300 ${social.color} border border-soft-charcoal/30 hover:border-neon-blue/50`}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <IconComponent className="w-5 h-5" />
                          <div className="hidden sm:block">
                            <p className="text-sm font-medium text-soft-cream group-hover:text-current transition-colors">
                              {social.name}
                            </p>
                            <p className="text-xs text-soft-warmGray">
                              {social.description}
                            </p>
                          </div>
                        </motion.a>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-neon-pink to-neon-blue bg-clip-text text-transparent mb-4">
              Built From Scratch, With Love
            </h2>
            <p className="text-xl text-soft-warmGray max-w-4xl mx-auto">
              When most people think "AI chat app" they imagine using some pre-built AI API and calling it a day.
              <span className="text-neon-pink font-medium"> Not here!</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                className="bg-bg-tertiary/30 backdrop-blur-md border border-soft-charcoal/30 rounded-2xl p-6 card-hover text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <motion.div
                  className={`inline-flex p-3 rounded-xl mb-4 ${achievement.color}`}
                  style={{ backgroundColor: `${achievement.color.replace('text-', '')}20` }}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {achievement.icon}
                </motion.div>
                <h3 className="text-lg font-bold text-soft-cream mb-2">{achievement.title}</h3>
                <p className="text-soft-warmGray text-sm">{achievement.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
        >
          <div className="bg-bg-tertiary/30 backdrop-blur-md border border-soft-charcoal/30 rounded-2xl p-8 card-hover max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <motion.div
                className="flex items-center gap-2 text-neon-blue"
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <FaCoffee className="w-5 h-5" />
                <HiSparkles className="w-5 h-5" />
                <FaRocket className="w-5 h-5" />
              </motion.div>
            </div>
            
            <h3 className="text-3xl font-bold text-soft-cream mb-4">
              Ready to Experience the Difference?
            </h3>
            <p className="text-soft-warmGray mb-8 text-lg max-w-2xl mx-auto">
              Every pixel here was designed with care. The gentle animations, the smooth transitions, 
              the way text appears... it all comes together to create something that feels magical to use.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chat">
                <motion.button
                  className="group bg-gradient-to-r from-neon-pink to-neon-blue text-soft-cream font-semibold px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-neon-pink/25 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center gap-2">
                    Start Chatting
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
              </Link>
              
              <Link href="https://github.com/al1kss/crazy-ai" target="_blank">
                <motion.button
                  className="border border-neon-blue/50 text-neon-blue font-semibold px-8 py-4 rounded-xl hover:bg-neon-blue/10 transition-all duration-150 hover:border-neon-blue hover:shadow-lg hover:shadow-neon-blue/25"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center gap-2">
                    <FaGithub className="w-5 h-5" />
                    View Source Code
                  </span>
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <p className="text-soft-warmGray text-sm">
            Made with <span className="text-red-400">❤️</span>,
            <span className="text-yellow-400"> ☕</span>, and way too many late nights
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default AboutPage;