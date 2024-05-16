#!/bin/sh

# Save a short git hash, must be run from a git
# repository (or a child directory)
version=$HEROKU_SLUG_COMMIT

# Use the post_server_item access token, you can
# find one in your project access token settings
post_server_item=$ROLLBAR_ACCESS_TOKEN

echo "Uploading source maps for version $version!"

# We upload a source map for each resulting JavaScript
# file; the path depends on your build config
removablePath="client/build"
for path in $(find client/build -name "*.js"); do
  echo "1) JS File Path $path"
  # URL of the JavaScript file on the web server
  url=$CLIENT_URL${path#$removablePath}

  # a path to a corresponding source map file
  source_map="@$path.map"

  echo "2) Uploading minified_url for $url"
  echo "3) Uploading source map for $source_map"
  echo "---------------------------------------"

  curl --silent --show-error https://api.rollbar.com/api/1/sourcemap \
    -F access_token=$post_server_item \
    -F version=$version \
    -F minified_url=$url \
    -F source_map=$source_map \
    > /dev/null
done
