# Redis Setup Guide

This guide explains how to set up and run Redis for the CodeZest microservices ecosystem in both development and production environments.

## 1. Development Environment

For local development, we recommend using **Docker** to ensure consistency across all developer machines.

### Option A: Docker (Recommended)

Run the following command to start a Redis instance:

```bash
docker run --name codezest-redis -p 6379:6379 -d redis:alpine
```

- **Host**: `localhost`
- **Port**: `6379`
- **Password**: (None by default)

To stop it:

```bash
docker stop codezest-redis
```

### Option B: Docker Compose (Best for Microservices)

If you are running the entire CodeZest stack locally, add a `redis` service to your `docker-compose.yml`:

```yaml
version: "3.8"
services:
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  redis_data:
```

### Option C: Native Installation (macOS)

If you prefer running it natively on your Mac:

```bash
brew install redis
brew services start redis
```

---

## 2. Production Environment

For production, **DO NOT** self-host Redis on the same server as your application unless you are very experienced with Redis persistence and security. We strongly recommend using a **Managed Redis Service**.

### Option A: Managed Redis (Recommended)

Managed services handle backups, scaling, and high availability for you.

1.  **Upstash (Serverless)**: Great for starting out. Free tier available.
    - [Upstash Redis](https://upstash.com/)
2.  **AWS ElastiCache**: If you are hosting on AWS.
3.  **Redis Cloud**: Official managed service by Redis.
4.  **DigitalOcean Managed Redis**: Simple and cost-effective.

### Option B: Self-Hosted Docker (Valid for Production)

**Yes, you can use Docker in production.** Many companies do this to save costs or keep infrastructure unified. However, you must handle **Persistence**, **Security**, and **Reliability** yourself.

#### 1. Production `docker-compose.yml`

Use a dedicated compose file for your production Redis:

```yaml
version: "3.8"
services:
  redis:
    image: redis:7-alpine
    container_name: codezest-redis-prod
    restart: always
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD} --maxmemory 512mb --maxmemory-policy allkeys-lru
    ports:
      - "127.0.0.1:6379:6379" # Bind to localhost ONLY
    volumes:
      - ./redis_data:/data
    environment:
      - REDIS_PASSWORD=${REDIS_PASSWORD}
    deploy:
      resources:
        limits:
          cpus: "0.50"
          memory: 1G
```

#### 2. Critical Production Settings

1.  **Persistence (`--appendonly yes`)**:

    - Ensures data is saved to disk (`appendonly.aof`).
    - Without this, a container restart wipes your cache.
    - **Volume Mapping**: You MUST map `/data` to a host directory (e.g., `./redis_data`) so data survives container recreation.

2.  **Security**:

    - **Bind to Localhost (`127.0.0.1:6379:6379`)**: Never expose port 6379 to `0.0.0.0` unless you have a strict firewall (UFW/AWS Security Groups).
    - **Password (`--requirepass`)**: Mandatory. Use a long, random string.
    - **Rename Dangerous Commands**: In `redis.conf`, disable commands like `FLUSHALL` or `CONFIG` to prevent accidents.

3.  **Resource Limits**:
    - Set `--maxmemory` to prevent Redis from consuming all server RAM and crashing the OS.
    - Set `--maxmemory-policy allkeys-lru` to evict old keys when full.

#### 3. Trade-offs vs. Managed Services

| Feature               | Managed (Upstash/AWS)  | Self-Hosted Docker                                  |
| :-------------------- | :--------------------- | :-------------------------------------------------- |
| **Setup**             | Instant                | Manual config required                              |
| **Backups**           | Automated              | You must script cron jobs                           |
| **Scaling**           | One-click / Auto       | Manual migration / clustering                       |
| **High Availability** | Multi-zone replication | Single point of failure (unless you setup Sentinel) |
| **Cost**              | $$ (Pay per use/hour)  | $ (Free on existing VPS)                            |

**Verdict**: Use Docker if you are cost-sensitive and comfortable managing Linux servers. Use Managed if you want "set and forget" peace of mind.

---

## 3. Configuration

Once your Redis server is running, configure your microservices using environment variables.

### .env File

```bash
# Local Development
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Production (Example)
REDIS_HOST=global-redis.upstash.io
REDIS_PORT=34567
REDIS_PASSWORD=your_complex_password_here
```

### Usage in Code

The `@codezest-academy/cache` library automatically reads these values if you pass them during initialization:

```typescript
import { createCacheClient } from "@codezest-academy/cache";

const cache = createCacheClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
});
```
