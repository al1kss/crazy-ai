"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaInstagram, FaDiscord } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear(); // so it auto updates :)

  const fadeInUpVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };

  const navigationLinks = [
    {
      title: "Product",
      links: [
        { name: "About", href: "/about", icon: "ℹ️" },
        { name: "Our Team", href: "/team", icon: "👥" },
        { name: "Start Chat", href: "/chat", icon: "💬" },
        { name: "Features", href: "/features", icon: "⚡", disabled: true },
      ],
    },
    {
      title: "AI Models",
      links: [
        { name: "Fire Safety AI", href: "chat/fire-safety", icon: "🔥" },
        { name: "General Assistant", href: "chat/general", icon: "🤖" },
        { name: "Physics Expert", href: "chat/physics", icon: "🧠", disabled: true },
        { name: "Build Your Own", href: "chat/custom", icon: "🛠️" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "/docs", icon: "📚", disabled: true },
        { name: "API Reference", href: "/api", icon: "🔗", disabled: true },
        { name: "Support", href: "/support", icon: "🛟", disabled: true },
        { name: "Feedback", href: "/feedback", icon: "💡"},
      ],
    },
  ];

  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/al1kss/",
      icon: FaGithub,
      color: "hover:text-white dark:hover:text-white",
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/alikhan-abdykaimov/",
      icon: FaLinkedin,
      color: "hover:text-blue-400",
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/al1k.ss/",
      icon: FaInstagram,
      color: "hover:text-pink-400",
    },
    {
      name: "Discord",
      href: "#",
      icon: FaDiscord,
      color: "hover:text-indigo-400",
      disabled: true,
    },
  ];

  return (
      <footer className="relative backdrop-blur-sm bg-gray-900/40 border-t border-gray-700/30 overflow-hidden">
          <div
              className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-neon-pink to-transparent"/>

          <div className="absolute inset-0 overflow-hidden">
              <motion.div
                  className="absolute -top-10 -left-20 w-72 h-72 bg-gradient-to-r from-neon-blue/5 via-neon-purple/5 to-neon-pink/5 rounded-full blur-3xl"
                  animate={{
                      x: [0, 30, 0],
                      y: [0, -20, 0],
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
                  className="absolute -bottom-10 -right-20 w-96 h-96 bg-gradient-to-r from-neon-purple/4 via-neon-pink/4 to-neon-blue/4 rounded-full blur-3xl"
                  animate={{
                      x: [0, -25, 0],
                      y: [0, 15, 0],
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

          <div className="max-w-6xl mx-auto px-4 py-16 relative z-10">
              <motion.div
                  className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16"
                  initial="initial"
                  whileInView="animate"
                  viewport={{once: true}}
                  variants={fadeInUpVariants}
                  transition={{duration: 0.6}}
              >
                  <motion.div
                      className="lg:col-span-1"
                      variants={fadeInUpVariants}
                      transition={{duration: 0.6, delay: 0.1}}
                  >
                      <motion.h3
                          className="text-3xl font-bold mb-4 cursor-pointer"
                          whileHover={{
                              scale: 1.05,
                              textShadow: "0 0 20px rgba(255, 107, 157, 0.6)"
                          }}
                          transition={{duration: 0.3}}
                      >
                          <span className="text-soft-cream">Your</span>
                          <span
                              className="bg-gradient-to-r from-neon-pink via-neon-blue to-neon-purple bg-clip-text text-transparent">
                              AI
                          </span>
                      </motion.h3>
                      <motion.p
                          className="text-soft-warmGray leading-relaxed mb-6"
                          whileHover={{
                              color: "#f8fafc",
                              textShadow: "0 0 15px rgba(99, 102, 241, 0.4)"
                          }}
                          transition={{duration: 0.3}}
                      >
                          This tool was built during Hackclub's Shipwrecked event.
                      </motion.p>

                      <div className="flex space-x-4">
                          {socialLinks.map((social, idx) => {
                              const IconComponent = social.icon;
                              return social.disabled ? (
                                  <motion.div
                                      key={social.name}
                                      className="w-10 h-10 rounded-full bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 flex items-center justify-center text-gray-600 cursor-not-allowed opacity-50"
                                      initial={{opacity: 0, scale: 0.8}}
                                      whileInView={{opacity: 0.5, scale: 1}}
                                      transition={{delay: 0.1 * idx, duration: 0.3}}
                                  >
                                      <IconComponent className="w-5 h-5"/>
                                  </motion.div>
                              ) : (
                                  <motion.a
                                      key={social.name}
                                      href={social.href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`w-10 h-10 rounded-full bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 flex items-center justify-center text-soft-warmGray transition-all duration-75 ${social.color}`}
                                      whileHover={{
                                          scale: 1.1,
                                          backgroundColor: "rgba(99, 102, 241, 0.2)",
                                          borderColor: "#6366f1",
                                          y: -3,
                                          boxShadow: "0 8px 25px rgba(99, 102, 241, 0.4)"
                                      }}
                                      whileTap={{scale: 0.95}}
                                      initial={{opacity: 0, scale: 0.8}}
                                      whileInView={{opacity: 1, scale: 1}}
                                      transition={{delay: 0.1 * idx, duration: 0.3}}
                                  >
                                      <IconComponent className="w-5 h-5"/>
                                  </motion.a>
                              );
                          })}
                      </div>
                  </motion.div>

                  {navigationLinks.map((section, sectionIdx) => (
                      <motion.div
                          key={section.title}
                          className="lg:col-span-1"
                          variants={fadeInUpVariants}
                          transition={{duration: 0.6, delay: sectionIdx * 0.1}}
                      >
                          <h4 className="text-soft-cream font-bold text-lg mb-6 relative">
                              {section.title}
                              <motion.div
                                  className="absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-neon-pink to-neon-blue rounded-full"
                                  initial={{width: 0}}
                                  whileInView={{width: "60%"}}
                                  transition={{
                                      delay: sectionIdx * 0.1,
                                      duration: 0.8,
                                  }}
                              />
                          </h4>
                          <ul className="space-y-3">
                              {section.links.map((link, linkIdx) => (
                                  <motion.li
                                      key={link.name}
                                      initial={{opacity: 0, x: -10}}
                                      whileInView={{opacity: 1, x: 0}}
                                      transition={{
                                          delay: sectionIdx * 0.1 + linkIdx * 0.05,
                                          duration: 0.4,
                                      }}
                                  >
                                      {link.disabled ? (
                                          <span
                                              className="group inline-flex items-center text-gray-600 cursor-not-allowed transition-all duration-300 opacity-50">
                        <span className="mr-3 text-sm transition-transform group-hover:scale-110">
                          {link.icon}
                        </span>
                        <span className="relative text-sm">
                          {link.name}
                            <span
                                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
                        </span>
                      </span>
                                      ) : (
                                          <Link
                                              href={link.href}
                                              className="group inline-flex items-center text-soft-warmGray hover:text-neon-blue transition-all duration-300"
                                          >
                        <span className="mr-3 text-sm transition-transform group-hover:scale-110">
                          {link.icon}
                        </span>
                                              <span className="relative text-sm">
                          {link.name}
                                                  <span
                                                      className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-blue transition-all duration-300 group-hover:w-full rounded-full"></span>
                        </span>
                                          </Link>
                                      )}
                                  </motion.li>
                              ))}
                          </ul>
                      </motion.div>
                  ))}
              </motion.div>

              <motion.div
                  className="pt-6 border-t border-gray-700/30 text-center -mb-6"
                  initial={{opacity: 0, y: 20}}
                  whileInView={{opacity: 1, y: 0}}
                  transition={{duration: 0.8, delay: 0.6}}
                  viewport={{once: true}}
              >

                  <motion.p
                      className="text-soft-warmGray text-sm"
                      initial={{opacity: 0, y: 10}}
                      whileInView={{opacity: 1, y: 0}}
                      transition={{delay: 0.9, duration: 0.5}}
                  >
                      © {currentYear} YourAI. Built with passion by Alikhan Abdykaimov 🌿
                  </motion.p>
              </motion.div>
          </div>
          <motion.img
              src="https://assets.hackclub.com/flag-orpheus-left.svg"
              alt="Hack Club Flag"
              className="absolute bottom-52 left-0 w-32 -mb-4 -ml-4 z-10 pointer-events-none select-none"
              animate={{
                  x: [0, 10, 0],
                  y: [0, -10, 0],
                  opacity: [0.8, 1, 0.8],
              }}
              transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
              }}
          />

      </footer>
  );
};

export default Footer;