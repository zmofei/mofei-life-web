"use client"
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface ArticleFooterProps {
    lang: 'zh' | 'en';
    previousArticle?: { _id: string; title: string };
    nextArticle?: { _id: string; title: string };
    showRecommends?: boolean;
    showComments?: boolean;
}

export default function ArticleFooter({
    lang,
    previousArticle,
    nextArticle,
    showComments = true
}: ArticleFooterProps) {
    return (
        <div
            className="max-w-7xl mx-auto"

        >
            {/* THE END + Integrated Footer */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-700/30 shadow-2xl overflow-hidden">

                {/* THE END Section */}
                <div className="text-center py-8 md:py-12 border-b border-gray-700/30">
                    <div className="inline-flex items-center justify-center bg-gradient-to-r from-gray-800/80 to-gray-700/80 
                        rounded-full px-6 py-3 border border-gray-600/30 shadow-xl backdrop-blur-md 
                        hover:shadow-2xl hover:opacity-90 transition-all duration-300">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/article/start.png" alt="" className="w-6 md:w-8 mr-2 opacity-70" width={32} height={32} />
                        <span className="text-base md:text-lg font-medium text-gray-300 tracking-wider">THE END</span>
                    </div>
                </div>

                {/* WeChat Follow - Only for Chinese */}
                {lang === 'zh' && (
                    <div className="px-6 md:px-8 py-6 md:py-8 border-b border-gray-700/30">
                        <div className="text-center mb-6">
                            <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                                📱 喜欢这篇文章？关注我的公众号
                            </h3>
                            <p className="text-gray-400 text-sm">
                                博客文章会第一时间发布，然后按类型同步到对应公众号
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Life WeChat */}
                            <div className="bg-gradient-to-br from-red-50/10 to-red-100/10 rounded-xl p-4 border border-red-300/20 hover:border-red-300/40 transition-all duration-300">
                                <div className="text-center">
                                    <div className="flex justify-center mb-3">
                                        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-2">
                                            <span>👨‍👩‍👧‍👦</span>
                                            <span>生活公众号</span>
                                        </div>
                                    </div>

                                    <h4 className="text-sm font-bold text-red-400 mb-1">疯狂的超级奶爸在北欧</h4>
                                    <p className="text-red-300 text-xs mb-3">家庭生活 • 育儿日常 • 北欧生活</p>

                                    <div className="w-24 h-24 mx-auto mb-2 bg-white/10 border border-red-300/30 rounded-lg overflow-hidden">
                                        <Image
                                            src="/img/qrcode_life.jpg"
                                            alt="生活公众号二维码"
                                            width={96}
                                            height={96}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <p className="text-gray-400 text-xs">🏠 芬兰生活分享</p>
                                </div>
                            </div>

                            {/* Tech WeChat */}
                            <div className="bg-gradient-to-br from-blue-50/10 to-blue-100/10 rounded-xl p-4 border border-blue-300/20 hover:border-blue-300/40 transition-all duration-300">
                                <div className="text-center">
                                    <div className="flex justify-center mb-3">
                                        <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-2">
                                            <span>👨‍💻</span>
                                            <span>技术公众号</span>
                                        </div>
                                    </div>

                                    <h4 className="text-sm font-bold text-blue-400 mb-1">Mofie</h4>
                                    <p className="text-blue-300 text-xs mb-3">前端开发 • AI技术 • 编程经验</p>

                                    <div className="w-24 h-24 mx-auto mb-2 bg-white/10 border border-blue-300/30 rounded-lg overflow-hidden">
                                        <Image
                                            src="/img/qrcode_tech.jpg"
                                            alt="技术公众号二维码"
                                            width={96}
                                            height={96}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <p className="text-gray-400 text-xs">🚀 技术灵感与实战</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                {(previousArticle?._id || nextArticle?._id) && (
                    <div className="px-6 md:px-8 py-6 md:py-8 border-b border-gray-700/30">
                        <div className="text-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-300">
                                {lang === 'zh' ? '📚 更多精彩文章' : '📚 More Great Articles'}
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {previousArticle?._id && (
                                <Link href={`/${lang}/blog/article/${previousArticle._id}`}
                                    className="group block p-4 rounded-xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 
                                        hover:from-gray-700/50 hover:to-gray-800/50 transition-all duration-300 
                                        border border-gray-700/20 hover:border-gray-600/40 hover:shadow-lg hover:opacity-90"
                                    title={previousArticle.title}>
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            <ChevronLeftIcon className="size-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs text-blue-400 font-medium mb-1 uppercase tracking-wider">
                                                {lang == 'zh' ? '上一篇' : 'Previous'}
                                            </div>
                                            <div className="text-gray-200 group-hover:text-white transition-colors truncate font-medium text-sm">
                                                {previousArticle?.title}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )}
                            {nextArticle?._id && (
                                <Link href={`/${lang}/blog/article/${nextArticle._id}`}
                                    className="group block p-4 rounded-xl bg-gradient-to-bl from-gray-800/40 to-gray-900/40 
                                        hover:from-gray-700/50 hover:to-gray-800/50 transition-all duration-300 
                                        border border-gray-700/20 hover:border-gray-600/40 hover:shadow-lg hover:opacity-90"
                                    title={nextArticle.title}>
                                    <div className="flex items-center space-x-3 md:flex-row-reverse md:space-x-reverse md:space-x-3 md:text-right">
                                        <div className="flex-shrink-0">
                                            <ChevronRightIcon className="size-5 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs text-emerald-400 font-medium mb-1 uppercase tracking-wider">
                                                {lang == 'zh' ? '下一篇' : 'Next'}
                                            </div>
                                            <div className="text-gray-200 group-hover:text-white transition-colors truncate font-medium text-sm">
                                                {nextArticle?.title}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )}
                        </div>
                    </div>
                )}

                {/* Comments CTA */}
                {showComments && (
                    <div className="px-6 md:px-8 py-6 md:py-8 text-center">
                        <h3 className="text-lg font-semibold text-gray-300 mb-2">
                            {lang === 'zh' ? '💬 分享你的想法' : '💬 Share Your Thoughts'}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">
                            {lang === 'zh'
                                ? '有什么想法或问题？欢迎在下方留言交流！'
                                : 'Have any thoughts or questions? Feel free to leave a comment below!'}
                        </p>
                        <div className="inline-flex items-center text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                            {lang === 'zh' ? '查看评论区' : 'Go to Comments'}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}