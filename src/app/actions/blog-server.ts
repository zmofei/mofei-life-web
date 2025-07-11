const API_URL = "https://api.mofei.life/api";

function stringToNumberHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0; // Convert to 32bit int
    }
    return Math.abs(hash);
}

function processCoverInfo(coverInfo: string | null | { cover?: string; title?: string; title_en?: string; description?: string; description_en?: string }, blogId: string, tags?: Array<{ id: number; name: string; color?: string }>) {
    // Tech-specific gradient backgrounds
    const techGradients = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #30cfd0 0%, #91a7ff 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    ];
    
    // Life/general article images
    const candidateCovers = [
        'https://static.mofei.life/blog-image/62cef4e64f361cff1aa9c174.jpg',
        'https://static.mofei.life/blog-image/5e776e54c850e65b55000002.jpg',
        'https://static.mofei.life/blog-image/926e5b8822bb11edb2f800163e1c4b8d.jpg',
        'https://static.mofei.life/blog-image/625787a29b1beb335dcd35bd.jpg',
        'https://static.mofei.life/blog-image/6246842127c1e98149b5fff6.jpg',
        'https://static.mofei.life/blog-image/5e776e54c850e65b55000001.jpg',
        'https://static.mofei.life/blog-image/51d3db3b8ece70c438000011.jpg',
        'https://static.mofei.life/blog-image/5e776e54c850e65b542927d2.jpg'
    ];
    
    // Check if it's a tech article by checking if any tag has a name indicating tech
    const isTechArticle = tags?.some(tag => 
        tag.name?.toLowerCase().includes('tech') || 
        tag.name?.toLowerCase().includes('技术') ||
        tag.name?.toLowerCase().includes('技')
    );
    
    // Check if it's a daily/life article - be more inclusive
    // const isLifeArticle = tags?.some(tag => 
    //     tag.name?.toLowerCase().includes('life') || 
    //     tag.name?.toLowerCase().includes('生活') ||
    //     tag.name?.toLowerCase().includes('日常') ||
    //     tag.name?.toLowerCase().includes('随笔') ||
    //     tag.name?.toLowerCase().includes('个人')
    // );
    
    // Generate fallback cover based on blog ID
    const hash = stringToNumberHash(blogId);
    
    let fallbackCover;
    if (isTechArticle) {
        // Use gradient background for tech articles
        const gradientIndex = hash % techGradients.length;
        fallbackCover = techGradients[gradientIndex];
    } else {
        // Use photo background for non-tech articles (life, daily, etc.)
        const candidateIndex = hash % candidateCovers.length;
        fallbackCover = candidateCovers[candidateIndex];
    }
    
    let parsedCoverInfo = null;
    if (coverInfo) {
        if (typeof coverInfo === 'object') {
            // If coverInfo is already an object, use it directly
            parsedCoverInfo = coverInfo;
        } else {
            try {
                // Try to fix common JSON format issues
                let jsonString = coverInfo;
                // Replace single quotes with double quotes
                jsonString = jsonString.replace(/\n/g, '');
                jsonString = jsonString.replace(/,(\s)*}$/, '}');
                parsedCoverInfo = JSON.parse(jsonString);
            } catch (error) {
                console.error("Error parsing cover_info JSON:", error);
                parsedCoverInfo = null;
            }
        }
    }
    
    return {
        processedCover: parsedCoverInfo?.cover || fallbackCover,
        fallbackCover,
        isTechArticle,
        processedTitle: {
            en: parsedCoverInfo?.title_en,
            zh: parsedCoverInfo?.title
        },
        processedIntroduction: {
            en: parsedCoverInfo?.description_en?.replace(/\\r/g, ''),
            zh: parsedCoverInfo?.description?.replace(/\\r/g, '')
        }
    };
}

export async function fetchBlogContent(blog_id = "", lang = "en") {
  const URL = `${API_URL}/blog/article/${blog_id}?lang=${lang}`;
  const response = await fetch(URL, {
    next: { revalidate: 10 },
  });
  return response.json();
}

export async function fetchBlogRecommend(blog_id = "", lang = "en") {
  try {
    const URL = `${API_URL}/blog/recommend/${blog_id}?lang=${lang}`;
    const response = await fetch(URL, {
      next: { revalidate: 3600 * 24 },
    });
    return response.json();
  } catch (error) {
    console.error("Failed to fetch recommends:", error);
    return [];
  }
}

export async function fetchBlogList(page = 1, lang = "en", tag?: string) {
  const tagParam = tag ? `&tag=${tag}` : '';
  const URL = `${API_URL}/blog/list/${page}?lang=${lang}${tagParam}`;
  const response = await fetch(URL, {
    next: { revalidate: 3600 }, // Increase cache time to 1 hour
  });
  
  const data = await response.json();
  
  // Preprocess cover info and other data on server
  if (data.list) {
    data.list = data.list.map((blog: {
      _id: string;
      title: string;
      cover_info?: string | { cover?: string; title?: string; title_en?: string; description?: string; description_en?: string };
      introduction?: string;
      tags?: Array<{ id: number; name: string; color?: string }>;
      pubtime: string;
    }) => {
      const processedData = processCoverInfo(blog.cover_info || null, blog._id, blog.tags);
      return {
        ...blog,
        ...processedData
      };
    });
  }
  
  return data;
}

export async function fetchTagList(lang = "en") {
  try {
    const URL = `${API_URL}/tag/list?lang=${lang}`;
    const response = await fetch(URL, {
      next: { revalidate: 3600 * 24 }, // Cache for 24 hours
    });
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return [];
  }
}
