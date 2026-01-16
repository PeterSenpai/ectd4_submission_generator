# API Usage Examples

This directory contains examples demonstrating how to use the eCTD Generator REST API.

## Prerequisites

Make sure the API server is running:

```bash
npm run start:server
```

The server should be accessible at `http://localhost:3000`.

## Examples

### 1. Shell Script Examples (curl-examples.sh)

Run all API examples using curl:

```bash
./curl-examples.sh
```

This script demonstrates:
- Health check
- Getting JSON schema
- Getting default configuration
- Generating custom configurations
- Validating configurations
- Generating submissions (default and custom)
- Accessing API documentation

### 2. Node.js Examples (api-usage.js)

Run programmatic examples using Node.js:

```bash
node api-usage.js
```

This demonstrates how to:
- Use the API from Node.js code
- Handle responses and errors
- Download and save ZIP files
- Chain multiple API calls

## Individual API Calls

### Get Default Configuration

```bash
curl http://localhost:3000/api/config/default > config.json
```

### Generate Configuration

```bash
curl -X POST http://localhost:3000/api/config/generate \
  -H "Content-Type: application/json" \
  -d '{"manufacturer": 10, "productName": 5}' \
  -o generated-config.json
```

### Validate Configuration

```bash
curl -X POST http://localhost:3000/api/config/validate \
  -H "Content-Type: application/json" \
  -d @config.json
```

### Generate Submission

```bash
# With default config
curl -X POST http://localhost:3000/api/generate/default \
  --output submission.zip

# With custom config
curl -X POST http://localhost:3000/api/generate/custom \
  -H "Content-Type: application/json" \
  -d @config.json \
  --output submission.zip
```

## Output Files

Running the examples will create:
- `default-config.json` - Default configuration
- `generated-config.json` - Dynamically generated configuration
- `default-submission.zip` - Submission package with default config
- `custom-submission.zip` - Submission package with custom config

## API Documentation

Visit `http://localhost:3000/api/docs` for complete API documentation when the server is running.
