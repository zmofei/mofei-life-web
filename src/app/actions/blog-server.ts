// Server components need absolute URLs even in development
const API_URL = "https://api.mofei.life/api";

// Pre-computed constants (moved outside function for better performance)
const TECH_GRADIENTS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #30cfd0 0%, #91a7ff 100%)",
  "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
] as const;

const CANDIDATE_COVERS = [
  "https://static.mofei.life/blog-image/62cef4e64f361cff1aa9c174.jpg",
  "https://static.mofei.life/blog-image/5e776e54c850e65b55000002.jpg",
  "https://static.mofei.life/blog-image/926e5b8822bb11edb2f800163e1c4b8d.jpg",
  "https://static.mofei.life/blog-image/625787a29b1beb335dcd35bd.jpg",
  "https://static.mofei.life/blog-image/6246842127c1e98149b5fff6.jpg",
  "https://static.mofei.life/blog-image/5e776e54c850e65b55000001.jpg",
  "https://static.mofei.life/blog-image/51d3db3b8ece70c438000011.jpg",
  "https://static.mofei.life/blog-image/5e776e54c850e65b542927d2.jpg",
] as const;

// Pre-compiled regex for better performance
const TECH_KEYWORDS = /tech|技术|技/i;
const CARRIAGE_RETURN_REGEX = /\\r/g;

// Simple hash function with better performance
function stringToNumberHash(str: string): number {
  let hash = 0;
  const len = str.length;
  for (let i = 0; i < len; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

// Type definition for processed cover info
interface ProcessedCoverInfo {
  processedCover: string;
  fallbackCover: string;
  isTechArticle: boolean;
  processedTitle: {
    en?: string;
    zh?: string;
  };
  processedIntroduction: {
    en?: string;
    zh?: string;
  };
}

function processCoverInfo(
  blog: {
    cover?: string;
    title?: string;
    title_en?: string;
    introduction?: string;
    introduction_en?: string;
  },
  blogId: string,
  tags?: Array<{ id: number; name: string; color?: string }>
): ProcessedCoverInfo {

  // Optimize tech article detection with pre-compiled regex
  const isTechArticle = tags?.some(tag => 
    tag.name && TECH_KEYWORDS.test(tag.name)
  ) ?? false;

  // Generate fallback cover based on blog ID (optimized)
  const hash = stringToNumberHash(blogId);
  const fallbackCover = isTechArticle
    ? TECH_GRADIENTS[hash % TECH_GRADIENTS.length]
    : CANDIDATE_COVERS[hash % CANDIDATE_COVERS.length];

  // Optimize string replacements
  const processedIntroduction = {
    en: blog.introduction_en?.replace(CARRIAGE_RETURN_REGEX, ""),
    zh: blog.introduction?.replace(CARRIAGE_RETURN_REGEX, ""),
  };

  return {
    processedCover: blog.cover || fallbackCover,
    fallbackCover,
    isTechArticle,
    processedTitle: {
      en: blog.title_en,
      zh: blog.title,
    },
    processedIntroduction,
  };
}

export async function fetchBlogContent(blog_id = "", lang = "en") {
  const URL = `${API_URL}/blog/article/${blog_id}?lang=${lang}`;
  const response = await fetch(URL, {
    next: { revalidate: 10 },
  });
  return response.json();
}

// Optimized function to fetch blog content with latest visit count
export async function fetchBlogContentWithVisits(blog_id = "", lang = "en") {
  try {
    // Parallel fetch both blog content and latest visit count
    const [blogResponse, visitsResponse] = await Promise.all([
      fetch(`${API_URL}/blog/article/${blog_id}?lang=${lang}`, {
        next: { revalidate: 10 },
      }),
      fetch(`${API_URL}/blog/visits/${blog_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", // Always get fresh visit count
      })
    ]);

    const blog = await blogResponse.json();
    
    // Handle visit count fetch - prioritize fresh visit count over cached blog data
    let latestVisitCount = blog.visited || 0;
    let hasLatestVisitCount = false;
    
    try {
      if (visitsResponse.ok) {
        const visitsData = await visitsResponse.json();
        // Always prefer fresh visit count from visits API
        if (typeof visitsData.visited === 'number') {
          latestVisitCount = visitsData.visited;
          hasLatestVisitCount = true;
          // Keep internal, avoid noisy logs in production
        }
      }
    } catch (visitsError) {
      console.warn('Failed to fetch visits, using blog.visited:', visitsError);
    }

    return {
      ...blog,
      visited: latestVisitCount,
      hasLatestVisitCount
    };
  } catch (error) {
    console.error('Error in fetchBlogContentWithVisits:', error);
    // Fallback to regular blog content fetch
    return fetchBlogContent(blog_id, lang);
  }
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
  const tagParam = tag ? `&tag=${tag}` : "";
  const URL = `${API_URL}/blog/list/${page}?lang=${lang}${tagParam}`;
  const response = await fetch(URL, {
    next: { revalidate: 3600 }, // Increase cache time to 1 hour
  });

  const data = await response.json();

  // Preprocess cover info and other data on server
  if (data.list) {
    data.list = data.list.map(
      (blog: {
        _id: string;
        title: string;
        title_en?: string;
        cover?: string;
        introduction?: string;
        introduction_en?: string;
        tags?: Array<{ id: number; name: string; color?: string }>;
        pubtime: string;
      }) => {
        const processedData = processCoverInfo(
          blog,
          blog._id,
          blog.tags
        );
        return {
          ...blog,
          ...processedData,
        };
      }
    );
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

export async function fetchFriendLinks(
  lang = "en",
  category?: string,
  status?: string
) {
  try {
    let URL = `${API_URL}/friend-links?lang=${lang}`;
    if (category) URL += `&category=${category}`;
    if (status) URL += `&status=${status}`;

    const response = await fetch(URL, {
      next: { revalidate: 3600 * 12 }, // Cache for 12 hours
    });
    const data = await response.json();
    return data?.list || [];
  } catch (error) {
    console.error("Failed to fetch friend links:", error);
    return [];
  }
}

export async function fetchRecentFeedUpdates() {
  try {
    const response = await fetch(`${API_URL}/feed/recent?limit=5`, {
      next: { revalidate: 3600 * 2 }, // Cache for 2 hours
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Failed to fetch recent feed updates:", error);
    return [];
  }
}
