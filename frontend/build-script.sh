#!/bin/bash

# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Build the React app
npm run build

# Navigate back to the root directory
cd ..

# Create a directory for the built app if it doesn't exist
mkdir -p frontend/build

# Move the built app to the correct location
mv frontend/build/* frontend/build/

echo "Build complete!"
