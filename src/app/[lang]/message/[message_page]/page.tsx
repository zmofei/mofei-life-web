"use client"
import { use } from 'react'
import { motion, } from "motion/react"
import Foot from '@/components/Common/Foot';
import { useState, } from 'react';

import Comments from '@/components/Comments/Comments';



export default function Home({ params }: { params: Promise<{ lang: 'zh' | 'en'; message_page: number }> }) {

  const { lang, message_page }: { lang: 'zh' | 'en', message_page: number } = use(params);


  const TitleList = [
    { "zh": "别害羞，留言吧！我等不及想看了！", "en": "Don't be shy, leave a message!" },
    { "zh": "写下你的想法，让我开心一整天吧！", "en": "Share your thoughts and brighten my day!" },
    { "zh": "来吧，说点什么，这会让我特别开心！", "en": "Say something, it would truly make my day!" },
    { "zh": "留言吧，你的每一句话都让我充满期待！", "en": "Your words always fill me with excitement!" },
    { "zh": "让我看到你的留言，它会是我一天中最美好的事情！", "en": "Your message will be the best part of my day!" },
    { "zh": "写点什么吧！你的留言会让这里更有意义！", "en": "Write something meaningful to make this space special!" },
    { "zh": "随便留言吧，哪怕只是一个“Hi”，我都会很开心！", "en": "Say hi, it will surely brighten my day!" },
    { "zh": "每一条留言都让我充满期待，说点什么吧！", "en": "Every message brings me so much joy!" },
    { "zh": "别让我等太久了，快写点什么吧！", "en": "Don't keep me waiting, write something now!" },
    { "zh": "你的留言会点亮我的一天，别犹豫，写下来吧！", "en": "Your message will light up my day, so write it down!" }
  ];
  const [TitleIndex] = useState(() => Math.floor(Math.random() * TitleList.length));


  return (
    <>
      {/* Animated background pattern to make glass effects visible */}
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

      <div className='container max-w-[2000px] m-auto relative z-10'>
        <div className='overflow-hidden font-extrabold px-5 md:px-10 lg:px-16'>
          <motion.h1
            className={`font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#a1c4fd] to-[#c2e9fb] leading-tight 
              text-3xl mt-20 mb-4
              md:text-5xl md:mt-24 md:mb-6
              lg:text-6xl lg:mt-28 lg:mb-8
              xl:text-7xl xl:mt-32 xl:mb-10
              `}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          // transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {TitleList[TitleIndex][lang]}
          </motion.h1>

          <motion.p
            className="text-gray-300/90 text-lg md:text-xl lg:text-2xl font-medium leading-relaxed tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {lang === 'zh'
              ? '在这个快节奏的时代，暂停一下，分享你的想法。每一条留言都让这里更有温度。'
              : 'In this fast-paced world, take a moment to pause and share your thoughts. Every message makes this place warmer.'
            }
          </motion.p>

          <motion.p
            className="text-gray-400/80 text-sm md:text-base leading-relaxed mt-4 md:mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {lang === 'zh'
              ? '无论是一句问候、一个想法，还是一段故事，都欢迎你留下足迹。让我们在文字中相遇，在交流中成长。'
              : 'Whether it\'s a greeting, a thought, or a story, you\'re welcome to leave your mark. Let\'s meet through words and grow through communication.'
            }
          </motion.p>
        </div >
      </div >

      <div className='container max-w-[2000px] m-auto min-h-screen
        px-3 md:px-5 lg:px-10
        py-6 md:py-8 lg:py-12
        mx-2 md:mx-auto relative z-10'>
        <Comments lang={lang} message_id="000000000000000000000000" message_page={message_page} />
      </div>

      <div className='mt-10 md:mt-20 relative z-10'>
        <Foot lang={lang} />
      </div>
    </>
  );
}
