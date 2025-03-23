# Reversi

A Reversi game built with Next.js and WebSocket.

### Running the Project

To start the app and server in development mode:

```
npm run docker                   # start with docker compose
npm run docker:dev               # alternative command
```

To start the app and server in production mode:

```
npm run docker:prod              # start with docker compose
```

## WebSocket Server on an API endpoint

This project uses Next.js 13+ (app router), which is designed for **serverless environments**
and does not natively support a WebSocket server.

A workaround is available using the **legacy pages API** to host the server within an API route [(see here)](/src/pages/api/ws.ts).

**Note**: This approach only works **if not deployed in a serverless environment** (e.g. Vercel, AWS Lambda). If
deploying on a serverless provider, use the [Standalone WebSocket Server](#websocket-server-standalone) instead.

To start the app in development mode with the websocket server running through Next.js

```
npm run dev:local                # start with socket server running through next.js
```

## WebSocket Server (Standalone)

Next.js is not intended to run as a backend. A standalone server is available when building with `STANDALONE_SERVER=true`.

To start the app and standalone server in development mode:

```
npm run docker:dev               # preconfigured

# through docker compose
STANDALONE_SERVER=true docker compose -f docker/docker-compose.dev.yml --profile standalone up
```
