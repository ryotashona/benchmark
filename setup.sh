#!/usr/bin/env bash
set -euo pipefail

# Install Node.js and npm if not already installed
if ! command -v node > /dev/null; then
  apt-get update
  apt-get install -y nodejs npm
fi

# Install front-end dependencies
cd "$(dirname "$0")/front/react/src/react-app"
npm install
