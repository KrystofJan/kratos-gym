#!/bin/sh
# URL to check
URL="http://localhost:7000/api/test/"

# Time interval between checks (in seconds)
INTERVAL=5

# Loop until the response is 200 (OK)
while true; do
    STATUS_CODE=$(curl -o /dev/null -s -w "%{http_code}" "$URL")
    
    if [ "$STATUS_CODE" -eq 200 ]; then
        echo "OK response received! Status Code: 200"
        break
    else
        echo "Not ready yet (Status: $STATUS_CODE). Retrying in $INTERVAL seconds..."
        sleep $INTERVAL
    fi
done
