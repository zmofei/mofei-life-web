"use client"

import { useEffect, useState } from 'react';

// Singleton scroll state to avoid multiple window listeners
let initialized = false;
let globalIsScrolling = false;
let timer: ReturnType<typeof setTimeout> | null = null;
let defaultDelay = 150;
const subscribers = new Set<(v: boolean) => void>();

function notify(value: boolean) {
  subscribers.forEach((cb) => cb(value));
}

function handleScroll() {
  if (!globalIsScrolling) {
    globalIsScrolling = true;
    notify(true);
  }
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    globalIsScrolling = false;
    notify(false);
  }, defaultDelay);
}

function initIfNeeded(delay: number) {
  if (initialized) return;
  initialized = true;
  defaultDelay = delay || defaultDelay;
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll, { passive: true });
  }
}

function cleanupIfNoSubscribers() {
  if (subscribers.size === 0 && initialized && typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll);
    initialized = false;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }
}

export function useScrolling(delay: number = 150) {
  const [isScrolling, setIsScrolling] = useState<boolean>(false);

  useEffect(() => {
    initIfNeeded(delay);
    const cb = (v: boolean) => setIsScrolling(v);
    subscribers.add(cb);
    return () => {
      subscribers.delete(cb);
      cleanupIfNoSubscribers();
    };
  }, [delay]);

  return isScrolling;
}
