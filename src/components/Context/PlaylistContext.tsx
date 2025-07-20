"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { fetchVoiceBlogList } from '@/app/actions/blog';

interface VoiceBlog {
  _id: string;
  title: string;
  voice_commentary: string;
  pubtime: string;
  introduction?: string;
}

interface PlaylistContextType {
  // Playlist state
  playlist: VoiceBlog[];
  currentTrack: VoiceBlog | null;
  currentIndex: number;
  isPlaylistVisible: boolean;
  isLoading: boolean;
  
  // Player state
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isExpanded: boolean;
  isMinimized: boolean;
  
  // Actions
  showPlaylist: () => void;
  hidePlaylist: () => void;
  togglePlaylist: () => void;
  toggleExpanded: () => void;
  toggleMinimized: () => void;
  togglePlayerState: () => void;
  playTrack: (blog: VoiceBlog) => void;
  playNext: () => void;
  playPrevious: () => void;
  togglePlay: () => void;
  loadPlaylist: (lang: string) => void;
  setPlayerState: (state: { isPlaying?: boolean; currentTime?: number; duration?: number }) => void;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export function usePlaylist() {
  const context = useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error('usePlaylist must be used within a PlaylistProvider');
  }
  return context;
}

interface PlaylistProviderProps {
  children: ReactNode;
}

export function PlaylistProvider({ children }: PlaylistProviderProps) {
  const [playlist, setPlaylist] = useState<VoiceBlog[]>([]);
  const [currentTrack, setCurrentTrack] = useState<VoiceBlog | null>(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaylistVisible, setIsPlaylistVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  // Load playlist from API
  const loadPlaylist = useCallback(async (lang: string) => {
    if (playlist.length > 0) return; // Don't reload if already loaded
    
    setIsLoading(true);
    try {
      // Load first few pages to get a good playlist
      const results = await Promise.all([
        fetchVoiceBlogList(1, lang),
        fetchVoiceBlogList(2, lang),
        fetchVoiceBlogList(3, lang)
      ]);
      
      const allBlogs: VoiceBlog[] = [];
      results.forEach(result => {
        allBlogs.push(...result.list);
      });
      
      // Filter out blogs without voice commentary
      const voiceBlogs = allBlogs.filter(blog => blog.voice_commentary);
      setPlaylist(voiceBlogs);
    } catch (error) {
      console.error('Failed to load voice playlist:', error);
    } finally {
      setIsLoading(false);
    }
  }, [playlist.length]);

  // Show/hide playlist
  const showPlaylist = useCallback(() => setIsPlaylistVisible(true), []);
  const hidePlaylist = useCallback(() => setIsPlaylistVisible(false), []);
  const togglePlaylist = useCallback(() => setIsPlaylistVisible(prev => !prev), []);
  const toggleExpanded = useCallback(() => setIsExpanded(prev => !prev), []);
  const toggleMinimized = useCallback(() => setIsMinimized(prev => !prev), []);
  
  // Combined toggle: expanded -> collapsed -> minimized -> expanded
  const togglePlayerState = useCallback(() => {
    if (isMinimized) {
      // minimized -> expanded
      setIsMinimized(false);
      setIsExpanded(true);
    } else if (isExpanded) {
      // expanded -> collapsed
      setIsExpanded(false);
    } else {
      // collapsed -> minimized
      setIsMinimized(true);
    }
  }, [isExpanded, isMinimized]);

  // Play specific track
  const playTrack = useCallback((blog: VoiceBlog) => {
    const index = playlist.findIndex(item => item._id === blog._id);
    if (index !== -1) {
      setCurrentTrack(blog);
      setCurrentIndex(index);
      setIsPlaying(true);
      if (!isPlaylistVisible) {
        setIsPlaylistVisible(true);
      }
    }
  }, [playlist, isPlaylistVisible]);

  // Play next track
  const playNext = useCallback(() => {
    if (playlist.length === 0) return;
    const nextIndex = (currentIndex + 1) % playlist.length;
    const nextTrack = playlist[nextIndex];
    setCurrentTrack(nextTrack);
    setCurrentIndex(nextIndex);
  }, [playlist, currentIndex]);

  // Play previous track
  const playPrevious = useCallback(() => {
    if (playlist.length === 0) return;
    const prevIndex = currentIndex <= 0 ? playlist.length - 1 : currentIndex - 1;
    const prevTrack = playlist[prevIndex];
    setCurrentTrack(prevTrack);
    setCurrentIndex(prevIndex);
  }, [playlist, currentIndex]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  // Set player state
  const setPlayerState = useCallback((state: { isPlaying?: boolean; currentTime?: number; duration?: number }) => {
    if (state.isPlaying !== undefined) setIsPlaying(state.isPlaying);
    if (state.currentTime !== undefined) setCurrentTime(state.currentTime);
    if (state.duration !== undefined) setDuration(state.duration);
  }, []);

  const value: PlaylistContextType = {
    // Playlist state
    playlist,
    currentTrack,
    currentIndex,
    isPlaylistVisible,
    isLoading,
    
    // Player state
    isPlaying,
    currentTime,
    duration,
    isExpanded,
    isMinimized,
    
    // Actions
    showPlaylist,
    hidePlaylist,
    togglePlaylist,
    toggleExpanded,
    toggleMinimized,
    togglePlayerState,
    playTrack,
    playNext,
    playPrevious,
    togglePlay,
    loadPlaylist,
    setPlayerState,
  };

  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  );
}