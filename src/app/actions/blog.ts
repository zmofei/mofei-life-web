const NEW_API_URL = "https://api.mofei.life/api";

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
