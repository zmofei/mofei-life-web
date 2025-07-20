"use client"

import React, { useEffect, useCallback } from 'react';
import { usePlaylist } from '@/components/Context/PlaylistContext';
import { useLanguage } from '@/components/Context/LanguageContext';
import { trackEvent } from '@/lib/gtag';
import AudioManager from '@/utils/audioManager';
import SPALink from '@/components/Common/SPALink';

export default function GlobalPlaylist() {
  const { 
    playlist, 
    currentTrack, 
    currentIndex, 
    isPlaylistVisible, 
    isLoading,
    isPlaying,
    currentTime,
    duration,
    isExpanded,
    isMinimized,
    togglePlayerState,
    playTrack, 
    playNext, 
    playPrevious, 
    togglePlay,
    setPlayerState,
    loadPlaylist
  } = usePlaylist();
  
  const { lang } = useLanguage();

  // Load playlist when component mounts
  useEffect(() => {
    loadPlaylist(lang);
  }, [lang, loadPlaylist]);

  // Check audio state function - moved outside useEffect to fix hook rules
  const checkAudioState = useCallback(() => {
    if (!currentTrack) return;
    
    const audioManager = AudioManager.getInstance();
    const currentAudio = audioManager.getCurrentAudio();
    if (currentAudio && currentAudio.src.includes(currentTrack.voice_commentary)) {
      const newState = {
        isPlaying: !currentAudio.paused,
        currentTime: currentAudio.currentTime,
        duration: currentAudio.duration || 0
      };
      
      // Only update if values actually changed to prevent unnecessary re-renders
      if (newState.isPlaying !== isPlaying || 
          Math.abs(newState.currentTime - currentTime) > 0.5 || 
          newState.duration !== duration) {
        setPlayerState(newState);
      }
    }
  }, [currentTrack, isPlaying, currentTime, duration, setPlayerState]);

  // Handle audio events
  useEffect(() => {
    if (!currentTrack) return;

    const audioManager = AudioManager.getInstance();
    const audioSrc = `https://static.mofei.life/${currentTrack.voice_commentary}`;
    
    if (isPlaying) {
      audioManager.play(audioSrc);
    } else {
      audioManager.pause();
    }

    // Initial check
    checkAudioState();
    
    // Set up regular updates with longer interval to reduce rerender frequency
    const interval = setInterval(checkAudioState, 1000);
    
    // Listen to audio events for more responsive updates
    const currentAudio = audioManager.getCurrentAudio();
    if (currentAudio) {
      const handleTimeUpdate = () => checkAudioState();
      const handleLoadedMetadata = () => checkAudioState();
      const handlePlay = () => checkAudioState();
      const handlePause = () => checkAudioState();
      
      currentAudio.addEventListener('timeupdate', handleTimeUpdate);
      currentAudio.addEventListener('loadedmetadata', handleLoadedMetadata);
      currentAudio.addEventListener('play', handlePlay);
      currentAudio.addEventListener('pause', handlePause);
      
      return () => {
        clearInterval(interval);
        currentAudio.removeEventListener('timeupdate', handleTimeUpdate);
        currentAudio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        currentAudio.removeEventListener('play', handlePlay);
        currentAudio.removeEventListener('pause', handlePause);
      };
    }
    
    return () => clearInterval(interval);
  }, [currentTrack, isPlaying, checkAudioState]);

  // Format time display
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!currentTrack || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    const audioManager = AudioManager.getInstance();
    const currentAudio = audioManager.getCurrentAudio();
    if (currentAudio) {
      currentAudio.currentTime = newTime;
    }
  };

  if (!isPlaylistVisible) return null;

  // Minimized mode - just a small floating button
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={togglePlayerState}
          className="w-14 h-14 bg-black/95 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105"
        >
          {isPlaying ? (
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7L8 5z"/>
            </svg>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 bg-black/95 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl overflow-hidden transition-all duration-300 max-h-[60vh] flex flex-col ${
      isExpanded ? 'w-80' : 'w-72'
    }`}>
      {/* Player Header */}
      <div className="px-4 py-3 border-b border-white/10">
        {/* Current Track Title - Full width on its own line */}
        {currentTrack ? (
          <div className="mb-2">
            <h3 className="text-white font-medium text-sm leading-tight">
              {currentTrack.title}
            </h3>
          </div>
        ) : (
          <div className="text-white/60 text-sm mb-2">
            {lang === 'zh' ? '无音频播放' : 'No audio playing'}
          </div>
        )}
        
        <div className="flex items-center gap-2">
          {/* Time Info */}
          <div className="flex-1">
            {currentTrack && (
              <div className="text-white/60 text-xs">
                <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playPrevious();
                trackEvent.navClick('Playlist Previous', 'Global Playlist');
              }}
              disabled={playlist.length <= 1}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z"/>
              </svg>
            </button>

            <button
              onClick={() => {
                togglePlay();
                trackEvent.navClick('Playlist Toggle Play', 'Global Playlist');
              }}
              disabled={!currentTrack}
              className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isPlaying ? (
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7L8 5z"/>
                </svg>
              )}
            </button>

            <button
              onClick={() => {
                playNext();
                trackEvent.navClick('Playlist Next', 'Global Playlist');
              }}
              disabled={playlist.length <= 1}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zm10-12v12h2V6h-2z"/>
              </svg>
            </button>

            <button
              onClick={() => {
                togglePlayerState();
                const action = isMinimized ? 'Expand' : isExpanded ? 'Collapse' : 'Minimize';
                trackEvent.navClick(`${action} Playlist`, 'Global Playlist');
              }}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200"
              title={
                isExpanded 
                  ? (lang === 'zh' ? '收起' : 'Collapse')
                  : (lang === 'zh' ? '最小化' : 'Minimize')
              }
            >
              {isExpanded ? (
                // 展开时显示收起图标（向上箭头）
                <svg className="w-4 h-4 text-white transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                // 收起时显示最小化图标（减号）
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {currentTrack && duration > 0 && (
          <div 
            className="mt-3 h-1.5 bg-white/20 rounded-full cursor-pointer"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-100"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Expandable Playlist */}
      {isExpanded && (
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-white/60 text-sm">
              {lang === 'zh' ? '加载播放列表...' : 'Loading playlist...'}
            </div>
          ) : playlist.length === 0 ? (
            <div className="p-4 text-center text-white/60 text-sm">
              {lang === 'zh' ? '暂无语音文章' : 'No voice articles available'}
            </div>
          ) : (
            <div className="p-2">
              {playlist.map((blog, index) => (
                <div
                  key={blog._id}
                  className={`flex flex-col gap-1 p-3 rounded-lg cursor-pointer transition-all duration-200 mb-2 ${
                    currentIndex === index 
                      ? 'bg-white/20 border border-white/30' 
                      : 'hover:bg-white/10'
                  }`}
                  onClick={() => {
                    playTrack(blog);
                    trackEvent.navClick('Playlist Item Click', `Track: ${blog.title}`);
                  }}
                >
                  {/* Title - Full width without truncation */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {currentIndex === index && isPlaying ? (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7L8 5z"/>
                        </svg>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-sm font-medium leading-tight">
                        {blog.title}
                      </h4>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-white/60 text-xs">
                          {new Date(blog.pubtime).toLocaleDateString(
                            lang === 'zh' ? 'zh-CN' : 'en-US'
                          )}
                        </p>
                        <div className="flex items-center gap-2">
                          <SPALink 
                            href={`/${lang}/blog/article/${blog._id}`}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              trackEvent.navClick('Playlist Article Link', `Article: ${blog.title}`);
                            }}
                            title={lang === 'zh' ? '查看文章' : 'View Article'}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </SPALink>
                          {currentIndex === index && (
                            <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0 animate-pulse" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}