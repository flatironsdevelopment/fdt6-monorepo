# Use an official Ruby runtime as the base image
FROM ruby:3.3.1

# Set the working directory inside the container
WORKDIR /app

# Copy the Gemfile and Gemfile.lock into the container
COPY apps/rails/Gemfile apps/rails/Gemfile.lock ./

# Install Rubygems dependencies
RUN bundle install

# Copy the rest of the application code into the container
COPY apps/rails/. .

# Expose a port if your Ruby application listens on one (optional)
EXPOSE 3000

ENV RAILS_ENV='production'

CMD ["./entrypoint.sh"]
