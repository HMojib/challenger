#!/bin/sh

# Abort on any error (including if wait-for-it fails).
set -e

# Wait for the database to be up
/usr/src/app/wait-for-it.sh localhost:5432 -t 30 -s -- npm run migrate && npm run seed

# Run the main container command.
exec "$@"