#!/bin/bash
# Kill any existing processes
kill -9 $(lsof -t -i:5000) 2>/dev/null
kill -9 $(lsof -t -i:5173) 2>/dev/null

# Start Backend
echo "Starting Backend..."
cd server
node server.js &
SERVER_PID=$!

# Wait for backend to be ready
sleep 2

# Start Frontend
echo "Starting Frontend..."
cd ../client
npm run dev

# Cleanup on exit
trap "kill $SERVER_PID" EXIT
