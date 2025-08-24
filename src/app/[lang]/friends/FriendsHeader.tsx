interface FriendsHeaderProps {
  lang: 'zh' | 'en';
}

export default function FriendsHeader({ lang }: FriendsHeaderProps) {
  const titleTexts = {
    zh: "友情链接",
    en: "Friends & Links"
  };

  const subtitleTexts = {
    zh: "这里是我的朋友们和一些优秀的网站，每一个都值得一看！",
    en: "Here are my friends and some excellent websites, each one worth checking out!"
  };

  return (
    <div className='container max-w-[2000px] m-auto px-5 md:px-10 lg:px-16 xl:px-20 2xl:px-24 pt-20 md:pt-32 pb-8'>
      {/* Main Title - Left aligned */}
      <div className='font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#a1c4fd] to-[#c2e9fb] text-2xl md:text-5xl lg:text-6xl !leading-tight mb-4'>
        {titleTexts[lang]}
      </div>

      {/* Welcome Message */}
      <div className="mb-4 md:mb-6">
        <p className="text-gray-300/90 text-lg md:text-xl font-medium leading-relaxed mb-3">
          {subtitleTexts[lang]}
        </p>
        
        <p className="text-gray-400/80 text-sm md:text-base leading-relaxed">
          {lang === 'zh'
            ? '这次重新设计博客时，发现许多老朋友的链接已经不再更新了，所以重新整理了友情链接。如果你的链接不在这里，欢迎在下方留言告诉我，我会及时添加上去！'
            : 'While redesigning my blog, I noticed many old friends\' links are no longer active, so I\'ve reorganized the friend links. If your link isn\'t here, feel free to leave a message below and I\'ll add it promptly!'
          }
        </p>
      </div>
    </div>
  );
}