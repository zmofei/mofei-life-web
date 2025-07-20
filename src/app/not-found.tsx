"use client"

import { motion, useAnimation } from "motion/react";
import Image from "next/image";
import Link from 'next/link';
import { useState, useEffect } from 'react';

const funnyMessages = {
  en: [
    "Oops! You've wandered into the digital wilderness 🌲",
    "This page is on vacation in Finland ❄️",
    "404: Page not found, but my coffee is still hot ☕",
    "Lost? Don't worry, even GPS gets confused sometimes 🧭",
    "This page is learning Finnish, please come back later 🇫🇮"
  ],
  zh: [
    "哎呀！你走进了数字荒野 🌲",
    "这个页面在芬兰度假中 ❄️", 
    "404：页面走丢了，但我的咖啡还是热的 ☕",
    "迷路了？别担心，连GPS有时也会犯糊涂 🧭",
    "这个页面正在学芬兰语，请稍后再来 🇫🇮"
  ]
};

export default function NotFound() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % funnyMessages.en.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleNumberClick = async () => {
    setClickCount(prev => prev + 1);
    setIsShaking(true);
    
    await controls.start({
      rotate: [0, -10, 10, -10, 10, 0],
      scale: [1, 1.1, 1],
      transition: { duration: 0.5 }
    });
    
    setTimeout(() => setIsShaking(false), 500);
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
          {/* 404 Number - Interactive */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={controls}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="cursor-pointer select-none"
            onClick={handleNumberClick}
          >
            <h1 className={`text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 mb-4 ${isShaking ? 'animate-pulse' : ''}`}>
              404
            </h1>
            {clickCount > 0 && (
              <motion.p 
                className="text-sm text-gray-400 mt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {clickCount < 3 ? `Nice! You clicked ${clickCount} time${clickCount > 1 ? 's' : ''}! 🎉` : 
                 clickCount < 5 ? "You're persistent! 😄" : 
                 clickCount < 10 ? "Okay, you really like clicking things 😅" :
                 "Achievement unlocked: Click Master! 🏆"}
              </motion.p>
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
              Page Not Found
            </h2>
            
            {/* Funny rotating messages */}
            <motion.div
              key={messageIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="text-xl text-yellow-300 leading-relaxed font-medium"
            >
              {funnyMessages.en[messageIndex]}
            </motion.div>
            
            <motion.div
              key={`zh-${messageIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-yellow-200 leading-relaxed"
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