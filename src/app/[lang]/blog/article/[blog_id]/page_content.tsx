"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react";
import HtmlToReact from './HtmlToReact';
import SPALink from '@/components/Common/SPALink';
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { trackEvent } from '@/lib/gtag';
import VoiceFeatureNotice from '@/components/VoiceFeatureNotice';
import { useBlogVisitTracker } from '@/hooks/useBlogVisitTracker';
import { usePlaylistActions, usePlaylistMeta } from '@/components/Context/PlaylistContext';

interface BlogContent {
    title: string;
    html: string;
    pubtime?: string;
    previousArticle?: { _id: string; title: string };
    nextArticle?: { _id: string; title: string };
    voice_commentary?: string;
    visited?: number;
}

interface PageContentProps {
    content: BlogContent;
    lang: 'zh' | 'en';
    blog_id: string;
    hideTitle?: boolean;
    onWeChatClick?: () => void;
}

export default function PageContent({ params }: { params: PageContentProps }) {
    const { content: blog, lang, blog_id, hideTitle = false, onWeChatClick } = params;
    const [visitCount, setVisitCount] = useState<number>(blog.visited || 0);
    const [loadingVisitCount, setLoadingVisitCount] = useState(true);
    const hasVoiceCommentary = blog.voice_commentary && blog.voice_commentary.trim().length > 0;

    // Playlist context for global audio control
    const { playTrack, showPlaylist, loadPlaylist, togglePlay } = usePlaylistActions();
    const { currentTrack, isPlaying: globalIsPlaying } = usePlaylistMeta();
    const isCurrent = currentTrack?._id === blog_id;
    const isPlaying = isCurrent && globalIsPlaying;
    
    // Create a stable fallback pubtime to prevent new Date() from being called repeatedly
    const fallbackPubtime = useMemo(() => new Date().toISOString(), []);
    
    // Track blog visit for analytics
    useBlogVisitTracker(blog_id);

    // Use visit count from server-side fetch (optimized - reduced API calls)
    useEffect(() => {
        // blog.visited now contains the latest visit count from fetchBlogContentWithVisits
        // This eliminates the need for a separate client-side API call in most cases
        setVisitCount(blog.visited || 0);
        setLoadingVisitCount(false);
        
        console.log('Using server-side visit count:', blog.visited, 'for blog:', blog_id);
    }, [blog_id, blog.visited]);

    const handleWeChatClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('WeChat button clicked, showing modal');
        trackEvent.navClick('WeChat Modal Open', 'Article WeChat Button');
        if (onWeChatClick) {
            onWeChatClick();
        }
    };

    // 播放语音评论 - 使用全局播放列表
    const playVoiceCommentary = useCallback(async () => {
        if (hasVoiceCommentary) {
            const voiceBlog = {
                _id: blog_id,
                title: blog.title,
                voice_commentary: blog.voice_commentary!,
                pubtime: blog.pubtime || fallbackPubtime,
                introduction: ''
            };

            await loadPlaylist(lang);
            playTrack(voiceBlog);
            showPlaylist();
            trackEvent.navClick('Voice Commentary Play', `Article: ${blog.title}`);
        }
    }, [hasVoiceCommentary, blog_id, blog.title, blog.voice_commentary, blog.pubtime, fallbackPubtime, playTrack, showPlaylist, loadPlaylist, lang]);

    const handleVoiceCommentary = useCallback(async () => {
        if (!hasVoiceCommentary) return;
        if (isCurrent) {
            togglePlay();
        } else {
            await playVoiceCommentary();
        }
    }, [hasVoiceCommentary, isCurrent, playVoiceCommentary, togglePlay]);

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

    // 使用 PlaylistMeta 直接获取播放状态，无需手动监听音频事件


    return <>
        <div className="max-w-7xl mx-auto overflow-visible">
            {!hideTitle && (
                <>
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
                                        onClick={handleVoiceCommentary}
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
                </>
            )}

        </div>

        <div className='max-w-7xl mx-auto prose-stone prose-xl-invert overflow-y-auto break-words 
                  prose-base prose-gray-300
                  md:prose-xl lg:prose-xl
                  custom-paragraph leading-relaxed
                  relative
                '>

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
                                className="relative z-20 inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
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
            className="max-w-7xl mx-auto mt-8 mb-12 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"

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

    </>
}
