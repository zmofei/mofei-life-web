"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef, useMemo } from "react";
import Lan from "@/components/util/Language";

interface InteractiveHeroProps {
  lang: string;
}

const InteractiveHero = ({ lang }: InteractiveHeroProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentWord, setCurrentWord] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Words to cycle through
  const words = useMemo(() => ({
    zh: ["创造者", "探索者", "工程师", "梦想家"],
    en: ["Creator", "Explorer", "Engineer", "Dreamer"]
  }), []);

  // Typewriter effect
  useEffect(() => {
    const word = words[lang as keyof typeof words][currentWord];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < word.length) {
          setDisplayText(word.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(word.slice(0, displayText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentWord((prev) => (prev + 1) % words[lang as keyof typeof words].length);
        }
      }
    }, isDeleting ? 50 : 150);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentWord, lang, words]);

  // Interactive canvas background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Check if mobile device
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 15 : 30; // Reduce particles on mobile
    const maxSpeed = isMobile ? 0.2 : 0.3; // Slower movement on mobile

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }> = [];

    // Create particles with mobile optimization
    for (let i = 0; i < particleCount; i++) {
      // On mobile, keep particles more towards edges
      let x, y;
      if (isMobile) {
        // Bias particles towards corners and edges, away from center
        const edge = Math.random();
        if (edge < 0.5) {
          // Top/bottom edges
          x = Math.random() * canvas.width;
          y = Math.random() < 0.5 ? Math.random() * canvas.height * 0.2 : canvas.height * 0.8 + Math.random() * canvas.height * 0.2;
        } else {
          // Left/right edges
          x = Math.random() < 0.5 ? Math.random() * canvas.width * 0.25 : canvas.width * 0.75 + Math.random() * canvas.width * 0.25;
          y = Math.random() * canvas.height;
        }
      } else {
        x = Math.random() * canvas.width;
        y = Math.random() * canvas.height;
      }

      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * maxSpeed,
        vy: (Math.random() - 0.5) * maxSpeed,
        radius: Math.random() * 1.5 + 0.5, // Slightly smaller particles
        color: `hsla(${Math.random() * 60 + 200}, 70%, 60%, ${isMobile ? 0.2 : 0.25})` // Lower opacity on mobile
      });
    }

    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)"; // Slightly stronger fade for cleaner look
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        // Move particles
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Mouse interaction (reduced on mobile)
        if (!isMobile) {
          const dx = mouseX - particle.x;
          const dy = mouseY - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) { // Smaller interaction radius
            particle.vx += dx * 0.00005; // Weaker attraction
            particle.vy += dy * 0.00005;
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Connect nearby particles (reduced on mobile)
        if (!isMobile) {
          particles.forEach((otherParticle) => {
            const dx = otherParticle.x - particle.x;
            const dy = otherParticle.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 80) { // Shorter connection distance
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = `rgba(255, 255, 255, ${0.06 * (1 - distance / 80)})`; // Weaker lines
              ctx.stroke();
            }
          });
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Interactive canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-30 md:opacity-40"
      />

      {/* Animated gradient orbs */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-purple-500 rounded-full filter blur-[100px] md:blur-[128px] opacity-20 md:opacity-25"
          animate={{
            x: [0, 50, 0], // Reduced movement on mobile
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25, // Slower movement
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-72 h-72 md:w-96 md:h-96 bg-blue-500 rounded-full filter blur-[100px] md:blur-[128px] opacity-20 md:opacity-25"
          animate={{
            x: [0, -50, 0], // Reduced movement on mobile
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20, // Slower movement
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
        {/* Main title with hover effect */}
        <motion.div
          className="mb-8"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <motion.h1
            className="text-6xl md:text-8xl font-bold text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              className="inline-block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: isHovered ? ["0%", "100%"] : "0%",
              }}
              transition={{
                duration: 2,
                ease: "linear",
              }}
              style={{
                backgroundSize: "200% 100%",
              }}
            >
              Hei!
            </motion.span>
          </motion.h1>

          {/* Animated underline */}
          <motion.div
            className="h-1 bg-gradient-to-r from-cyan-400 to-purple-600 mt-4"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>

        {/* Name with SVG logo */}
        <motion.div
          className="mb-8 perspective-1000"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="flex items-center justify-center text-4xl md:text-6xl font-light text-white">
            <Lan lang={lang} candidate={{
              zh: "我是",
              en: "I am"
            }} />
            <motion.div
              className="ml-3 md:ml-6 inline-block"
              whileHover={{
                rotateY: 360,
                scale: 1.1,
              }}
              transition={{ duration: 0.6 }}
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 301.6 68.3"
                className="h-12 md:h-20 w-auto"
              >
                <path d="M14.9.2h27.6l10.7 41.4L63.8.2h27.6v68H74.2V16.3L60.9 68.2H45.4L32.1 16.3v51.9H14.9zm148.4.1h51.9v14.6h-30.9v11.9h26.4v13.7h-26.4v27.8h-21.1zm55.9 0h56.3v14.5h-35.2v10.8H273v13.9h-32.7v13.4h36.3v15.4h-57.3zm61.4 0h21.1v68h-21.1zM147.4 0h-52v68h63.4V0zm-9.7 41.5v11.9h-21.2V14.6h21.2z" fill="#fff" />
                <path d="M1.8 6.9h21.4v15.3c0 6.2-.5 11.1-1.6 14.7s-3.1 6.8-6.1 9.6-6.7 5.1-11.3 6.7L0 44.4C4.3 43 7.4 41 9.2 38.5s2.8-5.9 2.9-10.2H1.8z" fill="#f15a54" />
              </svg>
            </motion.div>
          </div>
        </motion.div>

        {/* Typewriter effect */}
        <div className="h-16 mb-8">
          <motion.p
            className="text-2xl md:text-4xl text-gray-300 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <span className="text-gray-500">
              <Lan lang={lang} candidate={{
                zh: "一个",
                en: "A"
              }} />
            </span>{" "}
            <span className="text-cyan-400 font-mono">
              {displayText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                |
              </motion.span>
            </span>
          </motion.p>
        </div>

        {/* Description with fade-in words */}
        <motion.div
          className="max-w-2xl mx-auto text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed mb-4">
            <Lan lang={lang} candidate={{
              zh: "在芬兰探索技术、生活与冒险的软件工程师",
              en: "Software engineer exploring technology, life, and adventure in Finland"
            }} />
          </p>
          
          {/* Subtitle */}
          <motion.p 
            className="text-sm md:text-base text-gray-500 font-light italic"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <Lan lang={lang} candidate={{
              zh: "来自芬兰的问候 👋",
              en: "Hello from Finland 👋"
            }} />
          </motion.p>
        </motion.div>

        {/* Interactive CTA button */}
        <motion.div
          className="flex justify-center mt-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          <motion.button
            className="group relative px-8 py-4 backdrop-blur-md border border-purple-500/30 rounded-full overflow-hidden transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
            }}
            style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.1) 50%, rgba(147, 51, 234, 0.15) 100%)'
            }}
          >
            <span className="relative z-10 text-white font-medium">
              <Lan lang={lang} candidate={{
                zh: "了解更多",
                en: "Learn More"
              }} />
            </span>
            
            {/* Subtle hover overlay */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-30 pointer-events-none transition-opacity duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(59, 130, 246, 0.2) 100%)'
              }}
            />
          </motion.button>
        </motion.div>
      </div>

      {/* Animated scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={() => {
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
          }}
        >
          <span className="text-gray-400 text-sm">
            <Lan lang={lang} candidate={{
              zh: "向下滚动",
              en: "Scroll Down"
            }} />
          </span>
          <motion.svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </motion.svg>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default InteractiveHero;