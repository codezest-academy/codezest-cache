import { createCacheClient } from "../src/index";
import Redis from "ioredis-mock";

// Mock ioredis
jest.mock("ioredis", () => require("ioredis-mock"));

// Mock logger
const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};

describe("RedisCacheClient", () => {
  const cache = createCacheClient({ logger: mockLogger });

  beforeEach(async () => {
    await cache.clear();
  });

  afterAll(async () => {
    await cache.disconnect();
  });

  it("should set and get a value", async () => {
    const key = "test-key";
    const value = { foo: "bar" };

    await cache.set(key, value);
    const result = await cache.get(key);

    expect(result).toEqual(value);
  });

  it("should return null for non-existent key", async () => {
    const result = await cache.get("non-existent");
    expect(result).toBeNull();
  });

  it("should set a value with TTL", async () => {
    const key = "ttl-key";
    const value = "ttl-value";
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

  it("should delete a key", async () => {
    const key = "del-key";
    await cache.set(key, "value");
    await cache.del(key);
    const result = await cache.get(key);
    expect(result).toBeNull();
  });

  it("should clear all keys", async () => {
    await cache.set("key1", "value1");
    await cache.set("key2", "value2");

    await cache.clear();

    const result1 = await cache.get("key1");
    const result2 = await cache.get("key2");

    expect(result1).toBeNull();
    expect(result2).toBeNull();
  });
});
