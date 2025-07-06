"use client"
import React, { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

function Foot(params: { lang: string }) {
    const [showWeChatModal, setShowWeChatModal] = useState(false);

    const handleWeChatClick = () => {
        setShowWeChatModal(true);
    };

    const closeModal = () => {
        setShowWeChatModal(false);
    };
    return (
        <div className="w-full bg-gradient-to-br from-[#e04b45] via-[#d63d33] to-[#c32e22] snap-start overflow-hidden relative" >
            {/* Background pattern overlay */}
            <div className="absolute inset-0 opacity-10" 
                style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}>
            </div>
            
            <div className="w-full relative z-10">
                <div className="max-w-[2000px] mx-auto flex flex-col md:flex-row leading-loose justify-between items-start md:items-center
                    text-sm pt-4 px-5 gap-3 md:gap-0
                    md:text-base md:pt-6 md:px-10
                    lg:text-lg lg:pt-7 lg:px-16
                    xl:text-xl xl:pt-8 xl:px-20
                    2xl:text-2xl 2xl:pt-9 2xl:px-24">
                    
                    <motion.div
                        className="bg-white/10 backdrop-blur-sm rounded-full px-2 py-1 border border-white/20
                            md:px-3 md:py-1.5 lg:px-4 lg:py-1.5 xl:px-5 xl:py-2 2xl:px-6 2xl:py-2"
                        initial={{ opacity: 0, translateY: -50 }}
                        whileInView={{ opacity: 1, translateY: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                    >
                        <span className="text-white/90 font-medium">© 2012–2025 Mofei</span>
                    </motion.div>
                    
                    <motion.div
                        className="flex flex-row md:flex-col gap-2 md:gap-1 lg:gap-1.5 xl:gap-1.5 2xl:gap-2"
                        initial={{ opacity: 0, translateY: -50 }}
                        whileInView={{ opacity: 1, translateY: 0 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    >
                        <Link href={`${params?.lang == 'en' ? '/' : '/zh'}`} 
                            className="text-white/80 hover:text-white hover:bg-white/10 px-1.5 py-0.5 rounded-lg transition-all duration-300 hover:scale-105 flex items-center gap-1
                                md:px-2 md:py-1 lg:px-2.5 lg:py-1 xl:px-3 xl:py-1.5 2xl:px-4 2xl:py-1.5">
                            <svg className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                            </svg>
                            Home
                        </Link>
                        <Link href={`${params?.lang || 'en'}/blog/1`} 
                            className="text-white/80 hover:text-white hover:bg-white/10 px-1.5 py-0.5 rounded-lg transition-all duration-300 hover:scale-105 flex items-center gap-1
                                md:px-2 md:py-1 lg:px-2.5 lg:py-1 xl:px-3 xl:py-1.5 2xl:px-4 2xl:py-1.5">
                            <svg className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                            </svg>
                            Blog
                        </Link>
                        <Link href={`${params?.lang || 'en'}/message/1`} 
                            className="text-white/80 hover:text-white hover:bg-white/10 px-1.5 py-0.5 rounded-lg transition-all duration-300 hover:scale-105 flex items-center gap-1
                                md:px-2 md:py-1 lg:px-2.5 lg:py-1 xl:px-3 xl:py-1.5 2xl:px-4 2xl:py-1.5">
                            <svg className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                            </svg>
                            Message
                        </Link>
                        <Link href={`${params?.lang || 'en'}/friends`} 
                            className="text-white/80 hover:text-white hover:bg-white/10 px-1.5 py-0.5 rounded-lg transition-all duration-300 hover:scale-105 flex items-center gap-1
                                md:px-2 md:py-1 lg:px-2.5 lg:py-1 xl:px-3 xl:py-1.5 2xl:px-4 2xl:py-1.5">
                            <svg className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                            Friends
                        </Link>
                        <a href={params?.lang === 'zh' ? 'https://tools.mofei.life/zh/' : 'https://tools.mofei.life/'} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/80 hover:text-white hover:bg-white/10 px-1.5 py-0.5 rounded-lg transition-all duration-300 hover:scale-105 flex items-center gap-1
                                md:px-2 md:py-1 lg:px-2.5 lg:py-1 xl:px-3 xl:py-1.5 2xl:px-4 2xl:py-1.5">
                            <svg className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
                            </svg>
                            Tools
                        </a>
                    </motion.div>
                    
                    <motion.div
                        className="flex flex-row md:flex-col gap-1.5 md:gap-1 lg:gap-1.5 xl:gap-1.5 2xl:gap-2"
                        initial={{ opacity: 0, translateY: -50 }}
                        whileInView={{ opacity: 1, translateY: 0 }}
                        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                    >
                        <a href="https://github.com/zmofei/" target="_blank" 
                            className="text-white/80 hover:text-white hover:bg-white/10 px-1.5 py-0.5 rounded-lg transition-all duration-300 hover:scale-105 flex items-center gap-1
                                md:px-2 md:py-1 lg:px-2.5 lg:py-1 xl:px-3 xl:py-1.5 2xl:px-4 2xl:py-1.5">
                            <svg className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            Github
                        </a>
                        <a href="https://www.instagram.com/zhu_wenlong/" target="_blank" 
                            className="text-white/80 hover:text-white hover:bg-white/10 px-1.5 py-0.5 rounded-lg transition-all duration-300 hover:scale-105 flex items-center gap-1
                                md:px-2 md:py-1 lg:px-2.5 lg:py-1 xl:px-3 xl:py-1.5 2xl:px-4 2xl:py-1.5">
                            <svg className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                            Instagram
                        </a>
                        <a href={`https://www.mofei.life/${params?.lang || 'en'}/rss`} target="_blank" 
                            className="text-white/80 hover:text-white hover:bg-white/10 px-1.5 py-0.5 rounded-lg transition-all duration-300 hover:scale-105 flex items-center gap-1
                                md:px-2 md:py-1 lg:px-2.5 lg:py-1 xl:px-3 xl:py-1.5 2xl:px-4 2xl:py-1.5">
                            <svg className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795.001 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.118-15.758-15.839-15.82zm0-3.368c10.58.046 19.152 8.594 19.183 19.188h4.817c-.03-13.231-10.755-23.954-24-24v4.812z"/>
                            </svg>
                            RSS
                        </a>
                        <button 
                            onClick={handleWeChatClick}
                            className="text-white/80 hover:text-white hover:bg-white/10 px-1.5 py-0.5 rounded-lg transition-all duration-300 hover:scale-105 flex items-center gap-1
                                md:px-2 md:py-1 lg:px-2.5 lg:py-1 xl:px-3 xl:py-1.5 2xl:px-4 2xl:py-1.5">
                            <svg className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8.691 2.188C4.296 2.188.5 5.484.5 9.828c0 2.875 1.859 5.422 4.688 6.594v3.281l3.313-1.656c.859.188 1.781.281 2.688.281.938 0 1.875-.094 2.781-.281-.125-.422-.188-.859-.188-1.313 0-2.781 2.312-5.047 5.188-5.047.281 0 .562.031.844.063C19.299 4.969 14.531 2.188 8.691 2.188zM6.5 7.375c.688 0 1.25.563 1.25 1.25S7.188 9.875 6.5 9.875 5.25 9.313 5.25 8.625 5.813 7.375 6.5 7.375zm4.375 0c.688 0 1.25.563 1.25 1.25s-.563 1.25-1.25 1.25-1.25-.563-1.25-1.25.563-1.25 1.25-1.25zm7.625 5.281c-2.375 0-4.25 1.656-4.25 3.781 0 2.125 1.875 3.781 4.25 3.781.5 0 .969-.094 1.406-.25l2.063 1.031v-2.063c1.781-.844 3-2.5 3-4.5 0-2.125-1.875-3.781-4.25-3.781zm-2.719 2.406c.406 0 .719.313.719.719s-.313.719-.719.719-.719-.313-.719-.719.313-.719.719-.719zm2.719 0c.406 0 .719.313.719.719s-.313.719-.719.719-.719-.313-.719-.719.313-.719.719-.719z"/>
                            </svg>
                            公众号
                        </button>
                    </motion.div>
                </div>
            </div>
                
            <motion.div
                className="w-full mt-4 md:mt-6 lg:mt-7 xl:mt-8 2xl:mt-9"
                initial={{ opacity: 0, translateY: 30 }}
                whileInView={{ opacity: 1, translateY: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
                    <svg
                        className="outline-none mt-10 hidden md:flex" viewBox="0 0 2318 135"
                    >
                        <foreignObject width="100%" height="100%">
                            <p className="text-[135px] text-center font-extrabold text-white " style={{
                                fontFamily: '"Inter", sans-serif',
                                fontWeight: 700,
                                letterSpacing: "-0px",
                                lineHeight: "1em",
                            }}>HI. I AM MOFEI. NICE TO MEET YOU.</p>
                        </foreignObject>
                    </svg>

                    <svg
                        className="outline-none flex md:hidden mt-10" viewBox="0 0 2318 200"
                    >
                        <foreignObject width="100%" height="100%">
                            <p className="text-[200px] text-center font-extrabold text-white" style={{
                                fontFamily: '"Inter", sans-serif',
                                fontWeight: 700,
                                letterSpacing: "-0px",
                                lineHeight: "1em",
                            }}>HI. I AM MOFEI!</p>
                        </foreignObject>
                    </svg>
                    <svg
                        className="outline-none flex md:hidden mb-10 " viewBox="0 0 2318 200"
                    >
                        <foreignObject width="100%" height="100%">
                            <p className="text-[200px] text-center font-extrabold text-white" style={{
                                fontFamily: '"Inter", sans-serif',
                                fontWeight: 700,
                                letterSpacing: "-0px",
                                lineHeight: "1em",
                            }}>NICE TO MEET YOU!</p>
                        </foreignObject>
                    </svg>
            </motion.div>

            {/* WeChat Modal */}
            {showWeChatModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
                    <motion.div 
                        className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {params.lang === 'zh' ? '关注我的公众号' : 'Follow My WeChat Accounts'}
                            </h2>
                            <button 
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Life WeChat Account */}
                            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                                <div className="text-center">
                                    {/* Life Category Badge - Centered */}
                                    <div className="flex justify-center mb-4">
                                        <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                                            <span>👨‍👩‍👧‍👦</span>
                                            <span>{params.lang === 'zh' ? '生活公众号' : 'LIFE ACCOUNT'}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold text-red-700 mb-1">
                                            {params.lang === 'zh' ? '疯狂的超级奶爸在北欧' : 'Nordic Super Dad'}
                                        </h3>
                                        <p className="text-red-500 text-sm font-medium">
                                            {params.lang === 'zh' ? '家庭生活 • 育儿日常 • 北欧生活' : 'Family Life • Parenting • Nordic Living'}
                                        </p>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <div className="w-48 h-48 mx-auto bg-white border-2 border-red-200 rounded-xl overflow-hidden shadow-lg">
                                            <Image 
                                                src="/img/qrcode_life.jpg" 
                                                alt={params.lang === 'zh' ? '生活公众号二维码' : 'Life WeChat QR Code'}
                                                width={192}
                                                height={192}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="bg-white/70 rounded-lg p-3">
                                        <div className="bg-red-500/10 border border-red-200 rounded-lg p-3">
                                            <p className="text-red-700 font-medium text-sm mb-1 flex items-center gap-2">
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
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                                <div className="text-center">
                                    {/* Tech Category Badge - Centered */}
                                    <div className="flex justify-center mb-4">
                                        <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                                            <span>👨‍💻</span>
                                            <span>{params.lang === 'zh' ? '技术公众号' : 'TECH ACCOUNT'}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold text-blue-700 mb-1">
                                            {params.lang === 'zh' ? 'Mofie' : 'Mofie Tech'}
                                        </h3>
                                        <p className="text-blue-500 text-sm font-medium">
                                            {params.lang === 'zh' ? '前端开发 • AI技术 • 编程经验' : 'Frontend • AI • Dev Experience'}
                                        </p>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <div className="w-48 h-48 mx-auto bg-white border-2 border-blue-200 rounded-xl overflow-hidden shadow-lg">
                                            <Image 
                                                src="/img/qrcode_tech.jpg" 
                                                alt={params.lang === 'zh' ? '技术公众号二维码' : 'Tech WeChat QR Code'}
                                                width={192}
                                                height={192}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="bg-white/70 rounded-lg p-3">
                                        <div className="bg-blue-500/10 border border-blue-200 rounded-lg p-3">
                                            <p className="text-blue-700 font-medium text-sm mb-1 flex items-center gap-2">
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
                        
                        <div className="mt-6 space-y-3">
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-gray-700 text-sm font-medium mb-1">
                                            {params.lang === 'zh' ? '🚀 博客内容第一时间更新' : '🚀 Blog Content Updated First'}
                                        </p>
                                        <p className="text-gray-600 text-xs leading-relaxed">
                                            {params.lang === 'zh' 
                                                ? '本博客的最新文章会第一时间发布，随后按照内容类型分别同步到对应的公众号：生活感悟类文章发布到生活公众号，技术开发类文章发布到技术公众号。' 
                                                : 'Latest blog articles are published here first, then distributed by content type: life insights go to the Life WeChat account, and technical development articles go to the Tech WeChat account.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="text-center space-y-2">
                                <p className="text-gray-500 text-sm">
                                    {params.lang === 'zh' 
                                        ? '扫描二维码关注公众号，获取更多精彩内容' 
                                        : 'Scan QR code with WeChat to follow and get more content'}
                                </p>
                                {params.lang === 'en' && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-left">
                                        <p className="text-blue-700 font-medium text-xs mb-1">📱 New to WeChat?</p>
                                        <p className="text-blue-600 text-xs leading-relaxed">
                                            WeChat is China&apos;s most popular messaging app. Download it from your app store, 
                                            then use the scan feature to follow these accounts for exclusive content.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Foot;