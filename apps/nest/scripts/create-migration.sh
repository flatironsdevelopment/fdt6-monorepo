#!/bin/bash

# Create a new migration file
typeorm migration:create ./src/common/database/migrations/$1
prettier ./src/common/database/migrations/*-$1.ts --write