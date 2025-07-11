"use client"

import { useLanguage } from "@/components/Context/LanguageContext"
import { useScrolling } from "@/components/util/useScrolling"

// 标签翻译和图标映射
const getTagDisplay = (tag: { id: number; name: string; color?: string }, lang: 'zh' | 'en') => {
  // 根据标签ID或名称判断类型
  const isLifeTag = tag.id === 2 || tag.name.toLowerCase().includes('life') || tag.name.includes('生活')
  const isTechTag = tag.id === 1 || tag.name.toLowerCase().includes('tech') || tag.name.includes('科技')
  
  // 标签名称翻译
  let displayName = tag.name
  if (isLifeTag) {
    displayName = lang === 'zh' ? '生活' : 'Life'
  } else if (isTechTag) {
    displayName = lang === 'zh' ? '科技' : 'Tech'
  }
  
  // 图标选择
  let icon = null
  if (isLifeTag) {
    // Life icon - heart
    icon = (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
      </svg>
    )
  } else if (isTechTag) {
    // Tech icon - code
    icon = (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    )
  } else {
    // Default tag icon
    icon = (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
      </svg>
    )
  }
  
  return { displayName, icon }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TechCard({ blog }: { blog: any; index: number }) {
    const lang = useLanguage().lang
    const isScrolling = useScrolling(150)

    // Use preprocessed data from server
    const title = (lang === 'en' ? blog.processedTitle?.en : blog.processedTitle?.zh) || blog.title
    const introduction = (lang === 'en' ? blog.processedIntroduction?.en : blog.processedIntroduction?.zh) || blog.introduction

    // figure out if the blog is a life blog
    const tag = (blog.tags || []).length > 0 ? blog.tags[0] : null

    const time = new Date(blog.pubtime).toLocaleDateString(
        lang == 'zh' ? 'zh-CN' : 'en-US'
        , {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        })

    return (
        <div className='relative w-full h-full'>
            <div className={`group relative w-full h-full rounded-3xl overflow-hidden
                shadow-2xl transition-all duration-700 ease-out
                bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
                border border-slate-700/50 flex flex-col
                transform-gpu
                ${!isScrolling ? 'md:hover:shadow-3xl md:group-hover:from-slate-800 md:group-hover:via-slate-700 md:group-hover:to-slate-800 md:group-hover:border-slate-600/80 md:hover:opacity-90' : ''}`}>
                
                {/* Header with tech badge and title - 更加大气的头部 */}
                <div className="p-6 md:p-8 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 
                    relative overflow-hidden">
                    
                    {/* 背景装饰元素 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
                    <div className="absolute top-0 left-0 w-full h-full">
                        <div className="absolute top-4 right-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
                        <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>
                    </div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm
                                    border border-white/30 shadow-lg">
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="text-white font-bold text-sm tracking-[0.15em] uppercase">TECH</span>
                            </div>
                            
                            {/* Tag */}
                            {tag?.name && (
                                <span className="text-white/95 rounded-full px-4 py-2 font-semibold text-sm
                                    bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg flex items-center gap-1.5">
                                    {(() => {
                                        const { displayName, icon } = getTagDisplay(tag, lang as 'zh' | 'en')
                                        return (
                                            <>
                                                {icon}
                                                {displayName}
                                            </>
                                        )
                                    })()}
                                </span>
                            )}
                        </div>
                        
                        {/* Title in header - 更大气的标题 */}
                        <h2 className={`font-bold leading-tight text-white
                            ${lang === 'en' ? 'text-lg md:text-xl lg:text-2xl' : 'text-xl md:text-2xl lg:text-3xl'}`}
                            style={{
                                textShadow: '0 2px 8px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)'
                            }}>
                            {title}
                        </h2>
                    </div>
                    
                    {/* 头部闪光效果 */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                        -translate-x-full transition-transform duration-1500 ease-out pointer-events-none
                        ${!isScrolling ? 'group-hover:translate-x-full' : ''}`}></div>
                </div>

                {/* Main content area - 更宽松的内容区域 */}
                <div className="p-6 md:p-8 flex-1 flex flex-col">
                    
                    {/* Introduction */}
                    <p className={`leading-relaxed text-slate-300 mb-6 flex-1 transition-all duration-300
                        ${lang === 'en' ? 'text-base md:text-lg' : 'text-lg md:text-xl'}
                        ${!isScrolling ? 'group-hover:text-slate-200' : ''}`}
                        style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }}>
                        {introduction}
                    </p>
                    
                    {/* Bottom section - 更精致的底部 */}
                    <div className="flex items-center justify-between pt-6 border-t border-slate-700/50 flex-shrink-0">
                        {/* Time */}
                        <div className="flex items-center gap-3 text-slate-400 text-sm">
                            <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="font-medium">{time}</span>
                        </div>
                        
                        {/* Read more indicator - 更突出的按钮 */}
                        <div className={`flex items-center gap-3 text-slate-400 transition-all duration-300
                            ${!isScrolling ? 'group-hover:text-blue-400' : ''}`}>
                            <span className="text-sm font-semibold">
                                {lang === 'zh' ? '阅读更多' : 'Read more'}
                            </span>
                            <div className={`w-8 h-8 rounded-lg bg-slate-700 
                                flex items-center justify-center transition-all duration-300
                                ${!isScrolling ? 'group-hover:bg-slate-600' : ''}`}>
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* 整体光效 */}
                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/3 to-transparent 
                    -translate-x-full transition-transform duration-1200 ease-out pointer-events-none rounded-3xl
                    ${!isScrolling ? 'group-hover:translate-x-full' : ''}`}></div>
                
                {/* 边缘光晕 */}
                <div className={`absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-700
                    shadow-[0_0_30px_rgba(59,130,246,0.3)] pointer-events-none
                    ${!isScrolling ? 'group-hover:opacity-100' : ''}`}></div>
            </div>
        </div>
    )
}