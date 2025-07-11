
import Foot from '@/components/Common/Foot';
import Link from 'next/link';

import { fetchBlogList, fetchTagList } from '@/app/actions/blog-server';

import BlogBannerTitle from './BlogBannerTitle'
import BlogPagination from './BlogPagination'
import BlogBackground from './BlogBackground'
import BlogTagFilter from './BlogTagFilter'
import MasonryLayout from './MasonryLayout'
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


export default async function BlogPage({ params, searchParams }: Props) {

  const { lang, blog_page }: { lang: 'zh' | 'en', blog_page: number } = await (params)
  const { tag } = await searchParams

  const [blogInfo, tagList] = await Promise.all([
    fetchBlogList(blog_page, lang, tag as string),
    fetchTagList(lang)
  ]);
  
  const blogList = blogInfo.list;
  const totalPages = Math.ceil(blogInfo.count / 12);
  
  // Check if current page is out of bounds
  const isPageOutOfBounds = (blog_page > totalPages && totalPages > 0) || (totalPages === 0 && blog_page > 1);




  return (
    <>
      <BlogBackground />
      
      <div className="relative z-10">
        <BlogBannerTitle lang={lang} />
      
      {/* Separator between banner and blog items */}
      <div className="container max-w-[2000px] m-auto px-5 md:px-10 my-8 md:my-12">
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>
      
      {/* Tag Filter */}
      <BlogTagFilter lang={lang} tagList={tagList} />
      
      <div id="blogList" className='relative -top-24 invisible'></div>
      
      {isPageOutOfBounds && (
        <div className="flex flex-col items-center justify-center text-white mt-20 mb-20">
          <div className="relative text-center p-12 max-w-2xl mx-auto bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20">
            <div className="text-6xl mb-6 md:animate-bounce">🌟</div>
            <h1 className="text-4xl font-bold mb-4 text-white drop-shadow-lg">
              {lang == 'zh' ? '哎呀，走得有点远了' : 'Oops, You\'ve Gone Too Far!'}
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed drop-shadow-md">
              {lang == 'zh' 
                ? `第 ${blog_page} 页好像还没有内容呢～总共只有 ${totalPages} 页哦！` 
                : `Page ${blog_page} doesn't exist yet! There are only ${totalPages} pages in total.`
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href={`/${lang}/blog/1${tag ? `?tag=${tag}` : ''}`}
                className="inline-flex items-center px-8 py-4 text-lg font-medium text-white rounded-2xl transition-all duration-300 md:duration-500 md:hover:opacity-90 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 shadow-lg hover:shadow-xl"
              >
                <span className="mr-2">🏠</span>
                {lang == 'zh' ? '回到首页' : 'Go to First Page'}
              </Link>
              
              {totalPages > 1 && (
                <Link 
                  href={`/${lang}/blog/${totalPages}${tag ? `?tag=${tag}` : ''}`}
                  className="inline-flex items-center px-8 py-4 text-lg font-medium text-white rounded-2xl transition-all duration-300 md:duration-500 md:hover:opacity-90 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 shadow-lg hover:shadow-xl"
                >
                  <span className="mr-2">📄</span>
                  {lang == 'zh' ? '最后一页' : 'Last Page'}
                </Link>
              )}
            </div>
            
            <div className="mt-8 text-sm text-white/60 italic">
              {lang == 'zh' 
                ? '💡 小贴士：可以使用下方的分页导航来浏览所有内容' 
                : '💡 Tip: Use the pagination below to navigate through all content'
              }
            </div>
          </div>
        </div>
      )}
      
      {!isPageOutOfBounds && blogList && (
        <MasonryLayout 
          blogList={blogList} 
          lang={lang}
        />
      )}

      {!isPageOutOfBounds && !blogList && (
        <div className="flex flex-col items-center justify-center text-white mt-20">
          <div className="text-center p-8 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20
            hover:bg-white/[0.12] transition-all duration-500">
            <h1 className="text-3xl font-semibold mb-4 drop-shadow-lg">😕 {lang == 'zh' ? '没有找到博客' : ' No Blog Found'}</h1>
            <p className="text-white/80 mb-6 drop-shadow-md">{lang == 'zh' ? '您访问的页面没有博客内容，请返回首页。' : ' The page you visited has no blog content. Please return to the homepage.'} </p>
            <Link href='/blog/1'
              className="inline-block mt-4 px-8 py-3 text-lg font-medium bg-white/20 hover:bg-white/30 text-white rounded-2xl 
              transition-all duration-300 backdrop-blur-md border border-white/30 shadow-lg hover:shadow-xl
              md:hover:opacity-90"
            >
              {lang == 'zh' ? '返回博客列表第一页' : 'Return to first page of blog list'}
            </Link>
          </div>
        </div>
      )}

      {!isPageOutOfBounds && (
        <BlogPagination blog_page={Number(blog_page)} totalPages={totalPages} baseURL={`/${lang}/blog`} />
      )}

        <div className='mt-10 md:mt-24'>
          <Foot lang={lang} />
        </div>
      </div>
    </>
  );
}
