"use client"
import React, { useState } from "react";
import Image from "next/image";
import SPALink from '@/components/Common/SPALink';
import { trackEvent } from '@/lib/gtag';

function Foot(params: { lang: string; isHomePage?: boolean }) {
    const [showWeChatModal, setShowWeChatModal] = useState(false);

    const handleWeChatClick = () => {
        // GA跟踪微信公众号点击
        trackEvent.navClick('WeChat Modal Open', 'Footer WeChat Button');
        setShowWeChatModal(true);
    };

    const closeModal = () => {
        setShowWeChatModal(false);
    };
    const footerBackgroundClass = params.isHomePage
        ? "w-full bg-black/80 snap-start overflow-hidden relative pb-safe min-h-fit"
        : "w-full bg-white/10 backdrop-blur-lg border-t border-white/20 snap-start overflow-hidden relative pb-safe min-h-fit";

    return (
        <>
        <div className={footerBackgroundClass}>
            {/* 分割线 */}
            <div className="w-full">
                <div className="container max-w-[2000px] mx-auto px-5 md:px-10 lg:px-16">
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
                </div>
            </div>

            {/* Background pattern overlay */}
            <div className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}>
            </div>

            <div className="w-full relative z-10">
                <div className="max-w-[2000px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-start
                    text-2xl px-5 md:px-10 lg:px-16  py-10 ">

                    {/* 左侧：版权信息 */}
                    <div
                        className="rounded-2xl px-4 py-3 border border-white/20 mb-6 md:mb-0"
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                        }}

                    >
                        <span className="text-white/90 font-medium">© 2012–2025 Mofei</span>
                    </div>

                    {/* 右侧：两行链接 */}
                    <div className="flex flex-col gap-8 items-start md:items-end w-full md:w-auto">
                        {/* 第一行：导航链接 */}
                        <div
                            className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-row gap-3 p-3 rounded-2xl border border-white/20 w-full md:w-auto"
                            style={{
                                background: 'rgba(255,255,255,0.08)',
                                backdropFilter: 'blur(8px)',
                                WebkitBackdropFilter: 'blur(8px)',
                                boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                            }}
                            
                        >
                            <SPALink href={`${params?.lang == 'en' ? '/' : '/zh'}`}
                                className="text-white/80 hover:text-white hover:opacity-90 px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center gap-1">
                                <svg className="w-6 h-6 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                                </svg>
                                Home
                            </SPALink>
                            <SPALink href={`${params?.lang || 'en'}/blog/1`}
                                className="text-white/80 hover:text-white hover:opacity-90 px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center gap-1">
                                <svg className="w-6 h-6 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                                </svg>
                                Blog
                            </SPALink>
                            <SPALink href={`${params?.lang || 'en'}/message/1`}
                                className="text-white/80 hover:text-white hover:opacity-90 px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center gap-1">
                                <svg className="w-6 h-6 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                                </svg>
                                Message
                            </SPALink>
                            <SPALink href={`${params?.lang || 'en'}/friends`}
                                className="text-white/80 hover:text-white hover:opacity-90 px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center gap-1">
                                <svg className="w-6 h-6 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                                Friends
                            </SPALink>
                            <a href={params?.lang === 'zh' ? 'https://tools.mofei.life/zh/' : 'https://tools.mofei.life/'}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={params?.lang === 'zh' ? '在新窗口打开工具页面' : 'Open tools in new window'}
                                onClick={() => trackEvent.externalLink(params?.lang === 'zh' ? 'https://tools.mofei.life/zh/' : 'https://tools.mofei.life/', 'Footer Tools')}
                                className="text-white/80 hover:text-white hover:opacity-90 px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center gap-1">
                                <svg className="w-6 h-6 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
                                </svg>
                                <span className="flex items-center gap-1">
                                    Tools
                                    <svg className="w-3 h-3 md:w-3 md:h-3 lg:w-3 lg:h-3 xl:w-3 xl:h-3 2xl:w-3 2xl:h-3 opacity-60" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                                    </svg>
                                </span>
                            </a>
                        </div>

                        {/* 第二行：社交媒体链接 */}
                        <div
                            className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-row gap-3 p-3 rounded-2xl border border-white/20 w-full md:w-auto"
                            style={{
                                background: 'rgba(255,255,255,0.08)',
                                backdropFilter: 'blur(8px)',
                                WebkitBackdropFilter: 'blur(8px)',
                                boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                            }}
                           
                        >
                            <a href="https://github.com/zmofei/" target="_blank"
                                onClick={() => trackEvent.externalLink('https://github.com/zmofei/', 'Footer GitHub')}
                                className="text-white/80 hover:text-white hover:opacity-90 px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center gap-1">
                                <svg className="w-6 h-6 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                                Github
                            </a>
                            <a href="https://www.instagram.com/zhu_wenlong/" target="_blank"
                                onClick={() => trackEvent.externalLink('https://www.instagram.com/zhu_wenlong/', 'Footer Instagram')}
                                className="text-white/80 hover:text-white hover:opacity-90 px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center gap-1">
                                <svg className="w-6 h-6 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                                Instagram
                            </a>
                            <a href={`https://www.mofei.life/${params?.lang || 'en'}/rss`} target="_blank"
                                onClick={() => trackEvent.externalLink(`https://www.mofei.life/${params?.lang || 'en'}/rss`, 'Footer RSS')}
                                className="text-white/80 hover:text-white hover:opacity-90 px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center gap-1">
                                <svg className="w-6 h-6 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795.001 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.118-15.758-15.839-15.82zm0-3.368c10.58.046 19.152 8.594 19.183 19.188h4.817c-.03-13.231-10.755-23.954-24-24v4.812z" />
                                </svg>
                                RSS
                            </a>
                            <button
                                onClick={handleWeChatClick}
                                className="text-white/80 hover:text-white hover:opacity-90 px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center gap-1">
                                <svg className="w-6 h-6 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                                </svg>
                                公众号
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full mt-4 overflow-hidden">
                <div className="m-auto relative z-10">
                    <svg
                        className="outline-none hidden md:flex" viewBox="0 0 2318 135"
                    >
                        <foreignObject width="100%" height="100%">
                            <p className="text-[135px] text-center font-extrabold text-transparent bg-clip-text relative" style={{
                                fontFamily: '"Inter", sans-serif',
                                fontWeight: 700,
                                letterSpacing: "-0px",
                                lineHeight: "1em",
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.3) 100%)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))',
                                textShadow: '0 0 20px rgba(255,255,255,0.5), inset 0 1px 0 rgba(255,255,255,0.8)'
                            }}>HI. I AM MOFEI. NICE TO MEET YOU.</p>
                        </foreignObject>
                    </svg>

                    {/* 手机版简化文字，避免性能问题 */}
                    <div className="flex md:hidden">
                        <div className="w-full text-center py-8">
                            <p className="text-4xl font-bold text-white/80 mb-2">
                                HI. I AM MOFEI!
                            </p>
                            <p className="text-2xl font-medium text-white/60">
                                NICE TO MEET YOU!
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 页面结束标记 - 防止过度滚动 */}
            <div className="w-full h-px bg-transparent"></div>
        </div>

        {/* WeChat Modal - Outside footer container to avoid overflow-hidden */}
        {showWeChatModal && (
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center p-3 md:p-6" 
                onClick={closeModal}
                style={{ 
                    position: 'fixed', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    width: '100vw', 
                    height: '100vh',
                    zIndex: 999999,
                    margin: 0,
                    transform: 'none'
                }}>
                <div
                    className="relative w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto rounded-2xl md:rounded-3xl p-3 sm:p-4 md:p-8 group"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.95) 100%)',
                        backdropFilter: 'blur(20px) saturate(200%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(200%)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        borderTop: '1px solid rgba(255,255,255,0.6)',
                        borderLeft: '1px solid rgba(255,255,255,0.4)',
                        boxShadow: '0 32px 64px rgba(0,0,0,0.2), 0 16px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Glass effect overlays */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none rounded-3xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/20 pointer-events-none rounded-3xl"></div>

                    {/* Top edge highlight */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-t-3xl pointer-events-none"></div>

                    {/* Left edge highlight */}
                    <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-white/30 via-white/20 to-transparent rounded-l-3xl pointer-events-none"></div>

                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                        -translate-x-full group-hover:translate-x-full transition-transform duration-1500 ease-out
                        skew-x-12 pointer-events-none rounded-3xl"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-4 md:mb-6">
                            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                {params.lang === 'zh' ? '关注我的公众号' : 'Follow My WeChat Accounts'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-gray-600 hover:text-gray-800 hover:bg-white/40 active:bg-white/50 active:scale-95 transition-all duration-200 text-lg md:text-xl shadow-lg hover:shadow-xl"
                            >
                                ×
                            </button>
                        </div>

                        {/* Mobile: Single column, Desktop: Two columns */}
                        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 md:gap-6">
                            {/* Life WeChat Account */}
                            <div className="relative rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 group overflow-hidden"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.1) 100%)',
                                    backdropFilter: 'blur(10px) saturate(150%)',
                                    WebkitBackdropFilter: 'blur(10px) saturate(150%)',
                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                    borderTop: '1px solid rgba(239, 68, 68, 0.3)',
                                    boxShadow: '0 8px 32px rgba(239, 68, 68, 0.1), inset 0 1px 0 rgba(255,255,255,0.3)'
                                }}>
                                {/* Glass effect overlays */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-xl md:rounded-2xl"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-red-500/5 via-transparent to-white/10 pointer-events-none rounded-xl md:rounded-2xl"></div>

                                <div className="relative z-10 text-center">
                                    {/* Mobile: Simplified layout */}
                                    <div className="md:hidden">
                                        <div className="flex items-center justify-center gap-3 mb-3">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg flex-shrink-0"
                                                style={{
                                                    background: 'rgba(255,255,255,0.9)',
                                                    border: '1px solid rgba(239, 68, 68, 0.2)'
                                                }}>
                                                <Image
                                                    src="/img/qrcode_life.jpg"
                                                    alt={params.lang === 'zh' ? '生活公众号二维码' : 'Life WeChat QR Code'}
                                                    width={64}
                                                    height={64}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 mb-1">
                                                    <span>👨‍👩‍👧‍👦</span>
                                                    <span>{params.lang === 'zh' ? '生活' : 'LIFE'}</span>
                                                </div>
                                                <h3 className="text-sm font-bold text-red-700 leading-tight">
                                                    {params.lang === 'zh' ? '疯狂的超级奶爸在北欧' : 'Nordic Super Dad'}
                                                </h3>
                                                <p className="text-xs text-red-600">
                                                    {params.lang === 'zh' ? '芬兰生活分享' : 'Life in Finland'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Desktop: Full layout */}
                                    <div className="hidden md:block">
                                        <div className="flex justify-center mb-3 md:mb-4">
                                            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold shadow-lg flex items-center gap-2 backdrop-blur-sm border border-red-400/30">
                                                <span>👨‍👩‍👧‍👦</span>
                                                <span>{params.lang === 'zh' ? '生活公众号' : 'LIFE ACCOUNT'}</span>
                                            </div>
                                        </div>

                                        <div className="mb-3 md:mb-4">
                                            <h3 className="text-lg md:text-xl font-bold text-red-700 mb-1 leading-tight">
                                                {params.lang === 'zh' ? '疯狂的超级奶爸在北欧' : 'Nordic Super Dad'}
                                            </h3>
                                            <p className="text-red-600 text-xs md:text-sm font-medium">
                                                {params.lang === 'zh' ? '家庭生活 • 育儿日常 • 北欧生活' : 'Family Life • Parenting • Nordic Living'}
                                            </p>
                                        </div>

                                        <div className="mb-3 md:mb-4">
                                            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-40 md:h-40 lg:w-48 lg:h-48 mx-auto rounded-xl md:rounded-2xl overflow-hidden shadow-2xl relative"
                                                style={{
                                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                                                    backdropFilter: 'blur(10px)',
                                                    border: '2px solid rgba(239, 68, 68, 0.2)',
                                                    borderTop: '2px solid rgba(239, 68, 68, 0.3)'
                                                }}>
                                                <Image
                                                    src="/img/qrcode_life.jpg"
                                                    alt={params.lang === 'zh' ? '生活公众号二维码' : 'Life WeChat QR Code'}
                                                    width={192}
                                                    height={192}
                                                    className="w-full h-full object-cover rounded-xl"
                                                />
                                            </div>
                                        </div>

                                        <div className="rounded-xl p-2 md:p-3"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.4) 100%)',
                                                backdropFilter: 'blur(8px)',
                                                border: '1px solid rgba(239, 68, 68, 0.1)'
                                            }}>
                                            <p className="text-red-700 font-medium text-xs md:text-sm mb-1 flex items-center justify-center gap-2">
                                                <span>🏠</span>
                                                {params.lang === 'zh' ? '芬兰生活分享' : 'Life in Finland'}
                                            </p>
                                            <p className="text-gray-600 text-xs leading-relaxed">
                                                {params.lang === 'zh'
                                                    ? '分享在芬兰的日常生活、育儿心得和教育体验，探索北欧独特魅力'
                                                    : 'Daily life, parenting insights and educational experiences in the Nordic region'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                        </div>

                            {/* Tech WeChat Account */}
                            <div className="relative rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 group overflow-hidden"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%)',
                                    backdropFilter: 'blur(10px) saturate(150%)',
                                    WebkitBackdropFilter: 'blur(10px) saturate(150%)',
                                    border: '1px solid rgba(59, 130, 246, 0.2)',
                                    borderTop: '1px solid rgba(59, 130, 246, 0.3)',
                                    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.1), inset 0 1px 0 rgba(255,255,255,0.3)'
                                }}>
                                {/* Glass effect overlays */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-xl md:rounded-2xl"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 via-transparent to-white/10 pointer-events-none rounded-xl md:rounded-2xl"></div>

                                <div className="relative z-10 text-center">
                                    {/* Mobile: Simplified layout */}
                                    <div className="md:hidden">
                                        <div className="flex items-center justify-center gap-3 mb-3">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg flex-shrink-0"
                                                style={{
                                                    background: 'rgba(255,255,255,0.9)',
                                                    border: '1px solid rgba(59, 130, 246, 0.2)'
                                                }}>
                                                <Image
                                                    src="/img/qrcode_tech.jpg"
                                                    alt={params.lang === 'zh' ? '技术公众号二维码' : 'Tech WeChat QR Code'}
                                                    width={64}
                                                    height={64}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 mb-1">
                                                    <span>👨‍💻</span>
                                                    <span>{params.lang === 'zh' ? '技术' : 'TECH'}</span>
                                                </div>
                                                <h3 className="text-sm font-bold text-blue-700 leading-tight">
                                                    {params.lang === 'zh' ? 'Mofie' : 'Mofie Tech'}
                                                </h3>
                                                <p className="text-xs text-blue-600">
                                                    {params.lang === 'zh' ? '技术灵感与实战' : 'Tech Insights'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Desktop: Full layout */}
                                    <div className="hidden md:block">
                                        <div className="flex justify-center mb-3 md:mb-4">
                                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold shadow-lg flex items-center gap-2 backdrop-blur-sm border border-blue-400/30">
                                                <span>👨‍💻</span>
                                                <span>{params.lang === 'zh' ? '技术公众号' : 'TECH ACCOUNT'}</span>
                                            </div>
                                        </div>

                                        <div className="mb-3 md:mb-4">
                                            <h3 className="text-lg md:text-xl font-bold text-blue-700 mb-1 leading-tight">
                                                {params.lang === 'zh' ? 'Mofie' : 'Mofie Tech'}
                                            </h3>
                                            <p className="text-blue-600 text-xs md:text-sm font-medium">
                                                {params.lang === 'zh' ? '前端开发 • AI技术 • 编程经验' : 'Frontend • AI • Dev Experience'}
                                            </p>
                                        </div>

                                        <div className="mb-3 md:mb-4">
                                            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-40 md:h-40 lg:w-48 lg:h-48 mx-auto rounded-xl md:rounded-2xl overflow-hidden shadow-2xl relative"
                                                style={{
                                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                                                    backdropFilter: 'blur(10px)',
                                                    border: '2px solid rgba(59, 130, 246, 0.2)',
                                                    borderTop: '2px solid rgba(59, 130, 246, 0.3)'
                                                }}>
                                                <Image
                                                    src="/img/qrcode_tech.jpg"
                                                    alt={params.lang === 'zh' ? '技术公众号二维码' : 'Tech WeChat QR Code'}
                                                    width={192}
                                                    height={192}
                                                    className="w-full h-full object-cover rounded-xl"
                                                />
                                            </div>
                                        </div>

                                        <div className="rounded-xl p-2 md:p-3"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.4) 100%)',
                                                backdropFilter: 'blur(8px)',
                                                border: '1px solid rgba(59, 130, 246, 0.1)'
                                            }}>
                                            <p className="text-blue-700 font-medium text-xs md:text-sm mb-1 flex items-center justify-center gap-2">
                                                <span>🚀</span>
                                                {params.lang === 'zh' ? '技术灵感与实战' : 'Tech Insights & Practice'}
                                            </p>
                                            <p className="text-gray-600 text-xs leading-relaxed">
                                                {params.lang === 'zh'
                                                    ? '十几年互联网老兵，记录前端、后端、大数据、AI技术经验'
                                                    : 'Veteran developer sharing frontend, backend, big data, and AI experiences'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                        </div>
                    </div>

                        <div className="mt-4 md:mt-6 space-y-3">
                            <div className="rounded-xl p-3 md:p-4 relative overflow-hidden"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 100%)',
                                    backdropFilter: 'blur(10px) saturate(150%)',
                                    WebkitBackdropFilter: 'blur(10px) saturate(150%)',
                                    border: '1px solid rgba(255,255,255,0.4)',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)'
                                }}>
                                <div className="flex items-start gap-3 relative z-10">
                                    <div className="w-5 h-5 md:w-6 md:h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg">
                                        <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-gray-700 text-sm md:text-base font-medium mb-1">
                                            {params.lang === 'zh' ? '🚀 博客内容第一时间更新' : '🚀 Blog Content Updated First'}
                                        </p>
                                        <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                                            {params.lang === 'zh'
                                                ? '本博客的最新文章会第一时间发布，随后按照内容类型分别同步到对应的公众号：生活感悟类文章发布到生活公众号，技术开发类文章发布到技术公众号。'
                                                : 'Latest blog articles are published here first, then distributed by content type: life insights go to the Life WeChat account, and technical development articles go to the Tech WeChat account.'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center space-y-2 relative z-10">
                                <p className="text-gray-600 text-sm md:text-base font-medium">
                                    {params.lang === 'zh'
                                        ? '扫描二维码关注公众号，获取更多精彩内容'
                                        : 'Scan QR code with WeChat to follow and get more content'}
                                </p>
                                {params.lang === 'en' && (
                                    <div className="rounded-xl p-3 text-left"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
                                            backdropFilter: 'blur(8px)',
                                            border: '1px solid rgba(59, 130, 246, 0.2)'
                                        }}>
                                        <p className="text-blue-700 font-medium text-xs mb-1">📱 New to WeChat?</p>
                                        <p className="text-blue-600 text-xs leading-relaxed">
                                            WeChat is China&apos;s most popular messaging app. Download it from your app store,
                                            then use the scan feature to follow these accounts for exclusive content.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
        </>
    );
};

export default Foot;