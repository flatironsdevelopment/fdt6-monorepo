# frozen_string_literal: true

class ApplicationController < ActionController::Base # rubocop:todo Style/Documentation
  protect_from_forgery with: :null_session

  before_action :authenticate_user!
  before_action :verify_authenticity_token
end
