# =============================================================================
# FRONTEND DOCKERFILE TEMPLATE
# =============================================================================
# Placeholders to replace (use Ctrl+F to find each one):
#
#   {{NODE_VERSION}}            e.g. 20
#   {{FRONTEND_PORT}}           e.g. 3000
#   {{BACKEND_URL_DEFAULT}}     e.g. http://backend:8081
#
# This is a multi-stage build:
#   Stage 1 (deps)    — installs node_modules
#   Stage 2 (builder) — builds the production bundle
#   Stage 3 (runner)  — runs the built app with minimal image size
#
# This template assumes a Next.js app using `npm run build` + `npm run start`.
# For a Vite/CRA static app see the note at the bottom of this file.
# =============================================================================

# --- Stage 1: Install dependencies ---
FROM node:{{NODE_VERSION}}-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
# npm ci installs exact versions from package-lock.json — required for reproducible builds.
# If package-lock.json does not exist, run `npm install` locally first and commit it.
RUN npm ci

# --- Stage 2: Build the application ---
FROM node:{{NODE_VERSION}}-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# BACKEND_URL tells the Next.js server where to forward SSR/rewrite requests.
# In the container this is the backend service name, not localhost.
ENV BACKEND_URL={{BACKEND_URL_DEFAULT}}
ENV NODE_ENV=production

RUN npm run build

# --- Stage 3: Production runner ---
FROM node:{{NODE_VERSION}}-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV BACKEND_URL={{BACKEND_URL_DEFAULT}}

# Only copy what is needed to run — no source code, no dev dependencies
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE {{FRONTEND_PORT}}

CMD ["npm", "run", "start"]


# =============================================================================
# FOR VITE / CREATE REACT APP (static output):
# Replace Stages 2 and 3 above with the following.
# Vite builds to a `dist/` folder of static HTML/JS/CSS — no Node needed to serve it.
#
# FROM node:{{NODE_VERSION}}-alpine AS builder
# WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .
# RUN npm run build
#
# FROM nginx:alpine AS runner
# COPY --from=builder /app/dist /usr/share/nginx/html
# EXPOSE 80
# =============================================================================
