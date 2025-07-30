import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const VALID_LANGUAGES = ['en', 'zh'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip processing for not-found page to avoid infinite loops
  if (pathname === "/not-found") {
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
    return NextResponse.rewrite(new URL('/not-found', request.url));
  }

  // For any other unknown path that's not a valid language, show 404
  return NextResponse.rewrite(new URL('/not-found', request.url));
}

export const config = {
  matcher: [
    '/',
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$).*)',
  ],
};
