# Multi-stage Dockerfile for Vite React app on Railway
# 1) Builder: install deps and build static assets
# 2) Runner: serve built assets on the PORT provided by Railway

# ---- Builder ----
FROM node:20-alpine AS builder

# Prevents production-only installs from pruning devDeps during build
ENV NODE_ENV=development

WORKDIR /app

# Install OS deps
RUN apk add --no-cache libc6-compat

# Copy lockfiles first for better caching
COPY package.json package-lock.json bun.lockb* ./

# Install dependencies
RUN if [ -f package-lock.json ]; then \
        npm ci; \
    else \
        npm install; \
    fi

# Copy the rest of the source
COPY . .

# Build the app (Vite)
RUN npm run build

# ---- Runner ----
FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

# Install a tiny static file server
RUN npm i -g serve@14.2.3

# Copy built assets from builder
COPY --from=builder /app/dist /app/dist

# Railway will inject PORT. We expose 8080 as a convention/hint.
EXPOSE 8080

# Start the static server, bind to 0.0.0.0 and use Railway's $PORT with fallback to 8080
CMD ["sh", "-c", "serve -s /app/dist -l tcp://0.0.0.0:${PORT:-8080}"]
