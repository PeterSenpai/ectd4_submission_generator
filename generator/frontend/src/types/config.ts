// eCTD Configuration Types

export interface Application {
    type: "NDA" | "ANDA" | "BLA" | "IND";
    number: string;
    sponsor: string;
}

export interface Submission {
    type: "original" | "amendment" | "supplement";
    sequenceNumber: number;
    title: string;
}

export interface Contact {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    organization: string;
}

export interface Contacts {
    regulatory: Contact;
    technical?: Contact;
}

export type KeywordType = "studyId" | "manufacturer" | "productName";

export interface Keyword {
    type: KeywordType;
    code: string;
    codeSystem: string;
    displayName: string;
}

export type DocumentModule = "m1" | "m2" | "m3" | "m4" | "m5";

export type DocumentType =
    | "356h"
    | "cover"
    | "product_info"
    | "bioavailability"
    | "clinical_summary"
    | "nonclinical_summary"
    | "quality_summary"
    | "study_report";

export interface Document {
    id?: string;
    module: DocumentModule;
    type: DocumentType;
    title: string;
    keywordRefs?: string[];
    operation?: "new" | "replace" | "append" | "delete";
    replacesId?: string;
}

export interface EctdConfig {
    application: Application;
    submission: Submission;
    contacts: Contacts;
    documents: Document[];
    keywords?: Keyword[];
}

// Keyword Mode Settings
export interface KeywordSettings {
    manufacturer: {
        enabled: boolean;
        count: number;
    };
    productName: {
        enabled: boolean;
        count: number;
    };
    study: {
        enabled: boolean;
        count: number;
    };
    generateDocuments: boolean;
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        type: string;
    };
}

export interface GenerateConfigParams {
    manufacturer: number;
    productName: number;
    nda?: string;
    sponsor?: string;
}

export interface GenerateConfigResponse {
    success: boolean;
    config: EctdConfig;
    metadata: {
        manufacturerKeywords: number;
        productKeywords: number;
        totalKeywords: number;
        totalDocuments: number;
    };
}

export interface ValidateConfigResponse {
    success: boolean;
    valid: boolean;
    errors?: Array<{
        instancePath: string;
        message: string;
    }>;
}

export interface SchemaResponse {
    success: boolean;
    schema: Record<string, unknown>;
}

export interface DefaultConfigResponse {
    success: boolean;
    config: EctdConfig;
}

// Document Mode State
export interface DocumentModeState {
    documents: Document[];
    keywords: Keyword[];
}

// Metadata Form State
export interface MetadataState {
    nda: string;
    sponsor: string;
    title: string;
}
