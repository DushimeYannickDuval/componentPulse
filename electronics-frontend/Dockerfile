# syntax=docker/dockerfile:1

# -------- Deps stage --------
FROM node:20-alpine AS deps
ENV NODE_ENV=development \
    NEXT_TELEMETRY_DISABLED=1
WORKDIR /app
COPY package*.json ./
RUN npm ci

# -------- Builder stage --------
FROM node:20-alpine AS builder
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1
# Accept backend API URL at build time for Next.js public env
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build with standalone output (configured in next.config.mjs)
RUN npm run build

# -------- Runner stage --------
FROM node:20-alpine AS runner
ARG NEXT_PUBLIC_API_URL
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

WORKDIR /app
# Copy standalone server and static assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
# Start the Next.js server
CMD ["node", "server.js"]
