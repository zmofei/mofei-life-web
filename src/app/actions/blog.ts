// Use proxy in development, direct API in production
const NEW_API_URL = process.env.NODE_ENV === "development" ? "/api" : "https://api.mofei.life/api";

export async function fetchSiteMap() {
  const URL = `${NEW_API_URL}/blog/sitemap`;
  const res = await fetch(URL);
  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }
  return res.json();
}

export async function fetchMessageList(
  id: string,
  page = 1,
  pageSize = 10,
  lang = 'en'
) {
  const URL = `${NEW_API_URL}/blog/comment/${id}/${page}?pageSize=${pageSize}&lang=${lang}`;
  const res = await fetch(URL);
  if (!res.ok) {
    throw new Error("Failed to fetch comments");
  }
  return res.json();
}

export async function getToken() {
  const URL = `${NEW_API_URL}/user/anonymous/token`;
  const res = await fetch(URL, {
    credentials: "include",
  });
  if (!res.ok) {
    console.error("Failed to fetch token");
  }
}

interface PostMessageData {
  content: string;
  replyId?: string; // Add support for reply functionality
  lang?: 'zh' | 'en'; // Language preference for the comment
  [key: string]: string | number | boolean | null | undefined; // Optional for additional fields
}

export async function postMessage(id: string, data: PostMessageData) {
  const URL = `${NEW_API_URL}/blog/anonymous/comment/add/${id}`;
  const res = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Failed to post message");
  }
  return res.json();
}

export async function likeComment(commentId: string) {
  const URL = `${NEW_API_URL}/blog/comment/like/${commentId}`;
  const res = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to like comment");
  }
  return res.json();
}

export async function recordBlogVisit(blogId: string) {
  const URL = `${NEW_API_URL}/blog/visit/${blogId}`;
  try {
    const res = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!res.ok) {
      console.warn(`Failed to record visit for blog ${blogId}:`, res.status);
    }
    return res.ok;
  } catch (error) {
    console.warn(`Failed to record visit for blog ${blogId}:`, error);
    return false;
  }
}

export async function getBlogVisits(blogId: string) {
  const URL = `${NEW_API_URL}/blog/visits/${blogId}`;
  try {
    const res = await fetch(URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // 不使用缓存，获取最新数据
    });
    if (!res.ok) {
      console.warn(`Failed to get visits for blog ${blogId}:`, res.status);
      return 0;
    }
    const data = await res.json();
    return data.visited || 0;
  } catch (error) {
    console.warn(`Failed to get visits for blog ${blogId}:`, error);
    return 0;
  }
}

export async function fetchVoiceBlogList(page = 1, lang = "en") {
  const URL = `${NEW_API_URL}/blog/voice/list/${page}?lang=${lang}`;
  try {
    const res = await fetch(URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // 获取最新的语音文章列表
    });
    if (!res.ok) {
      console.warn(`Failed to fetch voice blog list page ${page}:`, res.status);
      return { list: [], total: 0, totalPages: 0 };
    }
    const data = await res.json();
    return {
      list: data.list || [],
      total: data.total || 0,
      totalPages: data.totalPages || 0
    };
  } catch (error) {
    console.warn(`Failed to fetch voice blog list:`, error);
    return { list: [], total: 0, totalPages: 0 };
  }
}

