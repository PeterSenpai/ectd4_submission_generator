/**
 * Temporary File Management Utility
 * Handles creation and cleanup of temporary directories
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const TEMP_BASE_DIR = path.join(__dirname, '..', 'temp');

/**
 * Ensure temp base directory exists
 */
function ensureTempDir() {
    if (!fs.existsSync(TEMP_BASE_DIR)) {
        fs.mkdirSync(TEMP_BASE_DIR, { recursive: true });
    }
}

/**
 * Create a unique temporary directory
 * @returns {string} Path to the created temp directory
 */
function createTempDir() {
    ensureTempDir();
    const tempId = uuidv4();
    const tempPath = path.join(TEMP_BASE_DIR, tempId);
    fs.mkdirSync(tempPath, { recursive: true });
    return tempPath;
}

/**
 * Remove a directory recursively
 * @param {string} dirPath - Directory to remove
 */
function removeDirRecursive(dirPath) {
    if (fs.existsSync(dirPath)) {
        fs.rmSync(dirPath, { recursive: true, force: true });
    }
}

/**
 * Clean up a temporary directory
 * @param {string} tempPath - Path to temp directory
 */
function cleanupTempDir(tempPath) {
    try {
        removeDirRecursive(tempPath);
    } catch (error) {
        console.error(`Failed to cleanup temp directory ${tempPath}:`, error);
    }
}

/**
 * Clean up all temporary directories
 */
function cleanupAllTempDirs() {
    try {
        if (fs.existsSync(TEMP_BASE_DIR)) {
            const entries = fs.readdirSync(TEMP_BASE_DIR);
            for (const entry of entries) {
                const entryPath = path.join(TEMP_BASE_DIR, entry);
                removeDirRecursive(entryPath);
            }
        }
    } catch (error) {
        console.error('Failed to cleanup all temp directories:', error);
    }
}

/**
 * Clean up old temporary directories (older than specified hours)
 * @param {number} hours - Age threshold in hours
 */
function cleanupOldTempDirs(hours = 1) {
    try {
        if (!fs.existsSync(TEMP_BASE_DIR)) {
            return;
        }

        const now = Date.now();
        const maxAge = hours * 60 * 60 * 1000; // Convert to milliseconds

        const entries = fs.readdirSync(TEMP_BASE_DIR);
        for (const entry of entries) {
            const entryPath = path.join(TEMP_BASE_DIR, entry);
            const stats = fs.statSync(entryPath);
            const age = now - stats.mtimeMs;

            if (age > maxAge) {
                removeDirRecursive(entryPath);
            }
        }
    } catch (error) {
        console.error('Failed to cleanup old temp directories:', error);
    }
}

module.exports = {
    createTempDir,
    cleanupTempDir,
    cleanupAllTempDirs,
    cleanupOldTempDirs,
    TEMP_BASE_DIR
};
