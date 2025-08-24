"use client"

import { useLanguage } from "@/components/Context/LanguageContext"
import { replaceCDNDomain } from "@/components/util/util";
import { useScrolling } from "@/components/util/useScrolling"
import { timeUtils } from "@/utils/timeUtils";
import Image from 'next/image';
import { usePlaylist } from '@/components/Context/PlaylistContext';
import { useMemo } from 'react';

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
export default function MasonryCard({ blog, index }: { blog: any, index: number }) {
    const lang = useLanguage().lang
    const isScrolling = useScrolling(150)
    const { playTrack, showPlaylist, togglePlay, currentTrack, isPlaying: globalIsPlaying } = usePlaylist()
    
    // Use preprocessed data from server
    const cover = blog.processedCover || blog.fallbackCover
    const title = (lang === 'en' ? blog.processedTitle?.en : blog.processedTitle?.zh) || blog.title
    const introduction = (lang === 'en' ? blog.processedIntroduction?.en : blog.processedIntroduction?.zh) || blog.introduction
    const isTechArticle = blog.isTechArticle
    const isGradientBackground = cover && cover.startsWith('linear-gradient')
    const hasValidCover = cover && (isGradientBackground || cover.trim().length > 0)
    const hasVoiceCommentary = blog.voice_commentary && blog.voice_commentary.trim().length > 0

    // figure out if the blog is a life blog
    const tag = (blog.tags || []).length > 0 ? blog.tags[0] : null

    const time = timeUtils.toLocaleDateString(blog.pubtime, lang as 'zh' | 'en', {
        weekday: "short",
        year: "numeric",
        month: "short", 
        day: "numeric",
    })

    // Create VoiceBlog object for playlist
    const voiceBlog = useMemo(() => ({
        _id: blog._id,
        title: blog.title,
        voice_commentary: blog.voice_commentary,
        pubtime: blog.pubtime,
        introduction: blog.introduction || ''
    }), [blog._id, blog.title, blog.voice_commentary, blog.pubtime, blog.introduction])

    // Check if this blog is currently playing
    const isCurrentlyPlaying = currentTrack?._id === blog._id && globalIsPlaying

    // 播放语音评论 - 使用全局播放器，支持暂停
    const playVoiceCommentary = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (hasVoiceCommentary) {
            // 如果当前正在播放这个音频，则暂停/恢复
            if (isCurrentlyPlaying) {
                togglePlay()
            } else {
                // 否则播放这个音频
                playTrack(voiceBlog)
                showPlaylist()
            }
        }
    }


    return (
        <div className='relative w-full h-full'>
            <div className={`group relative w-full h-full rounded-3xl overflow-hidden
                shadow-xl transition-all duration-700 ease-out flex flex-col
                bg-gradient-to-br from-black/60 via-black/40 to-black/70
                border border-white/20
                ${!isScrolling ? 'hover:shadow-2xl group-hover:from-black/70 group-hover:via-black/50 group-hover:to-black/80 group-hover:border-white/30' : ''}`}
                style={{ height: '100%', minHeight: '100%', maxHeight: '100%' }}>
                
                {/* Fixed height image/gradient container */}
                <div className="relative w-full h-48 md:h-56 lg:h-64 xl:h-72 overflow-hidden rounded-t-3xl flex-shrink-0 cover-container">
                    
                    {hasValidCover ? (
                        isGradientBackground ? (
                        // Gradient background for tech articles
                        <div 
                            className="absolute inset-0"
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
                        // Regular image for life articles with optimized loading
                        <Image
                            src={replaceCDNDomain(cover)}
                            alt={title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, (max-width: 1600px) 33vw, 25vw"
                            priority={index < 4} // 优化：前4张优先加载
                            loading={index < 4 ? 'eager' : 'lazy'}
                            quality={index < 2 ? 90 : 80} // 前2张更高质量
                            style={{ objectFit: 'cover' }}
                        />
                        )
                    ) : (
                        // Fallback background when no cover is available
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800" />
                    )}
                    
                    {/* Image overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                    
                    {/* Brand badge */}
                    <div className="absolute top-3 left-3 md:top-4 md:left-4 p-1 transition-all duration-300">
                        {isTechArticle ? (
                            <span className="text-white font-bold text-xs tracking-wide uppercase">TECH</span>
                        ) : (
                            <Image
                                src="/img/mofei-logo.svg"
                                alt="Mofei Logo"
                                width={75}
                                height={17}
                                className="opacity-90 hover:opacity-100 transition-opacity duration-300"
                                style={{
                                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2)) drop-shadow(0 0 1px rgba(0,0,0,0.1))'
                                }}
                            />
                        )}
                    </div>
                    
                </div>

                {/* Tag and Voice Commentary - positioned at top right */}
                <div className="absolute top-4 right-4 md:top-5 md:right-5 z-20 flex items-center gap-2">
                    {/* Voice Commentary Button */}
                    {hasVoiceCommentary && (
                        <button
                            onClick={playVoiceCommentary}
                            className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 
                                backdrop-blur-sm hover:scale-110 active:scale-95 outline-none focus:outline-none border-0 overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, rgba(16,185,129,0.8) 0%, rgba(5,150,105,0.9) 50%, rgba(4,120,87,0.8) 100%)',
                                border: '1px solid rgba(16,185,129,0.6)',
                                boxShadow: '0 3px 8px rgba(16,185,129,0.3), 0 0 0 1px rgba(16,185,129,0.2)',
                                WebkitAppearance: 'none',
                                WebkitTapHighlightColor: 'transparent'
                            }}
                            title={isCurrentlyPlaying 
                                ? (lang === 'zh' ? '暂停播放' : 'Pause')
                                : (lang === 'zh' ? '听语音解读' : 'Audio Commentary')
                            }
                        >
{isCurrentlyPlaying ? (
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                                </svg>
                            )}
                        </button>
                    )}
                    
                    {/* Tag */}
                    {tag?.name && (
                        <span className="text-white font-bold text-xs tracking-wide uppercase
                            px-3 py-1 rounded-full transition-all duration-300 flex items-center gap-1.5
                            backdrop-blur-sm"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,183,77,0.6) 0%, rgba(255,154,77,0.7) 50%, rgba(255,120,77,0.6) 100%)',
                                border: '1px solid rgba(255,183,77,0.4)',
                                textShadow: '0 1px 2px rgba(0,0,0,0.6), 0 0 3px rgba(0,0,0,0.3)',
                                boxShadow: '0 3px 8px rgba(255,154,77,0.3), 0 0 0 1px rgba(255,183,77,0.2)'
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
                    )}
                </div>
                
                {/* Content area with padding for absolute positioned bottom */}
                <div className="p-6 md:p-8 pb-24 md:pb-28 flex-1 relative">
                    {/* Title with dynamic sizing */}
                    <h2 className={`font-bold leading-tight mb-4 text-white transition-all duration-300
                        ${lang === 'en' ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'}
                        ${!isScrolling ? 'group-hover:text-gray-50' : ''}`}
                        style={{
                            textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                            lineHeight: '1.4'
                        }}>
                        {title}
                    </h2>
                    
                    {/* Introduction without height restriction */}
                    <p className={`leading-relaxed text-gray-100 transition-all duration-300
                        ${!isScrolling ? 'group-hover:text-white' : ''}
                        ${lang === 'en' ? 'text-sm md:text-base' : 'text-base md:text-lg'}`}
                        style={{
                            textShadow: '0 1px 2px rgba(0,0,0,0.4)'
                        }}>
                        {introduction}
                    </p>
                </div>
                
                {/* Bottom section with time - minimal top border only */}
                <div className="absolute bottom-5 left-5 right-5 md:bottom-7 md:left-7 md:right-7 flex justify-between items-center
                    border-t border-white/10 pt-3 transition-all duration-300">
                    <div className="flex items-center gap-2">
                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-300 text-xs font-normal transition-all duration-300 opacity-80">
                            {time}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-xs font-normal opacity-70">
                            {lang === 'zh' ? '阅读全文' : 'Read More'}
                        </span>
                        <div className={`w-6 h-6 rounded-full bg-white/10 flex items-center justify-center transition-all duration-300
                            ${!isScrolling ? 'group-hover:bg-white/15' : ''}`}>
                            <svg className="w-3 h-3 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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