"use client"

import { useLanguage } from "@/components/Context/LanguageContext"
import { replaceCDNDomain } from "@/components/util/util";
import { useScrolling } from "@/components/util/useScrolling"
import Image from 'next/image';

// 标签翻译和图标映射
const getTagDisplay = (tag: { id: number; name: string; color?: string }, lang: 'zh' | 'en') => {
  // 根据标签ID或名称判断类型
  const isLifeTag = tag.id === 2 || tag.name.toLowerCase().includes('life') || tag.name.includes('生活')
  const isTechTag = tag.id === 1 || tag.name.toLowerCase().includes('tech') || tag.name.includes('科技')
  
  // 标签名称翻译
  let displayName = tag.name
  if (isLifeTag) {
    displayName = lang === 'zh' ? '生活' : 'Life'
  } else if (isTechTag) {
    displayName = lang === 'zh' ? '科技' : 'Tech'
  }
  
  // 图标选择
  let icon = null
  if (isLifeTag) {
    // Life icon - heart
    icon = (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
      </svg>
    )
  } else if (isTechTag) {
    // Tech icon - code
    icon = (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    )
  } else {
    // Default tag icon
    icon = (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
      </svg>
    )
  }
  
  return { displayName, icon }
}
import { useState } from 'react';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function MasonryCard({ blog, index }: { blog: any, index: number }) {
    const lang = useLanguage().lang
    const isScrolling = useScrolling(150)
    const [imageLoaded, setImageLoaded] = useState(false);

    // Use preprocessed data from server
    const cover = blog.processedCover || blog.fallbackCover
    const title = (lang === 'en' ? blog.processedTitle?.en : blog.processedTitle?.zh) || blog.title
    const introduction = (lang === 'en' ? blog.processedIntroduction?.en : blog.processedIntroduction?.zh) || blog.introduction
    const isTechArticle = blog.isTechArticle
    const isGradientBackground = cover.startsWith('linear-gradient')
    
    // For gradient backgrounds, mark as loaded immediately
    React.useEffect(() => {
        if (isGradientBackground) {
            setImageLoaded(true);
        }
    }, [isGradientBackground]);

    // figure out if the blog is a life blog
    const tag = (blog.tags || []).length > 0 ? blog.tags[0] : null

    const time = new Date(blog.pubtime).toLocaleDateString(
        lang == 'zh' ? 'zh-CN' : 'en-US'
        , {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        })

    // Calculate dynamic height based on content
    const getTitleLines = () => {
        const length = title.length;
        if (lang === 'en') {
            return Math.ceil(length / 40); // English roughly 40 chars per line
        } else {
            return Math.ceil(length / 20); // Chinese roughly 20 chars per line
        }
    };

    const getIntroLines = () => {
        const length = introduction?.length || 0;
        if (lang === 'en') {
            return Math.min(Math.ceil(length / 50), 4); // Max 4 lines
        } else {
            return Math.min(Math.ceil(length / 25), 4); // Max 4 lines
        }
    };

    return (
        <div className='relative w-full'>
            <div className={`group relative w-full rounded-3xl overflow-hidden
                shadow-xl transition-all duration-700 ease-out
                bg-gradient-to-br from-black/60 via-black/40 to-black/70
                border border-white/20
                ${!isScrolling ? 'hover:shadow-2xl group-hover:from-black/70 group-hover:via-black/50 group-hover:to-black/80 group-hover:border-white/30' : ''}`}>
                
                {/* Dynamic height image/gradient container */}
                <div className={`relative w-full transition-all duration-300 ${imageLoaded || isGradientBackground ? 'opacity-100' : 'opacity-0'}`}
                     style={{ aspectRatio: '4/3' }}>
                    
                    {isGradientBackground ? (
                        // Gradient background for tech articles
                        <div 
                            className="absolute inset-0 rounded-t-3xl"
                            style={{ background: cover }}
                        >
                            {/* Tech article icon overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-white/30 text-6xl md:text-8xl">
                                    <svg className="w-16 h-16 md:w-24 md:h-24" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            
                            {/* Subtle pattern overlay for tech articles */}
                            <div className="absolute inset-0 opacity-10" 
                                style={{
                                    backgroundImage: `repeating-linear-gradient(
                                        45deg,
                                        transparent,
                                        transparent 10px,
                                        rgba(255,255,255,0.1) 10px,
                                        rgba(255,255,255,0.1) 11px
                                    )`
                                }}></div>
                        </div>
                    ) : (
                        // Regular image for life articles
                        <Image
                            src={replaceCDNDomain(cover)}
                            alt={title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            priority={index < 6}
                            onLoad={() => setImageLoaded(true)}
                        />
                    )}
                    
                    {/* Image overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                    
                    {/* Brand badge */}
                    <div className="absolute top-3 left-3 text-white font-bold text-xs tracking-wide uppercase
                        bg-gradient-to-r from-black/70 via-black/60 to-black/70 px-3 py-1 rounded-full border border-white/40
                        shadow-lg transition-all duration-300 backdrop-blur-sm">
                        {isTechArticle ? 'TECH' : 'MOFEI'}
                    </div>
                </div>

                {/* Content area with dynamic height */}
                <div className="p-4 md:p-6" style={{ minHeight: `${4 + getTitleLines() * 1.5 + getIntroLines() * 1.2}rem` }}>
                    
                    {/* Tag */}
                    {tag?.name && (
                        <div className="mb-3">
                            <span className="text-white rounded-full px-3 py-1 font-medium text-xs flex items-center gap-1.5 inline-flex
                                shadow-lg transition-all duration-300 border border-white/30"
                                style={{
                                    background: `linear-gradient(135deg, ${tag?.color || '#f05a54'}80, ${tag?.color || '#f05a54'}60)`,
                                }}>
                                {(() => {
                                    const { displayName, icon } = getTagDisplay(tag, lang as 'zh' | 'en')
                                    return (
                                        <>
                                            {icon}
                                            {displayName}
                                        </>
                                    )
                                })()}
                            </span>
                        </div>
                    )}
                    
                    {/* Title with dynamic sizing */}
                    <h2 className={`font-bold leading-tight mb-3 text-white transition-all duration-300
                        ${lang === 'en' ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'}
                        ${!isScrolling ? 'group-hover:text-gray-50' : ''}`}
                        style={{
                            textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                            lineHeight: '1.4'
                        }}>
                        {title}
                    </h2>
                    
                    {/* Introduction with clamping */}
                    <p className={`leading-relaxed text-gray-100 mb-4 transition-all duration-300
                        ${!isScrolling ? 'group-hover:text-white' : ''}
                        ${lang === 'en' ? 'text-sm md:text-base' : 'text-base md:text-lg'}`}
                        style={{
                            textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                            display: '-webkit-box',
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }}>
                        {introduction}
                    </p>
                    
                    {/* Time */}
                    <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm font-medium transition-all duration-300">
                            {time}
                        </span>
                        <div className={`w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-all duration-300
                            ${!isScrolling ? 'group-hover:bg-white/20' : ''}`}>
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
                
                {/* Hover shimmer effect */}
                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                    -translate-x-full transition-transform duration-1000 ease-out pointer-events-none
                    ${!isScrolling ? 'group-hover:translate-x-full' : ''}`}></div>
            </div>
        </div>
    )
}