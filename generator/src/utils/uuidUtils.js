/**
 * UUID Utilities for eCTD 4.0 Submissions
 * Generates RFC4122 v4 UUIDs required by eCTD 4.0
 */

const { v4: uuidv4 } = require('uuid');

/**
 * Generate a new UUID v4
 * @returns {string} - UUID string (lowercase, with hyphens)
 */
function generateUUID() {
  return uuidv4();
}

/**
 * Validate if a string is a valid UUID
 * @param {string} str - String to validate
 * @returns {boolean} - True if valid UUID
 */
function isValidUUID(str) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Generate a map of UUIDs for a submission
 * Creates all required UUIDs upfront for consistency
 * @param {object} config - Submission configuration
 * @returns {object} - Map of UUID assignments
 */
function generateSubmissionUUIDs(config) {
  const uuids = {
    submissionUnit: generateUUID(),
    submission: generateUUID(),
    documents: {},
    contextOfUse: {},
    contacts: {
      regulatory: generateUUID(),
      technical: generateUUID()
    }
  };
  
  // Generate UUIDs for each document
  if (config.documents) {
    config.documents.forEach((doc, index) => {
      const docKey = `doc_${index}`;
      uuids.documents[docKey] = generateUUID();
      uuids.contextOfUse[docKey] = generateUUID();
    });
  }
  
  return uuids;
}

module.exports = {
  generateUUID,
  isValidUUID,
  generateSubmissionUUIDs
};
