# Mofei Life Web

[![Cloudflare Pages](https://img.shields.io/badge/Deployed%20on-Cloudflare%20Pages-orange?style=flat-square&logo=cloudflare)](https://www.mofei.life/)
[![Deployment Status](https://img.shields.io/badge/Status-Live-brightgreen?style=flat-square)](#)

Open source code for the personal blog website [mofei.life](https://www.mofei.life/), a modern multilingual personal blog platform built with Next.js.

**[中文说明 / Chinese Documentation](README_zh.md)**

**Note: This project is primarily intended for code reference and learning purposes. The API endpoints connect to the author's personal backend services. For deploying your own version, please refer to the [Custom Deployment](#custom-deployment) section.**

## 🤖 Development Philosophy

This project represents Mofei's journey with modern development practices:

- **Pre-2025**: All code was handwritten by Mofei, representing traditional development approaches
- **2025 onwards**: Mofei embraced AI-assisted development, and the codebase now reflects a collaborative approach between human creativity and AI efficiency

This evolution showcases how developers can effectively integrate AI tools while maintaining code quality and personal vision.

## 🌟 Features

- **Multilingual Support**: Full support for both Chinese and English
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Voice Commentary**: Audio narration for blog posts with speaker icons
- **SPA Navigation**: Single Page Application experience while preserving SSR benefits
- **Interactive Comments**: Real-time comment system with user avatars
- **WeChat Integration**: QR code sharing for WeChat public accounts
- **Blog System**: Dynamic blog posts with rich content support
- **RSS Feeds**: Automated RSS feed generation
- **SEO Optimized**: Complete SEO metadata and sitemap generation
- **Mobile Responsive**: Optimized for all device sizes
- **Dark Theme**: Elegant dark theme design

## 🚀 Tech Stack

- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.1.3
- **Animations**: Framer Motion
- **Icons**: Heroicons
- **Deployment**: Cloudflare Workers with OpenNext
- **Comments**: Custom comment system with gravatar support

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/zmofei/mofei-life-web.git
cd mofei-life-web
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables (optional):
```bash
# Create .env.local for local development
# The project works with default API endpoints
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at `http://localhost:3000` (or `https://local.mofei.life:3000` for development with HTTPS).

## 📝 Available Scripts

- `npm run dev` - Start development server with HTTPS
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to Cloudflare Workers
- `npm run preview` - Preview Cloudflare deployment locally

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [lang]/            # Internationalization routing
│   │   ├── blog/          # Blog pages
│   │   ├── message/       # Message/comment pages
│   │   └── rss/           # RSS feed generation
│   └── actions/           # Server actions
├── components/            # Reusable components
│   ├── Comments/          # Comment system
│   ├── Common/            # Shared components (SPALink, Pagination)
│   ├── Context/           # React contexts (Router, Language)
│   ├── Home/              # Homepage components
│   ├── util/              # Utility components (SPATransition, VoiceFeatureNotice)
│   └── ui/                # UI components
├── lib/                   # Utility functions
├── utils/                 # Audio management and utilities
└── styles/               # Global styles
```

## 🌐 API Integration

The project integrates with a custom API for:
- Blog content management
- Voice commentary audio files (served from static.mofei.life)
- Comment system
- User authentication
- RSS feed generation

API endpoints are configured in `src/app/actions/blog.ts`.

## 🎨 Customization

### Styling
- Modify `src/styles/globals.css` for global styles
- Update `tailwind.config.js` for theme customization
- Component-specific styles use Tailwind classes

### Content
- Blog content is fetched from the API
- Static assets are stored in `public/`
- WeChat QR codes are in `public/img/`

### Languages
- Language routing handled by `src/middleware.ts`
- Language context in `src/components/Context/LanguageContext.tsx`

## 🚀 Deployment

### Cloudflare Workers (Recommended)

1. Build and deploy:
```bash
npm run deploy
```

2. Configure environment variables in Cloudflare dashboard if needed

### Other Platforms

The project can be deployed to any platform supporting Next.js:
- Vercel
- Netlify
- AWS
- Google Cloud

## 🔧 Custom Deployment

This project is designed as a personal blog with API endpoints pointing to the author's backend services. To deploy your own version:

1. **Backend Setup**: You'll need to set up your own backend API that provides:
   - Blog content management
   - Comment system
   - User authentication
   - RSS feed data

2. **API Configuration**: Update the API endpoints in `src/app/actions/blog.ts` and `src/app/actions/blog-server.ts` to point to your backend.

3. **Environment Variables**: Configure your environment variables based on your backend setup.

4. **WeChat Integration**: Replace the WeChat QR codes in `public/img/` with your own if using WeChat integration.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Deployed on [Cloudflare Workers](https://workers.cloudflare.com/)
- Icons by [Heroicons](https://heroicons.com/)
- Animations by [Framer Motion](https://www.framer.com/motion/)

## 📧 Contact

For questions or support, please open an issue or contact through the WeChat public accounts featured on the site.

---

**Disclaimer**: This is a personal blog project shared for reference and learning purposes. The API endpoints are configured for the author's specific backend services. While you're welcome to fork and modify this project, please note that it's not designed as a ready-to-use template for general deployment.
