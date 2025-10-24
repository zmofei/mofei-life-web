"use client"

import { useCallback, useMemo } from 'react';
import VoiceFeatureNotice from '@/components/VoiceFeatureNotice';
import { usePlaylistActions, usePlaylistMeta } from '@/components/Context/PlaylistContext';
import { trackEvent } from '@/lib/gtag';

interface BlogContent {
  title: string;
  pubtime?: string;
  visited?: number;
  voice_commentary?: string;
}

interface ArticleHeaderProps {
  blog: BlogContent;
  lang: 'zh' | 'en';
  blog_id: string;
  visitCountLabel?: string;
}

export default function ArticleHeader({ blog, lang, blog_id, visitCountLabel }: ArticleHeaderProps) {
  const hasVoiceCommentary = blog.voice_commentary && blog.voice_commentary.trim().length > 0;

  // Playlist context for global audio control
  const { playTrack, showPlaylist, loadPlaylist, togglePlay } = usePlaylistActions();
  const { currentTrack, isPlaying: globalIsPlaying } = usePlaylistMeta();
  const isCurrent = currentTrack?._id === blog_id;
  const isPlaying = isCurrent && globalIsPlaying;
  
  // Create a stable fallback pubtime to prevent new Date() from being called repeatedly
  const fallbackPubtime = useMemo(() => new Date().toISOString(), []);

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

  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      const referrer = document.referrer;
      if (referrer && referrer.includes(window.location.hostname)) {
        window.history.back();
      } else {
        window.location.href = `/${lang}/blog/1`;
      }
    } else {
      window.location.href = `/${lang}/blog/1`;
    }
  };

  return (
    <div className='container max-w-[2000px] m-auto px-5 md:px-10 lg:px-16 xl:px-20 2xl:px-24 pt-20 md:pt-32 pb-8'>
      {/* Back Button and Visit Count */}
      <div className="mb-4 md:mb-6 flex items-center justify-between gap-3">
        <button
          onClick={handleGoBack}
          className="inline-flex items-center gap-2 text-white/80 hover:text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/20 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-xs sm:text-sm font-medium">
            {lang === 'zh' ? '返回' : 'Back'}
          </span>
        </button>

        <div className="inline-flex items-center gap-1.5 sm:gap-2 text-white/70 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg">
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="text-xs font-medium">
            {visitCountLabel ?? (
              <>
                {(blog.visited || 0).toLocaleString()} <span className="hidden xs:inline">{lang === 'zh' ? '次浏览' : 'views'}</span>
              </>
            )}
          </span>
        </div>
      </div>
      {/* Article Title */}
      <div className='font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#a1c4fd] to-[#c2e9fb] text-2xl md:text-5xl lg:text-6xl !leading-tight mb-4'>
        {blog.title}
      </div>
      {/* Publication Date */}
      {blog.pubtime && (
        <div className="mb-4 md:mb-6">
          <div className="inline-flex items-center bg-gray-800/30 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-5 sm:py-2 border border-gray-700/30 shadow-lg">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mr-1.5 sm:mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-gray-400 text-xs sm:text-sm font-medium">
              <span className="hidden xs:inline">{lang === 'zh' ? '发布于 ' : 'Published '}</span>
              {new Date(blog.pubtime).toLocaleDateString(
                lang === 'zh' ? 'zh-CN' : 'en-US',
                {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }
              )}
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
    </div>
  );
}
