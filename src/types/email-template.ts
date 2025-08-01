/**
 * 邮件模板变量类型定义
 * Email template variable type definitions
 */

export interface CommentReplyNotificationData {
  /** 原评论者姓名 / Original commenter name */
  COMMENTER_NAME: string;
  
  /** 原评论内容 / Original comment content */
  ORIGINAL_COMMENT: string;
  
  /** 原评论时间 / Original comment time */
  COMMENT_TIME: string;
  
  /** 原评论ID / Original comment ID */
  COMMENT_ID: string;
  
  /** 回复者姓名 / Replier name */
  REPLIER_NAME: string;
  
  /** 回复内容 / Reply content */
  REPLY_CONTENT: string;
  
  /** 回复时间 / Reply time */
  REPLY_TIME: string;
  
  /** 文章标题 / Post title */
  POST_TITLE: string;
  
  /** 文章URL（包含锚点） / Post URL with anchor */
  POST_URL: string;
  
  /** 网站URL / Site URL */
  SITE_URL: string;
}

/**
 * 邮件模板渲染函数类型
 * Email template rendering function type
 */
export type EmailTemplateRenderer = (
  template: string,
  data: CommentReplyNotificationData
) => string;

/**
 * 邮件发送配置
 * Email sending configuration  
 */
export interface EmailConfig {
  /** 发件人邮箱 / Sender email */
  from: string;
  
  /** 发件人名称 / Sender name */
  fromName: string;
  
  /** 邮件主题前缀 / Email subject prefix */
  subjectPrefix: string;
  
  /** SMTP配置 / SMTP configuration */
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
}

/**
 * 邮件发送参数
 * Email sending parameters
 */
export interface SendEmailParams {
  /** 收件人邮箱 / Recipient email */
  to: string;
  
  /** 邮件主题 / Email subject */
  subject: string;
  
  /** HTML内容 / HTML content */
  html: string;
  
  /** 纯文本内容（可选） / Plain text content (optional) */
  text?: string;
  
  /** 语言 / Language */
  lang?: 'zh' | 'en';
}