"use client"

import { useState, useEffect } from 'react';

const VideoBackground = ({ isFullPage = false }: { isFullPage?: boolean }) => {
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [showVideo, setShowVideo] = useState(false);

    useEffect(() => {
        // 延迟加载视频以提高初始加载速度
        const timer = setTimeout(() => {
            setShowVideo(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);
    if (isFullPage) {
        return (
            <>
                {showVideo && (
                    <video
                        className="fixed top-0 left-0 w-full h-full object-cover z-[-10]"
                        id="bgvid"
                        autoPlay
                        loop
                        muted
                        playsInline
                        poster="//cdn.zhuwenlong.com/image/index/cover-820e030cca.jpg"
                        onLoadedData={() => setVideoLoaded(true)}
                        preload="metadata"
                    >
                        <source src="//cdn.zhuwenlong.com/video/bgvideo-0c73e2c57a.mp4" type="video/mp4" />
                        <source src="//cdn.zhuwenlong.com/video/bgvideo-513397179e.webm" type="video/webm" />
                        <source src="//cdn.zhuwenlong.com/video/bgvideo-5428b1617d.ogv" type="video/ogg" />
                    </video>
                )}
                
                {/* 显示封面图直到视频加载完成 */}
                {!videoLoaded && (
                    <div 
                        className="fixed top-0 left-0 w-full h-full bg-cover bg-center z-[-10]"
                        style={{
                            backgroundImage: 'url(//cdn.zhuwenlong.com/image/index/cover-820e030cca.jpg)'
                        }}
                    />
                )}
                <div className="fixed top-0 left-0 w-full h-full bg-black/30 z-[-9] overlay">
                    {/* 全页面粒子背景 */}
                </div>

                <style jsx>{`
                    .overlay {
                        background-image: radial-gradient(transparent 1px, rgba(15, 17, 21, 0.4) 1px);
                        background-size: 4px 4px;
                        backdrop-filter: blur(1px);
                    }
                `}</style>
            </>
        )
    }

    return (
        <>
            {showVideo && (
                <video
                    className="absolute top-0 left-0 w-full h-full object-cover -z-10"
                    id="bgvid"
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster="//cdn.zhuwenlong.com/image/index/cover-820e030cca.jpg"
                    onLoadedData={() => setVideoLoaded(true)}
                    preload="metadata"
                >
                    <source src="//cdn.zhuwenlong.com/video/bgvideo-0c73e2c57a.mp4" type="video/mp4" />
                    <source src="//cdn.zhuwenlong.com/video/bgvideo-513397179e.webm" type="video/webm" />
                    <source src="//cdn.zhuwenlong.com/video/bgvideo-5428b1617d.ogv" type="video/ogg" />
                </video>
            )}
            
            {/* 显示封面图直到视频加载完成 */}
            {!videoLoaded && (
                <div 
                    className="absolute top-0 left-0 w-full h-full bg-cover bg-center -z-10"
                    style={{
                        backgroundImage: 'url(//cdn.zhuwenlong.com/image/index/cover-820e030cca.jpg)'
                    }}
                />
            )}
            <div className="absolute top-0 left-0 w-full h-full bg-black/70 z-[1] overlay">
                {/* 粒子背景 */}
            </div>

            <style jsx>{`
                .overlay {
                    background-image: radial-gradient(transparent 1px, #0f1115 1px);
                    background-size: 4px 4px; /* 控制点的大小和间距 */
                    backdrop-filter: blur(3px);
                }
                `}</style>
        </>)
}

export default VideoBackground;