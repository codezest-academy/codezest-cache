# Implementation Plan - codezest-cache

## Goal

Create a production-ready, shared caching library (`@codezest-academy/cache`) backed by Redis. This library will be consumed by other microservices (`auth`, `api`, etc.) to handle caching operations with a unified interface and consistent error handling.

## User Review Required

> [!IMPORTANT]
> This library assumes a Redis environment is available. The default configuration will expect `REDIS_URL` or standard Redis connection params.

## Proposed Changes

### Project Configuration

#### [NEW] [package.json](file:///Volumes/CVS%20Sandisk%201TB%20SkyBlue/Quiz/codezest-cache/package.json)

- Define package name: `@codezest-academy/cache`
- Main entry point: `dist/index.js`
- Types: `dist/index.d.ts`
- Scripts: `build`, `test`, `lint`

#### [NEW] [tsconfig.json](file:///Volumes/CVS%20Sandisk%201TB%20SkyBlue/Quiz/codezest-cache/tsconfig.json)

- Strict type checking
- Declaration file generation

### Source Code (`src/`)

#### [NEW] [src/interfaces/ICacheClient.ts](file:///Volumes/CVS%20Sandisk%201TB%20SkyBlue/Quiz/codezest-cache/src/interfaces/ICacheClient.ts)

- Defines the contract for cache operations:
  - `get<T>(key: string): Promise<T | null>`
  - `set<T>(key: string, value: T, ttl?: number): Promise<void>`
  - `del(key: string): Promise<void>`
  - `delPattern(pattern: string): Promise<void>`
  - `clear(): Promise<void>`

#### [NEW] [src/redis/RedisClient.ts](file:///Volumes/CVS%20Sandisk%201TB%20SkyBlue/Quiz/codezest-cache/src/redis/RedisClient.ts)

- Implementation of `ICacheClient` using `ioredis`.
- Handles connection events (connect, error, close).
- Implements automatic serialization (JSON) and deserialization.
- Robust error handling (try/catch wrappers to prevent crashing the app on cache failure).

#### [NEW] [src/index.ts](file:///Volumes/CVS%20Sandisk%201TB%20SkyBlue/Quiz/codezest-cache/src/index.ts)

- Exports `RedisCacheClient`, `ICacheClient`, and a factory function `createCacheClient`.

### Testing

#### [NEW] [tests/RedisClient.test.ts](file:///Volumes/CVS%20Sandisk%201TB%20SkyBlue/Quiz/codezest-cache/tests/RedisClient.test.ts)

- Unit tests using `ioredis-mock` to verify get, set, del, and TTL logic.

## Refactoring Plan (Naming Conventions)

> [!NOTE]
> Based on updated `ARCHITECTURE_DESIGN.md`, we need to align file and interface naming.

### Changes

#### [RENAME] `src/interfaces/ICacheClient.ts` -> `src/interfaces/cache-client.interface.ts`

- Rename interface `ICacheClient` to `CacheClientInterface`.

#### [RENAME] `src/redis/RedisClient.ts` -> `src/redis/redis-client.ts`

- Update imports to use `CacheClientInterface`.

#### [MODIFY] `src/index.ts`

- Update exports to match new file names and interface names.

## Verification Plan

### Automated Tests

- Run `npm test` to execute Jest tests with `ioredis-mock`.
- Verify 100% pass rate for core operations.

### Manual Verification

- Create a small script `scripts/test-connection.ts` to connect to a real local Redis instance (if available) and perform basic operations.
