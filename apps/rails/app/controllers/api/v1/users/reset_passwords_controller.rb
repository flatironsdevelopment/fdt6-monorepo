# frozen_string_literal: true

module Api
  module V1
    module Users
      class ResetPasswordsController < ApplicationController # rubocop:todo Style/Documentation
        respond_to :json

        skip_before_action :verify_authenticity_token

        def update
          unless update_password_params[:current_password].present?
            render json: { errors: 'Current password is required' }, status: :bad_request
            return
          end

          if current_user.valid_password?(update_password_params[:current_password]) && reset_password
            render json: { user: current_user, message: 'Password changed' }, status: :ok
          else
            # rubocop:todo Layout/LineLength
            render json: { errors: 'Invalid current password, password is too short or password confirmation did not match' },
                   # rubocop:enable Layout/LineLength
                   status: :unprocessable_entity
          end
        end

        private

        def reset_password
          current_user.reset_password(
            update_password_params[:password],
            update_password_params[:password_confirmation]
          )
        end

        def update_password_params
          params.permit(:current_password, :password, :password_confirmation)
        end
      end
    end
  end
end
