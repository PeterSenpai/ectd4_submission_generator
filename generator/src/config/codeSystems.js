/**
 * eCTD 4.0 Code Systems - FDA and ICH OIDs and Code Values
 * Based on ICH eCTD v4.0 IG v1.5 and USFDA eCTD v4.0 IG v1.5.1
 */

// Implementation Guide Identifiers
const IG_IDENTIFIERS = {
  ICH_ECTD_V4_IG: {
    root: '2.16.840.1.113883.3.989.2.2.1.11.4',
    name: 'ICH eCTD v4.0 IG v1.5'
  },
  USFDA_ECTD_V4_IG: {
    root: '2.16.840.1.113883.3.989.5.1.2.2.1.18.6',
    name: 'USFDA eCTD v4.0 IG v1.5.1'
  }
};

// Code Systems
const CODE_SYSTEMS = {
  // ICH Code Systems
  ICH_CTD_SECTIONS: '2.16.840.1.113883.3.989.2.2.1.1.4',
  ICH_DOCUMENT_TYPES: '2.16.840.1.113883.3.989.2.2.1.3.3',
  ICH_KEYWORD_TYPES: '2.16.840.1.113883.3.989.2.2.1.5.3',
  
  // US FDA Code Systems
  US_APPLICATION_TYPES: '2.16.840.1.113883.3.989.5.1.2.2.1.1.3',
  US_CTD_SECTIONS: '2.16.840.1.113883.3.989.5.1.2.2.1.2.5',
  US_KEYWORD_DEFINITION_TYPES: '2.16.840.1.113883.3.989.5.1.2.2.1.3.2',
  US_FORM_TYPES: '2.16.840.1.113883.3.989.5.1.2.2.1.5.5',
  US_SUBMISSION_CONTACT_TYPES: '2.16.840.1.113883.3.989.5.1.2.2.1.11.2',
  US_SUBMISSION_TYPES: '2.16.840.1.113883.3.989.5.1.2.2.1.12.4',
  US_SUBMISSION_UNIT_TYPES: '2.16.840.1.113883.3.989.5.1.2.2.1.13.1',
  US_APPLICATION_NUMBER: '2.16.840.1.113883.3.989.5.1.2.2.1.16.1'
};

// Application Types
const APPLICATION_TYPES = {
  NDA: { code: 'us_application_type_1', codeSystem: CODE_SYSTEMS.US_APPLICATION_TYPES },
  ANDA: { code: 'us_application_type_2', codeSystem: CODE_SYSTEMS.US_APPLICATION_TYPES },
  BLA: { code: 'us_application_type_3', codeSystem: CODE_SYSTEMS.US_APPLICATION_TYPES },
  IND: { code: 'us_application_type_4', codeSystem: CODE_SYSTEMS.US_APPLICATION_TYPES },
  DMF: { code: 'us_application_type_5', codeSystem: CODE_SYSTEMS.US_APPLICATION_TYPES }
};

// Submission Types
const SUBMISSION_TYPES = {
  original: { code: 'us_submission_type_1', codeSystem: CODE_SYSTEMS.US_SUBMISSION_TYPES },
  amendment: { code: 'us_submission_type_2', codeSystem: CODE_SYSTEMS.US_SUBMISSION_TYPES },
  supplement: { code: 'us_submission_type_3', codeSystem: CODE_SYSTEMS.US_SUBMISSION_TYPES },
  annual_report: { code: 'us_submission_type_4', codeSystem: CODE_SYSTEMS.US_SUBMISSION_TYPES }
};

// Submission Unit Types
const SUBMISSION_UNIT_TYPES = {
  initial: { code: 'us_submission_unit_type_3', codeSystem: CODE_SYSTEMS.US_SUBMISSION_UNIT_TYPES },
  amendment: { code: 'us_submission_unit_type_4', codeSystem: CODE_SYSTEMS.US_SUBMISSION_UNIT_TYPES }
};

// Contact Types
const CONTACT_TYPES = {
  regulatory: { code: 'us_submission_contact_type_1', codeSystem: CODE_SYSTEMS.US_SUBMISSION_CONTACT_TYPES },
  technical: { code: 'us_submission_contact_type_2', codeSystem: CODE_SYSTEMS.US_SUBMISSION_CONTACT_TYPES }
};

// Form Types
const FORM_TYPES = {
  '356h': { code: 'us_form_type_2', codeSystem: CODE_SYSTEMS.US_FORM_TYPES },
  '2253': { code: 'us_form_type_1', codeSystem: CODE_SYSTEMS.US_FORM_TYPES }
};

// ICH Keyword Types (for keywordDefinition)
const KEYWORD_TYPES = {
  manufacturer: { code: 'ich_keyword_type_3', codeSystem: CODE_SYSTEMS.ICH_KEYWORD_TYPES },
  productName: { code: 'ich_keyword_type_4', codeSystem: CODE_SYSTEMS.ICH_KEYWORD_TYPES },
  studyId: { code: 'ich_keyword_type_8', codeSystem: CODE_SYSTEMS.ICH_KEYWORD_TYPES }
};

// US Keyword Definition Types (for promotional materials)
const US_KEYWORD_DEFINITION_TYPES = {
  materialId: { code: 'us_keyword_definition_type_1', codeSystem: CODE_SYSTEMS.US_KEYWORD_DEFINITION_TYPES },
  issueDate: { code: 'us_keyword_definition_type_2', codeSystem: CODE_SYSTEMS.US_KEYWORD_DEFINITION_TYPES }
};

// ICH Document Types
const DOCUMENT_TYPES = {
  study_report: { code: 'ich_document_type_4', codeSystem: CODE_SYSTEMS.ICH_DOCUMENT_TYPES },
  sdtm_define: { code: 'ich_document_type_48', codeSystem: CODE_SYSTEMS.ICH_DOCUMENT_TYPES },
  adam_define: { code: 'ich_document_type_53', codeSystem: CODE_SYSTEMS.ICH_DOCUMENT_TYPES },
  sdtm_dataset: { code: 'ich_document_type_71', codeSystem: CODE_SYSTEMS.ICH_DOCUMENT_TYPES },
  adam_dataset: { code: 'ich_document_type_73', codeSystem: CODE_SYSTEMS.ICH_DOCUMENT_TYPES }
};

// CTD Section Codes - Module 1 (US-specific)
const US_CTD_SECTIONS = {
  'm1.1': { code: 'us_1.1', codeSystem: CODE_SYSTEMS.US_CTD_SECTIONS, name: 'Forms' },
  'm1.2': { code: 'us_1.2', codeSystem: CODE_SYSTEMS.US_CTD_SECTIONS, name: 'Cover Letter' },
  'm1.3': { code: 'us_1.3', codeSystem: CODE_SYSTEMS.US_CTD_SECTIONS, name: 'Administrative Information' },
  'm1.4': { code: 'us_1.4', codeSystem: CODE_SYSTEMS.US_CTD_SECTIONS, name: 'References' },
  'm1.14': { code: 'us_1.14', codeSystem: CODE_SYSTEMS.US_CTD_SECTIONS, name: 'Labeling' },
  'm1.15': { code: 'us_1.15', codeSystem: CODE_SYSTEMS.US_CTD_SECTIONS, name: 'Patent Information' }
};

// CTD Section Codes - Modules 2-5 (ICH harmonized)
const ICH_CTD_SECTIONS = {
  // Module 2 - CTD Summaries
  'm2.2': { code: 'ich_2.2', codeSystem: CODE_SYSTEMS.ICH_CTD_SECTIONS, name: 'Introduction' },
  'm2.3': { code: 'ich_2.3', codeSystem: CODE_SYSTEMS.ICH_CTD_SECTIONS, name: 'Quality Overall Summary' },
  'm2.4': { code: 'ich_2.4', codeSystem: CODE_SYSTEMS.ICH_CTD_SECTIONS, name: 'Nonclinical Overview' },
  'm2.5': { code: 'ich_2.5', codeSystem: CODE_SYSTEMS.ICH_CTD_SECTIONS, name: 'Clinical Overview' },
  'm2.6': { code: 'ich_2.6', codeSystem: CODE_SYSTEMS.ICH_CTD_SECTIONS, name: 'Nonclinical Written and Tabulated Summaries' },
  'm2.7': { code: 'ich_2.7', codeSystem: CODE_SYSTEMS.ICH_CTD_SECTIONS, name: 'Clinical Summary' },
  
  // Module 3 - Quality
  'm3.2.s': { code: 'ich_3.2.s', codeSystem: CODE_SYSTEMS.ICH_CTD_SECTIONS, name: 'Drug Substance' },
  'm3.2.p': { code: 'ich_3.2.p', codeSystem: CODE_SYSTEMS.ICH_CTD_SECTIONS, name: 'Drug Product' },
  'm3.2.p.2.2': { code: 'ich_3.2.p.2.2', codeSystem: CODE_SYSTEMS.ICH_CTD_SECTIONS, name: 'Drug Product Description and Composition' },
  'm3.2.a': { code: 'ich_3.2.a', codeSystem: CODE_SYSTEMS.ICH_CTD_SECTIONS, name: 'Appendices' },
  'm3.2.r': { code: 'ich_3.2.r', codeSystem: CODE_SYSTEMS.ICH_CTD_SECTIONS, name: 'Regional Information' },
  'm3.3': { code: 'ich_3.3', codeSystem: CODE_SYSTEMS.ICH_CTD_SECTIONS, name: 'Literature References' },
  
  // Module 4 - Nonclinical Study Reports
  'm4.2.1': { code: 'ich_4.2.1', codeSystem: CODE_SYSTEMS.ICH_CTD_SECTIONS, name: 'Pharmacology' },
  'm4.2.2': { code: 'ich_4.2.2', codeSystem: CODE_SYSTEMS.ICH_CTD_SECTIONS, name: 'Pharmacokinetics' },
  'm4.2.3': { code: 'ich_4.2.3', codeSystem: CODE_SYSTEMS.ICH_CTD_SECTIONS, name: 'Toxicology' },
  
  // Module 5 - Clinical Study Reports
  'm5.2': { code: 'ich_5.2', codeSystem: CODE_SYSTEMS.ICH_CTD_SECTIONS, name: 'Tabular Listing of All Clinical Studies' },
  'm5.3.1.1': { code: 'ich_5.3.1.1', codeSystem: CODE_SYSTEMS.ICH_CTD_SECTIONS, name: 'BA/BE Studies' },
  'm5.3.1.2': { code: 'ich_5.3.1.2', codeSystem: CODE_SYSTEMS.ICH_CTD_SECTIONS, name: 'Comparative BA/BE Studies' },
  'm5.3.3.1': { code: 'ich_5.3.3.1', codeSystem: CODE_SYSTEMS.ICH_CTD_SECTIONS, name: 'Controlled Clinical Studies' },
  'm5.3.5.1': { code: 'ich_5.3.5.1', codeSystem: CODE_SYSTEMS.ICH_CTD_SECTIONS, name: 'Efficacy and Safety Studies' },
  'm5.3.5.3': { code: 'ich_5.3.5.3', codeSystem: CODE_SYSTEMS.ICH_CTD_SECTIONS, name: 'Reports of Analyses of Data' }
};

// Document type to CTD section mapping
const DOCUMENT_TYPE_TO_SECTION = {
  // Module 1 documents
  '356h': 'm1.1',
  'cover': 'm1.2',
  '2253': 'm1.3',
  'labeling': 'm1.14',
  
  // Module 3 documents
  'product_info': 'm3.2.p.2.2',
  'drug_substance': 'm3.2.s',
  'drug_product': 'm3.2.p',
  
  // Module 5 documents
  'bioavailability': 'm5.3.1.1',
  'bioequivalence': 'm5.3.1.2',
  'clinical_study': 'm5.3.5.1',
  'study_data': 'm5.3.1.1'
};

/**
 * Get the CTD section code for a document type
 * @param {string} docType - Document type (e.g., '356h', 'cover', 'bioavailability')
 * @returns {object|null} - Section code object or null if not found
 */
function getSectionCode(docType) {
  const sectionKey = DOCUMENT_TYPE_TO_SECTION[docType];
  if (!sectionKey) return null;
  
  // Check US sections first (Module 1)
  if (US_CTD_SECTIONS[sectionKey]) {
    return US_CTD_SECTIONS[sectionKey];
  }
  
  // Check ICH sections (Modules 2-5)
  return ICH_CTD_SECTIONS[sectionKey] || null;
}

/**
 * Get the keyword type code for a keyword type string
 * @param {string} type - Keyword type (e.g., 'studyId', 'productName', 'manufacturer')
 * @returns {object|null} - Keyword type code object or null if not found
 */
function getKeywordTypeCode(type) {
  return KEYWORD_TYPES[type] || US_KEYWORD_DEFINITION_TYPES[type] || null;
}

module.exports = {
  IG_IDENTIFIERS,
  CODE_SYSTEMS,
  APPLICATION_TYPES,
  SUBMISSION_TYPES,
  SUBMISSION_UNIT_TYPES,
  CONTACT_TYPES,
  FORM_TYPES,
  KEYWORD_TYPES,
  US_KEYWORD_DEFINITION_TYPES,
  DOCUMENT_TYPES,
  US_CTD_SECTIONS,
  ICH_CTD_SECTIONS,
  DOCUMENT_TYPE_TO_SECTION,
  getSectionCode,
  getKeywordTypeCode
};
