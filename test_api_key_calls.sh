#!/bin/bash

API_KEY="TEST_API_KEY_123"
API_URL="http://localhost:3000/api/external/status"

echo "Testing API Key authentication for: $API_URL"

# Make the API call and capture both HTTP status and response body
# Use a unique delimiter (e.g., ---HTTP_STATUS_AND_BODY_SEPARATOR---)
HTTP_RESPONSE=$(curl -s -w "\n---HTTP_STATUS_AND_BODY_SEPARATOR---%{http_code}" -H "X-API-Key: $API_KEY" $API_URL)

# Split the response into body and status code using the delimiter
HTTP_STATUS=$(echo "$HTTP_RESPONSE" | awk -F'---HTTP_STATUS_AND_BODY_SEPARATOR---' '{print $2}')
RESPONSE_BODY=$(echo "$HTTP_RESPONSE" | awk -F'---HTTP_STATUS_AND_BODY_SEPARATOR---' '{print $1}')

echo "\n--- Response --- "
echo "HTTP Status: $HTTP_STATUS"
echo "Response Body: $RESPONSE_BODY"

# Validate the response
if [ "$HTTP_STATUS" -eq 200 ]; then
  echo "\n--- Validation ---"
  # Check if the response body contains expected text
  if echo "$RESPONSE_BODY" | grep -q "External API is healthy"; then
    echo "SUCCESS: API call was successful and returned expected message."
  else
    echo "WARNING: API call was successful (HTTP 200) but response body did not contain expected message."
  fi
else
  echo "\n--- Validation ---"
  echo "FAILURE: API call failed with HTTP Status $HTTP_STATUS."
  echo "Please ensure your backend is running and the API Key is correctly configured and active in your database."
fi