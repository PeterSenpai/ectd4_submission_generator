/**
 * Configuration API Routes
 */

const express = require('express');
const { validate, getDefault } = require('../src/core/generator');
const { generateConfiguration } = require('../src/core/configGenerator');
const { createError } = require('../middleware/errorHandler');

const router = express.Router();

/**
 * GET /api/config/default
 * Get the default configuration
 */
router.get('/default', (req, res) => {
    const defaultConfig = getDefault();
    
    res.json({
        success: true,
        config: defaultConfig
    });
});

/**
 * POST /api/config/generate
 * Generate a configuration with specified parameters
 * Body: { manufacturer: 10, productName: 10, nda: "123456", sponsor: "..." }
 */
router.post('/generate', (req, res, next) => {
    try {
        const { manufacturer, productName, nda, sponsor } = req.body;

        // Validate parameters
        if (!manufacturer || !productName) {
            throw createError('Both manufacturer and productName are required', 400);
        }

        const manuCount = parseInt(manufacturer, 10);
        const prodCount = parseInt(productName, 10);

        if (isNaN(manuCount) || manuCount < 1) {
            throw createError('manufacturer must be a positive integer', 400);
        }

        if (isNaN(prodCount) || prodCount < 1) {
            throw createError('productName must be a positive integer', 400);
        }

        // Generate configuration
        const config = generateConfiguration({
            manufacturer: manuCount,
            productName: prodCount,
            nda: nda || '999888',
            sponsor: sponsor || 'Global Pharmaceuticals Inc'
        });

        res.json({
            success: true,
            config: config,
            metadata: {
                manufacturerKeywords: manuCount,
                productKeywords: prodCount,
                totalKeywords: manuCount + prodCount,
                totalDocuments: config.documents.length
            }
        });

    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/config/validate
 * Validate a configuration object
 * Body: { config: {...} }
 */
router.post('/validate', (req, res, next) => {
    try {
        const { config } = req.body;

        if (!config) {
            throw createError('Configuration is required in request body', 400);
        }

        // Validate configuration
        const validation = validate(config);

        res.json({
            success: true,
            valid: validation.valid,
            errors: validation.errors
        });

    } catch (error) {
        next(error);
    }
});

module.exports = router;
