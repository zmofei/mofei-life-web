import { fetchBlogList } from '@/app/actions/blog-server';

type HeadProps = {
  params: Promise<{ lang: 'zh' | 'en'; blog_page: number }>
};

export default async function Head({ params }: HeadProps) {
  const { lang, blog_page } = await params;

  const currentPage = Number(blog_page) || 1;
  const baseUrl = 'https://www.mofei.life';

  // Estimate total pages using global (unfiltered) list size
  const pageSize = 12;
  const listInfo = await fetchBlogList(1, lang, undefined as unknown as string);
  const totalPages = Math.max(1, Math.ceil((listInfo?.count || 0) / pageSize));

  const prevHref = currentPage > 1 ? `${baseUrl}/${lang}/blog/${currentPage - 1}` : null;
  const nextHref = currentPage < totalPages ? `${baseUrl}/${lang}/blog/${currentPage + 1}` : null;

  return (
    <>
      {prevHref ? <link rel="prev" href={prevHref} /> : null}
      {nextHref ? <link rel="next" href={nextHref} /> : null}
    </>
  );
}

