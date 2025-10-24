"use client"
// motion import removed as animations were disabled
import Pagination from '@/components/Common/Pagination';
import { usePerformance } from '@/hooks/usePerformance';
import { trackEvent } from '@/lib/gtag';
import { useEffect, useState, useRef, memo, useCallback } from 'react';

import { deleteComment, fetchMessageList, getToken, postMessage, updateComment } from '@/app/actions/blog';
import CommentInput from './CommentInput'
import CommentItem from './CommentItem'

// import { HomeIcon } from '@heroicons/react/24/outline'


interface ParentCommentMeta {
    id: number | string
    content: string
    name: string
    email: string
    time: string
    translate_zh?: string
    translate_en?: string
}
interface CommentEntry {
    id?: number | string
    _id?: number | string
    email: string
    name: string
    blog?: string
    content: string
    translate_zh?: string
    translate_en?: string
    time: string
    like?: string | number
    likes?: number
    isLiked?: boolean
    country?: string
    region?: string
    city?: string
    timezone?: string
    parent_comment?: ParentCommentMeta | null,
    ai_comment?: {
        id?: number | string;
        name?: string;
        content: string;
        time?: string;
        translate_en?: string;
        translate_zh?: string;
    } | null,
}



interface CommentsParams {
    lang: string;
    message_id: string;
    message_page?: number;
    singlePageMode?: boolean;
    baseURL?: string;
}

const encodeContentForDisplay = (raw: string) => {
    return raw
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/\r?\n/g, '<br />');
};

export default function Comments(params: CommentsParams) {
    // Performance monitoring
    usePerformance('Comments');

    const { lang, message_id, message_page = 1, singlePageMode = false, baseURL } = params
    const messageArea = useRef<HTMLDivElement>(null);
    const finalBaseURL = baseURL || `/${lang}/message`

    const [blogList, setBlogList] = useState<CommentEntry[]>([])
    const [totalPages, setTotalPages] = useState(1)
    const [messagePage, setMessagePage] = useState(message_page)
    const [freshId, setFreshId] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [isPosting, setIsPosting] = useState(false)
    // Remove animations entirely to prevent repeated animation issues
    // Users will get immediate content without confusing double animations


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

    const handleDeleteComment = useCallback(async (commentId: string, token: string) => {
        try {
            await deleteComment(commentId, token)
            localStorage.removeItem(`comment_token_${String(commentId)}`)
            setFreshId((prev) => prev + 1)
        } catch (error) {
            console.error('Failed to delete comment:', error)
            throw error
        }
    }, [])

    const handleUpdateComment = useCallback(async (commentId: string, token: string, content: string) => {
        try {
            const response = await updateComment(commentId, token, content)
            const payload = response?.data ?? response

            const newIdValue = payload?.id ?? payload?._id ?? commentId
            const previousIdValue = payload?.previousId ?? payload?.previous_id ?? commentId
            const previousKey = previousIdValue != null ? String(previousIdValue) : ''
            const hasNewId = newIdValue !== undefined && newIdValue !== null
            const nextKey = hasNewId ? String(newIdValue) : previousKey
            const previousLikedKey = previousKey ? `comment_liked_${previousKey}` : null
            const nextLikedKey = nextKey ? `comment_liked_${nextKey}` : null
            const updatedToken = typeof payload?.token === 'string' && payload.token.length > 0 ? payload.token : null

            if (previousKey) {
                localStorage.removeItem(`comment_token_${previousKey}`)
            }
            if (hasNewId && previousKey && nextKey && previousKey !== nextKey && previousLikedKey && nextLikedKey) {
                const existingLikedValue = localStorage.getItem(previousLikedKey)
                if (existingLikedValue !== null) {
                    localStorage.removeItem(previousLikedKey)
                    localStorage.setItem(nextLikedKey, existingLikedValue)
                }
            }

            if (nextKey && nextLikedKey && updatedToken) {
                localStorage.setItem(`comment_token_${nextKey}`, updatedToken)
                localStorage.setItem(nextLikedKey, updatedToken)
            }

            const safeContent = encodeContentForDisplay(content)
            const updatedTimestamp: string = payload?.time ?? payload?.updatedAt ?? new Date().toISOString()

            setBlogList((prevList) => {
                let replaced = false
                const nextList = prevList.map((item) => {
                    const currentKey = String(item.id ?? item._id ?? '')
                    if (!currentKey || currentKey !== previousKey) {
                        return item
                    }

                    replaced = true

                    const nextItem: CommentEntry = {
                        ...item,
                        content: safeContent,
                        translate_en: undefined,
                        translate_zh: undefined,
                        time: updatedTimestamp,
                    }

                    if (typeof item.id !== 'undefined') {
                        nextItem.id = hasNewId ? newIdValue : item.id
                    }
                    if (typeof item._id !== 'undefined') {
                        nextItem._id = hasNewId ? String(newIdValue) : item._id
                    }
                    if (typeof item.id === 'undefined' && typeof item._id === 'undefined' && hasNewId) {
                        nextItem.id = newIdValue
                    }

                    return nextItem
                })

                return replaced ? nextList : prevList
            })

            setFreshId((prev) => prev + 1)
        } catch (error) {
            console.error('Failed to update comment:', error)
            throw error
        }
    }, [])






    // 处理回复提交
    const handleSubmitReply = useCallback(async (commentId: string, content: string) => {
        if (!content.trim() || isPosting) return

        setIsPosting(true)
        try {
            // Get user data from localStorage
            const email = localStorage.getItem('email') || '';
            const username = localStorage.getItem('username') || 'Mofei\'s Friend';
            const website = localStorage.getItem('website') || '';

            const response = await postMessage(message_id, {
                content: content.trim(),
                email,
                name: username,
                website,
                replyId: commentId,
                lang: lang as 'zh' | 'en',
            })

            const rawId = response?.data?.id ?? response?.data?._id ?? response?.id ?? response?._id
            const rawToken = response?.data?.token ?? response?.token
            if (rawId != null && typeof rawToken === 'string' && rawToken.length > 0) {
                const commentId = String(rawId)
                const commentTokenKey = `comment_token_${commentId}`
                const commentLikedKey = `comment_liked_${commentId}`
                localStorage.setItem(commentTokenKey, rawToken)
                localStorage.setItem(commentLikedKey, rawToken)
            }

            // Track comment submission event
            trackEvent.commentSubmit(message_id)

            // 先滚动到留言区的第一条
            if (messageArea.current) {
                messageArea.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }

            // 等待滚动完成后再刷新列表
            setTimeout(() => {
                if (singlePageMode) {
                    setFreshId(freshId + 1)
                    setMessagePage(1)
                } else {
                    history.pushState({}, '', `${finalBaseURL}/1`)
                    setFreshId(freshId + 1)
                    setMessagePage(1)
                }
            }, 300); // 等待300ms让滚动动画完成

            // 回复成功不需要额外提示，回复框消失就是成功的反馈
        } catch (error) {
            console.error('Failed to post reply:', error)
        } finally {
            setIsPosting(false)
        }
    }, [isPosting, message_id, singlePageMode, finalBaseURL, freshId, lang])



    // 将评论列表提取为独立组件以减少重新渲染
    const CommentList = memo(({ blogList, lang, onSubmitReply, isPosting, onDeleteComment, onUpdateComment }: {
        blogList: CommentEntry[];
        lang: string;
        onSubmitReply: (commentId: string, content: string) => void;
        isPosting: boolean;
        onDeleteComment: (commentId: string, token: string) => Promise<void>;
        onUpdateComment: (commentId: string, token: string, content: string) => Promise<void>;
    }) => {
        return (
            <>
                {blogList.map((blog: CommentEntry) => {
                    const commentId = String(blog.id || blog._id || `${blog.email}_${blog.name}_${blog.time}`)
                    const itemKey = `${commentId}`;
                    return (
                        <CommentItem
                            key={itemKey}
                            blog={blog}
                            lang={lang}
                            onSubmitReply={onSubmitReply}
                            isPosting={isPosting}
                            onDeleteComment={onDeleteComment}
                            onUpdateComment={onUpdateComment}
                        />
                    );
                })}
            </>
        );
    }, (prevProps, nextProps) => {
        // 只有当列表本身或相关状态变化时才重新渲染
        if (prevProps.blogList.length !== nextProps.blogList.length) return false;
        if (prevProps.lang !== nextProps.lang) return false;
        if (prevProps.isPosting !== nextProps.isPosting) return false;
        return true;
    });

    CommentList.displayName = 'CommentList';

    return (
        <>
            {/* Post */}
            <div className='relative mb-8 md:mb-12'>
                <div className='w-0 h-0 absolute -top-20 md:-top-32 left-0 overflow-hidden invisible' ref={messageArea}></div>
                <CommentInput
                    onSubmit={({ content, email, name, website }) => {
                        postMessage(message_id, {
                            content,
                            email,
                            name,
                            website,
                            lang: lang as 'zh' | 'en',
                        }).then((response) => {
                            const rawId = response?.data?.id ?? response?.data?._id ?? response?.id ?? response?._id
                            const rawToken = response?.data?.token ?? response?.token
                            if (rawId != null && typeof rawToken === 'string' && rawToken.length > 0) {
                                const commentId = String(rawId)
                                const commentTokenKey = `comment_token_${commentId}`
                                const commentLikedKey = `comment_liked_${commentId}`
                                localStorage.setItem(commentTokenKey, rawToken)
                                localStorage.setItem(commentLikedKey, rawToken)
                            }
                            // Track comment submission event
                            trackEvent.commentSubmit(message_id);

                            // 先滚动到留言区的第一条
                            if (messageArea.current) {
                                messageArea.current.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start',
                                });
                            }

                            // 等待滚动完成后再刷新列表
                            setTimeout(() => {
                                if (singlePageMode) {
                                    setFreshId(freshId + 1)
                                    setMessagePage(1)
                                } else {
                                    // Change url hash, push to history
                                    history.pushState({}, '', `${finalBaseURL}/1`)
                                    setFreshId(freshId + 1)
                                    setMessagePage(1)
                                }
                            }, 300); // 等待300ms让滚动动画完成
                        }).catch((error) => {
                            console.error('Failed to post message:', error)
                        })
                    }}
                    isPosting={isPosting}
                    lang={lang}
                    showAvatar={true}
                    showUserFields={true}
                />
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

                            <div className='bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-8 border border-white/20 shadow-xl transition-all duration-500 relative group overflow-hidden break-all
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

                    {!isLoading && (
                        <CommentList
                            blogList={blogList}
                            lang={lang}
                            onSubmitReply={handleSubmitReply}
                            isPosting={isPosting}
                            onDeleteComment={handleDeleteComment}
                            onUpdateComment={handleUpdateComment}
                        />
                    )}
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
                        history.pushState({}, '', `${finalBaseURL}/${page}`)
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
