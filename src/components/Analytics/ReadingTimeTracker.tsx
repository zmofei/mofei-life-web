"use client"
import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/gtag';

interface ReadingTimeTrackerProps {
  articleId: string;
  articleTitle: string;
}

export default function ReadingTimeTracker({ articleId, articleTitle }: ReadingTimeTrackerProps) {
  const startTimeRef = useRef<number>(Date.now());
  const hasTracked25Ref = useRef(false);
  const hasTracked50Ref = useRef(false);
  const hasTracked75Ref = useRef(false);
  const hasTracked100Ref = useRef(false);

  useEffect(() => {
    startTimeRef.current = Date.now();
    
    // Track article view event
    trackEvent.articleView(articleId, articleTitle);

    const trackReadingProgress = () => {
      const readTime = Math.round((Date.now() - startTimeRef.current) / 1000);
      
      // Track reading progress by time intervals
      if (readTime >= 15 && !hasTracked25Ref.current) {
        trackEvent.articleReadTime(articleId, 15);
        hasTracked25Ref.current = true;
      } else if (readTime >= 30 && !hasTracked50Ref.current) {
        trackEvent.articleReadTime(articleId, 30);
        hasTracked50Ref.current = true;
      } else if (readTime >= 60 && !hasTracked75Ref.current) {
        trackEvent.articleReadTime(articleId, 60);
        hasTracked75Ref.current = true;
      } else if (readTime >= 120 && !hasTracked100Ref.current) {
        trackEvent.articleReadTime(articleId, 120);
        hasTracked100Ref.current = true;
      }
    };

    // Check reading progress every 5 seconds
    const interval = setInterval(trackReadingProgress, 5000);

    // Send final reading time when page is hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const totalReadTime = Math.round((Date.now() - startTimeRef.current) / 1000);
        if (totalReadTime > 5) { // Only track reading time over 5 seconds
          trackEvent.articleReadTime(articleId, totalReadTime);
        }
      }
    };

    // Send final reading time when page unloads
    const handleBeforeUnload = () => {
      const totalReadTime = Math.round((Date.now() - startTimeRef.current) / 1000);
      if (totalReadTime > 5) {
        trackEvent.articleReadTime(articleId, totalReadTime);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Also send reading time when component unmounts
      const totalReadTime = Math.round((Date.now() - startTimeRef.current) / 1000);
      if (totalReadTime > 5) {
        trackEvent.articleReadTime(articleId, totalReadTime);
      }
    };
  }, [articleId, articleTitle]);

  return null;
}