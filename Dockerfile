# Dockerfile para o Frontend Next.js
FROM node:18-alpine

WORKDIR /app

# Copiar package.json e pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Instalar pnpm e dependências
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copiar o código fonte
COPY . .

# Build da aplicação
RUN pnpm build

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Definir permissões
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expor a porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["pnpm", "start"]
