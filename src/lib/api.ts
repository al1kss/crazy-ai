const API_BASE_URL = 'https://al1kss-safetyai.hf.space'

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
}

export interface ChatResponse {
  answer: string
  mode: string
  status: string
}

class ApiClient {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token')
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    }
  }

  private getFileUploadHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token')
    return {
      ...(token && { 'Authorization': `Bearer ${token}` }),
    }
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async uploadFiles(files: File[]): Promise<any> {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })

    const response = await fetch(`${API_BASE_URL}/upload-files`, {
      method: 'POST',
      headers: this.getFileUploadHeaders(),
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // authentication
  async register(email: string, name: string): Promise<{ user: User; token: string; message: string }> {
    return this.post('/auth/register', { email, name })
  }

  async login(email: string): Promise<{ user: User; token: string; message: string }> {
    return this.post('/auth/login', { email })
  }

  // custom AI
  async createCustomAI(name: string, description: string): Promise<{ ai_id: string; message: string; ai_info: CustomAI }> {
    return this.post('/create-custom-ai', { name, description })
  }

  async getMyAIs(): Promise<{ ais: CustomAI[]; count: number }> {
    return this.get('/my-ais')
  }

  // chat
  async chatFireSafety(question: string, mode: string = 'hybrid'): Promise<ChatResponse> {
    return this.post('/chat/fire-safety', { question, mode })
  }

  async chatGeneral(question: string, mode: string = 'hybrid'): Promise<ChatResponse> {
    return this.post('/chat/general', { question, mode })
  }

  async chatCustomAI(aiId: string, question: string, mode: string = 'hybrid'): Promise<ChatResponse> {
    return this.post(`/chat/custom/${aiId}`, { question, mode })
  }

  // kept legaacy support for old endpoints
  async ask(question: string, mode: string = 'hybrid'): Promise<ChatResponse> {
    return this.post('/ask', { question, mode })
  }

  // system
  async getHealth(): Promise<any> {
    return this.get('/health')
  }

  async getModes(): Promise<any> {
    return this.get('/modes')
  }

  async getExamples(): Promise<any> {
    return this.get('/examples')
  }
}

export const apiClient = new ApiClient()
export default apiClient