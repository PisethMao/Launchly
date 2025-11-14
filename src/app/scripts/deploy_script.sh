#!/bin/bash
set -e

PROJECT_NAME=$1
BUILD_PATH=$2
CUSTOM_DOMAIN=${3:-$DOMAIN}
PROJECT_TYPE=${4:-static}

if [ -z "$PROJECT_NAME" ] || [ -z "$BUILD_PATH" ]; then
    echo "Usage: $0 <project_name> <build_path> [domain] [project_type]"
    exit 1
fi

# Normalize
SUBDOMAIN=$(echo "$PROJECT_NAME" | tr '[:upper:]' '[:lower:]')
HOSTNAME="$SUBDOMAIN.$CUSTOM_DOMAIN"

### ≡ Find free port
find_free_port() {
    for port in $(seq 4000 9999); do
        if ! ss -tuln | grep -q ":$port "; then
            echo $port
            return
        fi
    done
    echo "❌ No free ports available."
    exit 1
}

PORT=$(find_free_port)
echo "🔌 Using port: $PORT"

### ≡ PM2 process name
PM2_NAME="launchly_${SUBDOMAIN}"

### ≡ Start the project using PM2
echo "🚀 Starting project using PM2..."

# Delete old PM2 service if exists
pm2 delete "$PM2_NAME" >/dev/null 2>&1 || true

if [ "$PROJECT_TYPE" = "next" ]; then
    echo "⚡ Running Next.js dev server..."
    pm2 start "npx next dev -p $PORT -H 0.0.0.0" --name "$PM2_NAME" --cwd "$BUILD_PATH"
else
    echo "🌐 Running static site with serve..."
    pm2 start serve --name "$PM2_NAME" -- -s "$BUILD_PATH" -l "$PORT"
fi

pm2 save

### ≡ Update Cloudflare config
echo "🧩 Updating Cloudflare config..."

# Remove old hostname entry
sed -i "/hostname: $HOSTNAME/,+1d" "$CLOUDFLARE_CONFIG"

# Insert new entry before fallback
awk -v host="$HOSTNAME" -v port="$PORT" '
/- service: http_status:404/ {
  print "  - hostname: " host
  print "    service: http://localhost:" port
}
{ print }
' "$CLOUDFLARE_CONFIG" > "${CLOUDFLARE_CONFIG}.tmp"

mv "${CLOUDFLARE_CONFIG}.tmp" "$CLOUDFLARE_CONFIG"


### ≡ DNS RECORD
echo "🌍 Creating DNS record in Cloudflare..."

curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/dns_records" \
-H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
-H "Content-Type: application/json" \
--data "{\"type\":\"CNAME\",\"name\":\"$HOSTNAME\",\"content\":\"$CONTENT\",\"proxied\":true}" >/dev/null

### ≡ Output
URL="https://$HOSTNAME"
echo "✅ Project Hosted!"
echo ":::PORT:::$PORT:::"
echo ":::URL:::$URL:::"

