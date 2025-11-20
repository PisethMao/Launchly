#!/bin/bash

ZIP_PATH=$1
PROJECT_NAME=$2

# ===========================
# 🌍 Core configuration
# ===========================
DOMAIN="piseth.space"
BASE_DIR="/var/www"
TARGET_DIR="${BASE_DIR}/${PROJECT_NAME}.${DOMAIN}"

ZONE_ID="72d9ca1cf313a992b0cc63eb5d12df3d"
CF_API_TOKEN="V3xlAIjaW9SoeH4DrE1cRprLN6TOk4igQ58xZkHE"

TUNNEL_CONFIG="/home/launchly/.cloudflared/config.yml"
TUNNEL_ID=$(cloudflared tunnel list | grep -m 1 "launchly-tunnel" | awk '{print $1}')

echo "----------------------------------------------"
echo "📦 Deploying ZIP to ${PROJECT_NAME}.${DOMAIN}"
echo "----------------------------------------------"


# ==================================================================================
# 1️⃣ Validate ZIP file
# ==================================================================================
if [ -z "$ZIP_PATH" ] || [ -z "$PROJECT_NAME" ]; then
    echo "❌ Usage: $0 <zip_path> <project_name>"
    exit 1
fi

if [ ! -f "$ZIP_PATH" ]; then
    echo "❌ ZIP file not found: $ZIP_PATH"
    exit 1
fi


# ==================================================================================
# 2️⃣ Extract ZIP into temporary directory
# ==================================================================================
TEMP_DIR="/tmp/${PROJECT_NAME}_$(date +%s)"
mkdir -p "$TEMP_DIR"

echo "👉 Extracting ZIP to $TEMP_DIR ..."
unzip -q "$ZIP_PATH" -d "$TEMP_DIR"

if [ $? -ne 0 ]; then
    echo "❌ Failed to extract ZIP"
    rm -rf "$TEMP_DIR"
    exit 1
fi


# ==================================================================================
# 3️⃣ FLATTEN nested folder if needed
# ==================================================================================
INNER_DIR=$(find "$TEMP_DIR" -mindepth 1 -maxdepth 1 -type d | head -n 1)
ROOT_INDEX="$TEMP_DIR/index.html"

if [ -d "$INNER_DIR" ] && [ ! -f "$ROOT_INDEX" ]; then
    echo "📦 Detected nested root folder: $INNER_DIR"
    echo "📁 Flattening folder structure..."
    mv "$INNER_DIR"/* "$TEMP_DIR"
    rmdir "$INNER_DIR"
fi

if [ ! -f "$TEMP_DIR/index.html" ]; then
    echo "⚠ Warning: No index.html found at root of extracted ZIP."
    echo "   Make sure your ZIP contains index.html at the top level."
fi


# ==================================================================================
# 4️⃣ Replace old deployment content
# ==================================================================================
echo "🧹 Cleaning previous deployment at $TARGET_DIR ..."
rm -rf "$TARGET_DIR"
mkdir -p "$TARGET_DIR"

echo "📁 Moving new files into $TARGET_DIR ..."
mv "$TEMP_DIR"/* "$TARGET_DIR"

rm -rf "$TEMP_DIR"


# ==================================================================================
# 5️⃣ Cloudflare DNS (CNAME → Tunnel)
# ==================================================================================
echo "🌐 Syncing Cloudflare DNS..."

CF_API="https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records"

DNS_RESPONSE=$(curl -s -X GET "$CF_API?name=${PROJECT_NAME}.${DOMAIN}" \
  -H "Authorization: Bearer $CF_API_TOKEN")

RECORD_ID=$(echo "$DNS_RESPONSE" | jq -r '.result[0].id')

if [ "$RECORD_ID" != "null" ]; then
    echo "🔁 Updating existing DNS record..."
    curl -s -X PUT "$CF_API/$RECORD_ID" \
      -H "Authorization: Bearer $CF_API_TOKEN" \
      -H "Content-Type: application/json" \
      --data "{\"type\":\"CNAME\",\"name\":\"${PROJECT_NAME}\",\"content\":\"${TUNNEL_ID}.cfargotunnel.com\",\"proxied\":true}"
else
    echo "🆕 Creating new DNS record..."
    curl -s -X POST "$CF_API" \
      -H "Authorization: Bearer $CF_API_TOKEN" \
      -H "Content-Type: application/json" \
      --data "{\"type\":\"CNAME\",\"name\":\"${PROJECT_NAME}\",\"content\":\"${TUNNEL_ID}.cfargotunnel.com\",\"proxied\":true}"
fi


# ==================================================================================
# 6️⃣ Update cloudflared config.yml (ingress)
# ==================================================================================
echo "🛠 Updating Cloudflared tunnel ingress..."

NEW_HOST="${PROJECT_NAME}.${DOMAIN}"

# Remove 404 line
sed -i '/http_status:404/d' "$TUNNEL_CONFIG"

# Add ingress entry if missing
if ! grep -q "$NEW_HOST" "$TUNNEL_CONFIG"; then
cat <<EOF >> "$TUNNEL_CONFIG"
  - hostname: $NEW_HOST
    service: http://localhost:8080
EOF
fi

# Add 404 back at bottom
echo "  - service: http_status:404" >> "$TUNNEL_CONFIG"


# ==================================================================================
# 7️⃣ Restart services
# ==================================================================================
echo "♻ Reloading systemd..."
sudo systemctl daemon-reload

echo "♻ Restarting cloudflared..."
sudo systemctl restart cloudflared

echo "♻ Restarting static-host..."
if pm2 list | grep -q "static-host"; then
    pm2 restart static-host
else
    pm2 start "/home/launchly/static-host/server.js" --name static-host
fi


# ==================================================================================
# 8️⃣ Done
# ==================================================================================
echo ""
echo "----------------------------------------------"
echo "🎉 ZIP Deployment Completed Successfully!"
echo "🌍 URL: https://${PROJECT_NAME}.${DOMAIN}"
echo "----------------------------------------------"