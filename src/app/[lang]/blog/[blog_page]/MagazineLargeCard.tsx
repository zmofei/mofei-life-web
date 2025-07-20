"use client"

import { useLanguage } from "@/components/Context/LanguageContext"
import { replaceCDNDomain } from "@/components/util/util";
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function MagazineLargeCard({ blog, index }: { blog: any, index: number }) {
    const lang = useLanguage().lang

    // Use preprocessed data from server
    const cover = blog.processedCover || blog.fallbackCover
    const title = (lang === 'en' ? blog.processedTitle?.en : blog.processedTitle?.zh) || blog.title
    const introduction = (lang === 'en' ? blog.processedIntroduction?.en : blog.processedIntroduction?.zh) || blog.introduction

    // Check for gradient background and validate cover URL
    const isGradientBackground = cover && cover.startsWith('linear-gradient')
    const hasValidCover = cover && (isGradientBackground || cover.trim().length > 0)

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

    return (
        <div className='relative h-full min-h-[400px] md:min-h-[500px]'>
            <div className={`group relative w-full h-full rounded-3xl 
                shadow-xl hover:shadow-2xl transition-all duration-700 ease-out flex flex-col overflow-hidden`}>
                
                {/* Background image or gradient */}
                {hasValidCover ? (
                    isGradientBackground ? (
                        // Gradient background for tech articles
                        <div 
                            className="absolute inset-0 rounded-3xl"
                            style={{
                                background: cover
                            }}
                        />
                    ) : (
                        // Regular image
                        <Image
                            src={replaceCDNDomain(cover)}
                            alt={title}
                            fill
                            className="object-cover rounded-3xl"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                            priority={index < 2}
                        />
                    )
                ) : (
                    // Fallback background when no cover is available
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800" />
                )}
                
                {/* Glass-like overlay layers */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-[1] pointer-events-none rounded-3xl"></div>
                
                {/* Enhanced border with glass effect */}
                <div className="absolute inset-0 border border-white/20 rounded-3xl z-[3] pointer-events-none
                    shadow-[inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(255,255,255,0.05)]"></div>
                
                {/* Brand badge */}
                <div className="absolute top-5 left-5 text-white font-bold text-xs tracking-[0.2em] uppercase z-20 
                    bg-gradient-to-r from-black/60 via-black/50 to-black/60 px-4 py-2 rounded-full border border-white/40
                    shadow-xl group-hover:shadow-2xl transition-all duration-500
                    drop-shadow-lg group-hover:from-black/70 group-hover:via-black/60 group-hover:to-black/70
                    shadow-[inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.2)]">
                    FEATURED
                </div>

                {/* Content area - positioned at bottom */}
                <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-8">
                    <div className="rounded-2xl p-6 md:p-8 border border-white/30
                        shadow-2xl group-hover:shadow-3xl group-hover:-translate-y-1 
                        transition-all duration-500 ease-out transform relative overflow-hidden
                        bg-gradient-to-br from-black/60 via-black/40 to-black/70
                        group-hover:from-black/70 group-hover:via-black/50 group-hover:to-black/80">
                        
                        {/* Tag */}
                        {tag?.name && (
                            <div className="mb-3">
                                <span className="text-white rounded-full px-3 py-1 font-medium text-xs flex items-center gap-1.5 inline-flex
                                    shadow-xl transition-all duration-500
                                    shadow-[inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.2)]"
                                    style={{
                                        background: `linear-gradient(135deg, ${tag?.color || '#f05a54'}80, ${tag?.color || '#f05a54'}60, ${tag?.color || '#f05a54'}80)`,
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
                        
                        {/* Title - larger for featured cards */}
                        <h2 className={`${lang === 'en' ? 'text-2xl md:text-4xl' : 'text-3xl md:text-5xl'} font-bold leading-tight mb-4
                            text-white group-hover:text-gray-50 transition-all duration-500`}
                            style={{
                                textShadow: '0 2px 4px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3)'
                            }}>
                            {title}
                        </h2>
                        
                        {/* Introduction - more content for large cards */}
                        <p className={`${lang === 'en' ? 'text-base md:text-lg' : 'text-lg md:text-xl'} leading-relaxed text-gray-100 mb-4
                            group-hover:text-white transition-all duration-500`}
                            style={{
                                textShadow: '0 1px 3px rgba(0,0,0,0.4), 0 1px 1px rgba(0,0,0,0.2)'
                            }}>
                            {introduction}
                        </p>
                        
                        {/* Time */}
                        <span className="text-white text-sm font-medium px-4 py-2 rounded-full
                            transition-all duration-500 border border-white/40
                            shadow-xl group-hover:shadow-2xl drop-shadow-lg
                            bg-gradient-to-r from-black/70 via-black/60 to-black/70
                            group-hover:from-black/80 group-hover:via-black/70 group-hover:to-black/80
                            shadow-[inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.2)]">
                            {time}
                        </span>
                        
                        {/* Enhanced shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                            -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out
                            skew-x-12 pointer-events-none rounded-2xl"></div>
                        
                        {/* Glass reflection effect */}
                        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-white/12 to-transparent 
                            rounded-t-2xl pointer-events-none"></div>
                        
                        {/* Inner shadow for depth */}
                        <div className="absolute inset-0 rounded-2xl pointer-events-none
                            shadow-[inset_0_1px_2px_rgba(0,0,0,0.1),inset_0_-1px_2px_rgba(255,255,255,0.05)]"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}