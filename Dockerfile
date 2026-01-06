# ---- Build stage ----
FROM node:20-slim AS build
WORKDIR /app

# Copy only package files first (cache layer)
COPY package.json package-lock.json ./

# Install deps exactly as lockfile specifies
RUN npm ci --no-audit --no-fund

# Copy all source code
COPY . .

# Build the Vite app
RUN npm run build


# ---- Run stage ----
FROM node:20-slim
WORKDIR /app

# Copy only what is needed at runtime
COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public
COPY --from=build /app/server.mjs ./server.mjs
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "server.mjs"]
