# ------------ Stage 1: Build ------------
FROM node:18-alpine as builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install ALL deps (incl. dev)
RUN npm ci

# Copy full source
COPY . .

# Build NestJS app
RUN npm run build


# ------------ Stage 2: Production ------------
FROM node:18-alpine

WORKDIR /app

# Copy only the necessary files
COPY package*.json ./

# Install only production deps
RUN npm ci --only=production

# Copy compiled output from builder
COPY --from=builder /app/dist ./dist

# Start app
EXPOSE 3000
CMD ["node", "dist/main"]
