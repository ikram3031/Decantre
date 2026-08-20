# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Accept build arguments
ARG VITE_API_URL=https://server.decantrebd.com
ARG VITE_IMAGE_BASE_URL=https://server.decantrebd.com
ARG VITE_FB_PIXEL_ID=1279816157389873
ARG VITE_FB_TEST_EVENT_CODE=

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_IMAGE_BASE_URL=$VITE_IMAGE_BASE_URL
ENV VITE_FB_PIXEL_ID=$VITE_FB_PIXEL_ID
ENV VITE_FB_TEST_EVENT_CODE=$VITE_FB_TEST_EVENT_CODE

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy dist from builder
COPY --from=builder /app/dist ./dist

# Copy package files for serve
COPY --from=builder /app/package.json /app/package-lock.json ./

# Install serve globally
RUN npm install -g serve

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 8001

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8001 || exit 1

CMD ["npm", "run", "prod"]
