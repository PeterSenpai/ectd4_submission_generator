/**
 * Global Error Handler Middleware
 * Handles all errors and returns structured error responses
 */

/**
 * Error handler middleware
 * @param {Error} err - Error object
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {function} next - Next middleware
 */
function errorHandler(err, req, res, next) {
    console.error('Error occurred:', err);

    // Default error response
    const errorResponse = {
        success: false,
        error: {
            message: err.message || 'Internal server error',
            type: err.name || 'Error'
        }
    };

    // Add validation errors if present
    if (err.validationErrors) {
        errorResponse.error.validationErrors = err.validationErrors;
    }

    // Add stack trace in development
    if (process.env.NODE_ENV !== 'production') {
        errorResponse.error.stack = err.stack;
    }

    // Determine status code
    let statusCode = err.statusCode || 500;

    // Handle specific error types
    if (err.name === 'ValidationError') {
        statusCode = 400;
    } else if (err.name === 'SyntaxError' && err.status === 400) {
        statusCode = 400;
        errorResponse.error.message = 'Invalid JSON in request body';
    }

    res.status(statusCode).json(errorResponse);
}

/**
 * Create a custom error with status code
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @returns {Error}
 */
function createError(message, statusCode = 500) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

/**
 * Create a validation error
 * @param {string} message - Error message
 * @param {Array} validationErrors - Validation error details
 * @returns {Error}
 */
function createValidationError(message, validationErrors) {
    const error = new Error(message);
    error.name = 'ValidationError';
    error.statusCode = 400;
    error.validationErrors = validationErrors;
    return error;
}

/**
 * Not found handler (404)
 * @param {object} req - Express request
 * @param {object} res - Express response
 */
function notFoundHandler(req, res) {
    res.status(404).json({
        success: false,
        error: {
            message: `Route not found: ${req.method} ${req.path}`,
            type: 'NotFoundError'
        }
    });
}

module.exports = {
    errorHandler,
    createError,
    createValidationError,
    notFoundHandler
};
