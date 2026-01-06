# ---- Build stage ----
FROM node:20-slim AS build
WORKDIR /app

# Copy only package files first for caching
COPY package.json ./
# If package-lock.json exists, copy it too (optional)
COPY package-lock.json* ./

# Install dependencies
RUN npm install --no-audit --no-fund

# Copy the rest of the source
COPY . .

# Build the Vite app
RUN npm run build

# ---- Run stage ----
FROM node:20-slim
WORKDIR /app

# Copy built output + server
COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public
COPY --from=build /app/server.mjs ./server.mjs
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "server.mjs"]
