# frozen_string_literal: true

require 'swagger_helper'

describe 'confirmation', type: :request do # rubocop:todo Metrics/BlockLength
  path '/api/v1/users/confirmation?confirmation_token={confirmation_token}' do # rubocop:todo Metrics/BlockLength
    get("confirms user's email") do # rubocop:todo Metrics/BlockLength
      tags 'users'
      description "Confirms user's email address"
      consumes 'application/json'
      produces 'application/json'
      parameter name: 'confirmation_token', in: :path, type: :string

      response(200, 'successful') do
        let!(:user) { create(:user) }
        let(:confirmation_token) { user.confirmation_token }

        before do
          expect(User.last.confirmed_at).to be_nil
        end

        run_test! do |response|
          expect(User.count).to eq(1)
          expect(User.last.confirmed_at).not_to be_nil
          expect(JSON.parse(response.body)['id']).to eq(user.id)
          expect(JSON.parse(response.body)['email']).to eq(user.email)
        end

        after do |example|
          example.metadata[:response][:content] = {
            'application/json' => {
              example: JSON.parse(response.body, symbolize_names: true)
            }
          }
        end
      end

      response(422, 'invalid token') do
        let!(:user) { create(:user) }
        let(:confirmation_token) { 'fake' }

        before do
          expect(User.last.confirmed_at).to be_nil
        end

        run_test! do |response|
          expect(User.count).to eq(1)
          expect(User.last.confirmed_at).to be_nil
          expect(JSON.parse(response.body)['message']).to eq('Confirmation token is invalid')
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
