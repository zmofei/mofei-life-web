// 图片域名配置管理
export const ALLOWED_IMAGE_DOMAINS = [
  'www.zhuwenlong.com',
  'cdn.mofei.life',
  'www.mofei.life',
  'mofei.life',
  'static.mofei.life',
  'assets-eu.mofei.life',
  'assets.mofei.life',
  'github.com',
  'avatars.githubusercontent.com',
] as const;

// 检查是否为允许的域名
export function isAllowedImageDomain(src: string): boolean {
  if (!src.startsWith('http')) {
    return true; // 相对路径总是允许的
  }
  
  try {
    const url = new URL(src);
    return ALLOWED_IMAGE_DOMAINS.some(domain => url.hostname === domain);
  } catch {
    return false;
  }
}

// 自动判断是否需要unoptimized
export function shouldUseUnoptimized(src: string, userUnoptimized: boolean = false): boolean {
  // 用户明确指定unoptimized
  if (userUnoptimized) return true;
  
  // 检查域名是否被允许
  return !isAllowedImageDomain(src);
}

// 为外部图片生成fallback处理
export function getImageFallbackProps(src: string) {
  const isExternal = !isAllowedImageDomain(src);
  
  return {
    unoptimized: isExternal,
    // 外部图片降低质量以节省带宽
    quality: isExternal ? 70 : 80,
    // 外部图片总是懒加载
    loading: (isExternal ? 'lazy' : 'lazy') as 'lazy' | 'eager',
  };
}