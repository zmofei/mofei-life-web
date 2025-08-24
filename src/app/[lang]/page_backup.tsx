"use client"

import InteractiveHero from "@/components/Home/InteractiveHero";
import { motion } from "motion/react";
import Lan from "@/components/util/Language";
import { use, useMemo, Suspense, useState } from 'react';
import Foot from '@/components/Common/Foot';
import { notFound } from 'next/navigation';

export default function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params);
  
  // Validate language parameter
  const VALID_LANGUAGES = ['en', 'zh'];
  if (!VALID_LANGUAGES.includes(lang)) {
    notFound();
  }
  
  const [expandedSkills, setExpandedSkills] = useState<Set<number>>(new Set());

  const toggleAllSkills = () => {
    const skillsCount = 6;
    if (expandedSkills.size === skillsCount) {
      setExpandedSkills(new Set());
    } else {
      setExpandedSkills(new Set([0, 1, 2, 3, 4, 5]));
    }
  };

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

      {/* Interactive Hero Section */}
      <InteractiveHero lang={lang} />

      <div className="w-full relative z-10 min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/5 to-slate-900">
        {/* Global floating particles */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={`global-particle-${i}`}
              className="absolute w-0.5 h-0.5 bg-purple-400 rounded-full"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
              }}
              animate={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
              }}
              transition={{
                duration: Math.random() * 30 + 30,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                opacity: Math.random() * 0.3 + 0.1,
              }}
            />
          ))}
        </div>

        {/* Animated Divider */}
        <div className="w-full bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
          <div className="container max-w-[2000px] mx-auto px-5 md:px-10 lg:px-16">
            <motion.div 
              className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            />
          </div>
        </div>

        {/* About Me - Interactive Design */}
        <Suspense fallback={<div className="min-h-svh bg-gradient-to-br from-slate-900 to-purple-900/20 flex items-center justify-center text-white">Loading...</div>}>
          <div className="min-h-svh w-full relative bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900 overflow-hidden">
            {/* Animated background particles */}
            <div className="absolute inset-0 opacity-30">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                  initial={{
                    x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                    y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                  }}
                  animate={{
                    x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                    y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
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

            {/* Animated gradient orbs */}
            <div className="absolute inset-0">
              <motion.div
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full filter blur-[128px] opacity-20"
                animate={{
                  x: [0, 100, 0],
                  y: [0, -100, 0],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-[128px] opacity-20"
                animate={{
                  x: [0, -100, 0],
                  y: [0, 100, 0],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            <div className='container max-w-[2000px] m-auto relative z-10'>
              <div className='px-5 md:px-10 lg:px-16 py-16 md:py-24 lg:py-32'>
                <div>
                  {/* Section Title with Animation */}
                  <motion.div 
                    className="text-center mb-16 relative"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-8 tracking-wider">
                      <Lan lang={lang} candidate={{
                        "zh": "关于我",
                        "en": "About Me"
                      }} />
                    </h1>
                    <motion.div
                      className="h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto"
                      initial={{ width: 0 }}
                      whileInView={{ width: 200 }}
                      transition={{ duration: 1, delay: 0.3 }}
                      viewport={{ once: true }}
                    />
                  </motion.div>

                  {/* Core introduction with glassmorphism cards */}
                  <div className="mb-16 md:mb-20 w-full">
                    <motion.div 
                      className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.2
                          }
                        }
                      }}
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
                          className={`relative overflow-hidden p-6 md:p-8 rounded-2xl backdrop-blur-md transition-all duration-300 hover:scale-[1.02] ${index === 0 ? 'lg:col-span-2' : ''
                            }`}
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          viewport={{ once: true }}
                          whileHover={{ 
                            boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)"
                          }}
                          style={{
                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 50%, rgba(147, 51, 234, 0.1) 100%)',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                          }}
                        >
                          <p className="relative z-10 text-lg md:text-xl lg:text-2xl font-light leading-relaxed text-gray-300">
                            {item[lang as 'zh' | 'en']}
                          </p>
                          {/* Animated gradient overlay */}
                          <motion.div
                            className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                            style={{
                              background: 'radial-gradient(600px circle at 50% 50%, rgba(139, 92, 246, 0.15), transparent 40%)'
                            }}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>

                  {/* Skills & expertise - Interactive cards */}
                  <div className="mb-16 md:mb-20">
                    <motion.div 
                      className="flex items-center justify-between mb-12"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.8 }}
                      viewport={{ once: true }}
                    >
                      <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent tracking-wide">
                        <Lan lang={lang} candidate={{
                          "zh": "专业领域",
                          "en": "Expertise"
                        }} />
                      </h2>

                      <button
                        onClick={toggleAllSkills}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm md:text-base text-white/70 hover:text-white transition-all duration-300 hover:scale-105 backdrop-blur-md"
                        style={{
                          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)',
                          border: '1px solid rgba(139, 92, 246, 0.3)',
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
                    </motion.div>

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
                          className="relative p-4 md:p-6 rounded-2xl md:rounded-3xl overflow-hidden backdrop-blur-md transition-all duration-300 hover:scale-105 cursor-pointer"
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
                          viewport={{ once: true }}
                          whileHover={{ 
                            boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)"
                          }}
                          onClick={() => {
                            setExpandedSkills(prev => {
                              const newSet = new Set(prev);
                              if (newSet.has(sectionIndex)) {
                                newSet.delete(sectionIndex);
                              } else {
                                newSet.add(sectionIndex);
                              }
                              return newSet;
                            });
                          }}
                          style={{
                            background: `linear-gradient(135deg, ${section.color.replace('/20', '/10')})`,
                            border: '1px solid rgba(139, 92, 246, 0.2)',
                          }}
                        >
                          <div className={`flex items-center gap-2 md:gap-3 relative z-10 ${expandedSkills.has(sectionIndex) ? 'mb-4 md:mb-6' : 'mb-0'}`}>
                            <span className="text-xl md:text-2xl">
                              {section.icon}
                            </span>
                            <h3 className="text-base md:text-lg lg:text-xl text-white font-medium">
                              {section.title[lang as 'zh' | 'en']}
                            </h3>
                          </div>

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
                                className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg md:rounded-xl bg-gradient-to-r from-purple-500/5 to-cyan-500/5 border border-purple-400/20 hover:border-cyan-400/30 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-cyan-500/10 transition-all duration-200"
                              >
                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex-shrink-0" />
                                <p className="text-gray-300 text-xs md:text-sm lg:text-base">
                                  {typeof skill === 'string' ? skill : skill[lang as 'zh' | 'en']}
                                </p>
                              </div>
                            ))}
                          </div>

                          <motion.div 
                            className="absolute top-4 right-4 md:top-6 md:right-6 w-12 h-12 md:w-20 md:h-20 opacity-20"
                            animate={{
                              rotate: expandedSkills.has(sectionIndex) ? 360 : 0,
                            }}
                            transition={{ duration: 0.5 }}
                          >
                            <div className="w-full h-full border border-purple-400/30 rounded-full"></div>
                            <div className="absolute top-1 left-1 md:top-2 md:left-2 w-10 h-10 md:w-16 md:h-16 border border-cyan-400/20 rounded-full"></div>
                          </motion.div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Contact Section - Interactive Design */}
                  <div className="border-t border-purple-500/30 pt-16 relative">
                    <motion.h2 
                      className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-12 tracking-wide text-center"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                      viewport={{ once: true }}
                    >
                      <Lan lang={lang} candidate={{
                        "zh": "联系我",
                        "en": "Connect"
                      }} />
                    </motion.h2>

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
                          <motion.div
                            key={index}
                            className="relative p-4 md:p-6 rounded-xl md:rounded-2xl overflow-hidden cursor-pointer group backdrop-blur-md transition-all duration-300"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ 
                              scale: 1.05,
                              boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)"
                            }}
                            style={{
                              background: `linear-gradient(135deg, ${contact.color.replace('/20', '/15')})`,
                              border: '1px solid rgba(139, 92, 246, 0.3)',
                            }}
                            {...(contact.href && {
                              onClick: () => window.open(contact.href, contact.href.startsWith('http') ? '_blank' : '_self')
                            })}
                          >
                            <motion.div
                              className={`absolute inset-0 bg-gradient-to-br ${contact.color.replace('/20', '/30')} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                            />

                            <div className="text-2xl md:text-3xl mb-3 md:mb-4 relative z-10">
                              {contact.icon}
                            </div>

                            <span className="text-gray-400 text-xs md:text-sm uppercase tracking-wider block mb-2 relative z-10">
                              {contact.label}
                            </span>

                            <p className="text-white text-base md:text-lg font-medium relative z-10 break-words">
                              {contact.value}
                            </p>

                            {contact.href && (
                              <motion.div
                                className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                            )}

                            <motion.div
                              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-cyan-400"
                              initial={{ width: 0 }}
                              whileHover={{ width: "100%" }}
                              transition={{ duration: 0.3 }}
                            />
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Suspense>

        <Foot lang={lang} isHomePage={true} />
      </div>
    </>
  );
}