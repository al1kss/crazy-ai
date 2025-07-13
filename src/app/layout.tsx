import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '../components/layout/header'
import Footer from '../components/layout/footer'
import AmbientBackground from '../components/homepage/background'
import { AuthProvider } from '../contexts/AuthContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'YourAI - Next Generation AI Assistant',
  description: 'Transform your workflow with intelligent AI assistants tailored for professionals and enthusiasts alike.',
  keywords: ['AI', 'Assistant', 'LightRAG', 'Fire Safety', 'Chatbot'],
  authors: [{ name: 'YourAI Team' }],
  openGraph: {
    title: 'YourAI - Next Generation AI Assistant',
    description: 'Transform your workflow with intelligent AI assistants tailored for professionals and enthusiasts alike.',
    url: 'https://sw-crazy-ai.vercel.app/',
    siteName: 'YourAI',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YourAI - Next Generation AI Assistant',
    description: 'Transform your workflow with intelligent AI assistants tailored for professionals and enthusiasts alike.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <AmbientBackground />
          <Header />
          <main className="pt-16 relative z-10">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}