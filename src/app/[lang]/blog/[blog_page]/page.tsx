
import { fetchBlogList, fetchTagList } from '@/app/actions/blog-server';
import DynamicBlogLayout from './DynamicBlogLayout';
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
    <DynamicBlogLayout
      blogList={blogList}
      totalPages={totalPages}
      lang={lang}
      tagList={tagList}
      currentPage={Number(blog_page)}
      tag={tag as string}
      isPageOutOfBounds={isPageOutOfBounds}
    />
  );
}
