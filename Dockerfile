# Stage 1: Build static site with SSG
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies using lockfile
COPY package.json package-lock.json ./
RUN npm ci

# Copy application sources
COPY . .

# Build arguments for client configuration
ARG VITE_SITE_URL=https://art.normando.dev
ARG VITE_FORMSPREE_FORM_ID=""

ENV VITE_SITE_URL=${VITE_SITE_URL}
ENV VITE_FORMSPREE_FORM_ID=${VITE_FORMSPREE_FORM_ID}

# Run TypeScript check, Vite client build, and pre-rendering script
RUN npm run build

# Stage 2: Serve pre-rendered static site with Nginx
FROM nginx:1.27-alpine

# Clean default assets and configuration
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/*

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy pre-rendered static assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
