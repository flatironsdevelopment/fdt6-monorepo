#!/bin/bash

# Create a new migration file
npx typeorm-ts-node-commonjs migration:revert -d ./src/common/database/migrations/data-sources/$1
