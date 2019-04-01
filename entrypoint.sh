#!/bin/sh
# Entrypoint for docker-compose service

# Wait for the DB to start accepting connections.
for i in $(seq 5); do
   sleep 10
   echo "Attempt $i"
   bin/migrate && break
done

echo "Setup done, starting pulldasher..."

# Start pulldasher
if [ -n "$DEBUG" ]; then
   npm run debug
else
   npm run start
fi
