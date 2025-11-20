"use client"

import Foot from '@/components/Common/Foot';
import Comments from '@/components/Comments/Comments';
import BlogBackground from '../../blog/[blog_page]/BlogBackground';
import MessageHeader, { MESSAGE_HEADER_VARIANTS } from './MessageHeader';
import { useId, useMemo } from 'react';

interface DynamicMessageLayoutProps {
  lang: 'zh' | 'en';
  message_page: number;
}

export default function DynamicMessageLayout({
  lang,
  message_page,
}: DynamicMessageLayoutProps) {
  // Ensure fixed header and spacer render identical title using deterministic index
  const reactId = useId();
  const titleIndex = useMemo(() => {
    const seed = `${reactId}-${lang}-${message_page}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
      hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
    }
    const count = MESSAGE_HEADER_VARIANTS.length;
    return ((Math.abs(hash) % count) + count) % count;
  }, [reactId, lang, message_page]);
  return (
    <div className="relative min-h-screen">
      <BlogBackground />

      <div className="relative z-10">
        <MessageHeader lang={lang} titleIndex={titleIndex} />
      </div>

      <div className="relative z-10 mt-6 md:mt-10">
        <div className='container max-w-[2000px] m-auto px-5 md:px-10 lg:px-16 py-6 md:py-10 lg:py-12'>
          <Comments lang={lang} message_id="000000000000000000000000" message_page={message_page} />
        </div>

        {/* Footer */}
        <div className='mt-10 md:mt-20'>
          <Foot lang={lang} />
        </div>
      </div>
    </div>
  );
}
