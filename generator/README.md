# eCTD 4.0 Submission Generator

A Node.js command-line tool and REST API server for generating valid eCTD 4.0 submission packages compliant with ICH eCTD v4.0 IG v1.5 and USFDA eCTD v4.0 IG v1.5.1.

## Features

-   Generates compliant `submissionunit.xml` following HL7 v3 RPS schema
-   Creates proper directory structure for CTD modules (m1-m5)
-   Generates placeholder PDF documents for testing
-   Calculates SHA256 checksums and creates `sha256.txt`
-   Supports lifecycle operations (new, replace, append, delete/withdraw)
-   Generates sender-defined keywords (Study ID, Product Name, Manufacturer)
-   Validates input configuration against JSON schema
-   **REST API server** for programmatic access and integration
-   Dynamic configuration generator with customizable keyword counts

## Installation

```bash
cd generator
npm install
```

## Usage

### Generate with Default Configuration

```bash
npm start -- --default
```

### Generate with Custom Configuration

```bash
npm start -- -i config.json -o ./output
```

### Print Default Configuration

```bash
npm start -- --print-default > my-config.json
```

### Print Configuration Schema

```bash
npm start -- --print-schema
```

### Skip PDF Generation

```bash
npm start -- --default --no-samples
```

## Configuration Generator

A powerful tool to dynamically generate configuration files with specified numbers of keywords and documents.

### Generate Custom Configuration

```bash
node generate-config.js --manufacturer <count> --productName <count> [options]
```

Or using npm:

```bash
npm run generate-config -- --manufacturer <count> --productName <count> [options]
```

### Options

-   `-m, --manufacturer <number>` - Number of manufacturer keywords to generate (required)
-   `-p, --productName <number>` - Number of product name keywords to generate (required)
-   `-o, --output <path>` - Output configuration file path (default: `generated-config.json`)
-   `-n, --nda <number>` - NDA application number (default: `999888`)
-   `-s, --sponsor <name>` - Sponsor organization name (default: `Global Pharmaceuticals Inc`)

### Examples

Generate a config with 10 manufacturers and 10 products:

```bash
node generate-config.js --manufacturer 10 --productName 10
```

Generate a config with custom output file and NDA number:

```bash
node generate-config.js -m 20 -p 15 -o my-config.json -n 123456 -s "My Pharma Inc"
```

The generator will automatically:

-   Create unique manufacturer keywords (MANU_001, MANU_002, etc.) with realistic names
-   Create unique product name keywords (PROD_001, PROD_002, etc.) with drug names and strengths
-   Generate documents in module 3 that reference these keywords
-   Create pairs of documents (formulation + stability) for each product
-   Cross-reference keywords to ensure proper eCTD structure

### What Gets Generated

For example, with `--manufacturer 5 --productName 3`, you get:

-   **8 keywords**: 5 manufacturer + 3 product name
-   **12 documents**: 2 in m1 + 10 in m3 (5 pairs of formulation/stability docs)
-   Each m3 document references both a manufacturer and product keyword

## Configuration File Format

```json
{
    "application": {
        "type": "NDA",
        "number": "123456",
        "sponsor": "Sample Pharmaceuticals Inc"
    },
    "submission": {
        "type": "original",
        "sequenceNumber": 1,
        "title": "Original Application"
    },
    "contacts": {
        "regulatory": {
            "firstName": "Jane",
            "lastName": "Smith",
            "email": "jane.smith@sample.com",
            "phone": "+1(555)123-4567",
            "organization": "Sample Pharmaceuticals Inc"
        },
        "technical": {
            "firstName": "John",
            "lastName": "Doe",
            "email": "john.doe@sample.com"
        }
    },
    "documents": [
        {
            "module": "m1",
            "type": "356h",
            "title": "Form FDA 356h"
        },
        {
            "module": "m1",
            "type": "cover",
            "title": "Cover Letter"
        },
        {
            "module": "m5",
            "type": "bioavailability",
            "title": "Bioavailability Study Report",
            "keywordRefs": ["STUDY_001"]
        }
    ],
    "keywords": [
        {
            "type": "studyId",
            "code": "STUDY_001",
            "codeSystem": "2.16.840.1.113883.9999.1",
            "displayName": "Pivotal BA Study"
        }
    ]
}
```

## Document Types

| Type              | Module | Description                 |
| ----------------- | ------ | --------------------------- |
| `356h`            | m1     | FDA Form 356h               |
| `cover`           | m1     | Cover Letter                |
| `2253`            | m1     | FDA Form 2253 (Promotional) |
| `product_info`    | m3     | Drug Product Information    |
| `bioavailability` | m5     | BA/BE Study Reports         |
| `clinical_study`  | m5     | Clinical Study Reports      |

## Lifecycle Operations

| Operation | Description                                        |
| --------- | -------------------------------------------------- |
| `new`     | New document (default)                             |
| `replace` | Replaces existing document (requires `replacesId`) |
| `append`  | Appends to existing content                        |
| `delete`  | Withdraws/suspends content                         |

### Example: Replace Operation

```json
{
    "module": "m5",
    "type": "bioavailability",
    "title": "Revised Study Report",
    "operation": "replace",
    "replacesId": "uuid-of-original-context-of-use"
}
```

## Keyword Types

| Type           | ICH Code                       | Description               |
| -------------- | ------------------------------ | ------------------------- |
| `studyId`      | `ich_keyword_type_8`           | Clinical Study Identifier |
| `productName`  | `ich_keyword_type_4`           | Drug Product Name         |
| `manufacturer` | `ich_keyword_type_3`           | Manufacturing Site        |
| `materialId`   | `us_keyword_definition_type_1` | Promotional Material ID   |
| `issueDate`    | `us_keyword_definition_type_2` | Issue Date                |

## Sample Configurations

### Large Scale Submission Example

A sample configuration (`sample-large-config.json`) is provided that demonstrates:

-   **40 Keywords**: 20 manufacturer keywords + 20 product name keywords
-   **40 Module 3 Documents**: Each document references a manufacturer and product name keyword
-   **Real-world scenario**: Multiple products from different manufacturing sites

To generate this large-scale example:

```bash
node src/index.js --input sample-large-config.json
```

This will generate:

-   42 total documents (2 in m1, 40 in m3)
-   40 keyword definitions in the application section
-   80 keyword references across m3 documents
-   Complete cross-referencing structure

## Output Structure

```
output/
└── NDA123456/
    └── 1/
        ├── m1/
        │   ├── 356h_123456_1.pdf
        │   └── cover-123456_1.pdf
        ├── m2/
        ├── m3/
        │   └── product_info.pdf
        ├── m4/
        ├── m5/
        │   └── bioavailability_study_report.pdf
        ├── sha256.txt
        └── submissionunit.xml
```

## REST API Server

The generator includes a REST API server for programmatic access to all functionality.

### Starting the Server

```bash
npm run start:server
```

The server will start on port 3000 (configurable via `PORT` environment variable).

### API Endpoints

#### Health Check

```bash
GET /health
```

Returns server health status.

#### Get JSON Schema

```bash
GET /api/schema
```

Returns the JSON schema for submission configuration.

**Example:**

```bash
curl http://localhost:3000/api/schema
```

#### Get Default Configuration

```bash
GET /api/config/default
```

Returns the default configuration object.

**Example:**

```bash
curl http://localhost:3000/api/config/default > default-config.json
```

#### Generate Configuration

```bash
POST /api/config/generate
Content-Type: application/json

{
  "manufacturer": 10,
  "productName": 5,
  "nda": "123456",
  "sponsor": "My Pharma Inc"
}
```

Generates a configuration with specified number of keywords.

**Example:**

```bash
curl -X POST http://localhost:3000/api/config/generate \
  -H "Content-Type: application/json" \
  -d '{"manufacturer": 10, "productName": 5}' \
  -o generated-config.json
```

#### Validate Configuration

```bash
POST /api/config/validate
Content-Type: application/json

{
  "config": { ... }
}
```

Validates a configuration object and returns validation results.

**Example:**

```bash
curl -X POST http://localhost:3000/api/config/validate \
  -H "Content-Type: application/json" \
  -d @my-config.json
```

#### Generate Submission with Default Config

```bash
POST /api/generate/default
```

Generates a submission package with default configuration and returns it as a ZIP file.

**Example:**

```bash
curl -X POST http://localhost:3000/api/generate/default \
  --output submission.zip
```

#### Generate Submission with Custom Config

```bash
POST /api/generate/custom
Content-Type: application/json

{
  "config": { ... },
  "options": {
    "generatePDFs": true
  }
}
```

Generates a submission package with custom configuration and returns it as a ZIP file.

**Example:**

```bash
# First generate a config
curl -X POST http://localhost:3000/api/config/generate \
  -H "Content-Type: application/json" \
  -d '{"manufacturer": 5, "productName": 3}' \
  -o config.json

# Then generate submission with that config
curl -X POST http://localhost:3000/api/generate/custom \
  -H "Content-Type: application/json" \
  -d @config.json \
  --output custom-submission.zip
```

### API Response Format

Success responses:

```json
{
    "success": true,
    "data": { ... }
}
```

Error responses:

```json
{
    "success": false,
    "error": {
        "message": "Error description",
        "type": "ErrorType",
        "validationErrors": [ ... ]
    }
}
```

### API Documentation

Visit `http://localhost:3000/api/docs` for interactive API documentation when the server is running.

## Compliance

This generator produces submissions conformant to:

-   ICH eCTD v4.0 Implementation Guide v1.5
-   US FDA eCTD v4.0 Implementation Guide v1.5.1
-   HL7 v3 Regulated Product Submission (RPS) Schema

## License

MIT
