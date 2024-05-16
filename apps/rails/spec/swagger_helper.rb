# frozen_string_literal: true

require 'rails_helper'

RSpec.configure do |config|
  config.swagger_root = Rails.root.join('swagger').to_s
  config.swagger_docs = {
    'v1/swagger.yaml' => {
      openapi: '3.0.1',
      info: {
        title: 'API V1',
        version: 'v1'
      },
      paths: {},
      servers: [
        {
          url: ENV['APP_HOST'],
          variables: {
            defaultHost: {
              default: ENV['APP_HOST']
            }
          }
        }
      ]
    }
  }
  config.swagger_format = :yaml
end
