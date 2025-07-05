import React from "react";
import { motion } from "motion/react";
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
};

const Pagination: React.FC<PaginationProps> = ({
    lang,
    currentPage,
    totalPages,
    baseURL = "/",
    singlePageMode = false,
    anchor,
    onPageChange,
}) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);


    const [_page, setPage] = useState(currentPage);

    const handlePageChange = (page: number) => {
        if (onPageChange) {
            onPageChange(page);
        }
        setPage(page);
    };

    return (
        <div className="flex justify-center items-center space-x-3 
            mt-2 text-base
            md:mt-4 md:text-xl
            px-4 py-6
        ">
            {/* Previous Button */}
            {_page > 1 && (
                singlePageMode ? (
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#f05a54] to-[#e04b45] hover:from-[#e04b45] hover:to-[#d03c37] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                        onClick={() => handlePageChange(_page - 1)}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0 }}
                    >
                        {lang == 'zh' ? '上一页' : 'Previous'}
                    </motion.button>
                ) : (
                    <Link href={`${baseURL}/${_page - 1}${anchor ? `#${anchor}` : ''}`} prefetch={true}>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#f05a54] to-[#e04b45] hover:from-[#e04b45] hover:to-[#d03c37] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0 }}
                        >
                            {lang == 'zh' ? '上一页' : 'Previous'}
                        </motion.button>
                    </Link>
                )
            )}

            {/* Page Numbers */}
            <div className="hidden md:flex space-x-2">
                <>
                    {pages.map((page) => (
                        singlePageMode ? (
                            <motion.button
                                key={`${page}_${_page}`}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.15, delay: page * 0.02 }}
                                whileHover={{
                                    scale: 1.1,
                                    y: -2
                                }}
                                whileTap={{ scale: 0.9 }}
                                className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-200 
                                ${page === _page
                                        ? "bg-gradient-to-r from-[#f05a54] to-[#e04b45] text-white shadow-lg"
                                        : "bg-gray-700/50 text-gray-200 hover:bg-gray-600/50 border border-gray-600/50 hover:border-gray-500/50 backdrop-blur-sm"
                                    }
                            `}
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </motion.button>
                        ) : (
                            <Link href={`${baseURL}/${page}${anchor ? `#${anchor}` : ''}`} key={`${page}_${_page}`} prefetch={true}>
                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.15, delay: page * 0.02 }}
                                    whileHover={{
                                        scale: 1.1,
                                        y: -2
                                    }}
                                    whileTap={{ scale: 0.9 }}
                                    className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-200 
                                    ${page === _page
                                            ? "bg-gradient-to-r from-[#f05a54] to-[#e04b45] text-white shadow-lg"
                                            : "bg-gray-700/50 text-gray-200 hover:bg-gray-600/50 border border-gray-600/50 hover:border-gray-500/50 backdrop-blur-sm"
                                        }
                                `}
                                >
                                    {page}
                                </motion.button>
                            </Link>
                        )
                    ))}
                </>
            </div>

            <div className="md:hidden px-4 py-2 bg-gray-700/30 rounded-lg text-gray-200 font-medium backdrop-blur-sm border border-gray-600/30">{_page}/{totalPages}</div>

            {/* Next Button */}
            {_page < totalPages && (
                singlePageMode ? (
                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#f05a54] to-[#e04b45] hover:from-[#e04b45] hover:to-[#d03c37] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                        onClick={() => handlePageChange(_page + 1)}
                    >
                        {lang == 'zh' ? '下一页' : 'Next'}
                    </motion.button>
                ) : (
                    <Link href={`${baseURL}/${_page + 1}${anchor ? `#${anchor}` : ''}`} prefetch={true}>
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#f05a54] to-[#e04b45] hover:from-[#e04b45] hover:to-[#d03c37] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            {lang == 'zh' ? '下一页' : 'Next'}
                        </motion.button>
                    </Link>
                )
            )}
        </div>
    );
};

export default Pagination;