# ---- Build stage ----
FROM node:20-slim AS build
WORKDIR /app

# Copy package files first for caching
COPY package.json package-lock.json ./

# Install dependencies exactly as lockfile specifies
RUN npm ci --no-audit --no-fund

# Copy source code
COPY . .

# Build the Vite app
RUN npm run build


# ---- Run stage ----
FROM node:20-slim
WORKDIR /app

# Copy runtime output + server
COPY --from=build /app/dist ./dist
COPY --from=build /app/server.mjs ./server.mjs
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/package-lock.json ./package-lock.json

# Install only production dependencies
RUN npm ci --omit=dev --no-audit --no-fund

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080
CMD ["node", "server.mjs"]
