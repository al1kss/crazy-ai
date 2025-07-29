import {useCallback, useEffect, useState} from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://al1kss-safetyai.hf.space'

export interface ApiResponse<T> {
  data?: T
  error?: string
}

export interface SystemStats {
  total_users: number
  total_ais: number
  total_messages: number
  lines_of_code_generated: number
  last_updated: string
}

export interface StatsUpdateRequest {
  stat_type: 'users' | 'ais' | 'messages' | 'characters'
  increment?: number
}

export interface User {
  id: string
  email: string
  name: string
  created_at: string
}

export interface CustomAI {
  id: string
  name: string
  description?: string
  created_at: string
  files_count: number
  persistent_storage?: boolean
  lightrag_python?: boolean
  icon?: string
  total_tokens?: number
  knowledge_size?: number
  user_id?: string
  is_active?: boolean
  file_count?: number
}

export interface ChatResponse {
  answer: string
  mode: string
  status: string
  conversation_id?: string
}

export interface ConversationMemoryStatus {
  has_memory: boolean
  message_count: number
  last_updated?: string
}

export interface SystemInfo {
  service: string
  version: string
  features: {
    persistent_python_lightrag: boolean
    vercel_blob_storage: boolean
    conversation_memory: boolean
    custom_ai_support: boolean
    file_upload: boolean
    multi_model_support: boolean
    zero_rebuild_cost: boolean
    graph_rag: boolean
  }
  models: {
    llm: string
    embedding: string
  }
  storage: {
    graph: string
    vector: string
    conversation_memory: string
    blob_storage: string
    rag_framework: string
  }
}

export interface FileUploadResponse {
  filename: string
  size: number
  message: string
}

export interface AuthResponse {
  token: string
  user: User
  message: string
}

export interface ApiError {
  detail: string
  status_code: number
}

export interface BackendChatResponse {
  answer: string
  mode: string
  status: string
  conversation_id?: string
}

export interface ConversationMemoryStatus {
  has_memory: boolean
  message_count: number
  last_updated?: string
}

class ApiClient {
  private getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    }
  }

  private getFileUploadHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    return {
      ...(token && { 'Authorization': `Bearer ${token}` }),
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 401) {
      await this.handleAuthError(response)
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}: ${response.statusText}`)
    }
    return response.json()
  }

  private async handleAuthError(response: Response): Promise<void> {
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      }
      window.dispatchEvent(new CustomEvent('auth-required'))
    }
  }

  private async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) return null

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken })
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('auth_token', data.token)
        return data.token
      }
      return null
    } catch {
      return null
    }
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      })
      return this.handleResponse<T>(response)
    } catch (error) {
      if (error instanceof Error && error.message.includes('401')) {
        const newToken = await this.refreshToken()
        if (newToken) {
          const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(data),
          })
          return this.handleResponse<T>(retryResponse)
        }
      }
      throw error
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      })
      return this.handleResponse<T>(response)
    } catch (error) {
      if (endpoint.includes('/conversations/') && error instanceof Error) {
        if (error.message.includes('404')) {
          throw new Error('Conversation not found')
        }
        if (error.message.includes('403')) {
          throw new Error('Access denied to conversation')
        }
      }
      throw error
    }
  }

  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      })
      return this.handleResponse<T>(response)
    } catch (error) {
      if (endpoint.includes('/conversations/') && error instanceof Error) {
        if (error.message.includes('404')) {
          throw new Error('Conversation not found')
        }
      }
      throw error
    }
  }

  async uploadFiles(files: File[]): Promise<FileUploadResponse[]> {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })

    const response = await fetch(`${API_BASE_URL}/upload-files`, {
      method: 'POST',
      headers: this.getFileUploadHeaders(),
      body: formData,
    })

    return this.handleResponse<FileUploadResponse[]>(response)
  }

  async getSystemStats(): Promise<SystemStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching system stats:', error)
      throw error
    }
  }

  async updateSystemStats(request: StatsUpdateRequest): Promise<{ message: string; status: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stats/update`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`Failed to update stats: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating system stats:', error)
      throw error
    }
  }

  async incrementStat(statType: 'users' | 'ais' | 'messages' | 'characters', increment: number = 1): Promise<void> {
    try {
      await this.updateSystemStats({
        stat_type: statType,
        increment
      })
    } catch (error) {
      console.warn('Failed to increment stat:', statType, error)
    }
  }

  // authentication
  async register(email: string, name: string, password: string): Promise<AuthResponse> {
    return this.post('/auth/register', { email, name, password })
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.post('/auth/login', { email, password })
  }

  async chatFireSafety(
    question: string,
    mode: string = 'hybrid',
    conversationId?: string | null
  ): Promise<BackendChatResponse> {
    return this.post('/chat/fire-safety', {
      question,
      mode,
      conversation_id: conversationId
    })
  }

  async chatGeneral(
    question: string,
    mode: string = 'hybrid',
    conversationId?: string | null
  ): Promise<BackendChatResponse> {
    return this.post('/chat/general', {
      question,
      mode,
      conversation_id: conversationId
    })
  }

  async chatCustomAI(
    aiId: string,
    question: string,
    mode: string = 'hybrid',
    conversationId?: string | null
  ): Promise<BackendChatResponse> {
    return this.post(`/chat/custom/${aiId}`, {
      question,
      mode,
      conversation_id: conversationId
    })
  }

  async createCustomAI(name: string, description: string): Promise<{
    ai_id: string;
    message: string;
    ai_info: CustomAI
  }> {
    return this.post('/create-custom-ai', { name, description })
  }

  async getMyAIs(): Promise<{ ais: CustomAI[]; count: number }> {
    return this.get('/my-ais')
  }

  async updateCustomAI(aiId: string, data: { name?: string; description?: string; icon?: string }): Promise<any> {
    return this.post(`/custom-ai/${aiId}/update`, data)
  }

  async deleteCustomAI(aiId: string): Promise<{ message: string }> {
    return this.delete(`/custom-ai/${aiId}`)
  }

  async getCustomAIDetails(aiId: string): Promise<CustomAI> {
    return this.get(`/custom-ai/${aiId}`)
  }

  async getConversations(): Promise<{ conversations: any[] }> {
    return this.get('/conversations')
  }

  async getConversationMessages(conversationId: string): Promise<{ messages: any[] }> {
    return this.get(`/conversations/${conversationId}`)
  }

  async deleteConversation(conversationId: string): Promise<{ message: string }> {
    return this.delete(`/conversations/${conversationId}`)
  }

  async clearConversationMemory(conversationId: string): Promise<{ message: string }> {
    return this.delete(`/conversations/${conversationId}/memory`)
  }

  async getConversationMemoryStatus(conversationId: string): Promise<ConversationMemoryStatus> {
    return this.get(`/conversations/${conversationId}/memory`)
  }

  async getSystemInfo(): Promise<SystemInfo> {
    return this.get('/system/info')
  }

  async getSystemStatus(): Promise<any> {
    return this.get('/system/status')
  }

  async testRagPersistence(): Promise<any> {
    return this.get('/test/rag-persistence')
  }

  async forceRefreshRag(aiType: string): Promise<any> {
    return this.post(`/admin/refresh-rag/${aiType}`)
  }

  async getHealth(): Promise<any> {
    return this.get('/health')
  }

  async getModes(): Promise<any> {
    return this.get('/modes')
  }

  async getExamples(): Promise<any> {
    return this.get('/examples')
  }

  async getRequirements(): Promise<any> {
    return this.get('/requirements')
  }

  // legacy support (for the demo ai chat)
  async ask(question: string, mode: string = 'hybrid'): Promise<ChatResponse> {
    return this.post('/ask', { question, mode })
  }
}

export const countCharacters = (text: string): number => {
  return text ? text.length : 0
}

export const formatStatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export const useRealTimeStats = (intervalMs: number = 20000) => {
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      const data = await apiClient.getSystemStats()
      setStats(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats')
      console.error('Stats fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, intervalMs)
    return () => clearInterval(interval)
  }, [fetchStats, intervalMs])

  return { stats, isLoading, error, refetch: fetchStats }
}

export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    return response.ok
  } catch (error) {
    console.error('API health check failed:', error)
    return false
  }
}

export const getSystemStatus = async (): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/system/status`)
    return response.json()
  } catch (error) {
    console.error('System status check failed:', error)
    return { status: 'unavailable' }
  }
}

export const apiClient = new ApiClient()
export default apiClient

export const isValidConversationId = (id: string): boolean => {
  // UUID format validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}

export const generateConversationId = (): string => {
  // Generate a simple UUID v4
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const validateFileType = (file: File): boolean => {
  const allowedTypes = [
    'text/plain',
    'application/pdf',
    'application/json',
    'text/markdown',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]

  const allowedExtensions = ['.txt', '.md', '.json', '.pdf', '.docx']
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()

  return allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension)
}

export const getFileTypeFromName = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase()

  switch (extension) {
    case 'txt':
      return 'text'
    case 'md':
      return 'markdown'
    case 'json':
      return 'json'
    case 'pdf':
      return 'pdf'
    case 'docx':
      return 'docx'
    default:
      return 'unknown'
  }
}

export const handleApiError = (error: any): string => {
  if (error?.response?.data?.detail) {
    return error.response.data.detail
  }

  if (error?.message) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return 'An unexpected error occurred'
}

export const isAuthError = (error: any): boolean => {
  return error?.response?.status === 401 ||
         error?.message?.includes('401') ||
         error?.message?.includes('Unauthorized')
}

export const isRateLimitError = (error: any): boolean => {
  return error?.response?.status === 429 ||
         error?.message?.includes('429') ||
         error?.message?.includes('Too many')
}

export const saveAuthData = (token: string, user: User): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token)
    localStorage.setItem('auth_user', JSON.stringify(user))
  }
}

export const getAuthData = (): { token: string | null; user: User | null } => {
  if (typeof window === 'undefined') {
    return { token: null, user: null }
  }

  const token = localStorage.getItem('auth_token')
  const userStr = localStorage.getItem('auth_user')

  let user: User | null = null
  if (userStr) {
    try {
      user = JSON.parse(userStr)
    } catch (e) {
      console.error('Failed to parse user data:', e)
    }
  }

  return { token, user }
}

export const clearAuthData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }
}

export const formatConversationTitle = (content: string, maxLength: number = 50): string => {
  if (content.length <= maxLength) {
    return content
  }
  return content.substring(0, maxLength) + '...'
}

export const getConversationPreview = (messages: any[]): string => {
  if (!messages || messages.length === 0) {
    return 'No messages yet'
  }

  const lastMessage = messages[messages.length - 1]
  const preview = lastMessage.content || ''

  return formatConversationTitle(preview, 100)
}

export const checkLightRagStatus = async (): Promise<{
  isWorking: boolean
  message: string
  details?: any
}> => {
  try {
    const result = await apiClient.testRagPersistence()

    if (result.error) {
      return {
        isWorking: false,
        message: result.error,
        details: result
      }
    }

    return {
      isWorking: true,
      message: result.message || 'LightRAG is working correctly',
      details: result
    }
  } catch (error: any) {
    return {
      isWorking: false,
      message: handleApiError(error),
      details: { error: error.message }
    }
  }
}

// File upload
export const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
export const ALLOWED_FILE_TYPES = ['.txt', '.md', '.json', '.pdf', '.docx']

export const validateFileUpload = (file: File): {
  isValid: boolean
  error?: string
} => {
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size must be less than ${formatFileSize(MAX_FILE_SIZE)}`
    }
  }

  if (!validateFileType(file)) {
    return {
      isValid: false,
      error: `File type not supported. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`
    }
  }

  return { isValid: true }
}

export const processFileUpload = async (files: File[]): Promise<{
  success: boolean
  results: FileUploadResponse[]
  errors: string[]
}> => {
  const errors: string[] = []
  const validFiles: File[] = []

  for (const file of files) {
    const validation = validateFileUpload(file)
    if (!validation.isValid) {
      errors.push(`${file.name}: ${validation.error}`)
    } else {
      validFiles.push(file)
    }
  }

  if (validFiles.length === 0) {
    return {
      success: false,
      results: [],
      errors: errors.length > 0 ? errors : ['No valid files to upload']
    }
  }

  try {
    const results = await apiClient.uploadFiles(validFiles)
    return {
      success: true,
      results,
      errors
    }
  } catch (error) {
    return {
      success: false,
      results: [],
      errors: [handleApiError(error)]
    }
  }
}

export const createCustomAIWithFiles = async (
  name: string,
  description: string,
  files: File[]
): Promise<{
  success: boolean
  aiId?: string
  aiInfo?: CustomAI
  error?: string
}> => {
  try {
    const uploadResult = await processFileUpload(files)

    if (!uploadResult.success) {
      return {
        success: false,
        error: uploadResult.errors.join(', ')
      }
    }

    const result = await apiClient.createCustomAI(name, description)

    return {
      success: true,
      aiId: result.ai_id,
      aiInfo: result.ai_info
    }
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error)
    }
  }
}

export const chatModes = ['hybrid', 'local', 'global', 'naive'] as const
export type ChatMode = typeof chatModes[number]

export const getChatModeDescription = (mode: ChatMode): string => {
  switch (mode) {
    case 'hybrid':
      return 'Combines local and global knowledge for comprehensive answers'
    case 'local':
      return 'Uses local knowledge base for specific information'
    case 'global':
      return 'Uses global knowledge for broader context'
    case 'naive':
      return 'Simple retrieval without advanced processing'
    default:
      return 'Unknown mode'
  }
}

export const formatChatResponse = (response: ChatResponse): {
  content: string
  metadata: {
    mode: string
    conversationId?: string
    timestamp: string
  }
} => {
  return {
    content: response.answer,
    metadata: {
      mode: response.mode,
      conversationId: response.conversation_id,
      timestamp: new Date().toISOString()
    }
  }
}

export const isDevelopment = process.env.NODE_ENV === 'development'

export const debugLog = (message: string, data?: any): void => {
  if (isDevelopment) {
    console.log(`[YourAI Debug] ${message}`, data)
  }
}

export const performanceLog = (operation: string, startTime: number): void => {
  if (isDevelopment) {
    const endTime = performance.now()
    const duration = endTime - startTime
    console.log(`[YourAI Performance] ${operation}: ${duration.toFixed(2)}ms`)
  }
}

export const useApiWithLogging = () => {
  const wrappedApiClient = { ...apiClient }

  Object.keys(apiClient).forEach(key => {
    const originalMethod = (apiClient as any)[key]
    if (typeof originalMethod === 'function') {
      (wrappedApiClient as any)[key] = async (...args: any[]) => {
        const startTime = performance.now()
        debugLog(`API call: ${key}`, args)

        try {
          const result = await originalMethod.apply(apiClient, args)
          performanceLog(`API ${key}`, startTime)
          return result
        } catch (error) {
          performanceLog(`API ${key} (error)`, startTime)
          debugLog(`API error: ${key}`, error)
          throw error
        }
      }
    }
  })

  return wrappedApiClient
}