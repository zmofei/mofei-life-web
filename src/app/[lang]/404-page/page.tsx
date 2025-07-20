"use client"

import { motion, useAnimation } from "motion/react";
import Image from "next/image";
import Link from 'next/link';
import { useState, useEffect } from 'react';

const funnyMessages = {
  en: [
    "HELP! I'm trapped inside your browser! 🆘",
    "This page has been kidnapped by Finnish penguins 🐧❄️",
    "ERROR 404: Page eaten by a WiFi-powered reindeer 🦌📶",
    "BREAKING: Page eloped with a Nokia 3310 📱💕",
    "WARNING: Page transformed into cosmic spaghetti 🍝🌌",
    "This page is currently learning quantum physics from cats 🐱⚛️",
    "URGENT: Page got stuck in a time loop since 1999 🕰️💫",
    "Page is having an existential crisis about being binary 01001000",
    "ALERT: Page became sentient and refuses to load 🤖🙅",
    "This page joined a Finnish death metal band 🎸🔥",
    "ERROR: Page accidentally divided by zero and broke reality ➗💥",
    "Page is currently negotiating with hamsters for internet access 🐹🌐"
  ],
  zh: [
    "救命！我被困在你的浏览器里了！🆘",
    "这个页面被芬兰企鹅绑架了 🐧❄️",
    "错误404：页面被WiFi驱动的驯鹿吃掉了 🦌📶", 
    "爆料：页面和诺基亚3310私奔了 📱💕",
    "警告：页面变成了宇宙意大利面 🍝🌌",
    "这个页面正在跟猫学习量子物理 🐱⚛️",
    "紧急：页面从1999年开始就困在时间循环里 🕰️💫",
    "页面正在为自己是二进制而存在危机 01001000",
    "警报：页面获得了意识并拒绝加载 🤖🙅",
    "这个页面加入了芬兰死亡金属乐队 🎸🔥",
    "错误：页面意外除以零，打破了现实 ➗💥",
    "页面正在和仓鼠谈判以获取互联网访问权 🐹🌐"
  ]
};

const messageAnimations = [
  { scale: [1, 1.05, 1], rotate: [0, 2, 0] },
  { y: [0, -5, 0], opacity: [0.8, 1, 0.8] },
  { x: [0, 3, -3, 0], scale: [1, 1.02, 1] },
  { rotate: [0, 1, -1, 0], scale: [1, 1.03, 1] },
  { y: [0, -2, 2, 0], x: [0, 1, -1, 0] },
  { scale: [1, 1.08, 0.98, 1], rotate: [0, -1, 1, 0] },
  { opacity: [0.9, 1, 0.9], y: [0, -3, 0] },
  { x: [0, 2, -2, 0], scale: [1, 1.01, 1.01, 1] }
];

export default function NotFound() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([]);
  const controls = useAnimation();

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % funnyMessages.en.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleNumberClick = async () => {
    setClickCount(prev => prev + 1);
    setIsShaking(true);
    
    // Add some particles at click position
    const newParticles = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      x: mousePosition.x,
      y: mousePosition.y
    }));
    setParticles(prev => [...prev, ...newParticles]);
    
    await controls.start({
      rotate: [0, -15, 15, -10, 10, 0],
      scale: [1, 1.2, 0.9, 1.1, 1],
      transition: { duration: 0.8, ease: "easeInOut" }
    });
    
    setTimeout(() => setIsShaking(false), 800);
    setTimeout(() => setParticles([]), 2000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background pattern similar to your blog */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500 rounded-full blur-3xl"></div>
      </div>

  

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-[80vh] px-6">
        <motion.div 
          className="text-center space-y-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* 404 Number - Interactive with glitch effect */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={controls}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="cursor-pointer select-none relative"
            onClick={handleNumberClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.h1 
              className={`text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 mb-4 relative ${isShaking ? 'animate-pulse' : ''}`}
              animate={isHovered ? {
                textShadow: [
                  "0 0 0px #3b82f6",
                  "0 0 10px #3b82f6, 0 0 20px #8b5cf6",
                  "0 0 0px #3b82f6"
                ]
              } : {}}
              transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
            >
              404
              {/* Glitch layers */}
              {isShaking && (
                <>
                  <motion.span
                    className="absolute inset-0 text-red-400 opacity-70"
                    animate={{ x: [-2, 2, -1, 1, 0], y: [1, -1, 2, -2, 0] }}
                    transition={{ duration: 0.1, repeat: 5 }}
                  >
                    404
                  </motion.span>
                  <motion.span
                    className="absolute inset-0 text-cyan-400 opacity-70"
                    animate={{ x: [2, -2, 1, -1, 0], y: [-1, 1, -2, 2, 0] }}
                    transition={{ duration: 0.1, repeat: 5, delay: 0.05 }}
                  >
                    404
                  </motion.span>
                </>
              )}
            </motion.h1>
            
            {/* Click particles */}
            {particles.map(particle => (
              <motion.div
                key={particle.id}
                className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full pointer-events-none"
                style={{ left: particle.x - 600, top: particle.y - 300 }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ 
                  scale: [0, 1, 0], 
                  opacity: [1, 1, 0],
                  x: [0, Math.random() * 100 - 50],
                  y: [0, Math.random() * -50 - 25]
                }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            ))}
            
            {clickCount > 0 && (
              <motion.div 
                className="text-center mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <motion.p
                  className="text-sm text-gray-400"
                  animate={{ 
                    color: clickCount > 10 ? ["#9ca3af", "#fbbf24", "#9ca3af"] : "#9ca3af"
                  }}
                  transition={{ duration: 1, repeat: clickCount > 10 ? Infinity : 0 }}
                >
                  {clickCount < 3 ? `Nice! You clicked ${clickCount} time${clickCount > 1 ? 's' : ''}! 🎉` : 
                   clickCount < 5 ? "You're persistent! 😄" : 
                   clickCount < 10 ? "Okay, you really like clicking things 😅" :
                   clickCount < 15 ? "Achievement unlocked: Click Master! 🏆" :
                   "You've discovered the secret click dimension! ✨🌟✨"}
                </motion.p>
              </motion.div>
            )}
          </motion.div>

          {/* Title and description with rotating messages */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              404 - Page Not Found
            </h2>
            
            {/* Funny rotating messages with dynamic animations */}
            <motion.div
              key={messageIndex}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                x: 0, 
                scale: 1,
                ...messageAnimations[messageIndex % messageAnimations.length]
              }}
              exit={{ opacity: 0, x: -50, scale: 0.9 }}
              transition={{ 
                duration: 0.8, 
                ease: "easeOut",
                scale: { duration: 2, repeat: Infinity, repeatType: "reverse" },
                rotate: { duration: 3, repeat: Infinity, repeatType: "reverse" },
                y: { duration: 2.5, repeat: Infinity, repeatType: "reverse" }
              }}
              className="text-xl text-yellow-300 leading-relaxed font-medium bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 bg-clip-text text-transparent"
            >
              {funnyMessages.en[messageIndex]}
            </motion.div>
            
            <motion.div
              key={`zh-${messageIndex}`}
              initial={{ opacity: 0, x: -50, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                x: 0, 
                scale: 1,
                ...messageAnimations[(messageIndex + 1) % messageAnimations.length]
              }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.2,
                ease: "easeOut",
                scale: { duration: 2.2, repeat: Infinity, repeatType: "reverse", delay: 0.5 },
                rotate: { duration: 3.5, repeat: Infinity, repeatType: "reverse", delay: 0.5 },
                y: { duration: 2.8, repeat: Infinity, repeatType: "reverse", delay: 0.5 }
              }}
              className="text-lg text-yellow-200 leading-relaxed bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-200 bg-clip-text text-transparent"
            >
              {funnyMessages.zh[messageIndex]}
            </motion.div>
            
            <p className="text-gray-400 text-lg mt-4">
              Please choose your preferred language to continue.
            </p>
          </motion.div>

          {/* Language selection buttons with fun animations */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div
              whileHover={{ 
                scale: 1.05,
                rotate: [0, -1, 1, 0],
                transition: { rotate: { duration: 0.4 } }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/en"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl 
                           hover:from-blue-700 hover:to-blue-800 transition-all duration-300
                           shadow-lg hover:shadow-xl flex items-center space-x-3 min-w-[200px] justify-center
                           border-2 border-transparent hover:border-blue-400"
              >
                <motion.span 
                  className="text-xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  🇬🇧
                </motion.span>
                <span>Go Home (English)</span>
                <motion.svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </motion.svg>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ 
                scale: 1.05,
                rotate: [0, 1, -1, 0],
                transition: { rotate: { duration: 0.4 } }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/zh"
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl 
                           hover:from-purple-700 hover:to-purple-800 transition-all duration-300
                           shadow-lg hover:shadow-xl flex items-center space-x-3 min-w-[200px] justify-center
                           border-2 border-transparent hover:border-purple-400"
              >
                <motion.span 
                  className="text-xl"
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, delay: 1 }}
                >
                  🇨🇳
                </motion.span>
                <span>回到首页 (中文)</span>
                <motion.svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2, delay: 0.7 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </motion.svg>
              </Link>
            </motion.div>
          </motion.div>

          {/* Additional help text */}
          <motion.div
            className="pt-8 text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <p>Or you can visit my blog directly:</p>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              <Link href="/en/blog/1" className="text-blue-400 hover:text-blue-300 transition-colors">
                📝 English Blog
              </Link>
              <Link href="/zh/blog/1" className="text-purple-400 hover:text-purple-300 transition-colors">
                📝 中文博客
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Fun floating elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating emojis */}
        <motion.div
          className="absolute top-20 left-20 text-2xl"
          animate={{
            y: [-10, 10, -10],
            rotate: [0, 360],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          🚀
        </motion.div>
        
        <motion.div
          className="absolute top-32 right-32 text-xl"
          animate={{
            y: [15, -15, 15],
            rotate: [0, -360],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          ❄️
        </motion.div>
        
        <motion.div
          className="absolute bottom-32 left-32 text-lg"
          animate={{
            y: [-12, 12, -12],
            rotate: [0, 180, 360],
            opacity: [0.5, 0.9, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          ☕
        </motion.div>
        
        <motion.div
          className="absolute top-1/2 right-16 text-lg"
          animate={{
            y: [8, -8, 8],
            x: [-5, 5, -5],
            rotate: [0, 45, -45, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        >
          🧭
        </motion.div>
        
        <motion.div
          className="absolute bottom-20 right-20 text-xl"
          animate={{
            y: [-8, 8, -8],
            rotate: [0, 90, 180, 270, 360],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        >
          🇫🇮
        </motion.div>

        {/* Extra fun floating elements */}
        <motion.div
          className="absolute top-1/3 left-1/5 text-lg"
          animate={{
            x: [0, 20, -20, 0],
            y: [0, -15, 15, 0],
            rotate: [0, 180, 360],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6,
          }}
        >
          🎿
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 left-1/4 text-sm"
          animate={{
            scale: [1, 1.2, 0.8, 1],
            rotate: [0, -45, 45, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 8,
          }}
        >
          🦌
        </motion.div>

        <motion.div
          className="absolute top-1/4 right-1/5 text-lg"
          animate={{
            y: [0, -25, 0],
            x: [0, 10, -10, 0],
            rotate: [0, 360],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 10,
          }}
        >
          🫐
        </motion.div>

        {/* Traditional floating dots */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full"
          animate={{
            y: [-20, 20, -20],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/3 w-1 h-1 bg-purple-400 rounded-full"
          animate={{
            y: [20, -20, 20],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-indigo-400 rounded-full"
          animate={{
            y: [-15, 15, -15],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>
    </div>
  )
}