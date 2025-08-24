"use client"

import Image from "next/image";

interface WeChatModalProps {
  show: boolean;
  onClose: () => void;
  lang: 'zh' | 'en';
}

export default function WeChatModal({ show, onClose, lang }: WeChatModalProps) {
  if (!show) return null;

  return (
    <div 
      className="fixed inset-0 w-full h-full z-[99999] bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-6 pb-4 text-center border-b border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div></div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {lang === 'zh' ? '关注公众号' : 'Follow WeChat'}
          </h2>
          <p className="text-gray-600 text-sm">
            {lang === 'zh' 
              ? '扫描二维码关注公众号，第一时间获取最新文章' 
              : 'Scan QR code to follow our WeChat account for latest articles'
            }
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* QR Code Sections */}
          <div className="space-y-6">
            {/* 技术公众号 */}
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="mb-3">
                <Image
                  src="/img/qrcode_tech.jpg"
                  alt="技术公众号二维码"
                  width={180}
                  height={180}
                  className="mx-auto rounded-lg shadow-md"
                />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">
                {lang === 'zh' ? '🚀 技术分享' : '🚀 Tech Sharing'}
              </h3>
              <p className="text-sm text-gray-600">
                {lang === 'zh' 
                  ? '前端开发、软件工程、技术见解' 
                  : 'Frontend, Software Engineering, Tech Insights'
                }
              </p>
            </div>

            {/* 生活公众号 */}
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="mb-3">
                <Image
                  src="/img/qrcode_life.jpg"
                  alt="生活公众号二维码"
                  width={180}
                  height={180}
                  className="mx-auto rounded-lg shadow-md"
                />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">
                {lang === 'zh' ? '🌍 生活分享' : '🌍 Life Sharing'}
              </h3>
              <p className="text-sm text-gray-600">
                {lang === 'zh' 
                  ? '芬兰生活、旅行见闻、文化体验' 
                  : 'Life in Finland, Travel, Cultural Experiences'
                }
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500 mb-4">
              {lang === 'zh' 
                ? '选择你感兴趣的内容类型关注对应公众号' 
                : 'Choose the content type you\'re interested in'
              }
            </p>
            <button 
              onClick={onClose}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
            >
              {lang === 'zh' ? '我知道了' : 'Got it'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}