# --- Stage 1: Build ---
FROM oven/bun:1 AS builder
WORKDIR /app

# Copy config files
COPY package.json bun.lock ./
COPY prisma ./prisma

# Install dependencies & Generate Prisma Client
RUN bun install --frozen-lockfile
RUN bun x prisma generate

# Copy source code
COPY . .

# Compile to binary (Sesuai Docs Elysia)
# Kita mark 'prisma' sebagai external karena dia butuh native binary
RUN bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--target bun-linux-x64 \
	--outfile server \
	src/index.ts

# --- Stage 2: Production Runner (Distroless/Minimal) ---
# Kita pakai image base Ubuntu/Debian slim atau Bun agar library C++ untuk Prisma aman
# GCR Distroless mungkin terlalu minimalis untuk Prisma Engine tanpa konfigurasi rumit
FROM oven/bun:1-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy binary hasil compile
COPY --from=builder /app/server .
# Copy Prisma Client & Schema (PENTING: Prisma butuh ini saat runtime)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/lib/generated/prisma ./src/lib/generated/prisma

# Expose port
EXPOSE 3000

# Jalankan Binary
CMD ["./server"]
