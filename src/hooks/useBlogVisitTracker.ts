"use client"

import { useEffect, useRef } from 'react';
import { recordBlogVisit } from '@/app/actions/blog';

/**
 * Hook to track blog visits - records every page view (PV)
 * No deduplication - each visit/refresh counts as a new visit
 */
export function useBlogVisitTracker(blogId: string) {
  const hasRecorded = useRef(false);

  useEffect(() => {
    // Avoid recording multiple times in the same component lifecycle/render
    if (hasRecorded.current) {
      console.log(`🔄 Visit already recorded in this render for: ${blogId}`);
      return;
    }

    // Record the visit
    const recordVisit = async () => {
      console.log(`🔥 Recording PV for blog: ${blogId}`);
      try {
        const success = await recordBlogVisit(blogId);
        console.log(`📊 PV record result for ${blogId}:`, success);
        if (success) {
          hasRecorded.current = true;
          console.log(`✅ PV recorded successfully for: ${blogId}`);
        } else {
          console.warn(`❌ Failed to record PV for: ${blogId} - API returned false`);
        }
      } catch (error) {
        console.warn(`💥 Failed to record PV for ${blogId}:`, error);
      }
    };

    // Small delay to ensure page is properly loaded
    const timeoutId = setTimeout(recordVisit, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [blogId]);

  // Reset the flag when blogId changes (navigating to different blog)
  useEffect(() => {
    hasRecorded.current = false;
  }, [blogId]);
}