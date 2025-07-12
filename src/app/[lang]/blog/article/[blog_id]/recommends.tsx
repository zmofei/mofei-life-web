"use client";
import { useLanguage } from '@/components/Context/LanguageContext'
import Link from "next/link";

import { BookOpenIcon } from '@heroicons/react/24/outline'


interface BlogRecommend {
    metadata: {
        blog_id: string;
        title: string;
        title_en: string;
    };
}

export default function Recommend({ blogRecommend }: { blogRecommend: Array<BlogRecommend> }) {

    const { lang } = useLanguage();

    if (!blogRecommend) {
        return <></>
    }


    return blogRecommend.length == 0 ? <></> : (
        <div className='max-w-7xl mx-auto px-2 md:px-6 lg:px-8
              mt-16 mb-16
              md:mt-20 md:mb-20
            '

        >
            <h3
                className='font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#a1c4fd] to-[#c2e9fb] 
                    text-2xl md:text-3xl lg:text-4xl mb-8 md:mb-12 text-center'

            >{lang == 'zh' ? '更多精彩文章' : 'More Great Articles'}</h3>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl md:rounded-2xl p-4 md:p-8 
                border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500
                relative group overflow-hidden">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 relative z-10">
                    {[...blogRecommend.slice(0, 10)].map((recommend: BlogRecommend, index: number) => {
                        const link = recommend.metadata
                        const title = lang == 'zh' ? link.title : link['title_en']
                        return (
                            <div key={`recommends_${index}`}>
                                <Link
                                    href={`/${lang}/blog/article/${link.blog_id}`} target='_blank'
                                    className='flex items-center p-3 rounded-lg bg-white/5 backdrop-blur-md hover:bg-white/10 
                                    transition-all duration-300 border border-white/15 hover:border-white/25
                                    text-white/80 hover:text-white
                                    relative overflow-hidden'
                                    title={title}
                                >
                                    {/* Enhanced glass effects for each item - only on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-transparent hover:from-white/4 transition-all duration-300 pointer-events-none rounded-lg"></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-white/0 hover:from-black/8 hover:to-white/3 transition-all duration-300 pointer-events-none rounded-lg"></div>

                                    {/* Top edge highlight for each item - only on hover */}
                                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/0 to-transparent hover:via-white/15 transition-all duration-300 rounded-t-lg pointer-events-none"></div>

                                    {/* Left edge highlight for each item - only on hover */}
                                    <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-white/0 via-white/0 to-transparent hover:from-white/8 hover:via-white/4 transition-all duration-300 rounded-l-lg pointer-events-none"></div>

                                    {/* Corner light effects for each item - only on hover */}
                                    <div className="absolute top-0 left-0 w-8 h-8 bg-gradient-to-br from-white/0 to-transparent hover:from-white/6 transition-all duration-300 rounded-tl-lg pointer-events-none"></div>
                                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-gradient-to-tl from-white/0 to-transparent hover:from-white/3 transition-all duration-300 rounded-br-lg pointer-events-none"></div>

                                    {/* Shimmer effect for each item - only on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent 
                                    -translate-x-full hover:translate-x-full transition-transform duration-700 ease-out
                                    pointer-events-none rounded-lg"></div>

                                    <BookOpenIcon className="size-5 mr-3 text-white/60 hover:text-blue-400 transition-colors flex-shrink-0 relative z-10" />
                                    <span className="text-sm md:text-base truncate relative z-10">{title}</span>
                                </Link>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}