"use client"
import { use } from 'react'
import { motion } from "motion/react"
import Foot from '@/components/Common/Foot';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Comments from '@/components/Comments/Comments';

interface FriendLink {
  name: string;
  url: string;
  description: {
    zh: string;
    en: string;
  };
  avatar?: string;
  category?: string;
}

const friendsData: FriendLink[] = [
  {
    name: "剧中人",
    url: "https://bh-lay.com/",
    description: {
      zh: "我的挚友，自2011年起我们一起成长，既是工作上的好同事，也是生活中的好朋友",
      en: "My dear friend since 2011, we've grown together as colleagues and close friends in life"
    },
    avatar: "/img/avatar-bh-lay.jpg",
    category: "tech"
  },
  {
    name: "Xio's",
    url: "https://n2g.cn/links/",
    description: {
      zh: "狮子座的数字游牧者，用代码和文字探索科技世界，记录灵感与思考",
      en: "A Leo-spirited digital wanderer who crafts code and stories, exploring technology with curiosity and creativity"
    },
    avatar: "/img/avatar-xio-github.jpg",
    category: "tech"
  },
  {
    name: "GitHub",
    url: "https://github.com/zmofei",
    description: {
      zh: "我的代码仓库，技术分享与开源项目",
      en: "My code repository, tech sharing and open source projects"
    },
    avatar: "https://github.com/zmofei.png",
    category: "tech"
  },
  {
    name: "MDN Web Docs",
    url: "https://developer.mozilla.org/",
    description: {
      zh: "Web开发者最好的学习资源",
      en: "The best learning resource for web developers"
    },
    category: "tech"
  },
  {
    name: "Vue.js",
    url: "https://vuejs.org/",
    description: {
      zh: "渐进式 JavaScript 框架",
      en: "The Progressive JavaScript Framework"
    },
    category: "tech"
  },
  {
    name: "React",
    url: "https://react.dev/",
    description: {
      zh: "用于构建用户界面的 JavaScript 库",
      en: "A JavaScript library for building user interfaces"
    },
    category: "tech"
  }
];

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

  const categoryTexts = {
    zh: {
      tech: "技术 & 博客",
      blog: "博客推荐", 
      tool: "实用工具",
      other: "其他"
    },
    en: {
      tech: "Tech & Blogs",
      blog: "Blog Recommendations",
      tool: "Useful Tools", 
      other: "Others"
    }
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const groupedLinks = friendsData.reduce((acc, link) => {
    const category = link.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(link);
    return acc;
  }, {} as Record<string, FriendLink[]>);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Animated background pattern to make glass effects visible */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Main gradient background with animation */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Animated colorful circles with gentle, flowing movement */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-20 left-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"
            animate={{
              x: [0, 80, -40, 0],
              y: [0, 60, 80, 0],
              scale: [1, 1.2, 1.1, 1]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute top-40 right-20 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"
            animate={{
              x: [0, -100, -60, 0],
              y: [0, 120, -40, 0],
              scale: [1, 1.3, 1.15, 1]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3
            }}
          />
          <motion.div 
            className="absolute bottom-20 left-40 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl"
            animate={{
              x: [0, 90, 30, 0],
              y: [0, -60, -100, 0],
              scale: [1, 1.25, 1.05, 1]
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 7
            }}
          />
          <motion.div 
            className="absolute bottom-40 right-40 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl"
            animate={{
              x: [0, -80, 50, 0],
              y: [0, -90, 40, 0],
              scale: [1, 1.4, 1.2, 1]
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 5
            }}
          />
        </div>
        
        {/* Subtle animated pattern overlay */}
        <motion.div 
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
          animate={{
            backgroundPosition: ['0px 0px', '160px 160px', '0px 0px']
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
      
      <div className='container max-w-[2000px] m-auto relative z-10'>
        <div className='overflow-hidden font-extrabold px-5 md:px-10 lg:px-16'>
          <motion.h1 
            className={`font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#a1c4fd] to-[#c2e9fb] leading-tight 
              text-3xl mt-20 mb-4
              md:text-5xl md:mt-24 md:mb-6
              lg:text-6xl lg:mt-28 lg:mb-8
              xl:text-7xl xl:mt-32 xl:mb-10
              `}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {titleTexts[lang]}
          </motion.h1>
          
          <motion.p 
            className="text-gray-300/90 text-lg md:text-xl lg:text-2xl font-medium leading-relaxed tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            {subtitleTexts[lang]}
          </motion.p>
          
          <motion.p 
            className="text-gray-400/80 text-sm md:text-base leading-relaxed mt-4 md:mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            {lang === 'zh' 
              ? '这次重新设计博客时，发现许多老朋友的链接已经不再更新了，所以重新整理了友情链接。如果你的链接不在这里，欢迎在下方留言告诉我，我会及时添加上去！'
              : 'While redesigning my blog, I noticed many old friends\' links are no longer active, so I\'ve reorganized the friend links. If your link isn\'t here, feel free to leave a message below and I\'ll add it promptly!'
            }
          </motion.p>
        </div>
      </div>

      <div className='container max-w-[2000px] m-auto min-h-screen px-5 md:px-10 lg:px-16 py-6 md:py-8 lg:py-12 relative z-10'>
        {Object.entries(groupedLinks).map(([category, links], categoryIndex) => (
          <motion.div 
            key={category}
            className="mb-12 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 + categoryIndex * 0.1 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-[#e04b45] to-[#ff7b54] rounded-full"></div>
              {categoryTexts[lang][category as keyof typeof categoryTexts[typeof lang]]}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {links.map((link, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + categoryIndex * 0.1 + index * 0.05 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Link 
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full cursor-pointer"
                  >
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6 border border-white/20 hover:border-white/40 h-full flex flex-col relative overflow-hidden
                      group hover:-translate-y-1">
                      
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
                            <Image 
                              src={link.avatar} 
                              alt={link.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#e04b45] to-[#ff7b54] flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
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
                            <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                          </svg>
                        </div>
                      </div>
                      
                      <p className="text-white/80 text-sm leading-relaxed flex-1 relative z-10">
                        {link.description[lang]}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        
        {/* 申请友链评论区域 */}
        <motion.div 
          className="mt-16 md:mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-[#e04b45] to-[#ff7b54] rounded-full"></div>
            {lang === 'zh' ? '申请友链 & 交流讨论' : 'Apply for Links & Discussion'}
          </h2>
          <div className="mb-4 bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-xl relative overflow-hidden">
            {/* Glass effect overlays */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/3 to-transparent pointer-events-none rounded-2xl"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/3 pointer-events-none rounded-2xl"></div>
            
            <div className="text-white/90 text-sm md:text-base leading-relaxed space-y-4 relative z-10">
              <p>
                {lang === 'zh' 
                  ? '向仍在写博客的你，致敬。'
                  : 'To those who still write — I see you.'
                }
              </p>
              <p>
                {lang === 'zh' 
                  ? '在这个快节奏的时代，你依旧愿意用文字慢下来，记录点滴、分享心事。'
                  : 'In a world that rarely pauses, you choose to write, to share, to keep your space alive.'
                }
              </p>
              <p>
                {lang === 'zh' 
                  ? '如果你也还在守着自己的小站，不妨来换个链接吧。'
                  : 'If you\'re still tending to your personal blog, I\'d love to exchange links with you.'
                }
              </p>
              <p>
                {lang === 'zh' 
                  ? '我们彼此的连接，也许能让一些温暖的灵魂，偶然路过彼此的世界，多停留一会儿。'
                  : 'Our connection might help kindred spirits stumble into each other\'s worlds — and maybe stay a little longer.'
                }
              </p>
              <p>
                {lang === 'zh' 
                  ? '欢迎在下方留言你的博客地址，让我找到你，也让更多有趣的灵魂找到你。'
                  : 'Drop your blog link below — I\'d love to find you, and maybe others will too.'
                }
              </p>
            </div>
          </div>
          <Comments singlePageMode={true} lang={lang} message_id="friends_page_comments_001" message_page={1} baseURL={`/${lang}/friends`} />
        </motion.div>
      </div>


      <div className='mt-10 md:mt-20'>
        <Foot lang={lang} />
      </div>
    </>
  );
}