#!/usr/bin/env node

/**
 * eCTD 4.0 Submission Generator API Server
 * Express.js REST API for generating eCTD 4.0 submissions
 */

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

// Import middleware
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");
const { cleanupMiddleware } = require("./middleware/cleanup");

// Import routes
const generateRoutes = require("./api/generate");
const configRoutes = require("./api/config");
const schemaRoutes = require("./api/schema");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware configuration
app.use(morgan("dev")); // HTTP request logging
app.use(cors()); // Enable CORS for all routes
app.use(express.json({ limit: "50mb" })); // Parse JSON bodies with 50MB limit
app.use(express.urlencoded({ extended: true, limit: "50mb" })); // Parse URL-encoded bodies
app.use(cleanupMiddleware); // Cleanup temp files after response

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({
        success: true,
        status: "healthy",
        service: "eCTD 4.0 Submission Generator API",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
    });
});

// API information endpoint
app.get("/", (req, res) => {
    res.json({
        success: true,
        service: "eCTD 4.0 Submission Generator API",
        version: "1.0.0",
        documentation: "/api/docs",
        endpoints: {
            health: "GET /health",
            schema: "GET /api/schema",
            defaultConfig: "GET /api/config/default",
            generateDefault: "POST /api/generate/default",
            generateCustom: "POST /api/generate/custom",
            generateConfig: "POST /api/config/generate",
            validateConfig: "POST /api/config/validate",
        },
    });
});

// API documentation endpoint
app.get("/api/docs", (req, res) => {
    res.json({
        success: true,
        apiVersion: "1.0.0",
        baseUrl: `http://localhost:${PORT}/api`,
        endpoints: [
            {
                method: "GET",
                path: "/health",
                description: "Health check endpoint",
                response: "JSON with health status",
            },
            {
                method: "GET",
                path: "/api/schema",
                description: "Get JSON schema for submission configuration",
                response: "JSON schema object",
            },
            {
                method: "GET",
                path: "/api/config/default",
                description: "Get default configuration",
                response: "Default config JSON",
            },
            {
                method: "POST",
                path: "/api/generate/default",
                description: "Generate submission with default configuration",
                body: "None",
                response: "ZIP file download",
            },
            {
                method: "POST",
                path: "/api/generate/custom",
                description: "Generate submission with custom configuration",
                body: {
                    config: "Full eCTD config object",
                    options: {
                        generatePDFs: "boolean (optional, default: true)",
                    },
                },
                response: "ZIP file download",
            },
            {
                method: "POST",
                path: "/api/config/generate",
                description: "Generate configuration with specified keywords",
                body: {
                    manufacturer: "number (required)",
                    productName: "number (required)",
                    nda: "string (optional)",
                    sponsor: "string (optional)",
                },
                response: "Generated config JSON",
            },
            {
                method: "POST",
                path: "/api/config/validate",
                description: "Validate a configuration object",
                body: {
                    config: "Config object to validate",
                },
                response: "Validation result JSON",
            },
        ],
        examples: {
            generateDefault:
                "curl -X POST http://localhost:3000/api/generate/default --output submission.zip",
            generateConfig:
                'curl -X POST http://localhost:3000/api/config/generate -H "Content-Type: application/json" -d \'{"manufacturer": 10, "productName": 5}\'',
            validateConfig:
                'curl -X POST http://localhost:3000/api/config/validate -H "Content-Type: application/json" -d @config.json',
        },
    });
});

// Mount API routes
app.use("/api/generate", generateRoutes);
app.use("/api/config", configRoutes);
app.use("/api/schema", schemaRoutes);

// 404 handler for undefined routes
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log("═══════════════════════════════════════════════════════════");
    console.log("  eCTD 4.0 Submission Generator API");
    console.log("═══════════════════════════════════════════════════════════");
    console.log(`  Server running on: http://localhost:${PORT}`);
    console.log(`  Health check:      http://localhost:${PORT}/health`);
    console.log(`  API docs:          http://localhost:${PORT}/api/docs`);
    console.log("═══════════════════════════════════════════════════════════");
    console.log(
        `  Environment:       ${process.env.NODE_ENV || "development"}`
    );
    console.log(`  Started at:        ${new Date().toISOString()}`);
    console.log("═══════════════════════════════════════════════════════════");
    console.log("  Ready to accept requests!");
    console.log("");
});

// Handle graceful shutdown
process.on("SIGTERM", () => {
    console.log("SIGTERM signal received: closing HTTP server");
    process.exit(0);
});

process.on("SIGINT", () => {
    console.log("\nSIGINT signal received: closing HTTP server");
    process.exit(0);
});

module.exports = app;
