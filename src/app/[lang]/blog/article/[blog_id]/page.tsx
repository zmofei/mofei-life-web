// "use client"

import { fetchBlogContent, fetchBlogRecommend } from '@/app/actions/blog-server'
import Foot from '@/components/Common/Foot';
import Recommend from './recommends';
import BlogComments from './comments';
import type { Metadata } from 'next'
import PageContent from './page_content';
import BlogBackground from '../../[blog_page]/BlogBackground';

type Props = {
  params: Promise<{ lang: 'zh' | 'en', blog_page: number, blog_id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = (await params).lang
  const blog_id = (await params).blog_id

  const [blog] = await Promise.all([
    fetchBlogContent(blog_id, lang),
  ])

  const title = `${blog.title} | ${lang === 'zh' ? 'Mofei的生活博客' : 'Mofei\'s Life Blog'}`
  const description = blog.introduction || (lang === 'zh' 
    ? `阅读Mofei关于${blog.title}的分享，一个在芬兰工作的软件工程师的生活故事和技术见解。`
    : `Read Mofei's insights on ${blog.title}, sharing life stories and tech experiences from a software engineer in Finland.`)

  return {
    title,
    description,
    keywords: blog.keywords || [],
    authors: [{ name: 'Mofei Zhu', url: 'https://www.mofei.life' }],
    creator: 'Mofei Zhu',
    publisher: 'Mofei Zhu',
    alternates: {
      canonical: `https://www.mofei.life/${lang}/blog/article/${blog_id}`,
      languages: {
        'en': `https://www.mofei.life/en/blog/article/${blog_id}`,
        'zh': `https://www.mofei.life/zh/blog/article/${blog_id}`,
      }
    },
    openGraph: {
      type: 'article',
      locale: lang === 'zh' ? 'zh_CN' : 'en_US',
      url: `https://www.mofei.life/${lang}/blog/article/${blog_id}`,
      title,
      description,
      siteName: lang === 'zh' ? 'Mofei的生活博客' : 'Mofei\'s Life Blog',
      publishedTime: blog.pubtime,
      modifiedTime: blog.pubtime,
      authors: ['Mofei Zhu'],
      tags: blog.keywords || [],
      images: blog.cover ? [
        {
          url: blog.cover,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ] : [
        {
          url: 'https://www.mofei.life/img/mofei-logo_500_500.svg',
          width: 500,
          height: 500,
          alt: 'Mofei Logo',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@zhu_wenlong',
      images: [blog.cover || 'https://www.mofei.life/img/mofei-logo_500_500.svg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}


export default async function Home({ params }: { params: Promise<{ lang: 'zh' | 'en', blog_id: string }> }) {
  const lang = (await params).lang
  const blog_id = (await params).blog_id
  const [blog, blogRecommend] = await Promise.all([
    fetchBlogContent(blog_id, lang),
    fetchBlogRecommend(blog_id, lang)
  ])


  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.mofei.life/${lang}/blog/article/${blog._id}`
    },
    "headline": blog.title,
    "description": blog.introduction,
    "image": blog.cover,
    "author": {
      "@type": "Person",
      "name": "Mofei Zhu",
      "alternateName": "朱文龙",
      "url": "https://www.mofei.life",
      "description": "Mofei Zhu, a software engineer from China, sharing life and work experiences in Finland, exploring tech, family, and cultural adventures.",
      "sameAs": [
        "https://www.instagram.com/zhu_wenlong",
        "https://github.com/zmofei"
      ]
    },
    "publisher": {
      "@type": "Person",
      "name": "Mofei Zhu",
      "alternateName": "朱文龙",
      "url": "https://www.mofei.life",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.mofei.life/img/mofei-logo_500_500.svg"
      }
    },
    "datePublished": blog.pubtime,
    "dateModified": blog.pubtime,
    "keywords": blog.keywords
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": lang === 'zh' ? "首页" : "Home",
        "item": `https://www.mofei.life/${lang === 'zh' ? 'zh' : ''}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": lang === 'zh' ? "博客" : "Blog",
        "item": `https://www.mofei.life/${lang}/blog/1`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": blog.title,
        "item": `https://www.mofei.life/${lang}/blog/article/${blog._id}`
      }
    ]
  };


  return <>
    {/* structured data */}
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
    />
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
    />

    {/* Animated background */}
    <BlogBackground />

    {/* Main html */}
    <div className='min-h-screen relative z-10
      mt-20 px-2 
      md:mt-32 md:px-10
      lg:px-16 xl:px-20 2xl:px-24
    '>
      <PageContent params={{ content: blog, lang, blog_id }} />

      {/* Recommend blogs */}
      <Recommend blogRecommend={blogRecommend} />

      {/* Comments */}
      <BlogComments lang={lang} message_id={blog_id} />
    </div >

    {/* Foot */}
    <div className='mt-10 md:mt-20 relative z-10'>
      <Foot lang={lang} />
    </div>
  </>

}
