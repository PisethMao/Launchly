#!/bin/bash
# ---------------------------------------------------
# 🚀 Launchly Universal Deploy Script (GitHub + GitLab)
# FINAL CLEAN VERSION — PUBLIC + PRIVATE (PAT only)
# ---------------------------------------------------

# === 1️⃣ Arguments ===
REPO_URL=$1
BRANCH=$2
PROJECT_NAME=$3
USER_TOKEN=$4

# === 2️⃣ Core Config ===
DOMAIN="piseth.space"
ZONE_ID="72d9ca1cf313a992b0cc63eb5d12df3d"
CF_API_TOKEN="V3xlAIjaW9SoeH4DrE1cRprLN6TOk4igQ58xZkHE"

BASE_DIR="/var/www"
TARGET_DIR="${BASE_DIR}/${PROJECT_NAME}.${DOMAIN}"

TUNNEL_CONFIG="/home/launchly/.cloudflared/config.yml"
TUNNEL_ID=$(cloudflared tunnel list | grep -m 1 "launchly-tunnel" | awk '{print $1}')

echo "----------------------------------------------"
echo "🚀 Deploying ${PROJECT_NAME}.${DOMAIN}"
echo "----------------------------------------------"

# Detect provider
if [[ "$REPO_URL" == *"github.com"* ]]; then
    PROVIDER="github"
    echo "📌 Provider: GitHub"
elif [[ "$REPO_URL" == *"gitlab.com"* ]]; then
    PROVIDER="gitlab"
    echo "📌 Provider: GitLab"
else
    echo "❌ Unsupported provider."
    exit 1
fi

# Clone or update
if [ -d "$TARGET_DIR" ]; then
    echo "🔄 Pulling latest changes..."
    cd "$TARGET_DIR" || exit 1

    git fetch origin --quiet
    git checkout "$BRANCH" --quiet || true
    git pull origin "$BRANCH" --quiet || {
        echo "⚠ Pull failed → Re-cloning"
        cd "$BASE_DIR" || exit 1
        rm -rf "$TARGET_DIR"
        git clone -b "$BRANCH" "$REPO_URL" "$TARGET_DIR" || exit 1
    }
else
    echo "🆕 Fresh clone..."
    git clone -b "$BRANCH" "$REPO_URL" "$TARGET_DIR" || exit 1
fi

# Install Node dependencies
if [ -f "$TARGET_DIR/package.json" ]; then
    cd "$TARGET_DIR"
    echo "📦 Installing npm dependencies..."
    npm install --silent
fi

# Cloudflare DNS
echo "🌐 Updating DNS..."

CF_API="https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records"
FULL_HOST="${PROJECT_NAME}.${DOMAIN}"

DNS_RESPONSE=$(curl -s -X GET "$CF_API?name=${FULL_HOST}" \
  -H "Authorization: Bearer $CF_API_TOKEN")

RECORD_ID=$(echo "$DNS_RESPONSE" | jq -r '.result[0].id')

if [ "$RECORD_ID" != "null" ]; then
    echo "🔁 Updating DNS..."
    curl -s -X PUT "$CF_API/$RECORD_ID" \
      -H "Authorization: Bearer $CF_API_TOKEN" \
      -H "Content-Type: application/json" \
      --data "{\"type\":\"CNAME\",\"name\":\"${FULL_HOST}\",\"content\":\"${TUNNEL_ID}.cfargotunnel.com\",\"proxied\":true}"
else
    echo "🆕 Creating DNS record..."
    curl -s -X POST "$CF_API" \
      -H "Authorization: Bearer $CF_API_TOKEN" \
      -H "Content-Type: application/json" \
      --data "{\"type\":\"CNAME\",\"name\":\"${FULL_HOST}\",\"content\":\"${TUNNEL_ID}.cfargotunnel.com\",\"proxied\":true}"
fi

# Update cloudflared config
echo "🛠 Updating cloudflared ingress..."

sed -i '/http_status:404/d' "$TUNNEL_CONFIG"

if ! grep -q "$FULL_HOST" "$TUNNEL_CONFIG"; then
cat <<EOF >> "$TUNNEL_CONFIG"
  - hostname: $FULL_HOST
    service: http://localhost:8080
EOF
fi

echo "  - service: http_status:404" >> "$TUNNEL_CONFIG"

# Restart services
echo "♻ Restarting cloudflared..."
sudo systemctl restart cloudflared

echo "♻ Restarting static-host..."
if pm2 list | grep -q "static-host"; then
    pm2 restart static-host
else
    pm2 start "/home/launchly/static-host/server.js" --name static-host
fi

echo ""
echo "----------------------------------------------"
echo "🎉 Deployment Completed!"
echo "🌍 https://${PROJECT_NAME}.${DOMAIN}"
echo "----------------------------------------------"