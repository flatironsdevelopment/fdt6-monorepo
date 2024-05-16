# frozen_string_literal: true

require 'devise/orm/active_record'

Devise.setup do |config|
  config.secret_key = ENV['SECRET_KEY_BASE']
  config.mailer_sender = 'Test Sender <no-reply@test.com>'
  config.mailer = 'DeviseCustomMailer'
  config.case_insensitive_keys = [:email]
  config.strip_whitespace_keys = [:email]
  config.http_authenticatable = true
  config.skip_session_storage = [:http_auth]
  config.stretches = Rails.env.test? ? 1 : 12
  config.reconfirmable = true
  config.expire_all_remember_me_on_sign_out = true
  config.password_length = 6..128
  config.send_password_change_notification = true
  config.reset_password_within = 6.hours
  config.sign_out_via = :delete
  config.jwt do |jwt|
    jwt.secret = ENV['SECRET_KEY_BASE']
    jwt.expiration_time = 2_592_000 # 1 month

    jwt.dispatch_requests = [
      ['GET', %r{^/users/confirmation$}],
      ['POST', %r{^/users/oauth/callback$}]
    ]
  end
end
