# frozen_string_literal: true

require 'swagger_helper'

describe 'password', type: :request do # rubocop:todo Metrics/BlockLength
  path '/api/v1/users/password' do # rubocop:todo Metrics/BlockLength
    post('request reset password email') do # rubocop:todo Metrics/BlockLength
      tags 'users'
      description 'Sends email with reset password instructions'
      consumes 'application/json'
      produces 'application/json'
      parameter name: :user_params, in: :body, schema: {
        type: :object,
        properties: {
          user: {
            type: :object,
            properties: {
              email: { type: :string }
            }
          }
        },
        required: ['email']
      }

      response(200, 'successful') do
        let!(:user) { create(:user) }
        let(:user_params) do
          { user: { email: user.email } }
        end

        run_test! do |response|
          expect(JSON.parse(response.body)['message']).to eq('Reset password email sent')
        end

        after do |example|
          example.metadata[:response][:content] = {
            'application/json' => {
              example: JSON.parse(response.body, symbolize_names: true)
            }
          }
        end
      end

      response(422, 'email not found') do
        let(:user_params) do
          { user: { email: 'fake@test.com' } }
        end

        run_test! do |response|
          expect(JSON.parse(response.body)['message']).to eq('Email not found')
        end

        after do |example|
          example.metadata[:response][:content] = {
            'application/json' => {
              example: JSON.parse(response.body, symbolize_names: true)
            }
          }
        end
      end
    end

    put('update password') do # rubocop:todo Metrics/BlockLength
      tags 'users'
      description 'reset user password using reset_password_token'
      consumes 'application/json'
      produces 'application/json'
      parameter name: :user_params, in: :body, schema: {
        type: :object,
        properties: {
          user: {
            type: :object,
            properties: {
              reset_password_token: { type: :string },
              password: { type: :string },
              password_confirmation: { type: :string }
            }
          }
        },
        required: %w[reset_password_token password password_confirmation]
      }

      response(200, 'successful') do
        let!(:user) { create(:user) }
        let!(:raw) { user.send_reset_password_instructions }
        let(:user_params) do
          { user: { reset_password_token: raw, password: '123456', password_confirmation: '123456' } }
        end

        before do
          user.confirm
        end

        run_test! do |response|
          expect(JSON.parse(response.body)['message']).to eq('Your password has been updated')
        end

        after do |example|
          example.metadata[:response][:content] = {
            'application/json' => {
              example: JSON.parse(response.body, symbolize_names: true)
            }
          }
        end
      end

      response(422, 'wrong reset_password_token') do
        let!(:user) { create(:user) }
        let(:user_params) do
          { user: { reset_password_token: 'wrong', password: '123456', password_confirmation: '123456' } }
        end

        before do
          user.confirm
        end

        run_test! do |response|
          expect(JSON.parse(response.body)['message']).to eq('Reset password token is invalid')
        end

        after do |example|
          example.metadata[:response][:content] = {
            'application/json' => {
              example: JSON.parse(response.body, symbolize_names: true)
            }
          }
        end
      end

      response(422, 'mismatch password_confirmation') do
        let!(:user) { create(:user) }
        let!(:raw) { user.send_reset_password_instructions }
        let(:user_params) do
          { user: { reset_password_token: raw, password: '123456', password_confirmation: 'wrong' } }
        end

        before do
          user.confirm
        end

        run_test! do |response|
          expect(JSON.parse(response.body)['message']).to eq("Password confirmation doesn't match Password")
        end
      end
    end
  end
end
