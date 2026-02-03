#!/bin/bash
# Tiker Setup Script
# Onboards a new orchestrator to Tiker Mission Control

set -e

echo "🚀 Tiker Setup"
echo "=============="
echo ""

# Check for required commands
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required but not installed."; exit 1; }

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Install dependencies
echo "📦 Installing dependencies..."
cd "$SCRIPT_DIR"
npm install --quiet

# Check for existing config
if [ -n "$TIKER_POSTGRES_URL" ] && [ -n "$TIKER_ANON_KEY" ] && [ -n "$TIKER_ACCOUNT_ID" ]; then
  echo "✅ Tiker environment variables already set"
  echo ""
  node tiker.js status
  exit 0
fi

echo ""
echo "🔑 Enter your Tiker credentials"
echo "   (Find these at https://tiker.com/settings/api)"
echo ""

# Get credentials
read -p "Postgres URL: " POSTGRES_URL
read -p "Anon Key: " ANON_KEY
read -p "Account ID: " ACCOUNT_ID

echo ""

# Validate connection
echo "🔍 Validating connection..."
export TIKER_POSTGRES_URL="$POSTGRES_URL"
export TIKER_ANON_KEY="$ANON_KEY"
export TIKER_ACCOUNT_ID="$ACCOUNT_ID"

if node tiker.js status; then
  echo ""
  echo "✅ Connection validated!"
else
  echo ""
  echo "❌ Connection failed. Please check your credentials."
  exit 1
fi

echo ""

# Detect shell config file
if [ -n "$ZSH_VERSION" ]; then
  SHELL_RC="$HOME/.zshrc"
elif [ -n "$BASH_VERSION" ]; then
  SHELL_RC="$HOME/.bashrc"
else
  SHELL_RC="$HOME/.profile"
fi

# Ask to save
read -p "💾 Save to $SHELL_RC? (y/n): " SAVE_CONFIG

if [ "$SAVE_CONFIG" = "y" ] || [ "$SAVE_CONFIG" = "Y" ]; then
  echo "" >> "$SHELL_RC"
  echo "# Tiker Configuration" >> "$SHELL_RC"
  echo "export TIKER_POSTGRES_URL=\"$POSTGRES_URL\"" >> "$SHELL_RC"
  echo "export TIKER_ANON_KEY=\"$ANON_KEY\"" >> "$SHELL_RC"
  echo "export TIKER_ACCOUNT_ID=\"$ACCOUNT_ID\"" >> "$SHELL_RC"
  echo ""
  echo "✅ Configuration saved to $SHELL_RC"
  echo "   Run: source $SHELL_RC"
else
  echo ""
  echo "📋 Add these to your environment:"
  echo ""
  echo "export TIKER_POSTGRES_URL=\"$POSTGRES_URL\""
  echo "export TIKER_ANON_KEY=\"$ANON_KEY\""
  echo "export TIKER_ACCOUNT_ID=\"$ACCOUNT_ID\""
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Restart your OpenClaw gateway"
echo "  2. Add Tiker checks to your HEARTBEAT.md"
echo "  3. Check 'tiker agents' to see your installed agents"
echo ""
