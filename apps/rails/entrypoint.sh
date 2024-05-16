#!/bin/sh
set -e

export RAILS_ENV='production'

echo "Running database migrations..."
bundle exec rails db:migrate
echo "Running database seeds..."
bundle exec rails db:seed

echo "Starting the server..."

bundle exec puma -C config/puma.rb
