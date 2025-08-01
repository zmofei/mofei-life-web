import fs from 'fs';
import path from 'path';
import { CommentReplyNotificationData, EmailTemplateRenderer } from '@/types/email-template';

/**
 * 渲染邮件模板
 * Render email template with provided data
 */
export const renderEmailTemplate: EmailTemplateRenderer = (template: string, data: CommentReplyNotificationData): string => {
  let renderedTemplate = template;
  
  // 替换所有模板变量
  // Replace all template variables
  Object.entries(data).forEach(([key, value]) => {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    renderedTemplate = renderedTemplate.replace(placeholder, String(value));
  });
  
  return renderedTemplate;
};

/**
 * 读取邮件模板文件
 * Read email template file
 */
export const readEmailTemplate = (templateName: string, lang: 'zh' | 'en' = 'zh'): string => {
  const templateFileName = lang === 'en' ? `${templateName}-en.html` : `${templateName}.html`;
  const templatePath = path.join(process.cwd(), 'src', 'templates', 'email', templateFileName);
  
  try {
    return fs.readFileSync(templatePath, 'utf-8');
  } catch (error) {
    console.error(`Failed to read email template: ${templatePath}`, error);
    throw new Error(`Email template not found: ${templateFileName}`);
  }
};

/**
 * 生成评论回复通知邮件HTML
 * Generate comment reply notification email HTML
 */
export const generateCommentReplyNotificationEmail = (
  data: CommentReplyNotificationData,
  lang: 'zh' | 'en' = 'zh'
): string => {
  const template = readEmailTemplate('comment-reply-notification', lang);
  return renderEmailTemplate(template, data);
};

/**
 * 格式化时间用于邮件显示
 * Format time for email display
 */
export const formatEmailTime = (timestamp: string | Date, lang: 'zh' | 'en' = 'zh'): string => {
  const date = new Date(timestamp);
  const locale = lang === 'zh' ? 'zh-CN' : 'en-US';
  
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Shanghai' // 或者根据用户所在时区调整
  });
};


/**
 * 截断文本内容用于邮件预览
 * Truncate text content for email preview
 */
export const truncateContent = (content: string, maxLength: number = 200): string => {
  // 移除HTML标签
  const textContent = content.replace(/<[^>]*>/g, '');
  
  if (textContent.length <= maxLength) {
    return textContent;
  }
  
  return textContent.substring(0, maxLength).trim() + '...';
};

/**
 * 验证邮箱地址格式
 * Validate email address format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 创建完整的邮件通知数据
 * Create complete email notification data
 */
export const createCommentReplyNotificationData = (params: {
  // 原评论信息
  originalComment: {
    id: string;
    content: string;
    author: {
      name: string;
      email: string;
    };
    createdAt: string | Date;
  };
  
  // 回复信息
  reply: {
    content: string;
    author: {
      name: string;
      email: string;
    };
    createdAt: string | Date;
  };
  
  // 文章信息
  post: {
    title: string;
    url: string;
  };
  
  // 网站信息
  site: {
    url: string;
  };
  
  // 语言
  lang?: 'zh' | 'en';
}): CommentReplyNotificationData => {
  const { originalComment, reply, post, site, lang = 'zh' } = params;
  
  return {
    COMMENTER_NAME: originalComment.author.name,
    ORIGINAL_COMMENT: truncateContent(originalComment.content),
    COMMENT_TIME: formatEmailTime(originalComment.createdAt, lang),
    COMMENT_ID: originalComment.id,
    
    REPLIER_NAME: reply.author.name,
    REPLY_CONTENT: truncateContent(reply.content),
    REPLY_TIME: formatEmailTime(reply.createdAt, lang),
    
    POST_TITLE: post.title,
    POST_URL: `${post.url}#comment-${originalComment.id}`,
    
    SITE_URL: site.url,
  };
};