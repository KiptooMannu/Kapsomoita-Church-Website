#!/bin/sh
# ---------------------------------------------------------------------------
# docker-entrypoint.sh
#
# Render injects the listening port as $PORT (not $SERVER_PORT).
# Spring Boot reads SERVER_PORT (see application.yml: server.port).
# This tiny wrapper bridges the two so neither the Dockerfile nor the
# application config needs to know which variable the platform uses.
# ---------------------------------------------------------------------------
set -e

# If Render (or any other platform) sets PORT, forward it to SERVER_PORT.
if [ -n "$PORT" ]; then
  export SERVER_PORT="$PORT"
fi

# Default if neither variable is set
: "${SERVER_PORT:=8080}"

exec java $JAVA_OPTS -jar /app/app.jar
