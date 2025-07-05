import RSS from "rss";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ lang: string }> }
) {
  const lang = (await params).lang || "en";

  const URL = `https://api.mofei.life/api/blog/comment_list/1?pageSize=40`;
  const blogsRst = await fetch(URL);
  const blogs = await blogsRst.json();

  const feedOptions = {
    title: lang === "zh" ? "你好我是Mofei" : "Hi! I am Mofei!",
    description:
      "Mofei Zhu, a software engineer from China, sharing life and work experiences in Finland, exploring tech, family, and cultural adventures.",
    feed_url: `https://www.mofei.life/${lang}/rss`,
    site_url: `https://www.mofei.life${lang==="zh" ? "/zh" : ""}`,
    image_url: "https://www.mofei.life/img/mofei-logo_500_500.svg",
    docs: "https://cyber.harvard.edu/rss/rss.html",
    managingEditor: `hi@mofei.life (${lang === "zh" ? "朱文龙" : "Mofei Zhu"})`,
    webMaster: `hi@mofei.life (${lang === "zh" ? "朱文龙" : "Mofei Zhu"})`,
    language: lang,
    lastBuildDate: new Date().toUTCString(),
  };

  const feed = new RSS(feedOptions);

  interface Blog {
    id: string;
    blogid: string;
    content: string;
    name: string;
    translate_en: string;
    time: string;
  }

  blogs.list.forEach((blog: Blog) => {
    console.log(blog);
    feed.item({
      title: `${blog.name}'s comment`,
      description: `${(lang == "en" ? blog.translate_en : blog.content) || blog.content}`,
      url:
        blog.blogid === "000000000000000000000000"
          ? `https://www.mofei.life/${lang}/message`
          : `https://www.mofei.life/${lang}/blog/article/${blog.blogid}`,
      guid: blog.id,
      author: `${blog.name}`,
      date: new Date(blog.time).toUTCString(),
    });
  });

  return new Response(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
