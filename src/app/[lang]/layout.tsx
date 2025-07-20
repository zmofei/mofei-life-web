import { use } from "react"
import "../globals.css";
import Nav from '@/components/Common/Nav'
import { LanguageProvider } from "@/components/Context/LanguageContext";
import { RouterProvider } from "@/components/Context/RouterContext";
import { PlaylistProvider } from "@/components/Context/PlaylistContext";
import WebVitalsProvider from '@/components/util/WebVitalsProvider';
import WebVitalsDashboard from '@/components/util/WebVitalsDashboard';
import GoogleAnalytics from '@/components/Analytics/GoogleAnalytics';
import PageTracker from '@/components/Analytics/PageTracker';
import SPATransition from '@/components/util/SPATransition';
import GlobalPlaylist from '@/components/Player/GlobalPlaylist';
import type { Metadata } from 'next'


interface GenerateMetadataParams {
  params: Promise<{
    lang: string;
  }>;
}

export async function generateMetadata(params: GenerateMetadataParams): Promise<Metadata> {
  const { lang } = await params.params
  
  const title = lang === 'zh' ? '你好我是Mofei - 芬兰软件工程师的生活故事' : 'Hi! I am Mofei - A Software Engineer\'s Life in Finland'
  const description = lang === 'zh' 
    ? '嗨，我是Mofei，一个在芬兰工作的软件工程师。在这里分享我从上海到北京再到赫尔辛基的工作经历，以及在芬兰的生活故事和技术探索。'
    : 'Hi, I\'m Mofei, a software engineer living in Finland. Join me in exploring my journey from Shanghai to Beijing to Helsinki, sharing stories about life, work, and tech adventures in Finland.'
  
  return {
    title,
    description,
    keywords: lang === 'zh' 
      ? ['芬兰', '软件工程师', '生活博客', '技术', '旅行', 'Mofei', '朱文龙', '赫尔辛基', 'Mapbox', '百度']
      : ['Finland', 'Software Engineer', 'Life Blog', 'Technology', 'Travel', 'Mofei', 'Helsinki', 'Mapbox', 'Baidu', 'Tech Stories'],
    authors: [{ name: 'Mofei Zhu', url: 'https://www.mofei.life' }],
    creator: 'Mofei Zhu',
    publisher: 'Mofei Zhu',
    alternates: {
      canonical: `https://www.mofei.life/${lang === 'zh' ? 'zh' : ''}`,
      languages: {
        'en': `https://www.mofei.life`,
        'zh': `https://www.mofei.life/zh`,
      }
    },
    openGraph: {
      type: 'website',
      locale: lang === 'zh' ? 'zh_CN' : 'en_US',
      url: `https://www.mofei.life/${lang === 'zh' ? 'zh' : ''}`,
      title,
      description,
      siteName: lang === 'zh' ? 'Mofei的生活博客' : 'Mofei\'s Life Blog',
      images: [
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
      images: ['https://www.mofei.life/img/mofei-logo_500_500.svg'],
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


export default function RootLayout(params: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { children } = params
  const { lang } = use(params.params)

  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet" />

        <link rel="alternate" type="application/rss+xml" title="Mofei's Blog RSS Feed" href="https://www.mofei.life/en/rss" />
        <link rel="alternate" type="application/rss+xml" title="Mofei 的博客订阅" href="https://www.mofei.life/zh/rss" />
        <link rel="alternate" type="application/rss+xml" title="Mofei Blog's Comments RSS Feed" href="https://www.mofei.life/en/rss_comments" />
        <link href="https://api.mapbox.com/mapbox-gl-js/v3.10.0/mapbox-gl.css" rel="stylesheet" />

      </head>
      <body
        className={`antialiased relative`}
      >
        <GoogleAnalytics />
        <WebVitalsProvider>
          <LanguageProvider defaultLang={lang}>
            <PlaylistProvider>
              <RouterProvider>
                <PageTracker />
                <Nav lang={lang} />
                <SPATransition>
                  {children}
                </SPATransition>
                <WebVitalsDashboard />
                <GlobalPlaylist />
              </RouterProvider>
            </PlaylistProvider>
          </LanguageProvider>
        </WebVitalsProvider>
      </body>
    </html>
  );
}
