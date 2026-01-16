/**
 * Core Generator Module
 * Provides programmatic API for generating eCTD submissions
 */

const path = require('path');
const { validateConfig, getDefaultConfig } = require('../config/schema');
const { generateSubmission } = require('../builders/xmlBuilder');

/**
 * Generate an eCTD submission package
 * @param {object} config - Submission configuration
 * @param {string} outputDir - Output directory path
 * @param {object} options - Generation options
 * @param {boolean} options.generatePDFs - Whether to generate placeholder PDFs (default: true)
 * @returns {Promise<object>} Generation result
 */
async function generateEctdSubmission(config, outputDir, options = {}) {
    // Validate configuration
    const validation = validateConfig(config);
    
    if (!validation.valid) {
        const error = new Error('Configuration validation failed');
        error.name = 'ValidationError';
        error.validationErrors = validation.errors;
        throw error;
    }

    // Generate submission
    const result = await generateSubmission(config, outputDir, {
        generateSamples: options.generatePDFs !== false
    });

    if (!result.success) {
        throw new Error('Failed to generate submission package');
    }

    return result;
}

/**
 * Generate submission with default config
 * @param {string} outputDir - Output directory path
 * @param {object} options - Generation options
 * @returns {Promise<object>} Generation result
 */
async function generateDefaultSubmission(outputDir, options = {}) {
    const config = getDefaultConfig();
    return generateEctdSubmission(config, outputDir, options);
}

/**
 * Validate a configuration object
 * @param {object} config - Configuration to validate
 * @returns {object} Validation result with valid boolean and errors array
 */
function validate(config) {
    return validateConfig(config);
}

/**
 * Get the default configuration
 * @returns {object} Default configuration object
 */
function getDefault() {
    return getDefaultConfig();
}

/**
 * Get the JSON schema for configuration
 * @returns {object} JSON schema object
 */
function getSchema() {
    const { submissionSchema } = require('../config/schema');
    return submissionSchema;
}

module.exports = {
    generateEctdSubmission,
    generateDefaultSubmission,
    validate,
    getDefault,
    getSchema
};
