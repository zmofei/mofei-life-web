"use client";
import React, { ReactNode, ReactElement } from "react";
import "react-photo-view/dist/react-photo-view.css";
import CSS from "./article.module.scss";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { Highlight } from "prism-react-renderer";

import { replaceCDNDomain } from "@/components/util/util";

const parseStyle = (styleString: string): React.CSSProperties => {
    const style: { [key: string]: string } = {};
    const stylePairs = styleString.split(";").map((pair) => pair.trim()); // 按分号分隔并去掉多余空格

    stylePairs.forEach((pair) => {
        if (!pair) return; // 忽略空字符串

        const [key, value] = pair.split(":").map((item) => item.trim());
        if (!key || !value) return; // 忽略无效的键值对

        // 将 CSS 属性名转换为驼峰命名法（例如 background-color => backgroundColor）
        const camelCaseKey = key.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
        style[camelCaseKey] = value;
    });

    return style;
};

/**
 * HtmlToReact Component
 * @param {string} htmlString - 要解析的 HTML 字符串
 * @returns {JSX.Element} - 渲染的 React 元素
 */
const HtmlToReact: React.FC<{ htmlString: string }> = ({ htmlString }) => {
    if (!htmlString) {
        return null;
    }

    if (typeof window === "undefined") {
        return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
    }

    const tagHandlers: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: (node: HTMLElement, props: any, children: React.ReactNode[]) => React.ReactNode;
    } = {
        img: (node, props) => {
            props.src = replaceCDNDomain(props.src);
            return (
                <PhotoView key={props.src} src={props.src}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img {...props} alt="" />
                </PhotoView>
            )
        },
        iframe: (node) => (
            <div
                key={Math.random()}
                dangerouslySetInnerHTML={{ __html: node.outerHTML }}
            />
        ),
        h2: (node) => {
            return <h2 key={Math.random()} className="text-4xl font-bold">{node.textContent}</h2>
        },
        pre: (node) => {
            const { childNodes } = node;
            let codeContent = "";
            let language = "javascript";

            // 提取 <code> 标签的内容
            Array.from(childNodes).forEach((childNode) => {
                if (
                    childNode.nodeType === Node.ELEMENT_NODE &&
                    (childNode as Element).tagName.toLowerCase() === "code"
                ) {
                    const codeElement = childNode as HTMLElement;
                    codeContent = codeElement.textContent || "";
                    const className = codeElement.className || "";
                    const match = className.match(/language-(\w+)/);
                    if (match && match[1]) {
                        language = match[1];
                    }
                }
            });

            if (codeContent.trim()) {
                return <CodeBlock key={Math.random()} codeContent={codeContent.trim()} language={language} />;
            }

            // 如果没有 <code> 标签或没有内容，直接渲染原始 HTML
            return (
                <pre
                    key={Math.random()}
                    dangerouslySetInnerHTML={{ __html: node.outerHTML }}
                />
            );
        },
        video: (node, props, children) => {
            props.controls = "true"; // 强制添加 `controls` 属性
            props.poster = replaceCDNDomain(props.poster);

            function replaceSourceDomain(children: ReactNode): ReactNode {
                return React.Children.map(children, (child) => {
                    if (React.isValidElement(child) && child.type === 'source') {
                        const element = child as ReactElement<{ src?: string }>;
                        if (!element.props.src) {
                            return child;
                        } else {
                            const updatedSrc = replaceCDNDomain(element.props.src);;
                            return React.cloneElement(element, { src: updatedSrc });
                        }
                    }
                    return child;
                });
            }

            const newChildren = replaceSourceDomain(children);
            return React.createElement("video", { ...props, key: Math.random() }, ...React.Children.toArray(newChildren));
        },
    };

    // 递归解析 DOM 节点为 React 元素
    const convertNodeToReact = (node: Node): React.ReactNode => {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent;
        }

        if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            const { tagName, attributes, childNodes } = element;

            const props: Record<string, string | React.CSSProperties> = {};
            for (let i = 0; i < attributes.length; i++) {
                const { name, value } = attributes[i];

                // props[name === "class" ? "className" : name] = value;
                if (name === "class") {
                    // React 使用 className 替代 class
                    props["className"] = value;
                } else if (name === "style") {
                    // 将字符串形式的 style 转换为 React 的 style 对象
                    props["style"] = parseStyle(value);
                } else {
                    props[name] = value;
                }
            }

            const children = Array.from(childNodes).map((childNode) =>
                convertNodeToReact(childNode)
            );

            // 如果有自定义处理器，使用它
            if (tagHandlers[tagName.toLowerCase()]) {
                return tagHandlers[tagName.toLowerCase()](element, props, children);
            }

            // 默认处理
            return React.createElement(tagName.toLowerCase(), { ...props, key: Math.random() }, ...children);
        }

        return null;
    };


    // 客户端解析 HTML 字符串
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");
        const bodyChildNodes = doc.body.childNodes;

        const parsedElements = Array.from(bodyChildNodes).map((node) =>
            convertNodeToReact(node)
        );
        return (
            <div className={CSS.article}>

                <PhotoProvider>
                    {parsedElements}
                </PhotoProvider>
            </div>
        );
    } catch (error) {
        console.error("HtmlToReact failed:", error);
        return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
    }


};

const CodeBlock: React.FC<{ codeContent: string; language: string }> = ({ codeContent, language }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(codeContent.trim());
        setCopied(true);

        // 在 2 秒后恢复为 "Copy"
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <div style={{ position: "relative" }} className="code-block-wrapper">
            <Highlight code={codeContent} language={language}>
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre className={`${className} code-block`} style={style}>
                        {tokens.map((line, i) => (
                            <div key={i} {...getLineProps({ line })}>
                                {line.map((token, key) => (
                                    <span key={`span_${key}`} {...getTokenProps({ token })} />
                                ))}
                            </div>
                        ))}
                    </pre>
                )}
            </Highlight>
            <button
                onClick={handleCopy}
                style={{
                    position: "absolute",
                    top: "-30px",
                    right: "0px",
                    backgroundColor: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "5px 10px",
                    cursor: "pointer",
                }}
            >
                {copied ? "Copied" : "Copy"}
            </button>
        </div>
    );
};

export default HtmlToReact;
export { CodeBlock };