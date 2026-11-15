#!/usr/bin/env bash
# Exit on any error
set -e

echo "=== Building Rova Server ==="
cd server
npm install
npx prisma generate
npx prisma db push --skip-generate
npm run build

echo "=== Building Rova Client ==="
cd ../client
npm install
npm run build

echo "=== Build Complete ==="
