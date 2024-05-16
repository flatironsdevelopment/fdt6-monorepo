# frozen_string_literal: true

module Api
  module V1
    module Users
      class RegistrationsController < Devise::RegistrationsController # rubocop:todo Style/Documentation
        respond_to :json

        skip_before_action :verify_authenticity_token
        skip_before_action :require_no_authentication, only: :create
        def show
          if current_user.present?
            render partial: '/api/v1/users/user_info', locals: { user: current_user.reload }, status: :ok
          else
            render json: { message: 'No user is currently logged in' }, status: :unauthorized
          end
        end

        private

        def respond_with(resource, _opts = {})
          register_failed && return if resource.errors.any?

          register_success
        end

        def register_success
          resource.reload
          render partial: '/api/v1/users/user_info', locals: { user: resource.reload }, status: :ok
        end

        def register_failed
          render json: { message: resource.errors&.full_messages&.to_sentence }, status: :unprocessable_entity
        end

        def update_resource(resource, params)
          resource.update_without_password(params)
        end

        def sign_up_params
          params.require(:user).permit(:email, :first_name, :last_name, :password, :password_confirmation)
        end

        def account_update_params
          params.require(:user).permit(:email, :first_name, :last_name, :password, :password_confirmation)
        end
      end
    end
  end
end
