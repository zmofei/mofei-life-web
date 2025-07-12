"use client"

import AnimatedTitle from "@/components/Home/AnimatedTitle";
import VideoBackground from "@/components/Home/VideoBackground";
import { motion } from "motion/react";
import Image from "next/image";

import Lan from "@/components/util/Language";
import { use, useMemo, Suspense, useState } from 'react';
import Foot from '@/components/Common/Foot';

// Extract skills data outside component to avoid repeated creation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SKILLS_DATA = [
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
      "Python Data Science Stack",
      "Data Pipeline & ETL"
    ]
  },
  {
    title: { zh: "移动开发", en: "Mobile Development" },
    icon: "📱",
    color: "from-red-500/20 to-pink-500/20",
    skills: [
      "React Native",
      "iOS & Android",
      "Swift & Kotlin",
      "Flutter"
    ]
  },
  {
    title: { zh: "运维 & 工具", en: "DevOps & Tools" },
    icon: "🛠️",
    color: "from-gray-500/20 to-slate-500/20",
    skills: [
      "Docker & Kubernetes",
      "CI/CD & GitHub Actions",
      "Linux & Shell Script",
      "Monitoring & Logging"
    ]
  }
] as const;

export default function Home({ params }: { params: Promise<{ lang: string }> }) {

  const { lang } = use(params);
  const [expandedSkills, setExpandedSkills] = useState<Set<number>>(new Set());

  const toggleAllSkills = () => {
    const skillsCount = 6; // Total number of skill cards
    if (expandedSkills.size === skillsCount) {
      // If all expanded, collapse all
      setExpandedSkills(new Set());
    } else {
      // Otherwise expand all
      setExpandedSkills(new Set([0, 1, 2, 3, 4, 5]));
    }
  };

  // Calculate work years (from 2010) - use useMemo to cache calculation result
  const yearsOfExperience = useMemo(() => {
    const startYear = 2010;
    const currentYear = new Date().getFullYear();
    return currentYear - startYear;
  }, []);

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
  };

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
  };

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

      {/* Full page video background - optimized performance */}
      <VideoBackground isFullPage={true} />

      <div className="w-full relative z-10 min-h-screen">

        <div className="h-svh w-full flex items-center justify-center relative">
          {/* First screen overlay - simplified for mobile */}
          <div className="absolute inset-0 bg-black/70 md:bg-black/80 md:backdrop-blur-[1px]"></div>

          <div className="w-full max-w-screen-xl z-10 mx-auto relative">
            {/* <div className='bg-yellow-400 py-10'> */}
            <AnimatedTitle />
            {/* </div> */}

            <motion.div className="w-full max-w-screen-xl z-10 text-center 
             px-4 text-xl pt-10 font-light text-gray-300 leading-relaxed
             md:px-10 lg:px-16 md:text-3xl md:pt-20"
              initial={{ opacity: 0, translateY: 0 }}
              animate={{ opacity: 1, translateY: -60 }}
              transition={{ duration: 0.5, delay: 2 }}>


              <div className="block">
                <Lan lang={lang} candidate={{
                  "zh": <span>Hei! <br />我是Mofei <br />你想和我一起探索<br />芬兰的软件工程师的生活与经历么？</span>,
                  "en": <span>Hei! <br />I am Mofei <br />would you like to join me<br />in exploring <br />the life of a software engineer in Finland?</span>,
                }} />
              </div>
            </motion.div>

          </div>
          {/* Simplified scroll hint for mobile */}
          <motion.div
            className="absolute left-0 right-0 bottom-10 md:bottom-20 flex justify-center opacity-60 md:opacity-80"
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: [0.6, 1, 0.6],
              y: [0, 10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          >
            <div>
              <Image
                src="/img/down-arrow-svgrepo-com.svg"
                alt="Scroll down arrow"
                width={16}
                height={16}
                className="h-4 w-4 md:h-10 md:w-10"
                sizes="(max-width: 768px) 16px, 40px"
                priority={false}
              />
            </div>
          </motion.div>
        </div>

        {/* Divider line */}
        <div className="w-full bg-black">
          <div className="container max-w-[2000px] mx-auto px-5 md:px-10 lg:px-16">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
          </div>
        </div>

        {/* About me - stunning design */}
        <Suspense fallback={<div className="min-h-svh bg-black/80 flex items-center justify-center text-white">Loading...</div>}>
          <div className="min-h-svh w-full relative bg-black/85 overflow-hidden">
            {/* Static background particles - optimized performance */}
            <div className="absolute inset-0 opacity-20 hidden md:block">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full opacity-20"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </div>

            {/* Background light effects - optimized performance */}
            <div className="absolute inset-0 hidden md:block">
              <div
                className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-2xl opacity-5"
              />
              <div
                className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-2xl opacity-5"
              />
            </div>

            <div className='container max-w-[2000px] m-auto relative z-10'>
              <div className='px-5 md:px-10 lg:px-16 py-16 md:py-24 lg:py-32'>
                <div
                >
                  {/* Stunning title */}
                  <div className="text-center mb-16 relative">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-white mb-8 tracking-wider relative">
                      <Lan lang={lang} candidate={{
                        "zh": "关于我",
                        "en": "About Me"
                      }} />

                      {/* Title decoration line */}
                      <div
                        className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-transparent via-white to-transparent"
                        style={{ width: "200px", opacity: 0.6 }}
                      />
                    </h1>

                  </div>

                  {/* Core introduction - advanced animations */}
                  <div className="mb-16 md:mb-20 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
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
                        <div
                          key={index}
                          className={`relative overflow-hidden p-6 md:p-8 rounded-2xl hover:opacity-90 transition-all duration-300 ${index === 0 ? 'lg:col-span-2' : ''
                            }`}
                          style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 100%)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.18)',
                          }}
                        >
                          <p
                            className="relative z-10 text-lg md:text-xl lg:text-2xl font-light leading-relaxed text-gray-300"
                          >
                            {item[lang as 'zh' | 'en']}
                          </p>

                          {/* Hover light effect */}
                          <div
                            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 opacity-0"
                            style={{ opacity: 0.3 }}
                          />

                          {/* Decoration dots */}
                          <div
                            className="absolute top-4 right-4 w-2 h-2 bg-white/30 rounded-full"
                            style={{ opacity: 0.3 }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills & expertise - cool cards */}
                  <div className="mb-16 md:mb-20">
                    <div className="flex items-center justify-between mb-12">
                      <h2 className="text-2xl md:text-3xl font-light text-white tracking-wide">
                        <Lan lang={lang} candidate={{
                          "zh": "专业领域",
                          "en": "Expertise"
                        }} />
                      </h2>

                      <button
                        onClick={toggleAllSkills}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm md:text-base text-white/70 hover:text-white transition-all duration-300 hover:opacity-90"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                          border: '1px solid rgba(255,255,255,0.15)',
                        }}
                      >
                        <div
                          style={{ transform: `rotate(${expandedSkills.size === 6 ? 180 : 0}deg)` }}
                        >
                          {expandedSkills.size === 6 ? '📤' : '📥'}
                        </div>
                        <span>
                          <Lan lang={lang} candidate={{
                            "zh": expandedSkills.size === 6 ? "全部收起" : "全部展开",
                            "en": expandedSkills.size === 6 ? "Collapse All" : "Expand All"
                          }} />
                        </span>
                      </button>
                    </div>

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
                        <div
                          key={sectionIndex}
                          className="relative p-4 md:p-6 rounded-2xl md:rounded-3xl overflow-hidden hover:opacity-90 transition-all duration-300"
                          style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.08) 100%)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                          }}
                        >

                          {/* 标题区域 */}
                          <div className={`flex items-center gap-2 md:gap-3 relative z-10 ${expandedSkills.has(sectionIndex) ? 'mb-4 md:mb-6' : 'mb-0'}`}>
                            <span className="text-xl md:text-2xl">
                              {section.icon}
                            </span>
                            <h3 className="text-base md:text-lg lg:text-xl text-white font-medium">
                              {section.title[lang as 'zh' | 'en']}
                            </h3>
                          </div>

                          {/* 技能列表 */}
                          <div
                            className={`relative z-10 overflow-hidden ${expandedSkills.has(sectionIndex) ? 'space-y-2 md:space-y-3' : ''}`}
                            style={{
                              height: expandedSkills.has(sectionIndex) ? 'auto' : 0,
                              opacity: expandedSkills.has(sectionIndex) ? 1 : 0,
                              marginTop: expandedSkills.has(sectionIndex) ? '1rem' : 0
                            }}
                          >
                            {section.skills.map((skill, skillIndex) => (
                              <div
                                key={skillIndex}
                                className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg md:rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 transition-colors duration-200"
                              >
                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white/60 rounded-full flex-shrink-0" />
                                <p className="text-gray-300 text-xs md:text-sm lg:text-base">
                                  {typeof skill === 'string' ? skill : skill[lang as 'zh' | 'en']}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* 装饰性元素 - 手机版隐藏 */}
                          <div className="absolute top-4 right-4 md:top-6 md:right-6 w-12 h-12 md:w-20 md:h-20 opacity-10 hidden md:block">
                            <div className="w-full h-full border border-white/30 rounded-full"></div>
                            <div className="absolute top-1 left-1 md:top-2 md:left-2 w-10 h-10 md:w-16 md:h-16 border border-white/20 rounded-full"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 联系方式 - 未来感设计 */}
                  <div className="border-t border-white/20 pt-16 relative">
                    <h2 className="text-2xl md:text-3xl font-light text-white mb-12 tracking-wide text-center">
                      <Lan lang={lang} candidate={{
                        "zh": "联系我",
                        "en": "Connect"
                      }} />
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
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
                        return (
                          <div
                            key={index}
                            className="relative p-4 md:p-6 rounded-xl md:rounded-2xl overflow-hidden cursor-pointer group hover:scale-105 transition-all duration-300"
                            style={{
                              background: 'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.1) 100%)',
                              boxShadow: '0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(255,255,255,0.1)',
                              border: '1px solid rgba(255,255,255,0.22)',
                            }}
                            {...(contact.href && {
                              onClick: () => window.open(contact.href, contact.href.startsWith('http') ? '_blank' : '_self')
                            })}
                          >
                            {/* 背景渐变 */}
                            <div
                              className={`absolute inset-0 bg-gradient-to-br ${contact.color} opacity-0`}
                              style={{ opacity: 0.4 }}
                            />

                            {/* 图标 */}
                            <div className="text-2xl md:text-3xl mb-3 md:mb-4 relative z-10">
                              {contact.icon}
                            </div>

                            {/* 标签 */}
                            <span className="text-gray-400 text-xs md:text-sm uppercase tracking-wider block mb-2 relative z-10">
                              {contact.label}
                            </span>

                            {/* 值 */}
                            <p className="text-white text-base md:text-lg font-medium relative z-10 break-words">
                              {contact.value}
                            </p>

                            {/* 悬停指示器 */}
                            {contact.href && (
                              <div
                                className="absolute top-4 right-4 w-2 h-2 bg-white/60 rounded-full opacity-0 group-hover:opacity-100"
                              />
                            )}

                            {/* 装饰线条 */}
                            <div
                              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-white/30 to-transparent"
                              style={{ width: "100%" }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Suspense>

        {/* Divider line */}
        <div className="w-full bg-black">
          <div className="container max-w-[2000px] mx-auto px-5 md:px-10 lg:px-16">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
          </div>
        </div>

        {/* 探索之路 - 优化后的高性能版本 */}
        <Suspense fallback={<div className="min-h-svh bg-black/80 flex items-center justify-center text-white">Loading...</div>}>
          <div className="min-h-svh w-full relative bg-black/85 overflow-hidden">
            <div className='container max-w-[2000px] m-auto relative z-10'>
              <div className='px-5 md:px-10 lg:px-16 py-16 md:py-24 lg:py-32'>
                <div
                >
                  {/* 简洁的标题 */}
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-white mb-8 tracking-wider">
                    <Lan lang={lang} candidate={{
                      "zh": "探索之路",
                      "en": "The Journey"
                    }} />
                  </h1>

                  {/* 副标题 */}
                  <p className="text-xl md:text-2xl text-gray-400 mb-16 md:mb-20 max-w-3xl font-light leading-relaxed">
                    <Lan lang={lang} candidate={{
                      "zh": `从淮南到赫尔辛基，${yearsOfExperience}年的技术与人生轨迹。每一次迁移，都是对可能性的重新定义。`,
                      "en": `From Huainan to Helsinki, ${yearsOfExperience} years of technology and life trajectory. Every move redefines the realm of possibilities.`
                    }} />
                  </p>

                  {/* 时间线 - 优化版本 */}
                  <div className="relative space-y-6 md:space-y-8 lg:space-y-12 mb-16 md:mb-20">
                    {/* 流动动画连接线 */}
                    <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px overflow-hidden">
                      <div className="relative w-full h-full bg-gradient-to-b from-transparent via-white/20 to-transparent">
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
                        className="relative flex flex-col md:flex-row md:items-center gap-4 md:gap-6 lg:gap-12 group p-4 md:p-6 rounded-xl md:rounded-2xl transition-all duration-300 ml-8 md:ml-12 hover:opacity-90"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.08) 100%)',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.15)',
                        }}
                      >
                        {/* 时间线连接点 */}
                        <div
                          className="absolute top-1/2 w-3 h-3 rounded-full border border-white/30 md:hidden"
                          style={{
                            left: 'calc(-2rem + 1rem - 6px)', // 移动端：卡片在2rem，竖线在1rem，连接点中心在竖线上
                            transform: 'translateY(-50%)',
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.15) 100%)',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)',
                            border: '1px solid rgba(255,255,255,0.3)',
                          }}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-white/60 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                        </div>

                        {/* PC端时间线连接点 */}
                        <div
                          className="absolute top-1/2 w-3 h-3 rounded-full border border-white/30 hidden md:block"
                          style={{
                            left: 'calc(-3rem + 1.5rem - 6px)', // PC端：卡片在3rem，竖线在1.5rem，连接点中心在竖线上
                            transform: 'translateY(-50%)',
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.15) 100%)',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)',
                            border: '1px solid rgba(255,255,255,0.3)',
                          }}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-white/60 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                        </div>

                        <div className="flex-shrink-0 w-full md:w-48 text-gray-500 text-xs md:text-sm lg:text-base">
                          <div className="font-mono text-white/80 text-sm md:text-base">{item.period}</div>
                          <div className="text-gray-400 text-xs md:text-sm mt-1">{item.location}</div>
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-white text-base md:text-lg lg:text-xl font-medium mb-2 group-hover:text-gray-200 transition-colors">
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
                  </div>

                  {/* 哲学思考部分 */}
                  <div className="border-t border-gray-800 pt-16">
                    <div
                      className="relative p-8 rounded-3xl overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.12) 100%)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.25)',
                      }}
                    >
                      <blockquote className="text-2xl md:text-3xl lg:text-4xl text-gray-300 font-light leading-relaxed max-w-5xl mx-auto text-center relative z-10">
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Suspense>
        <Foot lang={lang} isHomePage={true} />
      </div >
    </>
  );
}