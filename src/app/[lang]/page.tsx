"use client"

import AnimatedTitle from "@/components/Home/AnimatedTitle";
import VideoBackground from "@/components/Home/VideoBackground";
import { motion } from "motion/react"
import Image from "next/image";

import Lan from "@/components/util/Language";
import { use } from 'react';
import Foot from '@/components/Common/Foot';

export default function Home({ params }: { params: Promise<{ lang: string }> }) {

  const { lang } = use(params)

  // 计算工作年限（从2010年开始）
  const calculateYearsOfExperience = () => {
    const startYear = 2010;
    const currentYear = new Date().getFullYear();
    return currentYear - startYear;
  };

  const yearsOfExperience = calculateYearsOfExperience();

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Mofei Zhu",
    "alternateName": "朱文龙",
    "url": "https://www.mofei.life",
    "image": "https://www.mofei.life/img/mofei-logo_500_500.svg",
    "jobTitle": "Software Engineer",
    "worksFor": {
      "@type": "Organization",
      "name": "Mapbox"
    },
    "alumniOf": [
      {
        "@type": "Organization",
        "name": "Baidu"
      },
      {
        "@type": "Organization", 
        "name": "Yiban"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Helsinki",
      "@country": "Finland"
    },
    "nationality": "Chinese",
    "description": lang === 'zh' 
      ? "Mofei Zhu，一个在芬兰工作的软件工程师，分享在芬兰的生活经历、技术见解和文化探索故事。"
      : "Mofei Zhu, a software engineer from China, sharing life and work experiences in Finland, exploring tech, family, and cultural adventures.",
    "sameAs": [
      "https://www.instagram.com/zhu_wenlong",
      "https://github.com/zmofei"
    ],
    "knowsAbout": [
      "Software Engineering",
      "JavaScript",
      "React",
      "Node.js",
      "Web Development",
      "Finland Culture",
      "Travel"
    ]
  }

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://www.mofei.life",
    "name": lang === 'zh' ? "Mofei的生活博客" : "Mofei's Life Blog",
    "description": lang === 'zh'
      ? "一个在芬兰工作的软件工程师的生活故事和技术分享"
      : "Life stories and tech insights from a software engineer in Finland",
    "inLanguage": [lang === 'zh' ? "zh-CN" : "en-US"],
    "author": {
      "@type": "Person",
      "name": "Mofei Zhu"
    },
    "publisher": {
      "@type": "Person",
      "name": "Mofei Zhu"
    }
  }

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      
      {/* Full page video background */}
      <VideoBackground isFullPage={true} />
      
      <div className="w-full relative z-10">

        <div className="h-svh w-full flex items-center justify-center pt-30 relative">
          {/* 第一屏遮罩 */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-[1px]"></div>
          
          <div className="w-full max-w-screen-xl z-10 mx-auto relative">
            {/* <div className='bg-yellow-400 py-10'> */}
            <AnimatedTitle />
            {/* </div> */}
            
            {/* 手机版额外装饰元素 */}
            <div className="md:hidden absolute inset-0 pointer-events-none overflow-hidden">
              {/* 浮动粒子效果 */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/30 rounded-full"
                  style={{
                    left: `${15 + Math.random() * 70}%`,
                    top: `${20 + Math.random() * 60}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 0.8, 0.3],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
              
              {/* 光圈效果 */}
              <motion.div
                className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
            
            <motion.div className="w-full max-w-screen-xl z-10 text-center 
             px-4 text-xl pt-10 font-light text-gray-300 leading-relaxed
             md:px-10 lg:px-16 md:text-3xl md:pt-20"
              initial={{ opacity: 0, translateY: 0 }}
              animate={{ opacity: 1, translateY: -60 }}
              transition={{ duration: 0.5, delay: 2 }}>
              
              {/* 手机版文字容器带装饰 */}
              <div className="md:hidden relative min-h-fit">
                {/* 文字背景装饰 */}
                <div className="absolute inset-0 rounded-3xl border border-white/10 backdrop-blur-sm"
                     style={{
                       background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                     }}>
                </div>
                
                {/* 顶部装饰线 */}
                <motion.div
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  style={{ width: "120px" }}
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "120px", opacity: 0.6 }}
                  transition={{ duration: 1.2, delay: 2.5 }}
                />
                
                {/* 底部简单装饰 */}
                <motion.div
                  className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 3 }}
                />
                
                
                <div className="relative z-10 p-6 break-words overflow-visible">
                  <Lan lang={lang} candidate={{
                    "zh": "嘿, 我是Mofei! 你想和我一起探索在芬兰的软件工程师的生活与经历么？",
                    "en": "Hi, would you like to join me in exploring the life of a software engineer in Finland?"
                  }} />
                </div>
              </div>
              
              {/* 桌面版保持原样 */}
              <div className="hidden md:block">
                <Lan lang={lang} candidate={{
                  "zh": "嘿, 我是Mofei! 你想和我一起探索在芬兰的软件工程师的生活与经历么？",
                  "en": "Hi, would you like to join me in exploring the life of a software engineer in Finland?"
                }} />
              </div>
            </motion.div>
           
          </div>
           <motion.div
              initial={{ opacity: 0, }}
              whileInView={{ opacity: 0.8 }}
              transition={{ duration: 0.5, delay: 2 }}
              viewport={{ once: false, amount: 0.1 }}
              className="absolute left-0 right-0 bottom-10 md:bottom-20 flex justify-center"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0], // 循环上下移动的关键帧
                }}
                transition={{
                  duration: 1, // 完成一个循环所需时间
                  repeat: Infinity, // 无限循环
                  ease: "easeInOut", // 平滑的动画过渡
                }}
              >
                <Image 
                  src="/img/down-arrow-svgrepo-com.svg" 
                  alt="Scroll down arrow" 
                  width={20} 
                  height={20} 
                  className="h-5 w-5 md:h-10 md:w-10" 
                  sizes="(max-width: 768px) 20px, 40px"
                  priority={false}
                />
              </motion.div>
            </motion.div>
        </div>

        {/* 分割线 */}
        <div className="w-full bg-black">
          <div className="container max-w-[2000px] mx-auto px-5 md:px-10 lg:px-16">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
          </div>
        </div>

        {/* 关于我 - 惊艳设计 */}
        <div className="min-h-svh w-full relative bg-black/80 backdrop-blur-sm overflow-hidden">
          {/* 动态背景粒子 */}
          <div className="absolute inset-0 opacity-30">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
          
          {/* 背景光效 */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.1, 0.15, 0.1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            />
          </div>
          
          <div className='container max-w-[2000px] m-auto relative z-10'>
            <div className='px-5 md:px-10 lg:px-16 py-16 md:py-24 lg:py-32'>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.2, once: true }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {/* 惊艳标题 */}
                <motion.div className="text-center mb-16 relative">
                  <motion.h1 
                    className="text-4xl md:text-6xl lg:text-7xl font-light text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-white mb-8 tracking-wider relative"
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    whileHover={{ 
                      scale: 1.02,
                      textShadow: "0 0 20px rgba(255,255,255,0.5)"
                    }}
                  >
                    <Lan lang={lang} candidate={{
                      "zh": "关于我",
                      "en": "About Me"
                    }} />
                    
                    {/* 标题装饰线 */}
                    <motion.div
                      className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-transparent via-white to-transparent"
                      style={{ width: "200px" }}
                      initial={{ width: 0, opacity: 0 }}
                      whileInView={{ width: "200px", opacity: 0.6 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.5 }}
                    />
                  </motion.h1>
                  
                </motion.div>
                
                {/* 核心介绍 - 高级动效 */}
                <motion.div 
                  className="text-xl md:text-2xl text-gray-300 mb-16 md:mb-20 max-w-4xl font-light leading-relaxed space-y-8"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {[
                    {
                      zh: `我是朱文龙（Mofei），一名全栈软件工程师。${yearsOfExperience}年的开发经历让我相信，技术不仅是解决问题的工具，更是探索世界的方式。`,
                      en: `I'm Wenlong Zhu (Mofei), a full-stack software engineer. ${yearsOfExperience} years of development experience has taught me that technology is not just a tool for solving problems, but a way to explore the world.`
                    },
                    {
                      zh: "从淮南到上海、北京，再到赫尔辛基，每一次地理的迁移都伴随着思维的拓展。我在易班参与校园社交创业，在百度深耕数据可视化，在Mapbox构建全球地图服务。",
                      en: "From Huainan to Shanghai, Beijing, and finally Helsinki, each geographical move has been accompanied by an expansion of thinking. I participated in campus social startups at Yiban, deepened data visualization expertise at Baidu, and built global mapping services at Mapbox."
                    },
                    {
                      zh: "技术之外，我用文字记录思考，用镜头捕捉瞬间。探索，是我对世界保持好奇的方式。",
                      en: "Beyond technology, I record thoughts with words and capture moments with cameras. Exploration is my way of staying curious about the world."
                    }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="relative overflow-hidden p-6 rounded-2xl border border-white/10"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                      }}
                      initial={{ opacity: 0, x: -50, scale: 0.95 }}
                      whileInView={{ opacity: 1, x: 0, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.5, 
                        delay: 0.5 + index * 0.2,
                        ease: "easeOut"
                      }}
                      whileHover={{
                        scale: 1.01,
                        boxShadow: '0 4px 20px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.1)',
                        transition: { duration: 0.3 }
                      }}
                    >
                      <motion.p
                        className="relative z-10"
                        whileHover={{
                          color: "#ffffff",
                          transition: { duration: 0.3 }
                        }}
                      >
                        {item[lang as 'zh' | 'en']}
                      </motion.p>
                      
                      {/* 悬停光效 */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 opacity-0"
                        whileHover={{ opacity: 0.3 }}
                        transition={{ duration: 0.3 }}
                      />
                      
                      {/* 装饰点 */}
                      <motion.div
                        className="absolute top-4 right-4 w-2 h-2 bg-white/30 rounded-full"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.5,
                        }}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                {/* 技能与专长 - 炫酷卡片 */}
                <motion.div 
                  className="mb-16 md:mb-20"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <motion.h2 
                    className="text-2xl md:text-3xl font-light text-white mb-12 tracking-wide text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <Lan lang={lang} candidate={{
                      "zh": "专业领域",
                      "en": "Expertise"
                    }} />
                  </motion.h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {[
                      {
                        title: { zh: "AI & 机器学习", en: "AI & Machine Learning" },
                        icon: "🤖",
                        color: "from-purple-500/20 to-pink-500/20",
                        skills: [
                          "ChatGPT & OpenAI API",
                          "Claude API & MCP",
                          "GitHub Copilot",
                          "AI Agent & Vector DB"
                        ]
                      },
                      {
                        title: { zh: "前端开发", en: "Frontend Development" },
                        icon: "⚡",
                        color: "from-blue-500/20 to-cyan-500/20",
                        skills: [
                          "React & JavaScript",
                          "Redux & HTML/CSS",
                          "Sass & Webpack",
                          "Mini Program"
                        ]
                      },
                      {
                        title: { zh: "后端 & 基础设施", en: "Backend & Infrastructure" },
                        icon: "🔧",
                        color: "from-green-500/20 to-emerald-500/20",
                        skills: [
                          "Node.js & Python",
                          "AWS & Alibaba Cloud",
                          "MySQL & MongoDB",
                          "Nginx & Apache Spark"
                        ]
                      },
                      {
                        title: { zh: "数据处理 & 分析", en: "Data Processing & Analytics" },
                        icon: "📊",
                        color: "from-orange-500/20 to-yellow-500/20",
                        skills: [
                          "Apache Spark & PySpark",
                          "Apache Airflow",
                          "Kaggle & Python",
                          "Data Visualization"
                        ]
                      },
                      {
                        title: { zh: "开发工具", en: "Development Tools" },
                        icon: "🛠️",
                        color: "from-indigo-500/20 to-purple-500/20",
                        skills: [
                          "Git & GitHub",
                          "VS Code & Code Review",
                          "Unit Testing & Code Coverage",
                          "Webpack & CI/CD"
                        ]
                      },
                      {
                        title: { zh: "设计 & 专业平台", en: "Design & Specialized Platforms" },
                        icon: "🎨",
                        color: "from-pink-500/20 to-rose-500/20",
                        skills: [
                          "Adobe Illustrator",
                          "Adobe Photoshop",
                          "Data Visualization",
                          "Markdown & Documentation"
                        ]
                      }
                    ].map((section, sectionIndex) => (
                      <motion.div
                        key={sectionIndex}
                        className="relative p-8 rounded-3xl border border-white/20 overflow-hidden hover:border-white/30 transition-colors duration-300"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                          backdropFilter: 'blur(15px)',
                          WebkitBackdropFilter: 'blur(15px)',
                        }}
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ 
                          duration: 0.1, 
                          delay: 0.2,
                          ease: "easeOut" 
                        }}
                      >
                        
                        {/* 标题区域 */}
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                          <span className="text-2xl">
                            {section.icon}
                          </span>
                          <h3 className="text-lg md:text-xl text-white font-medium">
                            {section.title[lang as 'zh' | 'en']}
                          </h3>
                        </div>
                        
                        {/* 技能列表 */}
                        <div className="space-y-3 relative z-10">
                          {section.skills.map((skill, skillIndex) => (
                            <div
                              key={skillIndex}
                              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 transition-colors duration-200"
                            >
                              <div className="w-2 h-2 bg-white/60 rounded-full" />
                              <p className="text-gray-300 text-sm md:text-base">
                                {typeof skill === 'string' ? skill : skill[lang as 'zh' | 'en']}
                              </p>
                            </div>
                          ))}
                        </div>
                        
                        {/* 装饰性元素 */}
                        <div className="absolute top-6 right-6 w-20 h-20 opacity-10">
                          <div className="w-full h-full border border-white/30 rounded-full"></div>
                          <div className="absolute top-2 left-2 w-16 h-16 border border-white/20 rounded-full"></div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* 联系方式 - 未来感设计 */}
                <motion.div 
                  className="border-t border-white/20 pt-16 relative"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <motion.h2 
                    className="text-2xl md:text-3xl font-light text-white mb-12 tracking-wide text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Lan lang={lang} candidate={{
                      "zh": "联系我",
                      "en": "Connect"
                    }} />
                  </motion.h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {[
                      {
                        label: "Email",
                        value: "hello@mofei.life",
                        icon: "📧",
                        color: "from-green-500/20 to-emerald-500/20",
                        href: "mailto:hello@mofei.life"
                      },
                      {
                        label: "GitHub", 
                        value: "github.com/zmofei",
                        icon: "⚡",
                        color: "from-purple-500/20 to-violet-500/20",
                        href: "https://github.com/zmofei"
                      },
                      {
                        label: "Location",
                        value: lang === 'zh' ? "芬兰 · 赫尔辛基" : "Helsinki, Finland",
                        icon: "🌍",
                        color: "from-blue-500/20 to-cyan-500/20",
                        href: null
                      }
                    ].map((contact, index) => {
                      const ContactWrapper = contact.href ? motion.a : motion.div;
                      const contactProps = contact.href ? 
                        { 
                          href: contact.href, 
                          target: contact.href.startsWith('http') ? '_blank' : undefined,
                          rel: contact.href.startsWith('http') ? 'noopener noreferrer' : undefined
                        } : {};

                      return (
                        <ContactWrapper
                          key={index}
                          className="relative p-6 rounded-2xl border border-white/20 overflow-hidden cursor-pointer group"
                          style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                            backdropFilter: 'blur(15px)',
                            WebkitBackdropFilter: 'blur(15px)',
                          }}
                          initial={{ opacity: 0, y: 30, scale: 0.95 }}
                          whileInView={{ opacity: 1, y: 0, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ 
                            duration: 0.6, 
                            delay: 0.4 + index * 0.1,
                            ease: "easeOut" 
                          }}
                          whileHover={{
                            scale: 1.02,
                            y: -2,
                            boxShadow: '0 8px 25px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.15)',
                            transition: { duration: 0.3 }
                          }}
                          whileTap={{ scale: 0.98 }}
                          {...contactProps}
                        >
                          {/* 背景渐变 */}
                          <motion.div
                            className={`absolute inset-0 bg-gradient-to-br ${contact.color} opacity-0`}
                            whileHover={{ opacity: 0.4 }}
                            transition={{ duration: 0.3 }}
                          />
                          
                          {/* 图标 */}
                          <motion.div 
                            className="text-3xl mb-4 relative z-10"
                            animate={{
                              y: [0, -5, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: index * 0.3,
                            }}
                          >
                            {contact.icon}
                          </motion.div>
                          
                          {/* 标签 */}
                          <motion.span 
                            className="text-gray-400 text-sm uppercase tracking-wider block mb-2 relative z-10"
                            whileHover={{ color: "#ffffff" }}
                          >
                            {contact.label}
                          </motion.span>
                          
                          {/* 值 */}
                          <motion.p 
                            className="text-white text-lg font-medium relative z-10"
                            whileHover={{ 
                              scale: 1.05,
                              color: "#f0f9ff" 
                            }}
                          >
                            {contact.value}
                          </motion.p>
                          
                          {/* 悬停指示器 */}
                          {contact.href && (
                            <motion.div
                              className="absolute top-4 right-4 w-2 h-2 bg-white/60 rounded-full opacity-0 group-hover:opacity-100"
                              animate={{
                                scale: [1, 1.2, 1],
                              }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                              }}
                            />
                          )}
                          
                          {/* 装饰线条 */}
                          <motion.div
                            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-white/30 to-transparent"
                            initial={{ width: 0 }}
                            whileInView={{ width: "100%" }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                          />
                        </ContactWrapper>
                      );
                    })}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* 分割线 */}
        <div className="w-full bg-black">
          <div className="container max-w-[2000px] mx-auto px-5 md:px-10 lg:px-16">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
          </div>
        </div>

        {/* 探索之路 - 优化后的高性能版本 */}
        <div className="min-h-svh w-full relative bg-black/80 backdrop-blur-sm overflow-hidden">
          <div className='container max-w-[2000px] m-auto relative z-10'>
            <div className='px-5 md:px-10 lg:px-16 py-16 md:py-24 lg:py-32'>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.2, once: true }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {/* 简洁的标题 */}
                <motion.h1
                  className="text-4xl md:text-6xl lg:text-7xl font-light text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-white mb-8 tracking-wider"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <Lan lang={lang} candidate={{
                    "zh": "探索之路",
                    "en": "The Journey"
                  }} />
                </motion.h1>

                {/* 副标题 */}
                <motion.p
                  className="text-xl md:text-2xl text-gray-400 mb-16 md:mb-20 max-w-3xl font-light leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Lan lang={lang} candidate={{
                    "zh": `从淮南到赫尔辛基，${yearsOfExperience}年的技术与人生轨迹。每一次迁移，都是对可能性的重新定义。`,
                    "en": `From Huainan to Helsinki, ${yearsOfExperience} years of technology and life trajectory. Every move redefines the realm of possibilities.`
                  }} />
                </motion.p>

                {/* 时间线 - 优化版本 */}
                <motion.div
                  className="relative space-y-8 md:space-y-12 mb-20"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  {/* 流动动画连接线 */}
                  <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px overflow-hidden">
                    <div className="relative w-full h-full bg-gradient-to-b from-transparent via-white/20 to-transparent">
                      {/* 简单的流动光点 - 沿着线移动 */}
                      <motion.div
                        className="absolute w-2 h-6 bg-gradient-to-b from-white/80 to-white/20 rounded-full"
                        style={{ left: '-2px', top: '15px' }}
                        animate={{
                          y: ['-24px', '800px'],
                          opacity: [0, 0.8, 0.8, 0],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      {/* 第二个轻微的光点 - 沿着线移动 */}
                      <motion.div
                        className="absolute w-1.5 h-4 bg-gradient-to-b from-blue-300/60 to-transparent rounded-full"
                        style={{ left: '-1.5px', top: '20px' }}
                        animate={{
                          y: ['-16px', '800px'],
                          opacity: [0, 0.6, 0.6, 0],
                        }}
                        transition={{
                          duration: 5,
                          repeat: Infinity,
                          ease: "linear",
                          delay: 2,
                        }}
                      />
                    </div>
                  </div>
                  
                  {[
                    {
                      period: lang === 'zh' ? '🌱 至2008' : '🌱 -2008',
                      location: lang === 'zh' ? '淮南' : 'Huainan',
                      role: lang === 'zh' ? '起点 · 淮南' : 'Starting Point · Huainan',
                      description: lang === 'zh' ? '从小城市出发，对世界和技术充满好奇，为未来打下基础。' : 'Starting from a small city, full of curiosity about the world and technology, laying the foundation for the future.'
                    },
                    {
                      period: '🚀 2008-2014',
                      location: lang === 'zh' ? '上海' : 'Shanghai',
                      role: lang === 'zh' ? '上海 · 易班（校园社交创业）' : 'Shanghai · Yiban (Campus Social Startup)',
                      description: lang === 'zh' ? '初来上海求学时，机缘巧合参与了校园社交平台的搭建，从学生身份逐步转变为开发者，也开启了我与前端技术的长期关系。' : 'When I first came to Shanghai for studies, I had the opportunity to participate in building a campus social platform, gradually transforming from student to developer, beginning my long-term relationship with frontend technology.'
                    },
                    {
                      period: '🧠 2014-2018',
                      location: lang === 'zh' ? '北京' : 'Beijing',
                      role: lang === 'zh' ? '北京 · 百度（数据可视化）' : 'Beijing · Baidu (Data Visualization)',
                      description: lang === 'zh' ? '在大型互联网公司打磨前端技能，专注数据可视化与交互体验，积累系统级研发经验。' : 'Honing frontend skills at a major internet company, focusing on data visualization and interactive experiences, accumulating system-level development experience.'
                    },
                    {
                      period: '🌍 2018-2023',
                      location: lang === 'zh' ? '上海' : 'Shanghai',
                      role: lang === 'zh' ? '上海 · Mapbox（地图平台研发）' : 'Shanghai · Mapbox (Map Platform Development)',
                      description: lang === 'zh' ? '加入全球团队，主导地图数据处理管道建设，深入探索地理信息与大数据的结合，将工程能力与全球化产品实践相融合。' : 'Joined a global team, leading map data processing pipeline construction, deeply exploring the combination of geographic information and big data, integrating engineering capabilities with global product practices.'
                    },
                    {
                      period: lang === 'zh' ? '❄️ 2023-至今' : '❄️ 2023-Now',
                      location: lang === 'zh' ? '赫尔辛基' : 'Helsinki',
                      role: lang === 'zh' ? '赫尔辛基 · Mapbox（数据 & AI 工程）' : 'Helsinki · Mapbox (Data & AI Engineering)',
                      description: lang === 'zh' ? '搬到北欧后，继续在地图与数据处理领域深耕，目前专注于将 AI 能力引入地理信息系统，探索智能体、自动化分析等方向，致力于让地图变得更聪明、更有洞察力。' : 'After moving to Northern Europe, continuing to deepen expertise in mapping and data processing, currently focusing on introducing AI capabilities into geographic information systems, exploring intelligent agents and automated analysis, dedicated to making maps smarter and more insightful.'
                    }
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="relative flex flex-col md:flex-row md:items-center gap-6 md:gap-12 group p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        marginLeft: '2rem',
                      }}
                    >
                      {/* 时间线连接点 */}
                      <div
                        className="absolute left-[-2rem] top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full border border-white/30"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-white/60 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      
                      <div className="flex-shrink-0 w-full md:w-48 text-gray-500 text-sm md:text-base">
                        <div className="font-mono text-white/80">{item.period}</div>
                        <div className="text-gray-400 text-xs md:text-sm mt-1">{item.location}</div>
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-white text-lg md:text-xl font-medium mb-2 group-hover:text-gray-200 transition-colors">
                          {item.role}
                        </h3>
                        <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      {/* 装饰点 */}
                      <div className="absolute top-4 right-4 w-2 h-2 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ))}
                </motion.div>

                {/* 哲学思考部分 */}
                <motion.div
                  className="border-t border-gray-800 pt-16"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div 
                    className="relative p-8 rounded-3xl border border-white/20 overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                      backdropFilter: 'blur(15px)',
                      WebkitBackdropFilter: 'blur(15px)',
                    }}
                  >
                    <blockquote className="text-2xl md:text-3xl lg:text-4xl text-gray-300 font-light leading-relaxed max-w-4xl relative z-10">
                      <span className="text-gray-600">&ldquo;</span>
                      <Lan lang={lang} candidate={{
                        "zh": "探索不是为了到达某个终点，而是为了在路上发现更多的可能性。技术让我们能够跨越地理的界限，但真正的探索发生在思维的边界。",
                        "en": "Exploration is not about reaching a destination, but about discovering more possibilities along the way. Technology allows us to transcend geographical boundaries, but true exploration happens at the edges of our thinking."
                      }} />
                      <span className="text-gray-600">&rdquo;</span>
                    </blockquote>
                    
                    {/* 装饰性元素 */}
                    <div className="absolute top-6 right-6 w-20 h-20 opacity-10">
                      <div className="w-full h-full border border-white/30 rounded-full"></div>
                      <div className="absolute top-2 left-2 w-16 h-16 border border-white/20 rounded-full"></div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
        <Foot lang={lang} isHomePage={true} />
      </div >
    </>
  );
}