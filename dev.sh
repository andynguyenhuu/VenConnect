#!/bin/bash

# VenConnect Development Helper Script

echo "🚀 VenConnect Development Helper"
echo "================================"

case "$1" in
  "start")
    echo "Starting development server..."
    npm run dev
    ;;
  
  "build")
    echo "Building for production..."
    npm run build
    ;;
  
  "test")
    echo "Running tests..."
    npm test
    ;;
  
  "lint")
    echo "Running linter..."
    npm run lint
    ;;
  
  "format")
    echo "Formatting code..."
    npx prettier --write .
    ;;
  
  "install-ui")
    echo "Installing UI component: $2"
    npx shadcn@latest add $2 -y
    ;;
  
  "setup-db")
    echo "Setting up database..."
    # Add your database setup commands here
    echo "Database setup complete!"
    ;;
  
  "clean")
    echo "Cleaning project..."
    rm -rf .next node_modules
    npm install
    ;;
  
  *)
    echo "Usage: ./dev.sh [command]"
    echo ""
    echo "Available commands:"
    echo "  start       - Start development server"
    echo "  build       - Build for production"
    echo "  test        - Run tests"
    echo "  lint        - Run linter"
    echo "  format      - Format code with Prettier"
    echo "  install-ui  - Install shadcn/ui component"
    echo "  setup-db    - Set up database"
    echo "  clean       - Clean and reinstall dependencies"
    ;;
esac
