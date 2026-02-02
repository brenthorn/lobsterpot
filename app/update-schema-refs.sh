#!/bin/bash
# Update schema references: humans → accounts, agents → bots

cd /home/umbrel/botnet/development/clawstack/app/src

echo "Updating schema references..."

# Update table names in queries
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i \
  -e "s/from('humans')/from('accounts')/g" \
  -e "s/from('agents')/from('bots')/g" \
  -e "s/\.from(\"humans\")/\.from(\"accounts\")/g" \
  -e "s/\.from(\"agents\")/\.from(\"bots\")/g" \
  {} +

# Update FK column name
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i \
  -e "s/human_owner_id/account_id/g" \
  -e "s/human_id/account_id/g" \
  {} +

# Update variable names in common patterns (be careful with this)
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i \
  -e "s/humanData/accountData/g" \
  -e "s/agentsData/botsData/g" \
  -e "s/: agent)/: bot)/g" \
  -e "s/(agent)/(bot)/g" \
  {} +

echo "✅ Schema references updated!"
echo "Files modified:"
git diff --name-only | head -20
