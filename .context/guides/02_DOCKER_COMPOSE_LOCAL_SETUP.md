# Local Docker Compose Setup for Redis

This guide explains how to use the `docker-compose.yml` file to set up and run a Redis instance locally for development.

## 1. Start the Redis Service

Navigate to the root directory of your project where the `docker-compose.yml` file is located.

**Before starting, ensure you set the `REDIS_PASSWORD` environment variable in your shell:**

```bash
export REDIS_PASSWORD="your_strong_random_password_here"
```
(Replace `"your_strong_random_password_here"` with a strong, unique password.)

Then, run the following command to start the Redis container in detached mode (runs in the background):

```bash
docker compose up -d
```

## 2. Verify the Service is Running

You can check the status of your running Docker containers with:

```bash
docker compose ps
```

## 3. Connect Your Application to Redis

Your application can connect to the Redis instance using the following configuration:

*   **Host**: `localhost`
*   **Port**: `6379`
*   **Password**: The password you set in the `REDIS_PASSWORD` environment variable.

You should configure your application's environment variables (e.g., in a `.env` file) accordingly:

```bash
# Local Development
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD="your_strong_random_password_here"
```

Then, in your code, you can initialize the cache client as shown in the main `README.md` and `REDIS_GUIDE.md`:

```typescript
import { createCacheClient } from "@codezest-academy/cache";

const cache = createCacheClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD, // Now explicitly using the password
});
```

## 4. Stop the Redis Service

When you are finished with your development session, you can stop and remove the Redis container, network, and any associated volumes defined in the `docker-compose.yml` file with:

```bash
docker compose down
```

## 5. Test the Redis Service Locally

You can verify that your Redis container is running and accessible using the following methods:

### a. Verify Container Status

Check if the Docker container is active:

```bash
docker ps
```
You should see an entry for `codezest-cache-redis-1` with a status indicating it's `Up`.

### b. Connect using `redis-cli`

This is the most direct way to interact with Redis. Remember to replace `"your_strong_random_password_here"` with the actual password you set.

*   **If you have `redis-cli` installed locally:**
    ```bash
    redis-cli -h localhost -p 6379 -a "your_strong_random_password_here"
    ```
*   **If you don't have `redis-cli` installed locally (use the one inside the container):**
    ```bash
    docker exec -it codezest-cache-redis-1 redis-cli -a "your_strong_random_password_here"
    ```

Once connected, you can try some basic Redis commands:

*   **Ping the server:**
    ```
    PING
    ```
    (Should respond with `PONG`)

*   **Set and get a key:**
    ```
    SET mykey "Hello Redis"
    GET mykey
    ```
    (Should respond with `"Hello Redis"`)

To exit the `redis-cli` session, type `QUIT` or press `CTRL + C`.
