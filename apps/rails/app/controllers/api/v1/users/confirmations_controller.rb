# frozen_string_literal: true

module Api
  module V1
    module Users
      class ConfirmationsController < Devise::ConfirmationsController # rubocop:todo Style/Documentation
        respond_to :json

        skip_before_action :verify_authenticity_token

        private

        def respond_with_navigational(resource, _opts = {})
          comfirmer_success && return if resource.errors.empty?

          comfirmer_failed
        end

        def respond_with(resource, _opts = {})
          comfirmation_sent && return if resource.empty? || resource.errors.empty?

          comfirmer_failed
        end

        def comfirmation_sent
          render json: { message: 'Confirmation sent' }, status: :ok
        end

        def comfirmer_success
          sign_in(resource, event: :authentication)

          render partial: '/api/v1/users/user_info', locals: { user: current_user.reload }, status: :ok
        end

        def comfirmer_failed
          render json: { message: resource.errors&.full_messages&.to_sentence }, status: :unprocessable_entity
        end
      end
    end
  end
end
