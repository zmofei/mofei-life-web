"use client"
import Script from 'next/script';
import { GA_TRACKING_ID, isProduction } from '@/lib/gtag';

export default function GoogleAnalytics() {
  // Only load GA in production environment
  if (!isProduction) {
    return null;
  }

  return (
    <>
      {/* Google Analytics 4 */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
              // Enable enhanced ecommerce
              send_page_view: true,
              // Enable more detailed user engagement tracking
              engagement_time_msec: 1000,
              // Custom parameters
              custom_map: {
                'custom_parameter_1': 'performance_rating'
              },
              // Privacy settings
              anonymize_ip: true,
              allow_google_signals: true,
              allow_ad_personalization_signals: false
            });
            
            // Error tracking
            window.addEventListener('error', function(e) {
              gtag('event', 'exception', {
                description: e.error ? e.error.toString() : 'Unknown error',
                fatal: false,
                event_category: 'javascript_error'
              });
            });
            
            // Promise error tracking
            window.addEventListener('unhandledrejection', function(e) {
              gtag('event', 'exception', {
                description: 'Unhandled promise rejection: ' + e.reason,
                fatal: false,
                event_category: 'promise_error'
              });
            });
            
            // Page visibility change tracking
            let startTime = Date.now();
            let isVisible = !document.hidden;
            
            document.addEventListener('visibilitychange', function() {
              if (document.hidden && isVisible) {
                // Page hidden, record time spent
                const timeSpent = Math.round((Date.now() - startTime) / 1000);
                gtag('event', 'time_on_page', {
                  event_category: 'engagement',
                  value: timeSpent,
                  event_label: window.location.pathname
                });
                isVisible = false;
              } else if (!document.hidden && !isVisible) {
                // Page visible again
                startTime = Date.now();
                isVisible = true;
              }
            });
            
            // Scroll depth tracking
            let maxScroll = 0;
            let scrollTimeout;
            
            window.addEventListener('scroll', function() {
              clearTimeout(scrollTimeout);
              scrollTimeout = setTimeout(function() {
                const scrollPercent = Math.round(
                  (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
                );
                
                // Only send events when scroll depth increases
                if (scrollPercent > maxScroll && scrollPercent > 0) {
                  const prevMax = maxScroll;
                  
                  // Send scroll depth milestone events once per threshold
                  if (scrollPercent >= 25 && prevMax < 25) {
                    gtag('event', 'scroll', {
                      event_category: 'engagement',
                      event_label: '25%',
                      value: 25
                    });
                  } 
                  if (scrollPercent >= 50 && prevMax < 50) {
                    gtag('event', 'scroll', {
                      event_category: 'engagement', 
                      event_label: '50%',
                      value: 50
                    });
                  }
                  if (scrollPercent >= 75 && prevMax < 75) {
                    gtag('event', 'scroll', {
                      event_category: 'engagement',
                      event_label: '75%', 
                      value: 75
                    });
                  }
                  if (scrollPercent >= 90 && prevMax < 90) {
                    gtag('event', 'scroll', {
                      event_category: 'engagement',
                      event_label: '90%',
                      value: 90
                    });
                  }
                  maxScroll = scrollPercent;
                }
              }, 250);
            }, { passive: true });
          `,
        }}
      />
    </>
  );
}
