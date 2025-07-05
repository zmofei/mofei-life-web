import type { MetadataRoute } from "next";
import { fetchSiteMap } from "./actions/blog";

export default async function sitemap({}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  const siteUrl = "https://www.mofei.life";
  const blogs = await fetchSiteMap();

  const firstBlogUpdateTime = new Date(blogs[0].pubtime);

  const blogList = blogs.flatMap(
    ({ _id, pubtime }: { _id: string; pubtime: string }) => [
      {
        url: `${siteUrl}/en/blog/article/${_id}`,
        lastModified: new Date(pubtime),
        alternates: {
          languages: {
            en: `${siteUrl}/en/blog/article/${_id}`,
            zh: `${siteUrl}/zh/blog/article/${_id}`,
          },
        },
        changeFrequency: "monthly",
        priority: 0.9,
      },
      {
        url: `${siteUrl}/zh/blog/article/${_id}`,
        lastModified: new Date(pubtime),
        alternates: {
          languages: {
            zh: `${siteUrl}/zh/blog/article/${_id}`,
            en: `${siteUrl}/en/blog/article/${_id}`,
          },
        },
        changeFrequency: "monthly",
        priority: 0.9,
      },
    ]
  );

  const Home = [
    {
      url: `${siteUrl}`,
      // lastModified: new Date(),
      alternates: {
        languages: {
          en: `${siteUrl}`,
          zh: `${siteUrl}/zh`,
        },
      },
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/zh`,
      // lastModified: new Date(),
      alternates: {
        languages: {
          en: `${siteUrl}`,
          zh: `${siteUrl}/zh`,
        },
      },
      changeFrequency: "monthly",
      priority: 1,
    },
  ];

  const BlogHome = [
    {
      url: `${siteUrl}/en/blog/1`,
      lastModified: firstBlogUpdateTime,
      alternates: {
        languages: {
          en: `${siteUrl}/en/blog/1`,
          zh: `${siteUrl}/zh/blog/1`,
        },
      },
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/zh/blog/1`,
      lastModified: firstBlogUpdateTime,
      alternates: {
        languages: {
          en: `${siteUrl}/en/blog/1`,
          zh: `${siteUrl}/zh/blog/1`,
        },
      },
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  const staticPages = [
    {
      url: `${siteUrl}/en/message/1`,
      lastModified: new Date(),
      alternates: {
        languages: {
          en: `${siteUrl}/en/message/1`,
          zh: `${siteUrl}/zh/message/1`,
        },
      },
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/zh/message/1`,
      lastModified: new Date(),
      alternates: {
        languages: {
          en: `${siteUrl}/en/message/1`,
          zh: `${siteUrl}/zh/message/1`,
        },
      },
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/en/lab/bullet_screen`,
      lastModified: new Date(),
      alternates: {
        languages: {
          en: `${siteUrl}/en/lab/bullet_screen`,
          zh: `${siteUrl}/zh/lab/bullet_screen`,
        },
      },
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${siteUrl}/zh/lab/bullet_screen`,
      lastModified: new Date(),
      alternates: {
        languages: {
          en: `${siteUrl}/en/lab/bullet_screen`,
          zh: `${siteUrl}/zh/lab/bullet_screen`,
        },
      },
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  return [...Home, ...BlogHome, ...staticPages, ...blogList];
}
