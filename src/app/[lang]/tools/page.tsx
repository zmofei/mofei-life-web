"use client"
import { use } from 'react'
import { motion } from "motion/react"
import Foot from '@/components/Common/Foot';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Tool {
  name: string;
  url: string;
  description: {
    zh: string;
    en: string;
  };
  icon: string;
  category?: string;
}

const toolsData: Tool[] = [
  {
    name: "Base64",
    url: "/tools/base64",
    description: {
      zh: "Base64编码解码工具，支持文本的编码和解码转换",
      en: "Base64 encode/decode tool for text conversion"
    },
    icon: "🔤",
    category: "text"
  }
];

export default function ToolsPage({ params }: { params: Promise<{ lang: 'zh' | 'en' }> }) {
  const { lang }: { lang: 'zh' | 'en' } = use(params);
  
  const titleTexts = {
    zh: "工具集合",
    en: "Tools Collection"
  };

  const subtitleTexts = {
    zh: "这些都是Mofei在开发工作中经常使用的小工具，现在分享给你，希望能让你的工作更轻松一些 😊",
    en: "These are the handy tools Mofei frequently uses during development. Sharing them with you, hoping to make your work a bit easier 😊"
  };

  const categoryTexts = {
    zh: {
      text: "文本工具",
      dev: "开发工具", 
      design: "设计工具",
      util: "实用工具",
      other: "其他"
    },
    en: {
      text: "Text Tools",
      dev: "Development Tools",
      design: "Design Tools", 
      util: "Utility Tools",
      other: "Others"
    }
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const groupedTools = toolsData.reduce((acc, tool) => {
    const category = tool.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);

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
        </div>
      </div>

      <div className='container max-w-[2000px] m-auto px-5 md:px-10 lg:px-16 py-6 md:py-8 lg:py-12'>
        {Object.entries(groupedTools).map(([category, tools], categoryIndex) => (
          <motion.div 
            key={category}
            className="mb-12 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 + categoryIndex * 0.1 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-[#a1c4fd] to-[#c2e9fb] rounded-full"></div>
              {categoryTexts[lang][category as keyof typeof categoryTexts[typeof lang]]}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {tools.map((tool, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + categoryIndex * 0.1 + index * 0.05 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Link 
                    href={`/${lang}${tool.url}`}
                    className="block h-full"
                  >
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-700 hover:border-[#a1c4fd]/50 h-full flex flex-col">
                      <div className="flex flex-col items-center text-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#a1c4fd] to-[#c2e9fb] flex items-center justify-center flex-shrink-0 text-2xl mb-3">
                          {tool.icon}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg text-white mb-1">
                            {tool.name}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {lang === 'zh' ? '文本工具' : 'Text Tool'}
                          </p>
                        </div>
                        
                        <div className="absolute top-4 right-4">
                          <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                          </svg>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-sm leading-relaxed flex-1 text-center">
                        {tool.description[lang]}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* 开发中提示 */}
        <motion.div 
          className="mt-16 md:mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#a1c4fd] to-[#c2e9fb] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">
                  {lang === 'zh' ? '持续更新中' : 'More Tools Coming'}
                </h3>
                <p className="text-gray-300 mb-4">
                  {lang === 'zh' 
                    ? '更多实用工具正在开发中，包括JSON格式化、颜色工具、正则表达式测试等。敬请期待！'
                    : 'More useful tools are in development, including JSON formatter, color tools, regex tester, and more. Stay tuned!'
                  }
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className='mt-10 md:mt-20'>
        <Foot lang={lang} />
      </div>
    </>
  );
}