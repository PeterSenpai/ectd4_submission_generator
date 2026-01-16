#!/bin/bash

# eCTD Generator API - Curl Examples
# Make sure the server is running: npm run start:server

API_BASE="http://localhost:3000/api"

echo "=== eCTD Generator API Examples ==="
echo ""

# 1. Health Check
echo "1. Health Check"
curl -s http://localhost:3000/health | jq '.'
echo ""

# 2. Get JSON Schema
echo "2. Get JSON Schema"
curl -s ${API_BASE}/schema | jq '.success'
echo ""

# 3. Get Default Configuration
echo "3. Get Default Configuration"
curl -s ${API_BASE}/config/default -o default-config.json
echo "   Saved to: default-config.json"
echo ""

# 4. Generate Configuration
echo "4. Generate Configuration (5 manufacturers, 3 products)"
curl -s -X POST ${API_BASE}/config/generate \
  -H "Content-Type: application/json" \
  -d '{"manufacturer": 5, "productName": 3, "nda": "123456"}' \
  -o generated-config.json
echo "   Saved to: generated-config.json"
echo ""

# 5. Validate Configuration
echo "5. Validate Configuration"
curl -s -X POST ${API_BASE}/config/validate \
  -H "Content-Type: application/json" \
  -d @generated-config.json | jq '.valid'
echo ""

# 6. Generate Submission with Default Config
echo "6. Generate Submission with Default Config"
curl -s -X POST ${API_BASE}/generate/default \
  --output default-submission.zip
echo "   Saved to: default-submission.zip"
echo ""

# 7. Generate Submission with Custom Config
echo "7. Generate Submission with Custom Config"
curl -s -X POST ${API_BASE}/generate/custom \
  -H "Content-Type: application/json" \
  -d @generated-config.json \
  --output custom-submission.zip
echo "   Saved to: custom-submission.zip"
echo ""

# 8. API Documentation
echo "8. Get API Documentation"
curl -s http://localhost:3000/api/docs | jq '.endpoints[0]'
echo ""

echo "=== All examples completed! ==="
echo ""
echo "Generated files:"
ls -lh *.json *.zip 2>/dev/null || echo "  (run this script to generate files)"
echo ""
