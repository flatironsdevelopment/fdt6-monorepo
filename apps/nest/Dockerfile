# Use an official Node.js runtime as the base image
FROM node as base

FROM base AS builder

# Set the working directory in the container
WORKDIR /app

# Copy entire project into Docker (because of yarn workspace)
COPY . .

RUN yarn install
RUN yarn turbo run build --filter=nest...
RUN yarn turbo prune --scope=nest --docker

FROM base AS runner
WORKDIR /app

RUN mkdir -p /etc/ssl/certs && \
  curl -o /etc/ssl/certs/rds-combined-ca-bundle.pem https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem

#  Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs && chown -R nestjs:nodejs /app

RUN chown nestjs:nodejs /etc/ssl/certs/rds-combined-ca-bundle.pem

USER nestjs

COPY --from=builder --chown=nestjs:nodejs /app/out/json .
COPY --from=builder --chown=nestjs:nodejs /app/out/full/apps/nest/dist ./apps/nest/dist
COPY --from=builder --chown=nestjs:nodejs /app/out/full/packages/types/dist ./packages/types/dist
COPY --from=builder --chown=nestjs:nodejs /app/yarn.lock .
COPY --from=builder --chown=nestjs:nodejs /app/apps/nest/ ./apps/nest

# Expose the port your Nest.js application is running on
EXPOSE 3000

RUN yarn install && chmod +x apps/nest/entrypoint.sh

CMD ["apps/nest/entrypoint.sh"]
