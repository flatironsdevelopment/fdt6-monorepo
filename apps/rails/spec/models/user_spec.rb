# frozen_string_literal: true

require 'rails_helper'

describe User, type: :model do
  subject do
    described_class.new(
      email: 'test@test.com',
      password: '123456'
    )
  end

  describe 'validations' do
    it 'is valid with valid attributes' do
      expect(subject).to be_valid
    end

    it 'is invalid without email' do
      subject.email = nil
      expect(subject).not_to be_valid
    end

    it 'is invalid with an invalid email' do
      subject.email = 'test@test'
      expect(subject).not_to be_valid
      expect(subject.errors.full_messages.to_sentence).to eq('Email is invalid')
    end

    it 'is not valid without a password' do
      subject.password = nil
      expect(subject).to_not be_valid
    end
  end
end
