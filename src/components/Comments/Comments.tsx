"use client"
import sha256 from 'crypto-js/sha256';
// motion import removed as animations were disabled
import Pagination from '@/components/Common/Pagination';
import { useEffect, useState, useRef } from 'react';

import { fetchMessageList, getToken, postMessage } from '@/app/actions/blog'

import { HomeIcon } from '@heroicons/react/24/outline'

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
}

export default function Comments(params: CommentsParams) {

    const { lang, message_id, message_page = 1, singlePageMode = false } = params
    const messageArea = useRef<HTMLDivElement>(null);
    const baseURL = `/${lang}/message`

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
                history.pushState({}, '', `${baseURL}1`)
                setFreshId(freshId + 1)
                setMessagePage(1)
            }
            setIsPosting(false)
            setMessageInput('')
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

    return (
        <>

            {/* Post */}
            <div className='relative mb-8 md:mb-12'>
                <div className='w-0 h-0 absolute -top-20 md:-top-32 left-0 overflow-hidden invisible' ref={messageArea}></div>
                <div className='bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl break-all text-base overflow-hidden relative border border-gray-700/50 hover:border-[#f05a54]/50 transition-all duration-300 backdrop-blur-sm pr-4'>
                    <div className='bg-transparent rounded-xl break-all text-base md:text-xl py-4 md:py-6 flex'>
                        <div className='w-12 h-12 md:w-16 md:h-16 mt-2 ml-3 md:mt-3 md:ml-6 mr-3 flex-shrink-0'>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img alt='avatar' className='w-12 h-12 md:w-16 md:h-16 rounded-xl shadow-lg ring-2 ring-[#f05a54]/20 hover:ring-[#f05a54]/40 transition-all duration-300 cursor-pointer hover:scale-105'
                                onClick={() => setEdit(!edit)}
                                src={`https://assets-eu.mofei.life/gravatar/${hashemail || '0000000000'}?s=200`}
                            /></div>

                        <div className='flex-1 p- md:p-6 md:pt-2 text-sm md:text-base'>
                            <h2 className='font-bold text-lg md:text-xl mb-3 cursor-pointer group' onClick={() => setEdit(!edit)}>
                                <span className='text-white group-hover:text-[#f05a54] transition-colors duration-200'>
                                    {username ? username : 'Mofei\'s Friend'} </span>
                                <span className='text-gray-500 text-sm font-medium group-hover:text-gray-400 transition-colors duration-200'> 
                                    ({lang == 'zh' ? '点击编辑' : 'Click to edit'})
                                </span>
                            </h2>
                            <div>
                                {edit && (
                                    <div className='mt-4 mb-6 text-gray-400 bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/30'>
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
                                                    className="block w-full rounded-lg bg-gray-700/50 border border-gray-600/50 focus:border-[#f05a54]/50 focus:ring-2 focus:ring-[#f05a54]/20 px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base placeholder:text-gray-400 text-white transition-all duration-200 backdrop-blur-sm"
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
                                                    className="block w-full rounded-lg bg-gray-700/50 border border-gray-600/50 focus:border-[#f05a54]/50 focus:ring-2 focus:ring-[#f05a54]/20 px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base placeholder:text-gray-400 text-white transition-all duration-200 backdrop-blur-sm"
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
                                                    className="block w-full rounded-lg bg-gray-700/50 border border-gray-600/50 focus:border-[#f05a54]/50 focus:ring-2 focus:ring-[#f05a54]/20 px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base placeholder:text-gray-400 text-white transition-all duration-200 backdrop-blur-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className='mb-4 relative' >
                                <div 
                                    contentEditable 
                                    translate='no' 
                                    className='outline-none py-2 md:py-3 px-3 md:px-4 min-h-[80px] md:min-h-[100px] bg-gray-700/30 border border-gray-600/50 rounded-lg focus:border-[#f05a54]/50 focus:ring-2 focus:ring-[#f05a54]/20 transition-all duration-200 backdrop-blur-sm text-white text-sm md:text-base' 
                                    ref={editableDivRef} 
                                    onPaste={handlePaste} 
                                    onInput={handleInput} 
                                />
                                <div className='absolute top-2 md:top-3 left-3 md:left-4 py-0 pointer-events-none text-gray-500 truncate w-full text-sm md:text-base'>{(
                                    messageInput !== '' && messageInput !== '\n'
                                ) ? '' : (
                                    lang == 'zh' ? chineseMessages[chineseMessagesIndex] : englishMessages[englishMessagesIndex]
                                )}</div>
                            </div>
                            <div className='flex justify-end'>
                                <button 
                                    className='px-4 md:px-6 py-2 md:py-2.5 bg-gradient-to-r from-[#f05a54] to-[#e04b45] hover:from-[#e04b45] hover:to-[#d03c37] text-white rounded-lg font-medium text-sm transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
                                    onClick={() => {
                                        handleSubmit()
                                    }}
                                    disabled={isPosting || !messageInput.trim()}
                                >
                                    {isPosting ? (
                                        <div className='flex items-center gap-2'>
                                            <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                            {lang == 'zh' ? '发送中...' : 'Sending...'}
                                        </div>
                                    ) : (
                                        lang == 'zh' ? '发送留言' : 'Send Message'
                                    )}
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

                            <div className='bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl shadow-xl break-all
                                text-base
                                md:text-xl
                                py-4 md:py-6
                                flex
                                border border-gray-700/30
                                backdrop-blur-sm
                                animate-pulse
                            '>
                                <div className='mt-1 ml-3 mr-3 md:mt-2 md:ml-6 md:mr-4 flex-shrink-0
                                w-12 h-12 md:w-16 md:h-16 bg-gray-700/50 rounded-xl shadow-lg animate-pulse' />
                                <div className='
                                    flex-1 
                                    p-3 md:p-5
                                    text-base
                                '>
                                    <div className='font-bold bg-gray-700/50 w-32 inline-block h-5 md:h-6 rounded-lg mb-2 animate-pulse' />
                                    <div className='mt-3 space-y-2'>
                                        <div className='bg-gray-700/50 w-full h-4 rounded-lg animate-pulse' />
                                        <div className='bg-gray-700/50 w-3/4 h-4 rounded-lg animate-pulse' />
                                        <div className='bg-gray-700/50 w-1/2 h-4 rounded-lg animate-pulse' />
                                    </div>
                                    <div className='mt-4 flex items-center gap-2'>
                                        <div className='w-2 h-2 bg-gray-700/50 rounded-full animate-pulse' />
                                        <div className='bg-gray-700/50 w-24 h-3 rounded-lg animate-pulse' />
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
                                    <div className='bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl shadow-xl hover:shadow-2xl
                                        text-base md:text-lg
                                        py-4 md:py-6
                                        flex
                                        border border-gray-700/50 hover:border-[#f05a54]/30
                                        transition-all duration-300 backdrop-blur-md
                                        
                                        relative overflow-hidden
                                    >'>
                                        <div className='mt-1 ml-3 mr-3 md:mt-2 md:ml-6 md:mr-4 flex-shrink-0'>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img alt='avatar' className='rounded-xl shadow-lg ring-2 ring-gray-600/40 
                                                w-12 h-12 md:w-16 md:h-16
                                                transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl
                                                group-hover:ring-4'
                                                src={`https://assets-eu.mofei.life/gravatar/${blog.email || '0000000000'}?s=200`}
                                            />
                                        </div>
                                        <div className='
                                            flex-1 
                                            p-3 md:p-5 md:pt-0
                                            text-base
                                        '>
                                            <h2 className='font-bold text-lg md:text-xl mb-2 flex items-center gap-2'>
                                                <span className='text-white transition-all duration-300 group-hover:drop-shadow-lg'>{blog.name}</span>
                                                {blog.blog ? (
                                                    <a
                                                        href={blog.blog.startsWith('http://') || blog.blog.startsWith('https://') ? blog.blog : `https://${blog.blog}`}
                                                        target='_blank'
                                                        className="text-[#f05a54] hover:text-[#ff6b65] transition-all duration-300 hover:scale-125 transform hover:rotate-12 hover:drop-shadow-lg"
                                                    ><HomeIcon className='inline-block size-5' /></a>
                                                ) : ''}
                                            </h2>
                                            <div className='mt-3 text-gray-200 leading-relaxed prose prose-invert max-w-none group-hover:text-gray-100 transition-colors duration-300' dangerouslySetInnerHTML={{
                                                __html: updateLinks(
                                                    lang == 'zh' ? (blog.translate_zh || blog.content) : (blog.translate_en || blog.content)
                                                )
                                            }} />
                                            <div className='mt-4 flex items-center justify-between'>
                                                <div className='flex items-center gap-2'>
                                                    <div className='w-2 h-2 bg-blue-400 rounded-full opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-400/50'></div>
                                                    <span className='text-gray-400 text-sm font-medium group-hover:text-gray-300 transition-colors duration-300'>
                                                        {getRelativeTime(blog.time, lang == 'zh' ? 'zh-CN' : 'en-US')}
                                                    </span>
                                                </div>
                                                <div className='text-xs text-gray-500 bg-gray-800/30 px-2 py-1 rounded-md backdrop-blur-sm border border-gray-700/30 group-hover:border-gray-600/30 transition-all duration-300' title={new Date(blog.time).toLocaleDateString(
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
                <Pagination lang={lang} key={freshId} currentPage={Number(messagePage)} totalPages={totalPages} baseURL={baseURL} singlePageMode={singlePageMode} onPageChange={(page: number) => {
                    if (singlePageMode) {
                        setMessagePage(page)
                    } else {
                        // Change url hash, push to history
                        history.pushState({}, '', `${baseURL}${page}`)
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
