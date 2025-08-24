"use client"

import { useState } from 'react';

interface MessageHeaderProps {
  lang: 'zh' | 'en';
}

export default function MessageHeader({ lang }: MessageHeaderProps) {
  const TitleList = [
    { "zh": "别害羞，留言吧！我等不及想看了！", "en": "Don't be shy, leave a message!" },
    { "zh": "写下你的想法，让我开心一整天吧！", "en": "Share your thoughts and brighten my day!" },
    { "zh": "来吧，说点什么，这会让我特别开心！", "en": "Say something, it would truly make my day!" },
    { "zh": "留言吧，你的每一句话都让我充满期待！", "en": "Your words always fill me with excitement!" },
    { "zh": "让我看到你的留言，它会是我一天中最美好的事情！", "en": "Your message will be the best part of my day!" },
    { "zh": "写点什么吧！你的留言会让这里更有意义！", "en": "Write something meaningful to make this space special!" },
    { "zh": "随便留言吧，哪怕只是一个\"Hi\"，我都会很开心！", "en": "Say hi, it will surely brighten my day!" },
    { "zh": "每一条留言都让我充满期待，说点什么吧！", "en": "Every message brings me so much joy!" },
    { "zh": "别让我等太久了，快写点什么吧！", "en": "Don't keep me waiting, write something now!" },
    { "zh": "你的留言会点亮我的一天，别犹豫，写下来吧！", "en": "Your message will light up my day, so write it down!" }
  ];
  
  // Random selection on initial load, then stays fixed
  const [TitleIndex] = useState(() => Math.floor(Math.random() * TitleList.length));

  return (
    <div className='container max-w-[2000px] m-auto px-5 md:px-10 lg:px-16 xl:px-20 2xl:px-24 pt-20 md:pt-32 pb-8'>
      {/* Main Title - Left aligned */}
      <div className='font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#a1c4fd] to-[#c2e9fb] text-2xl md:text-5xl lg:text-6xl !leading-tight mb-4'>
        {TitleList[TitleIndex][lang]}
      </div>

      {/* Welcome Message */}
      <div className="mb-4 md:mb-6">
        <p className="text-gray-300/90 text-lg md:text-xl font-medium leading-relaxed mb-3">
          {lang === 'zh'
            ? '在这个快节奏的时代，暂停一下，分享你的想法。每一条留言都让这里更有温度。'
            : 'In this fast-paced world, take a moment to pause and share your thoughts. Every message makes this place warmer.'
          }
        </p>
        
        <p className="text-gray-400/80 text-sm md:text-base leading-relaxed">
          {lang === 'zh'
            ? '无论是一句问候、一个想法，还是一段故事，都欢迎你留下足迹。让我们在文字中相遇，在交流中成长。'
            : 'Whether it\'s a greeting, a thought, or a story, you\'re welcome to leave your mark. Let\'s meet through words and grow through communication.'
          }
        </p>
      </div>
    </div>
  );
}