
export function replaceCDNDomain(url: string): string {
    if (!url) return url;
    return url
        .replace("//assets-eu.mofei.life", "//static.mofei.life")
        .replace("//static.zhuwenlong.com", "//static.mofei.life")
        .replace("//cdn.zhuwenlong.com", "//static.mofei.life")
}

