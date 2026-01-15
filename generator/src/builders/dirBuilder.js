/**
 * Directory Builder for eCTD 4.0 Submissions
 * Creates the required directory structure for submission packages
 */

const fs = require('fs');
const path = require('path');

/**
 * Create the eCTD submission directory structure
 * @param {string} outputDir - Base output directory
 * @param {string} appNumber - Application number (e.g., '111111')
 * @param {number} sequenceNumber - Sequence number
 * @returns {object} - Paths to created directories
 */
function createSubmissionStructure(outputDir, appNumber, sequenceNumber) {
  // Create the main submission directory: NDA{number}/{sequence}/
  const appDir = path.join(outputDir, `NDA${appNumber}`);
  const seqDir = path.join(appDir, String(sequenceNumber));
  
  // Create module directories
  const modules = {
    m1: path.join(seqDir, 'm1'),
    m2: path.join(seqDir, 'm2'),
    m3: path.join(seqDir, 'm3'),
    m4: path.join(seqDir, 'm4'),
    m5: path.join(seqDir, 'm5')
  };
  
  // Create all directories
  Object.values(modules).forEach(dir => {
    fs.mkdirSync(dir, { recursive: true });
  });
  
  return {
    base: outputDir,
    application: appDir,
    sequence: seqDir,
    modules
  };
}

/**
 * Get the file path for a document based on its module and type
 * @param {object} paths - Paths object from createSubmissionStructure
 * @param {object} doc - Document configuration
 * @param {string} appNumber - Application number
 * @param {number} sequenceNumber - Sequence number
 * @returns {string} - Full file path
 */
function getDocumentPath(paths, doc, appNumber, sequenceNumber) {
  const moduleDir = paths.modules[doc.module];
  
  // Generate filename based on document type
  let filename;
  switch (doc.type) {
    case '356h':
      filename = `356h_${appNumber}_${sequenceNumber}.pdf`;
      break;
    case 'cover':
      filename = `cover-${appNumber}_${sequenceNumber}.pdf`;
      break;
    case '2253':
      filename = `2253-nda${appNumber}_${sequenceNumber}.pdf`;
      break;
    default:
      // Generic filename for other document types
      const sanitizedTitle = doc.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      filename = `${sanitizedTitle}.pdf`;
  }
  
  return path.join(moduleDir, filename);
}

/**
 * Get the relative path for XML reference
 * @param {string} fullPath - Full file path
 * @param {string} sequenceDir - Sequence directory path
 * @returns {string} - Relative path with forward slashes
 */
function getRelativePath(fullPath, sequenceDir) {
  return path.relative(sequenceDir, fullPath).replace(/\\/g, '/');
}

/**
 * Create subdirectory structure for study data
 * @param {string} m5Dir - Module 5 directory path
 * @param {string} studyId - Study identifier
 * @returns {object} - Paths to study data directories
 */
function createStudyDataStructure(m5Dir, studyId) {
  const studyDir = path.join(m5Dir, studyId);
  const sdtmDir = path.join(studyDir, 'sdtm');
  const adamDir = path.join(studyDir, 'adam');
  
  fs.mkdirSync(sdtmDir, { recursive: true });
  fs.mkdirSync(adamDir, { recursive: true });
  
  return {
    study: studyDir,
    sdtm: sdtmDir,
    adam: adamDir
  };
}

/**
 * Ensure a directory exists
 * @param {string} dirPath - Directory path
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Clean up empty directories
 * @param {string} dirPath - Directory to clean
 */
function cleanEmptyDirs(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  // Process subdirectories first
  for (const entry of entries) {
    if (entry.isDirectory()) {
      cleanEmptyDirs(path.join(dirPath, entry.name));
    }
  }
  
  // Check if directory is now empty
  const remaining = fs.readdirSync(dirPath);
  if (remaining.length === 0) {
    fs.rmdirSync(dirPath);
  }
}

module.exports = {
  createSubmissionStructure,
  getDocumentPath,
  getRelativePath,
  createStudyDataStructure,
  ensureDir,
  cleanEmptyDirs
};
