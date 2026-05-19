# ============================================================
# Stage 1: Build — Install deps & build React app
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files dulu (cache optimization)
COPY package.json package-lock.json* ./

# Install dependencies
# npm ci = clean install (lebih cepat & reproducible dari npm install)
RUN npm ci

# Copy source code
COPY . .

# Build React app → output di /app/dist/
ARG VITE_API_URL=https://sikasi-backend-production-a11c.up.railway.app
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ============================================================
# Stage 2: Production — Serve dengan Nginx
# ============================================================
FROM nginx:alpine

# Copy build output dari stage 1
COPY --from=builder /app/dist/ /usr/share/nginx/html/

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx default port
EXPOSE 80

# Nginx berjalan di foreground
CMD ["nginx", "-g", "daemon off;"]