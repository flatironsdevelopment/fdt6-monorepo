# frozen_string_literal: true

require 'sidekiq/web'
Sidekiq::Web.use ActionDispatch::Cookies
Sidekiq::Web.use ActionDispatch::Session::CookieStore, key: '_interslice_session'

Rails.application.routes.draw do # rubocop:todo Metrics/BlockLength
  mount Rswag::Ui::Engine => '/api-docs'
  mount Rswag::Api::Engine => '/api-docs'
  if Rails.env.production?
    Sidekiq::Web.use Rack::Auth::Basic do |username, password|
      ActiveSupport::SecurityUtils.secure_compare(::Digest::SHA256.hexdigest(username),
                                                  ::Digest::SHA256.hexdigest(ENV['SIDEKIQ_USERNAME'])) &
        ActiveSupport::SecurityUtils.secure_compare(::Digest::SHA256.hexdigest(password),
                                                    ::Digest::SHA256.hexdigest(ENV['SIDEKIQ_PASSWORD']))
    end
  end
  mount Sidekiq::Web, at: '/sidekiq'

  get '/health', to: 'health_check#index'

  scope 'api/v1' do
    devise_for :users, controllers: {
      sessions: 'api/v1/users/sessions',
      registrations: 'api/v1/users/registrations',
      confirmations: 'api/v1/users/confirmations',
      passwords: 'api/v1/users/passwords'
    }
  end

  devise_scope :user do
    get 'api/v1/users/_me', to: 'api/v1/users/registrations#show'
    get 'api/v1/users/information', to: 'api/v1/users/informations#show'
    put 'api/v1/users/reset_password', to: 'api/v1/users/reset_passwords#update'
  end

  # Redirect all the non api calls from the frontend
  root to: 'health_check#index'
end
