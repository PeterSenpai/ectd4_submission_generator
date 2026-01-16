/**
 * SHA256 Hash Utilities for eCTD 4.0 Submissions
 * Calculates file checksums for integrity verification
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * Calculate SHA256 hash of a file
 * @param {string} filePath - Path to the file
 * @returns {Promise<string>} - Lowercase hex string of SHA256 hash
 */
async function calculateFileHash(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    
    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', (err) => reject(err));
  });
}

/**
 * Calculate SHA256 hash of a buffer
 * @param {Buffer} buffer - Buffer containing data
 * @returns {string} - Lowercase hex string of SHA256 hash
 */
function calculateBufferHash(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

/**
 * Calculate hashes for all files in a directory (recursively)
 * @param {string} dirPath - Path to directory
 * @param {string} basePath - Base path for relative file paths (optional)
 * @returns {Promise<Array<{path: string, hash: string}>>} - Array of file paths and their hashes
 */
async function calculateDirectoryHashes(dirPath, basePath = dirPath) {
  const results = [];
  
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      // Recursively process subdirectories
      const subResults = await calculateDirectoryHashes(fullPath, basePath);
      results.push(...subResults);
    } else if (entry.isFile()) {
      // Skip certain files
      if (entry.name === 'submissionunit.xml' || entry.name === 'sha256.txt') {
        continue;
      }
      
      const hash = await calculateFileHash(fullPath);
      const relativePath = path.relative(basePath, fullPath);
      results.push({
        path: relativePath.replace(/\\/g, '/'), // Use forward slashes
        hash: hash
      });
    }
  }
  
  return results;
}

/**
 * Generate sha256.txt content from hash results
 * @param {Array<{path: string, hash: string}>} hashes - Array of file paths and their hashes
 * @returns {string} - Content for sha256.txt file
 */
function generateSha256FileContent(hashes) {
  // Sort by path for consistent output
  const sorted = [...hashes].sort((a, b) => a.path.localeCompare(b.path));
  
  // Format: hash *filepath (GNU coreutils format)
  return sorted.map(({ path, hash }) => `${hash} *${path}`).join('\n') + '\n';
}

/**
 * Write sha256.txt file to directory
 * @param {string} dirPath - Directory path
 * @param {Array<{path: string, hash: string}>} hashes - Array of file paths and their hashes
 * @returns {Promise<void>}
 */
async function writeSha256File(dirPath, hashes) {
  const content = generateSha256FileContent(hashes);
  const filePath = path.join(dirPath, 'sha256.txt');
  fs.writeFileSync(filePath, content);
}

module.exports = {
  calculateFileHash,
  calculateBufferHash,
  calculateDirectoryHashes,
  generateSha256FileContent,
  writeSha256File
};
