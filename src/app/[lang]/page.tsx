"use client"

import AnimatedTitle from "@/components/Home/AnimatedTitle";
import VideoBackground from "@/components/Home/VideoBackground";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import Lan from "@/components/util/Language";
import { use, useMemo, Suspense, useState, useEffect } from 'react';
import Foot from '@/components/Common/Foot';
import { StaggerContainer, StaggerItem } from '@/components/util/PageTransition';
import { notFound } from 'next/navigation';


export default function Home({ params }: { params: Promise<{ lang: string }> }) {

  const { lang } = use(params);
  
  // Validate language parameter
  const VALID_LANGUAGES = ['en', 'zh'];
  if (!VALID_LANGUAGES.includes(lang)) {
    notFound();
  }
  const SKILL_SECTION_COUNT = 6;
  const [expandedSkills, setExpandedSkills] = useState<Set<number>>(new Set());
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(!!mql.matches);
    update();
    mql.addEventListener?.('change', update);
    return () => mql.removeEventListener?.('change', update);
  }, []);

  const toggleAllSkills = () => {
    if (expandedSkills.size === SKILL_SECTION_COUNT) {
      // If all expanded, collapse all
      setExpandedSkills(new Set());
    } else {
      // Otherwise expand all
      setExpandedSkills(new Set(Array.from({ length: SKILL_SECTION_COUNT }, (_, index) => index)));
    }
  };
  const handleToggleSkillCard = (sectionIndex: number) => {
    setExpandedSkills((prev) => {
      const next = new Set(prev);
      if (next.has(sectionIndex)) {
        next.delete(sectionIndex);
      } else {
        next.add(sectionIndex);
      }
      return next;
    });
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

      {/* Fixed hero screen - stays in place as background */}
      <div className="fixed inset-0 z-0">
        {/* Video background */}
        <VideoBackground isFullPage={true} />
        
        {/* Hero content overlay - fixed in place */}
        <div className="absolute inset-0 z-10">
          <StaggerContainer className="h-full w-full flex items-center justify-center relative">
            {/* First screen overlay - simplified for mobile */}
            <div className="absolute inset-0 hero-overlay"></div>

            <div className="w-full max-w-screen-xl z-10 mx-auto relative">
              <StaggerItem>
                <AnimatedTitle />
              </StaggerItem>

              <StaggerItem>
                <motion.div className="w-full max-w-screen-xl z-10 text-center 
                 px-4 text-xl pt-10 font-light text-gray-300 leading-relaxed
                 md:px-10 lg:px-16 md:text-3xl md:pt-20"
                  initial={reducedMotion ? { opacity: 1, translateY: 0 } : { opacity: 0, translateY: 0 }}
                  animate={reducedMotion ? { opacity: 1, translateY: 0 } : { opacity: 1, translateY: -60 }}
                  transition={reducedMotion ? { duration: 0 } : { duration: 0.5, delay: 2 }}>

                <div className="block">
                  <Lan lang={lang} candidate={{
                    "zh": <span>一起探索芬兰软件工程师的生活与经历。  </span>,
                    "en": <span>Join me in exploring the life of a software engineer in Finland.  </span>,
                  }} />
                </div>
                <div className="hero-cta mt-6 md:mt-10">
                  <Link href="#about" className="hero-scroll">
                    <Lan lang={lang} candidate={{
                      "zh": "向下滚动继续探索",
                      "en": "Scroll down to keep exploring"
                    }} />
                    <svg className="hero-scroll__icon" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 2.7V7.3M5 7.3L3.4 5.7M5 7.3L6.6 5.7" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
                </motion.div>
              </StaggerItem>

            </div>
            {/* Simplified scroll hint for mobile */}
            <StaggerItem>
              <motion.div
              className="absolute left-0 right-0 bottom-10 md:bottom-20 flex justify-center opacity-60 md:opacity-80"
              initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
              animate={reducedMotion ? { opacity: 1, y: 0 } : { opacity: [0.6, 1, 0.6], y: [0, 10, 0] }}
              transition={reducedMotion ? { duration: 0 } : { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 2 }}
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
            </StaggerItem>
          </StaggerContainer>
        </div>
      </div>

      {/* Spacer to push content down one screen height */}
      <div className="h-screen relative z-10"></div>

      {/* Glass content container that scrolls over the fixed video background */}
      <div className="relative z-20 border-t border-white/10 glass-shell">
        {/* Gradient separator line */}
        <div className="w-full">
          <div className="container max-w-[2000px] mx-auto px-5 md:px-10 lg:px-16">
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          </div>
        </div>

        {/* About me - stunning design */}
        <Suspense fallback={<div className="min-h-svh bg-black/80 flex items-center justify-center text-white">Loading...</div>}>
          <div className="min-h-svh w-full relative overflow-hidden section-shell">
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

            <div id="about" className='container max-w-[2000px] m-auto relative z-10'>
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

                  {/* Core introduction */}
                  <div className="mb-16 md:mb-20 w-full max-w-6xl mx-auto px-4 lg:px-0">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                      <div className="flex-1 space-y-8 text-base md:text-lg text-gray-300 leading-relaxed">
                        <p>
                          <Lan
                            lang={lang}
                            candidate={{
                              zh: "👋 你好，我是朱文龙（Mofei）。现居芬兰赫尔辛基，是一名长期在前端、后端、大规模数据系统与 AI 应用之间跨栈工作的工程师，同时也是一个持续写作、记录生活、养育两个孩子的父亲。",
                              en: "👋 Hi, I'm Wenlong Zhu (Mofei). I'm currently based in Helsinki, Finland—a software engineer working across frontend, backend, large-scale data systems, and AI applications, and a father of two who enjoys writing and documenting life along the way."
                            }}
                          />
                        </p>
                        <div className="space-y-3">
                          <p>
                            <Lan
                              lang={lang}
                              candidate={{
                                zh: "自 2010 年进入互联网行业以来，我先后在不同类型的团队里打怪升级：",
                                en: "Since 2010, I've been leveling up across different kinds of teams:"
                              }}
                            />
                          </p>
                          <ul className="space-y-2 text-sm md:text-base text-white/75">
                            <li className="flex items-start gap-2">
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/35 flex-shrink-0" />
                              <Lan
                                lang={lang}
                                candidate={{
                                  zh: "易班｜中国高校数字化的核心平台",
                                  en: "Yiban — a key platform in China's higher-education digital ecosystem"
                                }}
                              />
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/35 flex-shrink-0" />
                              <Lan
                                lang={lang}
                                candidate={{
                                  zh: "百度｜中国顶级的搜索与 AI 科技公司",
                                  en: "Baidu — one of China's leading companies in search and AI technology"
                                }}
                              />
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/35 flex-shrink-0" />
                              <Lan
                                lang={lang}
                                candidate={{
                                  zh: "Mapbox｜全球地图与位置智能领域的独角兽公司",
                                  en: "Mapbox — a global \"unicorn\" in mapping and location intelligence"
                                }}
                              />
                            </li>
                          </ul>
                        </div>
                        <p>
                          <Lan
                            lang={lang}
                            candidate={{
                              zh: "从校园互联网，到中国科技巨头，再到全球地图基础设施，我一直在面向真实用户场景的复杂系统中工作：写过前端、做过后端，构建过分布式数据管道，也在探索 AI Agent 与空间数据的结合。",
                              en: "From campus internet platforms to China's tech giants and now global mapping infrastructure, my work has always focused on real-world, high-complexity systems—whether that's web engineering, distributed data pipelines, or exploring how AI agents interact with spatial data."
                            }}
                          />
                        </p>
                        <p>
                          <Lan
                            lang={lang}
                            candidate={{
                              zh: "但这个博客不只记录技术。这里同样写下我对城市、工具、迁徙、育儿、思考方式与日常生活的观察——写给读者，也写给未来的自己。",
                              en: "But this blog isn't only about technology. It also captures what I notice about cities, tools, migration, parenting, and how we think and live—written for both readers today and my future self."
                            }}
                          />
                        </p>
                      </div>

                      <div className="lg:w-[22rem] xl:w-[24rem] flex flex-col gap-6 text-sm md:text-base text-white/75">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm shadow-lg shadow-black/20 space-y-4">
                          <h3 className="text-xs uppercase tracking-[0.32em] text-white/50">
                            <Lan
                              lang={lang}
                              candidate={{
                                zh: "标签 · 工作与生活",
                                en: "Tags · Work & Life"
                              }}
                            />
                          </h3>
                          <Lan
                            lang={lang}
                            candidate={{
                              zh: (
                                <div className="space-y-3 text-white/75">
                                  <div className="grid grid-cols-1 gap-2">
                                    <span>🧠 多栈工程师</span>
                                    <span>🧭 地图与数据</span>
                                    <span>🤖 AI 工作流探索者</span>
                                    <span>📈 结构化思考者</span>
                                  </div>
                                  <div className="grid grid-cols-1 gap-2 pt-2 border-t border-white/10">
                                    <span>📚 持续写作者</span>
                                    <span>📝 记录技术与生活</span>
                                    <span>👨‍👧‍👧 两个女儿的爸爸</span>
                                    <span>🇫🇮 生活在北欧的中国人</span>
                                  </div>
                                </div>
                              ),
                              en: (
                                <div className="space-y-3 text-white/75">
                                  <div className="grid grid-cols-1 gap-2">
                                    <span>🧠 Multi-stack Engineer</span>
                                    <span>🧭 Maps &amp; Data</span>
                                    <span>🤖 AI Workflow Explorer</span>
                                    <span>📈 Structured Thinker</span>
                                  </div>
                                  <div className="grid grid-cols-1 gap-2 pt-2 border-t border-white/10">
                                    <span>📚 Long-term Writer</span>
                                    <span>📝 Tech &amp; Life Documenter</span>
                                    <span>👨‍👧‍👧 Dad of Two</span>
                                    <span>🇫🇮 A Chinese Living in the Nordics</span>
                                  </div>
                                </div>
                              )
                            }}
                          />
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-5 shadow-inner shadow-black/20">
                          <p className="text-sm md:text-base text-gray-200 leading-relaxed">
                            <Lan
                              lang={lang}
                              candidate={{
                                zh: "技术让我在地图世界里持续攀爬，写作帮我整理思绪，生活和家人是我返回的坐标点。",
                                en: "Tech keeps me climbing through the world of maps, writing clears my head, and life with family is the compass I return to."
                              }}
                            />
                          </p>
                        </div>
                      </div>
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
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm md:text-base text-white/70 hover:text-white transition-all duration-300 hover:opacity-90 glass-button"
                      >
                        <div
                          style={{ transform: `rotate(${expandedSkills.size === SKILL_SECTION_COUNT ? 180 : 0}deg)` }}
                        >
                          {expandedSkills.size === SKILL_SECTION_COUNT ? '📤' : '📥'}
                        </div>
                        <span>
                          <Lan lang={lang} candidate={{
                            "zh": expandedSkills.size === SKILL_SECTION_COUNT ? "全部收起" : "全部展开",
                            "en": expandedSkills.size === SKILL_SECTION_COUNT ? "Collapse All" : "Expand All"
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
                      ].map((section, sectionIndex) => {
                        const isExpanded = expandedSkills.size === SKILL_SECTION_COUNT || expandedSkills.has(sectionIndex);
                        const visibleSkills = isExpanded ? section.skills : section.skills.slice(0, 2);
                        const remainingCount = section.skills.length - visibleSkills.length;
                        return (
                          <div
                            key={sectionIndex}
                            className="relative p-4 md:p-6 rounded-2xl md:rounded-3xl overflow-hidden hover:opacity-90 transition-all duration-300 glass-card glass-card--compact"
                          >

                            {/* 标题区域 */}
                            <button
                              type="button"
                              onClick={() => handleToggleSkillCard(sectionIndex)}
                              className="skill-card-header"
                              aria-expanded={isExpanded}
                            >
                              <span className="text-xl md:text-2xl">
                                {section.icon}
                              </span>
                              <h3 className="text-base md:text-lg lg:text-xl text-white font-medium">
                                {section.title[lang as 'zh' | 'en']}
                              </h3>
                              <svg
                                className={`w-3.5 h-3.5 md:w-4 md:h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                                viewBox="0 0 12 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>

                            {/* 技能列表 */}
                            <div className={`relative z-10 space-y-2 md:space-y-3 transition-all duration-300 ${isExpanded ? 'mt-4 md:mt-6' : 'mt-4 md:mt-5'}`}>
                              {visibleSkills.map((skill, skillIndex) => (
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
                              {remainingCount > 0 && !isExpanded && (
                                <div className="text-xs md:text-sm text-white/60">
                                  <Lan lang={lang} candidate={{
                                    zh: `还有 ${remainingCount} 项技能可展开`,
                                    en: `${remainingCount} more skills to explore`
                                  }} />
                                </div>
                              )}
                            </div>

                            {/* 装饰性元素 - 手机版隐藏 */}
                            <div className="absolute top-4 right-4 md:top-6 md:right-6 w-12 h-12 md:w-20 md:h-20 opacity-10 hidden md:block">
                              <div className="w-full h-full border border-white/30 rounded-full"></div>
                              <div className="absolute top-1 left-1 md:top-2 md:left-2 w-10 h-10 md:w-16 md:h-16 border border-white/20 rounded-full"></div>
                            </div>
                          </div>
                        );
                      })}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                      {[
                        {
                          label: "Email",
                          value: "hello@mofei.life",
                          icon: "📧",
                          color: "from-green-500/20 to-emerald-500/20",
                          href: "mailto:hello@mofei.life",
                          description: {
                            zh: "合作项目、播客邀请或单纯打个招呼都欢迎来信。",
                            en: "Reach out for collaborations, podcast invites, or simply to say hi."
                          }
                        },
                        {
                          label: "GitHub",
                          value: "github.com/zmofei",
                          icon: "⚡",
                          color: "from-purple-500/20 to-violet-500/20",
                          href: "https://github.com/zmofei",
                          description: {
                            zh: "查看我的开源项目、实验性工具与工程实践。",
                            en: "Explore open-source experiments and engineering practices I maintain."
                          }
                        },
                        {
                          label: "Location",
                          value: lang === 'zh' ? "芬兰 · 赫尔辛基" : "Helsinki, Finland",
                          icon: "🌍",
                          color: "from-blue-500/20 to-cyan-500/20",
                          href: null,
                          description: {
                            zh: "北欧生活实践，跨时区协作与远程办公经验分享。",
                            en: "Insights on Nordic living, distributed teamwork, and remote work."
                          }
                        },
                        {
                          label: "LinkedIn",
                          value: "linkedin.com/in/mofei-zhu",
                          icon: "🤝",
                          color: "from-sky-500/20 to-indigo-500/20",
                          href: "https://www.linkedin.com/in/mofei-zhu/",
                          description: {
                            zh: "关注职业动态，与我建立更长期的专业联系。",
                            en: "Follow career updates and connect for future opportunities."
                          }
                        }
                      ].map((contact, index) => {
                        return (
                          <div
                            key={index}
                            className={`relative p-4 md:p-6 rounded-xl md:rounded-2xl overflow-hidden group hover:scale-105 transition-all duration-300 glass-card glass-card--interactive ${contact.href ? 'cursor-pointer' : ''}`}
                            {...(contact.href && {
                              onClick: () => window.open(contact.href, contact.href.startsWith('http') ? '_blank' : '_self')
                            })}
                          >
                            {/* 背景渐变 */}
                            <div
                              className={`absolute inset-0 bg-gradient-to-br ${contact.color} opacity-40 pointer-events-none`}
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

                            {/* 描述 */}
                            <p className="mt-2 text-xs md:text-sm text-white/60 leading-relaxed relative z-10">
                              <Lan lang={lang} candidate={contact.description} />
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

        {/* Separator between sections within glass container */}
        <div className="w-full">
          <div className="container max-w-[2000px] mx-auto px-5 md:px-10 lg:px-16">
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          </div>
        </div>

        {/* 探索之路 - 优化后的高性能版本 */}
        <Suspense fallback={<div className="min-h-svh bg-black/80 flex items-center justify-center text-white">Loading...</div>}>
          <div className="min-h-svh w-full relative overflow-hidden section-shell">
            <div id="journey" className='container max-w-[2000px] m-auto relative z-10'>
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
                        className="relative flex flex-col md:flex-row md:items-center gap-4 md:gap-6 lg:gap-12 group p-4 md:p-6 rounded-xl md:rounded-2xl transition-all duration-300 ml-8 md:ml-12 hover:opacity-90 glass-card glass-card--timeline"
                      >
                        {/* 时间线连接点 */}
                        <div
                          className="absolute top-1/2 w-3 h-3 rounded-full border border-white/30 md:hidden timeline-node"
                          style={{
                            left: 'calc(-2rem + 1rem - 6px)', // 移动端：卡片在2rem，竖线在1rem，连接点中心在竖线上
                            transform: 'translateY(-50%)'
                          }}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-white/60 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                        </div>

                        {/* PC端时间线连接点 */}
                        <div
                          className="absolute top-1/2 w-3 h-3 rounded-full border border-white/30 hidden md:block timeline-node"
                          style={{
                            left: 'calc(-3rem + 1.5rem - 6px)', // PC端：卡片在3rem，竖线在1.5rem，连接点中心在竖线上
                            transform: 'translateY(-50%)'
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

                  {/* Quote section separator */}
                  <div className="w-full">
                    <div className="container max-w-[2000px] mx-auto px-5 md:px-10 lg:px-16">
                      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    </div>
                  </div>

                  {/* 哲学思考部分 */}
                  <div className="pt-16">
                    <div
                      className="relative p-8 rounded-3xl overflow-hidden glass-card glass-card--statement"
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

                  {/* 下一步行动 */}
                  <div id="next" className="mt-20 md:mt-24">
                    <div className="text-center mb-10 md:mb-14">
                      <h2 className="text-3xl md:text-4xl font-light text-white tracking-wide mb-4">
                        <Lan lang={lang} candidate={{
                          "zh": "下一步去哪？",
                          "en": "Where to next?"
                        }} />
                      </h2>
                      <p className="text-base md:text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        <Lan lang={lang} candidate={{
                          "zh": "挑一个方向继续探索：读我的文字、留言给我，或成为朋友。",
                          "en": "Pick a direction and keep exploring—read my posts, leave a message, or become a friend."
                        }} />
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                      {[
                        {
                          title: {
                            zh: "📖 最新博客",
                            en: "📖 Latest Posts"
                          },
                          description: {
                            zh: "记录我最近的思考、技术与生活。",
                            en: "Thoughts, tech notes, and moments from life."
                          },
                          href: `/${lang}/blog/1`,
                          cta: {
                            zh: "👉 去阅读",
                            en: "👉 Read now"
                          }
                        },
                        {
                          title: {
                            zh: "💬 留言板",
                            en: "💬 Message Board"
                          },
                          description: {
                            zh: "写下一句话，或者看看别人的声音。",
                            en: "Say something, or just read what others have left."
                          },
                          href: `/${lang}/message/1`,
                          cta: {
                            zh: "👉 去留言",
                            en: "👉 Leave a message"
                          }
                        },
                        {
                          title: {
                            zh: "🤝 成为朋友",
                            en: "🤝 Let’s Be Friends"
                          },
                          description: {
                            zh: "如果你也在写字、做内容，欢迎交换友链。",
                            en: "If you create too, let’s exchange links and connect."
                          },
                          href: `/${lang}/friends`,
                          cta: {
                            zh: "👉 申请友链",
                            en: "👉 Request a friend link"
                          }
                        }
                      ].map((item) => {
                        const isExternal = typeof item.href === 'string' && item.href.startsWith('http');
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="next-card glass-card glass-card--compact"
                            target={isExternal ? '_blank' : undefined}
                            rel={isExternal ? 'noopener noreferrer' : undefined}
                          >
                            <div className="flex flex-col gap-3 text-left">
                              <span className="text-sm uppercase tracking-[0.28em] text-white/60">
                                <Lan lang={lang} candidate={item.title} />
                              </span>
                              <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
                                <Lan lang={lang} candidate={item.description} />
                              </p>
                              <span className="inline-flex items-center gap-2 text-sm font-medium text-cyan-200">
                                <Lan lang={lang} candidate={item.cta} />
                                <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M3 6H9M9 6L6.5 3.5M9 6L6.5 8.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Suspense>

        <div className="w-full"><div className="container max-w-[2000px] mx-auto px-5 md:px-10 lg:px-16"><div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div></div></div>
        
        <Foot lang={lang} isHomePage={true} />
      </div>
      <style jsx global>{`
        .hero-overlay {
          background-color: rgba(9, 11, 18, 0.92);
          background:
            radial-gradient(120% 120% at 10% 10%, rgba(76, 209, 253, 0.18) 0%, transparent 55%),
            radial-gradient(120% 120% at 90% 0%, rgba(167, 139, 250, 0.18) 0%, transparent 60%),
            linear-gradient(180deg, rgba(9, 11, 18, 0.92) 0%, rgba(8, 10, 16, 0.9) 45%, rgba(6, 8, 12, 0.95) 100%);
          pointer-events: none;
        }

        .hero-overlay::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.14) 0, rgba(255, 255, 255, 0.14) 1px, transparent 1px);
          background-size: 6px 6px;
          opacity: 0.18;
          mix-blend-mode: soft-light;
          pointer-events: none;
        }

        .hero-overlay::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 45%);
          opacity: 0.4;
          pointer-events: none;
        }

        .hero-cta {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.75rem;
          position: relative;
          z-index: 2;
        }

        .hero-scroll {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.15rem 0;
          font-size: 0.88rem;
          font-weight: 400;
          color: rgba(203, 213, 225, 0.4);
          text-decoration: none;
          letter-spacing: 0.04em;
          pointer-events: auto;
          position: relative;
          transition: color 0.2s ease;
        }

        .hero-scroll:hover {
          color: rgba(226, 232, 240, 0.65);
        }

        .hero-scroll::after {
          content: '';
          position: absolute;
          left: 50%;
          bottom: -0.2rem;
          width: 70px;
          height: 1px;
          transform: translateX(-50%);
          background: linear-gradient(90deg, rgba(148, 163, 184, 0) 0%, rgba(148, 163, 184, 0.2) 50%, rgba(148, 163, 184, 0) 100%);
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .hero-scroll:hover::after {
          opacity: 1;
        }

        .hero-scroll__icon {
          width: 11px;
          height: 11px;
          color: rgba(226, 232, 240, 0.5);
          flex-shrink: 0;
          transition: transform 0.2s ease, color 0.2s ease;
        }

        .hero-scroll:hover .hero-scroll__icon {
          transform: translateY(1.5px);
          color: rgba(226, 232, 240, 0.7);
        }

        .glass-shell {
          position: relative;
          background-color: rgba(6, 8, 12, 0.88);
          background:
            radial-gradient(140% 140% at 0% 100%, rgba(14, 165, 233, 0.12) 0%, transparent 68%),
            radial-gradient(120% 120% at 100% 0%, rgba(236, 72, 153, 0.1) 0%, transparent 62%),
            linear-gradient(180deg, rgba(8, 10, 16, 0.65) 0%, rgba(7, 9, 14, 0.82) 52%, rgba(4, 6, 10, 0.95) 100%);
          overflow: hidden;
          box-shadow: 0 -28px 80px rgba(3, 6, 18, 0.58);
        }

        .glass-shell::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(3, 7, 18, 0.68) 0%, rgba(3, 7, 18, 0.42) 28%, rgba(3, 7, 18, 0) 58%),
            linear-gradient(0deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 32%);
          z-index: -1;
          pointer-events: none;
        }

        .glass-shell::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.12) 0, rgba(255, 255, 255, 0.12) 1px, transparent 1px);
          background-size: 8px 8px;
          opacity: 0.08;
          mix-blend-mode: soft-light;
          pointer-events: none;
          z-index: -2;
        }

        .section-shell {
          position: relative;
          background-color: rgba(12, 16, 24, 0.84);
          background:
            radial-gradient(160% 120% at 20% 20%, rgba(59, 130, 246, 0.12) 0%, transparent 60%),
            radial-gradient(140% 100% at 80% 0%, rgba(217, 70, 239, 0.1) 0%, transparent 65%),
            linear-gradient(180deg, rgba(12, 16, 24, 0.6) 0%, rgba(9, 12, 20, 0.86) 100%);
          overflow: hidden;
        }

        .section-shell::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(5, 8, 15, 0.58) 0%, rgba(5, 8, 15, 0.32) 22%, rgba(5, 8, 15, 0) 54%);
          z-index: -1;
          pointer-events: none;
        }

        .section-shell::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.1) 0, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 10px 10px;
          opacity: 0.08;
          mix-blend-mode: soft-light;
          pointer-events: none;
          z-index: -2;
        }

        .glass-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%);
          border: 1px solid rgba(255, 255, 255, 0.16);
          box-shadow: 0 20px 40px rgba(8, 12, 20, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.18);
          position: relative;
          z-index: 0;
        }

        .glass-card::before {
          content: '';
          position: absolute;
          inset: -25%;
          background: inherit;
          filter: blur(28px);
          opacity: 0.4;
          z-index: -2;
          pointer-events: none;
          border-radius: inherit;
        }

        .glass-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.12) 0, rgba(255, 255, 255, 0.12) 1px, transparent 1px);
          background-size: 8px 8px;
          opacity: 0.12;
          mix-blend-mode: soft-light;
          z-index: -1;
          pointer-events: none;
          border-radius: inherit;
        }

        .glass-card--accent {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.05) 60%, rgba(255, 255, 255, 0.12) 100%);
        }

        .glass-card--compact {
          background: linear-gradient(140deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.04) 60%, rgba(255, 255, 255, 0.1) 100%);
        }

        .glass-card--interactive {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.08) 60%, rgba(255, 255, 255, 0.14) 100%);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .glass-card--interactive:hover {
          box-shadow: 0 24px 48px rgba(8, 12, 20, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.24);
        }

        .glass-card--timeline {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 100%);
        }

        .glass-card--statement {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.08) 55%, rgba(255, 255, 255, 0.16) 100%);
        }

        .timeline-node {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.15) 100%);
          box-shadow: 0 4px 16px rgba(8, 12, 20, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.45);
          border-color: rgba(255, 255, 255, 0.32);
        }

        .skill-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          width: 100%;
          background: linear-gradient(135deg, rgba(148, 163, 184, 0.12) 0%, rgba(148, 163, 184, 0.04) 100%);
          border: 1px solid rgba(226, 232, 240, 0.16);
          border-radius: 16px;
          padding: 0.75rem 1rem;
          color: rgba(248, 250, 252, 0.9);
          transition: background 0.3s ease, border 0.3s ease;
        }

        .skill-card-header:hover {
          background: linear-gradient(135deg, rgba(148, 163, 184, 0.2) 0%, rgba(148, 163, 184, 0.1) 100%);
          border-color: rgba(226, 232, 240, 0.24);
        }

        .glass-button {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.05) 100%);
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 0 12px 28px rgba(8, 12, 20, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.22);
          position: relative;
          overflow: hidden;
        }

        .glass-button::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.18) 0, rgba(255, 255, 255, 0.18) 1px, transparent 1px);
          background-size: 10px 10px;
          opacity: 0.12;
          pointer-events: none;
        }

        .glass-button:hover {
          box-shadow: 0 16px 36px rgba(8, 12, 20, 0.34), inset 0 1px 0 rgba(255, 255, 255, 0.28);
        }

        .next-card {
          display: block;
          padding: 1.75rem 1.9rem;
          border-radius: 1.5rem;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .next-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 28px 48px rgba(8, 13, 23, 0.45);
        }
      `}</style>
    </>
  );
}
