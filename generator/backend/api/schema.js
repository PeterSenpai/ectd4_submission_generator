/**
 * Schema and Metadata API Routes
 */

const express = require('express');
const { getSchema, getDefault } = require('../src/core/generator');

const router = express.Router();

/**
 * GET /api/schema
 * Get the JSON schema for submission configuration
 */
router.get('/', (req, res) => {
    const schema = getSchema();
    
    res.json({
        success: true,
        schema: schema
    });
});

module.exports = router;
