# eCTD 4.0 Submission Generator

A Node.js command-line tool for generating valid eCTD 4.0 submission packages compliant with ICH eCTD v4.0 IG v1.5 and USFDA eCTD v4.0 IG v1.5.1.

## Features

- Generates compliant `submissionunit.xml` following HL7 v3 RPS schema
- Creates proper directory structure for CTD modules (m1-m5)
- Generates placeholder PDF documents for testing
- Calculates SHA256 checksums and creates `sha256.txt`
- Supports lifecycle operations (new, replace, append, delete/withdraw)
- Generates sender-defined keywords (Study ID, Product Name, Manufacturer)
- Validates input configuration against JSON schema

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

| Type | Module | Description |
|------|--------|-------------|
| `356h` | m1 | FDA Form 356h |
| `cover` | m1 | Cover Letter |
| `2253` | m1 | FDA Form 2253 (Promotional) |
| `product_info` | m3 | Drug Product Information |
| `bioavailability` | m5 | BA/BE Study Reports |
| `clinical_study` | m5 | Clinical Study Reports |

## Lifecycle Operations

| Operation | Description |
|-----------|-------------|
| `new` | New document (default) |
| `replace` | Replaces existing document (requires `replacesId`) |
| `append` | Appends to existing content |
| `delete` | Withdraws/suspends content |

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

| Type | ICH Code | Description |
|------|----------|-------------|
| `studyId` | `ich_keyword_type_8` | Clinical Study Identifier |
| `productName` | `ich_keyword_type_4` | Drug Product Name |
| `manufacturer` | `ich_keyword_type_3` | Manufacturing Site |
| `materialId` | `us_keyword_definition_type_1` | Promotional Material ID |
| `issueDate` | `us_keyword_definition_type_2` | Issue Date |

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

## Compliance

This generator produces submissions conformant to:
- ICH eCTD v4.0 Implementation Guide v1.5
- US FDA eCTD v4.0 Implementation Guide v1.5.1
- HL7 v3 Regulated Product Submission (RPS) Schema

## License

MIT
