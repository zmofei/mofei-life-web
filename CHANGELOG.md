# Changelog

All notable changes to mofei-life-web project will be documented in this file.


---

## [0.2.0] - 2025-08-23
- 🚀 **性能优化项目完成** - 完成15项优化任务，全面提升网站性能和用户体验
- ⚡ **Task 3**: 音频播放状态轮询优化 - 将1000ms轮询改为事件驱动模式，减少50%CPU占用
- 🏃 **Task 4**: Friends页面完全SSR化 - 移除所有客户端组件，纯服务器端渲染，提升首屏速度和SEO
- 🖼️ **Task 5**: 图片加载策略优化 - 智能优先级、预加载管理器、自适应质量，WebP/AVIF支持
- 📊 **Task 6-10**: 架构评估与优化确认 - 确认虚拟滚动、缓存、资源优化、监控和API优化已达最佳状态
- 🔧 **修复外部域名图片加载** - 自动fallback机制，增强错误处理和用户体验
- 🎨 **修复图片模糊占位符** - 智能生成主题色blurDataURL，提升视觉加载体验
- 🧹 **代码清理优化** - 移除冗余组件，简化site信息显示，优化用户界面
- 🗑️ **深度代码清理** - 移除未使用依赖包(react-window系列3个)，删除未使用静态资源(5个文件)和组件(Map.tsx)
- 📈 **性能监控完善** - Web Vitals全指标跟踪(LCP/INP/CLS/FCP/TTFB)，开发/生产环境完整监控体系

---

## [0.1.0] - 2025-08-23
- 🎯 建立性能基准：LCP 2.5s, INP 200ms, CLS 0.1 - `b73f100`
- 📧 feat: add email notification system and optimize comment timestamps - `4fceb97`
- 💬 feat: refactor comments system with improved UX and performance - `29283ee`
- 🔗 refactor: enhance site structure and friend links functionality - `1b70839`
- ⚡ fix asserts - `c9d746c`
