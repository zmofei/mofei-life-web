
import Foot from '@/components/Common/Foot';
import Link from 'next/link';

import { fetchBlogList } from '@/app/actions/blog-server';

import BlogBannerTitle from './BlogBannerTitle'
import BlogItemBlock from './BlogItemBlock'
import BlogPagination from './BlogPagination'
import BlogBackground from './BlogBackground'
import './blog-grid.css'

import type { Metadata } from 'next'


type Props = {
  params: Promise<{ lang: 'zh' | 'en', blog_page: number }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, blog_page } = await params

  return {
    alternates: {
      canonical: `https://www.mofei.life/${lang}/blog/${blog_page}`,
      languages: {
        'en': `https://www.mofei.life/en/blog/${blog_page}`,
        'zh': `https://www.mofei.life/zh/blog/${blog_page}`,
      }
    },
  }
}


export default async function BlogPage({ params }: Props) {

  const { lang, blog_page }: { lang: 'zh' | 'en', blog_page: number } = await (params)

  const blogInfo = (await fetchBlogList(blog_page, lang));
  const blogList = blogInfo.list;
  const totalPages = Math.ceil(blogInfo.count / 12);




  return (
    <>
      <BlogBackground />
      
      <div className="relative z-10">
        <BlogBannerTitle lang={lang} />
      
      {/* Separator between banner and blog items */}
      <div className="container max-w-[2000px] m-auto px-5 md:px-10 my-8 md:my-12">
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>
      
      <div id="blogList" className='relative -top-24 invisible'></div>
      {blogList && (<div
        className='blog-grid grid text-black bg-none mt-8 md:mt-16 container max-w-[2000px] m-auto 
        grid-cols-1 px-5 gap-8
        md:grid-cols-2 md:px-10 md:gap-10
        lg:grid-cols-3 lg:gap-8
        xl:grid-cols-3 xl:gap-12
        2xl:gap-16'
      >
        {blogList?.map((blog: { _id: string; title: string; content: string; date: string }, index: number) => {
          return (
            <Link key={blog._id} href={`/${lang}/blog/article/${blog._id}`} className='relative cursor-pointer' prefetch={true}>
              <BlogItemBlock blog={blog} index={index} />
            </Link>
          )
        })}
      </div>)}

      {!blogList && (
        <div className="flex flex-col items-center justify-center text-white mt-20">
          <div className="text-center p-8 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20
            hover:bg-white/[0.12] transition-all duration-500">
            <h1 className="text-3xl font-semibold mb-4 drop-shadow-lg">😕 {lang == 'zh' ? '没有找到博客' : ' No Blog Found'}</h1>
            <p className="text-white/80 mb-6 drop-shadow-md">{lang == 'zh' ? '您访问的页面没有博客内容，请返回首页。' : ' The page you visited has no blog content. Please return to the homepage.'} </p>
            <Link href='/blog/1'
              className="inline-block mt-4 px-8 py-3 text-lg font-medium bg-white/20 hover:bg-white/30 text-white rounded-2xl 
              transition-all duration-300 backdrop-blur-md border border-white/30 shadow-lg hover:shadow-xl
              hover:scale-105 transform"
            >
              {lang == 'zh' ? '返回博客列表第一页' : 'Return to first page of blog list'}
            </Link>
          </div>
        </div>
      )}

      <BlogPagination blog_page={Number(blog_page)} totalPages={totalPages} baseURL={`/${lang}/blog`} />

        <div className='mt-10 md:mt-24'>
          <Foot lang={lang} />
        </div>
      </div>
    </>
  );
}
