/**
 * Keyword Builder for eCTD 4.0 Submissions
 * Generates sender-defined keyword definitions and references
 */

const { getKeywordTypeCode } = require('../config/codeSystems');

/**
 * Build keyword definition XML fragment
 * @param {object} keyword - Keyword configuration
 * @param {string} keyword.type - Keyword type (studyId, productName, manufacturer, etc.)
 * @param {string} keyword.code - Sender-defined code
 * @param {string} keyword.codeSystem - Sender-defined code system OID
 * @param {string} keyword.displayName - Human-readable display name
 * @returns {object} - Keyword definition object for XML generation
 */
function buildKeywordDefinition(keyword) {
  const typeCode = getKeywordTypeCode(keyword.type);
  
  if (!typeCode) {
    throw new Error(`Unknown keyword type: ${keyword.type}`);
  }
  
  return {
    referencedBy: {
      keywordDefinition: {
        code: {
          '@_code': typeCode.code,
          '@_codeSystem': typeCode.codeSystem
        },
        statusCode: {
          '@_code': 'active'
        },
        value: {
          item: {
            '@_code': keyword.code,
            '@_codeSystem': keyword.codeSystem,
            displayName: {
              '@_value': keyword.displayName
            }
          }
        }
      }
    }
  };
}

/**
 * Build keyword reference for contextOfUse
 * @param {string} keywordCode - Keyword code to reference
 * @param {string} codeSystem - Code system OID for the keyword
 * @returns {object} - Keyword reference object for XML generation
 */
function buildKeywordReference(keywordCode, codeSystem) {
  return {
    '@_typeCode': 'REFR',
    keyword: {
      code: {
        '@_code': keywordCode,
        '@_codeSystem': codeSystem
      }
    }
  };
}

/**
 * Build all keyword definitions for application level
 * @param {Array} keywords - Array of keyword configurations
 * @returns {Array} - Array of keyword definition objects
 */
function buildAllKeywordDefinitions(keywords) {
  if (!keywords || keywords.length === 0) {
    return [];
  }
  
  return keywords.map(keyword => buildKeywordDefinition(keyword));
}

/**
 * Build keyword references for a document's contextOfUse
 * @param {Array} keywordRefs - Array of keyword codes to reference
 * @param {Array} keywords - Array of keyword configurations (to get code systems)
 * @returns {Array} - Array of keyword reference objects
 */
function buildDocumentKeywordReferences(keywordRefs, keywords) {
  if (!keywordRefs || keywordRefs.length === 0) {
    return [];
  }
  
  // Create a map of keyword codes to their code systems
  const keywordMap = {};
  if (keywords) {
    keywords.forEach(kw => {
      keywordMap[kw.code] = kw.codeSystem;
    });
  }
  
  return keywordRefs.map(code => {
    const codeSystem = keywordMap[code];
    if (!codeSystem) {
      throw new Error(`Keyword reference "${code}" not found in keyword definitions`);
    }
    return buildKeywordReference(code, codeSystem);
  });
}

/**
 * Get keyword type from code (reverse lookup)
 * @param {string} typeCode - The type code (e.g., 'ich_keyword_type_8')
 * @returns {string|null} - The keyword type name or null
 */
function getKeywordTypeName(typeCode) {
  const typeMap = {
    'ich_keyword_type_3': 'manufacturer',
    'ich_keyword_type_4': 'productName',
    'ich_keyword_type_8': 'studyId',
    'us_keyword_definition_type_1': 'materialId',
    'us_keyword_definition_type_2': 'issueDate'
  };
  return typeMap[typeCode] || null;
}

module.exports = {
  buildKeywordDefinition,
  buildKeywordReference,
  buildAllKeywordDefinitions,
  buildDocumentKeywordReferences,
  getKeywordTypeName
};
