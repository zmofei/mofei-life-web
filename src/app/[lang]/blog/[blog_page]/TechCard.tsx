"use client"

import { useLanguage } from "@/components/Context/LanguageContext"
import { useScrolling } from "@/components/util/useScrolling"
import Image from 'next/image'
import { usePlaylistActions, usePlaylistMeta } from '@/components/Context/PlaylistContext'
import { useMemo } from 'react'

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
export default function TechCard({ blog }: { blog: any; index: number }) {
    const lang = useLanguage().lang
    const isScrolling = useScrolling(150)
    const { playTrack, showPlaylist, togglePlay, loadPlaylist } = usePlaylistActions()
    const { currentTrack, isPlaying: globalIsPlaying } = usePlaylistMeta()

    // Use preprocessed data from server
    const title = (lang === 'en' ? blog.processedTitle?.en : blog.processedTitle?.zh) || blog.title
    const introduction = (lang === 'en' ? blog.processedIntroduction?.en : blog.processedIntroduction?.zh) || blog.introduction
    const hasVoiceCommentary = blog.voice_commentary && blog.voice_commentary.trim().length > 0

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
    const playVoiceCommentary = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (hasVoiceCommentary) {
            // 如果当前正在播放这个音频，则暂停/恢复
            if (isCurrentlyPlaying) {
                togglePlay()
            } else {
                // 否则播放这个音频
                await loadPlaylist(lang)
                playTrack(voiceBlog)
                showPlaylist()
            }
        }
    }

    return (
        <div className='relative w-full h-full'>
            <div className="group relative w-full h-full rounded-3xl overflow-hidden
                shadow-xl transition-transform duration-300 ease-out
                bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
                border border-slate-700/50 flex flex-col
                transform-gpu hover:-translate-y-0.5">

                {/* Header with tech badge and title - 更加大气的头部 */}
                <div className="p-6 md:p-8 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 
                    relative overflow-hidden h-48 md:h-56 lg:h-64 xl:h-72 flex-shrink-0 flex flex-col justify-center">

                    {/* 背景装饰元素 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
                    <div className="absolute top-0 left-0 w-full h-full">
                        <div className="absolute top-4 right-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
                        <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>
                    </div>

                    {/* MOFEI badge - positioned at top like life articles */}
                    <div className="absolute top-3 left-3 md:top-4 md:left-4 p-1 transition-all duration-300 z-20">
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
                    </div>


                    <div className="relative z-10 flex flex-col justify-center h-full">
                        {/* Title in header - 更大气的标题 */}
                        <h2 className={`font-bold leading-tight text-white text-left
                            ${lang === 'en' ? 'text-lg md:text-xl lg:text-2xl' : 'text-xl md:text-2xl lg:text-3xl'}`}
                            style={{
                                textShadow: '0 2px 8px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)'
                            }}>
                            {title}
                        </h2>
                    </div>

                    {/* 头部闪光效果 */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                        -translate-x-full transition-transform duration-1500 ease-out pointer-events-none
                        ${!isScrolling ? 'group-hover:translate-x-full' : ''}`}></div>
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
                            bg-gradient-to-r from-white/20 via-white/15 to-white/20 px-3 py-1 rounded-full 
                            border border-white/40 shadow-lg transition-all duration-300 flex items-center gap-1.5">
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
                
                {/* Main content area - 更宽松的内容区域 */}
                <div className="p-6 md:p-8 pb-24 md:pb-28 flex-1 relative">
                    {/* Introduction without height restriction */}
                    <p className={`leading-relaxed text-slate-300 transition-all duration-300
                        ${lang === 'en' ? 'text-base md:text-lg' : 'text-lg md:text-xl'}
                        ${!isScrolling ? 'group-hover:text-slate-200' : ''}`}>
                        {introduction}
                    </p>
                </div>

                {/* Bottom section with time - minimal top border only */}
                <div className="absolute bottom-5 left-5 right-5 md:bottom-7 md:left-7 md:right-7 flex justify-between items-center
                    border-t border-slate-600/30 pt-3 transition-all duration-300">
                    <div className="flex items-center gap-2">
                        <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-slate-400 text-xs font-normal transition-all duration-300 opacity-80">
                            {time}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-xs font-normal opacity-70">
                            {lang === 'zh' ? '阅读全文' : 'Read More'}
                        </span>
                        <div className={`w-6 h-6 rounded-full bg-slate-600/30 flex items-center justify-center transition-all duration-300
                            ${!isScrolling ? 'group-hover:bg-slate-600/40' : ''}`}>
                            <svg className="w-3 h-3 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* 整体光效 */}
                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/3 to-transparent 
                    -translate-x-full transition-transform duration-1200 ease-out pointer-events-none rounded-3xl
                    ${!isScrolling ? 'group-hover:translate-x-full' : ''}`}></div>

                {/* 边缘光晕 */}
                <div className={`absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-700
                    shadow-[0_0_30px_rgba(59,130,246,0.3)] pointer-events-none
                    ${!isScrolling ? 'group-hover:opacity-100' : ''}`}></div>
            </div>
        </div>
    )
}
