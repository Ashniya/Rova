# Multi-stage Dockerfile for Rova Bus Booking Management System
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package definitions
COPY package.json ./
COPY server/package.json ./server/
COPY client/package.json ./client/

# Install dependencies
RUN npm --prefix server install
RUN npm --prefix client install

# Copy application code
COPY server ./server
COPY client ./client

# Generate Prisma Client & Build TypeScript server
RUN cd server && npx prisma generate && npm run build

# Build React client bundle
RUN cd client && npm run build

# Production Runner stage
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

# Copy root package.json and built artifacts
COPY package.json ./
COPY --from=builder /app/server/package.json ./server/
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/server/node_modules ./server/node_modules
COPY --from=builder /app/server/prisma ./server/prisma
COPY --from=builder /app/client/dist ./client/dist

# Expose server port
EXPOSE 5000

# Push database schema & seed if needed, then start server
CMD ["node", "server/dist/index.js"]
