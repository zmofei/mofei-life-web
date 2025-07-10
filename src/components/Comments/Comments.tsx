"use client"
import sha256 from 'crypto-js/sha256';
// motion import removed as animations were disabled
import Pagination from '@/components/Common/Pagination';
import { useEffect, useState, useRef } from 'react';

import { fetchMessageList, getToken, postMessage } from '@/app/actions/blog'

// import { HomeIcon } from '@heroicons/react/24/outline'

const updateLinks = (htmlContent: string) => {
    // 使用正则表达式替换，避免 DOM 操作安全问题
    return htmlContent.replace(/<a\s+([^>]*?)href="([^"]*)"([^>]*?)>(.*?)<\/a>/gi, (_, before, href, after, content) => {
        // 检查是否已经有 target 和 rel 属性
        const hasTarget = /target\s*=/i.test(before + after);
        const hasRel = /rel\s*=/i.test(before + after);
        
        const targetAttr = hasTarget ? '' : ' target="_blank"';
        const relAttr = hasRel ? '' : ' rel="noopener noreferrer"';
        const styleAttr = /style\s*=/i.test(before + after) ? '' : ' style="color: #ff6b6b;"';
        
        const externalIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4 inline-block align-top" style="margin-left: 4px; font-size: 0.5em; color: #ff6b6b;"><path fill-rule="evenodd" d="M15.75 2.25H21a.75.75 0 0 1 .75.75v5.25a.75.75 0 0 1-1.5 0V4.81L8.03 17.03a.75.75 0 0 1-1.06-1.06L19.19 3.75h-3.44a.75.75 0 0 1 0-1.5Zm-10.5 4.5a1.5 1.5 0 0 0-1.5 1.5v10.5a1.5 1.5 0 0 0 1.5 1.5h10.5a1.5 1.5 0 0 0 1.5-1.5V10.5a.75.75 0 0 1 1.5 0v8.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V8.25a3 3 0 0 1 3-3h8.25a.75.75 0 0 1 0 1.5H5.25Z" clip-rule="evenodd" /></svg>';
        
        return `<a ${before}href="${href}"${after}${targetAttr}${relAttr}${styleAttr}>${content}${externalIcon}</a>`;
    });
};

interface CommentsParams {
    lang: string;
    message_id: string;
    message_page?: number;
    singlePageMode?: boolean;
    baseURL?: string;
}

export default function Comments(params: CommentsParams) {

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
        fetchMessageList(message_id, messagePage).then((res) => {
            setBlogList(res.list)
            const totalCount = res.count
            const pageSize = 10
            setTotalPages(Math.ceil(totalCount / pageSize))
            setIsLoading(false)
        }).catch((error) => {
            console.error('Failed to fetch messages:', error)
            setIsLoading(false)
        })
    }, [message_id, messagePage, freshId])

    useEffect(() => {
        // get token
        getToken()
    }, [])

    const handlePaste = (event: { preventDefault: () => void; clipboardData: DataTransfer; }) => {
        event.preventDefault();
        const text = (event.clipboardData || window.Clipboard).getData("text");

        // 获取当前选择范围
        const selection = window.getSelection();
        if (!selection || !selection.rangeCount) return;

        const range = selection.getRangeAt(0);

        // 删除当前选中的内容
        range.deleteContents();

        // 创建文本节点
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);

        // 调整光标位置到插入文本的末尾
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);

        // 清除旧的选择并设置新的光标位置
        selection.removeAllRanges();
        selection.addRange(range);
    };

    const handleInput = () => {
        const updatedContent = editableDivRef.current ? editableDivRef.current.innerText : ''; // 获取纯文本内容
        setMessageInput(updatedContent);
    };

    const handleEmail = (email: string) => {
        setHashemail(sha256(email).toString())
    }

    const handleSubmit = () => {
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

    }

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

    function getRelativeTime(timestamp: string, lang = 'en') {
        const now = Date.now();
        const diff = now - new Date(timestamp).getTime();
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
    }

    const [chineseMessagesIndex] = useState(Math.floor(Math.random() * chineseMessages.length));
    const [englishMessagesIndex] = useState(Math.floor(Math.random() * englishMessages.length));

    // 为默认头像生成随机偏移的函数
    const getAvatarStyle = (email: string, name: string) => {
        // 使用邮箱和名字生成种子，确保相同用户始终有相同的偏移
        const seed = (email || '') + (name || '');
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = ((hash << 5) - hash + seed.charCodeAt(i)) & 0xffffffff;
        }
        
        // 基于hash生成随机偏移 (-20% 到 +20%)
        const offsetX = ((hash % 40) - 20);
        const offsetY = (((hash >> 8) % 40) - 20);
        const scale = 1 + ((hash >> 16) % 20) / 100; // 1.0 到 1.2 的缩放
        
        return {
            backgroundPosition: `${50 + offsetX}% ${50 + offsetY}%`,
            backgroundSize: `${scale * 100}%`
        };
    };

    return (
        <>

            {/* Post */}
            <div className='relative mb-8 md:mb-12'>
                <div className='w-0 h-0 absolute -top-20 md:-top-32 left-0 overflow-hidden invisible' ref={messageArea}></div>
                <div className='bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 relative group overflow-hidden break-all text-base pr-4'>
                    <div className='bg-transparent rounded-2xl break-all text-base md:text-xl flex'>
                        <div className='w-16 h-16 md:w-20 md:h-20 flex-shrink-0 mr-4 md:mr-6'>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img alt='avatar' className='w-16 h-16 md:w-20 md:h-20 rounded-2xl shadow-xl ring-2 ring-white/20 hover:ring-[#f05a54]/40 transition-all duration-500 cursor-pointer hover:scale-105 group-hover:shadow-2xl'
                                onClick={() => setEdit(!edit)}
                                src={`https://assets-eu.mofei.life/gravatar/${hashemail || '0000000000'}?s=200`}
                            /></div>

                        <div className='flex-1 text-sm md:text-base'>
                            <h2 className='font-bold text-xl md:text-2xl mb-4 cursor-pointer group hover:text-[#f05a54] transition-colors duration-300' onClick={() => setEdit(!edit)}>
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
                                                    className="block w-full bg-white/10 backdrop-blur-lg rounded-2xl p-3 md:p-4 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 relative group overflow-hidden focus:border-[#f05a54]/50 focus:ring-2 focus:ring-[#f05a54]/20 text-sm md:text-base placeholder:text-gray-400 text-white"
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

                                                        // 清除之前的定时器
                                                        if (debounceTimeout.current) {
                                                            clearTimeout(debounceTimeout.current);
                                                        }

                                                        // 设置新的定时器
                                                        debounceTimeout.current = setTimeout(() => {
                                                            handleEmail(e.target.value)
                                                        }, 1000);
                                                    }}
                                                    placeholder="you@example.com"
                                                    className="block w-full bg-white/10 backdrop-blur-lg rounded-2xl p-3 md:p-4 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 relative group overflow-hidden focus:border-[#f05a54]/50 focus:ring-2 focus:ring-[#f05a54]/20 text-sm md:text-base placeholder:text-gray-400 text-white"
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
                                                    className="block w-full bg-white/10 backdrop-blur-lg rounded-2xl p-3 md:p-4 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 relative group overflow-hidden focus:border-[#f05a54]/50 focus:ring-2 focus:ring-[#f05a54]/20 text-sm md:text-base placeholder:text-gray-400 text-white"
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
                                    className='outline-none min-h-[80px] md:min-h-[100px] bg-white/10 backdrop-blur-lg rounded-2xl p-3 md:p-4 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 relative group overflow-hidden focus:border-[#f05a54]/50 focus:ring-2 focus:ring-[#f05a54]/20 text-white text-sm md:text-base' 
                                    ref={editableDivRef} 
                                    onPaste={handlePaste} 
                                    onInput={handleInput} 
                                />
                                <div className='absolute top-4 left-4 py-0 pointer-events-none text-gray-400 truncate w-full text-sm md:text-base'>{(
                                    messageInput !== '' && messageInput !== '\n'
                                ) ? '' : (
                                    lang == 'zh' ? chineseMessages[chineseMessagesIndex] : englishMessages[englishMessagesIndex]
                                )}</div>
                            </div>
                            {showSuccess && (
                                <div className='mb-4 bg-green-400/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-green-400/20 shadow-xl hover:shadow-2xl transition-all duration-500 relative group overflow-hidden flex items-center gap-2 text-green-400 text-sm md:text-base'>
                                    <svg className='w-5 h-5 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                                        <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                                    </svg>
                                    <span>{lang === 'zh' ? '留言发表成功！' : 'Message posted successfully!'}</span>
                                </div>
                            )}
                            <div className='flex justify-end pt-2'>
                                <button 
                                    className='px-6 md:px-8 py-3 md:py-4 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 relative group overflow-hidden text-white font-semibold text-sm md:text-base transform hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-white/20 focus:ring-2 focus:ring-[#f05a54]/30 cursor-pointer'
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
                                                <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                                <span>{lang == 'zh' ? '发送中...' : 'Sending...'}</span>
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
            <div className='container max-w-[2000px] m-auto'>
                <div>
                    {isLoading && ([...Array(10)].map((_, index) => {
                        return (<div className='
                            mt-5
                            md:mt-10
                            ' key={`${index}_loading`}
                        >

                            <div className='bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 relative group overflow-hidden break-all
                                text-base
                                md:text-xl
                                flex
                                animate-pulse
                            '>
                                <div className='mt-1 ml-3 mr-3 md:mt-2 md:ml-6 md:mr-4 flex-shrink-0
                                w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-2xl shadow-xl animate-pulse' />
                                <div className='
                                    flex-1 
                                    p-3 md:p-5
                                    text-base
                                '>
                                    <div className='font-bold bg-white/10 w-32 inline-block h-6 md:h-7 rounded-lg mb-3 animate-pulse' />
                                    <div className='mt-4 space-y-3'>
                                        <div className='bg-white/10 w-full h-5 rounded-lg animate-pulse' />
                                        <div className='bg-white/10 w-3/4 h-5 rounded-lg animate-pulse' />
                                        <div className='bg-white/10 w-1/2 h-5 rounded-lg animate-pulse' />
                                    </div>
                                    <div className='mt-6 flex items-center gap-3'>
                                        <div className='w-5 h-5 bg-white/10 rounded animate-pulse' />
                                        <div className='bg-white/10 w-32 h-4 rounded-lg animate-pulse' />
                                    </div>
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

                    {
                        blogList.map((blog: { email: string; name: string; blog?: string; content: string; translate_zh?: string; translate_en?: string; time: string; }, index: number) => {
                            return (
                                <div className='
                                    mt-5
                                    md:mt-10
                                    ' key={`blog._id_${index}`}
                                >
                                    <div className='bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 relative group overflow-hidden
                                        text-base md:text-lg
                                        flex
                                        hover:border-white/40
                                    >'>
                                        {/* Avatar background */}
                                        {blog.email && blog.email !== '0000000000' ? (
                                            <div 
                                                className="absolute inset-0 opacity-[0.025] group-hover:opacity-[0.04] transition-opacity duration-500 rounded-2xl"
                                                style={{
                                                    backgroundImage: `url(https://assets-eu.mofei.life/gravatar/${blog.email}?s=200)`,
                                                    backgroundSize: 'cover',
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundPosition: 'center'
                                                }}
                                            />
                                        ) : (
                                            <div 
                                                className="absolute inset-0 opacity-[0.025] group-hover:opacity-[0.04] transition-opacity duration-500 rounded-2xl"
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
                                        
                                        {/* Shimmer effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                                            -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out
                                            skew-x-12 pointer-events-none rounded-2xl"></div>
                                        
                                        <div className='flex-shrink-0 mr-4 md:mr-6 relative z-10'>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img alt='avatar' className='rounded-2xl shadow-xl ring-2 ring-white/20 
                                                w-16 h-16 md:w-20 md:h-20
                                                transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl
                                                group-hover:ring-white/40'
                                                src={`https://assets-eu.mofei.life/gravatar/${blog.email || '0000000000'}?s=200`}
                                            />
                                        </div>
                                        <div className='flex-1 text-base relative z-10'>
                                            <h2 className='font-bold text-xl md:text-2xl mb-3 flex items-center gap-3'>
                                                <span className='text-white transition-all duration-300 group-hover:drop-shadow-lg drop-shadow-md'>{blog.name}</span>
                                                {blog.blog ? (
                                                    <a
                                                        href={blog.blog.startsWith('http://') || blog.blog.startsWith('https://') ? blog.blog : `https://${blog.blog}`}
                                                        target='_blank'
                                                        className="text-white/60 hover:text-white/80 transition-all duration-300 hover:scale-110 transform hover:drop-shadow-lg"
                                                    >
                                                        <svg className='inline-block size-6' fill='currentColor' viewBox='0 0 20 20'>
                                                            <path fillRule='evenodd' d='M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z' clipRule='evenodd' />
                                                        </svg>
                                                    </a>
                                                ) : ''}
                                            </h2>
                                            <div className='mt-4 text-gray-100 leading-relaxed prose prose-invert max-w-none group-hover:text-white transition-colors duration-300 text-base md:text-lg' dangerouslySetInnerHTML={{
                                                __html: updateLinks(
                                                    lang == 'zh' ? (blog.translate_zh || blog.content) : (blog.translate_en || blog.content)
                                                )
                                            }} />
                                            <div className='mt-6 flex items-center justify-between'>
                                                <div className='flex items-center gap-3'>
                                                    <svg className='w-5 h-5 text-white/60 group-hover:text-white/80 drop-shadow-lg group-hover:scale-110 transition-all duration-300' fill='currentColor' viewBox='0 0 20 20'>
                                                        <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z' clipRule='evenodd' />
                                                    </svg>
                                                    <span className='text-gray-300 text-base font-medium group-hover:text-white transition-colors duration-300 drop-shadow-sm'>
                                                        {getRelativeTime(blog.time, lang == 'zh' ? 'zh-CN' : 'en-US')}
                                                    </span>
                                                </div>
                                                <div className='text-sm text-white/80 bg-white/10 backdrop-blur-lg rounded-2xl px-4 py-2 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 relative group overflow-hidden group-hover:border-white/30 group-hover:bg-white/15 font-medium' title={new Date(blog.time).toLocaleDateString(
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
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
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
                    setFreshId(freshId + 1)
                    if (messageArea.current) {
                        messageArea.current.scrollIntoView({
                            behavior: 'smooth', // 平滑滚动
                            block: 'start',     // 元素滚动到视口顶部
                        });
                    }
                }}
                />
            </div>)}


        </>
    );
}
