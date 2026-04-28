# Frontend Dockerfile — Next.js

#########################################################################################
#                                                                                       #
# Placeholders (replace before use):                                                    #
#   {{NODE_VERSION}}         Node.js base image tag, e.g. 20                            #
#   {{FRONTEND_PORT}}        Port next start binds to, e.g. 3000                        #
#   {{BACKEND_INTERNAL_URL}} Backend URL visible to the Next.js server                  #
#                           process (not the browser), e.g. http://backend:8081         #
#                                                                                       #
#########################################################################################

# For Vite Apps:
#   Replace stages 2 and 3 with:
#     FROM node:{{NODE_VERSION}}-alpine AS builder
#     WORKDIR /app
#     COPY --from=deps /app/node_modules ./node_modules
#     COPY . .
#     RUN npm run build
#
#     FROM nginx:alpine AS runner
#     COPY --from=builder /app/dist /usr/share/nginx/html
#     EXPOSE 80


# Stage 1: Install dependencies
FROM node:{{NODE_VERSION}}-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
# npm ci requires package-lock.json. If it does not exist, run
# `npm install` locally and commit the lockfile before building.
RUN npm ci

# Stage 2: Build the Next.js application
FROM node:{{NODE_VERSION}}-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV BACKEND_URL={{BACKEND_INTERNAL_URL}}
ENV NODE_ENV=production
RUN npm run build

# Stage 3: Production runner
FROM node:{{NODE_VERSION}}-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV BACKEND_URL={{BACKEND_INTERNAL_URL}}

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE {{FRONTEND_PORT}}
CMD ["npm", "run", "start"]
