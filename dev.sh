#!/bin/bash
# ClampingPlateManager Development Helper
# This script ensures we're always in the right directory

# Find the script's directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# If we're in a subfolder, go to the ClampingPlateManager root
if [[ "$SCRIPT_DIR" == *"ClampingPlateManager"* ]]; then
    cd "$SCRIPT_DIR"
else
    # Try to find ClampingPlateManager relative to current location
    if [ -d "../ClampingPlateManager" ]; then
        cd "../ClampingPlateManager"
    elif [ -d "./ClampingPlateManager" ]; then
        cd "./ClampingPlateManager"
    elif [ -d "../../ClampingPlateManager" ]; then
        cd "../../ClampingPlateManager"
    else
        echo "Error: Could not find ClampingPlateManager directory"
        exit 1
    fi
fi

echo "✅ Working in: $(pwd)"
echo "🚀 Starting development server..."

# Start the development server
npm run dev