"use client"
import { use } from 'react'
import Foot from '@/components/Common/Foot';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Comments from '@/components/Comments/Comments';
import { trackEvent } from '@/lib/gtag';
import { fetchFriendLinks, fetchRecentFeedUpdates } from '@/app/actions/blog-server';

interface FriendLink {
  id?: number;
  name: string;
  url: string;
  description: string;
  avatar?: string | null;
  category?: string;
  mutual?: number;
  click_count?: number;
  sort_order?: number;
  created_at?: string;
}

interface RecentFeedUpdate {
  title?: string;
  pub_date?: string;
  link?: string;
  friend_name?: string;
  friend_url?: string;
  friend_avatar?: string;
}

export default function FriendsPage({ params }: { params: Promise<{ lang: 'zh' | 'en' }> }) {
  const { lang }: { lang: 'zh' | 'en' } = use(params);

  const titleTexts = {
    zh: "友情链接",
    en: "Friends & Links"
  };

  const subtitleTexts = {
    zh: "这里是我的朋友们和一些优秀的网站，每一个都值得一看！",
    en: "Here are my friends and some excellent websites, each one worth checking out!"
  };


  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [friendsData, setFriendsData] = useState<FriendLink[]>([]);
  const [recentUpdates, setRecentUpdates] = useState<RecentFeedUpdate[]>([]);
  const [showSiteInfo, setShowSiteInfo] = useState(false);
  
  // 用于滚动到最新更新区域的引用
  const recentUpdatesRef = useRef<HTMLDivElement>(null);

  // 滚动到最新更新区域的函数
  const scrollToRecentUpdates = () => {
    if (recentUpdatesRef.current) {
      const rect = recentUpdatesRef.current.getBoundingClientRect();
      const currentScrollY = window.scrollY;
      const targetScrollY = currentScrollY + rect.top - 80; // 当前滚动位置 + 元素相对视窗位置 - 偏移量
      
      window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Fetch friend links and recent feed updates in parallel
        const [friendLinks, recentFeedsData] = await Promise.all([
          fetchFriendLinks(lang),
          fetchRecentFeedUpdates()
        ]);

        setFriendsData(friendLinks);

        console.log('Fetched recent feeds:', recentFeedsData);
        // Sort by publication date (newest first) and filter out items without date
        const recentUpdatesArray = (recentFeedsData as RecentFeedUpdate[])
          .filter(item => item.pub_date)
          .sort((a, b) => new Date(b.pub_date!).getTime() - new Date(a.pub_date!).getTime());

        setRecentUpdates(recentUpdatesArray);

        // Track friends page visit
        trackEvent.pageView('Friends Page Load', `/friends`);

        // Track how many links
        const totalLinks = friendLinks.length;
        trackEvent.navClick('Friends Page Stats', `Links: ${totalLinks}`);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
        setMounted(true);
      }
    };

    loadData();
  }, [lang]);

  // Handle friend link click tracking
  const handleFriendLinkClick = (link: FriendLink) => {
    // Use dedicated friend link tracking function
    trackEvent.friendLinkClick(link.name, link.url, link.category || 'other');

    // Also retain general external link tracking for cross-analysis
    trackEvent.externalLink(link.url, `Friends Page - ${link.name}`);
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Animated background pattern to make glass effects visible */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Main gradient background with animation */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30"

        />

        {/* Animated colorful circles with gentle, flowing movement */}
        <div className="absolute inset-0">
          <div
            className="absolute top-20 left-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"

          />
          <div
            className="absolute top-40 right-20 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"

          />
          <div
            className="absolute bottom-20 left-40 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl"

          />
          <div
            className="absolute bottom-40 right-40 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl"

          />
        </div>

        {/* Subtle animated pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 80px,
              rgba(255,255,255,0.1) 80px,
              rgba(255,255,255,0.1) 81px
            )`
          }}

        />
      </div>

      <div className='container max-w-[2000px] m-auto relative z-10'>
        <div className='overflow-hidden font-extrabold px-5 md:px-10 lg:px-16'>
          <h1
            className={`font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#a1c4fd] to-[#c2e9fb] leading-tight 
              text-3xl mt-20 mb-4
              md:text-5xl md:mt-24 md:mb-6
              lg:text-6xl lg:mt-28 lg:mb-8
              xl:text-7xl xl:mt-32 xl:mb-10
              `}
          >
            {titleTexts[lang]}
          </h1>

          <p
            className="text-gray-300/90 text-lg md:text-xl lg:text-2xl font-medium leading-relaxed tracking-wide"

          >
            {subtitleTexts[lang]}
          </p>

          <p
            className="text-gray-400/80 text-sm md:text-base leading-relaxed mt-4 md:mt-6"

          >
            {lang === 'zh'
              ? '这次重新设计博客时，发现许多老朋友的链接已经不再更新了，所以重新整理了友情链接。如果你的链接不在这里，欢迎在下方留言告诉我，我会及时添加上去！'
              : 'While redesigning my blog, I noticed many old friends\' links are no longer active, so I\'ve reorganized the friend links. If your link isn\'t here, feel free to leave a message below and I\'ll add it promptly!'
            }
          </p>
        </div>
      </div>

      <div className='container max-w-[2000px] m-auto min-h-screen px-5 md:px-10 lg:px-16 py-6 md:py-8 lg:py-12 relative z-10'>

        <div className="mb-12 md:mb-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* 左侧友链列表和申请表单 - 占2列 */}
            <div className="lg:col-span-2 space-y-12">
              {/* 友链列表 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 md:gap-6">
                {isLoading ? (
                  // 骨架屏加载效果
                  [...Array(6)].map((_, index) => (
                    <div key={`skeleton-${index}`} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl relative overflow-hidden h-32 loading-shimmer">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-white/10 loading-shimmer flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <div className="h-5 bg-white/10 rounded mb-2 loading-shimmer"></div>
                          <div className="h-4 bg-white/10 rounded w-3/4 loading-shimmer"></div>
                        </div>
                      </div>
                      <div className="h-4 bg-white/10 rounded mb-2 loading-shimmer"></div>
                      <div className="h-4 bg-white/10 rounded w-2/3 loading-shimmer"></div>
                    </div>
                  ))
                ) : (
                  friendsData.map((link, index) => (
                    <div
                      key={link.id || index}
                      className="interactive-element"
                    >
                      <Link
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-full cursor-pointer"
                        onClick={() => handleFriendLinkClick(link)}
                      >
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-white/20 hover:border-white/40 h-full flex flex-col relative overflow-hidden
                        group glass-hover btn-glass focus-ring focus-enhanced">

                          {/* Avatar/Icon cover background */}
                          <div
                            className="absolute inset-0 opacity-10 group-hover:opacity-15 transition-opacity duration-500 rounded-2xl"
                            style={{
                              backgroundImage: link.avatar
                                ? `url(${link.avatar})`
                                : `url("data:image/svg+xml,${encodeURIComponent(`
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
                                  <defs>
                                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                      <stop offset="0%" style="stop-color:#e04b45;stop-opacity:1" />
                                      <stop offset="100%" style="stop-color:#ff7b54;stop-opacity:1" />
                                    </linearGradient>
                                  </defs>
                                  <rect width="100" height="100" fill="url(#grad)"/>
                                  <circle cx="50" cy="50" r="30" fill="white" fill-opacity="0.2"/>
                                  <path d="M50 30L60 50L50 70L40 50Z" fill="white" fill-opacity="0.3"/>
                                </svg>
                              `)}")`,
                              backgroundSize: 'cover',
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'center'
                            }}
                          />

                          {/* Glass effect overlays */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-2xl"></div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5 pointer-events-none rounded-2xl"></div>

                          {/* Shimmer effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                          -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out
                          skew-x-12 pointer-events-none rounded-2xl"></div>

                          <div className="flex items-start gap-4 mb-4 relative z-10">
                            {link.avatar ? (
                              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                                <img
                                  src={link.avatar}
                                  alt={link.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#e04b45] to-[#ff7b54] flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg text-white mb-1 truncate">
                                {link.name}
                              </h3>
                              <p className="text-sm text-white/60 truncate">
                                {link.url.replace(/^https?:\/\//, '')}
                              </p>
                            </div>

                            <div className="flex-shrink-0">
                              <svg className="w-5 h-5 text-white/60 group-hover:text-white/80 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                              </svg>
                            </div>
                          </div>

                          <p className="text-white/80 text-sm leading-relaxed flex-1 relative z-10">
                            {link.description}
                          </p>
                        </div>
                      </Link>
                    </div>
                  ))
                )}
              </div>

              {/* 移动端查看最新更新按钮 */}
              <div className="lg:hidden mt-8 text-center">
                <button
                  onClick={scrollToRecentUpdates}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-white font-medium text-sm hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {lang === 'zh' ? '看看朋友们的最近更新' : 'Check Recent Updates'}
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                </button>
              </div>

              {/* 友链申请部分 */}
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                    {lang === 'zh' ? '友链申请' : 'Link Exchange'}
                  </h2>
                  <div className="max-w-2xl mx-auto text-white/80 text-base md:text-lg leading-relaxed">
                    <p className="italic">
                      {lang === 'zh'
                        ? '"向仍在写博客的你，致敬。"'
                        : '"To those who still write — I see you."'
                      }
                    </p>
                  </div>
                </div>

                {/* 引导文字卡片 */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl relative overflow-hidden group hover:shadow-3xl transition-all duration-500 mb-6">
                  {/* 装饰性渐变背景 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* 内容 */}
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2.5 h-2.5 bg-gradient-to-r from-[#e04b45] to-[#ff7b54] rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-white/90 text-sm md:text-base leading-relaxed">
                        {lang === 'zh'
                          ? '时代很快，能慢下来写点东西挺难得的。'
                          : 'In this fast-paced world, it\'s great that we\'re still writing.'
                        }
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-2.5 h-2.5 bg-gradient-to-r from-[#ff7b54] to-[#ffa726] rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-white/90 text-sm md:text-base leading-relaxed">
                        {lang === 'zh'
                          ? '你还在写，我也还在写，那就一起链接起来吧。'
                          : 'If you\'ve got a little corner on the internet, let\'s link up.'
                        }
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-2.5 h-2.5 bg-gradient-to-r from-[#ffa726] to-[#f39c12] rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-white/90 text-sm md:text-base leading-relaxed">
                        {lang === 'zh'
                          ? '说不定有人路过，刚好喜欢上了你的世界。'
                          : 'Who knows — someone might click through and find something that makes their day.'
                        }
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 mt-4">
                      <p className="text-white/70 text-xs md:text-sm mb-4">
                        {lang === 'zh'
                          ? '💌 欢迎在下方留言你的博客地址，让我找到你，也让更多有趣的灵魂找到你。'
                          : '💌 Drop your blog link below — I\'d love to find you, and maybe others will too.'
                        }
                      </p>
                      
                      {/* 本站信息按钮 */}
                      <button
                        onClick={() => setShowSiteInfo(!showSiteInfo)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#e04b45] to-[#ff7b54] rounded-lg text-white font-medium text-sm hover:from-[#d03d36] hover:to-[#e66645] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                        {lang === 'zh' ? '查看本站信息' : 'View Site Info'}
                        <svg className={`w-4 h-4 transition-transform duration-200 ${showSiteInfo ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7 10l5 5 5-5z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 本站信息卡片（可展开） */}
                {showSiteInfo && (
                  <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/30 shadow-2xl relative overflow-hidden mb-6 animate-in slide-in-from-top-2 duration-300">
                    {/* 装饰性背景 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#e04b45]/10 to-[#ff7b54]/10 rounded-2xl opacity-50"></div>

                    {/* 头部 */}
                    <div className="relative z-10 text-center mb-4">
                      <p className="text-white/60 text-sm font-medium flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                        {lang === 'zh' ? '本站信息' : 'Site Info'}
                      </p>
                    </div>

                    {/* 信息列表 */}
                    <div className="relative z-10 space-y-3">
                      <div className="group/item">
                        <div className="text-white/60 text-xs font-medium mb-1">
                          {lang === 'zh' ? '网站名称' : 'Site Name'}
                        </div>
                        <div className="bg-white/10 rounded-md p-3 group-hover/item:bg-white/20 transition-colors duration-200">
                          <code className="text-white/90 text-sm select-all break-all font-mono">
                            {lang === 'zh' ? 'Mofei - 一个在芬兰的超级奶爸程序员' : 'Mofei - A Super Dad Programmer in Finland'}
                          </code>
                        </div>
                      </div>

                      <div className="group/item">
                        <div className="text-white/60 text-xs font-medium mb-1">
                          {lang === 'zh' ? '网址' : 'URL'}
                        </div>
                        <div className="bg-white/10 rounded-md p-3 group-hover/item:bg-white/20 transition-colors duration-200">
                          <code className="text-white/90 text-sm select-all break-all font-mono">
                            https://www.mofei.life
                          </code>
                        </div>
                      </div>

                      <div className="group/item">
                        <div className="text-white/60 text-xs font-medium mb-1">
                          {lang === 'zh' ? '头像' : 'Avatar'}
                        </div>
                        <div className="bg-white/10 rounded-md p-3 group-hover/item:bg-white/20 transition-colors duration-200">
                          <code className="text-white/90 text-sm select-all break-all font-mono">
                            https://www.mofei.life/img/mofei-logo_500_500.png
                          </code>
                        </div>
                      </div>

                      <div className="group/item">
                        <div className="text-white/60 text-xs font-medium mb-1">
                          {lang === 'zh' ? '描述' : 'Description'}
                        </div>
                        <div className="bg-white/10 rounded-md p-3 group-hover/item:bg-white/20 transition-colors duration-200">
                          <code className="text-white/90 text-sm select-all break-all leading-relaxed font-mono">
                            {lang === 'zh'
                              ? '在芬兰的程序员超级奶爸，写写博客，聊聊移居生活和带娃日常。有时也会唠两句技术'
                              : 'A super dad programmer living in Finland, writing blogs about immigration life, parenting, and occasionally sharing tech insights'
                            }
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 评论区 */}
                <Comments singlePageMode={true} lang={lang} message_id="friends_page_comments_001" message_page={1} baseURL={`/${lang}/friends`} />
              </div>
            </div>

            {/* 右侧最新更新栏 - 占1列 */}
            <div className="lg:col-span-1">
              <div 
                ref={recentUpdatesRef}
                className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/30 shadow-2xl relative overflow-hidden flex flex-col"
              >
                {/* 装饰性背景 */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-3xl opacity-50"></div>

                {/* 标题 */}
                <div className="relative z-10 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                    <h3 className="text-white font-semibold text-lg">
                      {lang === 'zh' ? '朋友们的最新更新' : 'Friends\' Recent Updates'}
                    </h3>
                  </div>
                </div>

                {/* 更新列表 */}
                <div className="relative z-10 space-y-4">
                  {isLoading ? (
                    // 骨架屏
                    [...Array(5)].map((_, index) => (
                      <div key={`recent-skeleton-${index}`} className="p-3 bg-white/5 rounded-xl">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 loading-shimmer flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <div className="h-4 bg-white/10 rounded mb-2 loading-shimmer"></div>
                            <div className="h-3 bg-white/10 rounded w-3/4 mb-2 loading-shimmer"></div>
                            <div className="h-3 bg-white/10 rounded w-1/2 loading-shimmer"></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    recentUpdates.length === 0 ? (
                      <div className="text-center py-8">
                        <svg className="w-12 h-12 text-white/30 mx-auto mb-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                        </svg>
                        <p className="text-white/50 text-sm">
                          {lang === 'zh' ? '暂无最新更新' : 'No recent updates'}
                        </p>
                      </div>
                    ) : (
                      recentUpdates.map((update, index) => {
                        console.log('Rendering update:', update);
                        return (
                          <div key={index} className="group">
                            <Link
                              href={update.link || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200 border border-transparent hover:border-white/20"
                            >
                              <div className="flex items-start gap-3">
                                {update.friend_avatar ? (
                                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                                    <img
                                      src={update.friend_avatar}
                                      alt={update.friend_avatar || 'Site Avatar'}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e04b45] to-[#ff7b54] flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-bold text-xs">
                                      {update.friend_name?.charAt(0)?.toUpperCase() || '?'}
                                    </span>
                                  </div>
                                )}

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-white/90 text-sm font-medium truncate">
                                      {update.friend_name || 'Unknown Site'}
                                    </h4>
                                    <svg className="w-3 h-3 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                    </svg>
                                  </div>
                                  <p
                                    className="text-white/80 text-xs leading-tight mb-2"
                                    style={{
                                      display: '-webkit-box',
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: 'vertical',
                                      overflow: 'hidden'
                                    }}
                                  >
                                    {update.title || 'No Title'}
                                  </p>
                                  <p className="text-white/40 text-xs">
                                    {update.pub_date ? new Date(update.pub_date).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    }) : (lang === 'zh' ? '未知时间' : 'Unknown date')}
                                  </p>
                                </div>

                                <svg className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors duration-200 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                                </svg>
                              </div>
                            </Link>
                          </div>
                        )
                      })
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>


      <div className='mt-10 lg:mt-24'>
        <Foot lang={lang} />
      </div>
    </>
  );
}