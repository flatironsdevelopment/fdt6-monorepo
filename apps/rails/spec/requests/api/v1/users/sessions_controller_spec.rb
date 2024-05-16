# frozen_string_literal: true

require 'swagger_helper'

describe 'sessions', type: :request do # rubocop:todo Metrics/BlockLength
  path '/api/v1/users/sign_out' do # rubocop:todo Metrics/BlockLength
    delete('sign out') do # rubocop:todo Metrics/BlockLength
      tags 'users'
      description 'Logout'
      consumes 'application/json'
      produces 'application/json'
      let!(:user) { create(:user) }

      response(200, 'successful') do
        include_context 'signed_in_user'
        before do
          user.confirm
          expect(User.count).to eq(1)
        end

        parameter name: 'Authorization', in: :header, type: :string
        let(:auth_headers) { Devise::JWT::TestHelpers.auth_headers(headers, user)['Authorization'] }
        let(:Authorization) { auth_headers }

        run_test! do |response|
          expect(User.count).to eq(1)
          expect(response.headers['Authorization']).to be_nil
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
  end

  path '/api/v1/users/sign_in' do # rubocop:todo Metrics/BlockLength
    post('sign in') do # rubocop:todo Metrics/BlockLength
      tags 'users'
      description 'Sign in'
      consumes 'application/json'
      produces 'application/json'
      parameter name: :user_params, in: :body, schema: {
        type: :object,
        properties: {
          user: {
            type: :object,
            properties: {
              email: { type: :string },
              password: { type: :string }
            }
          }
        }
      }

      response(200, 'successful') do # rubocop:todo Metrics/BlockLength
        let!(:user) { create(:user) }

        before do
          user.confirm
          expect(User.count).to eq(1)
        end

        let!(:user_params) do
          {
            user: {
              email: user.email,
              password: 'Password1234!'
            }
          }
        end

        run_test! do |response|
          parsed_response = JSON.parse(response.body)
          expect(User.count).to eq(1)
          expect(parsed_response['first_name']).to eq(user.first_name)
          expect(parsed_response['last_name']).to eq(user.last_name)
          expect(parsed_response['email']).to eq(user.email)
          expect(parsed_response['id']).to eq(user.id)
          expect(response.headers['Authorization']).not_to be_nil
        end

        after do |example|
          example.metadata[:response][:content] = {
            'application/json' => {
              example: JSON.parse(response.body, symbolize_names: true)
            }
          }
        end
      end

      response(401, 'wrong password') do # rubocop:todo Metrics/BlockLength
        before do
          expect(User.count).to eq(0)
        end

        let!(:user) { create(:user) }

        before do
          user.confirm
          expect(User.count).to eq(1)
        end

        let!(:user_params) do
          {
            user: {
              email: user.email,
              password: 'wrong'
            }
          }
        end

        run_test! do |response|
          parsed_response = JSON.parse(response.body)
          expect(parsed_response['error']).to eq('Invalid Email or password.')
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
  end
end
