# FROM node:20-alpine AS base

# # This Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# # Make sure you update both files!
# FROM base AS builder

# # Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3
# #nodealpine to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat
# RUN apk update

# # Set working directory
# WORKDIR /app
# RUN yarn global add turbo
# COPY . .

# RUN yarn install
# RUN yarn turbo prune --scope=web --docker
# RUN yarn turbo run build --filter=web...

# RUN ls -la

# Add lockfile and package.json's of isolated subworkspace
# FROM base AS installer

# RUN apk add --no-cache libc6-compat
# RUN apk update
# WORKDIR /app

# # First install the dependencies (as they change less often)
# COPY .gitignore .gitignore
# COPY --from=builder /app/out/json/ .
# COPY --from=builder /app/out/yarn.lock ./yarn.lock
# RUN yarn install

# # Build the project
# COPY --from=builder /app/out/full/ .
# COPY turbo.json turbo.json
# COPY apps/web/.env .env
# RUN ls -la

# RUN yarn turbo run build --filter=web...

# FROM base AS runner
# WORKDIR /app

# ENV NODE_ENV production

# # Don't run production as root
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs
# USER nextjs

# COPY --from=builder /app/apps/web/.env .
# COPY --from=builder /app/apps/web/package.json .
# COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/ .
# COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./public

# # Expose the port your Nest.js application is running on
# EXPOSE 3000

# ENV HOSTNAME="0.0.0.0"
# ENV PORT=3000

# CMD HOSTNAME="0.0.0.0" node standalone/apps/web/server.js


FROM node:18-alpine AS base

FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune web --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer

ARG NEXT_PUBLIC_API_HOST

RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install

# Build the project
COPY --from=builder /app/out/full/ .
RUN NEXT_PUBLIC_API_HOST=$NEXT_PUBLIC_API_HOST yarn turbo run build --filter=web...

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/web/next.config.js .
COPY --from=installer /app/apps/web/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

CMD HOSTNAME="0.0.0.0" node apps/web/server.js