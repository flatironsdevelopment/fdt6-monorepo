# frozen_string_literal: true

require 'devise/jwt/test_helpers'

shared_context 'signed_in_user' do
  let!(:user) { create(:user) }

  let!(:headers) do
    {
      'Accept' => 'application/json',
      'Content-Type' => 'application/json'
    }
  end
  let(:auth_headers) { Devise::JWT::TestHelpers.auth_headers(headers, user)['Authorization'] }

  let(:Authorization) { auth_headers } # For rswag

  before do
    user.confirm

    if request.present?
      request.headers['Authorization'] = auth_headers
      request.env['devise.mapping'] = Devise.mappings[:user]
    end
  end
end
