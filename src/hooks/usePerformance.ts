"use client"
import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
}

export const usePerformance = (componentName: string, enabled = process.env.NODE_ENV === 'development') => {
  const startTimeRef = useRef<number | undefined>(undefined);
  const metricsRef = useRef<PerformanceMetrics[]>([]);

  useEffect(() => {
    if (!enabled) return;
    
    startTimeRef.current = performance.now();
    
    return () => {
      if (startTimeRef.current) {
        const endTime = performance.now();
        const renderTime = endTime - startTimeRef.current;
        
        const metrics: PerformanceMetrics = {
          renderTime,
          componentName
        };
        
        metricsRef.current.push(metrics);
        
        // Log performance metrics
        console.log(`🔍 ${componentName} render: ${renderTime.toFixed(2)}ms`);
        
        // Warn about slow renders
        if (renderTime > 16) {
          console.warn(`⚠️ Slow render in ${componentName}: ${renderTime.toFixed(2)}ms`);
        }
        
        // Track average render time
        if (metricsRef.current.length > 0) {
          const avgRenderTime = metricsRef.current.reduce((sum, m) => sum + m.renderTime, 0) / metricsRef.current.length;
          if (metricsRef.current.length % 10 === 0) {
            console.log(`📊 ${componentName} avg render time: ${avgRenderTime.toFixed(2)}ms (${metricsRef.current.length} renders)`);
          }
        }
      }
    };
  });

  return {
    getMetrics: () => metricsRef.current,
    clearMetrics: () => { metricsRef.current = []; }
  };
};

// Hook for measuring specific operations
export const useMeasure = (operationName: string, enabled = process.env.NODE_ENV === 'development') => {
  const startMeasure = () => {
    if (!enabled) return () => {};
    
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      console.log(`⏱️ ${operationName}: ${duration.toFixed(2)}ms`);
      
      if (duration > 100) {
        console.warn(`⚠️ Slow operation ${operationName}: ${duration.toFixed(2)}ms`);
      }
    };
  };

  return { startMeasure };
};