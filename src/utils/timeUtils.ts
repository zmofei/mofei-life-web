import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.extend(utc);

/**
 * Time utilities for handling UTC timestamps from the API
 * Following the recommendations in TIME_HANDLING.md
 */
export const timeUtils = {
  /**
   * Display relative time (e.g., "2 hours ago", "2小时前")
   * Recommended for most use cases to avoid timezone confusion
   */
  fromNow: (utcTime: string | null | undefined, lang: 'zh' | 'en' = 'en'): string => {
    if (!utcTime) return lang === 'zh' ? '未知时间' : 'Unknown time';
    
    // Set locale based on language
    dayjs.locale(lang === 'zh' ? 'zh-cn' : 'en');
    
    try {
      return dayjs.utc(utcTime).local().fromNow();
    } catch (error) {
      console.error('Error parsing time:', error);
      return lang === 'zh' ? '时间解析错误' : 'Time parse error';
    }
  },

  /**
   * Format time in local timezone
   * @param utcTime UTC timestamp string
   * @param format Format string (default: 'YYYY-MM-DD HH:mm')
   * @param lang Language for locale
   */
  format: (utcTime: string | null | undefined, format: string = 'YYYY-MM-DD HH:mm', lang: 'zh' | 'en' = 'en'): string => {
    if (!utcTime) return lang === 'zh' ? '未知时间' : 'Unknown time';
    
    dayjs.locale(lang === 'zh' ? 'zh-cn' : 'en');
    
    try {
      return dayjs.utc(utcTime).local().format(format);
    } catch (error) {
      console.error('Error formatting time:', error);
      return lang === 'zh' ? '时间格式化错误' : 'Time format error';
    }
  },

  /**
   * Check if the time is today
   */
  isToday: (utcTime: string | null | undefined): boolean => {
    if (!utcTime) return false;
    
    try {
      return dayjs.utc(utcTime).local().isSame(dayjs(), 'day');
    } catch (error) {
      console.error('Error checking if today:', error);
      return false;
    }
  },

  /**
   * Format time for display with locale-specific formatting
   * Similar to the existing toLocaleDateString usage but with better UTC handling
   */
  toLocaleDateString: (utcTime: string | null | undefined, lang: 'zh' | 'en' = 'en', options?: {
    weekday?: "short" | "long" | "narrow";
    year?: "numeric" | "2-digit";
    month?: "short" | "long" | "narrow" | "numeric" | "2-digit";
    day?: "numeric" | "2-digit";
    hour?: "numeric" | "2-digit";
    minute?: "numeric" | "2-digit";
  }): string => {
    if (!utcTime) return lang === 'zh' ? '未知时间' : 'Unknown time';
    
    try {
      const date = dayjs.utc(utcTime).local().toDate();
      return date.toLocaleDateString(
        lang === 'zh' ? 'zh-CN' : 'en-US',
        options || {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      );
    } catch (error) {
      console.error('Error converting to local date string:', error);
      return lang === 'zh' ? '时间转换错误' : 'Time conversion error';
    }
  },

  /**
   * Format time using specific timezone (useful for comments with timezone info)
   */
  formatWithTimezone: (utcTime: string | null | undefined, timezone: string, lang: 'zh' | 'en' = 'en'): string => {
    if (!utcTime) return lang === 'zh' ? '未知时间' : 'Unknown time';
    
    try {
      const date = new Date(utcTime);
      return date.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting with timezone:', error);
      // Fallback to local time
      return timeUtils.format(utcTime, 'YYYY-MM-DD HH:mm', lang);
    }
  }
};