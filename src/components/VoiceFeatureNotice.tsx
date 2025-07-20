"use client"

import { useState, useEffect } from 'react';

interface VoiceFeatureNoticeProps {
    lang: 'zh' | 'en';
    hasVoiceCommentary: boolean;
    children: React.ReactNode;
}

export default function VoiceFeatureNotice({ lang, hasVoiceCommentary, children }: VoiceFeatureNoticeProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // 检查是否第一次访问且有语音功能
        if (hasVoiceCommentary) {
            const hasSeenVoiceNotice = localStorage.getItem('voice-feature-notice-seen-v2');
            if (!hasSeenVoiceNotice) {
                // 延迟显示，让页面先加载完成
                setTimeout(() => {
                    setIsVisible(true);
                    setIsAnimating(true);
                }, 1500);
            }
        }
    }, [hasVoiceCommentary]);

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(() => {
            setIsVisible(false);
            localStorage.setItem('voice-feature-notice-seen-v2', 'true');
        }, 300);
    };

    return (
        <div className="relative inline-block">
            {/* 按钮 */}
            {children}
            
            {/* 提示气泡 - 绝对定位不影响布局 */}
            {isVisible && (
                <div 
                    className={`absolute top-1/2 -translate-y-1/2 z-50 transition-all duration-300 ${
                        isAnimating ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                    } 
                    ${/* 桌面版在右侧 */ ''}
                    hidden sm:block sm:left-full sm:ml-3
                    ${/* 移动版在上方 */ ''}
                    block sm:hidden -top-16 left-1/2 -translate-x-1/2`}
                    style={{ whiteSpace: 'nowrap' }}
                >
                    <div className="relative p-3 rounded-xl shadow-2xl backdrop-blur-xl"
                        style={{
                            background: 'linear-gradient(135deg, rgba(16,185,129,0.95) 0%, rgba(5,150,105,0.95) 50%, rgba(4,120,87,0.95) 100%)',
                            border: '1px solid rgba(16,185,129,0.3)',
                            boxShadow: '0 20px 40px rgba(16,185,129,0.3), 0 0 0 1px rgba(16,185,129,0.1)'
                        }}
                    >
                        {/* Close button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200"
                        >
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Content - 移动版更简洁 */}
                        <div className="flex items-start gap-2 pr-4">
                            <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-bold text-xs mb-1 whitespace-nowrap">
                                    {lang === 'zh' ? '🎧 新功能：语音版本' : '🎧 New Feature: Voice Version'}
                                </h3>
                                <p className="text-white/90 text-xs leading-relaxed whitespace-nowrap">
                                    {lang === 'zh' 
                                        ? '点击此按钮收听语音版本'
                                        : 'Click this button to listen'}
                                </p>
                            </div>
                        </div>

                        {/* Arrow - 桌面版向左，移动版向下 */}
                        <div className="absolute sm:top-1/2 sm:-left-2 sm:transform sm:-translate-y-1/2 
                                      -bottom-2 left-1/2 transform -translate-x-1/2 sm:transform-none">
                            {/* 桌面版向左箭头 */}
                            <div className="hidden sm:block w-0 h-0 border-t-4 border-b-4 border-r-8 border-t-transparent border-b-transparent border-r-green-500"></div>
                            {/* 移动版向下箭头 */}
                            <div className="block sm:hidden w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-green-500"></div>
                        </div>

                        {/* Pulse animation */}
                        <div className="absolute inset-0 rounded-xl pointer-events-none">
                            <div className="absolute inset-0 rounded-xl animate-pulse bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}