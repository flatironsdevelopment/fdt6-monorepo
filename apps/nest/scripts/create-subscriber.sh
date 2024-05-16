#!/bin/bash

# Create a new migration file
typeorm entity:create ./src/common/database/subscribers/$1.subscriber
echo -e "Please update content on \033[0;31m./src/common/database/subscribers/$1.subscriber.ts\033[0m"
