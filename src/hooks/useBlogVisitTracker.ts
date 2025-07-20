"use client"

import { useEffect, useRef } from 'react';
import { recordBlogVisit } from '@/app/actions/blog';

/**
 * Hook to track blog visits with deduplication
 * Prevents multiple visits from being recorded for the same blog within 1 minute
 */
export function useBlogVisitTracker(blogId: string) {
  const hasRecorded = useRef(false);
  const sessionKey = `blog_visit_${blogId}`;

  useEffect(() => {
    // Avoid recording multiple times for the same blog in the same component lifecycle
    if (hasRecorded.current) return;
    

    // Record the visit
    const recordVisit = async () => {
      try {
        const success = await recordBlogVisit(blogId);
        if (success) {
          // Mark as recorded in session to prevent duplicate records
          sessionStorage.setItem(sessionKey, '1');
          hasRecorded.current = true;
          console.debug(`Blog visit recorded for: ${blogId}`);
        }
      } catch (error) {
        console.warn(`Failed to record blog visit for ${blogId}:`, error);
      }
    };

    // Small delay to ensure page is properly loaded
    const timeoutId = setTimeout(recordVisit, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [blogId, sessionKey]);
}