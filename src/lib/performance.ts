// Performance monitoring utilities

// Type definitions for performance APIs
interface PerformanceEventTiming extends PerformanceEntry {
  processingStart?: number;
}

interface PerformanceWithMemory extends Performance {
  memory: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

// Web Vitals measurement
export const measureWebVitals = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    // First Contentful Paint
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    
    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
    
    // First Input Delay
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as PerformanceEventTiming;
          if (fidEntry.processingStart) {
            console.log('FID:', fidEntry.processingStart - entry.startTime);
          }
        }
      });
      observer.observe({ entryTypes: ['first-input'] });
    }
    
    // Cumulative Layout Shift
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const clsEntry = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number; };
          if (!clsEntry.hadRecentInput && clsEntry.value) {
            clsValue += clsEntry.value;
            console.log('CLS:', clsValue);
          }
        }
      });
      observer.observe({ entryTypes: ['layout-shift'] });
    }
    
    if (fcp) {
      console.log('FCP:', fcp.startTime);
    }
  }
};

// Component render time measurement
export const measureComponentRender = (componentName: string) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
      
      // Warn about slow renders
      if (renderTime > 16) {
        console.warn(`⚠️ Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
    }
  };
};

// Bundle size analyzer (development only)
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    // Estimate bundle size from performance navigation
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const transferSize = navigation.transferSize;
      const encodedBodySize = navigation.encodedBodySize;
      const decodedBodySize = navigation.decodedBodySize;
      
      console.log('Bundle Analysis:', {
        transferSize: `${(transferSize / 1024).toFixed(2)} KB`,
        encodedBodySize: `${(encodedBodySize / 1024).toFixed(2)} KB`,
        decodedBodySize: `${(decodedBodySize / 1024).toFixed(2)} KB`,
        compressionRatio: `${((1 - encodedBodySize / decodedBodySize) * 100).toFixed(1)}%`
      });
    }
  }
};

// Memory usage tracking
export const trackMemoryUsage = () => {
  if (typeof window !== 'undefined' && 'performance' in window && 'memory' in performance) {
    const memory = (performance as PerformanceWithMemory).memory as {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
    
    console.log('Memory Usage:', {
      used: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
      total: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
      limit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`
    });
    
    // Warn about high memory usage
    const usagePercentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
    if (usagePercentage > 80) {
      console.warn(`⚠️ High memory usage: ${usagePercentage.toFixed(1)}%`);
    }
  }
};

// Performance hook for React components
export const usePerformanceMonitoring = (componentName: string) => {
  if (process.env.NODE_ENV === 'development') {
    const startTime = performance.now();
    
    return {
      endMeasurement: () => {
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        console.log(`${componentName} total time: ${renderTime.toFixed(2)}ms`);
      }
    };
  }
  
  return { endMeasurement: () => {} };
};