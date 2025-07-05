"use client";

import { motion, useAnimate, stagger, AnimationSequence } from "motion/react"
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// Global state to track if nav animations have been played
let navAnimationsPlayed = false;

function useMenuAnimation(isOpen: boolean) {
    const [scope, animate] = useAnimate();

    useEffect(() => {
        const menuAnimations: AnimationSequence = isOpen
            ? [
                [
                    "nav",
                    { transform: "translateX(0%)" },
                    { ease: [0.08, 0.65, 0.53, 0.96], duration: 0.4 }
                ],
                [
                    "li",
                    { transform: "scale(1)", opacity: 1, filter: "blur(0px)" },
                    { delay: stagger(0.05), at: "-0.1" }
                ]
            ]
            : [
                ["nav", { transform: "translateX(100%)" }, { at: "-0.1" }],
                [
                    "li",
                    { transform: "scale(0.5)", opacity: 0, filter: "blur(10px)" },
                    { delay: stagger(0.05, { from: "last" }), at: "<" }
                ],

            ];

        animate(menuAnimations);
    }, [isOpen, animate]);
    return scope;
}

function Nav({ lang }: { lang: string }) {
    const [show, setShow] = useState(false);
    const scope = useMenuAnimation(show);
    const pathname = usePathname();
    const hasAnimated = useRef(navAnimationsPlayed);

    const [isChineseUser, setIsChineseUser] = useState(false);

    // Function to check if current path matches the nav item
    const isActive = (path: string) => {
        if (path === `/${lang === "en" ? '' : lang}`) {
            // Home page logic
            return pathname === '/' || pathname === '/zh' || pathname === '/en';
        } else if (path.includes('/blog/')) {
            // Blog pages logic
            return pathname.includes('/blog/');
        } else if (path.includes('/message/')) {
            // Message pages logic
            return pathname.includes('/message/');
        } else if (path.includes('/friends')) {
            // Friends pages logic
            return pathname.includes('/friends');
        } else if (path.includes('/tools')) {
            // Tools pages logic
            return pathname.includes('/tools');
        }
        return false;
    };

    useEffect(() => {
        // Mark animations as played after first render
        if (!navAnimationsPlayed) {
            navAnimationsPlayed = true;
            hasAnimated.current = true;
        }
        
        setTimeout(() => {
            const _isChineseUser =
                [navigator.language, ...(navigator.languages || [])]
                    .map(lang => lang?.toLowerCase?.())
                    .some(lang => lang?.startsWith('zh'));
            const _isEnglishDisplay = lang === 'en'
            const langPromptShown = localStorage.getItem('lang_prompt_shown') === 'true';

            const chineseUserShowTips = _isChineseUser && _isEnglishDisplay && !langPromptShown
            const nonChineseUserShowTips = !_isChineseUser && !_isEnglishDisplay && !langPromptShown

            if (chineseUserShowTips || nonChineseUserShowTips) {
                setIsChineseUser(true)
            }
        }, 3000)
    }, [lang])

    return (
        <div ref={scope} >
            {isChineseUser && (
                <motion.div
                    className="fixed top-18 right-4 w-[22rem] max-w-[90vw] z-[100] 
                bg-[#f05a54]/100 text-white px-4 py-3 rounded-lg 
                shadow-lg backdrop-blur-sm   transition-all "
                    initial={{ scale: 1, opacity: 0.5, }}
                    animate={{ scale: 1, opacity: 1, transition: { duration: 0.5 } }}

                >
                    <p className="leading-relaxed">
                        {
                            lang == 'zh' ?
                                "Looks like you landed on the Chinese side of Mofei. Want to switch back to familiar grounds? 😉" :
                                "Mofei 猜你可能会中文，母语总是更亲切一些。要不要切换试试看？😉"
                        }
                    </p>
                    <div className="mt-2 flex justify-end gap-3">
                        <button
                            className="underline transition hover:text-yellow-300"
                            onClick={() => {
                                const pathname = location.pathname;
                                if (pathname == '/') {
                                    location.href = '/zh'
                                } else if (pathname == '/zh') {
                                    location.href = '/'
                                } else {
                                    const newUrl = pathname.startsWith('/zh') ?
                                        pathname.replace(/^\/zh/, '/en') :
                                        pathname.replace(/^\/en/, '/zh');
                                    location.href = newUrl;
                                }
                                localStorage.setItem('lang_prompt_shown', 'true');
                            }}
                            aria-label={lang == 'zh' ? "Switch to Chinese" : "切换为中文"}
                        >
                            {lang == 'zh' ? "Switch to English" : "切换为中文"}
                        </button>
                        <button
                            className="transition hover:text-gray-300"
                            onClick={() => {
                                setIsChineseUser(false)
                                localStorage.setItem('lang_prompt_shown', 'true');
                            }}
                            aria-label={lang == 'zh' ? "Close" : "关闭"}
                        >
                            {lang == 'zh' ? "Close" : "关闭"}

                        </button>
                    </div>
                </motion.div>

            )}
            <div className="fixed  w-full h-20 2xl:h-22 top-0 backdrop-blur-sm z-50 "
                style={{
                    backgroundImage: 'radial-gradient(transparent 1px, #000000 1px)',
                    backgroundSize: '4px 4px',
                    mask: 'linear-gradient(rgb(0, 0, 0) 70%, rgba(0, 0, 0, 0) 100%)',
                }} />
            <motion.div
                className="fixed z-60
                    left-5 top-5
                    2xl:left-10  2xl:top-5"
                initial={hasAnimated.current ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, transition: hasAnimated.current ? { duration: 0 } : { type: "spring", damping: 10, stiffness: 200 } }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", }}
            >
                <Link className="flex" href="/">
                    <Image src="/img/mofei-logo.svg" alt="嘿, 我是Mofei!" className="h-8 md:h-10" width={140} height={160} />
                </Link>
            </motion.div>


            {/* Desktop Menu - Hidden on mobile */}
            <motion.div
                className="fixed right-5 top-3 z-60 hidden lg:flex items-center gap-6 text-white text-lg
                    2xl:right-10 2xl:top-5 2xl:text-xl"
                initial={hasAnimated.current ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, transition: hasAnimated.current ? { duration: 0 } : { type: "spring", damping: 10, stiffness: 200 } }}
            >
                <motion.a 
                    className={`transition-colors duration-200 flex items-center gap-1 ${
                        isActive(`/${lang === "en" ? '' : lang}`) 
                            ? 'text-[#ff5555] font-medium' 
                            : 'hover:text-[#ff5555]'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    href={`/${lang === "en" ? '' : lang}`}
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                    </svg>
                    {lang == 'zh' ? '首页' : 'Home'}
                </motion.a>
                <motion.a 
                    className={`transition-colors duration-200 flex items-center gap-1 ${
                        isActive(`/${lang}/blog/1`) 
                            ? 'text-[#ff5555] font-medium' 
                            : 'hover:text-[#ff5555]'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    href={`/${lang}/blog/1`}
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                    </svg>
                    {lang == 'zh' ? '博客' : 'Blog'}
                </motion.a>
                <motion.a 
                    className={`transition-colors duration-200 flex items-center gap-1 ${
                        isActive(`/${lang}/message/1`) 
                            ? 'text-[#ff5555] font-medium' 
                            : 'hover:text-[#ff5555]'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    href={`/${lang}/message/1`}
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M20,16H6L4,18V4H20V16Z"/>
                    </svg>
                    {lang == 'zh' ? '留言' : 'Message'}
                </motion.a>
                <motion.a 
                    className={`transition-colors duration-200 flex items-center gap-1 ${
                        isActive(`/${lang}/friends`) 
                            ? 'text-[#ff5555] font-medium' 
                            : 'hover:text-[#ff5555]'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    href={`/${lang}/friends`}
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    {lang == 'zh' ? '友链' : 'Friends'}
                </motion.a>
                <motion.a 
                    className={`transition-colors duration-200 flex items-center gap-1 ${
                        isActive(`/${lang}/tools`) 
                            ? 'text-[#ff5555] font-medium' 
                            : 'hover:text-[#ff5555]'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    href={`/${lang}/tools`}
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
                    </svg>
                    {lang == 'zh' ? '工具' : 'Tools'}
                </motion.a>
                <motion.a 
                    className="hover:text-[#ff5555] transition-colors duration-200 flex items-center gap-1" 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    href="https://github.com/zmofei/mofei-life-web"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    {lang == 'zh' ? '源码' : 'Code'}
                </motion.a>
                <motion.button 
                    className="hover:text-[#ff5555] transition-colors duration-200 cursor-pointer flex items-center gap-1" 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        if (location.pathname == '/zh') {
                            location.href = '/'
                        } else if (location.pathname == '/') {
                            location.href = '/zh'
                        } else if (lang == 'zh') {
                            location.href = location.href.replace('/zh', '/en')
                        } else {
                            location.href = location.href.replace('/en', '/zh')
                        }
                        document.cookie = `lang=${lang == 'zh' ? 'en' : 'zh'}; path=/; max-age=${3600 * 24 * 365 * 10}`;
                    }}
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.87,15.07L10.33,12.56L10.36,12.53C12.1,10.59 13.34,8.36 14.07,6H17V4H10V2H8V4H1V6H12.17C11.5,7.92 10.44,9.75 9,11.35C8.07,10.32 7.3,9.19 6.69,8H4.69C5.42,9.63 6.42,11.17 7.67,12.56L2.58,17.58L4,19L9,14L12.11,17.11L12.87,15.07Z"/>
                    </svg>
                    {lang == 'zh' ? 'English' : '中文'}
                </motion.button>
            </motion.div>

            {/* Mobile Menu Button - Only visible on mobile */}
            <motion.button
                layout
                initial={hasAnimated.current ? 
                    { backgroundColor: show ? "#ff5555" : '', scale: 1, opacity: 1 } : 
                    { backgroundColor: show ? "#ff5555" : '', scale: 0.5, opacity: 0 }
                }
                animate={{ scale: 1, opacity: 1, transition: hasAnimated.current ? { duration: 0 } : { type: "spring", damping: 10, stiffness: 200 } }}
                whileHover={{ scale: 1.2, backgroundColor: "#ff5555", rotate: 3 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", damping: 17, stiffness: 200 }}
                className={`fixed rounded-full p-2 px-4 z-60 lg:hidden
                    ${(show ? "bg-[#ff5555]" : "")}
                    right-5 top-3 text-xl  -mr-4 
                    2xl:right-10 2xl:top-5 md:text-2xl md:-mr-2 
                `}
                onClick={() => {
                    setShow(!show)
                }}
            >
                <svg viewBox="0 0 1024 1024" className="inline-block align-middle" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8282" width="23" height="23">
                    <path d="M867.995 459.647h-711.99c-27.921 0-52.353 24.434-52.353 52.353s24.434 52.353 52.353 52.353h711.99c27.921 0 52.353-24.434 52.353-52.353s-24.434-52.353-52.353-52.353z" p-id="8283" fill="#ffffff"></path><path d="M867.995 763.291h-711.99c-27.921 0-52.353 24.434-52.353 52.353s24.434 52.353 52.353 52.353h711.99c27.921 0 52.353-24.434 52.353-52.353s-24.434-52.353-52.353-52.353z" p-id="8284" fill="#ffffff"></path><path d="M156.005 260.709h711.99c27.921 0 52.353-24.434 52.353-52.353s-24.434-52.353-52.353-52.353h-711.99c-27.921 0-52.353 24.434-52.353 52.353s24.434 52.353 52.353 52.353z" p-id="8285" fill="#ffffff" />
                </svg>
                <span className="inline-block align-middle ml-2">
                    {lang == 'zh' ? (show ? "关闭" : "菜单") : (show ? "Close" : "Menu")}
                </span>
            </motion.button>

            <nav className="fixed top-0 right-0 bottom-0 will-change-transform z-55" style={{
                transform: "translateX(100%)"
            }}>
                <ul className=" bg-[#ff5555] h-full text-right pl-20 
                text-2xl pt-12 pr-5
                md:text-4xl md:pt-20 md:pr-10
                ">
                    <li className="py-3 md:py-4" style={{ "transformOrigin": "top right" }}>
                        <motion.a 
                            className={`flex items-center gap-2 ${
                                isActive(`/${lang === "en" ? '' : lang}`) 
                                    ? 'font-bold text-white drop-shadow-lg' 
                                    : 'text-white/90'
                            }`}
                            whileHover={{ scale: 1.2, rotate: 3 }} 
                            href={`/${lang === "en" ? '' : lang}`}
                        >
                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                            </svg>
                            {lang == 'zh' ? '首页' : 'Home'}
                        </motion.a>
                    </li>
                    <li className="py-3 md:py-4" style={{ "transformOrigin": "top right" }}>
                        <motion.a 
                            className={`flex items-center gap-2 ${
                                isActive(`/${lang}/blog/1`) 
                                    ? 'font-bold text-white drop-shadow-lg' 
                                    : 'text-white/90'
                            }`}
                            whileHover={{ scale: 1.2, rotate: -3 }} 
                            href={`/${lang}/blog/1`}
                        >
                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                            </svg>
                            {lang == 'zh' ? '博客' : 'Blog'}
                        </motion.a>
                    </li>
                    <li className="py-3 md:py-4" style={{ "transformOrigin": "top right" }}>
                        <motion.a 
                            className={`flex items-center gap-2 ${
                                isActive(`/${lang}/message/1`) 
                                    ? 'font-bold text-white drop-shadow-lg' 
                                    : 'text-white/90'
                            }`}
                            whileHover={{ scale: 1.2, rotate: 3 }} 
                            href={`/${lang}/message/1`}
                        >
                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M20,16H6L4,18V4H20V16Z"/>
                            </svg>
                            {lang == 'zh' ? '留言' : 'Message'}
                        </motion.a>
                    </li>
                    <li className="py-3 md:py-4" style={{ "transformOrigin": "top right" }}>
                        <motion.a 
                            className={`flex items-center gap-2 ${
                                isActive(`/${lang}/friends`) 
                                    ? 'font-bold text-white drop-shadow-lg' 
                                    : 'text-white/90'
                            }`}
                            whileHover={{ scale: 1.2, rotate: -3 }} 
                            href={`/${lang}/friends`}
                        >
                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                            {lang == 'zh' ? '友链' : 'Friends'}
                        </motion.a>
                    </li>
                    <li className="py-3 md:py-4" style={{ "transformOrigin": "top right" }}>
                        <motion.a 
                            className={`flex items-center gap-2 ${
                                isActive(`/${lang}/tools`) 
                                    ? 'font-bold text-white drop-shadow-lg' 
                                    : 'text-white/90'
                            }`}
                            whileHover={{ scale: 1.2, rotate: 3 }} 
                            href={`/${lang}/tools`}
                        >
                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
                            </svg>
                            {lang == 'zh' ? '工具' : 'Tools'}
                        </motion.a>
                    </li>
                    <li className="py-3 md:py-4" style={{ "transformOrigin": "top right" }}>
                        <motion.a 
                            className="flex items-center gap-2 text-white/90" 
                            whileHover={{ scale: 1.2, rotate: 3 }} 
                            href="https://github.com/zmofei/mofei-life-web"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            {lang == 'zh' ? '源码' : 'Code'}
                        </motion.a>
                    </li>
                    <li className="py-3 md:py-4" style={{ "transformOrigin": "top right" }}>
                        <motion.a className="flex items-center gap-2" whileHover={{ scale: 1.2, rotate: -3 }} onClick={() => {
                            if (location.pathname == '/zh') {
                                location.href = '/'
                            } else if (location.pathname == '/') {
                                location.href = '/zh'
                            } else if (lang == 'zh') {
                                location.href = location.href.replace('/zh', '/en')
                            } else {
                                location.href = location.href.replace('/en', '/zh')
                            }
                            document.cookie = `lang=${lang == 'zh' ? 'en' : 'zh'}; path=/; max-age=${3600 * 24 * 365 * 10}`;
                        }}>
                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12.87,15.07L10.33,12.56L10.36,12.53C12.1,10.59 13.34,8.36 14.07,6H17V4H10V2H8V4H1V6H12.17C11.5,7.92 10.44,9.75 9,11.35C8.07,10.32 7.3,9.19 6.69,8H4.69C5.42,9.63 6.42,11.17 7.67,12.56L2.58,17.58L4,19L9,14L12.11,17.11L12.87,15.07Z"/>
                            </svg>
                            {lang == 'zh' ? 'English' : '中文'}
                        </motion.a>
                    </li>
                </ul>
            </nav>
        </div >
    )
}

export default Nav;