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
    const [freshId, setFreshId] = useState(0)
    const [commentTokens, setCommentTokens] = useState<Record<string, string>>({})
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

    const loadStoredTokens = useCallback(() => {
        if (typeof window === 'undefined') {
            return
        }

        const storedTokens: Record<string, string> = {}
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (!key) continue
            if (key.startsWith('comment_token_')) {
                const token = localStorage.getItem(key)
                if (token) {
                    const commentId = key.replace('comment_token_', '')
                    storedTokens[commentId] = token
                }
            }
        }
        setCommentTokens(storedTokens)
    }, [])

    useEffect(() => {
        loadStoredTokens()
    }, [loadStoredTokens])

    const handleDeleteComment = useCallback(async (commentId: string, token: string) => {
        try {
            await deleteComment(commentId, token)
            localStorage.removeItem(`comment_token_${commentId}`)
            setCommentTokens((prev) => {
                const updated = { ...prev }
                delete updated[commentId]
                return updated
            })
            setFreshId((prev) => prev + 1)
        } catch (error) {
            console.error('Failed to delete comment:', error)
            throw error
        }
    }, [])

    const handleUpdateComment = useCallback(async (commentId: string, token: string, content: string) => {
        try {
            await updateComment(commentId, token, content)
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

            if (response?.data?.id && response?.data?.token) {
                const commentKey = `comment_token_${response.data.id}`
                localStorage.setItem(commentKey, response.data.token)
                setCommentTokens((prev) => ({
                    ...prev,
                    [String(response.data.id)]: response.data.token,
                }))
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
    const CommentList = memo(({ blogList, lang, onSubmitReply, isPosting, commentTokens, onDeleteComment, onUpdateComment }: {
        blogList: Array<{ id?: string; _id?: string; email: string; name: string; blog?: string; content: string; translate_zh?: string; translate_en?: string; time: string; }>;
        lang: string;
        onSubmitReply: (commentId: string, content: string) => void;
        isPosting: boolean;
        commentTokens: Record<string, string>;
        onDeleteComment: (commentId: string, token: string) => Promise<void>;
        onUpdateComment: (commentId: string, token: string, content: string) => Promise<void>;
    }) => {
        return (
            <>
                {blogList.map((blog: { id?: string; _id?: string; email: string; name: string; blog?: string; content: string; translate_zh?: string; translate_en?: string; time: string; }) => {
                    const commentId = String(blog.id || blog._id || `${blog.email}_${blog.name}_${blog.time}`)
                    const itemKey = `${commentId}`;
                    return (
                        <CommentItem
                            key={itemKey}
                            blog={blog}
                            lang={lang}
                            onSubmitReply={onSubmitReply}
                            isPosting={isPosting}
                            ownedToken={commentTokens[commentId]}
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
        const prevTokens = prevProps.commentTokens;
        const nextTokens = nextProps.commentTokens;
        const prevTokenKeys = Object.keys(prevTokens);
        const nextTokenKeys = Object.keys(nextTokens);
        if (prevTokenKeys.length !== nextTokenKeys.length) return false;
        for (const key of prevTokenKeys) {
            if (prevTokens[key] !== nextTokens[key]) {
                return false;
            }
        }

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
                            if (response?.data?.id && response?.data?.token) {
                                const commentKey = `comment_token_${response.data.id}`
                                localStorage.setItem(commentKey, response.data.token)
                                setCommentTokens((prev) => ({
                                    ...prev,
                                    [String(response.data.id)]: response.data.token,
                                }))
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
                            commentTokens={commentTokens}
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
