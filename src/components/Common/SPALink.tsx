"use client"

import React, { ReactNode, MouseEvent } from 'react';
import Link from 'next/link';
import { useAppRouter } from '@/components/Context/RouterContext';

interface SPALinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  title?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  external?: boolean; // 是否为外部链接
  style?: React.CSSProperties; // 添加样式属性支持
}

export default function SPALink({ 
  href, 
  children, 
  className, 
  title, 
  onClick,
  external = false,
  style 
}: SPALinkProps) {
  const { navigate } = useAppRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // 如果是外部链接，使用默认行为
    if (external || href.startsWith('http') || href.startsWith('mailto:')) {
      onClick?.(e);
      return;
    }

    // 如果按住 Ctrl/Cmd 键或中键点击，使用默认行为（新标签页）
    if (e.ctrlKey || e.metaKey || e.button === 1) {
      onClick?.(e);
      return;
    }

    // 阻止默认导航
    e.preventDefault();
    
    // 执行自定义点击处理
    onClick?.(e);
    
    // 使用客户端路由导航
    navigate(href);
  };

  return (
    <Link 
      href={href}
      className={className}
      title={title}
      style={style}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}