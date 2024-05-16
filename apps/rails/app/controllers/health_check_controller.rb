# frozen_string_literal: true

# a health check for infrastructure to know the app is running
class HealthCheckController < ApplicationController
  protect_from_forgery with: :null_session

  skip_before_action :authenticate_user!
  skip_before_action :verify_authenticity_token

  def index
    head :ok
  end
end
