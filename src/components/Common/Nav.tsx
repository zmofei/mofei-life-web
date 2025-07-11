"use client";

import { useAnimate, stagger, AnimationSequence } from "motion/react"
import { useState, useEffect, useRef, useMemo } from "react";
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
                    { opacity: 1, filter: "blur(0px)" },
                    { delay: stagger(0.05), at: "-0.1" }
                ]
            ]
            : [
                ["nav", { transform: "translateX(100%)" }, { at: "-0.1" }],
                [
                    "li",
                    { opacity: 0, filter: "blur(10px)" },
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

    // 提取公共样式类
    const mobileNavItemClass = "flex items-center justify-end gap-2 text-right";
    // const desktopNavItemClass = "transition-colors duration-200 flex items-center gap-1";

    // 优化 isActive 函数性能
    const isActive = useMemo(() => {
        return (path: string) => {
            if (path === `/${lang === "en" ? '' : lang}`) {
                return pathname === '/' || pathname === '/zh' || pathname === '/en';
            } else if (path.includes('/blog/')) {
                return pathname.includes('/blog/');
            } else if (path.includes('/message/')) {
                return pathname.includes('/message/');
            } else if (path.includes('/friends')) {
                return pathname.includes('/friends');
            } else if (path.includes('/tools')) {
                return false;
            }
            return false;
        };
    }, [pathname, lang]);

    // 导航项数据
    const navItems = useMemo(() => [
        {
            href: `/${lang === "en" ? '' : lang}`,
            label: { zh: '首页', en: 'Home' },
            icon: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
            rotate: 3
        },
        {
            href: `/${lang}/blog/1`,
            label: { zh: '博客', en: 'Blog' },
            icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z",
            rotate: -3
        },
        {
            href: `/${lang}/message/1`,
            label: { zh: '留言', en: 'Message' },
            icon: "M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z",
            rotate: 3
        },
        {
            href: `/${lang}/friends`,
            label: { zh: '友链', en: 'Friends' },
            icon: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
            rotate: -3
        },
        {
            href: lang === 'zh' ? 'https://tools.mofei.life/zh/' : 'https://tools.mofei.life/',
            label: { zh: '工具', en: 'Tools' },
            icon: "M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z",
            external: true,
            rotate: 3
        },
        {
            href: "https://github.com/zmofei/mofei-life-web",
            label: { zh: '源码', en: 'Code' },
            icon: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z",
            external: true,
            rotate: 3
        }
    ], [lang]);

    // 外链图标组件
    const ExternalIcon = () => (
        <svg className="w-4 h-4 opacity-60" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
        </svg>
    );

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
                <div
                    className="fixed top-18 right-4 w-[22rem] max-w-[90vw] z-[100] 
                bg-[#f05a54]/100 text-white px-4 py-3 rounded-lg 
                shadow-lg backdrop-blur-sm   transition-all "


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
                </div>

            )}
            <div className="fixed w-full h-20 2xl:h-22 top-0 z-50 flex items-center justify-between px-5 2xl:px-10">

                {/* Logo */}
                <div
                    className="z-60"

                >
                    <Link className="flex" href="/">
                        <Image src="/img/mofei-logo.svg" alt="嘿, 我是Mofei!" className="h-8 md:h-10" width={140} height={160} />
                    </Link>
                </div>

                {/* Desktop Menu - Hidden on mobile */}
                <div
                    className="hidden lg:flex items-center gap-3 text-white text-sm 2xl:text-base px-4 py-2 rounded-full border border-white/20"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.05) 100%)',
                        backdropFilter: 'blur(15px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(15px) saturate(180%)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)'
                    }}

                >
                    {/* 桌面端也使用数据驱动 */}
                    {navItems.map((item, index) => (
                        <a
                            key={index}
                            className={`px-3 py-1.5 rounded-full transition-all duration-300 flex items-center gap-2 ${item.external ? 'hover:bg-white/20 hover:text-white' :
                                isActive(item.href)
                                    ? 'bg-white/25 text-white font-medium shadow-lg'
                                    : 'hover:bg-white/15 hover:text-white'
                                }`}
                            style={{
                                background: isActive(item.href)
                                    ? 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.15) 100%)'
                                    : 'transparent'
                            }}

                            href={item.href}
                            {...(item.external && {
                                target: "_blank",
                                rel: "noopener noreferrer",
                                title: lang === 'zh' ? '在新窗口打开' : 'Open in new window'
                            })}
                            aria-label={`${item.label[lang as 'zh' | 'en']}${item.external ? (lang === 'zh' ? '（外部链接）' : ' (external link)') : ''}`}
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d={item.icon} />
                            </svg>
                            <span className={item.external ? "flex items-center gap-1" : ""}>
                                {item.label[lang as 'zh' | 'en']}
                                {item.external && (
                                    <svg className="w-3 h-3 opacity-60" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                                    </svg>
                                )}
                            </span>
                        </a>
                    ))}

                    {/* 分隔线 */}
                    <div className="w-px h-6 bg-white/20"></div>

                    <button
                        className="relative inline-flex items-center h-7 w-14 rounded-full cursor-pointer transition-all duration-300"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                        }}

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
                        <div
                            className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center"
                        >
                            <span className="text-xs font-bold text-gray-800">
                                {lang === 'zh' ? '中' : 'EN'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between w-full px-2 text-xs font-medium text-white">
                            <span className={`transition-opacity duration-200 ${lang === 'zh' ? 'opacity-100' : 'opacity-40'}`}>中</span>
                            <span className={`transition-opacity duration-200 ${lang === 'zh' ? 'opacity-40' : 'opacity-100'}`}>EN</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Button - Only visible on mobile */}
            <button
                className="fixed rounded-full p-2 px-4 z-60 lg:hidden right-5 top-3 text-xl 2xl:right-10 2xl:top-5 md:text-2xl"
                style={{
                    background: show
                        ? 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                    backdropFilter: 'blur(20px) saturate(200%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(200%)',
                    boxShadow: show
                        ? '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                        : '0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.18)'
                }}
                aria-expanded={show}
                aria-label={lang === 'zh' ? '导航菜单' : 'Navigation menu'}
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
            </button>

            <nav className="fixed top-0 right-0 bottom-0 will-change-transform z-55" style={{
                transform: "translateX(100%)"
            }}>
                <ul className="h-full text-right pl-12 
                text-xl pt-18
                sm:text-2xl sm:pt-14 sm:pl-14 sm:mt-3
                md:text-4xl md:pt-20 md:pl-16 md:mt-4
                "
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                        backdropFilter: 'blur(30px) saturate(200%)',
                        WebkitBackdropFilter: 'blur(30px) saturate(200%)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                        border: '1px solid rgba(255,255,255,0.18)'
                    }}>
                    {/* 语言切换按钮移到顶部 */}
                    <li className="py-2 sm:py-3 md:py-4 mb-2 sm:mb-4 pr-6 md:pr-10" style={{ "transformOrigin": "top right" }}>
                        <button
                            className="inline-flex items-center justify-center gap-2 h-8 w-16 sm:h-10 sm:w-18 md:h-12 md:w-20 rounded-xl sm:rounded-2xl cursor-pointer ml-auto transition-all duration-300"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                                backdropFilter: 'blur(15px) saturate(150%)',
                                WebkitBackdropFilter: 'blur(15px) saturate(150%)',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
                                border: '1px solid rgba(255,255,255,0.2)'
                            }}

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
                            aria-label={lang === 'zh' ? '切换到英文' : 'Switch to Chinese'}
                        >
                            <span className={`text-xs sm:text-sm font-medium transition-all duration-300 ${lang === 'zh' ? 'text-white' : 'text-white/60'}`}>中</span>
                            <span className={`text-xs sm:text-sm font-medium transition-all duration-300 ${lang === 'zh' ? 'text-white/60' : 'text-white'}`}>EN</span>
                        </button>
                    </li>
                    {/* 使用数据驱动的方式渲染导航项 */}
                    {navItems.map((item, index) => (
                        <li key={index} className="py-2 sm:py-3 md:py-4 pr-6 md:pr-10 pl-3 sm:pl-4" style={{ "transformOrigin": "top right" }}>
                            <a
                                className={`${mobileNavItemClass} ${item.external ? 'text-white/90' :
                                    isActive(item.href)
                                        ? 'font-bold text-white drop-shadow-lg'
                                        : 'text-white/90'
                                    } rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all duration-300`}
                                style={{
                                    background: isActive(item.href)
                                        ? 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)'
                                        : 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                                    backdropFilter: 'blur(15px) saturate(150%)',
                                    WebkitBackdropFilter: 'blur(15px) saturate(150%)',
                                    boxShadow: isActive(item.href)
                                        ? '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)'
                                        : '0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1)',
                                    border: '1px solid rgba(255,255,255,0.15)'
                                }}

                                href={item.href}
                                {...(item.external && {
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    title: lang === 'zh' ? '在新窗口打开' : 'Open in new window'
                                })}
                                aria-label={`${item.label[lang as 'zh' | 'en']}${item.external ? (lang === 'zh' ? '（外部链接）' : ' (external link)') : ''}`}
                            >
                                <span className={item.external ? "flex items-center gap-1" : ""}>
                                    {item.label[lang as 'zh' | 'en']}
                                    {item.external && <ExternalIcon />}
                                </span>
                                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                    <path d={item.icon} />
                                </svg>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div >
    )
}

export default Nav;