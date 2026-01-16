# eCTD 4.0 Submission Generator Frontend

A React-based web interface for generating eCTD 4.0 submission packages.

## Features

### Two Generation Modes

#### 1. Keyword Mode

Quickly generate submissions by specifying keyword counts:

-   **Manufacturer Keywords** - Define manufacturing site identifiers
-   **Product Name Keywords** - Define drug product identifiers
-   **Study ID Keywords** - Define clinical study identifiers
-   **Auto-generate Documents** - Automatically create Module 3 documents for each keyword

#### 2. Document Mode

Full control over document creation:

-   Define custom keywords with types (manufacturer, product, study)
-   Create documents with specific modules (m1-m5) and types
-   Associate keywords with documents using a visual interface

### Output Options

-   **Preview Config** - View the generated JSON configuration before submission
-   **Download Config** - Save the configuration as a JSON file
-   **Generate ZIP** - Create and download the complete eCTD submission package

## Tech Stack

-   **React 19** - UI library
-   **Vite 7** - Build tool and dev server
-   **TypeScript** - Type safety
-   **Tailwind CSS 4** - Styling
-   **Shadcn/ui** - Component library
-   **Lucide React** - Icons

## Getting Started

### Prerequisites

-   Node.js 18+
-   Backend API running on `http://localhost:3000`

### Installation

```bash
# From the generator directory
npm run frontend:install

# Or directly
cd frontend
npm install
```

### Development

```bash
# Start the frontend dev server (runs on port 5173)
npm run frontend:dev

# Or directly
cd frontend
npm run dev
```

Make sure the backend API is also running:

```bash
# In a separate terminal, from the generator directory
npm run start:server
```

### Build

```bash
npm run frontend:build
```

The built files will be in `frontend/dist/`.

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/                 # Shadcn UI components
│   │   ├── MetadataForm.tsx    # Application metadata inputs
│   │   ├── KeywordMode.tsx     # Keyword-based generation
│   │   ├── DocumentMode.tsx    # Document-based generation
│   │   ├── DocumentItem.tsx    # Individual document editor
│   │   ├── ConfigPreview.tsx   # JSON preview modal
│   │   └── OutputActions.tsx   # Generation buttons
│   ├── lib/
│   │   ├── api.ts              # API client functions
│   │   └── utils.ts            # Utility functions
│   ├── types/
│   │   └── config.ts           # TypeScript type definitions
│   ├── App.tsx                 # Main application component
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## API Integration

The frontend communicates with the backend API:

| Action              | Endpoint               | Method |
| ------------------- | ---------------------- | ------ |
| Generate config     | `/api/config/generate` | POST   |
| Validate config     | `/api/config/validate` | POST   |
| Get default config  | `/api/config/default`  | GET    |
| Generate submission | `/api/generate/custom` | POST   |

During development, Vite proxies `/api` requests to `http://localhost:3000`.

## Usage Guide

### Keyword Mode (Quick Start)

1. Enter your NDA number and sponsor name
2. Enable the keyword types you need (manufacturer, product, study)
3. Set the count for each keyword type
4. Enable "Auto-generate Documents" if you want matching documents
5. Click "Preview Config" to review or "Generate Submission ZIP" to download

### Document Mode (Full Control)

1. Enter your application metadata
2. Switch to the "Document Mode" tab
3. Add keywords using the form at the top
4. Click "Add Document" to create documents
5. Fill in document details and associate keywords
6. Generate your submission

## Customization

### Theme

The app uses a dark theme by default. CSS variables are defined in `src/index.css`.

### Adding New Document Types

Edit `src/components/DocumentItem.tsx` to add new document type options:

```typescript
const DOCUMENT_TYPE_OPTIONS: { value: DocumentType; label: string }[] = [
    { value: "356h", label: "Form FDA 356h" },
    { value: "cover", label: "Cover Letter" },
    // Add new types here
];
```

### Adding New Keyword Types

1. Update the `KeywordType` type in `src/types/config.ts`
2. Add the option in `DocumentMode.tsx` and `KeywordMode.tsx`
