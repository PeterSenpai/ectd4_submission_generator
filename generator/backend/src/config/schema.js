/**
 * JSON Schema for eCTD 4.0 Submission Configuration
 * Validates input configuration using AJV
 */

const Ajv = require("ajv");

// JSON Schema for submission configuration
const submissionSchema = {
    type: "object",
    required: ["application", "submission"],
    properties: {
        application: {
            type: "object",
            required: ["type", "number", "sponsor"],
            properties: {
                type: {
                    type: "string",
                    enum: ["NDA", "ANDA", "BLA", "IND", "DMF"],
                    description: "Application type",
                },
                number: {
                    type: "string",
                    pattern: "^[0-9]{6}$",
                    description: "Six-digit application number",
                },
                sponsor: {
                    type: "string",
                    minLength: 1,
                    description: "Sponsor organization name",
                },
            },
        },
        submission: {
            type: "object",
            required: ["type", "sequenceNumber", "title"],
            properties: {
                type: {
                    type: "string",
                    enum: [
                        "original",
                        "amendment",
                        "supplement",
                        "annual_report",
                    ],
                    description: "Submission type",
                },
                sequenceNumber: {
                    type: "integer",
                    minimum: 1,
                    description: "Sequence number (positive integer)",
                },
                title: {
                    type: "string",
                    minLength: 1,
                    description: "Submission title",
                },
            },
        },
        contacts: {
            type: "object",
            properties: {
                regulatory: {
                    $ref: "#/$defs/contact",
                },
                technical: {
                    $ref: "#/$defs/contact",
                },
            },
        },
        documents: {
            type: "array",
            items: {
                $ref: "#/$defs/document",
            },
            description: "List of documents in the submission",
        },
        keywords: {
            type: "array",
            items: {
                $ref: "#/$defs/keyword",
            },
            description: "Sender-defined keywords",
        },
    },
    $defs: {
        contact: {
            type: "object",
            required: ["firstName", "lastName", "email"],
            properties: {
                firstName: {
                    type: "string",
                    minLength: 1,
                },
                middleName: {
                    type: "string",
                },
                lastName: {
                    type: "string",
                    minLength: 1,
                },
                email: {
                    type: "string",
                    format: "email",
                },
                phone: {
                    type: "string",
                },
                fax: {
                    type: "string",
                },
                mobile: {
                    type: "string",
                },
                organization: {
                    type: "string",
                },
            },
        },
        document: {
            type: "object",
            required: ["module", "type", "title"],
            properties: {
                module: {
                    type: "string",
                    enum: ["m1", "m2", "m3", "m4", "m5"],
                    description: "CTD module",
                },
                type: {
                    type: "string",
                    description:
                        "Document type (e.g., 356h, cover, bioavailability)",
                },
                title: {
                    type: "string",
                    minLength: 1,
                    description: "Document title",
                },
                operation: {
                    type: "string",
                    enum: ["new", "replace", "append", "delete"],
                    default: "new",
                    description: "Lifecycle operation",
                },
                replacesId: {
                    type: "string",
                    description:
                        "UUID of contextOfUse being replaced (required for replace operation)",
                },
                filePath: {
                    type: "string",
                    description:
                        "Path to existing file (optional, will generate placeholder if not provided)",
                },
                keywordRefs: {
                    type: "array",
                    items: {
                        type: "string",
                    },
                    description: "References to keyword codes",
                },
            },
            if: {
                properties: {
                    operation: { const: "replace" },
                },
                required: ["operation"],
            },
            then: {
                required: ["replacesId"],
            },
        },
        keyword: {
            type: "object",
            required: ["type", "code", "codeSystem", "displayName"],
            properties: {
                type: {
                    type: "string",
                    enum: [
                        "studyId",
                        "productName",
                        "manufacturer",
                        "materialId",
                        "issueDate",
                    ],
                    description: "Keyword type",
                },
                code: {
                    type: "string",
                    minLength: 1,
                    description: "Keyword code (sender-defined)",
                },
                codeSystem: {
                    type: "string",
                    pattern: "^[0-9.]+$",
                    description: "Code system OID",
                },
                displayName: {
                    type: "string",
                    minLength: 1,
                    description: "Human-readable display name",
                },
            },
        },
    },
};

// Create AJV instance with formats
const ajv = new Ajv({
    allErrors: true,
    strict: false,
});

// Add email format validation
ajv.addFormat("email", {
    type: "string",
    validate: (x) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x),
});

// Compile schema
const validate = ajv.compile(submissionSchema);

/**
 * Validate submission configuration
 * @param {object} config - Configuration object to validate
 * @returns {{valid: boolean, errors: Array|null}} - Validation result
 */
function validateConfig(config) {
    const valid = validate(config);
    return {
        valid,
        errors: valid ? null : validate.errors,
    };
}

/**
 * Get default configuration with sample data
 * @returns {object} - Default configuration object
 */
function getDefaultConfig() {
    return {
        application: {
            type: "NDA",
            number: "123456",
            sponsor: "Sample Pharmaceuticals Inc",
        },
        submission: {
            type: "original",
            sequenceNumber: 1,
            title: "Original Application",
        },
        contacts: {
            regulatory: {
                firstName: "Jane",
                lastName: "Smith",
                email: "jane.smith@sample.com",
                phone: "+1(555)123-4567",
                organization: "Sample Pharmaceuticals Inc",
            },
            technical: {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@sample.com",
                phone: "+1(555)987-6543",
                organization: "Sample Pharmaceuticals Inc",
            },
        },
        documents: [
            { module: "m1", type: "356h", title: "Form FDA 356h" },
            { module: "m1", type: "cover", title: "Cover Letter" },
            {
                module: "m3",
                type: "product_info",
                title: "Product Information",
                keywordRefs: ["MANU_001", "PROD_NAME_001"],
            },
            {
                module: "m5",
                type: "bioavailability",
                title: "Bioavailability Study Report",
                keywordRefs: ["STUDY_001"],
            },
        ],
        keywords: [
            {
                type: "studyId",
                code: "STUDY_001",
                codeSystem: "2.16.840.1.113883.9999.1",
                displayName: "Pivotal BA Study",
            },
            {
                type: "manufacturer",
                code: "MANU_001",
                codeSystem: "2.16.840.1.113883.9999.2",
                displayName: "Sample Pharmaceuticals Manufacturing Site",
            },
            {
                type: "productName",
                code: "PROD_NAME_001",
                codeSystem: "2.16.840.1.113883.9999.1",
                displayName: "Sample Drug Product XYZ",
            },
        ],
    };
}

module.exports = {
    submissionSchema,
    validateConfig,
    getDefaultConfig,
};
