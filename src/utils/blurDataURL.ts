// 图片模糊占位符数据URL生成器

// 基础模糊占位符 - 中性灰色
export const DEFAULT_BLUR_DATA_URL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';

// 生成基于颜色的模糊占位符
export function generateBlurDataURL(
  width: number = 8,
  height: number = 8,
  color: string = '#f3f4f6' // 默认灰色
): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return DEFAULT_BLUR_DATA_URL;
  
  // 填充背景色
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  
  // 添加一些噪点来模拟真实图片
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    // 添加轻微的随机变化
    const variation = (Math.random() - 0.5) * 20;
    data[i] = Math.max(0, Math.min(255, data[i] + variation));     // R
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + variation)); // G  
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + variation)); // B
    // data[i + 3] is alpha, keep unchanged
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  try {
    return canvas.toDataURL('image/jpeg', 0.1); // 低质量以减小体积
  } catch {
    return DEFAULT_BLUR_DATA_URL;
  }
}

// 预定义的主题色模糊占位符
export const THEME_BLUR_DATA_URLS = {
  // 生活类文章 - 温暖色调
  life: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAkDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAECA//EACEQAAECBAYDAAAAAAAAAAAAAAERAAIhMQMEYXGxEkGBkf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAbEQACAQUAAAAAAAAAAAAAAAAAAQIDERIhkf/aAAwDAQACEQMRAD8Asy2lnJyr0UpWlvDea2A1CjHCnKOtBn//2Q==',
  
  // 技术类文章 - 蓝色调
  tech: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAkDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAMEBf/EACMQAAECBAUFAAAAAAAAAAAAAAERAAIDBCExcQUikaGx0fCB/8QAFQEBAQAAAAAAAAAAAAAAAAAAAP/EABgRAAMBAQAAAAAAAAAAAAAAAAACEQAx/9oADAMBAAIRAxEAPwCzOYtJdSS2lBZSW8uIrWBHCHAGUxaj//Z',
  
  // 默认 - 中性色
  default: DEFAULT_BLUR_DATA_URL,
  
  // 友情链接头像 - 粉色调
  avatar: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAkDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAQFA//EACQQAAECBQIHAAAAAAAAAAAAAAECEQADBBIhMUEFE3GBkaGxwf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8Ao52lGMhOopZ2l7a2h7FagwwwSJCjLP/Z'
} as const;

// 根据内容类型获取合适的模糊占位符
export function getBlurDataURLForContent(type: 'life' | 'tech' | 'avatar' | 'default' = 'default'): string {
  return THEME_BLUR_DATA_URLS[type];
}

// 服务端安全的模糊占位符生成器（不依赖canvas）
export function getServerSafeBlurDataURL(type: 'life' | 'tech' | 'avatar' | 'default' = 'default'): string {
  return THEME_BLUR_DATA_URLS[type];
}

// 智能选择模糊占位符
export function smartBlurDataURL(src?: string, alt?: string): string {
  if (!src && !alt) return THEME_BLUR_DATA_URLS.default;
  
  const content = `${src || ''} ${alt || ''}`.toLowerCase();
  
  // 根据内容智能选择
  if (content.includes('avatar') || content.includes('头像') || content.includes('profile')) {
    return THEME_BLUR_DATA_URLS.avatar;
  }
  
  if (content.includes('tech') || content.includes('技术') || content.includes('code')) {
    return THEME_BLUR_DATA_URLS.tech;
  }
  
  if (content.includes('life') || content.includes('生活') || content.includes('family')) {
    return THEME_BLUR_DATA_URLS.life;
  }
  
  return THEME_BLUR_DATA_URLS.default;
}