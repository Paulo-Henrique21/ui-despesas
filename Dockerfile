# --- Next.js (SSR) com pnpm ---
FROM node:20-alpine

WORKDIR /app

# pnpm + deps
COPY package.json pnpm-lock.yaml ./
# use corepack para garantir a versão do pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
RUN pnpm install --frozen-lockfile

# código e build
COPY . .
RUN pnpm build

# runtime
ENV NODE_ENV=production
# Render injeta PORT, mas definir padrão ajuda localmente
ENV PORT=3000
# importante para escutar na interface certa
ENV HOSTNAME=0.0.0.0

EXPOSE 3000
CMD ["pnpm", "start"]  # start -> next start (usa PORT/HOSTNAME)
