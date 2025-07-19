# YourAI 🤖✨

<div align="center">

![YourAI Banner](https://img.shields.io/badge/YourAI-Next%20Generation%20AI%20Assistant-FF6B9D?style=for-the-badge&logo=openai&logoColor=white)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![LightRAG](https://img.shields.io/badge/LightRAG-Enhanced-4ECDC4?style=flat-square&logo=python&logoColor=white)](https://github.com/HKUDS/LightRAG)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers%20AI-F38020?style=flat-square&logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/workers-ai/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)

**🌟 [Live Demo](https://sw-crazy-ai.vercel.app/) | 🔗 [Backend API](https://al1kss-safetyai.hf.space/) | 🚀 [GitHub Repo](https://github.com/al1kss/crazy-ai)**

*Transform your workflow with intelligent AI assistants made for professionals and enthusiasts*

</div>

---

## 🎯 What Makes YourAI Special?

Hey! Let me tell you what makes YourAI different from your typical AI chatbot or a wrapper

### 🚀 Contributing to Open Source
I'm proud to have contributed a **major feature** to the [LightRAG project](https://github.com/HKUDS/LightRAG/pull/1765) - the first-ever **Cloudflare Workers AI integration**! 

**What's LightRAG?** Think of it as a super-smart way for AI to understand and remember information. Instead of just dumping text into AI, LightRAG creates a "knowledge graph" - like a web of connected ideas that helps AI give you much better, more contextual answers.

**My Contribution:** Before my integration, LightRAG users had to run everything manually on their computers, which was pretty limiting. I created a seamless bridge between LightRAG and Cloudflare's global edge network, meaning:
- ⚡ **Serverless deployment** - No heavy server requirements
- 🌍 **Global accessibility** - Millions can now use LightRAG without local setup
- 🔄 **Smart fallbacks** - If one AI model fails, it automatically tries others
- 💨 **Lightning fast** - Powered by Cloudflare's edge network

### 🎨 Built From Scratch, With Love
Here's the thing - when most people think "AI chat app," they imagine grabbing some pre-built components and calling it a day. **Not here!** Every single interface, every animation, every chat bubble was crafted by hand:

- 🎭 **Custom Chat UI** - No generic chat components here
- 📝 **Markdown Interpreter** - AI responses come beautifully formatted
- 🎪 **Animated Components** - Smooth, delightful interactions everywhere
- 🎨 **Modern Design System** - Custom color schemes with neon glows and blur effects
- 📱 **Responsive Design** - Works perfectly on any device

---

## ✨ Core Features

### 🤖 Multiple AI Assistants
- **🔥 Fire Safety Expert** - Specialized in safety regulations and procedures
- **🧠 General Assistant** - Your everyday AI companion
- **⚗️ Physics Tutor** - Advanced physics concepts and problem-solving
- **🛠️ Build Your Own** - Upload knowledge files and create custom AI assistants

### 🔐 Enterprise-Grade Security
- **JWT Authentication** - Secure token-based user sessions
- **Password Hashing** - bcrypt encryption for user data
- **Session Management** - Automatic token refresh and expiration

### 💾 Smart Memory System
- **Conversation Persistence** - Your chats are saved and searchable
- **Knowledge Graphs** - AI remembers context across conversations
- **File Upload Support** - PDF, TXT, MD, JSON, DOCX knowledge integration

### 🚀 Advanced RAG Implementation
- **Hybrid Query Modes** - Local, global, hybrid, and naive search
- **Fallback System** - Automatic model switching for reliability
- **Real-time Processing** - Live knowledge base updates

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons

### Backend & Infrastructure
- **Python FastAPI** - High-performance backend
- **LightRAG** - Advanced RAG implementation
- **Cloudflare Workers AI** - Serverless AI processing
- **PostgreSQL** - Reliable data storage
- **Redis** - Fast caching layer
- **Vercel Blob** - File storage solution

---

## 🚀 Quick Start

Ready to dive in? Here's how to get YourAI running locally:

### Prerequisites
- Node.js 18+ and pnpm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/al1kss/crazy-ai.git
cd crazy-ai

# Install dependencies
pnpm install

# Start the development server
npm run dev
```

That's it! 🎉 Open [http://localhost:3000](http://localhost:3000) and start chatting with your AI assistants.

### Environment Variables
The app will work out of the box, but for full functionality, you'll need:

```env
# Authentication
JWT_SECRET_KEY=your_jwt_secret

# Database (auto-created)
DATABASE_URL=your_postgres_url
REDIS_URL=your_redis_url

# Cloudflare AI
CLOUDFLARE_API_KEY=your_cloudflare_key
CLOUDFLARE_ACCOUNT_ID=your_account_id

# Storage
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

---

## 🏗️ Architecture

### Frontend Architecture
```
src/
├── app/                    # Next.js App Router
│   ├── (main)/            # Main site pages
│   ├── (chat)/            # Chat interfaces
│   └── api/               # API routes
├── components/             # Reusable UI components
├── contexts/              # React context providers
└── lib/                   # Utilities and configurations
```

### Backend Highlights
- **Persistent LightRAG** - Knowledge graphs stored in Vercel Blob + PostgreSQL
- **Multi-Model Fallback** - Automatic switching between AI models
- **Real-time Processing** - Streaming responses and live updates
- **Memory Management** - Conversation history and context retention

---

## 🌟 What Makes This Special?

### For Technical Folks:
- **First Cloudflare-LightRAG Integration** - Pioneering serverless RAG deployment
- **Custom Chat Architecture** - No pre-built chat libraries used
- **Advanced State Management** - React Context + PostgreSQL + Redis
- **Responsive Design System** - Custom Tailwind configuration with animations

### For Everyone Else:
Imagine if ChatGPT could remember everything you've ever told it, had specialized knowledge in specific fields, and looked absolutely stunning while doing it, by it I mean taking a few seconds to find that exact information showing where it got that information from, and with relationships shown to link and explain better. That's YourAI! 

Plus, unlike other AI apps that feel generic, every pixel here was designed with care. The gentle animations, the smooth transitions, the way text appears... it all comes together to create something that feels magical to use.

---

## 🤝 Contributing

Found a bug? Have an idea? I'd love to hear from you!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎭 Final Thoughts

You know what's funny? When I started this project, I thought building AI apps meant plugging into some API and getting a basic chat interface for free. Boy, was I wrong! 😅

Creating beautiful, responsive chat interfaces turned out to be an art form. Getting AI responses to format properly with markdown, making animations smooth, ensuring everything works on mobile, handling file uploads, managing user sessions... every single piece had to be built from scratch.

But that's what makes YourAI special. It's not just another AI wrapper - it's a carefully crafted experience that shows what's possible when you combine cutting-edge AI technology with thoughtful design and engineering.

Hope you enjoy using it as much as I enjoyed building it! 🚀

---

<div align="center">

**Made with ❤️ by [Alikhan Abdykaimov](https://github.com/al1kss)**

[![GitHub](https://img.shields.io/badge/GitHub-al1kss-181717?style=flat-square&logo=github)](https://github.com/al1kss)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/alikhan-abdykaimov/)

*Star ⭐ this repo if you found it helpful!*

</div>