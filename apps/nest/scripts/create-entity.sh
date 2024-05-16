#!/bin/bash

# Create a new migration file
typeorm entity:create ./src/common/database/entities/$1.entity
echo -e "Please update content on \033[0;31m./src/common/database/entities/$1.entity.ts\033[0m"