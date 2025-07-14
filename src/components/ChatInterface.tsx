'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'
import {
  Plus,
  MessageSquare,
  User,
  LogOut,
  Flame,
  Bot,
  Brain,
  Hammer,
  Clock,
  Menu
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/lib/api'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaPlus, FaArrowUp } from "react-icons/fa6";
import { BsWindowSidebar } from "react-icons/bs";
import { LuArrowRightToLine, LuArrowLeftToLine } from "react-icons/lu";

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Conversation {
  id: string
  title: string
  ai_type: string
  ai_id?: string
  last_message?: string
  updated_at: string
}

interface ChatInterfaceProps {
  aiType: 'fire-safety' | 'general' | 'physics' | 'custom'
  aiId?: string
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ aiType, aiId }) => {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // State management
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingConversations, setIsLoadingConversations] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const userDropdownRef = useRef<HTMLDivElement>(null)


  // AI Models configuration
  const aiModels = [
    {
      id: 'fire-safety',
      icon: <Flame className="w-4 h-4" />,
      title: 'Fire Safety Expert',
      description: 'Fire safety regulations and procedures',
      isActive: true,
      iconBg: 'bg-red-100 dark:bg-red-900/40',
      iconColor: 'text-red-600 dark:text-red-400',
    },
    {
      id: 'general',
      icon: <Bot className="w-4 h-4" />,
      title: 'General Assistant',
      description: 'Versatile AI for everyday tasks',
      isActive: false,
      iconBg: 'bg-blue-100 dark:bg-blue-900/40',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      id: 'physics',
      icon: <Brain className="w-4 h-4" />,
      title: 'Physics Tutor',
      description: 'Advanced physics concepts',
      isActive: false,
      iconBg: 'bg-purple-100 dark:bg-purple-900/40',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      id: 'custom',
      icon: <Hammer className="w-4 h-4" />,
      title: 'Build Your Own',
      description: 'Custom AI assistants',
      isActive: true,
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
  ]

  const currentAI = aiModels.find(model => model.id === aiType)

  // Load conversations on load
  useEffect(() => {
    if (isAuthenticated) {
      loadConversations()
    }
  }, [isAuthenticated])

  // autoscroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false)
      }
    }

    if (isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserDropdownOpen])


  const loadConversations = async () => {
    try {
      setIsLoadingConversations(true)
      const response = await apiClient.get<{ conversations: Conversation[] }>('/conversations')
      const filteredConversations = response.conversations.filter((conv: Conversation) =>
        conv.ai_type === aiType && (!aiId || conv.ai_id === aiId)
      )
      setConversations(filteredConversations)

      if (filteredConversations.length > 0 && !currentConversation) {
        loadConversation(filteredConversations[0].id)
      }
    } catch (error) {
      console.error('Failed to load conversations:', error)
    } finally {
      setIsLoadingConversations(false)
    }
  }

  const loadConversation = async (conversationId: string) => {
    try {
      setCurrentConversation(conversationId)
      const response = await apiClient.get<{ messages: any[] }>(`/conversations/${conversationId}`)
      const formattedMessages = response.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.created_at)
      }))
      setMessages(formattedMessages)
    } catch (error) {
      console.error('Failed to load conversation:', error)
    }
  }
    // start a new chat
  const startNewChat = () => {
    setCurrentConversation(null)
    setMessages([])
    setIsMobileSidebarOpen(false)
  }

  // send a message
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      let response
      switch (aiType) {
        case 'fire-safety':
          response = await apiClient.chatFireSafety(userMessage.content, 'hybrid', currentConversation)
          break
        case 'general':
          response = await apiClient.chatGeneral(userMessage.content, 'hybrid', currentConversation)
          break
        case 'custom':
          if (aiId) {
            response = await apiClient.chatCustomAI(aiId, userMessage.content, 'hybrid', currentConversation)
          }
          break
        default:
          throw new Error('Unsupported AI type')
      }

      if (response) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.answer,
          timestamp: new Date()
        }

        setMessages(prev => [...prev, assistantMessage])

        // update current conversation ID if new
        if (response.conversation_id && !currentConversation) {
          setCurrentConversation(response.conversation_id)
          loadConversations() // Refresh conversation list
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle model selection from dropdown
  const handleModelSelect = (model: typeof aiModels[0]) => {
    if (!model.isActive) return
    setIsUserDropdownOpen(false)
    router.push(`/chat/${model.id}`)
  }

  // Handle key press in input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex h-screen bg-[#262624] text-[#FAF9F5] overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* sidebar!!! */}
      <motion.div
        className={`${
          isSidebarCollapsed ? 'w-12' : 'w-72'
        } h-screen flex flex-col gap-3 pb-2 px-0 fixed top-0 left-0 transition-all duration-75 border-r border-[#3a3a37] shadow-lg bg-[#1a1a18] z-50 lg:relative lg:z-auto ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        initial={false}
        animate={{ width: isSidebarCollapsed ? 48 : 288 }}
      >
        <div className="flex items-center justify-between border-b border-[#3a3a37] w-full gap-px p-2">
          {!isSidebarCollapsed && (
            <Link href="/" className="flex items-center space-x-2">
              <motion.span
                className="text-xl font-bold bg-gradient-to-r from-[#C96442] to-[#FAF9F5] bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                YourAI
              </motion.span>
            </Link>
          )}

          <button
              onClick={() => {
                const newState = !isSidebarCollapsed
                setIsSidebarCollapsed(newState)
                if (newState) setIsHovered(false)
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="p-1.5 rounded-md hover:bg-[#3a3a37] transition-colors text-[#FAF9F5]/70 hover:text-[#FAF9F5]"
          >
            {!isSidebarCollapsed ? (
                <LuArrowLeftToLine className="w-4 h-4"/>
            ) : isHovered ? (
                <LuArrowRightToLine className="w-4 h-4"/>
            ) : (
                <BsWindowSidebar className="w-4 h-4"/>
            )}
          </button>
        </div>

        {/* New Chat Button */}
        <div className="mb-1 h-5 px-2 flex flex-col align-center">
          <div data-state="closed">
            <a
              target="_self"
              href="/new"
              onClick={(e) => {
                e.preventDefault()
                startNewChat()
              }}
              className={`
                inline-flex items-center justify-center relative shrink-0 can-focus select-none 
                disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none 
                disabled:drop-shadow-none h-9 px-4 py-2 rounded-lg min-w-[5rem] active:scale-[0.985] 
                whitespace-nowrap group transition ease-in-out active:!scale-100 hover:bg-transparent 
                flex !justify-start !min-w-0 w-full hover:!bg-[#C96442]/[0.08] active:!bg-[#C96442]/15
                ${isSidebarCollapsed ? 'justify-center' : ''}
              `}
              aria-label="New chat"
            >
              <div className="-mx-3 flex flex-row items-center gap-2">
                <div className="w-6 h-6 flex items-center justify-center group-active:!scale-[0.98] group-active:!shadow-none group-active:bg-[#26A198] group-hover:-rotate-2 group-hover:scale-105 group-active:rotate-3 rounded-full transition-all ease-in-out bg-[#C96442] group-hover:shadow-md">
                  <Plus className="text-white w-3.5 h-3.5" />
                </div>
                {!isSidebarCollapsed && (
                  <div className="transition-all duration-200 text-[#C96442] font-bold text-sm tracking-tight">
                    New chat
                  </div>
                )}
              </div>
            </a>
          </div>
        </div>


        {/* Chat History */}
        <div className="overflow-y-auto px-3 flex flex-col align-center h-full overflow-hidden">
          {!isSidebarCollapsed && (
            <div className="mb-3">
              <h3 className="text-xs font-medium text-[#FAF9F5]/60 px-2 mb-0 pt-5">Recents</h3>
            </div>
          )}

          <div className="space-y-1">
            {isLoadingConversations ? (
              // loading skeleton (placeholder)
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-6 bg-[#3a3a37]/50 rounded-lg animate-pulse" />
              ))
            ) : conversations.slice(0, 10).map((conversation) => (
                <motion.button
                    key={conversation.id}
                    onClick={() => loadConversation(conversation.id)}
                    className={`${
                        isSidebarCollapsed ? 'w-7 h-7 -mx-0.5 justify-center mt-6' : 'w-full h-8 p-2'
                    } flex items-center gap-3 rounded-lg hover:bg-[#3a3a37] transition-colors text-left group ${
                        currentConversation === conversation.id ? 'bg-[#3a3a37]' : ''
                    }`}
                    whileHover={{scale: 1.01}}
                >
                  <div className="w-6 h-6 flex items-center justify-center rounded-full p-1">
                    <MessageSquare className="w-4 h-4 text-[#FAF9F5]/60"/>
                  </div>
                  {!isSidebarCollapsed && (
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">
                          {conversation.title || conversation.last_message || 'New conversation'}
                        </p>
                      </div>
                  )}
                </motion.button>
            ))}
          </div>
        </div>

        {/* sser name section */}
        <div className="px-3 relative">
          {isAuthenticated ? (
              <div className="relative" ref={userDropdownRef}>
                <motion.button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#3a3a37] transition-colors ${
                        isSidebarCollapsed ? 'justify-center px-3.5' : ''
                    }`}
                    whileHover={{scale: 1.01}}
                >
                  <div className="flex flex-row gap-2">
                    <div className="shrink-0">
                      <div
                          className="flex shrink-0 items-center justify-center rounded-full font-bold select-none h-7 w-7 text-[12px] bg-[#262624] text-[#C2C0B6]">
                      {user?.name[0].toUpperCase()}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 py-0.5 leading-6 tracking-tight">
                    {!isSidebarCollapsed && (
                      <span className="truncates">{user?.name}</span>
                    )}
                  </div>
                </div>

              </motion.button>

              {/* user dropdown */}
              <AnimatePresence>
                {isUserDropdownOpen && (
                    <motion.div
                        className="user-dropdown absolute bottom-full left-0 mb-2 border border-[#3a3a37] rounded-lg shadow-lg p-2 min-w-[280px] bg-[#1a1a18]"
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: 10}}
                        transition={{duration: 0.2}}
                    >
                      {aiModels.map((model) => (
                          <button
                              key={model.id}
                              onClick={() => handleModelSelect(model)}
                        className={`w-full text-left p-3 rounded-md transition-all duration-200 ${
                          model.isActive 
                            ? 'hover:bg-[#3a3a37] cursor-pointer' 
                            : 'opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-md ${model.iconBg} flex items-center justify-center ${model.iconColor}`}>
                            {model.icon}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#FAF9F5]">{model.title}</p>
                            <p className="text-xs text-[#FAF9F5]/60">{model.description}</p>
                            {!model.isActive && (
                              <div className="flex items-center gap-1 mt-1">
                                <Clock className="w-3 h-3 text-[#C96442]" />
                                <span className="text-[#C96442] text-xs">Coming Soon</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                    <div className="border-t border-[#3a3a37] mt-2 pt-2">
                      <button
                        onClick={() => {
                          logout()
                          setIsUserDropdownOpen(false)
                        }}
                        className="flex items-center space-x-2 text-[#FAF9F5]/70 hover:text-[#FAF9F5] transition-colors w-full text-left p-2 rounded-md hover:bg-[#3a3a37]"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center p-3">
              <p className="text-xs text-[#FAF9F5]/60 mb-2">Sign in to save chats</p>
              <Link
                href="/"
                className="text-xs text-[#C96442] hover:underline"
              >
                Go to homepage
              </Link>
            </div>
          )}
        </div>
      </motion.div>


      <div className="flex-1 flex flex-col">
        {/* header for phones */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-[#3a3a37] bg-[#1a1a18]">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-[#3a3a37] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {currentAI && (
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-md ${currentAI.iconBg} flex items-center justify-center ${currentAI.iconColor}`}>
                {currentAI.icon}
              </div>
              <span className="text-sm font-medium">{currentAI.title}</span>
            </div>
          )}
        </div>

        {/* what ai ur on typa header */}
        {currentAI && (
          <div className="hidden lg:flex items-center gap-3 p-4 bg-[#262624]">
            <div className={`w-8 h-8 rounded-md ${currentAI.iconBg} flex items-center justify-center ${currentAI.iconColor}`}>
              {currentAI.icon}
            </div>
            <div>
              <p className="text-sm font-medium">{currentAI.title}</p>
              <p className="text-xs text-[#FAF9F5]/60">{currentAI.description}</p>
            </div>
          </div>
        )}

        {/* messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#3a3a37] flex items-center justify-center mx-auto mb-4">
                  {currentAI?.icon}
                </div>
                <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
                <p className="text-[#FAF9F5]/60 text-sm">
                  Ask me anything about {currentAI?.title.toLowerCase() || 'your topic'}
                </p>
              </div>
            </div>
          ) : (messages.map((message) => (
            <motion.div
              key={message.id}
              className="w-full mb-1 mt-1 flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-full max-w-3xl flex justify-start relative mx-auto h-full flex-1 md:px-2">
                <div
                  className={`
                    group relative inline-flex gap-2 rounded-xl pl-2.5 py-2.5 break-words transition-all max-w-[75ch] flex-col pr-6
                    ${message.role === 'user' 
                      ? 'bg-[#141413] text-[#FAF9F5] font-sans' 
                      : 'bg-[#262624] text-[#FAF9F5] font-serif text-[17px]'}
                  `}
                >
                  <div className="flex flex-row gap-2">
                    {message.role === 'user' ? (
                        <div className="flex flex-row gap-2">
                          <div className="shrink-0">
                            <div
                                className="flex shrink-0 items-center justify-center rounded-full font-bold select-none h-7 w-7 text-[12px] bg-[#C2C0B6] text-[#262624]">
                              {user?.name[0].toUpperCase()}
                            </div>
                          </div>
                          <div className="grid grid-cols-1 gap-2 py-0.5 leading-6 tracking-tight">
                            <p className="whitespace-pre-wrap break-words">{message.content}</p>
                          </div>
                        </div>
                    ) : (
                        <div>
                          <div className={"grid-cols-1 grid gap-2.5 [&_>_*]:min-w-0"}>
                            <div className={"prose prose-invert max-w-none break-words"}>
                              <div className="max-w-none break-words text-base sm:text-[17px] leading-relaxed">
                                <ReactMarkdown
                                    children={message.content}
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeHighlight]}
                                    components={{
                                      code({node, inline, className, children, ...props}: any) {
                                        return inline ? (
                                            <code
                                                className="bg-[#3a3a37] text-[#FAF9F5] px-1.5 py-0.5 rounded text-[0.85rem] font-mono"
                                                {...props}
                                            >
                                              {children}
                                            </code>
                                        ) : (
                                            <pre className="bg-[#1e1e1e] p-4 rounded-lg overflow-auto">
                                              <code className="text-sm" {...props}>
                                                {children}
                                              </code>
                                            </pre>
                                        )
                                      }
                                    }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
              ))
          )}

          {isLoading && (
              <motion.div
                  className="w-full max-w-3xl flex justify-start relative mx-auto flex-1 md:px-2"
                  initial={{opacity: 0, y: 20}}
                  animate={{opacity: 1, y: 0}}
              >
                <div className="bg-[#3a3a37] p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-[#FAF9F5]/60 rounded-full animate-bounce"/>
                    <div className="w-2 h-2 bg-[#FAF9F5]/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-[#FAF9F5]/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* chat box */}
        <div className="sticky bottom-2.5 mx-auto pt-6 z-[5] flex justify-center md:px-2">
          <div className="px-3 md:px-2 w-[48rem]">
            <div
                className="flex flex-col bg-[#30302e] border-0.5 border-[rgba(222, 220, 209, 0.15)] mx-2 md:mx-0 items-stretch transition-all duration-200 relative shadow-[0_0.25rem_1.25rem_#00000009] focus-within:shadow-[0_0.25rem_1.25rem_#00000013] hover:border-[#dedcd14d] focus-within:border-[#dedcd14d] cursor-text z-10 rounded-2xl">
              <div className="flex flex-col gap-3.5 m-3.5">
                <div className="relative">
                  <div
                      className="max-h-96 w-full overflow-y-auto font-large break-words transition-opacity duration-200 min-h-[1.5rem]">
                    <textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={`Reply to ${currentAI?.title || 'AI'}...`}
                        className="w-full bg-transparent text-[1rem] font-sans border-none text-[#FAF9F5] placeholder-[#FAF9F5]/40 resize-none focus:outline-none break-words max-w-full"
                        rows={1}
                        style={{minHeight: '1rem', maxHeight: '384px'}}
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement
                          target.style.height = 'auto'
                          target.style.height = Math.min(target.scrollHeight, 384) + 'px'
                        }}
                        disabled={!isAuthenticated}
                    />
                  </div>
                </div>

                <div className="flex gap-2.5 w-full items-center">
                  <div className="relative flex-1 flex items-center gap-2 shrink min-w-0">
                    {/* later add input for images etc. */}
                    <div className="relative shrink-0">
                      <button
                          className="inline-flex items-center justify-center relative shrink-0 border border-[#3a3a37] transition-all h-8 min-w-8 rounded-lg flex items-center px-[7.5px] text-[#FAF9F5]/60 hover:text-[#FAF9F5]/90 hover:bg-[#3a3a37] active:scale-[0.98]"
                          type="button"
                          aria-label="Add attachments"
                      >
                        <FaPlus className="w-4 h-4"/>
                      </button>
                    </div>

                    <div className="flex flex-row items-center gap-2 min-w-0"></div>
                    <div className="text-[#FAF9F5]/40 text-xs ml-2"></div>
                  </div>

                  <div>
                    <button
                        onClick={sendMessage}
                        disabled={!inputMessage.trim() || isLoading || !isAuthenticated}
                        className="inline-flex items-center justify-center relative shrink-0 bg-[#C96442] text-white font-semibold transition-colors hover:bg-[#B85A3A] h-8 w-8 rounded-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        type="button"
                        aria-label="Send message"
                    >
                      <FaArrowUp className="w-4 h-4"/>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {!isAuthenticated && (
                <p className="text-xs text-[#FAF9F5]/60 mt-2 text-center">
                  <Link href="/" className="text-[#C96442] hover:underline">
                    Sign in
                  </Link>
                  {' '}to save your conversation history
                </p>
            )}
          </div>
        </div>
      </div>


    </div>
  )
}

export default ChatInterface