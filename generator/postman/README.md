# Testing with Postman

This guide explains how to test the eCTD 4.0 Generator API using Postman.

## Quick Start

### 1. Import the Collection

1. Open Postman
2. Click **Import** button (top left)
3. Choose **File** tab
4. Select `eCTD-Generator-API.postman_collection.json` from this directory
5. Click **Import**

### 2. Start the Server

Before testing, make sure the API server is running:

```bash
cd /Users/petertao/Desktop/coding/SubmissionGenerator/generator
npm run start:server
```

The server should be running on `http://localhost:3000`.

### 3. Test the API

The collection is organized into folders:

#### 📁 Health & Info

-   **Health Check** - Verify server is running
-   **API Info** - Get list of available endpoints
-   **API Documentation** - Get detailed API docs

#### 📁 Schema & Config

-   **Get JSON Schema** - Retrieve configuration schema
-   **Get Default Config** - Get the default configuration

#### 📁 Config Generation

-   **Generate Config - Small** (2 manufacturers, 2 products)
-   **Generate Config - Medium** (10 manufacturers, 5 products)
-   **Generate Config - Large** (20 manufacturers, 20 products)

#### 📁 Config Validation

-   **Validate Config - Valid** - Test with valid config
-   **Validate Config - Invalid** - Test with invalid config (should return errors)

#### 📁 Submission Generation

-   **Generate Default Submission** - Creates ZIP with default config
-   **Generate Custom Submission - Small** - Custom inline config
-   **Generate Custom Submission - From Generated Config** - Use a previously generated config

#### 📁 Complete Workflow

Demonstrates the full workflow in 3 steps:

1. Generate a configuration
2. Validate the configuration
3. Generate submission package

## Detailed Instructions

### Testing Individual Endpoints

#### 1. Health Check

**Request:**

```
GET http://localhost:3000/health
```

**Expected Response:**

```json
{
    "success": true,
    "status": "healthy",
    "service": "eCTD 4.0 Submission Generator API",
    "version": "1.0.0",
    "timestamp": "2026-01-16T..."
}
```

#### 2. Generate Configuration

**Request:**

```
POST http://localhost:3000/api/config/generate
Content-Type: application/json

{
  "manufacturer": 5,
  "productName": 3,
  "nda": "123456",
  "sponsor": "Test Pharma Inc"
}
```

**Expected Response:**

```json
{
    "success": true,
    "config": { ... },
    "metadata": {
        "manufacturerKeywords": 5,
        "productKeywords": 3,
        "totalKeywords": 8,
        "totalDocuments": 12
    }
}
```

#### 3. Generate Submission (ZIP Download)

**Request:**

```
POST http://localhost:3000/api/generate/default
```

**In Postman:**

1. Click **Send and Download** button (not just Send)
2. Choose location to save the ZIP file
3. Extract the ZIP to inspect contents

**ZIP Contents:**

```
NDA123456_seq1.zip
├── m1/
│   ├── 356h_123456_1.pdf
│   └── cover-123456_1.pdf
├── m2/
├── m3/
│   └── product_information.pdf
├── m4/
├── m5/
│   └── bioavailability_study_report.pdf
├── sha256.txt
└── submissionunit.xml
```

### Using the Complete Workflow

The **Complete Workflow** folder demonstrates how to chain requests:

**Step 1: Generate Config**

-   Click **Send**
-   The config is automatically saved to environment variables

**Step 2: Validate Config**

-   Click **Send**
-   Uses the config from Step 1 automatically
-   Check that `valid: true` in response

**Step 3: Generate Submission**

-   Click **Send and Download**
-   Uses the config from Step 1 automatically
-   Save the ZIP file

### Testing Error Scenarios

#### Test Validation Errors

Use the "Validate Config - Invalid" request to see error responses:

**Response:**

```json
{
    "success": true,
    "valid": false,
    "errors": [
        {
            "instancePath": "/application",
            "message": "must have required property 'number'"
        }
    ]
}
```

#### Test Missing Required Fields

Try generating a config without required parameters:

**Request:**

```json
{
    "manufacturer": 5
    // missing productName
}
```

**Response:**

```json
{
    "success": false,
    "error": {
        "message": "Both manufacturer and productName are required",
        "type": "Error"
    }
}
```

## Tips for Testing

### 1. Use Environment Variables

Create a Postman environment for easier testing:

1. Click **Environments** (left sidebar)
2. Click **+** to create new environment
3. Add variable:
    - Name: `baseUrl`
    - Value: `http://localhost:3000`
4. Save and select this environment

### 2. Save Generated Configs

When testing "Generate Config":

1. Send the request
2. Copy the entire `config` object from response
3. Paste it into "Generate Custom Submission" body
4. This lets you test the full workflow manually

### 3. Inspect ZIP Files

After downloading ZIP files:

1. Extract the ZIP
2. Open `submissionunit.xml` in a text editor
3. Verify the structure matches your config
4. Check that PDFs are generated
5. Verify `sha256.txt` contains hashes

### 4. Test Large Submissions

For performance testing:

1. Use "Generate Config - Large" (20x20)
2. Copy the config
3. Generate submission with it
4. Note the time taken and ZIP size

### 5. Monitor Server Logs

Keep the terminal with the server running visible to see:

-   Request logs (method, path, status, response time)
-   Any errors or warnings
-   Temp directory cleanup logs

## Troubleshooting

### Connection Refused

**Error:** `Error: connect ECONNREFUSED`
**Solution:** Make sure the server is running (`npm run start:server`)

### Large Response Times

**Cause:** Generating large submissions (20+ keywords)
**Normal:** 2-5 seconds for large submissions
**Action:** Check server logs for progress

### Invalid JSON Error

**Error:** `SyntaxError: Unexpected token`
**Solution:**

-   Check JSON syntax in request body
-   Ensure all quotes are properly closed
-   Use Postman's JSON validator (Beautify button)

### Download Not Working

**Issue:** ZIP file not downloading
**Solution:**

-   Use "Send and Download" button (not just "Send")
-   Check browser/Postman download settings
-   Try "Save Response" > "Save to a file"

## Advanced Testing

### Using Newman (CLI)

Run the entire collection from command line:

```bash
# Install Newman
npm install -g newman

# Run collection
newman run eCTD-Generator-API.postman_collection.json
```

### Automated Tests

Add test scripts to requests in Postman:

```javascript
// Test that response is successful
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Test response structure
pm.test("Response has success field", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("success");
    pm.expect(jsonData.success).to.be.true;
});

// Save data for next request
var jsonData = pm.response.json();
pm.environment.set("myConfig", JSON.stringify(jsonData.config));
```

## Need Help?

-   Check server logs for detailed error messages
-   Visit `http://localhost:3000/api/docs` for API documentation
-   Review the main README.md for API details
-   Check `examples/` directory for more code examples
