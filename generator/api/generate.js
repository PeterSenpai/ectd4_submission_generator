/**
 * Submission Generation API Routes
 */

const express = require("express");
const path = require("path");
const {
    generateEctdSubmission,
    generateDefaultSubmission,
} = require("../src/core/generator");
const { createTempDir } = require("../utils/tempFiles");
const { createZipStream } = require("../utils/zipGenerator");
const { createError } = require("../middleware/errorHandler");

const router = express.Router();

/**
 * POST /api/generate/default
 * Generate submission with default configuration and return as ZIP
 */
router.post("/default", async (req, res, next) => {
    let tempDir = null;

    try {
        // Create temporary directory
        tempDir = createTempDir();
        req.tempDir = tempDir;

        // Generate submission
        const result = await generateDefaultSubmission(tempDir, {
            generatePDFs: true,
        });

        // Get the submission directory (e.g., NDA123456/1)
        const submissionDir = result.paths.sequence;

        // Create filename
        const appNumber = result.config?.application?.number || "submission";
        const sequenceNum = result.config?.submission?.sequenceNumber || 1;
        const filename = `${appNumber}_seq${sequenceNum}.zip`;

        // Stream ZIP to response
        await createZipStream(submissionDir, res, filename);
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/generate/custom
 * Generate submission with custom configuration and return as ZIP
 * Body: { config: {...}, options: { generatePDFs: true } }
 */
router.post("/custom", async (req, res, next) => {
    let tempDir = null;

    try {
        const { config, options = {} } = req.body;

        if (!config) {
            throw createError("Configuration is required in request body", 400);
        }

        // Create temporary directory
        tempDir = createTempDir();
        req.tempDir = tempDir;

        // Generate submission
        const result = await generateEctdSubmission(config, tempDir, {
            generatePDFs: options.generatePDFs !== false,
        });

        // Get the submission directory
        const submissionDir = result.paths.sequence;

        // Create filename
        const appNumber = config.application?.number || "submission";
        const sequenceNum = config.submission?.sequenceNumber || 1;
        const filename = `${appNumber}_seq${sequenceNum}.zip`;

        // Stream ZIP to response
        await createZipStream(submissionDir, res, filename);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
