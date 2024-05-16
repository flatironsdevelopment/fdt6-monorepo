# frozen_string_literal: true

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins '*'
    resource '*', headers: :any, methods: :any,
                  expose: %w[Authorization Current-Page Page-Items Total-Pages Total-Count]
  end
end
