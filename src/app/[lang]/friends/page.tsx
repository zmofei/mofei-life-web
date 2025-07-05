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
      <div className='container max-w-[2000px] m-auto'>
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

      <div className='container max-w-[2000px] m-auto min-h-screen px-5 md:px-10 lg:px-16 py-6 md:py-8 lg:py-12'>
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
                    className="block h-full"
                  >
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-700 hover:border-[#e04b45]/50 h-full flex flex-col">
                      <div className="flex items-start gap-4 mb-4">
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
                          <p className="text-sm text-gray-400 truncate">
                            {link.url.replace(/^https?:\/\//, '')}
                          </p>
                        </div>
                        
                        <div className="flex-shrink-0">
                          <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                          </svg>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-sm leading-relaxed flex-1">
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
          <div className="mb-4">
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              {lang === 'zh' 
                ? '欢迎在下方留言申请友情链接，或者分享你喜欢的网站推荐！请提供网站名称、URL和简短描述。'
                : 'Feel free to apply for link exchange below, or share your favorite website recommendations! Please provide site name, URL and brief description.'
              }
            </p>
          </div>
          <Comments lang={lang} message_id="friends_page_comments_001" message_page={1} />
        </motion.div>
      </div>


      <div className='mt-10 md:mt-20'>
        <Foot lang={lang} />
      </div>
    </>
  );
}