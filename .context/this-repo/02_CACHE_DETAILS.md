# @codezest-academy/cache - Library Details

## 1. Overview

The `@codezest-academy/cache` library is a shared infrastructure component designed to provide a unified, robust, and type-safe caching mechanism for all CodeZest microservices. It abstracts the underlying caching technology (Redis) to ensure consistency and maintainability across the platform.

## 2. Architecture

### 2.1 Core Components

- **`ICacheClient` Interface**: Defines the contract for all cache operations. This ensures that the consuming services depend on an abstraction rather than a concrete implementation, adhering to the Dependency Inversion Principle.
- **`RedisCacheClient`**: The concrete implementation using `ioredis`. It handles connection management, error resilience, and data serialization.
- **Factory Pattern**: A `createCacheClient` factory function is exposed to simplify instantiation and configuration.

### 2.2 Design Principles (SOLID)

- **Single Responsibility**: The client focuses solely on cache operations.
- **Open/Closed**: New cache backends (e.g., Memcached) can be added by implementing `ICacheClient` without modifying existing code.
- **Liskov Substitution**: The interface ensures that any implementation can be swapped without breaking the application.

## 3. Key Features

### 🛡️ Type Safety

The library uses TypeScript generics to ensure that data retrieved from the cache is typed correctly.

```typescript
const user = await cache.get<User>("user:123"); // user is typed as User | null
```

### 💾 Automatic Serialization

Objects are automatically serialized to JSON strings when stored and parsed back to objects when retrieved. This removes the need for manual `JSON.stringify` and `JSON.parse` in your business logic.

### ⚡ Resilience & Error Handling

- **Non-Blocking Errors**: If Redis goes down, the cache client logs the error but does **not** throw an exception that would crash your application. It simply returns `null` for gets or ignores sets, allowing your service to fall back to the database transparently.
- **Connection Events**: Logs connection status (connect, error) for observability.

## 4. Usage Guide

### Installation

```bash
npm install @codezest-academy/cache
```

### Configuration

The client accepts standard `RedisOptions` from `ioredis`.

```typescript
import { createCacheClient } from "@codezest-academy/cache";

const cache = createCacheClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
});
```

### API Reference

| Method       | Signature                                              | Description                                                    |
| ------------ | ------------------------------------------------------ | -------------------------------------------------------------- |
| `get<T>`     | `(key: string): Promise<T \| null>`                    | Retrieves and deserializes a value.                            |
| `set<T>`     | `(key: string, value: T, ttl?: number): Promise<void>` | Serializes and stores a value. Optional TTL in seconds.        |
| `del`        | `(key: string): Promise<void>`                         | Deletes a single key.                                          |
| `delPattern` | `(pattern: string): Promise<void>`                     | Deletes keys matching a pattern (uses `SCAN` for performance). |
| `clear`      | `(): Promise<void>`                                    | Flushes the entire cache (Use with caution).                   |
| `disconnect` | `(): Promise<void>`                                    | Closes the Redis connection.                                   |

## 5. Testing Strategy

- **Unit Tests**: Implemented using `ioredis-mock` to simulate Redis behavior without requiring a running instance.
- **Coverage**: Tests cover all core methods (`get`, `set`, `del`, `delPattern`, `clear`) and TTL expiration logic.

## 6. Maintenance

- **Dependencies**: Keep `ioredis` updated.
- **Extension**: To add a new method (e.g., `increment`), add it to `ICacheClient` first, then implement it in `RedisCacheClient`.
