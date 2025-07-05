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

    return (<div className='relative'>
        <div className={`group relative w-full min-h-[350px] md:min-h-[450px] rounded-2xl overflow-hidden bg-cover bg-center bg-neutral-700 
            shadow-lg hover:shadow-2xl transition-all duration-500 ease-out transform hover:scale-[1.02] hover:-translate-y-1`}
            style={{
                backgroundImage: `url(${replaceCDNDomain(cover)})`,
                backgroundSize: `${cover ? 'cover' : 'contain'}`,
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
                backgroundOrigin: "padding-box",
                backdropFilter: 'blur(10px)'
            }}>
            <div className="absolute top-5 left-5 text-white/70 font-bold text-xs tracking-[0.2em] uppercase z-10 
                bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                MOFEI
            </div>

            <div className="absolute top-20 left-5 right-5 md:right-5 md:max-w-2xl text-white z-10">
                <h2 className={`${lang === 'en' ? 'text-xl md:text-3xl' : 'text-2xl md:text-4xl'} font-bold leading-tight mb-4 
                    drop-shadow-lg group-hover:text-white transition-colors duration-300`}>
                    {title}
                </h2>
                <p className={`${lang === 'en' ? 'text-sm md:text-base' : 'text-base md:text-lg'} leading-relaxed text-white/85 
                    line-clamp-3 group-hover:text-white/95 transition-colors duration-300`}>
                    {introduction}
                </p>
            </div>

            <div className="absolute bottom-5 right-5 text-white flex flex-col items-end gap-2 z-10">
                {tag?.name && (
                    <span className="text-white rounded-full px-4 py-2 font-medium text-sm backdrop-blur-sm border border-white/20
                        shadow-lg transform group-hover:scale-105 transition-all duration-300"
                        style={{
                            backgroundColor: `${tag?.color || '#f05a54'}aa`,
                        }}>
                        {tag.name}
                    </span>
                )}
                <span className="text-white/70 text-sm font-medium bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full
                    group-hover:text-white/90 transition-colors duration-300">
                    {time}
                </span>
            </div>


            <div className={`absolute inset-0 pointer-events-none transition-all duration-500 ease-out
                bg-[linear-gradient(to_bottom,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.4)_50%,rgba(0,0,0,0.2)_80%,rgba(0,0,0,0)_100%)] 
                backdrop-blur-[1px] 
                group-hover:bg-[linear-gradient(to_bottom,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0.2)_50%,rgba(0,0,0,0)_100%)]
                group-hover:backdrop-blur-none
            `}>
            </div>



        </div>

    </div>)
}