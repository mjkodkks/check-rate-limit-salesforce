#!/bin/bash

docker compose down && docker compose -f ./docker-compose.prod-supabase.yml build --no-cache && docker compose -f ./docker-compose.prod-supabase.yml up -d