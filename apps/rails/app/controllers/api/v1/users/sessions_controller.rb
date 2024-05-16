# frozen_string_literal: true

module Api
  module V1
    module Users
      class SessionsController < Devise::SessionsController # rubocop:todo Style/Documentation
        respond_to :json

        skip_before_action :verify_authenticity_token
        skip_before_action :require_no_authentication, only: :create

        private

        def respond_with(resource, _opts = {})
          render partial: '/api/v1/users/user_info', locals: { user: resource.reload }, status: :ok
        end

        def respond_to_on_destroy
          log_out_success && return if all_signed_out?

          log_out_failure
        end

        def log_out_success
          render json: { message: 'You have been logged out.' }, status: :ok
        end

        def log_out_failure
          render json: { message: 'An issue occurred and you were not logged out.' }, status: :unauthorized
        end
      end
    end
  end
end
