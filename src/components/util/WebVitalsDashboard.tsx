"use client"
import { useState, useEffect } from 'react';
import { WebVitalsMetric } from '@/lib/web-vitals';

interface VitalsState {
  CLS?: WebVitalsMetric;
  INP?: WebVitalsMetric;
  FCP?: WebVitalsMetric;
  LCP?: WebVitalsMetric;
  TTFB?: WebVitalsMetric;
}

export default function WebVitalsDashboard() {
  const [vitals, setVitals] = useState<VitalsState>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 只在开发环境显示
    if (process.env.NODE_ENV !== 'development') return;

    // 监听 Web Vitals 指标
    const handleWebVitals = (event: CustomEvent<WebVitalsMetric>) => {
      const metric = event.detail;
      setVitals(prev => ({
        ...prev,
        [metric.name]: metric
      }));
    };

    // 添加事件监听器
    window.addEventListener('web-vitals', handleWebVitals as EventListener);

    return () => {
      window.removeEventListener('web-vitals', handleWebVitals as EventListener);
    };
  }, []);

  // 只在开发环境显示
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <>
      {/* 切换按钮 */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="bg-black/80 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-black/90 transition-colors"
        >
          📊 Web Vitals
        </button>
      </div>

      {/* 仪表板 */}
      {isVisible && (
        <div className="fixed bottom-16 right-4 z-50 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-4 shadow-xl w-80">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Web Vitals</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-3">
            {Object.entries(vitals).map(([name, metric]) => (
              <MetricCard key={name} name={name} metric={metric} />
            ))}
            
            {Object.keys(vitals).length === 0 && (
              <p className="text-gray-500 text-sm">等待指标收集中...</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

interface MetricCardProps {
  name: string;
  metric: WebVitalsMetric;
}

function MetricCard({ name, metric }: MetricCardProps) {
  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatValue = (name: string, value: number) => {
    if (name === 'CLS') {
      return value.toFixed(3);
    }
    return `${Math.round(value)}ms`;
  };

  const getDescription = (name: string) => {
    switch (name) {
      case 'CLS': return '累积布局偏移';
      case 'INP': return '交互到下一次绘制';
      case 'FCP': return '首次内容绘制';
      case 'LCP': return '最大内容绘制';
      case 'TTFB': return '首字节时间';
      default: return name;
    }
  };

  return (
    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
      <div>
        <div className="font-medium text-sm text-gray-900">{name}</div>
        <div className="text-xs text-gray-500">{getDescription(name)}</div>
      </div>
      <div className="text-right">
        <div className="font-mono text-sm text-gray-900">
          {formatValue(name, metric.value)}
        </div>
        <div className={`text-xs px-2 py-1 rounded-full ${getRatingColor(metric.rating)}`}>
          {metric.rating}
        </div>
      </div>
    </div>
  );
}