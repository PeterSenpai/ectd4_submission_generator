/**
 * XML Templates for eCTD 4.0 submissionunit.xml
 * Based on HL7 v3 RPS (Regulated Product Submission) schema
 */

const { IG_IDENTIFIERS, CODE_SYSTEMS } = require('../config/codeSystems');

/**
 * Build the XML declaration and root element attributes
 * @returns {object} - Root element configuration
 */
function buildRootElement() {
  return {
    '?xml': {
      '@_version': '1.0',
      '@_encoding': 'UTF-8'
    }
  };
}

/**
 * Build the PORP_IN000001UV root attributes
 * @returns {object} - Root element attributes
 */
function getRootAttributes() {
  return {
    '@_ITSVersion': 'XML_1.0',
    '@_xmlns': 'urn:hl7-org:v3',
    '@_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
    '@_xsi:schemaLocation': 'urn:hl7-org:v3 PORP_IN000001UV.xsd'
  };
}

/**
 * Build message header elements
 * @returns {object} - Message header structure
 */
function buildMessageHeader() {
  return {
    id: {},
    creationTime: {},
    interactionId: {},
    processingCode: {},
    processingModeCode: {},
    acceptAckCode: {},
    receiver: {
      '@_typeCode': 'RCV',
      device: {
        '@_classCode': 'DEV',
        '@_determinerCode': 'INSTANCE',
        id: {
          item: [
            {
              '@_root': IG_IDENTIFIERS.ICH_ECTD_V4_IG.root,
              '@_identifierName': IG_IDENTIFIERS.ICH_ECTD_V4_IG.name
            },
            {
              '@_root': IG_IDENTIFIERS.USFDA_ECTD_V4_IG.root,
              '@_identifierName': IG_IDENTIFIERS.USFDA_ECTD_V4_IG.name
            }
          ]
        }
      }
    },
    sender: {
      '@_typeCode': 'SND',
      device: {
        '@_classCode': 'DEV',
        '@_determinerCode': 'INSTANCE',
        id: {}
      }
    }
  };
}

/**
 * Build contact party element
 * @param {object} contact - Contact configuration
 * @param {string} contactId - UUID for the contact
 * @param {string} contactType - Contact type code
 * @param {string} contactTypeCodeSystem - Code system for contact type
 * @returns {object} - Contact party structure
 */
function buildContactParty(contact, contactId, contactType, contactTypeCodeSystem) {
  const telecomItems = [];
  
  if (contact.phone) {
    telecomItems.push({
      '@_value': `tel:${contact.phone}`,
      '@_use': 'WP',
      '@_capabilities': 'voice'
    });
  }
  
  if (contact.mobile) {
    telecomItems.push({
      '@_value': `tel:${contact.mobile}`,
      '@_use': 'MC',
      '@_capabilities': 'voice'
    });
  }
  
  if (contact.fax) {
    telecomItems.push({
      '@_value': `tel:${contact.fax}`,
      '@_use': 'WP',
      '@_capabilities': 'fax'
    });
  }
  
  if (contact.email) {
    telecomItems.push({
      '@_value': `mailto:${contact.email}`
    });
  }
  
  const nameParts = [
    { '@_type': 'GIV', '@_value': contact.firstName }
  ];
  
  if (contact.middleName) {
    nameParts.push({ '@_type': 'GIV', '@_value': contact.middleName, '@_qualifier': 'MID' });
  }
  
  nameParts.push({ '@_type': 'FAM', '@_value': contact.lastName });
  
  return {
    callBackContact: {
      contactParty: {
        id: { '@_root': contactId },
        code: {
          '@_code': contactType,
          '@_codeSystem': contactTypeCodeSystem
        },
        statusCode: { '@_code': 'active' },
        contactPerson: {
          name: {
            part: nameParts
          },
          telecom: {
            '@_xsi:type': 'BAG_TEL',
            item: telecomItems
          },
          asAgent: {
            representedOrganization: {
              name: {
                part: { '@_value': contact.organization || 'Organization' }
              }
            }
          }
        }
      }
    }
  };
}

/**
 * Build document element
 * @param {object} doc - Document configuration
 * @param {string} docId - Document UUID
 * @param {string} relativePath - Relative path to file
 * @param {string} hash - SHA256 hash of file
 * @returns {object} - Document structure
 */
function buildDocument(doc, docId, relativePath, hash) {
  return {
    component: {
      document: {
        id: { '@_root': docId },
        title: { '@_value': doc.title },
        text: {
          '@_integrityCheckAlgorithm': 'SHA256',
          reference: { '@_value': relativePath },
          integrityCheck: hash
        }
      }
    }
  };
}

/**
 * Build contextOfUse element
 * @param {object} options - Context of use options
 * @param {string} options.contextId - UUID for context of use
 * @param {string} options.code - CTD section code
 * @param {string} options.codeSystem - Code system for section
 * @param {string} options.statusCode - Status code (active/suspended)
 * @param {number} options.priorityNumber - Priority number
 * @param {string} options.documentId - Referenced document UUID
 * @param {Array} options.keywordRefs - Keyword references
 * @param {object} options.lifecycle - Lifecycle operation details
 * @returns {object} - Context of use structure
 */
function buildContextOfUse(options) {
  const contextOfUse = {
    id: { '@_root': options.contextId },
    code: {
      '@_code': options.code,
      '@_codeSystem': options.codeSystem
    },
    statusCode: { '@_code': options.statusCode || 'active' }
  };
  
  // Add lifecycle replacement reference if replacing
  if (options.lifecycle && options.lifecycle.operation === 'replace' && options.lifecycle.replacesId) {
    contextOfUse.replacementOf = {
      '@_typeCode': 'RPLC',
      relatedContextOfUse: {
        id: { '@_root': options.lifecycle.replacesId }
      }
    };
  }
  
  // Add document reference (only for active status)
  if (options.statusCode !== 'suspended' && options.documentId) {
    contextOfUse.derivedFrom = {
      documentReference: {
        id: { '@_root': options.documentId }
      }
    };
  }
  
  // Add keyword references
  if (options.keywordRefs && options.keywordRefs.length > 0) {
    // If single keyword ref, add directly; if multiple, wrap in array
    if (options.keywordRefs.length === 1) {
      contextOfUse.referencedBy = options.keywordRefs[0];
    } else {
      contextOfUse.referencedBy = options.keywordRefs;
    }
  }
  
  return {
    component: {
      priorityNumber: { '@_value': options.priorityNumber },
      contextOfUse
    }
  };
}

module.exports = {
  buildRootElement,
  getRootAttributes,
  buildMessageHeader,
  buildContactParty,
  buildDocument,
  buildContextOfUse
};
