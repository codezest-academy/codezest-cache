import { CacheClientInterface } from './interfaces/cache-client.interface';
import { RedisCacheClient, RedisCacheClientOptions } from './redis/redis-client';

export * from './interfaces/cache-client.interface';
export * from './interfaces/logger.interface';
export * from './redis/redis-client';

/**
 * Factory function to create a new cache client.
 * @param options Redis connection options and optional logger.
 * @returns An instance of CacheClientInterface.
 */
export function createCacheClient(options?: RedisCacheClientOptions): CacheClientInterface {
  return new RedisCacheClient(options);
}
