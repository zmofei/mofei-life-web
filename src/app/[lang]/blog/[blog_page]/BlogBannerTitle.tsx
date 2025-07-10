"use client"

import { motion } from "motion/react"
import Lan from "@/components/util/Language";
import { useState, useEffect } from 'react';


export default function BlogBannerTitle(params: { lang: 'zh' | 'en' }) {

    const { lang } = params

    const TitleList = [
        { "zh": "生活的热爱", "en": "Love & Life" },
        { "zh": "远方的风景", "en": "Scenery Of Distant" },
        { "zh": "思想的碰撞", "en": "Clash Of Ideas" },
        { "zh": "成长的足迹", "en": "Footprints & Growth" },
        { "zh": "温暖的瞬间", "en": "Warm Moment" },
        { "zh": "未来的期待", "en": "Hope For The Future" },
        { "zh": "一切有趣的事", "en": "Everything Interesting" }
    ]

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(true);

    // Final index is "一切有趣的事" / "Everything Interesting"
    const finalIndex = TitleList.length - 1;

    useEffect(() => {
        if (!isAnimating) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => {
                const nextIndex = (prev + 1) % TitleList.length;
                
                // If we've reached the final index, stop animating
                if (nextIndex === finalIndex) {
                    setIsAnimating(false);
                    return finalIndex;
                }
                
                return nextIndex;
            });
        }, 200); // Change every 0.2 seconds for fast cycling

        return () => clearInterval(interval);
    }, [isAnimating, finalIndex, TitleList.length]);

    return (
        <>
            <div className='container max-w-[2000px] m-auto width-full overflow-hidden'>
                <div className='font-extrabold overflow-hidden pt-20 w-full px-5 md:px-10 lg:px-16'>
                    <motion.h1 
                        className={`font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#a1c4fd] to-[#c2e9fb] leading-tight 
                            text-3xl mt-5 mb-4
                            md:text-5xl md:mt-24 md:mb-6
                            lg:text-6xl lg:mt-28 lg:mb-8
                            xl:text-7xl xl:mt-32 xl:mb-10
                        `}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <Lan lang={lang} candidate={{
                            "zh": "我书写",
                            "en": "I Write "
                        }} />
                        <br />
                        <Lan lang={lang} candidate={TitleList[currentIndex]} />
                    </motion.h1>
                    
                    <motion.p 
                        className="text-gray-300/90 text-lg md:text-xl lg:text-2xl font-medium leading-relaxed tracking-wide"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    >
                        <Lan lang={lang} candidate={{
                            "zh": "在文字的世界里探索思想，在故事中寻找生活的意义。每一篇文章都是一次心灵的旅行。",
                            "en": "Exploring thoughts in the world of words, finding meaning in stories. Every article is a journey of the soul."
                        }} />
                    </motion.p>
                    
                    <motion.p 
                        className="text-gray-400/80 text-sm md:text-base leading-relaxed mt-4 md:mt-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    >
                        <Lan lang={lang} candidate={{
                            "zh": "只要心怀梦想，写下的每个字都能点亮世界，哪怕只是开始，也是在书写属于自己的奇迹。",
                            "en": "As long as you have a dream, every word you write can light up the world. Even if it's just a beginning, you're writing your own miracle."
                        }} />
                    </motion.p>
                </div>
            </div>
        </>
    );
}
