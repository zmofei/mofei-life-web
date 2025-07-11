"use client"

import { useScroll, useTransform, } from "motion/react"
import { useRef } from 'react';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ParallaxBackground({ blog }: { blog: any }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    }); // 获取滚动位置
    const backgroundPosition = useTransform(
        scrollYProgress,
        [0, 1], // 滚动范围
        [-20, 20] // 背景位置变化范围
    );


    return (
        <div className="w-full relative overflow-hidden  
            h-56 
            md:h-96
            bg-slate-700 
            bg-opacity-50
            "
        >
            <div
                ref={ref}
                className='absolute -top-[20px] left-0 -bottom-[20px] right-0'
                style={{
                    backgroundImage: `url(${blog.cover || '/img/mofei-logo.svg'})`,
                    backgroundSize: `${blog.cover ? 'cover' : 'contain'}`,
                    backgroundPosition: "center center",
                    backgroundRepeat: "no-repeat",
                    backgroundOrigin: "padding-box",
                    transform: `translateY(${backgroundPosition}px)`,
                    margin: blog.cover ? 0 : "60px",
                }}
            />
        </div>
    );
}
