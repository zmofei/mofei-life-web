// Google Analytics 4 (GA4) configuration and event tracking

export const GA_TRACKING_ID = 'G-N7P75W40JD';

// Check if GA is enabled
export const isProduction = process.env.NODE_ENV === 'production';

// Page view event
export const pageview = (url: string) => {
  if (!isProduction || typeof window === 'undefined') return;
  
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

// Generic event tracking
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category?: string;
  label?: string;
  value?: number;
}) => {
  if (!isProduction || typeof window === 'undefined') return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Key event tracking functions
export const trackEvent = {
  // Page interaction events
  pageView: (page_title: string, page_location: string) => {
    event({
      action: 'page_view',
      category: 'engagement',
      label: `${page_title} - ${page_location}`,
    });
  },

  // Article reading events
  articleView: (article_id: string, article_title: string) => {
    event({
      action: 'view_item',
      category: 'content',
      label: `${article_id}: ${article_title}`,
    });
  },

  // Article reading duration
  articleReadTime: (article_id: string, read_time_seconds: number) => {
    event({
      action: 'article_read_time',
      category: 'engagement',
      label: article_id,
      value: read_time_seconds,
    });
  },

  // Comment related events
  commentSubmit: (article_id: string) => {
    event({
      action: 'comment_submit',
      category: 'engagement',
      label: article_id,
    });
  },

  commentView: (article_id: string) => {
    event({
      action: 'comment_view',
      category: 'engagement',
      label: article_id,
    });
  },

  // Navigation events
  navClick: (nav_item: string, destination: string) => {
    event({
      action: 'nav_click',
      category: 'navigation',
      label: `${nav_item} -> ${destination}`,
    });
  },

  // Language switching
  languageSwitch: (from_lang: string, to_lang: string) => {
    event({
      action: 'language_switch',
      category: 'user_preference',
      label: `${from_lang} -> ${to_lang}`,
    });
  },

  // Search events
  search: (search_term: string, results_count?: number) => {
    event({
      action: 'search',
      category: 'engagement',
      label: search_term,
      value: results_count,
    });
  },

  // External link clicks
  externalLink: (url: string, link_text?: string) => {
    event({
      action: 'click',
      category: 'external_link',
      label: `${link_text || 'unknown'}: ${url}`,
    });
  },

  // Dedicated friend link click tracking
  friendLinkClick: (link_name: string, link_url: string, category: string) => {
    event({
      action: 'friend_link_click',
      category: 'friends_page',
      label: `${category}|${link_name}|${link_url}`,
    });
  },

  // File downloads
  fileDownload: (file_name: string, file_type: string) => {
    event({
      action: 'file_download',
      category: 'engagement',
      label: `${file_type}: ${file_name}`,
    });
  },

  // Social sharing
  socialShare: (platform: string, url: string) => {
    event({
      action: 'share',
      category: 'social',
      label: `${platform}: ${url}`,
    });
  },

  // 404 errors
  pageNotFound: (attempted_url: string) => {
    event({
      action: '404_error',
      category: 'error',
      label: attempted_url,
    });
  },

  // Performance related events
  performanceMetric: (metric_name: string, metric_value: number, page_path: string) => {
    event({
      action: 'performance_metric',
      category: 'performance',
      label: `${metric_name}: ${page_path}`,
      value: Math.round(metric_value),
    });
  },

  // User engagement
  scrollDepth: (depth_percentage: number, page_path: string) => {
    event({
      action: 'scroll',
      category: 'engagement',
      label: `${depth_percentage}%: ${page_path}`,
      value: depth_percentage,
    });
  },

  // Time on page
  timeOnPage: (seconds: number, page_path: string) => {
    event({
      action: 'time_on_page',
      category: 'engagement',
      label: page_path,
      value: seconds,
    });
  },
};

// Web Vitals performance metrics tracking
export const trackWebVitals = (metric: {
  name: string;
  value: number;
  id: string;
  rating: 'good' | 'needs-improvement' | 'poor';
}) => {
  if (!isProduction || typeof window === 'undefined') return;
  
  // Send Web Vitals to GA4
  window.gtag('event', metric.name, {
    event_category: 'web_vitals',
    event_label: metric.id,
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    custom_parameter_1: metric.rating,
  });

  // Also send performance metric event
  trackEvent.performanceMetric(
    metric.name, 
    metric.value, 
    window.location.pathname
  );
};

// User session tracking
export const trackSession = {
  start: () => {
    event({
      action: 'session_start',
      category: 'engagement',
    });
  },

  end: (duration_seconds: number) => {
    event({
      action: 'session_end',
      category: 'engagement',
      value: duration_seconds,
    });
  },
};

// Error tracking
export const trackError = (error_message: string, error_category = 'javascript_error') => {
  event({
    action: 'exception',
    category: error_category,
    label: error_message,
  });
};

// Custom dimensions configuration
export const setCustomDimensions = (dimensions: Record<string, string | number>) => {
  if (!isProduction || typeof window === 'undefined') return;
  
  Object.entries(dimensions).forEach(([key, value]) => {
    window.gtag('config', GA_TRACKING_ID, {
      [key]: value,
    });
  });
};