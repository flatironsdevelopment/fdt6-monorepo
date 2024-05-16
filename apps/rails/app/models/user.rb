# frozen_string_literal: true

class User < ApplicationRecord # rubocop:todo Style/Documentation
  EMAIL_REGEX = /\A[^@\s]+@([^@\s]+\.)+[^@\s]+\z/

  devise :database_authenticatable, :registerable, :confirmable, :recoverable, :trackable,
         :rememberable, :validatable, :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  validates :email, presence: true, uniqueness: { case_sensitive: false }, format: { with: EMAIL_REGEX }

  def full_name
    "#{first_name} #{last_name}"
  end
end
