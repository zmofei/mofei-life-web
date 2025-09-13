
import { fetchBlogList, fetchTagList } from '@/app/actions/blog-server';
import DynamicBlogLayout from './DynamicBlogLayout';
import './blog-grid.css'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation';

interface BlogItem {
  _id: string;
  title: string;
  content: string;
  date: string;
  processedCover?: string;
  fallbackCover?: string;
  processedTitle?: { en?: string; zh?: string };
  processedIntroduction?: { en?: string; zh?: string };
  introduction?: string;
  tags?: Array<{ id: number; name: string; color?: string }>;
  pubtime: string;
  isTechArticle?: boolean;
  voice_commentary?: string;
}

type Props = {
  params: Promise<{ lang: 'zh' | 'en', blog_page: number }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}


export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { lang, blog_page } = await params;
  const { tag } = await searchParams;

  const siteName = lang === 'zh' ? 'Mofei的生活博客' : "Mofei's Life Blog";
  const tagText = typeof tag === 'string' && tag.trim().length > 0 ? tag.trim() : '';

  const pageTitle = lang === 'zh'
    ? `${tagText ? `${tagText} - ` : ''}博客 - 第${blog_page}页 | ${siteName}`
    : `${tagText ? `${tagText} - ` : ''}Blog - Page ${blog_page} | ${siteName}`;

  const pageDescription = lang === 'zh'
    ? `浏览第${blog_page}页的博客列表${tagText ? `（标签：${tagText}）` : ''}，涵盖生活、技术与在芬兰的见闻。`
    : `Browse blog list page ${blog_page}${tagText ? ` (tag: ${tagText})` : ''} with life, tech and Finland stories.`;

  const baseUrl = `https://www.mofei.life`;
  const canonical = `${baseUrl}/${lang}/blog/${blog_page}${tagText ? `?tag=${encodeURIComponent(tagText)}` : ''}`;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical,
      languages: {
        'en': `${baseUrl}/en/blog/${blog_page}${tagText ? `?tag=${encodeURIComponent(tagText)}` : ''}`,
        'zh': `${baseUrl}/zh/blog/${blog_page}${tagText ? `?tag=${encodeURIComponent(tagText)}` : ''}`,
        'x-default': `${baseUrl}/en/blog/${blog_page}${tagText ? `?tag=${encodeURIComponent(tagText)}` : ''}`,
      },
    },
    openGraph: {
      type: 'website',
      url: canonical,
      title: pageTitle,
      description: pageDescription,
      siteName,
      locale: lang === 'zh' ? 'zh_CN' : 'en_US',
      images: [
        {
          url: `${baseUrl}/img/mofei-logo_500_500.svg`,
          width: 500,
          height: 500,
          alt: 'Mofei Logo',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [`${baseUrl}/img/mofei-logo_500_500.svg`],
      creator: '@zhu_wenlong',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  };
}


export default async function BlogPage({ params, searchParams }: Props) {
  const { lang, blog_page }: { lang: 'zh' | 'en', blog_page: number } = await params;
  const { tag } = await searchParams;

  const [blogInfo, tagList] = await Promise.all([
    fetchBlogList(blog_page, lang, tag as string),
    fetchTagList(lang),
  ]);

  const blogList = blogInfo.list;
  const totalPages = Math.ceil(blogInfo.count / 12);

  // Check if current page is out of bounds
  const isPageOutOfBounds = (blog_page > totalPages && totalPages > 0) || (totalPages === 0 && blog_page > 1);

  // Return 404 for out-of-range pages to avoid soft-404 indexing
  if (isPageOutOfBounds) {
    notFound();
  }

  // JSON-LD for list page (CollectionPage with ItemList entries)
  const siteName = lang === 'zh' ? 'Mofei的生活博客' : "Mofei's Life Blog";
  const tagText = typeof tag === 'string' && tag.trim().length > 0 ? tag.trim() : '';
  const baseUrl = 'https://www.mofei.life';
  const listTitle = lang === 'zh'
    ? `${tagText ? `${tagText} - ` : ''}博客 - 第${blog_page}页 | ${siteName}`
    : `${tagText ? `${tagText} - ` : ''}Blog - Page ${blog_page} | ${siteName}`;
  const listDesc = lang === 'zh'
    ? `第${blog_page}页博客列表${tagText ? `（标签：${tagText}）` : ''}`
    : `Blog list page ${blog_page}${tagText ? ` (tag: ${tagText})` : ''}`;
  const jsonLdCollection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: listTitle,
    description: listDesc,
    inLanguage: lang === 'zh' ? 'zh-CN' : 'en-US',
    isPartOf: {
      '@type': 'Blog',
      name: siteName,
      url: `${baseUrl}/${lang}`,
    },
    itemListElement: (blogList || []).map((b: BlogItem, idx: number) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `${baseUrl}/${lang}/blog/article/${b._id}`,
      name: b.title,
    })),
  };

  return (
    <>
      {/* Structured Data: CollectionPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCollection) }}
      />
      <DynamicBlogLayout
        blogList={blogList}
        totalPages={totalPages}
        lang={lang}
        tagList={tagList}
        currentPage={Number(blog_page)}
        tag={tag as string}
        isPageOutOfBounds={isPageOutOfBounds}
      />
    </>
  );
}
