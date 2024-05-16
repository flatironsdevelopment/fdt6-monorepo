# frozen_string_literal: true

Sidekiq.configure_client do |config|
  config.redis = {
    url: ENV.fetch('REDIS_URL'),
    size: 1,
    network_timeout: 5
  }
end

Sidekiq.configure_server do |config|
  config.redis = {
    url: ENV.fetch('REDIS_URL'),
    size: ENV.fetch('SIDEKIQ_REDIS_SIZE', 25).to_i,
    network_timeout: 5
  }
end
