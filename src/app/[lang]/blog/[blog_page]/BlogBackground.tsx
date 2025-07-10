"use client"

import { motion } from "motion/react"

export default function BlogBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Main gradient background with animation */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Animated colorful circles with gentle, flowing movement */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-20 left-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, 80, -40, 0],
            y: [0, 60, 80, 0],
            scale: [1, 1.2, 1.1, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-40 right-20 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, -60, 0],
            y: [0, 120, -40, 0],
            scale: [1, 1.3, 1.15, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
        <motion.div 
          className="absolute bottom-20 left-40 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, 90, 30, 0],
            y: [0, -60, -100, 0],
            scale: [1, 1.25, 1.05, 1]
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 7
          }}
        />
        <motion.div 
          className="absolute bottom-40 right-40 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 50, 0],
            y: [0, -90, 40, 0],
            scale: [1, 1.4, 1.2, 1]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        />
      </div>
      
      {/* Subtle animated pattern overlay */}
      <motion.div 
        className="absolute inset-0 opacity-10" 
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 80px,
            rgba(255,255,255,0.1) 80px,
            rgba(255,255,255,0.1) 81px
          )`
        }}
        animate={{
          backgroundPosition: ['0px 0px', '160px 160px', '0px 0px']
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  )
}