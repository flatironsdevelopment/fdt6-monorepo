# frozen_string_literal: true

require 'swagger_helper'

describe 'reset_password', type: :request do # rubocop:todo Metrics/BlockLength
  include_context 'signed_in_user'

  path '/api/v1/users/reset_password' do # rubocop:todo Metrics/BlockLength
    put('update current_user password') do # rubocop:todo Metrics/BlockLength
      tags 'users'
      description 'Changes current_user password'
      consumes 'application/json'
      produces 'application/json'
      security [bearer: []]
      parameter name: :user_params, in: :body, schema: {
        type: :object,
        properties: {
          user: {
            type: :object,
            properties: {
              current_password: { type: :string },
              password: { type: :string },
              password_confirmation: { type: :string }
            }
          }
        },
        required: %w[current_password password password_confirmation]
      }
      parameter name: 'Authorization', in: :header, type: :string
      let(:auth_headers) { Devise::JWT::TestHelpers.auth_headers(headers, user)['Authorization'] }
      let(:Authorization) { auth_headers }

      response(200, 'successful') do
        let(:user_params) { { current_password: 'Password1234!', password: '123456', password_confirmation: '123456' } }

        run_test!

        after do |example|
          example.metadata[:response][:content] = {
            'application/json' => {
              example: JSON.parse(response.body, symbolize_names: true)
            }
          }
        end
      end

      response(422, 'unsuccessful, current_password is wrong') do
        let!(:user_params) do
          { current_password: 'wrongpassword!', password: '12345678', password_confirmation: '12345678' }
        end
        parameter name: 'Authorization', in: :header, type: :string
        let(:auth_headers) { Devise::JWT::TestHelpers.auth_headers(headers, user)['Authorization'] }
        let(:Authorization) { auth_headers }

        run_test! do |response|
          # rubocop:todo Layout/LineLength
          expect(JSON.parse(response.body)['errors']).to eq('Invalid current password, password is too short or password confirmation did not match')
          # rubocop:enable Layout/LineLength
        end

        after do |example|
          example.metadata[:response][:content] = {
            'application/json' => {
              example: JSON.parse(response.body, symbolize_names: true)
            }
          }
        end
      end

      response(400, 'unsuccessful, current_password is required') do
        let!(:user_params) { { password: '12345678', password_confirmation: '12345678' } }
        parameter name: 'Authorization', in: :header, type: :string
        let(:auth_headers) { Devise::JWT::TestHelpers.auth_headers(headers, user)['Authorization'] }
        let(:Authorization) { auth_headers }

        after do |example|
          example.metadata[:response][:content] = {
            'application/json' => {
              example: JSON.parse(response.body, symbolize_names: true)
            }
          }
        end

        run_test! do |response|
          expect(JSON.parse(response.body)['errors']).to eq('Current password is required')
        end
      end
    end
  end
end
