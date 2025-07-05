"use client";
import { motion, } from "motion/react"
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
        <motion.div className='max-w-7xl mx-auto 
              mt-16 mb-16
              md:mt-20 md:mb-20
            '
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
        >
            <motion.h3
                className='font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#a1c4fd] to-[#c2e9fb] 
                    text-2xl md:text-3xl lg:text-4xl mb-8 md:mb-12 text-center'
                animate={{ opacity: 1, translateY: 0 }}
                initial={{ opacity: 0, translateY: 20 }}
                transition={{ duration: 0.5 }}
            >{lang == 'zh' ? '更多精彩文章' : 'More Great Articles'}</motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 
                bg-gray-900/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 
                border border-gray-800/50 shadow-lg">
                {[...blogRecommend.slice(0, 10)].map((recommend: BlogRecommend, index: number) => {
                    const link = recommend.metadata
                    const title = lang == 'zh' ? link.title : link['title_en']
                    return (
                        <motion.div 
                            key={`recommends_${index}`} 
                            className='group'
                            animate={{ opacity: 1, translateY: 0 }}
                            initial={{ opacity: 0, translateY: 20 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                            <Link
                                href={`/${lang}/blog/article/${link.blog_id}`} target='_blank'
                                className='flex items-center p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 
                                    transition-all duration-300 border border-gray-700/30 hover:border-gray-600/50
                                    text-gray-300 hover:text-white group-hover:transform group-hover:scale-[1.02]'
                                title={title}
                            >
                                <BookOpenIcon className="size-5 mr-3 text-gray-500 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                                <span className="text-sm md:text-base truncate">{title}</span>
                            </Link>
                        </motion.div>
                    )
                })}
            </div>
        </motion.div>
    )
}