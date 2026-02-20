FROM node:22-alpine

RUN npm install -g pnpm

WORKDIR /app

# Copy package files first so dependencies are cached
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

EXPOSE 4000

# --host exposes the dev server outside the container, --port sets the port
CMD ["pnpm", "dev", "--host", "--port", "4000"]
