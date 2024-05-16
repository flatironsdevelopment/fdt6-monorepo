#!/bin/sh
set -e

export NODE_EXTRA_CA_CERTS='/etc/ssl/certs/rds-combined-ca-bundle.pem'
export PORT=3000

echo "Running database migrations..."
cd apps/nest && yarn database:migration:run

echo "Starting the application..."
exec node dist/src/main.js
