# eCTD 4.0 Submission Generator

A full-stack application for generating valid eCTD 4.0 submission packages compliant with ICH eCTD v4.0 IG v1.5 and USFDA eCTD v4.0 IG v1.5.1.

## Project Structure

```
generator/
├── backend/                    # Backend API and CLI
│   ├── server.js               # Express API server
│   ├── api/                    # API route handlers
│   ├── middleware/             # Express middleware
│   ├── utils/                  # Backend utilities
│   ├── src/                    # Core generator logic
│   │   ├── builders/           # XML, PDF, directory builders
│   │   ├── config/             # Schema and code systems
│   │   ├── core/               # Generator and config logic
│   │   ├── templates/          # XML templates
│   │   └── utils/              # Hash and UUID utilities
│   ├── examples/               # API usage examples
│   ├── postman/                # Postman collection
│   ├── generate-config.js      # Config generator CLI
│   └── package.json            # Backend dependencies
├── frontend/                   # React web application
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── lib/                # API client and utilities
│   │   └── types/              # TypeScript types
│   └── package.json            # Frontend dependencies
├── output/                     # Generated submissions
├── temp/                       # Temporary files
└── package.json                # Root package with scripts
```

## Quick Start

### Install Dependencies

```bash
# Install all dependencies (backend + frontend)
npm run install:all

# Or install separately
npm run backend:install
npm run frontend:install
```

### Start Development Servers

**Terminal 1 - Backend API (port 3000):**
```bash
npm run backend:start
```

**Terminal 2 - Frontend (port 5173):**
```bash
npm run frontend:start
```

Then open http://localhost:5173 in your browser.

## Features

### Web Interface (Frontend)

- **Keyword Mode**: Quickly generate submissions by specifying keyword counts
  - Manufacturer keywords
  - Product name keywords
  - Study ID keywords
  - Auto-generate corresponding documents

- **Document Mode**: Full control over document creation
  - Define custom keywords
  - Create documents with specific modules (m1-m5)
  - Associate keywords with documents

- **Output Options**:
  - Preview configuration JSON
  - Download configuration file
  - Generate and download submission ZIP

### REST API (Backend)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/schema` | GET | Get JSON schema |
| `/api/config/default` | GET | Get default configuration |
| `/api/config/generate` | POST | Generate configuration from parameters |
| `/api/config/validate` | POST | Validate a configuration |
| `/api/generate/default` | POST | Generate submission with defaults |
| `/api/generate/custom` | POST | Generate submission with custom config |

### CLI Tool

```bash
cd backend

# Generate with default config
npm start -- --default

# Generate with custom config
npm start -- -i config.json -o ./output

# Generate large config
npm run generate-config -- --manufacturer 20 --productName 10
```

## Configuration Format

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
        }
    },
    "documents": [
        {
            "module": "m1",
            "type": "356h",
            "title": "Form FDA 356h"
        },
        {
            "module": "m3",
            "type": "product_info",
            "title": "Product Information",
            "keywordRefs": ["MANU_001", "PROD_001"]
        }
    ],
    "keywords": [
        {
            "type": "manufacturer",
            "code": "MANU_001",
            "codeSystem": "2.16.840.1.113883.9999.2",
            "displayName": "Manufacturing Site 1"
        }
    ]
}
```

## Supported Types

### Document Types

| Type | Module | Description |
|------|--------|-------------|
| `356h` | m1 | FDA Form 356h |
| `cover` | m1 | Cover Letter |
| `product_info` | m3 | Drug Product Information |
| `bioavailability` | m5 | BA/BE Study Reports |

### Keyword Types

| Type | Description |
|------|-------------|
| `studyId` | Clinical Study Identifier |
| `productName` | Drug Product Name |
| `manufacturer` | Manufacturing Site |

### Lifecycle Operations

| Operation | Description |
|-----------|-------------|
| `new` | New document (default) |
| `replace` | Replaces existing document |
| `append` | Appends to existing content |
| `delete` | Withdraws/suspends content |

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

## API Examples

### Generate Configuration

```bash
curl -X POST http://localhost:3000/api/config/generate \
  -H "Content-Type: application/json" \
  -d '{"manufacturer": 10, "productName": 5}'
```

### Generate Submission ZIP

```bash
curl -X POST http://localhost:3000/api/generate/default \
  --output submission.zip
```

### Validate Configuration

```bash
curl -X POST http://localhost:3000/api/config/validate \
  -H "Content-Type: application/json" \
  -d '{"config": {...}}'
```

## Compliance

This generator produces submissions conformant to:

- ICH eCTD v4.0 Implementation Guide v1.5
- US FDA eCTD v4.0 Implementation Guide v1.5.1
- HL7 v3 Regulated Product Submission (RPS) Schema

## License

MIT
