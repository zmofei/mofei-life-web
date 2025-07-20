import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const VALID_LANGUAGES = ['en', 'zh'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip processing for 404 page to avoid infinite loops
  if (pathname === "/en/404-page") {
    return NextResponse.next();
  }

  // Root path redirect
  if (pathname === "/") {
    const rewrittenUrl = request.nextUrl.clone();
    rewrittenUrl.pathname = "/en"; // rewrite 到 /en
    return NextResponse.rewrite(rewrittenUrl);
  }

  // Extract language from pathname
  const pathSegments = pathname.split('/').filter(Boolean);
  const lang = pathSegments[0];

  // If no segments, let it pass through
  if (!lang) {
    return NextResponse.next();
  }

  // Check if first segment is a valid language
  if (VALID_LANGUAGES.includes(lang)) {
    // Valid language, continue normally
    return NextResponse.next();
  }

  // Check if this looks like a language code (2-3 characters) but is invalid
  if (lang.length <= 3 && /^[a-z-]+$/i.test(lang)) {
    // Looks like a language code but invalid, rewrite to 404
    const url = request.nextUrl.clone();
    url.pathname = '/en/404-page';
    return NextResponse.rewrite(url);
  }

  // Doesn't look like a language code, redirect to default language
  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname}`;
  return NextResponse.redirect(url, 307);
}

export const config = {
  matcher: [
    '/',
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$).*)',
  ],
};
