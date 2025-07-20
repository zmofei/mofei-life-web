import React from "react";
import SPALink from '@/components/Common/SPALink';
import { useState } from 'react';
import { trackEvent } from '@/lib/gtag';
import LoadingSpinner from '@/components/util/LoadingSpinner';

type PaginationProps = {
    lang: string;
    currentPage: number;
    totalPages: number;
    baseURL: string;
    anchor?: string;
    singlePageMode?: boolean; // Support single page mode
    onPageChange?: (page: number) => void;
    onPageClick?: () => void; // New callback for loading states
    searchParams?: string; // Query parameters
};

const Pagination: React.FC<PaginationProps> = ({
    lang,
    currentPage,
    totalPages,
    baseURL = "/",
    singlePageMode = false,
    anchor,
    onPageChange,
    onPageClick,
    searchParams,
}) => {
    // 确保totalPages至少为1，避免边界值错误
    const safeTotal = Math.max(totalPages, 1);
    const pages = Array.from({ length: safeTotal }, (_, i) => i + 1);

    // Helper function to build URLs
    const buildUrl = (page: number) => {
        const url = `${baseURL}/${page}`;
        const queryParams = searchParams ? `?${searchParams}` : '';
        const anchorParam = anchor ? `#${anchor}` : '';
        return url + queryParams + anchorParam;
    };

    const [_page, setPage] = useState(currentPage);
    const [isLoading, setIsLoading] = useState(false);

    const handlePageChange = (page: number) => {
        // 边界检查：确保页面在有效范围内
        const safePage = Math.max(1, Math.min(page, safeTotal));
        
        // GA跟踪分页点击
        trackEvent.navClick('Pagination', `Page ${safePage} from ${currentPage}`);
        
        // Set loading state for navigation feedback
        setIsLoading(true);
        
        // Call external loading handler if provided
        if (onPageClick) {
            onPageClick();
        }
        
        if (onPageChange) {
            onPageChange(safePage);
        }
        setPage(safePage);
        
        // Clear loading state after navigation
        setTimeout(() => {
            setIsLoading(false);
        }, 600);
    };

    return (
        <div className="flex justify-center px-6 py-8 relative">
            {/* Loading overlay */}
            {isLoading && (
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                    <div className="glass-effect px-4 py-2 rounded-xl">
                        <LoadingSpinner 
                            variant="glass" 
                            size="sm" 
                            text={lang === 'zh' ? '加载中...' : 'Loading...'} 
                        />
                    </div>
                </div>
            )}
            <div
                className="flex items-center gap-3 text-white text-sm md:text-base px-4 py-2 rounded-full border border-white/20"
                style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.05) 100%)',
                    backdropFilter: 'blur(15px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(15px) saturate(180%)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)'
                }}

            >
                {/* Previous Button */}
                {_page > 1 && (
                    singlePageMode ? (
                        <button
                            className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-medium transition-all duration-300 cursor-pointer"
                            onClick={() => handlePageChange(_page - 1)}
                        >
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                {lang == 'zh' ? '上一页' : 'Previous'}
                            </div>
                        </button>
                    ) : (
                        <SPALink href={buildUrl(_page - 1)}>
                            <button
                                className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-medium transition-all duration-300 cursor-pointer"
                            >
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    {lang == 'zh' ? '上一页' : 'Previous'}
                                </div>
                            </button>
                        </SPALink>
                    )
                )}

                {/* Page Numbers */}
                <div className="hidden md:flex space-x-2">
                    <>
                        {pages.map((page) => (
                            singlePageMode ? (
                                <button
                                    key={`${page}_${_page}`}

                                    className={`px-3 py-1.5 rounded-full font-medium transition-all duration-300 cursor-pointer relative overflow-hidden
                                ${page === _page
                                            ? "bg-white/25 text-white font-medium shadow-lg"
                                            : "hover:bg-white/15 hover:text-white"
                                        }
                            `}
                                    style={{
                                        background: page === _page
                                            ? 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.15) 100%)'
                                            : 'transparent'
                                    }}
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </button>
                            ) : (
                                <SPALink href={buildUrl(page)} key={`${page}_${_page}`}>
                                    <button

                                        className={`px-3 py-1.5 rounded-full font-medium transition-all duration-300 cursor-pointer relative overflow-hidden
                                    ${page === _page
                                                ? "bg-white/25 text-white font-medium shadow-lg"
                                                : "hover:bg-white/15 hover:text-white"
                                            }
                                `}
                                        style={{
                                            background: page === _page
                                                ? 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.15) 100%)'
                                                : 'transparent'
                                        }}
                                    >
                                        {page}
                                    </button>
                                </SPALink>
                            )
                        ))}
                    </>
                </div>

                <div className="md:hidden px-3 py-1.5 bg-white/20 rounded-full text-white/80 font-medium cursor-default">{_page}/{totalPages}</div>

                {/* Next Button */}
                {_page < safeTotal && (
                    singlePageMode ? (
                        <button

                            className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-medium transition-all duration-300 cursor-pointer"
                            onClick={() => handlePageChange(_page + 1)}
                        >
                            <div className="flex items-center gap-2">
                                {lang == 'zh' ? '下一页' : 'Next'}
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </button>
                    ) : (
                        <SPALink href={buildUrl(_page + 1)}>
                            <button

                                className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-medium transition-all duration-300 cursor-pointer"
                            >
                                <div className="flex items-center gap-2">
                                    {lang == 'zh' ? '下一页' : 'Next'}
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </button>
                        </SPALink>
                    )
                )}
            </div>
        </div>
    );
};

export default Pagination;