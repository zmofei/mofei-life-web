"use client";
import React from "react";
import CSS from "./article.module.scss";


/**
 * HtmlToReact Component
 * @param {string} htmlString - 要解析的 HTML 字符串
 * @returns {JSX.Element} - 渲染的 React 元素
 */
const HtmlToReact = React.memo<{ htmlString: string }>(({ htmlString }) => {
    if (!htmlString) {
        return null;
    }

    // Always use dangerouslySetInnerHTML for consistent SSR/hydration
    // This prevents hydration mismatches between server and client
    return (
        <div 
            className={CSS.article}
            dangerouslySetInnerHTML={{ __html: htmlString }} 
        />
    );


});

HtmlToReact.displayName = 'HtmlToReact';

export default HtmlToReact;