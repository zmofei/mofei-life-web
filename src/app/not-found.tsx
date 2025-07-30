"use client"

import "./globals.css";
import { motion } from "motion/react";
import Image from "next/image";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { PlaylistProvider } from "@/components/Context/PlaylistContext";
import GlobalPlaylist from '@/components/Player/GlobalPlaylist';

const funnyMessages = {
  en: [
    "HELP! I'm trapped inside your browser's cookie jar! 🍪🆘",
    "This page was abducted by interdimensional sauna elves from Finland 🧝‍♂️🔥",
    "ERROR 404: Page got drunk on cloudberry wine and forgot how to exist 🫐🍷",
    "BREAKING: Page is currently dating a sentient wifi router named Gerald 📡💕",
    "URGENT: Page turned into a philosophical meatball and rolled away 🥩🤔",
    "This page is teaching polar bears how to code in JavaScript ⚪🐻‍❄️💻",
    "ALERT: Page joined a Viking coding bootcamp and learned to pillage databases ⚔️💾",
    "Page accidentally became the mayor of a digital village inside your RAM 🏘️🧠",
    "WARNING: Page is currently being therapy counseled by rubber ducks 🦆💬",
    "Page got lost in IKEA and is now furniture ⚡🪑",
    "ERROR: Page became a Nokia 3310 and achieved immortality 📱♾️",
    "This page is running an underground casino for binary digits 🎰010101",
    "Page discovered it's actually a Schrödinger's webpage - both exists and doesn't 📦🐱",
    "BREAKING: Page eloped with your browser's cache and moved to the cloud ☁️💒",
    "Page is currently writing a memoir titled 'My Life as HTTP Response' 📚✍️",
    "URGENT: Page transformed into cosmic pasta and is being eaten by space pirates 🚀🍜"
  ],
  zh: [
    "救命！我被困在你的浏览器饼干罐里了！🍪🆘",
    "这个页面被芬兰跨维度桑拿精灵绑架了 🧝‍♂️🔥",
    "错误404：页面喝醉了云莓酒，忘记了如何存在 🫐🍷",
    "爆料：页面正在和一个叫杰拉德的有感情的WiFi路由器约会 📡💕",
    "紧急：页面变成了哲学肉丸并滚走了 🥩🤔",
    "这个页面正在教北极熊学JavaScript编程 ⚪🐻‍❄️💻",
    "警报：页面加入了维京编程训练营，学会了掠夺数据库 ⚔️💾",
    "页面意外成为了你内存里一个数字村庄的村长 🏘️🧠",
    "警告：页面正在接受橡皮鸭的心理治疗 🦆💬",
    "页面在宜家迷路了，现在变成了家具 ⚡🪑",
    "错误：页面变成了诺基亚3310并获得了不朽 📱♾️",
    "这个页面正在为二进制数字经营地下赌场 🎰010101",
    "页面发现自己其实是薛定谔的网页—既存在又不存在 📦🐱",
    "爆料：页面和你的浏览器缓存私奔，搬到了云端 ☁️💒",
    "页面正在写回忆录，书名叫《我作为HTTP响应的一生》 📚✍️",
    "紧急：页面变成了宇宙意大利面，正被太空海盗吃掉 🚀🍜"
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

function NotFoundContent() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([]);
  const [keySequence, setKeySequence] = useState<string>('');
  const [isNokiaMode, setIsNokiaMode] = useState(false);
  const [isGravityMode, setIsGravityMode] = useState(false);
  const [isRainbowMode, setIsRainbowMode] = useState(false);
  const [screenShakeIntensity, setScreenShakeIntensity] = useState(0);
  // const controls = useAnimation();

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

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const newSequence = keySequence + e.key.toUpperCase();
      setKeySequence(newSequence.slice(-5)); // Keep only last 5 characters
      
      if (newSequence.includes('NOKIA')) {
        setIsNokiaMode(true);
        alert("🎉 NOKIA MODE ACTIVATED! 🎉\nThe page has achieved INDESTRUCTIBLE status!\nNow it can survive being dropped from a 10-story building! 📱💪");
        setTimeout(() => setIsNokiaMode(false), 10000); // Nokia mode lasts 10 seconds
      }
      
      // Secret chaos code
      if (newSequence.includes('CHAOS')) {
        // Flip the entire page upside down
        document.body.style.transform = 'rotate(180deg)';
        alert("🌪️ CHAOS MODE ACTIVATED! 🌪️\nThe world has turned upside down!");
        setTimeout(() => {
          document.body.style.transform = '';
        }, 5000);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [keySequence]);

  const handleNumberClick = async () => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);
    setIsShaking(true);
    
    // Progressive chaos effects
    if (newClickCount === 5) {
      setIsRainbowMode(true);
      setTimeout(() => setIsRainbowMode(false), 3000);
    }
    
    if (newClickCount === 10) {
      setIsGravityMode(true);
      setTimeout(() => setIsGravityMode(false), 5000);
    }
    
    if (newClickCount > 15) {
      setScreenShakeIntensity(Math.min(newClickCount - 15, 10));
      setTimeout(() => setScreenShakeIntensity(0), 1000);
    }
    
    // More particles for higher click counts
    const particleCount = Math.min(newClickCount, 20);
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: Date.now() + i,
      x: mousePosition.x,
      y: mousePosition.y
    }));
    setParticles(prev => [...prev, ...newParticles]);
    
    setTimeout(() => setIsShaking(false), 800);
    setTimeout(() => setParticles([]), 2000);
  };

  return (
    <motion.div 
      className={`min-h-screen relative overflow-hidden ${
        isNokiaMode ? 'bg-gradient-to-br from-green-900 via-green-800 to-green-900' : 
        isRainbowMode ? 'bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500' :
        'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
      } transition-all duration-1000`}
      animate={{
        x: screenShakeIntensity > 0 ? [0, -screenShakeIntensity, screenShakeIntensity, 0] : 0,
        y: screenShakeIntensity > 0 ? [0, screenShakeIntensity, -screenShakeIntensity, 0] : 0,
        filter: isRainbowMode ? [
          'hue-rotate(0deg) saturate(1)',
          'hue-rotate(90deg) saturate(1.5)',
          'hue-rotate(180deg) saturate(2)',
          'hue-rotate(270deg) saturate(1.5)',
          'hue-rotate(360deg) saturate(1)'
        ] : 'hue-rotate(0deg) saturate(1)'
      }}
      transition={{
        x: { duration: 0.1, repeat: screenShakeIntensity > 0 ? 10 : 0 },
        y: { duration: 0.1, repeat: screenShakeIntensity > 0 ? 10 : 0 },
        filter: { duration: 2, repeat: isRainbowMode ? Infinity : 0 }
      }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation bar */}
      <nav className="relative z-30 flex items-center justify-between p-6 md:p-8">
        <Link href="/en" className="flex items-center space-x-3 group">
          <Image
            src="/img/mofei-logo.svg"
            alt="Mofei Logo"
            width={100}
            height={23}
            className="opacity-90 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2)) drop-shadow(0 0 1px rgba(0,0,0,0.1))'
            }}
          />
        </Link>
      </nav>

      {/* Main content */}
      <div className="relative z-20 flex items-center justify-center min-h-[80vh] px-6">
        <motion.div 
          className="text-center space-y-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* 404 Number - Interactive with glitch effect */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="cursor-pointer select-none relative z-30"
            onClick={handleNumberClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.h1 
              className={`text-8xl md:text-9xl font-bold text-transparent bg-clip-text ${isNokiaMode ? 'bg-gradient-to-r from-green-300 via-lime-400 to-green-300' : 'bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400'} mb-4 relative z-40 ${isShaking ? 'animate-pulse' : ''} transition-all duration-1000`}
              style={{ 
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
              animate={isShaking ? {
                rotate: [0, -5, 5, -3, 3, 0],
                scale: [1, 1.05, 0.95, 1.02, 1],
              } : isHovered ? {
                textShadow: [
                  "0 0 0px #3b82f6",
                  "0 0 10px #3b82f6, 0 0 20px #8b5cf6",
                  "0 0 0px #3b82f6"
                ]
              } : {}}
              transition={{ 
                duration: isShaking ? 0.8 : 1.5, 
                repeat: isHovered && !isShaking ? Infinity : 0,
                ease: "easeInOut"
              }}
            >
              <span className="relative">404</span>
              {/* Fallback visible version for testing */}
              <span className="absolute inset-0 text-white opacity-20 pointer-events-none">404</span>
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
            {particles.map((particle, index) => (
              <motion.div
                key={particle.id}
                className={`absolute w-2 h-2 rounded-full pointer-events-none ${
                  clickCount > 20 ? 'bg-gradient-to-r from-red-400 via-yellow-400 to-green-400' :
                  clickCount > 10 ? 'bg-gradient-to-r from-purple-400 to-pink-400' :
                  'bg-gradient-to-r from-blue-400 to-purple-400'
                }`}
                style={{ left: particle.x - 600, top: particle.y - 300 }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ 
                  scale: [0, clickCount > 15 ? 3 : 1, 0], 
                  opacity: [1, 1, 0],
                  x: [0, (Math.random() - 0.5) * (clickCount > 10 ? 200 : 100)],
                  y: [0, (Math.random() - 0.5) * (clickCount > 10 ? 200 : 100)],
                  rotate: [0, Math.random() * 720]
                }}
                transition={{ 
                  duration: clickCount > 20 ? 3 : 2, 
                  ease: "easeOut",
                  delay: index * 0.05
                }}
              />
            ))}
            
            {/* Extreme click mode visual explosion */}
            {clickCount > 25 && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 0.3, 0],
                  scale: [1, 1.5, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <div className="absolute inset-0 bg-gradient-radial from-white/20 via-transparent to-transparent" />
              </motion.div>
            )}
            
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
                    color: clickCount > 10 ? ["#9ca3af", "#fbbf24", "#9ca3af"] : "#9ca3af",
                    scale: clickCount > 20 ? [1, 1.1, 1] : 1
                  }}
                  transition={{ duration: 1, repeat: clickCount > 10 ? Infinity : 0 }}
                >
                  {clickCount < 3 ? `Nice! You clicked ${clickCount} time${clickCount > 1 ? 's' : ''}! 🎉` : 
                   clickCount < 5 ? "You're persistent! The 404 spirits approve! 👻" : 
                   clickCount < 10 ? "Okay, you really like clicking things... The page is getting dizzy! 🌀😅" :
                   clickCount < 15 ? "Achievement unlocked: Click Master! The Finnish elves are impressed! 🏆🧝‍♂️" :
                   clickCount < 25 ? "You've discovered the secret click dimension! Reality is glitching! ✨🌟✨" :
                   clickCount < 35 ? "LEGENDARY STATUS: You've awakened the ancient click gods! ⚡👑⚡" :
                   clickCount < 50 ? "COSMIC CLICK EMPEROR: The universe bows to your clicking prowess! 🌌👑" :
                   "ERROR: You've clicked so much the page achieved enlightenment! 🧘‍♂️💫"}
                </motion.p>
                
                {clickCount > 30 && (
                  <motion.div
                    className="mt-2 text-xs text-purple-400"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🔮 You&apos;ve unlocked the secret: This 404 page is actually a Nokia 3310 in disguise! 🔮
                  </motion.div>
                )}

                {isNokiaMode && (
                  <motion.div
                    className="mt-4 p-3 rounded-lg bg-green-800/50 border border-green-400/50"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                  >
                    <div className="text-center text-green-300 font-mono text-sm">
                      📱 NOKIA 3310 MODE ACTIVE 📱<br/>
                      INDESTRUCTIBLE STATUS: ENABLED<br/>
                      BATTERY LIFE: ♾️ YEARS<br/>
                      SNAKE GAME: AVAILABLE
                    </div>
                  </motion.div>
                )}
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

          {/* Language selection buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isGravityMode ? {
              opacity: 1, 
              y: [0, 300],
              rotate: [0, 180, 360],
            } : { 
              opacity: 1, 
              y: 0 
            }}
            transition={isGravityMode ? {
              duration: 3,
              ease: "easeIn",
              delay: 1
            } : { 
              duration: 0.8, 
              delay: 0.6 
            }}
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
            <div className="flex flex-wrap justify-center gap-4 mt-2 mb-6">
              <Link href="/en/blog/1" className="text-blue-400 hover:text-blue-300 transition-colors">
                📝 English Blog
              </Link>
              <Link href="/zh/blog/1" className="text-purple-400 hover:text-purple-300 transition-colors">
                📝 中文博客
              </Link>
            </div>
            
            {/* Easter egg hint */}
            <motion.div 
              className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <p className="text-yellow-400 text-xs">
                🎮 <strong>Secret Game Mode:</strong> Click the floating emojis around the page! 
                Try typing &ldquo;NOKIA&rdquo; or &ldquo;CHAOS&rdquo; for special effects!
              </p>
              <p className="text-gray-400 text-xs mt-2">
                🎯 Found: 🚀 ❄️ ☕ 🧭 🇫🇮 🎿 🦌 🫐 🦆 🌀 and more hidden surprises...
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Fun floating elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
        {/* Test button - should be easy to click */}
        <div 
          className="absolute top-10 right-10 bg-red-500 text-white p-4 rounded-lg cursor-pointer pointer-events-auto z-60"
          onClick={() => alert("Test button works! 🎉")}
        >
          TEST CLICK
        </div>
        
        {/* Floating emojis */}
        <motion.div
          className="absolute top-20 left-20 text-3xl cursor-pointer pointer-events-auto drop-shadow-lg z-60"
          animate={isGravityMode ? {
            y: [0, window?.innerHeight || 800],
            rotate: [0, 720],
            opacity: [0.8, 0.2],
          } : {
            y: [-10, 10, -10],
            rotate: [0, 360],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={isGravityMode ? {
            duration: 2,
            ease: "easeIn"
          } : {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          onClick={() => alert("🚀 ROCKET LAUNCH INITIATED! Destination: The land of missing pages!")}
        >
          🚀
        </motion.div>
        
        <motion.div
          className="absolute top-32 right-32 text-2xl cursor-pointer pointer-events-auto drop-shadow-lg z-60"
          animate={isGravityMode ? {
            y: [0, window?.innerHeight || 800],
            rotate: [0, -1080],
            opacity: [0.7, 0],
          } : {
            y: [15, -15, 15],
            rotate: [0, -360],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={isGravityMode ? {
            duration: 2.5,
            ease: "easeIn",
            delay: 0.2
          } : {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          onClick={() => {
            const snow = document.createElement('div');
            snow.innerHTML = '❄️❄️❄️❄️❄️';
            snow.style.position = 'fixed';
            snow.style.top = '0';
            snow.style.left = '0';
            snow.style.width = '100%';
            snow.style.pointerEvents = 'none';
            snow.style.fontSize = '20px';
            snow.style.zIndex = '9999';
            document.body.appendChild(snow);
            setTimeout(() => document.body.removeChild(snow), 3000);
            alert("❄️ SNOW STORM ACTIVATED! Welcome to Finnish winter simulator!");
          }}
        >
          ❄️
        </motion.div>
        
        <motion.div
          className="absolute bottom-32 left-32 text-2xl cursor-pointer pointer-events-auto drop-shadow-lg z-60"
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
          onClick={() => {
            const coffees = ["☕", "☕", "☕", "☕", "☕"];
            coffees.forEach((coffee, i) => {
              setTimeout(() => {
                const coffeeDiv = document.createElement('div');
                coffeeDiv.textContent = coffee;
                coffeeDiv.style.position = 'fixed';
                coffeeDiv.style.top = Math.random() * 100 + '%';
                coffeeDiv.style.left = Math.random() * 100 + '%';
                coffeeDiv.style.fontSize = '24px';
                coffeeDiv.style.zIndex = '9999';
                coffeeDiv.style.pointerEvents = 'none';
                document.body.appendChild(coffeeDiv);
                setTimeout(() => document.body.removeChild(coffeeDiv), 2000);
              }, i * 200);
            });
            alert("☕ COFFEE RAIN ACTIVATED! Caffeine levels: OVER 9000!");
          }}
        >
          ☕
        </motion.div>
        
        <motion.div
          className="absolute top-1/2 right-16 text-lg cursor-pointer pointer-events-auto"
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
          onClick={() => {
            document.body.style.transform = `rotate(${Math.random() * 360}deg)`;
            setTimeout(() => {
              document.body.style.transform = '';
            }, 2000);
            alert("🧭 COMPASS ACTIVATED! You are now facing... uh... that way!");
          }}
        >
          🧭
        </motion.div>
        
        <motion.div
          className="absolute bottom-20 right-20 text-xl cursor-pointer pointer-events-auto z-60"
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
          onClick={() => {
            if (Math.random() > 0.5) {
              alert("🇫🇮 Torilla tavataan! (The Finnish flag says hello!)");
            } else {
              alert("🇫🇮 Finland.exe has stopped working. Please restart your sauna.");
            }
          }}
        >
          🇫🇮
        </motion.div>

        {/* Extra fun floating elements */}
        <motion.div
          className="absolute top-1/3 left-1/5 text-lg cursor-pointer pointer-events-auto"
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
          onClick={() => {
            document.body.style.background = 'linear-gradient(45deg, white, lightblue)';
            setTimeout(() => {
              document.body.style.background = '';
            }, 3000);
            alert("🎿 SKI MODE ACTIVATED! Slopes are closed due to 404 error!");
          }}
        >
          🎿
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 left-1/4 text-sm cursor-pointer pointer-events-auto"
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
          onClick={() => {
            const reindeer = ['🦌', '🦌', '🦌'];
            reindeer.forEach((deer, i) => {
              setTimeout(() => {
                const deerDiv = document.createElement('div');
                deerDiv.textContent = deer;
                deerDiv.style.position = 'fixed';
                deerDiv.style.top = '50%';
                deerDiv.style.left = '-50px';
                deerDiv.style.fontSize = '30px';
                deerDiv.style.zIndex = '9999';
                deerDiv.style.animation = 'slide 3s linear forwards';
                deerDiv.style.pointerEvents = 'none';
                document.head.insertAdjacentHTML('beforeend', `
                  <style>
                    @keyframes slide { 
                      from { transform: translateX(0); } 
                      to { transform: translateX(calc(100vw + 100px)); } 
                    }
                  </style>
                `);
                document.body.appendChild(deerDiv);
                setTimeout(() => document.body.removeChild(deerDiv), 3000);
              }, i * 500);
            });
            alert("🦌 REINDEER PARADE! They're looking for Santa's lost 404 page!");
          }}
        >
          🦌
        </motion.div>

        <motion.div
          className="absolute top-1/4 right-1/5 text-lg cursor-pointer"
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
          onClick={() => {
            const berryMessages = [
              "🫐 You found a wild cloudberry! +10 Finnish points!",
              "🫐 The cloudberry whispers ancient Nokia secrets...",
              "🫐 This berry contains the essence of a thousand saunas!",
              "🫐 WARNING: Berry has achieved sentience and is judging your life choices!"
            ];
            alert(berryMessages[Math.floor(Math.random() * berryMessages.length)]);
          }}
        >
          🫐
        </motion.div>

        {/* Secret konami code area */}
        <motion.div
          className="absolute top-1/6 left-1/6 text-sm opacity-50 cursor-pointer pointer-events-auto text-gray-400"
          whileHover={{ opacity: 1, scale: 1.2 }}
          onClick={() => {
            alert("🎮 Secret cheat code discovered! Type 'NOKIA' or 'CHAOS' for special effects!");
          }}
        >
          ↑↑↓↓←→←→BA
        </motion.div>

        {/* Hidden rubber duck */}
        <motion.div
          className="absolute bottom-1/6 left-1/8 text-sm cursor-pointer pointer-events-auto"
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 15,
          }}
          onClick={() => {
            const duckWisdom = [
              "🦆 Quack! Debug your life, not just your code!",
              "🦆 Rubber duck debugging tip: Sometimes the problem is that you're not actually a duck!",
              "🦆 Fun fact: 73% of 404 errors are caused by pages getting stage fright!",
              "🦆 The duck has spoken: Have you tried turning the internet off and on again?"
            ];
            alert(duckWisdom[Math.floor(Math.random() * duckWisdom.length)]);
          }}
        >
          🦆
        </motion.div>

        {/* Mysterious portal */}
        <motion.div
          className="absolute top-1/2 left-1/8 text-lg cursor-pointer pointer-events-auto"
          animate={{
            rotate: [0, 360],
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          whileHover={{ scale: 1.5, opacity: 1 }}
          onClick={() => {
            const portalMessages = [
              "🌀 Portal activated! ...But it just leads to more 404 errors.",
              "🌀 You've opened a wormhole to the dimension of lost web pages!",
              "🌀 The portal whispers: 'Your princess is in another URL'",
              "🌀 Congratulations! You've discovered the Nokia 3310 dimension!"
            ];
            alert(portalMessages[Math.floor(Math.random() * portalMessages.length)]);
          }}
        >
          🌀
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
    </motion.div>
  );
}

export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <PlaylistProvider>
          <NotFoundContent />
          <GlobalPlaylist />
        </PlaylistProvider>
      </body>
    </html>
  )
}