"use client"


import { useLanguage } from "@/components/Context/LanguageContext"

import { replaceCDNDomain } from "@/components/util/util";

function stringToNumberHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0; // Convert to 32bit int
    }
    return Math.abs(hash);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function BlogItemBlock({ blog }: { blog: any, index: number }) {
    const lang = useLanguage().lang


    let coverInfo
    if (blog.cover_info) {
        try {
            // Try to fix common JSON format issues
            let jsonString = blog.cover_info
            // Replace single quotes with double quotes
            jsonString = jsonString.replace(/\n/g, '')
            jsonString = jsonString.replace(/,(\s)*}$/, '}')
            // Fix unquoted property names
            // jsonString = jsonString.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
            coverInfo = JSON.parse(jsonString)
        } catch (error) {
            console.error("Error parsing cover_info JSON:", error)
            console.error("Original cover_info:", blog.cover_info, typeof blog.cover_info)
            // Set a default value to prevent crashes
            coverInfo = null
        }
    }
    // Hardcode some of the cover
    const candidateCovers = [
        'https://static.mofei.life/blog-image/62cef4e64f361cff1aa9c174.jpg',
        'https://static.mofei.life/blog-image/5e776e54c850e65b55000002.jpg',
        'https://static.mofei.life/blog-image/926e5b8822bb11edb2f800163e1c4b8d.jpg',
        'https://static.mofei.life/blog-image/625787a29b1beb335dcd35bd.jpg',
        'https://static.mofei.life/blog-image/6246842127c1e98149b5fff6.jpg',
        'https://static.mofei.life/blog-image/5e776e54c850e65b55000001.jpg',
        'https://static.mofei.life/blog-image/51d3db3b8ece70c438000011.jpg',
        'https://static.mofei.life/blog-image/5e776e54c850e65b542927d2.jpg'
    ]
    // reflect blog id to candidate cover index
    const blogId = blog._id; // 假设是字符串
    const hash = stringToNumberHash(blogId);
    const candidateIndex = hash % candidateCovers.length;
    const selectedCover = candidateCovers[candidateIndex];

    // 
    const cover = coverInfo?.cover || selectedCover
    const title = (lang === 'en' ? coverInfo?.title_en : coverInfo?.title) || blog.title
    let introduction = (lang ===
        'en' ? coverInfo?.description_en : coverInfo?.description
    ) || blog.introduction
    // Replace \r with ''
    introduction = introduction?.replace(/\\r/g, '')

    // figure out if the blog is a life blog
    const tag = (blog.tags || []).length > 0 ? blog.tags[0] : null



    const time = new Date(blog.pubtime).toLocaleDateString(
        lang == 'zh' ? 'zh-CN' : 'en-US'
        , {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        })

    return (<div className='relative h-full'>
        <div className={`group relative w-full h-full rounded-3xl bg-cover bg-center 
            shadow-xl hover:shadow-2xl transition-all duration-700 ease-out flex flex-col md:min-h-[350px] overflow-hidden`}
            style={{
                backgroundImage: `url(${replaceCDNDomain(cover)})`,
                backgroundSize: `${cover ? 'cover' : 'contain'}`,
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
                backgroundOrigin: "padding-box"
            }}>
            
            {/* Minimal glass effect overlay covering entire card */}
            <div className="absolute inset-0 bg-white/[0.01] z-[1] pointer-events-none rounded-3xl"
                style={{
                    backdropFilter: 'blur(1px) saturate(105%)'
                }}></div>
            
            {/* Border overlay */}
            <div className="absolute inset-0 border border-white/[0.02] rounded-3xl z-[2] pointer-events-none"></div>
            
            {/* Minimal gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent z-[3] pointer-events-none rounded-3xl"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/[0.01] z-[4] pointer-events-none rounded-3xl"></div>
            
            {/* Minimal glass reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-white/[0.01] to-transparent 
                opacity-20 group-hover:opacity-30 transition-opacity duration-700 z-[5] pointer-events-none rounded-3xl"></div>
            
            <div className="absolute top-5 left-5 text-white font-bold text-xs tracking-[0.2em] uppercase z-20 
                bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/40
                shadow-xl group-hover:bg-black/50 group-hover:shadow-2xl transition-all duration-500
                drop-shadow-lg">
                MOFEI
            </div>

            {/* Content area that pushes down the card height */}
            <div className="relative z-20 mt-20 mx-5 flex-1 flex flex-col pb-30 md:pb-40">
                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-5 border border-white/20
                    shadow-2xl group-hover:shadow-3xl group-hover:bg-black/50 group-hover:-translate-y-1 
                    transition-all duration-500 ease-out transform relative overflow-hidden">
                    <h2 className={`${lang === 'en' ? 'text-xl md:text-3xl' : 'text-2xl md:text-4xl'} font-bold leading-tight mb-3
                        group-hover:text-white transition-all duration-500 text-white`}
                        style={{
                            textShadow: '1px 1px 2px rgba(0,0,0,0.6)'
                        }}>
                        {title}
                    </h2>
                    <p className={`${lang === 'en' ? 'text-sm md:text-base' : 'text-base md:text-lg'} leading-relaxed text-white/95 
                        group-hover:text-white transition-all duration-500`}
                        style={{
                            textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.5)'
                        }}>
                        {introduction}
                    </p>
                    
                    {/* Shimmer effect only in content area */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                        -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out
                        skew-x-12 pointer-events-none rounded-2xl"></div>
                </div>
            </div>

            {/* Tags and time area with absolute positioning */}
            <div className="absolute bottom-5 right-5 text-white flex flex-col items-end gap-2 z-20">
                {tag?.name && (
                    <span className="text-white rounded-full px-4 py-2 font-medium text-sm backdrop-blur-md border border-white/40
                        shadow-xl transition-all duration-500 bg-black/40
                        group-hover:bg-black/50 group-hover:shadow-2xl drop-shadow-lg flex items-center gap-1.5"
                        style={{
                            backgroundColor: `${tag?.color || '#f05a54'}70`,
                            backdropFilter: 'blur(8px) saturate(130%)',
                        }}>
                        {tag.name.toLowerCase().includes('life') ? (
                            // Life icon - heart
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                        ) : tag.name.toLowerCase().includes('tech') ? (
                            // Tech icon - code
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            // Default tag icon
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                            </svg>
                        )}
                        {tag.name}
                    </span>
                )}
                <span className="text-white text-sm font-medium bg-black/40 backdrop-blur-md px-4 py-2 rounded-full
                    group-hover:text-white group-hover:bg-black/50 transition-all duration-500 border border-white/40
                    shadow-xl group-hover:shadow-2xl drop-shadow-lg">
                    {time}
                </span>
            </div>

        </div>

    </div>)
}