import { PrismaClient } from '@prisma/client'
import { kv } from '@vercel/kv'
import { put, list, del } from '@vercel/blob'
import crypto from 'crypto'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export class UserService {
  static hashEmail(email: string): string {
    return crypto.createHash('md5').update(email).digest('hex').substring(0, 12)
  }

  static async createUser(email: string, name: string) {
    const hashedEmail = this.hashEmail(email)

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      throw new Error('User already exists')
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedEmail,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        subscriptionType: true
      }
    })

    await CacheService.set(`user:${user.id}`, user, 3600)

    return user
  }

  static async getUserByEmail(email: string) {
    const cachedUser = await CacheService.get<any>(`user:email:${email}`)
    if (cachedUser) return cachedUser

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        subscriptionType: true,
        hashedEmail: true
      }
    })

    if (user) {
      await CacheService.set(`user:email:${email}`, user, 3600)
      await CacheService.set(`user:${user.id}`, user, 3600)
    }

    return user
  }

  static async getUserById(id: string) {
    const cachedUser = await CacheService.get<any>(`user:${id}`)
    if (cachedUser) return cachedUser

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        customAis: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            chunksCount: true
          }
        },
        _count: {
          select: {
            conversations: true,
            customAis: { where: { isActive: true } }
          }
        }
      },
    })

    if (user) {
      await CacheService.set(`user:${id}`, user, 3600)
    }

    return user
  }

  static async updateUserLastSeen(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { updatedAt: new Date() }
    })

    await CacheService.del(`user:${userId}`)
  }
}

export class SessionService {
  static async createSession(userId: string, tokenHash: string, expiresAt: Date, userAgent?: string, ipAddress?: string) {
    const session = await prisma.userSession.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
        userAgent,
        ipAddress,
      },
    })

    await CacheService.set(`session:${tokenHash}`, { userId, expiresAt }, Math.floor((expiresAt.getTime() - Date.now()) / 1000))

    return session
  }

  static async getSession(tokenHash: string) {
    const cachedSession = await CacheService.get<any>(`session:${tokenHash}`)
    if (cachedSession) {
      if (new Date(cachedSession.expiresAt) > new Date()) {
        return { userId: cachedSession.userId, user: await UserService.getUserById(cachedSession.userId) }
      } else {
        await CacheService.del(`session:${tokenHash}`)
        return null
      }
    }

    const session = await prisma.userSession.findUnique({
      where: { tokenHash, isActive: true },
      include: { user: true },
    })

    if (session && session.expiresAt > new Date()) {
      await this.updateSessionUsage(tokenHash)
      return session
    }

    return null
  }

  static async updateSessionUsage(tokenHash: string) {
    await prisma.userSession.update({
      where: { tokenHash },
      data: { lastUsedAt: new Date() },
    })
  }

  static async invalidateSession(tokenHash: string) {
    await prisma.userSession.update({
      where: { tokenHash },
      data: { isActive: false }
    })

    await CacheService.del(`session:${tokenHash}`)
  }

  static async cleanupExpiredSessions() {
    const result = await prisma.userSession.updateMany({
      where: {
        expiresAt: { lt: new Date() },
        isActive: true
      },
      data: { isActive: false }
    })

    return result.count
  }
}

export class CustomAIService {
  static async createCustomAI(userId: string, name: string, description: string, knowledgeFiles: any[], blobUrls: string[] = []) {
    const customAI = await prisma.customAI.create({
      data: {
        userId,
        name,
        description,
        knowledgeFiles: knowledgeFiles,
        blobUrls: blobUrls,
        chunksCount: knowledgeFiles.length
      },
    })

    await CacheService.del(`user:${userId}`)
    await CacheService.del(`user:${userId}:ais`)

    return customAI
  }

  static async getUserAIs(userId: string) {
    const cachedAIs = await CacheService.get<any>(`user:${userId}:ais`)
    if (cachedAIs) return cachedAIs

    const ais = await prisma.customAI.findMany({
      where: { userId, isActive: true },
      select: {
        id: true,
        name: true,
        description: true,
        chunksCount: true,
        createdAt: true,
        updatedAt: true,
        ragInstance: {
          select: {
            id: true,
            status: true,
            totalChunks: true,
            totalTokens: true,
            fileCount: true,
            lastAccessedAt: true
          }
        },
        _count: {
          select: {
            conversations: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    })

    await CacheService.set(`user:${userId}:ais`, ais, 1800)

    return ais
  }

  static async getAIById(id: string, userId: string) {
    const ai = await prisma.customAI.findFirst({
      where: { id, userId, isActive: true },
      include: {
        ragInstance: {
          include: {
            knowledgeFiles: {
              where: { processingStatus: 'processed' },
              select: {
                filename: true,
                originalName: true,
                fileType: true,
                fileSize: true,
                processedAt: true,
                tokenCount: true
              }
            }
          }
        },
        _count: {
          select: {
            conversations: true
          }
        }
      }
    })

    return ai
  }

  static async deleteCustomAI(id: string, userId: string) {
    const result = await prisma.customAI.update({
      where: { id },
      data: { isActive: false },
    })

    await CacheService.del(`user:${userId}:ais`)
    await CacheService.del(`user:${userId}`)

    return result
  }
}

export class ConversationService {
  static async createConversation(userId: string, aiType: string, aiId?: string, title?: string) {
    const conversation = await prisma.conversation.create({
      data: {
        userId,
        aiType,
        aiId,
        title: title || `${aiType} conversation`,
      },
    })

    await CacheService.del(`user:${userId}:conversations`)

    return conversation
  }

  static async getUserConversations(userId: string) {
    const cachedConversations = await CacheService.get<any>(`user:${userId}:conversations`)
    if (cachedConversations) return cachedConversations

    const conversations = await prisma.conversation.findMany({
      where: { userId, isActive: true },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            content: true,
            role: true,
            createdAt: true
          }
        },
        customAI: {
          select: { name: true },
        },
        _count: {
          select: {
            messages: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: 50
    })

    // cache 15mins
    await CacheService.set(`user:${userId}:conversations`, conversations, 900)

    return conversations
  }

  static async getConversation(id: string, userId: string) {
    const conversation = await prisma.conversation.findFirst({
      where: { id, userId, isActive: true },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            role: true,
            content: true,
            createdAt: true,
            metadata: true
          }
        },
        customAI: {
          select: { name: true, description: true },
        },
      },
    })

    return conversation
  }

  static async addMessage(conversationId: string, role: 'user' | 'assistant', content: string, metadata?: any) {
    const message = await prisma.message.create({
      data: {
        conversationId,
        role,
        content,
        metadata: metadata || {},
      },
    })

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    })

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { userId: true }
    })

    if (conversation) {
      await CacheService.del(`user:${conversation.userId}:conversations`)
    }

    return message
  }

  static async updateConversationTitle(id: string, userId: string, title: string) {
    const conversation = await prisma.conversation.update({
      where: { id },
      data: { title },
    })

    await CacheService.del(`user:${userId}:conversations`)

    return conversation
  }

  static async deleteConversation(id: string, userId: string) {
    const result = await prisma.conversation.update({
      where: { id },
      data: { isActive: false }
    })

    await CacheService.del(`user:${userId}:conversations`)

    return result
  }
}

// NEW: RAG Service for LightRAG knowledge kinda handling
export class RAGService {
  static async createRAGInstance(
    aiType: string,
    userId: string | null,
    aiId: string | null,
    name: string,
    description: string | null,
    graphBlobUrl: string,
    vectorBlobUrl: string,
    configBlobUrl: string,
    metadata: {
      totalChunks: number;
      totalTokens: number;
      fileCount: number;
    }
  ) {
    const ragInstance = await prisma.rAGInstance.create({
      data: {
        userId,
        aiType,
        aiId,
        name,
        description,
        graphBlobUrl,
        vectorBlobUrl,
        configBlobUrl,
        totalChunks: metadata.totalChunks,
        totalTokens: metadata.totalTokens,
        fileCount: metadata.fileCount,
        status: 'active'
      }
    })

    // Update cache
    if (userId) {
      await CacheService.del(`user:${userId}:rag_instances`)
    }
    await CacheService.del(`rag_instances:${aiType}`)

    return ragInstance
  }

  static async getRAGInstance(aiType: string, userId?: string, aiId?: string) {
    const ragInstance = await prisma.rAGInstance.findFirst({
      where: {
        aiType,
        userId,
        aiId,
        status: 'active'
      },
      include: {
        knowledgeFiles: {
          where: { processingStatus: 'processed' },
          select: {
            filename: true,
            originalName: true,
            fileType: true,
            fileSize: true,
            processedAt: true,
            tokenCount: true
          }
        }
      }
    })

    if (ragInstance) {
      await prisma.rAGInstance.update({
        where: { id: ragInstance.id },
        data: { lastAccessedAt: new Date() }
      })
    }

    return ragInstance
  }

  static async updateRAGInstanceStatus(id: string, status: string, processingLog?: string) {
    return await prisma.rAGInstance.update({
      where: { id },
      data: {
        status,
        processingLog,
        updatedAt: new Date()
      }
    })
  }

  static async getUserRAGInstances(userId: string) {
    const cachedInstances = await CacheService.get<any>(`user:${userId}:rag_instances`)
    if (cachedInstances) return cachedInstances

    const instances = await prisma.rAGInstance.findMany({
      where: { userId, status: 'active' },
      include: {
        knowledgeFiles: {
          where: { processingStatus: 'processed' },
          select: {
            filename: true,
            originalName: true,
            fileType: true,
            fileSize: true,
            processedAt: true,
            tokenCount: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    await CacheService.set(`user:${userId}:rag_instances`, instances, 1800)

    return instances
  }

  static async deleteRAGInstance(id: string) {
    const ragInstance = await prisma.rAGInstance.findUnique({
      where: { id },
      select: { userId: true, graphBlobUrl: true, vectorBlobUrl: true, configBlobUrl: true }
    })

    if (ragInstance) {
      try {
        await del([ragInstance.graphBlobUrl, ragInstance.vectorBlobUrl, ragInstance.configBlobUrl])
      } catch (error) {
        console.error('Failed to delete blob files:', error)
      }

      await prisma.rAGInstance.update({
        where: { id },
        data: { status: 'deleted' }
      })

      if (ragInstance.userId) {
        await CacheService.del(`user:${ragInstance.userId}:rag_instances`)
      }
    }
  }
}


export class KnowledgeFileService {
  static async createKnowledgeFile(
    userId: string,
    ragInstanceId: string,
    filename: string,
    originalName: string,
    fileType: string,
    fileSize: number,
    blobUrl: string
  ) {
    const knowledgeFile = await prisma.knowledgeFile.create({
      data: {
        userId,
        ragInstanceId,
        filename,
        originalName,
        fileType,
        fileSize,
        blobUrl,
        processingStatus: 'pending'
      }
    })

    return knowledgeFile
  }

  static async updateKnowledgeFileStatus(
    id: string,
    status: 'processed' | 'error',
    extractedText?: string,
    tokenCount?: number
  ) {
    return await prisma.knowledgeFile.update({
      where: { id },
      data: {
        processingStatus: status,
        processedAt: status === 'processed' ? new Date() : undefined,
        extractedText,
        tokenCount: tokenCount || 0
      }
    })
  }

  static async getKnowledgeFiles(ragInstanceId: string) {
    return await prisma.knowledgeFile.findMany({
      where: { ragInstanceId },
      orderBy: { createdAt: 'desc' }
    })
  }

  static async getUserKnowledgeFiles(userId: string) {
    return await prisma.knowledgeFile.findMany({
      where: { userId },
      include: {
        ragInstance: {
          select: {
            name: true,
            aiType: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }
}

export class FileService {
  static async uploadFile(file: File, userId: string, aiId?: string): Promise<string> {
    const filename = `${userId}/${aiId || 'general'}/${Date.now()}-${file.name}`

    try {
      const blob = await put(filename, file, {
        access: 'public',
      })

      return blob.url
    } catch (error) {
      console.error('File upload failed:', error)
      throw new Error('File upload failed')
    }
  }

  static async uploadKnowledgeFile(fileContent: string, userId: string, aiId: string, filename: string): Promise<string> {
    const blobFilename = `${userId}/${aiId}/knowledge/${Date.now()}-${filename}`

    try {
      const blob = await put(blobFilename, fileContent, {
        access: 'public',
      })

      return blob.url
    } catch (error) {
      console.error('Knowledge file upload failed:', error)
      throw new Error('Knowledge file upload failed')
    }
  }

  static async deleteFile(filename: string): Promise<void> {
    try {
      await del(filename)
    } catch (error) {
      console.error('File deletion failed:', error)
    }
  }

  static async listUserFiles(userId: string, prefix?: string): Promise<any[]> {
    try {
      const { blobs } = await list({
        prefix: prefix ? `${userId}/${prefix}` : userId,
        limit: 100
      })

      return blobs
    } catch (error) {
      console.error('File listing failed:', error)
      return []
    }
  }
}

export class CacheService {
  static async set(key: string, value: any, ttlSeconds = 3600): Promise<boolean> {
    try {
      await kv.setex(key, ttlSeconds, JSON.stringify(value))
      return true
    } catch (error) {
      console.warn('Cache set failed:', error)
      return false
    }
  }

  static async get<T>(key: string): Promise<T | null> {
    try {
      const value = await kv.get(key);
      return value ? (typeof value === 'string' ? JSON.parse(value) as T : value as T) : null;
    } catch (error) {
      console.warn('Cache get failed:', error);
      return null;
    }
  }

  static async del(key: string): Promise<boolean> {
    try {
      await kv.del(key)
      return true
    } catch (error) {
      console.warn('Cache delete failed:', error)
      return false
    }
  }

  static async invalidateUserCache(userId: string): Promise<void> {
    const keys = [
      `user:${userId}`,
      `user:${userId}:ais`,
      `user:${userId}:conversations`,
      `user:${userId}:rag_instances`,
    ]

    for (const key of keys) {
      await this.del(key)
    }
  }

  static async checkRateLimit(key: string, limit: number, windowSeconds: number): Promise<{ allowed: boolean; remaining: number }> {
    try {
      const current = await kv.incr(key)
      if (current === 1) {
        await kv.expire(key, windowSeconds)
      }

      return {
        allowed: current <= limit,
        remaining: Math.max(0, limit - current)
      }
    } catch (error) {
      console.warn('Rate limit check failed:', error)
      return { allowed: true, remaining: limit }
    }
  }
}

export class StatsService {
  static async updateSystemStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalUsers, totalAIs, totalMessages] = await Promise.all([
      prisma.user.count({ where: { isActive: true } }),
      prisma.customAI.count({ where: { isActive: true } }),
      prisma.message.count(),
    ]);

    await prisma.systemStats.upsert({
      where: { date: today },
      update: { totalUsers, totalAIs, totalMessages },
      create: { totalUsers, totalAIs, totalMessages, date: today },
    });
  }

  static async getSystemStats() {
    return prisma.systemStats.findFirst({
      orderBy: { date: 'desc' }
    })
  }
}

export default prisma