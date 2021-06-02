# ts-express-redis-template

Template for the Express server with Redis integration written in TypeScript

## Usage

1. Install dependencies and copy `.env.example` into `.env.local`
```
npm install

cp .env.example .env.local
```

2. Configure server (see [Server configuration](#server-configuration))

3. Run `npm run dev`

## File structure

- `__tests__`: contains service tests
- `.husky`: git hooks
- `.root`: root user credentials (git ignored)
- `dist`: JavaScript build (git ignored)
- `ext`: component that manages communication with external services
- `lib`: service-wide utility functions and types
- `logger`: logging component
- `redis`:
  * cache: Redis cache handlers (volatile data with LRU eviction strategy)
  * store: Redis store handlers (non-volatile data)
- `routes`: endpoint controllers
- `server`: server configuration and boot function
- `.dockerignore`: Docker ignore file (same as `.gitignore`)
- `.env`: production mode environment variables, used with `docker-compose` (git ignored)
- `.env.example`: example `.env` file
- `.env.local`: development environment variables (git ignored)
- `.env.test`: environment variables for testing (git ignored)
- `.eslintignore`: list of directories ignored by ESLint
- `.eslintrc.js`: ESLint configuration file
- `.gitignore`: Git ignore file
- `Dockerfile`: Docker build configuration
- `index.ts`: Server entry file
- `jest.config.js`: Jest configuration file
- `LICENSE`: license file
- `README.md`: service description
- `tsconfig.json`: TypeScript compiler configuration

## Server configuration

### Service configuration

- `SERVICE_NICKNAME`: nickname of the service, used as `spid` (service public ID) in communication with other services. Has to be **unique** among microservices infrastructure.
- `HOST`: service IP or domain address. To be used in JWT or HTTP headers.
- `PORT`: server port
- `ORIGIN`: list of origins allowed to communicate with the service
- `USE_CREDENTIALS`: indicates whether service will parse/send cookies
- `ALLOWED_METHODS`: list of allowed methods
- `ALLOWED_HEADERS`: allowed headers
- `CORS_DEBUG_LOG`: logs CORS debug configuration
- `RL_WINDOW`: rate limiter request window in milliseconds
- `RL_MAX`: max number of requests allowed for IP in the window
- `GENERATE_ROOT_USER`: indicates whether or not root user for the service will be generated. Note: you won't be able to add other services without root user

### Redis configuration

- `REDIS_STORE_CONNECTION_URL`: connection string for Redis store (non-volatile)
- `REDIS_STORE_PREFIX`: key prefix to be used by the store
- `REDIS_CACHE_CONNECTION_URL`: connection string for Redis cache (volatile)
- `REDIS_CACHE_PREFIX`: key prefix to be used by the cache

### External services configuration

- `EXT_TOKEN_TTL_SEC`: time generated tokens will be valid. For security reasons this time should not be more than hour (3600 seconds)
- `<EXTERNAL_SERVICE_NICKNAME>_BASEURL`: base url for the external service API
- `<EXTERNAL_SERVICE_NICKNAME>_KEY`: secret key for the external service