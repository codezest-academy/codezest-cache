# @codezest-academy/cache

A robust, type-safe, and production-ready caching library for the CodeZest microservices ecosystem. Built on top of `ioredis`, it provides a unified interface for caching operations with built-in serialization, error handling, and resilience.

## 🚀 Features

- **Type-Safe**: Generic `get<T>` and `set<T>` methods ensure type safety across your application.
- **Resilient**: Graceful error handling ensures that cache failures do not crash your main application.
- **Standardized**: Implements a common `ICacheClient` interface, allowing for easy mocking and future backend swaps.
- **Developer Friendly**: Simple factory pattern for quick initialization.

## 📦 Installation

```bash
npm install @codezest-academy/cache
```

## ⚙️ Local Development Setup

For local development, we recommend using Docker Compose to run a Redis instance. This ensures a consistent environment across all developer machines.

Please refer to the [Local Docker Compose Setup Guide](.context/DOCKER_COMPOSE_LOCAL_SETUP.md) for detailed instructions on how to set up and manage Redis using Docker Compose.

## 🛠️ Usage

### 1. Initialization

Create a single instance of the cache client and export it for use across your service. You can optionally inject a logger (e.g., Winston, Pino) that matches the `LoggerInterface`.

```typescript
// src/lib/cache.ts
import { createCacheClient } from "@codezest-academy/cache";
import logger from "./logger"; // Your custom logger

const cache = createCacheClient({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD,
  logger: logger, // Optional: Inject your logger here
});

export default cache;
```

### 2. Basic Operations

```typescript
import cache from "./lib/cache";

interface UserProfile {
  id: string;
  name: string;
  role: "USER" | "ADMIN";
}

async function getUser(userId: string): Promise<UserProfile | null> {
  const cacheKey = `user:${userId}`;

  // 1. Try to get from cache
  const cachedUser = await cache.get<UserProfile>(cacheKey);
  if (cachedUser) {
    return cachedUser;
  }

  // 2. If not in cache, fetch from DB
  const user = await db.user.findUnique({ where: { id: userId } });

  // 3. Store in cache (TTL: 1 hour)
  if (user) {
    await cache.set(cacheKey, user, 3600);
  }

  return user;
}
```

### 3. Advanced Operations

```typescript
// Delete a specific key
await cache.del("user:123");

// Delete all keys matching a pattern (Use with caution!)
await cache.delPattern("user:*");

// Clear the entire cache (Use with extreme caution!)
await cache.clear();
```

## 📐 Design Principles

This library follows **SOLID** principles to ensure maintainability and scalability:

- **Single Responsibility**: The `RedisCacheClient` focuses solely on Redis operations. Serialization and connection management are encapsulated.
- **Open/Closed**: The `ICacheClient` interface allows for new cache implementations (e.g., Memcached, In-Memory) without modifying consuming code.
- **Liskov Substitution**: Any implementation of `ICacheClient` can be used interchangeably.
- **Interface Segregation**: The interface exposes only necessary methods, keeping the API surface clean.
- **Dependency Inversion**: High-level modules depend on the `ICacheClient` abstraction, not the concrete `RedisCacheClient`.

## 🧪 Testing

This library uses `ioredis-mock` for unit testing, ensuring that tests are fast and reliable without requiring a running Redis instance.

```bash
npm test
```
