#!/bin/bash
# Restart PinchTab headed instance for Handshake
TOKEN="3e64a4e055c949c20c37f70f99b8191f440bb3f0aa3031bc"
AUTH="Authorization: Bearer $TOKEN"

echo "Finding handshake instance..."
INST=$(curl -s -H "$AUTH" http://localhost:9867/instances | python3 -c "import json,sys; [print(i['id']) for i in json.load(sys.stdin) if i['profileName']=='handshake']" 2>/dev/null)

if [ -n "$INST" ]; then
  echo "Stopping $INST..."
  curl -s -X POST "http://localhost:9867/instances/$INST/stop" -H "$AUTH"
  sleep 3
fi

echo "Launching headed handshake instance..."
curl -s -X POST http://localhost:9867/instances/launch -H "$AUTH" -H "Content-Type: application/json" -d '{"name":"handshake","mode":"headed"}'
echo ""
echo "Done. Chrome window should appear."
