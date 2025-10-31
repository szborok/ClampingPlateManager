#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Change to the script's directory (ClampingPlateManager root)
cd "$SCRIPT_DIR"

# Verify we're in the right place
echo "Current directory: $(pwd)"
echo "Starting ClampingPlateManager development server..."

# Run the dev server
npm run dev