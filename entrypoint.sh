#!/bin/bash
# Clean up failed migrations and apply fresh migrations
echo "Cleaning failed migrations and applying fresh schema..."

# Try to migrate, if it fails due to migration issues, log it
npx prisma migrate deploy 2>&1

if [ $? -ne 0 ]; then
  echo "Migration failed, skipping seed..."
else
  echo "Migration successful!"
fi

echo "Starting application..."
npm run start:prod
