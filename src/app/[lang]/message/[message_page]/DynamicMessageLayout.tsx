"use client"

import Foot from '@/components/Common/Foot';
import Comments from '@/components/Comments/Comments';
import BlogBackground from '../../blog/[blog_page]/BlogBackground';
import MessageHeader from './MessageHeader';
import { useState } from 'react';

interface DynamicMessageLayoutProps {
  lang: 'zh' | 'en';
  message_page: number;
}

export default function DynamicMessageLayout({ 
  lang, 
  message_page 
}: DynamicMessageLayoutProps) {
  // Ensure fixed header and spacer render identical title to keep heights in sync
  const [titleIndex] = useState(() => Math.floor(Math.random() * 10));
  return (
    <>
      {/* Fixed background */}
      <div className="fixed inset-0 z-0">
        <BlogBackground />
      </div>

      {/* Fixed header section */}
      <div className="fixed top-0 left-0 right-0 z-10">
        <MessageHeader lang={lang} titleIndex={titleIndex} />
      </div>

      {/* Spacer with hidden header content to maintain exact height */}
      <div className="invisible pointer-events-none" aria-hidden="true">
        <MessageHeader lang={lang} titleIndex={titleIndex} />
      </div>

      {/* Scrolling content with glass effect */}
      <div className="relative z-20">
        <div className="bg-black/10 backdrop-blur-lg">
          {/* Gradient separator line */}
          <div className="container max-w-[2000px] m-auto px-5 md:px-10 py-8 md:py-12">
            <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          </div>
          
          <div className='min-h-screen relative
            px-2 pt-0 pb-4
            md:px-10 md:pt-0 md:pb-6
            lg:px-16 xl:px-20 2xl:px-24
          '>
            <Comments lang={lang} message_id="000000000000000000000000" message_page={message_page} />
          </div>
          
          {/* Footer - outside content wrapper for full width */}
          <div className='mt-10 md:mt-20'>
            <Foot lang={lang} />
          </div>
        </div>
      </div>
    </>
  );
}
