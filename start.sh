#!/bin/bash

echo "Starting docker"
docker-compose up -d --build --remove-orphans --force-recreate