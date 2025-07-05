"use client"
import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import SparklesText from "@/components/ui/sparkles-text";
import PulsatingButton from "@/components/ui/pulsating-button";



import { cn } from "@/lib/utils";



const Danmaku = () => {



    const colors = [
        { bg: 'bg-yellow-400', tx: 'text-black' }, // 黄色背景 + 黑色文字
        { bg: 'bg-red-500', tx: 'text-white' },   // 红色背景 + 白色文字
        { bg: 'bg-green-500', tx: 'text-white' }, // 绿色背景 + 白色文字
        { bg: 'bg-blue-500', tx: 'text-white' },  // 蓝色背景 + 白色文字
        { bg: 'bg-purple-500', tx: 'text-white' },// 紫色背景 + 白色文字
        { bg: 'bg-pink-400', tx: 'text-black' },  // 粉色背景 + 黑色文字
        { bg: 'bg-teal-400', tx: 'text-black' },  // 青绿色背景 + 黑色文字
        { bg: 'bg-orange-300', tx: 'text-black' },// 橙色背景 + 黑色文字
        { bg: 'bg-red-400', tx: 'text-white' },   // 浅红色背景 + 白色文字
        { bg: 'bg-cyan-400', tx: 'text-black' },  // 浅青色背景 + 黑色文字
        { bg: 'bg-amber-200', tx: 'text-black' }, // 琥珀色背景 + 黑色文字
        { bg: 'bg-rose-500', tx: 'text-white' },  // 玫瑰红背景 + 白色文字
        { bg: 'bg-lime-500', tx: 'text-black' },  // 酸橙色背景 + 黑色文字
        { bg: 'bg-indigo-600', tx: 'text-white' },// 靛蓝背景 + 白色文字
        { bg: 'bg-fuchsia-500', tx: 'text-white' },// 紫红背景 + 白色文字
        { bg: 'bg-gray-300', tx: 'text-black' },  // 浅灰背景 + 黑色文字
        { bg: 'bg-sky-500', tx: 'text-white' },   // 天空蓝背景 + 白色文字
        { bg: 'bg-emerald-500', tx: 'text-white' } // 翡翠绿背景 + 白色文字
    ]

    const handleClick = () => {
        const end = Date.now() + 3 * 1000; // 3 seconds
        const colors = ["#FFEE58", "#FF82AC", "#4FFFB0", "#6FCFFF", "#FF7D7D", "#DFFF5F", "#FFAA33", "#E68FFF"];

        const frame = () => {
            if (Date.now() > end) return;

            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                startVelocity: 80,
                origin: { x: 0, y: 0.5 },
                colors: colors,
                scalar: 2
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                startVelocity: 80,
                origin: { x: 1, y: 0.5 },
                colors: colors,
                scalar: 2
            });

            requestAnimationFrame(frame);
        };

        frame();
    };

    const [messageQueue, setMessageQueue] = useState<Message[]>([]);

    useEffect(() => {
        const fetchAllMessages = async () => {
            try {
                const response = await fetch('https://eu.finshare.fi/api/finshare/wall/lottery_message');
                const data = await response.json();
                console.log('Fetched all messages:', data);
                setMessageQueue(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    data.map((item: any) => ({
                        id: item.id,
                        content: JSON.stringify({ message: item.text }) // Transform to include 'content'
                    }))
                );
            } catch (error) {
                console.error('Failed to fetch all messages:', error);
            }
        };
        fetchAllMessages();
    }, []);



    // 添加弹幕
    const addMessage = (message: Message, luckone = false) => {
        console.log('message', message);
        setMessages((prev) => {
            console.log("prev", prev);
            return [...prev, {
                ...message,
                animate_id: `${message.id}+${Math.random()}`,
                luckone,
                speed: Math.random() * 20 + 30, // 速度
                bg: colors[Math.floor(Math.random() * colors.length)]
            }];
        });
    };

    interface Message {
        animate_id: string;
        id: number;
        text: string;
        luckone: boolean;
        speed: number;
        bg: { bg: string; tx: string };
    }

    const [messages, setMessages] = useState<Message[]>([]); // 存储弹幕列表
    const [start, setStart] = useState(true); // 控制弹幕的开始和暂停
    const [winningNumber, setWinningNumber] = useState<number | null>(0); // 中奖号码


    // mock自动添加弹幕
    useEffect(() => {
        const interval = setInterval(() => {
            if (start && messageQueue.length > 0) {
                addMessage(messageQueue[Math.floor(Math.random() * messageQueue.length)]);
            }
        }, 200); // 每2秒添加一条弹幕
        return () => clearInterval(interval);
                addMessage(messageQueue[Math.floor(Math.random() * messageQueue.length)], false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [start, messageQueue]);

    const handleAnimationEnd = (msgId: number) => {
        // 移除动画结束的消息
        setMessages((prev) => prev.filter((msg) => msg.id !== msgId));
    };

    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        // 设置视频播放速度
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.8; // 0.5 倍速播放
        }
    }, []);

    return (

        <div className="absolute w-full h-full bg-cover bg-center backdrop-blur-lg overflow-hidden">
            <video
                ref={videoRef}
                className="absolute top-0 left-0 w-full h-full object-cover"
                src="https://assets-eu.mofei.life/video/chinesenewyear-bg.mp4"
                autoPlay
                loop
                muted
                playsInline
            ></video>
            {/* 粒子背景 */}
            <div className="absolute top-0 left-0 w-full h-full bg-red/80 z-[1] overlay" />


            <style jsx>{`
                @keyframes flicker {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.6; }
                    }

                    .overlay {
                    background-image: radial-gradient(transparent 1px, #0f1115 1px);
                    background-size: 4px 4px; /* 控制点的大小和间距 */
                    backdrop-filter: blur(3px);
                }
                `}</style>
            {/* 弹幕展示 */}
            {messages.map((msg) => (
                <div
                    className="max-w-full"
                    key={`${msg.animate_id}`}
                    style={{
                        animation: `${(msg.luckone ? "luckone" : "roll")} ${(msg.luckone ? "2" : "1")}s  forwards`,
                        zIndex: 2,
                        position: "absolute",
                        left: "50%",
                        whiteSpace: "nowrap",
                        willChange: "transform, opacity",
                        color: "white",
                        fontSize: "18px",
                        top: `50%`, // 随机分布在屏幕的不同高度
                        transform: `translate(-50%, -50%)`,
                    }}
                    onAnimationEnd={() => {
                        if (!msg.luckone) {
                            handleAnimationEnd(msg.id);
                        }
                    }}
                >
                    <p className="text-center">
                        <span className={`inline-flex items-center rounded-full p-4 text-5xl shadow-lg max-w-full overflow-hidden break-words text-ellipsis font-medium ${msg.bg.tx} ${msg.bg.bg}`}>
                            {msg.text}
                        </span>
                        <br />

                        <span className="text-3xl">Ticket Number: <b>🎟️ {msg.id}</b></span>
                    </p>
                </div>
            ))}
            <style jsx>{`
                  @keyframes roll {
                    0% {
                        transform: perspective(1000px) translateY(300%) translateX(-50%) rotateX(-60deg);
                        opacity: 0;
                    }

                    50% {
                        transform: perspective(1000px) translateY(-200%) translateX(-50%)  rotateX(0deg);
                        opacity: 1;
                        scale: 1.2;
                    }


                    100% {
                        transform: perspective(1000px) translateY(-400%) translateX(-50%) rotateX(60deg);
                        opacity: 0;
                    }
                    }

                    @keyframes luckone {
                    0% {
                        transform: perspective(1000px) translateY(300%) translateX(-50%) rotateX(-60deg);
                        opacity: 0;
                    }

                    50% {
                        transform: perspective(1000px) translateY(-200%) translateX(-50%)  rotateX(0deg);
                        opacity: 1;
                        scale: 1.2;
                    }


                    80% {
                        transform: perspective(1000px) translateY(-200%) translateX(-50%)  rotateX(0deg);
                        opacity: 1;
                        scale: 2;
                        
                    }
                        100% {
                        transform: perspective(1000px) translateY(-200%) translateX(-50%)  rotateX(0deg);
                        opacity: 1;
                        scale: 1.5;
                        
                    }
                    }
                `}</style>
            <div className="z-10 relative top-40 text-center">

                <h1
                    className={cn(
                        `inline font-extrabold text-6xl animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
                    )}
                >
                    <SparklesText className="text-6xl font-extrabold text-white" text="🎉 Lucky Draw 🎁" />
                </h1>

            </div>

            {winningNumber != undefined && (
                <div className="z-10 absolute text-center w-full transform transition-transform duration-300 bottom-[15%]">
                    🎟️ Winning Number: <span className="text-red-400">{winningNumber}</span>
                </div>
            )}

            <div className={`z-10 absolute text-center w-full transform transition-transform duration-300 bottom-[15%]`}>
                <PulsatingButton
                    className=" inline-block px-8 py-4 text-4xl font-bold text-white rounded-xl bg-gradient-to-r from-red-500 to-orange-500 hover:from-orange-500 hover:to-red-500 shadow-lg transform transition-transform duration-300 hover:scale-105 active:scale-95"
                    onClick={() => {
                        if (start) {
                            handleClick();
                            addMessage(messageQueue[Math.floor(Math.random() * messageQueue.length)], true);
                            setWinningNumber(messageQueue[Math.floor(Math.random() * messageQueue.length)].id)
                        } else {
                            setMessages([]);
                            setWinningNumber(null);
                        }
                        setStart(!start);
                    }}
                >
                    {start ? "Who is the lucky one? 🎊" : "Next lucky one 🍀"}
                </PulsatingButton>
            </div>
        </div >
    );
};

export default Danmaku;