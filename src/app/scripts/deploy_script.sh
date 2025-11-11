set -e
PROJECT_NAME=$1
BUILD_PATH=$2
CUSTOM_DOMAIN=${3:-$DOMAIN}
PROJECT_TYPE=${4:-static}

if [ -z "$PROJECT_NAME" ] || [ -z "$BUILD_PATH" ]; then
    echo "Usage: $0 <project_name> <build_path> [domain] [project_type]"
    exit 1
fi

PORT=$(comm -23 <(seq 4000 4100) <(ss -tuln | awk '{print $5}' | grep -o '[0-9]*$' | sort -u) | head -n 1)
echo "Using port $PORT"

if [ "$PROJECT_TYPE" = "next" ]; then
    echo "🚀 Starting Next.js in development mode..."
    (cd "$BUILD_PATH" && nohup npx next dev -p "$PORT" -H 0.0.0.0 > /tmp/${PROJECT_NAME}_next_dev.log 2>&1 &) &
else
    echo "🚀 Starting static server..."
    nohup npx serve -s "$BUILD_PATH" -l "$PORT" > /tmp/${PROJECT_NAME}_serve.log 2>&1 &
fi

sleep 5

# Cloudflare DNS + tunnel same as before
SUBDOMAIN="${PROJECT_NAME,,}"
HOSTNAME="$SUBDOMAIN.$CUSTOM_DOMAIN"

echo "🧩 Updating Cloudflare config..."
awk -v host="$HOSTNAME" -v port="$PORT" '
/- service: http_status:404/ {
  print "  - hostname: " host
  print "    service: http://localhost:" port
}
{ print }
' "$CLOUDFLARE_CONFIG" > "$CLOUDFLARE_CONFIG.tmp" && mv "$CLOUDFLARE_CONFIG.tmp" "$CLOUDFLARE_CONFIG"

echo "🌍 Creating DNS record..."
curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/dns_records" \
-H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
-H "Content-Type: application/json" \
--data "{\"type\":\"CNAME\",\"name\":\"$HOSTNAME\",\"content\":\"$CONTENT\",\"proxied\":true}" >/dev/null

echo "♻️ Restarting Cloudflare tunnel..."
pkill cloudflared >/dev/null 2>&1 || true
(nohup cloudflared tunnel run "$TUNNEL_NAME" >/tmp/${PROJECT_NAME}_tunnel.log 2>&1 &) & disown

sleep 3

URL="https://$HOSTNAME"
echo "✅ Hosting Project!"
echo "::OUTPUT::$URL"
