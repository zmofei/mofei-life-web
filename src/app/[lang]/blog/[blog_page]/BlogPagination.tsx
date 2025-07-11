"use client";

import Pagination from '@/components/Common/Pagination';
import { useLanguage } from '@/components/Context/LanguageContext';
import { useSearchParams } from 'next/navigation';

export default function BlogPagination({ blog_page, totalPages, baseURL }: { blog_page: number, totalPages: number, baseURL: string }) {
    const lang = useLanguage().lang
    const searchParams = useSearchParams();
    const tag = searchParams.get('tag');
    
    return (<>
        <div className='py-0 md:py-8 mt-6 md:mt-10'>
            <Pagination 
                lang={lang} 
                currentPage={Number(blog_page)} 
                totalPages={totalPages} 
                baseURL={baseURL} 
                anchor='blogList'
                searchParams={tag ? `tag=${tag}` : undefined}
            />
        </div>
    </>)
}