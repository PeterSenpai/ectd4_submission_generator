/**
 * XML Builder for eCTD 4.0 submissionunit.xml
 * Generates compliant HL7 v3 RPS XML from submission configuration
 */

const { XMLBuilder } = require('fast-xml-parser');
const fs = require('fs');
const path = require('path');

const {
  CODE_SYSTEMS,
  APPLICATION_TYPES,
  SUBMISSION_TYPES,
  SUBMISSION_UNIT_TYPES,
  CONTACT_TYPES,
  FORM_TYPES,
  getSectionCode
} = require('../config/codeSystems');

const {
  getRootAttributes,
  buildMessageHeader,
  buildContactParty,
  buildDocument,
  buildContextOfUse
} = require('../templates/submissionUnit');

const { buildAllKeywordDefinitions, buildDocumentKeywordReferences } = require('./keywordBuilder');
const { generateSubmissionUUIDs } = require('../utils/uuidUtils');
const { calculateFileHash } = require('../utils/hashUtils');

/**
 * Build the complete submissionunit.xml structure
 * @param {object} config - Submission configuration
 * @param {object} documentFiles - Map of document index to file info {path, hash}
 * @param {object} uuids - Pre-generated UUIDs
 * @returns {object} - Complete XML structure object
 */
function buildSubmissionUnitXML(config, documentFiles, uuids) {
  const appType = APPLICATION_TYPES[config.application.type];
  const subType = SUBMISSION_TYPES[config.submission.type];
  const unitType = config.submission.sequenceNumber === 1 
    ? SUBMISSION_UNIT_TYPES.initial 
    : SUBMISSION_UNIT_TYPES.amendment;
  
  // Build context of use components
  const contextComponents = [];
  const documentComponents = [];
  
  config.documents.forEach((doc, index) => {
    const docKey = `doc_${index}`;
    const docFile = documentFiles[docKey];
    const docId = uuids.documents[docKey];
    const contextId = uuids.contextOfUse[docKey];
    
    // Get section code for document type
    const sectionCode = getSectionCode(doc.type);
    if (!sectionCode) {
      console.warn(`No section code found for document type: ${doc.type}, using default`);
    }
    
    // Build keyword references for this document
    let keywordRefs = [];
    if (doc.keywordRefs && doc.keywordRefs.length > 0) {
      keywordRefs = buildDocumentKeywordReferences(doc.keywordRefs, config.keywords);
    }
    
    // Add form type keyword reference for 356h forms
    if (doc.type === '356h') {
      keywordRefs.push({
        '@_typeCode': 'REFR',
        keyword: {
          code: {
            '@_code': FORM_TYPES['356h'].code,
            '@_codeSystem': FORM_TYPES['356h'].codeSystem
          }
        }
      });
    }
    
    // Determine operation status
    const operation = doc.operation || 'new';
    const statusCode = operation === 'delete' ? 'suspended' : 'active';
    
    // Build context of use
    const contextOfUse = buildContextOfUse({
      contextId,
      code: sectionCode?.code || 'us_1.2',
      codeSystem: sectionCode?.codeSystem || CODE_SYSTEMS.US_CTD_SECTIONS,
      statusCode,
      priorityNumber: (index + 1) * 1000,
      documentId: statusCode === 'active' ? docId : null,
      keywordRefs: keywordRefs.length > 0 ? keywordRefs : null,
      lifecycle: operation !== 'new' ? { operation, replacesId: doc.replacesId } : null
    });
    
    contextComponents.push(contextOfUse);
    
    // Build document component (only for active documents)
    if (statusCode === 'active' && docFile) {
      const docComponent = buildDocument(doc, docId, docFile.relativePath, docFile.hash);
      documentComponents.push(docComponent);
    }
  });
  
  // Build contact parties
  const callBackContacts = [];
  if (config.contacts?.regulatory) {
    callBackContacts.push(
      buildContactParty(
        config.contacts.regulatory,
        uuids.contacts.regulatory,
        CONTACT_TYPES.regulatory.code,
        CONTACT_TYPES.regulatory.codeSystem
      )
    );
  }
  if (config.contacts?.technical) {
    callBackContacts.push(
      buildContactParty(
        config.contacts.technical,
        uuids.contacts.technical,
        CONTACT_TYPES.technical.code,
        CONTACT_TYPES.technical.codeSystem
      )
    );
  }
  
  // Build keyword definitions
  const keywordDefinitions = buildAllKeywordDefinitions(config.keywords);
  
  // Build application structure
  const applicationContent = {
    id: {
      item: {
        '@_root': CODE_SYSTEMS.US_APPLICATION_NUMBER,
        '@_extension': config.application.number
      }
    },
    code: {
      '@_code': appType.code,
      '@_codeSystem': appType.codeSystem
    },
    holder: {
      applicant: {
        sponsorOrganization: {
          name: {
            part: { '@_value': config.application.sponsor }
          }
        }
      }
    },
    subject: {
      reviewProcedure: {
        code: {}
      }
    },
    component: documentComponents.map(d => d.component)
  };
  
  // Add keyword definitions to application if present
  if (keywordDefinitions.length > 0) {
    applicationContent.referencedBy = keywordDefinitions.map(kd => kd.referencedBy);
  }
  
  // Build the complete structure
  const structure = {
    PORP_IN000001UV: {
      ...getRootAttributes(),
      ...buildMessageHeader(),
      controlActProcess: {
        '@_classCode': 'ACTN',
        '@_moodCode': 'EVN',
        subject: {
          '@_typeCode': 'SUBJ',
          submissionUnit: {
            id: { '@_root': uuids.submissionUnit },
            code: {
              '@_code': unitType.code,
              '@_codeSystem': unitType.codeSystem
            },
            title: { '@_value': config.submission.title },
            statusCode: { '@_code': 'active' },
            component: contextComponents.map(c => c.component),
            componentOf1: {
              sequenceNumber: { '@_value': config.submission.sequenceNumber },
              submission: {
                id: {
                  '@_xsi:type': 'DSET_II',
                  item: { '@_root': uuids.submission }
                },
                code: {
                  '@_code': subType.code,
                  '@_codeSystem': subType.codeSystem
                },
                callBackContact: callBackContacts.map(c => c.callBackContact),
                componentOf: {
                  application: applicationContent
                }
              }
            }
          }
        }
      }
    }
  };
  
  return structure;
}

/**
 * Generate submissionunit.xml file
 * @param {object} config - Submission configuration
 * @param {string} sequenceDir - Sequence directory path
 * @param {Array<{doc: object, filePath: string}>} generatedFiles - Generated file info
 * @returns {Promise<string>} - Path to generated XML file
 */
async function generateSubmissionUnitXML(config, sequenceDir, generatedFiles) {
  // Generate UUIDs
  const uuids = generateSubmissionUUIDs(config);
  
  // Build document files map with hashes
  const documentFiles = {};
  for (let i = 0; i < generatedFiles.length; i++) {
    const { doc, filePath } = generatedFiles[i];
    const hash = await calculateFileHash(filePath);
    const relativePath = path.relative(sequenceDir, filePath).replace(/\\/g, '/');
    documentFiles[`doc_${i}`] = {
      path: filePath,
      relativePath,
      hash
    };
  }
  
  // Build XML structure
  const xmlStructure = buildSubmissionUnitXML(config, documentFiles, uuids);
  
  // Configure XML builder
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    format: true,
    indentBy: '\t',
    suppressEmptyNode: true,
    suppressBooleanAttributes: false
  });
  
  // Generate XML string
  const xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n' + builder.build(xmlStructure);
  
  // Write to file
  const xmlPath = path.join(sequenceDir, 'submissionunit.xml');
  fs.writeFileSync(xmlPath, xmlContent);
  
  return xmlPath;
}

/**
 * Generate a complete eCTD submission package
 * @param {object} config - Submission configuration
 * @param {string} outputDir - Output directory
 * @param {object} options - Generation options
 * @returns {Promise<object>} - Generation results
 */
async function generateSubmission(config, outputDir, options = {}) {
  const { createSubmissionStructure, getDocumentPath, getRelativePath } = require('./dirBuilder');
  const { generateSubmissionPDFs } = require('./pdfBuilder');
  const { writeSha256File, calculateDirectoryHashes } = require('../utils/hashUtils');
  
  // Create directory structure
  const paths = createSubmissionStructure(
    outputDir,
    config.application.number,
    config.submission.sequenceNumber
  );
  
  // Generate placeholder PDFs if needed
  const generateSamples = options.generateSamples !== false;
  let generatedFiles = [];
  
  if (generateSamples && config.documents) {
    generatedFiles = await generateSubmissionPDFs(
      config.documents,
      paths,
      config.application.number,
      config.submission.sequenceNumber,
      getDocumentPath
    );
  }
  
  // Generate submissionunit.xml
  const xmlPath = await generateSubmissionUnitXML(config, paths.sequence, generatedFiles);
  
  // Calculate and write sha256.txt
  const hashes = await calculateDirectoryHashes(paths.sequence);
  await writeSha256File(paths.sequence, hashes);
  
  return {
    success: true,
    paths,
    xmlPath,
    generatedFiles: generatedFiles.length,
    sha256Path: path.join(paths.sequence, 'sha256.txt')
  };
}

module.exports = {
  buildSubmissionUnitXML,
  generateSubmissionUnitXML,
  generateSubmission
};
