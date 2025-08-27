# # --- Next.js (SSR) com pnpm ---
# FROM node:20-alpine

# WORKDIR /app

# # pnpm + deps
# COPY package.json pnpm-lock.yaml ./
# # use corepack para garantir a versão do pnpm
# RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
# RUN pnpm install --frozen-lockfile

# # código e build
# COPY . .
# RUN pnpm build

# # runtime
# ENV NODE_ENV=production
# # Render injeta PORT, mas definir padrão ajuda localmente
# ENV PORT=3000
# # importante para escutar na interface certa
# ENV HOSTNAME=0.0.0.0

# EXPOSE 3000
# CMD ["pnpm", "start"]  # start -> next start (usa PORT/HOSTNAME)

# syntax=docker/dockerfile:1

### 1) Dependências
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate \
  && pnpm install --frozen-lockfile

### 2) Build
FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate \
  && pnpm build

### 3) Runner (imagem final enxuta)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Saída standalone do Next
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
