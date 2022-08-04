#!/bin/bash

echo "Stoping previous docker instance"
docker-compose stop

echo "Starting new docker instance"
docker-compose up -d --build --remove-orphans --force-recreate