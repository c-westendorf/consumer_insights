#!/bin/bash
# Simple script to serve the prototype locally

echo "Starting CVS Health Consumer Insights Prototype..."
echo "Server running at: http://localhost:8000"
echo "Press Ctrl+C to stop"
echo ""
echo "Opening browser..."

# Start server and open browser
python3 -m http.server 8000
