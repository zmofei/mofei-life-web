# Web Vitals 使用指南

## 概述

Web Vitals 是 Google 推出的一组统一指标，用于衡量网页的用户体验质量。本项目已集成 Web Vitals 监控，可以实时监测页面性能。

## 核心指标说明

### 1. LCP (Largest Contentful Paint) - 最大内容绘制
- **含义**: 测量页面主要内容加载完成的时间
- **良好**: ≤ 2.5秒
- **需要改进**: 2.5-4.0秒  
- **差**: > 4.0秒

### 2. INP (Interaction to Next Paint) - 交互到下一次绘制
- **含义**: 测量用户交互到视觉响应的延迟
- **良好**: ≤ 200毫秒
- **需要改进**: 200-500毫秒
- **差**: > 500毫秒

### 3. CLS (Cumulative Layout Shift) - 累积布局偏移
- **含义**: 测量页面元素意外移动的程度
- **良好**: ≤ 0.1
- **需要改进**: 0.1-0.25
- **差**: > 0.25

### 4. FCP (First Contentful Paint) - 首次内容绘制
- **含义**: 测量页面首次渲染任何内容的时间
- **良好**: ≤ 1.8秒
- **需要改进**: 1.8-3.0秒
- **差**: > 3.0秒

### 5. TTFB (Time to First Byte) - 首字节时间
- **含义**: 测量浏览器接收到第一个字节的时间
- **良好**: ≤ 800毫秒
- **需要改进**: 800-1800毫秒
- **差**: > 1800毫秒

### 注意：FID 已被 INP 替代
Google 已将 FID (First Input Delay) 替换为 INP (Interaction to Next Paint)，因为 INP 能更好地反映用户交互体验。

## 使用方法

### 1. 开发环境实时监控

在开发环境中，Web Vitals 会自动启用：

```tsx
// 已自动集成到 layout.tsx 中
<WebVitalsProvider>
  <YourApp />
  <WebVitalsDashboard /> {/* 开发环境显示仪表板 */}
</WebVitalsProvider>
```

### 2. 查看实时数据

- 开启开发服务器：`npm run dev`
- 打开浏览器开发者工具控制台
- 点击页面右下角的 "📊 Web Vitals" 按钮查看实时仪表板
- 控制台会输出详细的性能指标

### 3. 手动收集指标

```tsx
import { initWebVitals, collectWebVitals } from '@/lib/web-vitals';

// 初始化监控
initWebVitals();

// 手动触发收集
collectWebVitals();
```

### 4. 生成性能报告

```tsx
import { generatePerformanceReport } from '@/lib/web-vitals';

// 生成完整性能报告
const report = generatePerformanceReport();
console.log(report);
```

## 生产环境配置

### 1. Google Analytics 4 集成

在 `src/lib/web-vitals.ts` 中取消注释：

```tsx
// 生产环境发送到 GA4
if (process.env.NODE_ENV === 'production') {
  gtag('event', metric.name, {
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    metric_id: metric.id,
    metric_value: metric.value,
    metric_delta: metric.delta,
    metric_rating: metric.rating,
  });
}
```

### 2. 自定义分析端点

```tsx
// 发送到自定义API
if (process.env.NODE_ENV === 'production') {
  fetch('/api/web-vitals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(metric),
  });
}
```

## 性能优化建议

### 改善 LCP
1. 优化服务器响应时间
2. 启用缓存策略
3. 优化图片加载（使用 Next.js Image 组件）
4. 预加载关键资源

### 改善 INP
1. 优化事件处理函数
2. 分割长任务
3. 使用 Web Workers
4. 延迟加载非关键 JavaScript
5. 优化第三方脚本

### 改善 CLS
1. 为图片和嵌入式内容设置尺寸
2. 避免在现有内容上方插入内容
3. 使用 font-display: swap
4. 确保广告有预留空间

### 改善 FCP
1. 减少阻塞渲染的资源
2. 内联关键 CSS
3. 启用文本压缩
4. 优化 Web 字体

### 改善 TTFB
1. 使用 CDN
2. 优化数据库查询
3. 启用缓存
4. 使用服务端渲染

## 监控最佳实践

1. **持续监控**: 在每次部署后检查指标
2. **设置告警**: 当指标下降时及时通知
3. **A/B 测试**: 比较不同优化策略的效果
4. **真实用户监控**: 收集真实用户的性能数据
5. **定期审查**: 定期分析性能趋势

## 故障排除

### 常见问题

1. **指标未显示**: 确保在客户端环境且页面已完全加载
2. **CLS 过高**: 检查图片尺寸、动态内容插入
3. **LCP 过慢**: 优化关键渲染路径、图片压缩
4. **FID 过高**: 减少主线程阻塞、优化 JavaScript

### 调试工具

1. Chrome DevTools Performance 面板
2. Lighthouse 性能审计
3. Web Vitals Chrome 扩展
4. PageSpeed Insights

## 相关资源

- [Web Vitals 官方文档](https://web.dev/vitals/)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [Lighthouse 工具](https://developers.google.com/web/tools/lighthouse)
- [Core Web Vitals 优化指南](https://web.dev/optimize-vitals/)