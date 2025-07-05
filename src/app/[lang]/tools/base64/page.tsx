"use client"
import { use } from 'react'
import { motion } from "motion/react"
import Foot from '@/components/Common/Foot';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Base64ToolPage({ params }: { params: Promise<{ lang: 'zh' | 'en' }> }) {
  const { lang }: { lang: 'zh' | 'en' } = use(params);
  
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');
  const [history, setHistory] = useState<Array<{
    id: string;
    input: string;
    output: string;
    mode: 'encode' | 'decode';
    timestamp: number;
  }>>([]);

  const titleTexts = {
    zh: "Base64 编解码工具",
    en: "Base64 Encode/Decode Tool"
  };

  const subtitleTexts = {
    zh: "快速进行Base64编码和解码转换",
    en: "Quick Base64 encoding and decoding conversion"
  };

  const placeholderTexts = {
    encode: {
      zh: "请输入要编码的文本...",
      en: "Enter text to encode..."
    },
    decode: {
      zh: "请输入要解码的Base64字符串...",
      en: "Enter Base64 string to decode..."
    }
  };

  useEffect(() => {
    // Load history from localStorage on mount
    const savedHistory = localStorage.getItem('base64-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch {
        // Ignore invalid history data
      }
    }
  }, []);

  const handleConvert = () => {
    if (!inputText.trim()) {
      setOutputText('');
      setError('');
      return;
    }

    try {
      let result = '';
      if (mode === 'encode') {
        result = btoa(unescape(encodeURIComponent(inputText)));
        setOutputText(result);
        setError('');
      } else {
        result = decodeURIComponent(escape(atob(inputText)));
        setOutputText(result);
        setError('');
      }

      // Add to history if conversion is successful and input is substantial
      if (result && inputText.trim().length > 2) {
        const newHistoryItem = {
          id: Date.now().toString(),
          input: inputText.trim(),
          output: result,
          mode,
          timestamp: Date.now()
        };

        setHistory(prev => {
          const filtered = prev.filter(item => 
            !(item.input === newHistoryItem.input && item.mode === newHistoryItem.mode)
          );
          const newHistory = [newHistoryItem, ...filtered]; // Keep unlimited history
          localStorage.setItem('base64-history', JSON.stringify(newHistory));
          return newHistory;
        });
      }
    } catch {
      setError(lang === 'zh' ? '解码失败：输入的不是有效的Base64字符串' : 'Decode failed: Invalid Base64 string');
      setOutputText('');
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // 这里可以添加一个成功提示
    } catch {
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setError('');
  };

  const handleSwap = () => {
    if (outputText && !error) {
      setInputText(outputText);
      setMode(mode === 'encode' ? 'decode' : 'encode');
    }
  };

  const handleHistoryItemClick = (item: typeof history[0]) => {
    setInputText(item.input);
    setMode(item.mode);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('base64-history');
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return lang === 'zh' ? '刚刚' : 'Just now';
    } else if (diffInMinutes < 60) {
      return lang === 'zh' ? `${diffInMinutes}分钟前` : `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return lang === 'zh' ? `${hours}小时前` : `${hours}h ago`;
    } else {
      return date.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US');
    }
  };

  return (
    <>
      <div className='container max-w-[2000px] m-auto'>
        <div className='overflow-hidden font-extrabold px-5 md:px-10 lg:px-16'>
          {/* 返回工具集合的面包屑 */}
          <motion.div 
            className="mt-20 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link 
              href={`/${lang}/tools`}
              className="text-gray-400 hover:text-[#a1c4fd] transition-colors duration-200 flex items-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
              {lang === 'zh' ? '返回工具集合' : 'Back to Tools'}
            </Link>
          </motion.div>

          <motion.h1 
            className={`font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#a1c4fd] to-[#c2e9fb] leading-tight text-center
              text-2xl mb-4
              md:text-4xl md:mb-6
              lg:text-5xl lg:mb-8
              `}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {titleTexts[lang]}
          </motion.h1>
          
          <motion.p 
            className="text-gray-300/90 text-base md:text-lg lg:text-xl font-medium leading-relaxed tracking-wide text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            {subtitleTexts[lang]}
          </motion.p>
        </div>
      </div>

      <div className='container max-w-[2000px] m-auto px-5 md:px-10 lg:px-16 py-6 md:py-8 lg:py-12'>
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* 模式切换 */}
          <div className="mb-6">
            <div className="flex bg-gray-800/50 rounded-lg p-1 w-fit">
              <button
                onClick={() => {
                  setMode('encode');
                  setOutputText('');
                  setError('');
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  mode === 'encode' 
                    ? 'bg-[#a1c4fd] text-gray-900' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {lang === 'zh' ? '编码' : 'Encode'}
              </button>
              <button
                onClick={() => {
                  setMode('decode');
                  setOutputText('');
                  setError('');
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  mode === 'decode' 
                    ? 'bg-[#a1c4fd] text-gray-900' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {lang === 'zh' ? '解码' : 'Decode'}
              </button>
            </div>
          </div>

          {/* 输入区域 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-white font-medium">
                {mode === 'encode' 
                  ? (lang === 'zh' ? '输入文本' : 'Input Text')
                  : (lang === 'zh' ? '输入Base64' : 'Input Base64')
                }
              </label>
              <div className="flex gap-2">
                <button
                  onClick={handleClear}
                  className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                >
                  {lang === 'zh' ? '清空' : 'Clear'}
                </button>
              </div>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={placeholderTexts[mode][lang]}
              className="w-full h-32 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#a1c4fd] resize-none"
            />
          </div>

          {/* 转换按钮 */}
          <div className="flex justify-center mb-6">
            <div className="flex gap-4">
              <button
                onClick={handleConvert}
                className="px-6 py-3 bg-gradient-to-r from-[#a1c4fd] to-[#c2e9fb] text-gray-900 font-medium rounded-lg hover:from-[#8fb3fc] hover:to-[#b1e1fa] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {mode === 'encode' 
                  ? (lang === 'zh' ? '开始编码' : 'Start Encode')
                  : (lang === 'zh' ? '开始解码' : 'Start Decode')
                }
              </button>
              <button
                onClick={handleSwap}
                disabled={!outputText || !!error}
                className="p-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 rounded-lg transition-colors duration-200"
                title={lang === 'zh' ? '交换输入输出' : 'Swap input/output'}
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* 输出区域 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-white font-medium">
                {mode === 'encode' 
                  ? (lang === 'zh' ? '输出Base64' : 'Output Base64')
                  : (lang === 'zh' ? '输出文本' : 'Output Text')
                }
              </label>
              {outputText && !error && (
                <button
                  onClick={() => handleCopy(outputText)}
                  className="text-[#a1c4fd] hover:text-[#c2e9fb] text-sm transition-colors duration-200 flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                  </svg>
                  {lang === 'zh' ? '复制' : 'Copy'}
                </button>
              )}
            </div>
            <div className="relative">
              <textarea
                value={error || outputText}
                readOnly
                placeholder={lang === 'zh' ? '转换结果将显示在这里...' : 'Conversion result will appear here...'}
                className={`w-full h-32 bg-gray-800/50 border rounded-lg px-4 py-3 placeholder-gray-400 resize-none ${
                  error 
                    ? 'border-red-500 text-red-400' 
                    : 'border-gray-700 text-white'
                }`}
              />
            </div>
          </div>

          {/* 历史记录 */}
          {history.length > 0 && (
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#a1c4fd]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z"/>
                  </svg>
                  {lang === 'zh' ? '转换历史' : 'Conversion History'}
                </h3>
                <button
                  onClick={clearHistory}
                  className="text-gray-400 hover:text-red-400 text-xs transition-colors duration-200"
                >
                  {lang === 'zh' ? '清空历史' : 'Clear History'}
                </button>
              </div>
              <div className="space-y-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleHistoryItemClick(item)}
                    className="bg-gray-800/30 border border-gray-700 rounded-lg p-3 cursor-pointer hover:border-[#a1c4fd]/50 transition-all duration-200 hover:bg-gray-800/50"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        item.mode === 'encode' 
                          ? 'bg-blue-500/20 text-blue-300' 
                          : 'bg-green-500/20 text-green-300'
                      }`}>
                        {item.mode === 'encode' 
                          ? (lang === 'zh' ? '编码' : 'Encode')
                          : (lang === 'zh' ? '解码' : 'Decode')
                        }
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatTime(item.timestamp)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-300">
                      <div className="mb-1">
                        <span className="text-xs text-gray-400 uppercase tracking-wide">
                          {lang === 'zh' ? '输入' : 'Input'}:
                        </span>
                        <div className="text-gray-300 truncate">
                          {item.input.length > 50 ? `${item.input.substring(0, 50)}...` : item.input}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400 uppercase tracking-wide">
                          {lang === 'zh' ? '输出' : 'Output'}:
                        </span>
                        <div className="text-gray-300 truncate">
                          {item.output.length > 50 ? `${item.output.substring(0, 50)}...` : item.output}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 使用说明 */}
          <motion.div 
            className="bg-gray-800/30 rounded-lg p-4 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="text-white font-medium mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#a1c4fd]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              {lang === 'zh' ? '使用说明' : 'Usage Instructions'}
            </h3>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• {lang === 'zh' ? 'Base64是一种基于64个可打印字符来表示二进制数据的表示方法' : 'Base64 is a method to represent binary data using 64 printable characters'}</li>
              <li>• {lang === 'zh' ? '支持中文及其他Unicode字符的编码解码' : 'Supports encoding/decoding of Chinese and other Unicode characters'}</li>
              <li>• {lang === 'zh' ? '所有处理均在浏览器本地完成，不会上传到服务器' : 'All processing is done locally in your browser, no data is uploaded to servers'}</li>
              <li>• {lang === 'zh' ? '点击历史记录可快速重复之前的转换操作' : 'Click on history items to quickly repeat previous conversions'}</li>
            </ul>
          </motion.div>
        </motion.div>
      </div>

      <div className='mt-10 md:mt-20'>
        <Foot lang={lang} />
      </div>
    </>
  );
}