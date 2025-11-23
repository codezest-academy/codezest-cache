import { createCacheClient } from '../src/index';
import Redis from 'ioredis-mock';

// Mock ioredis
jest.mock('ioredis', () => require('ioredis-mock'));

// Mock logger
const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};

describe('RedisCacheClient', () => {
  const cache = createCacheClient({ logger: mockLogger });

  beforeEach(async () => {
    await cache.clear();
  });

  afterAll(async () => {
    await cache.disconnect();
  });

  it('should set and get a value', async () => {
    const key = 'test-key';
    const value = { foo: 'bar' };

    await cache.set(key, value);
    const result = await cache.get(key);

    expect(result).toEqual(value);
  });

  it('should return null for non-existent key', async () => {
    const result = await cache.get('non-existent');
    expect(result).toBeNull();
  });

  it('should set a value with TTL', async () => {
    const key = 'ttl-key';
    const value = 'ttl-value';
    const ttl = 1; // 1 second

    await cache.set(key, value, ttl);

    // Immediate check
    const immediateResult = await cache.get(key);
    expect(immediateResult).toEqual(value);

    // Wait for TTL to expire
    await new Promise((resolve) => setTimeout(resolve, 1100));

    const expiredResult = await cache.get(key);
    expect(expiredResult).toBeNull();
  });

  it('should delete a key', async () => {
    const key = 'del-key';
    await cache.set(key, 'value');
    await cache.del(key);
    const result = await cache.get(key);
    expect(result).toBeNull();
  });

  it('should clear all keys', async () => {
    await cache.set('key1', 'value1');
    await cache.set('key2', 'value2');

    await cache.clear();

    const result1 = await cache.get('key1');
    const result2 = await cache.get('key2');

    expect(result1).toBeNull();
    expect(result2).toBeNull();
  });

  describe('delPattern', () => {
    it('should delete keys matching pattern', async () => {
      await cache.set('user:1', { id: 1 });
      await cache.set('user:2', { id: 2 });
      await cache.set('post:1', { id: 1 });

      const deletedCount = await cache.delPattern('user:*');

      expect(deletedCount).toBe(2);
      expect(await cache.get('user:1')).toBeNull();
      expect(await cache.get('user:2')).toBeNull();
      expect(await cache.get('post:1')).toEqual({ id: 1 });
    });

    it('should return 0 when no keys match pattern', async () => {
      await cache.set('user:1', { id: 1 });

      const deletedCount = await cache.delPattern('nonexistent:*');

      expect(deletedCount).toBe(0);
      expect(await cache.get('user:1')).toEqual({ id: 1 });
    });

    it('should handle empty cache', async () => {
      const deletedCount = await cache.delPattern('any:*');
      expect(deletedCount).toBe(0);
    });

    it('should delete all keys with wildcard pattern', async () => {
      await cache.set('key1', 'value1');
      await cache.set('key2', 'value2');
      await cache.set('key3', 'value3');

      const deletedCount = await cache.delPattern('*');

      expect(deletedCount).toBe(3);
      expect(await cache.get('key1')).toBeNull();
      expect(await cache.get('key2')).toBeNull();
      expect(await cache.get('key3')).toBeNull();
    });

    it('should handle complex patterns', async () => {
      await cache.set('user:123:profile', { name: 'John' });
      await cache.set('user:123:settings', { theme: 'dark' });
      await cache.set('user:456:profile', { name: 'Jane' });
      await cache.set('post:789', { title: 'Hello' });

      const deletedCount = await cache.delPattern('user:123:*');

      expect(deletedCount).toBe(2);
      expect(await cache.get('user:123:profile')).toBeNull();
      expect(await cache.get('user:123:settings')).toBeNull();
      expect(await cache.get('user:456:profile')).toEqual({ name: 'Jane' });
      expect(await cache.get('post:789')).toEqual({ title: 'Hello' });
    });

    it('should handle many keys in batches', async () => {
      // Create 50 keys to test batch processing
      // Note: ioredis-mock has limitations with scanStream
      const promises = [];
      for (let i = 0; i < 50; i++) {
        promises.push(cache.set(`batch:${i}`, { id: i }));
      }
      await Promise.all(promises);

      const deletedCount = await cache.delPattern('batch:*');

      // Verify all keys were deleted
      expect(deletedCount).toBe(50);
      expect(await cache.get('batch:0')).toBeNull();
      expect(await cache.get('batch:25')).toBeNull();
      expect(await cache.get('batch:49')).toBeNull();
    });
  });
});
