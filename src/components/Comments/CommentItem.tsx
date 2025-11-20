"use client"
import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import Image from 'next/image';
import { likeComment } from '@/app/actions/blog';
import { trackEvent } from '@/lib/gtag';
import ReplyInput from './ReplyInput';
import { timeUtils } from '@/utils/timeUtils';

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

interface CommentItemProps {
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
        // Geolocation fields from TIME_HANDLING.md
        country?: string;
        region?: string;
        city?: string;
        timezone?: string;
        parent_comment?: {
            id: number;
            content: string;
            name: string;
            email: string;
            time: string;
            translate_zh?: string;
            translate_en?: string;
        };
        ai_comment?: {
            id?: number | string;
            name?: string;
            content: string;
            time?: string;
            translate_en?: string;
            translate_zh?: string;
        };
    };
    lang: string;
    onSubmitReply: (commentId: string, content: string) => void;
    isPosting: boolean;
}

const CommentItem = memo(({ blog, lang, onSubmitReply, isPosting }: CommentItemProps) => {
    const [showOriginal, setShowOriginal] = useState(false);
    const [replyActive, setReplyActive] = useState(false);
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

    const aiAssistantName = (blog.ai_comment?.name && blog.ai_comment.name.trim().length > 0)
        ? blog.ai_comment.name
        : (lang === 'zh' ? 'Mofei 的 AI 助理' : 'Mofei AI Assistant');
    
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

    const aiReplyContent = useMemo(() => {
        if (!blog.ai_comment) {
            return null;
        }

        const ai = blog.ai_comment;
        const candidate = lang === 'zh' ? ai.translate_zh : ai.translate_en;
        const hasCandidate = typeof candidate === 'string' && candidate.trim().length > 0;
        const display = hasCandidate ? candidate : ai.content;
        const isTranslated = hasCandidate && display !== ai.content;

        return {
            content: updateLinks(display),
            isTranslated,
        };
    }, [blog.ai_comment, lang]);

    // Cache original content
    const originalContent = useMemo(() => (
        <div className="mt-3 p-3 bg-white/[0.04] rounded-lg border border-white/10 text-sm text-gray-300 leading-relaxed">
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
        <div className='mt-5 md:mt-8'>
            <div className="rounded-2xl border border-white/12 bg-white/[0.05] p-4 md:p-6 text-sm md:text-lg">
                {/* 主体内容：手机端水平布局，电脑端左右布局 */}
                <div className='flex gap-3 md:gap-6'>
                    {/* 左侧：头像区域 */}
                    <div className='flex-shrink-0'>
                        <Image 
                            alt='avatar' 
                            className="rounded-xl border border-white/15 w-12 h-12 md:w-16 md:h-16 object-cover" 
                            src={`https://assets-eu.mofei.life/gravatar/${blog.email || '0000000000'}?s=200`}
                            width={64}
                            height={64}
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
                                        className="text-white/60 flex-shrink-0"
                                    >
                                        <svg className='inline-block size-4' fill='currentColor' viewBox='0 0 20 20'>
                                            <path fillRule='evenodd' d='M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z' clipRule='evenodd' />
                                        </svg>
                                    </a>
                                ) : ''}
                            </div>
                            
                            {/* 时间信息 */}
                            <div className="flex items-center gap-2 text-xs text-white/60 font-medium">
                                <span title={timeUtils.toLocaleDateString(blog.time, lang as 'zh' | 'en', {
                                    weekday: "short",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                })}>
                                    {timeUtils.fromNow(blog.time, lang as 'zh' | 'en')}
                                </span>
                                {/* Show timezone info if available */}
                                {blog.timezone && (
                                    <>
                                        <span className="text-white/40">•</span>
                                        <span className="text-white/40 text-xs">
                                            {blog.city && blog.country ? `${blog.city}, ${blog.country}` : blog.timezone}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                        
                        {/* 内容区域 */}
                        <div className='text-sm md:text-base [&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_ul]:my-2 [&_ul:first-child]:mt-0 [&_ul:last-child]:mb-0 [&_li]:my-1 [&_ul]:marker:text-white/60 [&_ol]:marker:text-white/60'>
                            <div className="text-gray-100 leading-relaxed prose prose-invert max-w-none text-sm md:text-base [&>p]:my-2 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
                                {/* Parent comment display - 显示被回复的内容 */}
                                {blog.parent_comment && (
                                    <div className="mb-4 p-3 bg-white/[0.04] rounded-lg border border-white/10">
                                        <div className="flex items-center gap-2 mb-2 text-xs text-white/60">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                            </svg>
                                            <span>{lang === 'zh' ? '回复' : 'Replying to'} @{blog.parent_comment.name}</span>
                                        </div>
                                        <div className="text-sm text-white/70 leading-relaxed" style={{ 
                                            display: '-webkit-box', 
                                            WebkitLineClamp: 3, 
                                            WebkitBoxOrient: 'vertical', 
                                            overflow: 'hidden' 
                                        }}>
                                            <div dangerouslySetInnerHTML={{ 
                                                __html: updateLinks(
                                                    lang === 'zh' && blog.parent_comment.translate_zh && blog.parent_comment.translate_zh !== blog.parent_comment.content 
                                                        ? blog.parent_comment.translate_zh 
                                                        : lang === 'en' && blog.parent_comment.translate_en && blog.parent_comment.translate_en !== blog.parent_comment.content
                                                        ? blog.parent_comment.translate_en
                                                        : blog.parent_comment.content
                                                ) 
                                            }} />
                                        </div>
                                    </div>
                                )}
                                
                                {/* 显示翻译内容（已缓存，不会重新渲染） */}
                                {translatedContent}

                                {aiReplyContent && (
                                    <div className="mt-4 rounded-xl border border-sky-400/25 bg-sky-500/10 p-4 text-sm leading-relaxed text-sky-50">
                                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-100 mb-3">
                                            <svg className="h-3 w-3" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 2.5l1.4 3.4 3.6.4-2.6 2.4.7 3.5L10 10.8l-3.1 1.4.7-3.5L5 6.3l3.6-.4L10 2.5z" />
                                            </svg>
                                            <span>{aiAssistantName}</span>
                                            <span className="rounded-full border border-sky-300/30 px-2 py-0.5 text-[10px] tracking-[0.15em] text-sky-100/80">
                                                {lang === 'zh' ? 'AI 生成' : 'AI GENERATED'}
                                            </span>
                                        </div>
                                        <div
                                            className="prose prose-invert max-w-none text-sky-50 [&>p]:my-2 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0"
                                            dangerouslySetInnerHTML={{ __html: aiReplyContent.content }}
                                        />
                                        {aiReplyContent.isTranslated && (
                                            <div className="mt-2 text-[11px] text-sky-100/60">
                                                {lang === 'zh' ? '原文由 AI 自动翻译' : 'Original auto-translated by AI'}
                                            </div>
                                        )}
                                        {blog.ai_comment?.time && (
                                            <div
                                                className="mt-2 text-[11px] text-sky-100/60"
                                                title={timeUtils.toLocaleDateString(blog.ai_comment.time, lang as 'zh' | 'en', {
                                                    weekday: 'short',
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: 'numeric',
                                                    minute: 'numeric',
                                                })}
                                            >
                                                {timeUtils.fromNow(blog.ai_comment.time, lang as 'zh' | 'en')}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* 显示原文按钮 */}
                                {shouldShowOriginalButton && (
                                    <button
                                        onClick={() => setShowOriginal(!showOriginal)}
                                        className="mt-2 flex items-center gap-2 text-gray-400 text-sm"
                                    >
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                        <span>{showOriginal ? (lang === 'zh' ? '隐藏原文' : 'Hide Original') : (lang === 'zh' ? '查看原文' : 'Show Original')}</span>
                                    </button>
                                )}
                                
                                {/* 可展开的原文内容（已缓存，不会重新渲染） */}
                                {showOriginal && shouldShowOriginalButton && originalContent}
                                
                                {/* 内联回复区域 - 放在按钮前面 */}
                                {replyActive && !isPosting && (
                                    <div className="mt-3 mb-3">
                                        <ReplyInput
                                            commentId={commentId}
                                            onSubmit={(id, content) => {
                                                onSubmitReply(id, content);
                                                setReplyActive(false);
                                            }}
                                            onCancel={() => setReplyActive(false)}
                                            isPosting={isPosting}
                                            lang={lang}
                                        />
                                    </div>
                                )}
                                
                                {/* 点赞和回复按钮 - 单独一行左对齐 */}
                                <div className="flex items-center justify-start gap-3 mt-3">
                                    <button
                                        onClick={handleLike}
                                        disabled={isLiking}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors 
                                            ${isLiked 
                                                ? 'text-red-400 border-red-400/30 bg-red-400/10' 
                                                : 'text-white/70 border-white/15 bg-transparent hover:bg-white/10 hover:text-white'
                                            } 
                                            ${isLiking ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                            flex-shrink-0`}
                                    >
                                        <svg 
                                            className="w-3.5 h-3.5" 
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
                                    
                                    {/* 回复按钮 */}
                                    <button
                                        onClick={() => setReplyActive(!replyActive)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-blue-400/25 text-blue-300/90 bg-transparent hover:bg-blue-400/10 hover:text-blue-200 transition-colors cursor-pointer flex-shrink-0"
                                    >
                                        <svg 
                                            className="w-3.5 h-3.5" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth={2} 
                                                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" 
                                            />
                                        </svg>
                                        <span>{lang === 'zh' ? '回复' : 'Reply'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}, (prevProps, nextProps) => {
    // 只有当这个特定评论的相关属性变化时才重新渲染
    const prevCommentId = prevProps.blog.id || prevProps.blog._id || '';
    const nextCommentId = nextProps.blog.id || nextProps.blog._id || '';
    
    // 基本属性比较
    if (prevCommentId !== nextCommentId) return false;
    if (prevProps.blog.like !== nextProps.blog.like) return false;
    if (prevProps.blog.content !== nextProps.blog.content) return false;
    if (!!prevProps.blog.ai_comment !== !!nextProps.blog.ai_comment) return false;
    if (prevProps.blog.ai_comment?.content !== nextProps.blog.ai_comment?.content) return false;
    if (prevProps.blog.ai_comment?.translate_en !== nextProps.blog.ai_comment?.translate_en) return false;
    if (prevProps.blog.ai_comment?.translate_zh !== nextProps.blog.ai_comment?.translate_zh) return false;
    if (prevProps.blog.ai_comment?.time !== nextProps.blog.ai_comment?.time) return false;
    if (prevProps.blog.ai_comment?.name !== nextProps.blog.ai_comment?.name) return false;
    if (prevProps.isPosting !== nextProps.isPosting) return false;
    if (prevProps.lang !== nextProps.lang) return false;
    
    // 函数引用比较（这些函数应该是稳定的）
    if (prevProps.onSubmitReply !== nextProps.onSubmitReply) return false;
    
    // 其他属性相同则不重新渲染
    return true;
});

CommentItem.displayName = 'CommentItem';

export default CommentItem;
