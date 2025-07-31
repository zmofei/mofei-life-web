"use client"
import { useState, useRef, useEffect, useCallback } from 'react';
import sha256 from 'crypto-js/sha256';
import Image from 'next/image';

interface CommentInputProps {
    onSubmit: (data: {
        content: string;
        email: string;
        name: string;
        website: string;
        replyId?: string;
    }) => void;
    onCancel?: () => void;
    isPosting: boolean;
    lang: string;
    replyId?: string;
    placeholder?: string;
    showAvatar?: boolean;
    showUserFields?: boolean;
    className?: string;
}

export default function CommentInput({
    onSubmit,
    onCancel,
    isPosting,
    lang,
    replyId,
    placeholder,
    showAvatar = true,
    showUserFields = true,
    className = ""
}: CommentInputProps) {
    const [messageInput, setMessageInput] = useState('');
    const [edit, setEdit] = useState(false);
    const editableDivRef = useRef<HTMLDivElement>(null);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    const [username, setUsername] = useState('Mofei\'s Friend');
    const [email, setEmail] = useState('');
    const [hashemail, setHashemail] = useState('');
    const [website, setWebsite] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const email = localStorage.getItem('email') || '';
        setEmail(email);
        setHashemail(sha256(email).toString());
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
        const storedWebsite = localStorage.getItem('website') || '';
        setWebsite(storedWebsite);
    }, []);

    const handleInput = useCallback(() => {
        if (!editableDivRef.current) return;
        
        // Get plain text content with line breaks preserved
        const textContent = editableDivRef.current.innerText || '';
        
        setMessageInput(textContent);
    }, []);

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
        
        // Manually trigger handleInput to update messageInput state
        setTimeout(() => {
            handleInput();
        }, 0);
    }, [handleInput]);

    const handleEmail = useCallback((email: string) => {
        setHashemail(sha256(email).toString());
    }, []);

    const handleSubmit = useCallback(() => {
        if (isPosting || !messageInput.trim()) {
            return;
        }
        
        onSubmit({
            content: messageInput,
            email,
            name: username,
            website,
            replyId
        });

        setMessageInput('');
        
        // Clear the contentEditable div
        if (editableDivRef.current) {
            editableDivRef.current.innerHTML = '';
        }
        
        // Show success notification for main comments
        if (!replyId) {
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
            }, 3000);
        }
    }, [isPosting, messageInput, email, username, website, replyId, onSubmit]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (replyId) {
            // For replies, use Ctrl+Enter to submit and Esc to cancel
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleSubmit();
            }
            if (e.key === 'Escape' && onCancel) {
                e.preventDefault();
                onCancel();
            }
        }
    }, [replyId, handleSubmit, onCancel]);

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

    const [chineseMessagesIndex, setChineseMessagesIndex] = useState(0);
    const [englishMessagesIndex, setEnglishMessagesIndex] = useState(0);
    
    // Initialize random indices on client side only
    useEffect(() => {
        setChineseMessagesIndex(Math.floor(Math.random() * chineseMessages.length));
        setEnglishMessagesIndex(Math.floor(Math.random() * englishMessages.length));
    }, [chineseMessages.length, englishMessages.length]);

    const defaultPlaceholder = replyId 
        ? (lang === 'zh' ? '输入你的回复... (Ctrl+Enter 发送, Esc 取消)' : 'Enter your reply... (Ctrl+Enter to send, Esc to cancel)')
        : (lang === 'zh' ? chineseMessages[chineseMessagesIndex] : englishMessages[englishMessagesIndex]);

    return (
        <div className={`bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10 shadow-xl ${className}`}>
            {showAvatar && showUserFields ? (
                <div>
                    {/* Top row: User name */}
                    <h2 className={`font-bold cursor-pointer ${replyId ? 'text-sm md:text-base mb-2 mt-0' : 'text-lg md:text-2xl mb-3'}`} onClick={() => setEdit(!edit)}>
                        <span className='text-white drop-shadow-lg'>
                            {username ? username : 'Mofei\'s Friend'} 
                        </span>
                        <svg className="w-3 h-3 md:w-4 md:h-4 ml-2 text-gray-400 hover:text-gray-300 transition-colors inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </h2>

                    {/* User edit form */}
                    {edit && (
                        <div className={`text-gray-400 bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-xl transition-all duration-500 relative group overflow-hidden ${replyId ? 'mb-3' : 'mb-4'}`}>
                            <div className='mb-3'>
                                <label htmlFor="nickname" className="block font-medium text-sm">
                                    {lang === 'zh' ? '昵称' : 'Nickname'}
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="nickname"
                                        name="nickname"
                                        type="search"
                                        value={username}
                                        onChange={(e) => {
                                            setUsername(e.target.value);
                                            localStorage.setItem('username', e.target.value);
                                        }}
                                        placeholder="Mofei's Friend"
                                        className="block w-full bg-white/10 backdrop-blur-lg rounded-xl p-2 md:p-3 border border-white/20 shadow-xl transition-all duration-500 relative group overflow-hidden focus:border-[#f05a54]/50 focus:ring-2 focus:ring-[#f05a54]/20 text-sm placeholder:text-gray-400 text-white"
                                    />
                                </div>
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="email" className="block font-medium text-sm">
                                    {lang === 'zh' ?
                                        '邮箱（用于显示留言头像）' :
                                        <span>Email (Used to display <a href='https://gravatar.com/' target="_blank" className='underline'> the avatar</a>)</span>}
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="search"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            localStorage.setItem('email', e.target.value);

                                            // Clear previous timer
                                            if (debounceTimeout.current) {
                                                clearTimeout(debounceTimeout.current);
                                            }

                                            // Set new timer
                                            debounceTimeout.current = setTimeout(() => {
                                                handleEmail(e.target.value);
                                            }, 1000);
                                        }}
                                        placeholder="you@example.com"
                                        className="block w-full bg-white/10 backdrop-blur-lg rounded-xl p-2 md:p-3 border border-white/20 shadow-xl transition-all duration-500 relative group overflow-hidden focus:border-[#f05a54]/50 focus:ring-2 focus:ring-[#f05a54]/20 text-sm placeholder:text-gray-400 text-white"
                                    />
                                </div>
                            </div>
                            <div className='mb-0'>
                                <label htmlFor="website" className="block text-sm font-medium">
                                    {lang === 'zh' ? '网站 (有效网站会在留言姓名后显示链接)' : 'Website (Valid websites will be displayed as links after the message name)'}
                                </label>
                                <div className="mt-1">
                                    <input
                                        autoComplete='off'
                                        id="website"
                                        name="website"
                                        type="search"
                                        value={website}
                                        onChange={(e) => {
                                            setWebsite(e.target.value);
                                            localStorage.setItem('website', e.target.value);
                                        }}
                                        placeholder="https://example.com"
                                        className="block w-full bg-white/10 backdrop-blur-lg rounded-xl p-2 md:p-3 border border-white/20 shadow-xl transition-all duration-500 relative group overflow-hidden focus:border-[#f05a54]/50 focus:ring-2 focus:ring-[#f05a54]/20 text-sm placeholder:text-gray-400 text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bottom row: Avatar + Input area */}
                    <div className="flex gap-3 md:gap-6 items-start">
                        {/* Left: Avatar */}
                        <div className="flex-shrink-0 self-start">
                            <Image 
                                alt='avatar' 
                                className={`rounded-2xl shadow-xl ring-2 ring-white/20 cursor-pointer object-cover m-0 ${replyId ? 'w-10 h-10 md:w-12 md:h-12' : 'w-12 h-12 md:w-16 md:h-16'}`}
                                onClick={() => setEdit(!edit)}
                                src={`https://assets-eu.mofei.life/gravatar/${hashemail || '0000000000'}?s=200`}
                                width={replyId ? 48 : 64}
                                height={replyId ? 48 : 64}
                                loading="lazy"
                                style={{ transition: 'none', margin: 0 }}
                            />
                        </div>

                        {/* Right: Input and buttons */}
                        <div className="flex-1 min-w-0">
                            {/* Input area */}
                            <div className={`relative ${replyId ? 'mb-3' : 'mb-4'}`}>
                                <div 
                                    contentEditable 
                                    translate='no' 
                                    className={`outline-none overflow-y-auto bg-white/10 backdrop-blur-lg rounded-2xl p-2 md:p-4 border border-white/20 shadow-xl transition-all duration-500 relative group focus:border-[#f05a54]/50 focus:ring-2 focus:ring-[#f05a54]/20 text-white text-sm md:text-base whitespace-pre-wrap ${
                                        replyId 
                                            ? 'min-h-[50px] md:min-h-[60px] max-h-[200px] md:max-h-[250px]' 
                                            : 'min-h-[60px] md:min-h-[100px] max-h-[300px] md:max-h-[400px]'
                                    }`} 
                                    ref={editableDivRef} 
                                    onPaste={handlePaste} 
                                    onInput={handleInput}
                                    onKeyDown={handleKeyDown}
                                    onFocus={(e) => {
                                        e.stopPropagation();
                                    }}
                                />
                                <div className='absolute top-2 md:top-4 left-2 md:left-4 py-0 pointer-events-none text-gray-400 truncate w-[calc(100%-1rem)] md:w-full text-xs md:text-base'>
                                    {(messageInput !== '' && messageInput !== '\n') ? '' : (placeholder || defaultPlaceholder)}
                                </div>
                            </div>

                            {/* Success message */}
                            {showSuccess && !replyId && (
                                <div className='mb-4 bg-green-400/10 backdrop-blur-lg rounded-2xl p-3 md:p-4 border border-green-400/20 shadow-xl transition-all duration-500 relative group overflow-hidden flex items-center gap-2 text-green-400 text-sm'>
                                    <svg className='w-4 h-4 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                                        <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                                    </svg>
                                    <span>{lang === 'zh' ? '留言发表成功！' : 'Message posted successfully!'}</span>
                                </div>
                            )}

                            {/* Action buttons */}
                            <div className={`flex ${replyId ? 'justify-start' : 'justify-end'} gap-2`}>
                                {replyId && onCancel && (
                                    <button
                                        onClick={onCancel}
                                        className="px-3 py-2 text-sm text-gray-400 hover:text-gray-300 transition-colors duration-200"
                                        disabled={isPosting}
                                    >
                                        {lang === 'zh' ? '取消' : 'Cancel'}
                                    </button>
                                )}
                                <button 
                                    className={`bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl transition-all duration-500 relative group overflow-hidden text-white font-semibold text-sm transform hover:bg-white/20 hover:scale-105 active:opacity-70 disabled:opacity-60 disabled:cursor-not-allowed focus:ring-2 focus:ring-[#f05a54]/30 cursor-pointer focus-ring ${
                                        replyId ? 'px-4 py-2' : 'px-4 md:px-6 py-2 md:py-3'
                                    }`}
                                    onClick={handleSubmit}
                                    disabled={isPosting || !messageInput.trim()}
                                >
                                    <div className="relative z-10 flex items-center justify-center gap-2">
                                        {isPosting ? (
                                            <>
                                                <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                                                <span className="animate-pulse">{lang === 'zh' ? '发送中...' : 'Sending...'}</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                                <span>{replyId ? (lang === 'zh' ? '发送回复' : 'Send Reply') : (lang === 'zh' ? '发送留言' : 'Send Message')}</span>
                                            </>
                                        )}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Fallback for when avatar/user fields are disabled */
                <div>
                    {/* Input area */}
                    <div className={`relative ${replyId ? 'mb-3' : 'mb-4'}`}>
                        <div 
                            contentEditable 
                            translate='no' 
                            className={`outline-none overflow-y-auto bg-white/10 backdrop-blur-lg rounded-2xl p-2 md:p-4 border border-white/20 shadow-xl transition-all duration-500 relative group focus:border-[#f05a54]/50 focus:ring-2 focus:ring-[#f05a54]/20 text-white text-sm md:text-base whitespace-pre-wrap ${
                                replyId 
                                    ? 'min-h-[50px] md:min-h-[60px] max-h-[200px] md:max-h-[250px]' 
                                    : 'min-h-[60px] md:min-h-[100px] max-h-[300px] md:max-h-[400px]'
                            }`} 
                            ref={editableDivRef} 
                            onPaste={handlePaste} 
                            onInput={handleInput}
                            onKeyDown={handleKeyDown}
                            onFocus={(e) => {
                                e.stopPropagation();
                            }}
                        />
                        <div className='absolute top-2 md:top-4 left-2 md:left-4 py-0 pointer-events-none text-gray-400 truncate w-[calc(100%-1rem)] md:w-full text-xs md:text-base'>
                            {(messageInput !== '' && messageInput !== '\n') ? '' : (placeholder || defaultPlaceholder)}
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className={`flex ${replyId ? 'justify-start' : 'justify-end'} gap-2`}>
                        {replyId && onCancel && (
                            <button
                                onClick={onCancel}
                                className="px-3 py-2 text-sm text-gray-400 hover:text-gray-300 transition-colors duration-200"
                                disabled={isPosting}
                            >
                                {lang === 'zh' ? '取消' : 'Cancel'}
                            </button>
                        )}
                        <button 
                            className={`bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl transition-all duration-500 relative group overflow-hidden text-white font-semibold text-sm transform hover:bg-white/20 hover:scale-105 active:opacity-70 disabled:opacity-60 disabled:cursor-not-allowed focus:ring-2 focus:ring-[#f05a54]/30 cursor-pointer focus-ring ${
                                replyId ? 'px-4 py-2' : 'px-4 md:px-6 py-2 md:py-3'
                            }`}
                            onClick={handleSubmit}
                            disabled={isPosting || !messageInput.trim()}
                        >
                            <div className="relative z-10 flex items-center justify-center gap-2">
                                {isPosting ? (
                                    <>
                                        <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                                        <span className="animate-pulse">{lang === 'zh' ? '发送中...' : 'Sending...'}</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                        <span>{replyId ? (lang === 'zh' ? '发送回复' : 'Send Reply') : (lang === 'zh' ? '发送留言' : 'Send Message')}</span>
                                    </>
                                )}
                            </div>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}