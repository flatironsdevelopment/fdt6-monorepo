# frozen_string_literal: true

require 'swagger_helper'

describe 'registrations', type: :request do # rubocop:todo Metrics/BlockLength
  path '/api/v1/users/_me' do # rubocop:todo Metrics/BlockLength
    get('my info') do # rubocop:todo Metrics/BlockLength
      tags 'users'
      description 'Shows current_users info'
      consumes 'application/json'
      produces 'application/json'
      security [bearer: []]
      parameter name: 'Authorization', in: :header, type: :string

      response(200, 'successful') do # rubocop:todo Metrics/BlockLength
        let!(:user) { create(:user) }
        let!(:headers) do
          {
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
          }
        end
        let(:auth_headers) { Devise::JWT::TestHelpers.auth_headers(headers, user)['Authorization'] }
        let(:Authorization) { auth_headers }

        before do
          user.confirm

          request.headers['Authorization'] = auth_headers if request.present?
        end

        run_test! do |response|
          parsed_response = JSON.parse(response.body)
          expect(parsed_response['first_name']).to eq(user.first_name)
          expect(parsed_response['last_name']).to eq(user.last_name)
          expect(parsed_response['email']).to eq(user.email)
          expect(parsed_response['id']).to eq(user.id)
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

  path '/api/v1/users' do # rubocop:todo Metrics/BlockLength
    post('sign up') do # rubocop:todo Metrics/BlockLength
      tags 'users'
      description 'Sign up. Fields needs to be inside a user object'
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
        },
        required: %w[email password]
      }

      response(422, 'missing required fields') do
        before do
          expect(User.count).to eq(0)
        end

        let!(:user_params) do
          {
            user: {
              email: 'me@email.com'
            }
          }
        end

        run_test! do |response|
          parsed_response = JSON.parse(response.body)
          expect(User.count).to eq(0)
          expect(parsed_response['message']).to eq("Password can't be blank")
        end
      end

      response(422, 'email already exists') do
        let!(:user) { create(:user, email: 'me@email.com') }
        let!(:user_params) do
          {
            user: {
              email: 'me@email.com',
              password: 'Password!'
            }
          }
        end

        run_test! do |response|
          parsed_response = JSON.parse(response.body)
          expect(User.count).to eq(1)
          expect(parsed_response['message'].include?('Email has already been taken')).to eq(true)
        end
      end

      response(200, 'successful') do
        before do
          expect(User.count).to eq(0)
        end

        let!(:user_params) do
          {
            user: {
              email: 'me@email.com',
              password: 'Password!'
            }
          }
        end

        run_test! do |response|
          parsed_response = JSON.parse(response.body)
          expect(User.count).to eq(1)
          expect(parsed_response['email']).to eq('me@email.com')
          expect(parsed_response['id']).to_not eq(nil)
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

    put('update') do # rubocop:todo Metrics/BlockLength
      tags 'users'
      description 'update user info'
      consumes 'application/json'
      produces 'application/json'
      security [bearer: []]
      parameter name: :user_params, in: :body, schema: {
        type: :object,
        properties: {
          user: {
            type: :object,
            properties: {
              first_name: { type: :string },
              last_name: { type: :string },
              email: { type: :string }
            }
          }
        }
      }
      parameter name: 'Authorization', in: :header, type: :string
      let(:auth_headers) { Devise::JWT::TestHelpers.auth_headers(headers, user)['Authorization'] }
      let(:Authorization) { auth_headers }

      response(200, 'Email change') do # rubocop:todo Metrics/BlockLength
        let!(:user) { create(:user) }
        let!(:headers) do
          {
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
          }
        end

        before do
          user.confirm

          request.headers['Authorization'] = auth_headers if request.present?
        end

        let!(:user_params) do
          {
            user: {
              email: 'new@test.com'
            }
          }
        end

        run_test! do |response|
          parsed_response = JSON.parse(response.body)
          expect(User.count).to eq(1)
          user = User.last.reload
          user.confirm
          expect(user.email).to eq('new@test.com')
          expect(parsed_response['id']).to eq(user.id)
        end
      end

      response(200, 'successful') do # rubocop:todo Metrics/BlockLength
        let!(:user) do
          # rubocop:disable Lint/UselessAssignment
          user = create(:user)
          # rubocop:enable Lint/UselessAssignment
        end

        let!(:user_params) do
          {
            user: {
              first_name: 'new_first_name',
              last_name: 'new_last_name'
            }
          }
        end
        let!(:headers) do
          {
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
          }
        end
        let(:auth_headers) { Devise::JWT::TestHelpers.auth_headers(headers, user)['Authorization'] }
        let!(:Authorization) { auth_headers }
        parameter name: 'Authorization', in: :header, type: :string

        before do
          user.confirm
          request.headers['Authorization'] = auth_headers if request.present?
        end

        run_test! do |response|
          parsed_response = JSON.parse(response.body)
          expect(User.count).to eq(1)
          expect(parsed_response['first_name']).to eq('new_first_name')
          expect(parsed_response['last_name']).to eq('new_last_name')
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
