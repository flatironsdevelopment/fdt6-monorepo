#!/bin/bash
set -e

export RAILS_ENV='production'

echo "Running database migrations..."
bundle exec rails db:migrate
echo "Running database seeds..."
bundle exec rails db:seed

PORT=3000 bundle exec sidekiq -C config/sidekiq.yml