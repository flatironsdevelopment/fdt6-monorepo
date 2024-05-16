# frozen_string_literal: true

module Api
  module V1
    module Users
      class PasswordsController < Devise::PasswordsController # rubocop:todo Style/Documentation
        respond_to :json

        skip_before_action :verify_authenticity_token
        skip_before_action :require_no_authentication, only: %i[create update]

        private

        def respond_with(resource, _opts = {}) # rubocop:todo Metrics/CyclomaticComplexity
          password_change_sent && return if request.post? && !resource.is_a?(User) && resource.empty?
          password_changed_success && return if request.put? && resource.errors.empty?

          password_change_failed
        end

        def password_change_sent
          render json: { message: 'Reset password email sent' }, status: :ok
        end

        def password_changed_success
          render json: { message: 'Your password has been updated' }, status: :ok
        end

        def password_change_failed
          render json: { message: resource.errors&.full_messages&.to_sentence }, status: :unprocessable_entity
        end
      end
    end
  end
end
