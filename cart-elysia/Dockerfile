FROM oven/bun:1 AS base
WORKDIR /app

# Copy package files
COPY package.json bun.lock ./
COPY prisma ./prisma

# Install dependencies & generate client
RUN bun install --frozen-lockfile
RUN bun x prisma generate

# Copy source code
COPY . .

# Expose port internal
EXPOSE 3000

# Start app
CMD ["bun", "src/index.ts"]