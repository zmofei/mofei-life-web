"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState, useRef, useMemo } from "react";
import Lan from "@/components/util/Language";

interface ModernHeroProps {
  lang: string;
}

const ModernHero = ({ lang }: ModernHeroProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  // Parallax effects
  const y = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.9]);

  // Text variations for typewriter effect
  const textVariations = useMemo(() => ({
    zh: [
      "软件工程师",
      "全栈开发者",
      "数据工程师",
      "AI 探索者",
      "生活记录者"
    ],
    en: [
      "Software Engineer",
      "Full-Stack Developer",
      "Data Engineer",
      "AI Explorer",
      "Life Chronicler"
    ]
  }), []);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const x = (clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (clientY - innerHeight / 2) / (innerHeight / 2);
      
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Text rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => 
        (prev + 1) % textVariations[lang as keyof typeof textVariations].length
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [lang, textVariations]);

  return (
    <motion.div 
      ref={containerRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      style={{ y, opacity, scale }}
    >
      {/* Dynamic gradient background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.015]" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}
      </div>

      {/* Main content with 3D effect */}
      <motion.div 
        className="relative z-10 text-center px-4 md:px-10"
        style={{
          transform: useTransform(
            [mouseXSpring, mouseYSpring],
            (values: number[]) => {
              const [x, y] = values;
              return `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
            }
          ),
          transformStyle: "preserve-3d",
        }}
      >
        {/* Greeting with gradient */}
        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x">
            Hei! 👋
          </span>
        </motion.h1>

        {/* Name with glitch effect */}
        <motion.div
          className="relative mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-white relative">
            <Lan lang={lang} candidate={{
              zh: "我是",
              en: "I am"
            }} />
            <span className="font-bold ml-3 relative inline-block">
              Mofei
              {/* Glitch layers */}
              <span className="absolute inset-0 text-cyan-400 opacity-70 animate-glitch-1" aria-hidden="true">
                Mofei
              </span>
              <span className="absolute inset-0 text-pink-400 opacity-70 animate-glitch-2" aria-hidden="true">
                Mofei
              </span>
            </span>
          </h2>
        </motion.div>

        {/* Rotating text roles */}
        <motion.div
          className="h-12 md:h-16 overflow-hidden mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.div
            key={currentTextIndex}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-4xl text-gray-300 font-light"
          >
            {textVariations[lang as keyof typeof textVariations][currentTextIndex]}
          </motion.div>
        </motion.div>

        {/* Interactive CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <p className="text-lg md:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            <Lan lang={lang} candidate={{
              zh: "探索一个在芬兰的软件工程师的生活与冒险",
              en: "Exploring the life and adventures of a software engineer in Finland"
            }} />
          </p>

          {/* Interactive button */}
          <motion.button
            className="group relative px-8 py-4 overflow-hidden rounded-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
            }}
          >
            <span className="relative z-10 text-white font-medium text-lg">
              <Lan lang={lang} candidate={{
                zh: "开始探索",
                en: "Start Exploring"
              }} />
            </span>
            
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
              initial={{ scale: 1 }}
              whileHover={{
                scale: 1.2,
                rotate: 180,
              }}
              transition={{ duration: 0.5 }}
            />
            
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
              }}
            />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Advanced scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-3 bg-white rounded-full mt-2"
            animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 4s ease infinite;
        }
        
        @keyframes glitch-1 {
          0%, 100% {
            clip-path: inset(0 0 100% 0);
            transform: translate(0);
          }
          20% {
            clip-path: inset(33% 0 33% 0);
            transform: translate(-2px, 2px);
          }
          40% {
            clip-path: inset(66% 0 0 0);
            transform: translate(2px, -2px);
          }
        }
        
        @keyframes glitch-2 {
          0%, 100% {
            clip-path: inset(100% 0 0 0);
            transform: translate(0);
          }
          30% {
            clip-path: inset(50% 0 25% 0);
            transform: translate(2px, 2px);
          }
          60% {
            clip-path: inset(25% 0 50% 0);
            transform: translate(-2px, -2px);
          }
        }
        
        .animate-glitch-1 {
          animation: glitch-1 2s infinite linear alternate-reverse;
        }
        
        .animate-glitch-2 {
          animation: glitch-2 2.5s infinite linear alternate-reverse;
        }
      `}</style>
    </motion.div>
  );
};

export default ModernHero;