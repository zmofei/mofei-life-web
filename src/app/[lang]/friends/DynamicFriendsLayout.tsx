"use client"

import { useState } from 'react';
import FriendsHeader from './FriendsHeader';
import Foot from '@/components/Common/Foot';
import Comments from '@/components/Comments/Comments';
import OptimizedImage from '@/components/util/OptimizedImage';
import Link from 'next/link';
import BlogBackground from '../blog/[blog_page]/BlogBackground';

interface RecentFeedUpdate {
  title?: string;
  pub_date?: string;
  link?: string;
  friend_name?: string;
  friend_url?: string;
  friend_avatar?: string;
}

interface FriendLink {
  id?: string;
  name: string;
  url: string;
  description?: string;
  avatar?: string;
  status?: string;
  category?: string;
}

interface DynamicFriendsLayoutProps {
  friendsData: FriendLink[];
  recentUpdates: RecentFeedUpdate[];
  lang: 'zh' | 'en';
}

export default function DynamicFriendsLayout({
  friendsData,
  recentUpdates,
  lang
}: DynamicFriendsLayoutProps) {
  const [showSiteInfo, setShowSiteInfo] = useState(false);

  return (
    <div className="relative min-h-screen">
      <BlogBackground />

      <div className="relative z-10">
        <FriendsHeader lang={lang} />
      </div>

      <div className="relative z-10 mt-6 md:mt-10">
        <div className='container max-w-[2000px] m-auto px-5 md:px-10 lg:px-16 py-6 md:py-10 lg:py-12'>
            <div className="mb-12 md:mb-16">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* 左侧友链列表 - 占2列 */}
                <div className="lg:col-span-2 space-y-12">
                  {/* 友链列表 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 md:gap-6">
                    {friendsData.map((link: FriendLink, index: number) => (
                      <div key={link.id || index}>
                        <Link
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block h-full cursor-pointer"
                        >
                          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-white/20 hover:border-white/40 h-full flex flex-col relative overflow-hidden group">
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
                                `)})")`,
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
                                  <OptimizedImage
                                    src={link.avatar}
                                    alt={link.name}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover rounded-full"
                                    quality={85}
                                    loading="lazy"
                                    sizes="48px"
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
                    ))}
                  </div>

                  {/* 友链申请部分 */}
                  <div>
                    {/* 友链申请标题 */}
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
                    <div className="rounded-3xl border border-white/15 bg-white/[0.05] p-6 mb-6 space-y-4">
                      <div className="flex items-start gap-3">
                          <div className="w-2.5 h-2.5 bg-white/40 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-white/90 text-sm md:text-base leading-relaxed">
                            {lang === 'zh'
                              ? '时代很快，能慢下来写点东西挺难得的。'
                              : 'In this fast-paced world, it\'s great that we\'re still writing.'
                            }
                          </p>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-2.5 h-2.5 bg-white/40 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-white/90 text-sm md:text-base leading-relaxed">
                            {lang === 'zh'
                              ? '你还在写，我也还在写，那就一起链接起来吧。'
                              : 'If you\'ve got a little corner on the internet, let\'s link up.'
                            }
                          </p>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-2.5 h-2.5 bg-white/40 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-white/90 text-sm md:text-base leading-relaxed">
                            {lang === 'zh'
                              ? '说不定有人路过，刚好喜欢上了你的世界。'
                              : 'Who knows — someone might click through and find something that makes their day.'
                            }
                          </p>
                        </div>

                        <div className="pt-3 border-t border-white/10 mt-4">
                          <p className="text-white/70 text-xs md:text-sm">
                            {lang === 'zh'
                              ? '💌 欢迎在下方留言你的博客地址，让我找到你，也让更多有趣的灵魂找到你。'
                              : '💌 Drop your blog link below — I\'d love to find you, and maybe others will too.'
                            }
                          </p>
                        </div>
                    </div>

                    {/* 本站信息卡片 */}
                    <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 mb-6">
                      <button
                        type="button"
                        onClick={() => setShowSiteInfo(!showSiteInfo)}
                        className="text-center mb-4 w-full text-white/60 text-sm font-medium flex items-center justify-center gap-2"
                        aria-expanded={showSiteInfo}
                        aria-controls="site-info-details"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                        {lang === 'zh' ? '本站信息' : 'Site Info'}
                      </button>

                      {/* 信息列表 */}
                      {showSiteInfo && (
                      <div id="site-info-details" className="space-y-3">
                        <div className="group/item">
                          <div className="text-white/60 text-xs font-medium mb-1">
                            {lang === 'zh' ? '网站名称' : 'Site Name'}
                          </div>
                          <div className="bg-white/[0.04] rounded-md p-3">
                            <code className="text-white/90 text-sm select-all break-all font-mono">
                              {lang === 'zh' ? 'Mofei - 一个在芬兰的超级奶爸程序员' : 'Mofei - A Super Dad Programmer in Finland'}
                            </code>
                          </div>
                        </div>

                        <div className="group/item">
                          <div className="text-white/60 text-xs font-medium mb-1">
                            {lang === 'zh' ? '网址' : 'URL'}
                          </div>
                          <div className="bg-white/[0.04] rounded-md p-3">
                            <code className="text-white/90 text-sm select-all break-all font-mono">
                              https://www.mofei.life
                            </code>
                          </div>
                        </div>

                        <div className="group/item">
                          <div className="text-white/60 text-xs font-medium mb-1">
                            {lang === 'zh' ? '头像' : 'Avatar'}
                          </div>
                          <div className="bg-white/[0.04] rounded-md p-3">
                            <code className="text-white/90 text-sm select-all break-all font-mono">
                              https://www.mofei.life/img/mofei-logo_500_500.png
                            </code>
                          </div>
                        </div>

                        <div className="group/item">
                          <div className="text-white/60 text-xs font-medium mb-1">
                            {lang === 'zh' ? '描述' : 'Description'}
                          </div>
                          <div className="bg-white/[0.04] rounded-md p-3">
                            <code className="text-white/90 text-sm select-all break-all leading-relaxed font-mono">
                              {lang === 'zh'
                                ? '在芬兰的程序员超级奶爸，写写博客，聊聊移居生活和带娃日常。有时也会唠两句技术'
                                : 'A super dad programmer living in Finland, writing blogs about immigration life, parenting, and occasionally sharing tech insights'
                              }
                            </code>
                          </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Comments Section */}
                    <Comments singlePageMode={true} lang={lang} message_id="friends_page_comments_001" message_page={1} baseURL={`/${lang}/friends`} />
                  </div>
                </div>

                {/* 右侧最新更新栏 - 占1列 */}
                <div className="lg:col-span-1">
                  <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/30 shadow-2xl relative overflow-hidden flex flex-col">
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
                      {recentUpdates.length === 0 ? (
                        <div className="text-center py-8">
                          <svg className="w-12 h-12 text-white/30 mx-auto mb-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                          </svg>
                          <p className="text-white/50 text-sm">
                            {lang === 'zh' ? '暂无最新更新' : 'No recent updates'}
                          </p>
                        </div>
                      ) : (
                        recentUpdates.map((update, index) => (
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
                                    <OptimizedImage
                                      src={update.friend_avatar}
                                      alt={update.friend_name || 'Site Avatar'}
                                      width={32}
                                      height={32}
                                      className="w-full h-full object-cover rounded-full"
                                      quality={85}
                                      loading="lazy"
                                      sizes="32px"
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
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className='mt-10 md:mt-20'>
            <Foot lang={lang} />
          </div>
        </div>
      </div>
  );
}
