'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface Tag {
  id: number;
  name: string;
  name_en?: string;
  count: number;
}

interface BlogTagFilterProps {
  lang: 'zh' | 'en';
  tagList: Tag[];
}

export default function BlogTagFilter({ lang, tagList }: BlogTagFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTag = searchParams.get('tag') || 'all';
  const [clickedTag, setClickedTag] = useState<string | null>(null);

  // Create tags array with "All" option and API data, with custom sorting
  const sortedTagList = [...tagList].sort((a, b) => {
    // 日常/生活类标签排在前面
    const isLifeA = a.name?.toLowerCase().includes('生活') || a.name?.toLowerCase().includes('日常') || a.name?.toLowerCase().includes('life');
    const isLifeB = b.name?.toLowerCase().includes('生活') || b.name?.toLowerCase().includes('日常') || b.name?.toLowerCase().includes('life');
    
    if (isLifeA && !isLifeB) return -1;
    if (!isLifeA && isLifeB) return 1;
    
    // 其他按原有顺序
    return 0;
  });

  const tags = [
    { id: 'all', name: { zh: '全部', en: 'All' }, count: '' },
    ...sortedTagList.map(tag => ({
      id: tag.id.toString(),
      name: { zh: tag.name, en: tag.name_en || tag.name },
      count: `(${tag.count})`
    }))
  ];

  const handleTagChange = (tagId: string) => {
    // Set immediate feedback
    setClickedTag(tagId);
    
    const params = new URLSearchParams(searchParams);
    
    if (tagId === 'all') {
      params.delete('tag');
    } else {
      params.set('tag', tagId);
    }
    
    // Reset to page 1 when changing tags
    const basePath = `/${lang}/blog/1`;
    const newUrl = `${basePath}${params.toString() ? '?' + params.toString() : ''}`;
    router.push(newUrl);
    
    // Clear feedback after navigation
    setTimeout(() => {
      setClickedTag(null);
    }, 150);
  };

  return (
    <div className="container max-w-[2000px] m-auto px-5 md:px-10 mb-8">
      <div className="flex flex-wrap gap-3 justify-start">
        {tags.map((tag) => {
          const isActive = currentTag === tag.id;
          const isClicked = clickedTag === tag.id;
          
          return (
            <button
              key={tag.id}
              onClick={() => handleTagChange(tag.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium backdrop-blur-xl border relative overflow-hidden cursor-pointer transition-all duration-150 ${
                isActive
                  ? 'text-white border-white/40 shadow-2xl'
                  : 'text-white/80 border-white/20 hover:text-white hover:border-white/40'
              } ${isClicked ? 'opacity-70' : ''}`}
              style={{
                background: isActive
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 100%)'
                  : isClicked
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 100%)'
                  : 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.01) 100%)',
                backdropFilter: 'blur(20px) saturate(200%)',
                WebkitBackdropFilter: 'blur(20px) saturate(200%)',
                boxShadow: isActive
                  ? '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2), 0 1px 0 rgba(255,255,255,0.1)'
                  : isClicked
                  ? '0 6px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)'
                  : '0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              {tag.name[lang]} {tag.count}
            </button>
          );
        })}
      </div>
    </div>
  );
}