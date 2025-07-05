"use client"
import { use } from 'react'
import { motion, } from "motion/react"
import Foot from '@/components/Common/Foot';
import { useEffect, useState, } from 'react';

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
  const [TitleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    setTitleIndex(Math.floor(Math.random() * TitleList.length))
  }, [TitleList.length]);


  return (
    <>
      <div className='container max-w-[2000px] m-auto'>
        <div className='overflow-hidden font-extrabold px-5 md:px-10'>
          <motion.h1 className={`font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#a1c4fd] to-[#c2e9fb] leading-tight 
            text-3xl mt-20 mb-6
            md:text-5xl md:mt-24 md:mb-8
            lg:text-6xl lg:mt-28 lg:mb-10
            xl:text-7xl xl:mt-32 xl:mb-12
            `} >
            <motion.div
              className='pb-2 pr-4 md:pr-10'
              key={TitleIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: 0
              }}
            >
              {
                TitleList[TitleIndex][lang].split('').map((char: string, index: number) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, translateY: 20, scale: 0.8 }}
                    animate={{ opacity: 1, translateY: 0, scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 120,
                      damping: 10,
                      delay: -0.5 + (lang == 'zh' ? 0.08 : 0.04) * index
                    }}
                    // whileHover={{ 
                    //   scale: 1.1,
                    //   color: "#fff",
                    //   textShadow: "0px 0px 8px rgba(161, 196, 253, 0.8)"
                    // }}
                  >
                    {char} 
                  </motion.span>
                ))
              }
            </motion.div>
          </motion.h1>
          <div></div>
        </div >
      </div >

      <div className='container max-w-[2000px] m-auto min-h-screen
        px-3 md:px-5 lg:px-10
        py-6 md:py-8 lg:py-12
        mx-2 md:mx-auto'>
        <Comments lang={lang} message_id="000000000000000000000000" message_page={message_page} />
      </div>

      <div className='mt-10 md:mt-20'>
        <Foot lang={lang} />
      </div>
    </>
  );
}
