"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react";
import HtmlToReact from './HtmlToReact';
import SPALink from '@/components/Common/SPALink';
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import SimpleReadingProgress from '@/components/util/SimpleReadingProgress';
import { trackEvent } from '@/lib/gtag';
import VoiceFeatureNotice from '@/components/VoiceFeatureNotice';
import AudioManager from '@/utils/audioManager';
import { useBlogVisitTracker } from '@/hooks/useBlogVisitTracker';
import { getBlogVisits } from '@/app/actions/blog';
import { usePlaylist } from '@/components/Context/PlaylistContext';

interface BlogContent {
    title: string;
    html: string;
    pubtime?: string;
    previousArticle?: { _id: string; title: string };
    nextArticle?: { _id: string; title: string };
    voice_commentary?: string;
    visited?: number;
}

export default function PageContent({ params }: { params: { content: BlogContent, lang: 'zh' | 'en', blog_id: string } }) {
    const { content: blog, lang, blog_id } = params;
    const [showWeChatModal, setShowWeChatModal] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [visitCount, setVisitCount] = useState<number>(blog.visited || 0);
    const [loadingVisitCount, setLoadingVisitCount] = useState(true);
    const hasVoiceCommentary = blog.voice_commentary && blog.voice_commentary.trim().length > 0;
    
    // Playlist context for global audio control
    const { playTrack, showPlaylist } = usePlaylist();
    
    // Create a stable fallback pubtime to prevent new Date() from being called repeatedly
    const fallbackPubtime = useMemo(() => new Date().toISOString(), []);
    
    // Track blog visit for analytics
    useBlogVisitTracker(blog_id);

    // Get latest visit count from dedicated API
    useEffect(() => {
        const fetchLatestVisitCount = async () => {
            setLoadingVisitCount(true);
            try {
                const latestCount = await getBlogVisits(blog_id);
                console.log('Latest visit count:', latestCount, 'for blog:', blog_id);
                setVisitCount(latestCount);
            } catch (error) {
                console.warn('Failed to fetch latest visit count:', error);
                // Keep using the initial count from blog content
                setVisitCount(blog.visited || 0);
            } finally {
                setLoadingVisitCount(false);
            }
        };

        // Fetch latest count after component mounts
        fetchLatestVisitCount();
    }, [blog_id, blog.visited]);

    const handleWeChatClick = () => {
        trackEvent.navClick('WeChat Modal Open', 'Article WeChat Button');
        setShowWeChatModal(true);
    };

    const closeModal = () => {
        setShowWeChatModal(false);
    };

    // 播放语音评论 - 使用全局播放列表
    const playVoiceCommentary = useCallback(() => {
        if (hasVoiceCommentary) {
            // Create a VoiceBlog object from current blog data
            const voiceBlog = {
                _id: blog_id,
                title: blog.title,
                voice_commentary: blog.voice_commentary!,
                pubtime: blog.pubtime || fallbackPubtime,
                introduction: ''
            };
            
            // Play this track and show the playlist
            playTrack(voiceBlog);
            showPlaylist();
            trackEvent.navClick('Voice Commentary Play', `Article: ${blog.title}`);
        }
    }, [hasVoiceCommentary, blog_id, blog.title, blog.voice_commentary, blog.pubtime, fallbackPubtime, playTrack, showPlaylist]);

    const stopVoiceCommentary = () => {
        const audioManager = AudioManager.getInstance();
        audioManager.stop();
    };

    // Handle back navigation
    const handleGoBack = () => {
        // Check if user came from within the site
        if (typeof window !== 'undefined' && window.history.length > 1) {
            // Try to go back in browser history
            const referrer = document.referrer;
            if (referrer && referrer.includes(window.location.hostname)) {
                window.history.back();
                trackEvent.navClick('Back Button', 'Article Back - History');
            } else {
                // Fallback to blog list
                window.location.href = `/${lang}/blog/1`;
                trackEvent.navClick('Back Button', 'Article Back - Blog List');
            }
        } else {
            // Fallback to blog list
            window.location.href = `/${lang}/blog/1`;
            trackEvent.navClick('Back Button', 'Article Back - Blog List Fallback');
        }
    };

    // Format publication date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(
            lang === 'zh' ? 'zh-CN' : 'en-US',
            {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }
        );
    };

    // 检查当前音频是否正在播放 - 优化检查频率
    useEffect(() => {
        if (!hasVoiceCommentary) return;
        
        const checkPlayingStatus = () => {
            const audioManager = AudioManager.getInstance();
            const audioSrc = `https://static.mofei.life/${blog.voice_commentary}`;
            const newIsPlaying = audioManager.isPlaying(audioSrc);
            
            // 只在状态真正改变时才更新
            setIsPlaying(prevIsPlaying => {
                if (prevIsPlaying !== newIsPlaying) {
                    return newIsPlaying;
                }
                return prevIsPlaying;
            });
        };
        
        // 减少检查频率，从200ms改为1000ms
        const interval = setInterval(checkPlayingStatus, 1000);
        
        return () => clearInterval(interval);
    }, [hasVoiceCommentary, blog.voice_commentary]);

    return <>
        {/* Simple Reading Progress Bar - tracks .prose-stone element */}
        <SimpleReadingProgress 
          targetSelector=".prose-stone" 
          showPercentage={true} 
        />
        
        <div className="max-w-7xl mx-auto overflow-visible">
            {/* Back Button and Visit Count - 一行布局 */}
            <div className="mb-4 md:mb-6 flex items-center justify-between gap-3">
                {/* Back Button */}
                <button
                    onClick={handleGoBack}
                    className="inline-flex items-center gap-2 text-white/80 hover:text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/20 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                    <ChevronLeftIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-medium">
                        {lang === 'zh' ? '返回' : 'Back'}
                    </span>
                </button>

                {/* Visit Count */}
                <div className="inline-flex items-center gap-1.5 sm:gap-2 text-white/70 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg">
                    <svg className={`w-3 h-3 sm:w-4 sm:h-4 ${loadingVisitCount ? 'animate-pulse' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="text-xs font-medium">
                        {loadingVisitCount ? (
                            <span className="animate-pulse">
                                {lang === 'zh' ? '更新中...' : 'Updating...'}
                            </span>
                        ) : (
                            <>
                                {visitCount.toLocaleString()} <span className="hidden xs:inline">{lang === 'zh' ? '次浏览' : 'views'}</span>
                            </>
                        )}
                    </span>
                </div>
            </div>

            <div className='
                      font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#a1c4fd] to-[#c2e9fb] 
                      text-2xl 
                      md:text-5xl 
                      lg:text-6xl
                      !leading-tight mb-4
                    '

            >
                {blog.title}
            </div>

            {/* Publication date with inline Voice Commentary Button */}
            {blog.pubtime && (
                <div className="mb-4 md:mb-6">
                    <div className="inline-flex items-center bg-gray-800/30 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-5 sm:py-2 border border-gray-700/30 shadow-lg">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mr-1.5 sm:mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-400 text-xs sm:text-sm font-medium">
                            <span className="hidden xs:inline">{lang === 'zh' ? '发布于 ' : 'Published '}</span>
                            {formatDate(blog.pubtime)}
                        </span>
                    </div>
                    
                    {/* Voice Commentary Button - inline after publication date */}
                    {hasVoiceCommentary && (
                        <VoiceFeatureNotice lang={lang} hasVoiceCommentary={!!hasVoiceCommentary}>
                            <button
                                onClick={isPlaying ? stopVoiceCommentary : playVoiceCommentary}
                                className="inline-flex items-center gap-1 sm:gap-1.5 text-white font-medium rounded-full px-2 py-1 sm:px-3 sm:py-1.5 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border backdrop-blur-sm ml-2 sm:ml-3 align-middle text-xs sm:text-sm"
                                style={{
                                    background: isPlaying 
                                        ? 'linear-gradient(135deg, rgba(239,68,68,0.9) 0%, rgba(220,38,38,0.9) 100%)'
                                        : 'linear-gradient(135deg, rgba(16,185,129,0.9) 0%, rgba(5,150,105,0.9) 100%)',
                                    boxShadow: isPlaying 
                                        ? '0 2px 8px rgba(239,68,68,0.3), 0 0 0 1px rgba(239,68,68,0.2)'
                                        : '0 2px 8px rgba(16,185,129,0.3), 0 0 0 1px rgba(16,185,129,0.2)',
                                    borderColor: isPlaying 
                                        ? 'rgba(239,68,68,0.3)'
                                        : 'rgba(16,185,129,0.3)'
                                }}
                            >
                                {isPlaying ? (
                                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                                    </svg>
                                ) : (
                                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                                    </svg>
                                )}
                                <span className="font-medium">
                                    {isPlaying 
                                        ? (lang === 'zh' ? '停止' : 'Stop')
                                        : (lang === 'zh' ? '🎙️ 听解读' : '🎙️ Commentary')}
                                </span>
                            </button>
                        </VoiceFeatureNotice>
                    )}
                </div>
            )}
        </div>
        <div className='max-w-7xl mx-auto prose-stone prose-xl-invert overflow-y-auto break-words 
                  prose-base prose-gray-300
                  md:prose-xl lg:prose-xl
                  custom-paragraph leading-relaxed
                  bg-white/10 backdrop-blur-lg rounded-xl md:rounded-2xl 
                  p-3 py-4 md:p-8 md:py-6 lg:p-8
                  mx-2 md:mx-auto
                  shadow-2xl md:hover:shadow-3xl transition-all duration-300 md:duration-500
                  relative group overflow-hidden
                '
            style={{
                border: '1px solid rgba(255, 255, 255, 0.18)',
                borderTop: '1px solid rgba(255, 255, 255, 0.25)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.22)'
            }}

        >
            {/* Glass effect overlays */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-xl md:rounded-2xl"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5 pointer-events-none rounded-xl md:rounded-2xl"></div>

            {/* Inner glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/3 via-transparent to-white/2 pointer-events-none rounded-xl md:rounded-2xl"></div>

            {/* Glass border reflections */}
            <div className="absolute inset-0 rounded-xl md:rounded-2xl pointer-events-none" style={{
                background: `linear-gradient(135deg, 
                    rgba(255,255,255,0.15) 0%, 
                    transparent 20%, 
                    transparent 80%, 
                    rgba(255,255,255,0.08) 100%)`
            }}></div>

            {/* Top edge highlight */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-t-xl md:rounded-t-2xl pointer-events-none"></div>

            {/* Left edge highlight */}
            <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-white/8 via-white/5 to-transparent rounded-l-xl md:rounded-l-2xl pointer-events-none"></div>

            {/* Bottom right subtle reflection */}
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-white/3 to-transparent rounded-br-xl md:rounded-br-2xl pointer-events-none"></div>

            {/* Soft directional light */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-white/4 to-transparent rounded-tl-xl md:rounded-tl-2xl pointer-events-none"></div>

            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent 
                -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out
                skew-x-12 pointer-events-none rounded-xl md:rounded-2xl"></div>

            <div className="relative z-10">
                {(() => {
                    try {
                        // 使用 HtmlToReact 进行渲染，添加稳定的key防止重复渲染
                        return <HtmlToReact key={blog_id} htmlString={blog.html} />;
                    } catch (error) {
                        console.error("HtmlToReact failed:", error);
                        // HtmlToReact 渲染失败时回退到 dangerouslySetInnerHTML
                        return <div key={blog_id} dangerouslySetInnerHTML={{ __html: blog.html }} />;
                    }
                })()}

                {/* WeChat Follow button - Only for Chinese */}
                {lang === 'zh' && (
                    <div className="mt-12 pt-8 border-t border-gray-600/30 text-center">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-white mb-3">
                                📱 喜欢这篇文章？
                            </h3>
                            <p className="text-gray-400 text-sm mb-6">
                                博客文章会第一时间发布，然后按类型同步到对应公众号
                            </p>
                            <button
                                onClick={handleWeChatClick}
                                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                                </svg>
                                关注公众号
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>

        <div className="text-center my-12 md:my-16"

        >
            <div className="inline-flex items-center justify-center gap-4 md:gap-6 bg-white/10 backdrop-blur-lg
                rounded-full px-6 py-3 md:px-8 md:py-4 border border-white/20 shadow-xl 
                md:hover:shadow-2xl transition-all duration-300 relative group overflow-hidden">

                {/* Glass effect overlays */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-full"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5 pointer-events-none rounded-full"></div>

                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                    -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out
                    skew-x-12 pointer-events-none rounded-full"></div>

                {/* THE END */}
                <div className="flex items-center">
                    <Image src="/article/start.png" alt="" className="w-5 md:w-6 mr-2 opacity-70" width={24} height={24} />
                    <span className="text-sm md:text-base font-medium text-gray-300 tracking-wider">THE END</span>
                </div>

                {/* Separator */}
                <div className="w-px h-6 bg-gray-600/50"></div>

                {/* Comment CTA */}
                <button
                    onClick={() => {
                        const commentsSection = document.querySelector('#comments-section');
                        if (commentsSection) {
                            commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }}
                    className="group flex items-center md:hover:opacity-90 transition-all duration-300"
                >
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-400 mr-2 group-hover:text-blue-300 transition-colors"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-sm md:text-base font-medium text-blue-300 group-hover:text-blue-200 transition-colors">
                        {lang === 'zh' ? '要评论吗？' : 'Comment?'}
                    </span>
                </button>
            </div>
        </div>

        {/* Navigation - outside of reading progress tracking */}
        {(blog.previousArticle?._id || blog.nextArticle?._id) && <div
            className="max-w-7xl mx-auto mt-8 mb-12 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 px-2 md:px-6 lg:px-8"

        >
            {blog.previousArticle?._id && (
                <SPALink href={`/${lang}/blog/article/${blog.previousArticle._id}`}
                    className="group block p-4 rounded-xl bg-white/10 backdrop-blur-lg
                            md:hover:bg-white/15 transition-all duration-300 
                            border border-white/20 hover:border-white/30 hover:shadow-lg hover:opacity-90
                            relative overflow-hidden"
                    title={blog.previousArticle.title}>
                    {/* Glass effect overlays */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5 pointer-events-none rounded-xl"></div>

                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent 
                            -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out
                            skew-x-12 pointer-events-none rounded-xl"></div>

                    <div className="flex items-center space-x-3 relative z-10">
                        <div className="flex-shrink-0">
                            <ChevronLeftIcon className="size-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs text-blue-400 font-medium mb-1 uppercase tracking-wider">
                                {lang == 'zh' ? '上一篇' : 'Previous'}
                            </div>
                            <div className="text-gray-200 group-hover:text-white transition-colors truncate font-medium">
                                {blog.previousArticle?.title}
                            </div>
                        </div>
                    </div>
                </SPALink>
            )}
            {/* nextArticle */}
            {blog.nextArticle?._id && (
                <SPALink href={`/${lang}/blog/article/${blog.nextArticle._id}`}
                    className="group block p-4 rounded-xl bg-white/10 backdrop-blur-lg
                            md:hover:bg-white/15 transition-all duration-300 
                            border border-white/20 hover:border-white/30 hover:shadow-lg hover:opacity-90
                            relative overflow-hidden"
                    title={blog.nextArticle.title}>
                    {/* Glass effect overlays */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5 pointer-events-none rounded-xl"></div>

                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent 
                            -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out
                            skew-x-12 pointer-events-none rounded-xl"></div>

                    <div className="flex items-center space-x-3 md:flex-row-reverse md:space-x-reverse md:space-x-3 md:text-right relative z-10">
                        <div className="flex-shrink-0">
                            <ChevronRightIcon className="size-6 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs text-emerald-400 font-medium mb-1 uppercase tracking-wider">
                                {lang == 'zh' ? '下一篇' : 'Next'}
                            </div>
                            <div className="text-gray-200 group-hover:text-white transition-colors truncate font-medium">
                                {blog.nextArticle?.title}
                            </div>
                        </div>
                    </div>
                </SPALink>
            )}
        </div>}

        {/* WeChat Modal */}
        {showWeChatModal && (
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center p-3 md:p-6" 
                onClick={closeModal}
                style={{ 
                    position: 'fixed', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    width: '100vw', 
                    height: '100vh',
                    zIndex: 999999,
                    margin: 0,
                    transform: 'none'
                }}>
                <div
                    className="relative w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto rounded-2xl md:rounded-3xl p-3 sm:p-4 md:p-8 group"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.95) 100%)',
                        backdropFilter: 'blur(20px) saturate(200%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(200%)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        borderTop: '1px solid rgba(255,255,255,0.6)',
                        borderLeft: '1px solid rgba(255,255,255,0.4)',
                        boxShadow: '0 32px 64px rgba(0,0,0,0.2), 0 16px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Glass effect overlays */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none rounded-3xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/20 pointer-events-none rounded-3xl"></div>

                    {/* Top edge highlight */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-t-3xl pointer-events-none"></div>

                    {/* Left edge highlight */}
                    <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-white/30 via-white/20 to-transparent rounded-l-3xl pointer-events-none"></div>

                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                        -translate-x-full group-hover:translate-x-full transition-transform duration-1500 ease-out
                        skew-x-12 pointer-events-none rounded-3xl"></div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-4 md:mb-6">
                            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                {lang === 'zh' ? '关注我的公众号' : 'Follow My WeChat Accounts'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-gray-600 hover:text-gray-800 hover:bg-white/40 active:bg-white/50 active:scale-95 transition-all duration-200 text-lg md:text-xl shadow-lg hover:shadow-xl"
                            >
                                ×
                            </button>
                        </div>

                        {/* Mobile: Single column, Desktop: Two columns */}
                        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 md:gap-6">
                            {/* Life WeChat Account */}
                            <div className="relative rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 group overflow-hidden"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.1) 100%)',
                                    backdropFilter: 'blur(10px) saturate(150%)',
                                    WebkitBackdropFilter: 'blur(10px) saturate(150%)',
                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                    borderTop: '1px solid rgba(239, 68, 68, 0.3)',
                                    boxShadow: '0 8px 32px rgba(239, 68, 68, 0.1), inset 0 1px 0 rgba(255,255,255,0.3)'
                                }}>
                                {/* Glass effect overlays */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-xl md:rounded-2xl"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-red-500/5 via-transparent to-white/10 pointer-events-none rounded-xl md:rounded-2xl"></div>

                                <div className="relative z-10 text-center">
                                    {/* Mobile: Simplified layout */}
                                    <div className="md:hidden">
                                        <div className="flex items-center justify-center gap-3 mb-3">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg flex-shrink-0"
                                                style={{
                                                    background: 'rgba(255,255,255,0.9)',
                                                    border: '1px solid rgba(239, 68, 68, 0.2)'
                                                }}>
                                                <Image
                                                    src="/img/qrcode_life.jpg"
                                                    alt={lang === 'zh' ? '生活公众号二维码' : 'Life WeChat QR Code'}
                                                    width={64}
                                                    height={64}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 mb-1">
                                                    <span>👨‍👩‍👧‍👦</span>
                                                    <span>{lang === 'zh' ? '生活' : 'LIFE'}</span>
                                                </div>
                                                <h3 className="text-sm font-bold text-red-700 leading-tight">
                                                    {lang === 'zh' ? '疯狂的超级奶爸在北欧' : 'Nordic Super Dad'}
                                                </h3>
                                                <p className="text-xs text-red-600">
                                                    {lang === 'zh' ? '芬兰生活分享' : 'Life in Finland'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Desktop: Full layout */}
                                    <div className="hidden md:block">
                                        <div className="flex justify-center mb-3 md:mb-4">
                                            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold shadow-lg flex items-center gap-2 backdrop-blur-sm border border-red-400/30">
                                                <span>👨‍👩‍👧‍👦</span>
                                                <span>{lang === 'zh' ? '生活公众号' : 'LIFE ACCOUNT'}</span>
                                            </div>
                                        </div>

                                        <div className="mb-3 md:mb-4">
                                            <h3 className="text-lg md:text-xl font-bold text-red-700 mb-1 leading-tight">
                                                {lang === 'zh' ? '疯狂的超级奶爸在北欧' : 'Nordic Super Dad'}
                                            </h3>
                                            <p className="text-red-600 text-xs md:text-sm font-medium">
                                                {lang === 'zh' ? '家庭生活 • 育儿日常 • 北欧生活' : 'Family Life • Parenting • Nordic Living'}
                                            </p>
                                        </div>

                                        <div className="mb-3 md:mb-4">
                                            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-40 md:h-40 lg:w-48 lg:h-48 mx-auto rounded-xl md:rounded-2xl overflow-hidden shadow-2xl relative"
                                                style={{
                                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                                                    backdropFilter: 'blur(10px)',
                                                    border: '2px solid rgba(239, 68, 68, 0.2)',
                                                    borderTop: '2px solid rgba(239, 68, 68, 0.3)'
                                                }}>
                                                <Image
                                                    src="/img/qrcode_life.jpg"
                                                    alt={lang === 'zh' ? '生活公众号二维码' : 'Life WeChat QR Code'}
                                                    width={192}
                                                    height={192}
                                                    className="w-full h-full object-cover rounded-xl"
                                                />
                                            </div>
                                        </div>

                                        <div className="rounded-xl p-2 md:p-3"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.4) 100%)',
                                                backdropFilter: 'blur(8px)',
                                                border: '1px solid rgba(239, 68, 68, 0.1)'
                                            }}>
                                            <p className="text-red-700 font-medium text-xs md:text-sm mb-1 flex items-center justify-center gap-2">
                                                <span>🏠</span>
                                                {lang === 'zh' ? '芬兰生活分享' : 'Life in Finland'}
                                            </p>
                                            <p className="text-gray-600 text-xs leading-relaxed">
                                                {lang === 'zh'
                                                    ? '分享在芬兰的日常生活、育儿心得和教育体验，探索北欧独特魅力'
                                                    : 'Daily life, parenting insights and educational experiences in the Nordic region'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tech WeChat Account */}
                            <div className="relative rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 group overflow-hidden"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%)',
                                    backdropFilter: 'blur(10px) saturate(150%)',
                                    WebkitBackdropFilter: 'blur(10px) saturate(150%)',
                                    border: '1px solid rgba(59, 130, 246, 0.2)',
                                    borderTop: '1px solid rgba(59, 130, 246, 0.3)',
                                    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.1), inset 0 1px 0 rgba(255,255,255,0.3)'
                                }}>
                                {/* Glass effect overlays */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-xl md:rounded-2xl"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 via-transparent to-white/10 pointer-events-none rounded-xl md:rounded-2xl"></div>

                                <div className="relative z-10 text-center">
                                    {/* Mobile: Simplified layout */}
                                    <div className="md:hidden">
                                        <div className="flex items-center justify-center gap-3 mb-3">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg flex-shrink-0"
                                                style={{
                                                    background: 'rgba(255,255,255,0.9)',
                                                    border: '1px solid rgba(59, 130, 246, 0.2)'
                                                }}>
                                                <Image
                                                    src="/img/qrcode_tech.jpg"
                                                    alt={lang === 'zh' ? '技术公众号二维码' : 'Tech WeChat QR Code'}
                                                    width={64}
                                                    height={64}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 mb-1">
                                                    <span>👨‍💻</span>
                                                    <span>{lang === 'zh' ? '技术' : 'TECH'}</span>
                                                </div>
                                                <h3 className="text-sm font-bold text-blue-700 leading-tight">
                                                    {lang === 'zh' ? 'Mofie' : 'Mofie Tech'}
                                                </h3>
                                                <p className="text-xs text-blue-600">
                                                    {lang === 'zh' ? '技术灵感与实战' : 'Tech Insights'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Desktop: Full layout */}
                                    <div className="hidden md:block">
                                        <div className="flex justify-center mb-3 md:mb-4">
                                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold shadow-lg flex items-center gap-2 backdrop-blur-sm border border-blue-400/30">
                                                <span>👨‍💻</span>
                                                <span>{lang === 'zh' ? '技术公众号' : 'TECH ACCOUNT'}</span>
                                            </div>
                                        </div>

                                        <div className="mb-3 md:mb-4">
                                            <h3 className="text-lg md:text-xl font-bold text-blue-700 mb-1 leading-tight">
                                                {lang === 'zh' ? 'Mofie' : 'Mofie Tech'}
                                            </h3>
                                            <p className="text-blue-600 text-xs md:text-sm font-medium">
                                                {lang === 'zh' ? '前端开发 • AI技术 • 编程经验' : 'Frontend • AI • Dev Experience'}
                                            </p>
                                        </div>

                                        <div className="mb-3 md:mb-4">
                                            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-40 md:h-40 lg:w-48 lg:h-48 mx-auto rounded-xl md:rounded-2xl overflow-hidden shadow-2xl relative"
                                                style={{
                                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                                                    backdropFilter: 'blur(10px)',
                                                    border: '2px solid rgba(59, 130, 246, 0.2)',
                                                    borderTop: '2px solid rgba(59, 130, 246, 0.3)'
                                                }}>
                                                <Image
                                                    src="/img/qrcode_tech.jpg"
                                                    alt={lang === 'zh' ? '技术公众号二维码' : 'Tech WeChat QR Code'}
                                                    width={192}
                                                    height={192}
                                                    className="w-full h-full object-cover rounded-xl"
                                                />
                                            </div>
                                        </div>

                                        <div className="rounded-xl p-2 md:p-3"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.4) 100%)',
                                                backdropFilter: 'blur(8px)',
                                                border: '1px solid rgba(59, 130, 246, 0.1)'
                                            }}>
                                            <p className="text-blue-700 font-medium text-xs md:text-sm mb-1 flex items-center justify-center gap-2">
                                                <span>🚀</span>
                                                {lang === 'zh' ? '技术灵感与实战' : 'Tech Insights & Practice'}
                                            </p>
                                            <p className="text-gray-600 text-xs leading-relaxed">
                                                {lang === 'zh'
                                                    ? '十几年互联网老兵，记录前端、后端、大数据、AI技术经验'
                                                    : 'Veteran developer sharing frontend, backend, big data, and AI experiences'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 md:mt-6 space-y-3">
                            <div className="rounded-xl p-3 md:p-4 relative overflow-hidden"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 100%)',
                                    backdropFilter: 'blur(10px) saturate(150%)',
                                    WebkitBackdropFilter: 'blur(10px) saturate(150%)',
                                    border: '1px solid rgba(255,255,255,0.4)',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)'
                                }}>
                                <div className="flex items-start gap-3 relative z-10">
                                    <div className="w-5 h-5 md:w-6 md:h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg">
                                        <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-gray-700 text-sm md:text-base font-medium mb-1">
                                            {lang === 'zh' ? '🚀 博客内容第一时间更新' : '🚀 Blog Content Updated First'}
                                        </p>
                                        <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                                            {lang === 'zh'
                                                ? '本博客的最新文章会第一时间发布，随后按照内容类型分别同步到对应的公众号：生活感悟类文章发布到生活公众号，技术开发类文章发布到技术公众号。'
                                                : 'Latest blog articles are published here first, then distributed by content type: life insights go to the Life WeChat account, and technical development articles go to the Tech WeChat account.'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center space-y-2 relative z-10">
                                <p className="text-gray-600 text-sm md:text-base font-medium">
                                    {lang === 'zh'
                                        ? '扫描二维码关注公众号，获取更多精彩内容'
                                        : 'Scan QR code with WeChat to follow and get more content'}
                                </p>
                                {lang === 'en' && (
                                    <div className="rounded-xl p-3 text-left"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
                                            backdropFilter: 'blur(8px)',
                                            border: '1px solid rgba(59, 130, 246, 0.2)'
                                        }}>
                                        <p className="text-blue-700 font-medium text-xs mb-1">📱 New to WeChat?</p>
                                        <p className="text-blue-600 text-xs leading-relaxed">
                                            WeChat is China&apos;s most popular messaging app. Download it from your app store,
                                            then use the scan feature to follow these accounts for exclusive content.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </>
}
