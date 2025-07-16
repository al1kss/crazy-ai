const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://al1kss-safetyai.hf.space'

export interface ApiResponse<T> {
  data?: T
  error?: string
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
  description: string
  created_at: string
  files_count: number
  persistent_storage: boolean
  lightrag_python: boolean
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
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`)
    }
    return response.json()
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return this.handleResponse<T>(response)
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse<T>(response)
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse<T>(response)
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

  // authentication
  async register(email: string, name: string): Promise<{ user: User; token: string; message: string }> {
    return this.post('/auth/register', { email, name })
  }

  async login(email: string): Promise<{ user: User; token: string; message: string }> {
    return this.post('/auth/login', { email })
  }

  async chatFireSafety(
    question: string,
    mode: string = 'hybrid',
    conversationId?: string | null
  ): Promise<ChatResponse> {
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
  ): Promise<ChatResponse> {
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
  ): Promise<ChatResponse> {
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
  if (error.message) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return 'An unexpected error occurred'
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


export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const health = await apiClient.getHealth()
    return health.status === 'healthy'
  } catch (error) {
    console.error('API health check failed:', error)
    return false
  }
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