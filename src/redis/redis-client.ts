import Redis, { RedisOptions } from 'ioredis';
import { CacheClientInterface } from '../interfaces/cache-client.interface';
import { LoggerInterface } from '../common/logger';

export interface RedisCacheClientOptions extends RedisOptions {
  logger?: LoggerInterface;
}

export class RedisCacheClient implements CacheClientInterface {
  private client: Redis;
  private logger: LoggerInterface;

  constructor(options?: RedisCacheClientOptions) {
    const { logger, ...redisOptions } = options || {};
    this.client = new Redis(redisOptions);

    // Default to console if no logger provided, or use a no-op implementation
    this.logger = logger || console;

    this.client.on('error', (err) => {
      this.logger.error('Redis Client Error:', err);
    });

    this.client.on('connect', () => {
      this.logger.info('Redis Client Connected');
    });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      this.logger.error(`Error getting key ${key} from Redis:`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      if (ttl) {
        await this.client.set(key, serializedValue, 'EX', ttl);
      } else {
        await this.client.set(key, serializedValue);
      }
    } catch (error) {
      this.logger.error(`Error setting key ${key} in Redis:`, error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      this.logger.error(`Error deleting key ${key} from Redis:`, error);
    }
  }

  async delPattern(pattern: string): Promise<void> {
    try {
      const stream = this.client.scanStream({
        match: pattern,
      });

      stream.on('data', (keys: string[]) => {
        if (keys.length) {
          const pipeline = this.client.pipeline();
          keys.forEach((key) => {
            pipeline.del(key);
          });
          pipeline.exec();
        }
      });

      stream.on('end', () => {
        // Scan complete
      });
    } catch (error) {
      this.logger.error(`Error deleting pattern ${pattern} from Redis:`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      await this.client.flushall();
    } catch (error) {
      this.logger.error('Error clearing Redis cache:', error);
    }
  }

  async disconnect(): Promise<void> {
    await this.client.quit();
  }
}
