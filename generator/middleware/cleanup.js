/**
 * Cleanup Middleware
 * Handles cleanup of temporary files after response is sent
 */

const { cleanupTempDir } = require('../utils/tempFiles');

/**
 * Middleware to cleanup temp directory after response
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {function} next - Next middleware
 */
function cleanupMiddleware(req, res, next) {
    // Store original end function
    const originalEnd = res.end;

    // Override end function
    res.end = function(...args) {
        // Call original end
        originalEnd.apply(res, args);

        // Cleanup temp directory if it exists
        if (req.tempDir) {
            setImmediate(() => {
                cleanupTempDir(req.tempDir);
            });
        }
    };

    next();
}

/**
 * Attach temp directory to request for cleanup
 * @param {string} tempDir - Temp directory path
 * @returns {function} Middleware function
 */
function attachTempDir(tempDir) {
    return (req, res, next) => {
        req.tempDir = tempDir;
        next();
    };
}

module.exports = {
    cleanupMiddleware,
    attachTempDir
};
