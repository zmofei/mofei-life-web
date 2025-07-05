"use client"
import React, { useState } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';

interface WeChatFollowProps {
    lang: 'zh' | 'en';
}

export default function WeChatFollow({ lang }: WeChatFollowProps) {
    const [, setHoveredCard] = useState<'life' | 'tech' | null>(null);

    return (
        <motion.div 
            className="max-w-7xl mx-auto my-12 md:my-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-gray-700/30 shadow-2xl">
                <div className="text-center mb-6">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                        {lang === 'zh' ? '📱 喜欢这篇文章？关注我的公众号' : '📱 Enjoyed this article? Follow my WeChat'}
                    </h3>
                    <p className="text-gray-400 text-sm md:text-base">
                        {lang === 'zh' 
                            ? '博客文章会第一时间发布，然后按类型同步到对应公众号' 
                            : 'Blog articles are published here first, then distributed to WeChat accounts by category'}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                    {/* Life WeChat */}
                    <motion.div 
                        className="bg-gradient-to-br from-red-50/10 to-red-100/10 rounded-xl p-4 md:p-6 border border-red-300/20 hover:border-red-300/40 transition-all duration-300 cursor-pointer"
                        onMouseEnter={() => setHoveredCard('life')}
                        onMouseLeave={() => setHoveredCard(null)}
                        whileHover={{ scale: 1.02, y: -2 }}
                    >
                        <div className="text-center">
                            <div className="flex justify-center mb-3">
                                <div className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2">
                                    <span>👨‍👩‍👧‍👦</span>
                                    <span>{lang === 'zh' ? '生活公众号' : 'LIFE ACCOUNT'}</span>
                                </div>
                            </div>
                            
                            <h4 className="text-lg font-bold text-red-400 mb-1">
                                {lang === 'zh' ? '疯狂的超级奶爸在北欧' : 'Nordic Super Dad'}
                            </h4>
                            <p className="text-red-300 text-xs mb-3">
                                {lang === 'zh' ? '家庭生活 • 育儿日常 • 北欧生活' : 'Family Life • Parenting • Nordic Living'}
                            </p>
                            
                            <div className="w-32 h-32 mx-auto mb-3 bg-white/10 border border-red-300/30 rounded-lg overflow-hidden">
                                <Image 
                                    src="/img/qrcode_life.jpg" 
                                    alt={lang === 'zh' ? '生活公众号二维码' : 'Life WeChat QR Code'}
                                    width={128}
                                    height={128}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            
                            <p className="text-gray-400 text-xs">
                                {lang === 'zh' ? '🏠 芬兰生活分享' : '🏠 Life in Finland'}
                            </p>
                        </div>
                    </motion.div>

                    {/* Tech WeChat */}
                    <motion.div 
                        className="bg-gradient-to-br from-blue-50/10 to-blue-100/10 rounded-xl p-4 md:p-6 border border-blue-300/20 hover:border-blue-300/40 transition-all duration-300 cursor-pointer"
                        onMouseEnter={() => setHoveredCard('tech')}
                        onMouseLeave={() => setHoveredCard(null)}
                        whileHover={{ scale: 1.02, y: -2 }}
                    >
                        <div className="text-center">
                            <div className="flex justify-center mb-3">
                                <div className="bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2">
                                    <span>👨‍💻</span>
                                    <span>{lang === 'zh' ? '技术公众号' : 'TECH ACCOUNT'}</span>
                                </div>
                            </div>
                            
                            <h4 className="text-lg font-bold text-blue-400 mb-1">
                                {lang === 'zh' ? 'Mofie' : 'Mofie Tech'}
                            </h4>
                            <p className="text-blue-300 text-xs mb-3">
                                {lang === 'zh' ? '前端开发 • AI技术 • 编程经验' : 'Frontend • AI • Dev Experience'}
                            </p>
                            
                            <div className="w-32 h-32 mx-auto mb-3 bg-white/10 border border-blue-300/30 rounded-lg overflow-hidden">
                                <Image 
                                    src="/img/qrcode_tech.jpg" 
                                    alt={lang === 'zh' ? '技术公众号二维码' : 'Tech WeChat QR Code'}
                                    width={128}
                                    height={128}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            
                            <p className="text-gray-400 text-xs">
                                {lang === 'zh' ? '🚀 技术灵感与实战' : '🚀 Tech Insights & Practice'}
                            </p>
                        </div>
                    </motion.div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-xs md:text-sm">
                        {lang === 'zh' 
                            ? '扫描二维码关注公众号，获取更多精彩内容' 
                            : 'Scan QR code with WeChat to follow and get more content'}
                    </p>
                    {lang === 'en' && (
                        <p className="text-blue-400 text-xs mt-2">
                            💡 New to WeChat? Download it from your app store and use the scan feature
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
}