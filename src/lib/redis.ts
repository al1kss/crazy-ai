import { Redis } from '@upstash/redis'

class RedisManager {
  private redis: Redis

  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  }

  async set(key: string, value: any, ttlSeconds: number = 3600): Promise<boolean> {
    try {
      await this.redis.setex(key, ttlSeconds, JSON.stringify(value))
      return true
    } catch (error) {
      console.error('Redis set error:', error)
      return false
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const result = await this.redis.get(key)
      return result ? JSON.parse(result as string) : null
    } catch (error) {
      console.error('Redis get error:', error)
      return null
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      await this.redis.del(key)
      return true
    } catch (error) {
      console.error('Redis delete error:', error)
      return false
    }
  }

  async checkRateLimit(key: string, limit: number, windowSeconds: number): Promise<{ allowed: boolean; remaining: number }> {
    try {
      const current = await this.redis.incr(key)
      if (current === 1) {
        await this.redis.expire(key, windowSeconds)
      }
      return {
        allowed: current <= limit,
        remaining: Math.max(0, limit - current)
      }
    } catch (error) {
      console.error('Rate limit check failed:', error)
      return { allowed: true, remaining: limit }
    }
  }
}

export const redis = new RedisManager()