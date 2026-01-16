import type {
    EctdConfig,
    GenerateConfigParams,
    GenerateConfigResponse,
    ValidateConfigResponse,
    SchemaResponse,
    DefaultConfigResponse,
} from "@/types/config";

const API_BASE = "/api";

class ApiError extends Error {
    constructor(
        message: string,
        public status: number
    ) {
        super(message);
        this.name = "ApiError";
    }
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const error = await response.json().catch(() => ({
            error: { message: "An error occurred" },
        }));
        throw new ApiError(
            error.error?.message || "Request failed",
            response.status
        );
    }
    return response.json();
}

/**
 * Generate a configuration based on keyword parameters
 */
export async function generateConfig(
    params: GenerateConfigParams
): Promise<GenerateConfigResponse> {
    const response = await fetch(`${API_BASE}/config/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
    });
    return handleResponse<GenerateConfigResponse>(response);
}

/**
 * Validate a configuration object
 */
export async function validateConfig(
    config: EctdConfig
): Promise<ValidateConfigResponse> {
    const response = await fetch(`${API_BASE}/config/validate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ config }),
    });
    return handleResponse<ValidateConfigResponse>(response);
}

/**
 * Get the JSON schema for configuration validation
 */
export async function getSchema(): Promise<SchemaResponse> {
    const response = await fetch(`${API_BASE}/schema`);
    return handleResponse<SchemaResponse>(response);
}

/**
 * Get the default configuration
 */
export async function getDefaultConfig(): Promise<DefaultConfigResponse> {
    const response = await fetch(`${API_BASE}/config/default`);
    return handleResponse<DefaultConfigResponse>(response);
}

/**
 * Generate a submission with default configuration and download as ZIP
 */
export async function generateDefaultSubmission(): Promise<Blob> {
    const response = await fetch(`${API_BASE}/generate/default`, {
        method: "POST",
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({
            error: { message: "Failed to generate submission" },
        }));
        throw new ApiError(
            error.error?.message || "Request failed",
            response.status
        );
    }

    return response.blob();
}

/**
 * Generate a submission with custom configuration and download as ZIP
 */
export async function generateCustomSubmission(
    config: EctdConfig,
    options?: { generatePDFs?: boolean }
): Promise<Blob> {
    const response = await fetch(`${API_BASE}/generate/custom`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            config,
            options: options || { generatePDFs: true },
        }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({
            error: { message: "Failed to generate submission" },
        }));
        throw new ApiError(
            error.error?.message || "Request failed",
            response.status
        );
    }

    return response.blob();
}

/**
 * Download a blob as a file
 */
export function downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

/**
 * Download JSON data as a file
 */
export function downloadJson(data: unknown, filename: string): void {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    downloadBlob(blob, filename);
}
