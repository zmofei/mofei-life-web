"use client"

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import WeChatModal from './WeChatModal';

interface WeChatModalManagerProps {
  lang: 'zh' | 'en';
}

export default function WeChatModalManager({ lang }: WeChatModalManagerProps) {
  const [showWeChatModal, setShowWeChatModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openModal = useCallback(() => {
    console.log('WeChat modal opened from modal manager');
    setShowWeChatModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowWeChatModal(false);
  }, []);

  // Listen for global WeChat modal events
  useEffect(() => {
    const handleOpenWeChatModal = () => openModal();
    
    window.addEventListener('openWeChatModal', handleOpenWeChatModal);
    
    return () => {
      window.removeEventListener('openWeChatModal', handleOpenWeChatModal);
    };
  }, [openModal]);

  return (
    <>
      {/* WeChat Modal using Portal to render at document.body level */}
      {mounted && showWeChatModal && createPortal(
        <WeChatModal show={showWeChatModal} onClose={closeModal} lang={lang} />,
        document.body
      )}
    </>
  );
}