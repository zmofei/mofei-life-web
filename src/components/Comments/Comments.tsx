"use client"
import sha256 from 'crypto-js/sha256';
// motion import removed as animations were disabled
import Pagination from '@/components/Common/Pagination';
import { usePerformance } from '@/hooks/usePerformance';
import { trackEvent } from '@/lib/gtag';
import { useEffect, useState, useRef, useMemo, memo, useCallback } from 'react';

import { fetchMessageList, getToken, postMessage, likeComment } from '@/app/actions/blog'

// import { HomeIcon } from '@heroicons/react/24/outline'

// Cache processed HTML content
const linkCache = new Map<string, string>();

const updateLinks = (htmlContent: string) => {
    // Check cache
    if (linkCache.has(htmlContent)) {
        return linkCache.get(htmlContent)!;
    }
    
    // Use regex replacement to avoid DOM manipulation security issues
    const result = htmlContent.replace(/<a\s+([^>]*?)href="([^"]*)"([^>]*?)>(.*?)<\/a>/gi, (_, before, href, after, content) => {
        // Check if target and rel attributes already exist
        const hasTarget = /target\s*=/i.test(before + after);
        const hasRel = /rel\s*=/i.test(before + after);
        
        const targetAttr = hasTarget ? '' : ' target="_blank"';
        const relAttr = hasRel ? '' : ' rel="noopener noreferrer"';
        const styleAttr = /style\s*=/i.test(before + after) ? '' : ' style="color: #ff6b6b;"';
        
        const externalIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4 inline-block align-top" style="margin-left: 4px; font-size: 0.5em; color: #ff6b6b;"><path fill-rule="evenodd" d="M15.75 2.25H21a.75.75 0 0 1 .75.75v5.25a.75.75 0 0 1-1.5 0V4.81L8.03 17.03a.75.75 0 0 1-1.06-1.06L19.19 3.75h-3.44a.75.75 0 0 1 0-1.5Zm-10.5 4.5a1.5 1.5 0 0 0-1.5 1.5v10.5a1.5 1.5 0 0 0 1.5 1.5h10.5a1.5 1.5 0 0 0 1.5-1.5V10.5a.75.75 0 0 1 1.5 0v8.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V8.25a3 3 0 0 1 3-3h8.25a.75.75 0 0 1 0 1.5H5.25Z" clip-rule="evenodd" /></svg>';
        
        return `<a ${before}href="${href}"${after}${targetAttr}${relAttr}${styleAttr}>${content}${externalIcon}</a>`;
    });
    
    // Cache result
    linkCache.set(htmlContent, result);
    return result;
};

interface CommentsParams {
    lang: string;
    message_id: string;
    message_page?: number;
    singlePageMode?: boolean;
    baseURL?: string;
}

export default function Comments(params: CommentsParams) {
    // Performance monitoring
    usePerformance('Comments');

    const { lang, message_id, message_page = 1, singlePageMode = false, baseURL } = params
    const messageArea = useRef<HTMLDivElement>(null);
    const finalBaseURL = baseURL || `/${lang}/message`

    const [blogList, setBlogList] = useState([])
    const [totalPages, setTotalPages] = useState(1)
    const [messagePage, setMessagePage] = useState(message_page)
    const [messageInput, setMessageInput] = useState('')
    const [edit, setEdit] = useState(false)
    const editableDivRef = useRef<HTMLDivElement>(null);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    const [username, setUsername] = useState('Mofei\'s Friend')
    const [email, setEmail] = useState('')
    const [hashemail, setHashemail] = useState('')
    const [website, setWebsite] = useState('')
    const [freshId, setFreshId] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [isPosting, setIsPosting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    // Remove animations entirely to prevent repeated animation issues
    // Users will get immediate content without confusing double animations

    useEffect(() => {
        const email = localStorage.getItem('email') || ''
        setEmail(email)
        setHashemail(sha256(email).toString())
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
        const storedWebsite = localStorage.getItem('website') || '';
        setWebsite(storedWebsite);
    }, [])

    useEffect(() => {
        setIsLoading(true)
        // Track comment view event
        trackEvent.commentView(message_id);
        
        fetchMessageList(message_id, messagePage, 10, lang).then((res) => {
            setBlogList(res.list)
            const totalCount = res.count
            const pageSize = 10
            // 修复边界值问题：当没有数据时应该显示1页，有数据时正确计算页数
            const calculatedPages = totalCount > 0 ? Math.ceil(totalCount / pageSize) : 1
            setTotalPages(calculatedPages)
            setIsLoading(false)
        }).catch((error) => {
            console.error('Failed to fetch messages:', error)
            setIsLoading(false)
        })
    }, [message_id, messagePage, freshId, lang])

    useEffect(() => {
        // get token
        getToken()
    }, [])


    const handlePaste = useCallback((event: { preventDefault: () => void; clipboardData: DataTransfer; }) => {
        event.preventDefault();
        const text = (event.clipboardData || window.Clipboard).getData("text");

        // Get current selection range
        const selection = window.getSelection();
        if (!selection || !selection.rangeCount) return;

        const range = selection.getRangeAt(0);

        // Delete currently selected content
        range.deleteContents();

        // Create text node
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);

        // Adjust cursor position to end of inserted text
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);

        // Clear old selection and set new cursor position
        selection.removeAllRanges();
        selection.addRange(range);
    }, []);

    const handleInput = useCallback(() => {
        const updatedContent = editableDivRef.current ? editableDivRef.current.innerText : ''; // Get plain text content
        setMessageInput(updatedContent);
    }, []);

    const handleEmail = useCallback((email: string) => {
        setHashemail(sha256(email).toString())
    }, [])

    const handleSubmit = useCallback(() => {
        if (isPosting) {
            return
        }
        setIsPosting(true)


        postMessage(message_id, {
            content: messageInput,
            email,
            name: username,
            website,
        }).then(() => {
            // Track comment submission event
            trackEvent.commentSubmit(message_id);
            
            if (singlePageMode) {
                setFreshId(freshId + 1)
                setMessagePage(1)
            } else {
                // Change url hash, push to history
                history.pushState({}, '', `${finalBaseURL}1`)
                setFreshId(freshId + 1)
                setMessagePage(1)
            }
            setIsPosting(false)
            setMessageInput('')
            
            // Clear the contentEditable div
            if (editableDivRef.current) {
                editableDivRef.current.innerHTML = ''
            }
            
            // Show success notification
            setShowSuccess(true)
            setTimeout(() => {
                setShowSuccess(false)
            }, 3000)
        }).catch((error) => {
            console.error('Failed to post message:', error)
            setIsPosting(false)
        })

    }, [isPosting, messageInput, message_id, email, username, website, singlePageMode, finalBaseURL, freshId])

    const chineseMessages = [
        "今天有什么好玩的事？",
        "给我点灵感吧！",
        "世界那么大，你想说点什么？",
        "你的留言会被认真对待（真的）",
        "嘿，说句话呗！",
        "你的一小步，我的一大步！",
        "别害羞，尽管说！",
        "留言区已经准备好了，快点开聊！",
        "输入点内容吧，我保证不挑剔。",
        "听说在这里留言会很酷。"
    ];

    const englishMessages = [
        "What's on your mind today?",
        "Give me some inspiration!",
        "The world is big, say something!",
        "Hey, say something!",
        "Don't be shy, just type away!",
        "Write something, I won't judge.",
        "I heard leaving a comment here is pretty cool."
    ];

    const [currentTime, setCurrentTime] = useState<number | null>(null);
    
    // Initialize current time on client side only
    useEffect(() => {
        setCurrentTime(Date.now());
        
        // Update time every minute for relative time accuracy
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 60000);
        
        return () => clearInterval(interval);
    }, []);

    const getRelativeTime = useCallback((timestamp: string, lang = 'en') => {
        // Return static fallback during SSR
        if (currentTime === null) {
            return new Date(timestamp).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US');
        }
        
        const diff = currentTime - new Date(timestamp).getTime();
        const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });

        const seconds = Math.floor(diff / 1000);
        if (seconds < 60) return rtf.format(-seconds, 'second');

        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return rtf.format(-minutes, 'minute');

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return rtf.format(-hours, 'hour');

        const days = Math.floor(hours / 24);
        if (days < 30) return rtf.format(-days, 'day');

        const months = Math.floor(days / 30);
        if (months < 12) return rtf.format(-months, 'month');

        const years = Math.floor(months / 12);
        return rtf.format(-years, 'year');
    }, [currentTime]);

    const [chineseMessagesIndex, setChineseMessagesIndex] = useState(0);
    const [englishMessagesIndex, setEnglishMessagesIndex] = useState(0);
    
    // Initialize random indices on client side only
    useEffect(() => {
        setChineseMessagesIndex(Math.floor(Math.random() * chineseMessages.length));
        setEnglishMessagesIndex(Math.floor(Math.random() * englishMessages.length));
    }, [chineseMessages.length, englishMessages.length]);

    // Function to generate random offset for default avatars
    const getAvatarStyle = useCallback((email: string, name: string) => {
        // Use email and name to generate seed, ensuring same user always has same offset
        const seed = (email || '') + (name || '');
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = ((hash << 5) - hash + seed.charCodeAt(i)) & 0xffffffff;
        }
        
        // Generate random offset based on hash (-20% to +20%)
        const offsetX = ((hash % 40) - 20);
        const offsetY = (((hash >> 8) % 40) - 20);
        const scale = 1 + ((hash >> 16) % 20) / 100; // 1.0 到 1.2 的缩放
        
        return {
            backgroundPosition: `${50 + offsetX}% ${50 + offsetY}%`,
            backgroundSize: `${scale * 100}%`
        };
    }, []);

    // Independent comment item component
    const CommentItem = memo(({ blog, lang, getRelativeTimeFunc }: { 
        blog: { 
            id?: string; 
            _id?: string; 
            email: string; 
            name: string; 
            blog?: string; 
            content: string; 
            translate_zh?: string; 
            translate_en?: string; 
            time: string; 
            like?: string | number; // API返回的点赞数
            likes?: number; 
            isLiked?: boolean; 
        };
        lang: string;
        getRelativeTimeFunc: (timestamp: string, lang?: string) => string;
    }) => {
        const [showOriginal, setShowOriginal] = useState(false);
        // 使用API返回的like字段，转换为数字
        const initialLikes = blog.like ? parseInt(String(blog.like), 10) : (blog.likes || 0);
        const [likesCount, setLikesCount] = useState(initialLikes);
        
        // 从localStorage获取用户点赞状态
        const commentId = blog.id || blog._id || '';
        const likedKey = `comment_liked_${commentId}`;
        const [isLiked, setIsLiked] = useState(blog.isLiked || false);
        
        // Initialize liked state from localStorage on client side
        useEffect(() => {
            if (commentId) {
                const storedLiked = localStorage.getItem(likedKey) === 'true';
                setIsLiked(storedLiked || blog.isLiked || false);
            }
        }, [commentId, likedKey, blog.isLiked]);
        const [isLiking, setIsLiking] = useState(false);
        
        // Handle like action
        const handleLike = useCallback(async () => {
            if (isLiking || !commentId) return; // Prevent double clicks
            
            setIsLiking(true);
            const previousLiked = isLiked;
            const previousCount = likesCount;
            
            try {
                // 不允许取消点赞，只能增加点赞
                if (isLiked) {
                    // 已经点赞过了，不做任何操作
                    return;
                } else {
                    // 点赞
                    setLikesCount(prev => prev + 1);
                    setIsLiked(true);
                    localStorage.setItem(likedKey, 'true');
                    
                    // Call API
                    const result = await likeComment(commentId);
                    
                    // Update with server response if available
                    if (result && typeof result.likes !== 'undefined') {
                        setLikesCount(parseInt(String(result.likes), 10) || 0);
                    }
                    
                    // Track like event
                    trackEvent.navClick('Comment Like', `Like - ${commentId}`);
                }
            } catch (error) {
                console.error('Failed to like comment:', error);
                // Rollback on error
                setIsLiked(previousLiked);
                setLikesCount(previousCount);
                localStorage.setItem(likedKey, String(previousLiked));
            } finally {
                setIsLiking(false);
            }
        }, [isLiking, isLiked, likesCount, commentId, likedKey]);
        
        // Update likes count when blog data changes
        useEffect(() => {
            const newLikes = blog.like ? parseInt(String(blog.like), 10) : (blog.likes || 0);
            setLikesCount(newLikes);
        }, [blog.like, blog.likes]);
        
        // Use useMemo to cache translated content, avoid re-rendering
        const translatedContent = useMemo(() => {
            if (lang === 'zh') {
                // Chinese interface
                if (blog.translate_zh && blog.translate_zh !== blog.content) {
                    return (
                        <div>
                            {/* 显示中文翻译 */}
                            <div dangerouslySetInnerHTML={{ __html: updateLinks(blog.translate_zh) }} />
                            
                            {/* 翻译提示文字 */}
                            <div className="mt-2 text-xs text-gray-400">
                                非中文，已自动翻译
                            </div>
                        </div>
                    );
                } else {
                    // Show original text when no translation available
                    return <div dangerouslySetInnerHTML={{ __html: updateLinks(blog.content) }} />;
                }
            } else {
                // English interface
                if (blog.translate_en && blog.translate_en !== blog.content) {
                    return (
                        <div>
                            {/* 显示英文翻译 */}
                            <div dangerouslySetInnerHTML={{ __html: updateLinks(blog.translate_en) }} />
                            
                            {/* 翻译提示文字 */}
                            <div className="mt-2 text-xs text-gray-400">
                                Non-English, auto-translated
                            </div>
                        </div>
                    );
                } else {
                    // Show original text when no translation available
                    return <div dangerouslySetInnerHTML={{ __html: updateLinks(blog.content) }} />;
                }
            }
        }, [blog.translate_zh, blog.translate_en, blog.content, lang]);
        
        // Cache original content
        const originalContent = useMemo(() => (
            <div className="mt-3 p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 text-sm text-gray-300 leading-relaxed">
                <div className="flex items-center gap-2 mb-2 text-xs text-gray-400">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>{lang === 'zh' ? '原文' : 'Original'}</span>
                </div>
                <div dangerouslySetInnerHTML={{ __html: updateLinks(blog.content) }} />
            </div>
        ), [blog.content, lang]);
        
        // Determine if original text button should be shown
        const shouldShowOriginalButton = useMemo(() => {
            if (lang === 'zh') {
                return blog.translate_zh && blog.translate_zh !== blog.content;
            } else {
                return blog.translate_en && blog.translate_en !== blog.content;
            }
        }, [blog.translate_zh, blog.translate_en, blog.content, lang]);
        
        return (
            <div className='mt-5 md:mt-10 interactive-element'>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-8 border border-white/20 shadow-xl hover:shadow-2xl relative overflow-hidden text-sm md:text-lg will-change-transform focus-enhanced">
                    {/* Avatar background */}
                    {blog.email && blog.email !== '0000000000' ? (
                        <div 
                            className="absolute inset-0 opacity-[0.025] rounded-2xl"
                            style={{
                                backgroundImage: `url(https://assets-eu.mofei.life/gravatar/${blog.email}?s=200)`,
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center'
                            }}
                        />
                    ) : (
                        <div 
                            className="absolute inset-0 opacity-[0.025] rounded-2xl"
                            style={{
                                backgroundImage: `url(https://assets-eu.mofei.life/gravatar/${blog.email || '0000000000'}?s=200)`,
                                backgroundRepeat: 'no-repeat',
                                ...getAvatarStyle(blog.email || '', blog.name || '')
                            }}
                        />
                    )}
                    
                    {/* Glass effect overlays */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-2xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5 pointer-events-none rounded-2xl"></div>
                    
                    {/* 主体内容：手机端水平布局，电脑端左右布局 */}
                    <div className='flex gap-3 md:gap-6 relative z-10'>
                        {/* 左侧：头像区域 */}
                        <div className='flex-shrink-0'>
                            <img 
                                alt='avatar' 
                                className="rounded-2xl shadow-xl ring-2 ring-white/20 w-12 h-12 md:w-16 md:h-16 object-cover" 
                                src={`https://assets-eu.mofei.life/gravatar/${blog.email || '0000000000'}?s=200`}
                                loading="lazy"
                                style={{ transition: 'none' }}
                            />
                        </div>
                        
                        {/* 右侧：姓名、时间和内容区域 */}
                        <div className="flex-1 min-w-0">
                            {/* 姓名和时间 - 手机端在一行 */}
                            <div className='mb-3'>
                                {/* 姓名、网站链接和时间信息 */}
                                <div className='flex items-center gap-2 mb-1 flex-wrap'>
                                    <h2 className='font-bold text-base md:text-lg text-white drop-shadow-md'>
                                        {blog.name}
                                    </h2>
                                    {blog.blog ? (
                                        <a
                                            href={blog.blog.startsWith('http://') || blog.blog.startsWith('https://') ? blog.blog : `https://${blog.blog}`}
                                            target='_blank'
                                            className="text-white/60 hover:text-white/80 flex-shrink-0"
                                        >
                                            <svg className='inline-block size-4' fill='currentColor' viewBox='0 0 20 20'>
                                                <path fillRule='evenodd' d='M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z' clipRule='evenodd' />
                                            </svg>
                                        </a>
                                    ) : ''}
                                </div>
                                
                                {/* 时间信息 */}
                                <div className="flex items-center gap-2 text-xs text-white/60 font-medium">
                                    <span title={new Date(blog.time).toLocaleDateString(
                                        lang == 'zh' ? 'zh-CN' : 'en-US'
                                        , {
                                            weekday: "short",
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                            hour: "numeric",
                                            minute: "numeric",
                                        })}>
                                        {new Date(blog.time).toLocaleDateString(
                                            lang == 'zh' ? 'zh-CN' : 'en-US'
                                            , {
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                    </span>
                                    <span className="text-white/40">•</span>
                                    <span className="text-white/50">
                                        {getRelativeTimeFunc(blog.time, lang == 'zh' ? 'zh-CN' : 'en-US')}
                                    </span>
                                </div>
                            </div>
                            
                            {/* 内容区域 */}
                            <div className='text-sm md:text-base'>
                                <div className="text-gray-100 leading-relaxed prose prose-invert max-w-none text-sm md:text-lg">
                                    {/* 显示翻译内容（已缓存，不会重新渲染） */}
                                    {translatedContent}
                                    
                                    {/* 显示原文按钮 */}
                                    {shouldShowOriginalButton && (
                                        <button
                                            onClick={() => setShowOriginal(!showOriginal)}
                                            className="mt-2 flex items-center gap-2 text-gray-400 hover:text-gray-300 text-sm"
                                        >
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                            <span>{showOriginal ? (lang === 'zh' ? '隐藏原文' : 'Hide Original') : (lang === 'zh' ? '查看原文' : 'Show Original')}</span>
                                        </button>
                                    )}
                                    
                                    {/* 可展开的原文内容（已缓存，不会重新渲染） */}
                                    {showOriginal && shouldShowOriginalButton && originalContent}
                                    
                                    {/* 点赞按钮 - 单独一行右对齐 */}
                                    <div className="flex items-center justify-end mt-3">
                                        <button
                                            onClick={handleLike}
                                            disabled={isLiking}
                                            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all duration-300 
                                                ${isLiked 
                                                    ? 'text-red-400 bg-red-400/10 border border-red-400/20 hover:bg-red-400/20' 
                                                    : 'text-white/60 bg-white/5 border border-white/10 hover:text-white/80 hover:bg-white/10'
                                                } 
                                                ${isLiking ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
                                                backdrop-blur-sm flex-shrink-0`}
                                        >
                                            <svg 
                                                className={`w-3.5 h-3.5 transition-all duration-300 ${isLiked ? 'scale-110' : ''} ${isLiking ? 'animate-pulse' : ''}`} 
                                                fill={isLiked ? "currentColor" : "none"} 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                    strokeWidth={2} 
                                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                                                />
                                            </svg>
                                            <span className="tabular-nums">
                                                {likesCount > 0 ? likesCount : (lang === 'zh' ? '赞' : 'Like')}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    });
    
    CommentItem.displayName = 'CommentItem';

    return (
        <>
            {/* Post */}
            <div className='relative mb-8 md:mb-12'>
                <div className='w-0 h-0 absolute -top-20 md:-top-32 left-0 overflow-hidden invisible' ref={messageArea}></div>
                <div className='bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 relative group overflow-hidden break-all text-sm md:text-base'>
                    <div className='bg-transparent rounded-2xl break-all text-sm md:text-xl flex flex-col md:flex-row'>
                        <div className='w-12 h-12 md:w-16 md:h-16 flex-shrink-0 mb-4 md:mb-0 md:mr-6 mx-auto md:mx-0'>
                            <img 
                                alt='avatar' 
                                className='rounded-2xl shadow-xl ring-2 ring-white/20 hover:ring-[#f05a54]/40 cursor-pointer w-12 h-12 md:w-16 md:h-16 object-cover'
                                onClick={() => setEdit(!edit)}
                                src={`https://assets-eu.mofei.life/gravatar/${hashemail || '0000000000'}?s=200`}
                                loading="lazy"
                                style={{ transition: 'none' }}
                            /></div>

                        <div className='flex-1 text-sm md:text-base'>
                            <h2 className='font-bold text-lg md:text-2xl mb-4 cursor-pointer group hover:text-[#f05a54] transition-colors duration-300 text-center md:text-left' onClick={() => setEdit(!edit)}>
                                <span className='text-white group-hover:text-[#f05a54] transition-colors duration-300 drop-shadow-lg'>
                                    {username ? username : 'Mofei\'s Friend'} </span>
                                <span className='text-gray-400 text-sm font-medium group-hover:text-gray-300 transition-colors duration-300 ml-2'> 
                                    ({lang == 'zh' ? '点击编辑' : 'Click to edit'})
                                </span>
                            </h2>
                            <div>
                                {edit && (
                                    <div className='mt-4 mb-6 text-gray-400 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 relative group overflow-hidden'>
                                        <div className='mb-4'>
                                            <label htmlFor="email" className="block font-medium ">
                                                {lang == 'zh' ? '昵称' : 'Nickname'}
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    id="email"
                                                    name="email"
                                                    type="search"
                                                    value={username}


                                                    onChange={(e) => {
                                                        setUsername(e.target.value)
                                                        // save to local storage
                                                        localStorage.setItem('username', e.target.value)
                                                    }}
                                                    placeholder="Mofei's Friend"
                                                    className="block w-full bg-white/10 backdrop-blur-lg rounded-2xl p-2 md:p-4 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 relative group overflow-hidden focus:border-[#f05a54]/50 focus:ring-2 focus:ring-[#f05a54]/20 text-sm md:text-base placeholder:text-gray-400 text-white"
                                                />
                                            </div>
                                        </div>
                                        <div className='mb-4'>
                                            <label htmlFor="email" className="block font-medium">
                                                {lang == 'zh' ?
                                                    '邮箱（用于显示留言头像）' :
                                                    <span>Email (Used to display <a href='https://gravatar.com/' target="_blank" className='underline'> the avatar</a>)</span>}
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    id="email"
                                                    name="email"
                                                    type="search"
                                                    value={email}

                                                    onChange={(e) => {
                                                        setEmail(e.target.value)
                                                        localStorage.setItem('email', e.target.value)

                                                        // Clear previous timer
                                                        if (debounceTimeout.current) {
                                                            clearTimeout(debounceTimeout.current);
                                                        }

                                                        // Set new timer
                                                        debounceTimeout.current = setTimeout(() => {
                                                            handleEmail(e.target.value)
                                                        }, 1000);
                                                    }}
                                                    placeholder="you@example.com"
                                                    className="block w-full bg-white/10 backdrop-blur-lg rounded-2xl p-2 md:p-4 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 relative group overflow-hidden focus:border-[#f05a54]/50 focus:ring-2 focus:ring-[#f05a54]/20 text-sm md:text-base placeholder:text-gray-400 text-white"
                                                />
                                            </div>
                                        </div>
                                        <div className='mb-4'>
                                            <label htmlFor="email" className="block text-sm/6 font-medium">
                                                {lang == 'zh' ? '网站 (有效网站会在留言姓名后显示链接)' : 'Website (Valid websites will be displayed as links after the message name)'}
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    autoComplete='off'
                                                    id="email"
                                                    name="email"
                                                    type="search"
                                                    value={website}
                                                    onChange={(e) => {
                                                        setWebsite(e.target.value)
                                                        localStorage.setItem('website', e.target.value)
                                                    }}
                                                    placeholder="https://example.com"
                                                    className="block w-full bg-white/10 backdrop-blur-lg rounded-2xl p-2 md:p-4 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 relative group overflow-hidden focus:border-[#f05a54]/50 focus:ring-2 focus:ring-[#f05a54]/20 text-sm md:text-base placeholder:text-gray-400 text-white"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className='mb-6 relative'>
                                <div 
                                    contentEditable 
                                    translate='no' 
                                    className='outline-none min-h-[60px] md:min-h-[100px] bg-white/10 backdrop-blur-lg rounded-2xl p-2 md:p-4 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 relative group overflow-hidden focus:border-[#f05a54]/50 focus:ring-2 focus:ring-[#f05a54]/20 text-white text-sm md:text-base' 
                                    ref={editableDivRef} 
                                    onPaste={handlePaste} 
                                    onInput={handleInput} 
                                />
                                <div className='absolute top-2 md:top-4 left-2 md:left-4 py-0 pointer-events-none text-gray-400 truncate w-[calc(100%-1rem)] md:w-full text-xs md:text-base'>{(
                                    messageInput !== '' && messageInput !== '\n'
                                ) ? '' : (
                                    lang == 'zh' ? chineseMessages[chineseMessagesIndex] : englishMessages[englishMessagesIndex]
                                )}</div>
                            </div>
                            {showSuccess && (
                                <div className='mb-4 bg-green-400/10 backdrop-blur-lg rounded-2xl p-4 md:p-8 border border-green-400/20 shadow-xl hover:shadow-2xl transition-all duration-500 relative group overflow-hidden flex items-center gap-2 text-green-400 text-sm md:text-base'>
                                    <svg className='w-5 h-5 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                                        <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                                    </svg>
                                    <span>{lang === 'zh' ? '留言发表成功！' : 'Message posted successfully!'}</span>
                                </div>
                            )}
                            <div className='flex justify-center sm:justify-end pt-2'>
                                <button 
                                    className='px-4 md:px-8 py-2 md:py-4 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 relative group overflow-hidden text-white font-semibold text-sm md:text-base transform hover:opacity-90 active:opacity-70 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-white/20 focus:ring-2 focus:ring-[#f05a54]/30 cursor-pointer w-full sm:w-auto btn-glass glass-hover focus-ring'
                                    onClick={() => {
                                        handleSubmit()
                                    }}
                                    disabled={isPosting || !messageInput.trim()}
                                >
                                    {/* 液态玻璃高光效果 */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
                                    {/* 发送图标高光 */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out skew-x-12 pointer-events-none rounded-2xl"></div>
                                    {/* 按钮内容 */}
                                    <div className="relative z-10 flex items-center justify-center gap-3">
                                        {isPosting ? (
                                            <>
                                                <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                                                <span className="animate-pulse">{lang == 'zh' ? '发送中...' : 'Sending...'}</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                                <span>{lang == 'zh' ? '发送留言' : 'Send Message'}</span>
                                            </>
                                        )}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className='container max-w-[2000px] mx-auto '>
                <div>
                    {isLoading && ([...Array(10)].map((_, index) => {
                        return (<div className='
                            mt-5
                            md:mt-10
                            ' key={`${index}_loading`}
                        >

                            <div className='bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 relative group overflow-hidden break-all
                                text-sm
                                md:text-xl
                                loading-shimmer
                            '>
                                {/* 头部骨架屏 */}
                                <div className='flex items-center justify-between mb-4'>
                                    <div className='flex items-center gap-3'>
                                        <div className='w-12 h-12 md:w-16 md:h-16 bg-white/10 rounded-2xl shadow-xl loading-shimmer' />
                                        <div className='bg-white/10 w-24 md:w-32 h-5 md:h-6 rounded-lg loading-shimmer' />
                                    </div>
                                    <div className='bg-white/10 w-16 md:w-20 h-6 md:h-7 rounded-2xl loading-shimmer' />
                                </div>
                                
                                {/* 内容骨架屏 */}
                                <div className='space-y-2 md:space-y-3'>
                                    <div className='bg-white/10 w-full h-4 md:h-5 rounded-lg loading-shimmer' />
                                    <div className='bg-white/10 w-3/4 h-4 md:h-5 rounded-lg loading-shimmer' />
                                    <div className='bg-white/10 w-1/2 h-4 md:h-5 rounded-lg loading-shimmer' />
                                </div>
                                
                                {/* 时间骨架屏 */}
                                <div className='mt-4 flex items-center gap-2'>
                                    <div className='w-3 h-3 md:w-4 md:h-4 bg-white/10 rounded loading-shimmer' />
                                    <div className='bg-white/10 w-20 md:w-24 h-3 md:h-4 rounded-lg loading-shimmer' />
                                </div>
                            </div>
                        </div>)
                    }))}

                    {!isLoading && blogList.length === 0 && (
                        <div className='text-center py-12 md:py-16'>
                            <div className='text-gray-400 text-lg md:text-xl mb-2'>
                                {lang === 'zh' ? '还没有评论' : 'No comments yet'}
                            </div>
                            <div className='text-gray-500 text-sm md:text-base'>
                                {lang === 'zh' ? '成为第一个评论的人吧！' : 'Be the first to comment!'}
                            </div>
                        </div>
                    )}

                    {!isLoading &&
                        blogList.map((blog: { email: string; name: string; blog?: string; content: string; translate_zh?: string; translate_en?: string; time: string; }) => {
                            const itemKey = `${blog.email}_${blog.name}_${blog.time}`;
                            return (
                                <CommentItem
                                    key={itemKey}
                                    blog={blog}
                                    lang={lang}
                                    getRelativeTimeFunc={getRelativeTime}
                                />
                            );
                        })
                    }
                </div>
            </div>


            {totalPages > 1 && (<div className='py-6 md:py-8 
                mt-6 md:mt-8
                '>
                <Pagination lang={lang} key={freshId} currentPage={Number(messagePage)} totalPages={totalPages} baseURL={finalBaseURL} singlePageMode={singlePageMode} onPageChange={(page: number) => {
                    if (singlePageMode) {
                        setMessagePage(page)
                    } else {
                        // Change url hash, push to history
                        history.pushState({}, '', `${finalBaseURL}${page}`)
                        setMessagePage(page)
                    }
                    // Remove duplicate freshId update - messagePage change already triggers useEffect
                    if (messageArea.current) {
                        messageArea.current.scrollIntoView({
                            behavior: 'smooth', // Smooth scrolling
                            block: 'start',     // Scroll element to top of viewport
                        });
                    }
                }}
                />
            </div>)}


        </>
    );
}
