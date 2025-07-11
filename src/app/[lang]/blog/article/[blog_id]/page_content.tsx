"use client"

import React from "react";
import HtmlToReact from './HtmlToReact';
import Link from "next/link";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface BlogContent {
    title: string;
    html: string;
    pubtime?: string;
    previousArticle?: { _id: string; title: string };
    nextArticle?: { _id: string; title: string };
}

export default function PageContent({ params }: { params: { content: BlogContent, lang: 'zh' | 'en', blog_id: string } }) {
    const { content: blog, lang } = params;

    // Format publication date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(
            lang === 'zh' ? 'zh-CN' : 'en-US',
            {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }
        );
    };

    return <>
        <div className="max-w-7xl mx-auto">
            <div className='
                      font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#a1c4fd] to-[#c2e9fb] 
                      text-3xl 
                      md:text-5xl 
                      lg:text-6xl
                      !leading-tight mb-4
                    '

            >
                {blog.title}
            </div>

            {/* Publication date */}
            {blog.pubtime && (
                <div
                    className="mb-6"

                >
                    <div className="inline-flex items-center bg-gray-800/30 backdrop-blur-sm rounded-full px-5 py-2 border border-gray-700/30 shadow-lg">
                        <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-400 text-xs md:text-sm font-medium">
                            {lang === 'zh' ? '发布于 ' : 'Published '}
                            {formatDate(blog.pubtime)}
                        </span>
                    </div>
                </div>
            )}
        </div>
        <div className='max-w-7xl mx-auto prose-stone prose-xl-invert overflow-y-auto break-words 
                  prose-base prose-gray-300
                  md:prose-xl lg:prose-2xl
                  custom-paragraph leading-relaxed
                  bg-white/10 backdrop-blur-lg rounded-2xl p-6 py-2 md:p-8 md:py-2 lg:p-8
                  shadow-2xl md:hover:shadow-3xl transition-all duration-300 md:duration-500
                  relative group overflow-hidden
                '
            style={{
                border: '1px solid rgba(255, 255, 255, 0.18)',
                borderTop: '1px solid rgba(255, 255, 255, 0.25)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.22)'
            }}

        >
            {/* Glass effect overlays */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-2xl"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5 pointer-events-none rounded-2xl"></div>

            {/* Inner glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/3 via-transparent to-white/2 pointer-events-none rounded-2xl"></div>

            {/* Glass border reflections */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
                background: `linear-gradient(135deg, 
                    rgba(255,255,255,0.15) 0%, 
                    transparent 20%, 
                    transparent 80%, 
                    rgba(255,255,255,0.08) 100%)`
            }}></div>

            {/* Top edge highlight */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-t-2xl pointer-events-none"></div>

            {/* Left edge highlight */}
            <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-white/8 via-white/5 to-transparent rounded-l-2xl pointer-events-none"></div>

            {/* Bottom right subtle reflection */}
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-white/3 to-transparent rounded-br-2xl pointer-events-none"></div>

            {/* Soft directional light */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-white/4 to-transparent rounded-tl-2xl pointer-events-none"></div>

            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent 
                -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out
                skew-x-12 pointer-events-none rounded-2xl"></div>

            <div className="relative z-10">
                {(() => {
                    try {
                        // 使用 HtmlToReact 进行渲染
                        return <HtmlToReact htmlString={blog.html} />;
                    } catch (error) {
                        console.error("HtmlToReact failed:", error);
                        // HtmlToReact 渲染失败时回退到 dangerouslySetInnerHTML
                        return <div dangerouslySetInnerHTML={{ __html: blog.html }} />;
                    }
                })()}

                {/* WeChat Follow integrated into article content - Only for Chinese */}
                {lang === 'zh' && (
                    <div className="mt-12 pt-8 border-t border-gray-600/30">
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-white mb-3">
                                📱 喜欢这篇文章？关注我的公众号
                            </h3>
                            <p className="text-gray-400 text-sm">
                                博客文章会第一时间发布，然后按类型同步到对应公众号
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Life WeChat */}
                            <div className="bg-gradient-to-br from-red-50/10 to-red-100/10 rounded-xl p-5 border border-red-300/20 hover:border-red-300/40 transition-all duration-300">
                                <div className="text-center">
                                    <div className="flex justify-center mb-3">
                                        <div className="bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                                            <span>👨‍👩‍👧‍👦</span>
                                            <span>生活公众号</span>
                                        </div>
                                    </div>

                                    <h4 className="text-lg font-bold text-red-400 mb-2">疯狂的超级奶爸在北欧</h4>
                                    <p className="text-red-300 text-sm mb-4">家庭生活 • 育儿日常 • 北欧生活</p>

                                    <div className="w-32 h-32 mx-auto mb-3 bg-white/10 border border-red-300/30 rounded-lg overflow-hidden">
                                        <Image
                                            src="/img/qrcode_life.jpg"
                                            alt="生活公众号二维码"
                                            width={128}
                                            height={128}
                                            className="w-full h-full object-contain not-prose"
                                        />
                                    </div>

                                    <p className="text-gray-400 text-sm">🏠 芬兰生活分享</p>
                                </div>
                            </div>

                            {/* Tech WeChat */}
                            <div className="bg-gradient-to-br from-blue-50/10 to-blue-100/10 rounded-xl p-5 border border-blue-300/20 hover:border-blue-300/40 transition-all duration-300">
                                <div className="text-center">
                                    <div className="flex justify-center mb-3">
                                        <div className="bg-blue-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                                            <span>👨‍💻</span>
                                            <span>技术公众号</span>
                                        </div>
                                    </div>

                                    <h4 className="text-lg font-bold text-blue-400 mb-2">Mofie</h4>
                                    <p className="text-blue-300 text-sm mb-4">前端开发 • AI技术 • 编程经验</p>

                                    <div className="w-32 h-32 mx-auto mb-3 bg-white/10 border border-blue-300/30 rounded-lg overflow-hidden">
                                        <Image
                                            src="/img/qrcode_tech.jpg"
                                            alt="技术公众号二维码"
                                            width={128}
                                            height={128}
                                            className="w-full h-full object-contain not-prose"
                                        />
                                    </div>

                                    <p className="text-gray-400 text-sm">🚀 技术灵感与实战</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

        <div className="text-center my-12 md:my-16"

        >
            <div className="inline-flex items-center justify-center gap-4 md:gap-6 bg-white/10 backdrop-blur-lg
                rounded-full px-6 py-3 md:px-8 md:py-4 border border-white/20 shadow-xl 
                md:hover:shadow-2xl transition-all duration-300 relative group overflow-hidden">

                {/* Glass effect overlays */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-full"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5 pointer-events-none rounded-full"></div>

                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                    -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out
                    skew-x-12 pointer-events-none rounded-full"></div>

                {/* THE END */}
                <div className="flex items-center">
                    <Image src="/article/start.png" alt="" className="w-5 md:w-6 mr-2 opacity-70" width={24} height={24} />
                    <span className="text-sm md:text-base font-medium text-gray-300 tracking-wider">THE END</span>
                </div>

                {/* Separator */}
                <div className="w-px h-6 bg-gray-600/50"></div>

                {/* Comment CTA */}
                <button
                    onClick={() => {
                        const commentsSection = document.querySelector('#comments-section');
                        if (commentsSection) {
                            commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }}
                    className="group flex items-center md:hover:opacity-90 transition-all duration-300"
                >
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-400 mr-2 group-hover:text-blue-300 transition-colors"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-sm md:text-base font-medium text-blue-300 group-hover:text-blue-200 transition-colors">
                        {lang === 'zh' ? '要评论吗？' : 'Comment?'}
                    </span>
                </button>
            </div>
        </div>

        {/* Navigation */}
        {(blog.previousArticle?._id || blog.nextArticle?._id) && <div
            className="max-w-7xl mx-auto mt-8 mb-12 grid grid-cols-1 md:grid-cols-2 gap-6"

        >
            {blog.previousArticle?._id && (
                <Link href={`/${lang}/blog/article/${blog.previousArticle._id}`}
                    className="group block p-4 rounded-xl bg-white/10 backdrop-blur-lg
                            md:hover:bg-white/15 transition-all duration-300 
                            border border-white/20 hover:border-white/30 hover:shadow-lg hover:opacity-90
                            relative overflow-hidden"
                    title={blog.previousArticle.title}>
                    {/* Glass effect overlays */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5 pointer-events-none rounded-xl"></div>

                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent 
                            -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out
                            skew-x-12 pointer-events-none rounded-xl"></div>

                    <div className="flex items-center space-x-3 relative z-10">
                        <div className="flex-shrink-0">
                            <ChevronLeftIcon className="size-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs text-blue-400 font-medium mb-1 uppercase tracking-wider">
                                {lang == 'zh' ? '上一篇' : 'Previous'}
                            </div>
                            <div className="text-gray-200 group-hover:text-white transition-colors truncate font-medium">
                                {blog.previousArticle?.title}
                            </div>
                        </div>
                    </div>
                </Link>
            )}
            {/* nextArticle */}
            {blog.nextArticle?._id && (
                <Link href={`/${lang}/blog/article/${blog.nextArticle._id}`}
                    className="group block p-4 rounded-xl bg-white/10 backdrop-blur-lg
                            md:hover:bg-white/15 transition-all duration-300 
                            border border-white/20 hover:border-white/30 hover:shadow-lg hover:opacity-90
                            relative overflow-hidden"
                    title={blog.nextArticle.title}>
                    {/* Glass effect overlays */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5 pointer-events-none rounded-xl"></div>

                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent 
                            -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out
                            skew-x-12 pointer-events-none rounded-xl"></div>

                    <div className="flex items-center space-x-3 md:flex-row-reverse md:space-x-reverse md:space-x-3 md:text-right relative z-10">
                        <div className="flex-shrink-0">
                            <ChevronRightIcon className="size-6 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs text-emerald-400 font-medium mb-1 uppercase tracking-wider">
                                {lang == 'zh' ? '下一篇' : 'Next'}
                            </div>
                            <div className="text-gray-200 group-hover:text-white transition-colors truncate font-medium">
                                {blog.nextArticle?.title}
                            </div>
                        </div>
                    </div>
                </Link>
            )}
        </div>}
    </>
}
