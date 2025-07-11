import React from "react";
import Link from "next/link";
import { useState } from 'react';

type PaginationProps = {
    lang: string;
    currentPage: number;
    totalPages: number;
    baseURL: string;
    anchor?: string;
    singlePageMode?: boolean; // 支持单页模式
    onPageChange?: (page: number) => void;
    searchParams?: string; // 查询参数
};

const Pagination: React.FC<PaginationProps> = ({
    lang,
    currentPage,
    totalPages,
    baseURL = "/",
    singlePageMode = false,
    anchor,
    onPageChange,
    searchParams,
}) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    // 构建URL的帮助函数
    const buildUrl = (page: number) => {
        const url = `${baseURL}/${page}`;
        const queryParams = searchParams ? `?${searchParams}` : '';
        const anchorParam = anchor ? `#${anchor}` : '';
        return url + queryParams + anchorParam;
    };

    const [_page, setPage] = useState(currentPage);

    const handlePageChange = (page: number) => {
        if (onPageChange) {
            onPageChange(page);
        }
        setPage(page);
    };

    return (
        <div className="flex justify-center px-6 py-8">
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
                        <Link href={buildUrl(_page - 1)} prefetch={true}>
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
                        </Link>
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
                                <Link href={buildUrl(page)} key={`${page}_${_page}`} prefetch={true}>
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
                                </Link>
                            )
                        ))}
                    </>
                </div>

                <div className="md:hidden px-3 py-1.5 bg-white/20 rounded-full text-white/80 font-medium cursor-default">{_page}/{totalPages}</div>

                {/* Next Button */}
                {_page < totalPages && (
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
                        <Link href={buildUrl(_page + 1)} prefetch={true}>
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
                        </Link>
                    )
                )}
            </div>
        </div>
    );
};

export default Pagination;