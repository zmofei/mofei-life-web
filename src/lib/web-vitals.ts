"use client"
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';
import { trackWebVitals } from './gtag';

// Web Vitals metric types
export interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
}

// Rating standards
const THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  INP: { good: 200, poor: 500 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
};

// Get rating
function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

// Send metrics to analytics service (optional)
function sendToAnalytics(metric: WebVitalsMetric) {
  // Only log to console in development environment
  if (process.env.NODE_ENV === 'development') {
    console.log(`📊 Web Vitals - ${metric.name}:`, {
      value: `${metric.value.toFixed(2)}${metric.name === 'CLS' ? '' : 'ms'}`,
      rating: metric.rating,
      id: metric.id,
    });
    
    // Show performance warnings
    if (metric.rating === 'poor') {
      console.warn(`⚠️ Poor ${metric.name}: ${metric.value.toFixed(2)}${metric.name === 'CLS' ? '' : 'ms'}`);
    }
    
    // Send custom event to dashboard
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('web-vitals', {
        detail: metric
      }));
    }
  }
  
  // Send to Google Analytics 4 in production
  if (process.env.NODE_ENV === 'production') {
    // Send to GA4
    trackWebVitals(metric);
    
    // Optional: also send to custom analytics endpoint
    // fetch('/api/web-vitals', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(metric),
    // });
  }
}

// Initialize Web Vitals monitoring
export function initWebVitals() {
  // Cumulative Layout Shift
  onCLS((metric) => {
    sendToAnalytics({
      ...metric,
      rating: getRating('CLS', metric.value),
    });
  });

  // Interaction to Next Paint
  onINP((metric) => {
    sendToAnalytics({
      ...metric,
      rating: getRating('INP', metric.value),
    });
  });

  // First Contentful Paint
  onFCP((metric) => {
    sendToAnalytics({
      ...metric,
      rating: getRating('FCP', metric.value),
    });
  });

  // Largest Contentful Paint
  onLCP((metric) => {
    sendToAnalytics({
      ...metric,
      rating: getRating('LCP', metric.value),
    });
  });

  // Time to First Byte
  onTTFB((metric) => {
    sendToAnalytics({
      ...metric,
      rating: getRating('TTFB', metric.value),
    });
  });
}

// Real-time performance monitoring Hook
export function useWebVitals() {
  if (typeof window !== 'undefined') {
    // Initialize after page load
    if (document.readyState === 'complete') {
      initWebVitals();
    } else {
      window.addEventListener('load', initWebVitals);
    }
  }
}

// Manually trigger metric collection
export function collectWebVitals() {
  initWebVitals();
}

// Performance report generator
export function generatePerformanceReport() {
  if (typeof window === 'undefined') return null;
  
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paint = performance.getEntriesByType('paint');
  
  const report = {
    // Navigation timing
    navigation: {
      dns: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcp: navigation.connectEnd - navigation.connectStart,
      request: navigation.responseStart - navigation.requestStart,
      response: navigation.responseEnd - navigation.responseStart,
      domLoad: navigation.domContentLoadedEventEnd - navigation.responseEnd,
      windowLoad: navigation.loadEventEnd - navigation.loadEventStart,
    },
    // Paint timing
    paint: {
      fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      fp: paint.find(p => p.name === 'first-paint')?.startTime || 0,
    },
    // Resource loading
    resources: performance.getEntriesByType('resource').length,
    // Overall timing
    total: navigation.loadEventEnd,
  };
  
  console.log('📈 Performance Report:', report);
  return report;
}