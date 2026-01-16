/**
 * ZIP Generator Utility
 * Creates ZIP archives from directory structures
 */

const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

/**
 * Create a ZIP archive from a directory and stream it to response
 * @param {string} sourceDir - Directory to zip
 * @param {object} res - Express response object
 * @param {string} filename - Name of the ZIP file
 * @returns {Promise<void>}
 */
async function createZipStream(sourceDir, res, filename) {
    return new Promise((resolve, reject) => {
        const archive = archiver('zip', {
            zlib: { level: 9 } // Maximum compression
        });

        // Set response headers
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        // Pipe archive to response
        archive.pipe(res);

        // Handle errors
        archive.on('error', (err) => {
            reject(err);
        });

        // Handle completion
        archive.on('end', () => {
            resolve();
        });

        // Add directory contents to archive
        archive.directory(sourceDir, false);

        // Finalize the archive
        archive.finalize();
    });
}

/**
 * Create a ZIP file from a directory and save to disk
 * @param {string} sourceDir - Directory to zip
 * @param {string} outputPath - Path to save the ZIP file
 * @returns {Promise<void>}
 */
async function createZipFile(sourceDir, outputPath) {
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(outputPath);
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        output.on('close', () => {
            resolve();
        });

        archive.on('error', (err) => {
            reject(err);
        });

        archive.pipe(output);
        archive.directory(sourceDir, false);
        archive.finalize();
    });
}

/**
 * Get the size of a directory recursively
 * @param {string} dirPath - Directory path
 * @returns {number} Size in bytes
 */
function getDirectorySize(dirPath) {
    let size = 0;
    
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
            size += getDirectorySize(filePath);
        } else {
            size += stats.size;
        }
    }
    
    return size;
}

module.exports = {
    createZipStream,
    createZipFile,
    getDirectorySize
};
