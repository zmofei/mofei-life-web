import { use } from 'react'
import DynamicMessageLayout from './DynamicMessageLayout';

export default function Home({ params }: { params: Promise<{ lang: 'zh' | 'en'; message_page: number }> }) {
  const { lang, message_page }: { lang: 'zh' | 'en', message_page: number } = use(params);

  return (
    <DynamicMessageLayout
      lang={lang}
      message_page={message_page}
    />
  );
}
