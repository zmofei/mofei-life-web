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
                    className={`transition-colors duration-200 ${
                        isActive(`/${lang === "en" ? '' : lang}`) 
                            ? 'text-[#ff5555] font-medium' 
                            : 'hover:text-[#ff5555]'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    href={`/${lang === "en" ? '' : lang}`}
                >
                    {lang == 'zh' ? '首页' : 'Home'}
                </motion.a>
                <motion.a 
                    className={`transition-colors duration-200 ${
                        isActive(`/${lang}/blog/1`) 
                            ? 'text-[#ff5555] font-medium' 
                            : 'hover:text-[#ff5555]'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    href={`/${lang}/blog/1`}
                >
                    {lang == 'zh' ? '博客' : 'Blog'}
                </motion.a>
                <motion.a 
                    className={`transition-colors duration-200 ${
                        isActive(`/${lang}/message/1`) 
                            ? 'text-[#ff5555] font-medium' 
                            : 'hover:text-[#ff5555]'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    href={`/${lang}/message/1`}
                >
                    {lang == 'zh' ? '留言' : 'Message'}
                </motion.a>
                <motion.button 
                    className="hover:text-[#ff5555] transition-colors duration-200 cursor-pointer" 
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
                            className={`inline-block ${
                                isActive(`/${lang === "en" ? '' : lang}`) 
                                    ? 'font-bold text-white drop-shadow-lg' 
                                    : 'text-white/90'
                            }`}
                            whileHover={{ scale: 1.2, rotate: 3 }} 
                            href={`/${lang === "en" ? '' : lang}`}
                        >
                            {lang == 'zh' ? '首页' : 'Home'}
                        </motion.a>
                    </li>
                    <li className="py-3 md:py-4" style={{ "transformOrigin": "top right" }}>
                        <motion.a 
                            className={`inline-block ${
                                isActive(`/${lang}/blog/1`) 
                                    ? 'font-bold text-white drop-shadow-lg' 
                                    : 'text-white/90'
                            }`}
                            whileHover={{ scale: 1.2, rotate: -3 }} 
                            href={`/${lang}/blog/1`}
                        >
                            {lang == 'zh' ? '博客' : 'Blog'}
                        </motion.a>
                    </li>
                    <li className="py-3 md:py-4" style={{ "transformOrigin": "top right" }}>
                        <motion.a 
                            className={`inline-block ${
                                isActive(`/${lang}/message/1`) 
                                    ? 'font-bold text-white drop-shadow-lg' 
                                    : 'text-white/90'
                            }`}
                            whileHover={{ scale: 1.2, rotate: 3 }} 
                            href={`/${lang}/message/1`}
                        >
                            {lang == 'zh' ? '留言' : 'Message'}
                        </motion.a>
                    </li>
                    <li className="py-3 md:py-4" style={{ "transformOrigin": "top right" }}>
                        <motion.a className="inline-block" whileHover={{ scale: 1.2, rotate: -3 }} onClick={() => {
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
                        }}>{lang == 'zh' ? 'English' : '中文'}</motion.a>
                    </li>
                </ul>
            </nav>
        </div >
    )
}

export default Nav;