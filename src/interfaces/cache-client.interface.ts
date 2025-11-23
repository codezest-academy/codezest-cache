export interface CacheClientInterface {
  /**
   * Retrieve a value from the cache.
   * @param key The cache key.
   * @returns The cached value or null if not found.
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Store a value in the cache.
   * @param key The cache key.
   * @param value The value to store.
   * @param ttl Optional time-to-live in seconds.
   */
  set<T>(key: string, value: T, ttl?: number): Promise<void>;

  /**
   * Delete a value from the cache.
   * @param key The cache key.
   */
  del(key: string): Promise<void>;

  /**
   * Delete all keys matching a pattern.
   * @param pattern The pattern to match (e.g., "user:*").
   * @returns The number of keys deleted.
   */
  delPattern(pattern: string): Promise<number>;

  /**
   * Clear the entire cache.
   */
  clear(): Promise<void>;

  /**
   * Close the cache connection.
   */
  disconnect(): Promise<void>;
}
