#!/usr/bin/env node

/**
 * eCTD 4.0 Submission Generator CLI
 * Command-line tool for generating valid eCTD 4.0 submission packages
 */

const { Command } = require("commander");
const fs = require("fs");
const path = require("path");

const { validateConfig, getDefaultConfig } = require("./config/schema");
const { generateSubmission } = require("./builders/xmlBuilder");

const program = new Command();

program
    .name("ectd-generate")
    .description(
        "eCTD 4.0 Submission Generator - Generate valid eCTD 4.0 submission packages"
    )
    .version("1.0.0");

program
    .option("-i, --input <path>", "Path to JSON configuration file")
    .option("-o, --output <path>", "Output directory (default: ./output)")
    .option("--no-samples", "Skip generating placeholder PDF files")
    .option(
        "--default",
        "Generate submission with default sample configuration"
    )
    .option("--print-schema", "Print the JSON schema for configuration")
    .option("--print-default", "Print the default configuration JSON");

program.parse();

const options = program.opts();

/**
 * Main execution function
 */
async function main() {
    try {
        // Handle schema/default printing options
        if (options.printSchema) {
            const { submissionSchema } = require("./config/schema");
            console.log(JSON.stringify(submissionSchema, null, 2));
            return;
        }

        if (options.printDefault) {
            const defaultConfig = getDefaultConfig();
            console.log(JSON.stringify(defaultConfig, null, 2));
            return;
        }

        // Determine configuration source
        let config;

        if (options.default) {
            console.log("Using default sample configuration...");
            config = getDefaultConfig();
        } else if (options.input) {
            // Read configuration from file
            const configPath = path.resolve(options.input);

            if (!fs.existsSync(configPath)) {
                console.error(
                    `Error: Configuration file not found: ${configPath}`
                );
                process.exit(1);
            }

            console.log(`Reading configuration from: ${configPath}`);
            const configContent = fs.readFileSync(configPath, "utf-8");

            try {
                config = JSON.parse(configContent);
            } catch (err) {
                console.error(
                    `Error: Invalid JSON in configuration file: ${err.message}`
                );
                process.exit(1);
            }
        } else {
            // No input provided, show help
            console.log("eCTD 4.0 Submission Generator");
            console.log("");
            console.log("Usage:");
            console.log(
                "  ectd-generate --default                    Generate with default config"
            );
            console.log(
                "  ectd-generate -i config.json               Use custom configuration"
            );
            console.log(
                "  ectd-generate -i config.json -o ./myoutput Specify output directory"
            );
            console.log(
                "  ectd-generate --print-default              Print default config JSON"
            );
            console.log(
                "  ectd-generate --print-schema               Print config schema"
            );
            console.log("");
            console.log("Run with --help for more options.");
            return;
        }

        // Validate configuration
        console.log("Validating configuration...");
        const validation = validateConfig(config);

        if (!validation.valid) {
            console.error("Configuration validation failed:");
            validation.errors.forEach((err) => {
                console.error(
                    `  - ${err.instancePath || "root"}: ${err.message}`
                );
            });
            process.exit(1);
        }

        console.log("Configuration is valid.");

        // Determine output directory
        const outputDir = options.output
            ? path.resolve(options.output)
            : path.resolve("./output");

        // Generate submission
        console.log("");
        console.log("Generating eCTD 4.0 submission package...");
        console.log(
            `  Application: ${config.application.type} ${config.application.number}`
        );
        console.log(
            `  Submission: ${config.submission.title} (Sequence ${config.submission.sequenceNumber})`
        );
        console.log(`  Documents: ${config.documents?.length || 0}`);
        console.log(`  Output: ${outputDir}`);
        console.log("");

        const result = await generateSubmission(config, outputDir, {
            generateSamples: options.samples !== false,
        });

        if (result.success) {
            console.log("✓ Submission package generated successfully!");
            console.log("");
            console.log("Generated files:");
            console.log(`  Directory: ${result.paths.sequence}`);
            console.log(`  submissionunit.xml: ${result.xmlPath}`);
            console.log(`  sha256.txt: ${result.sha256Path}`);
            console.log(`  PDF files: ${result.generatedFiles}`);
            console.log("");
            console.log("Directory structure:");
            printDirectoryTree(result.paths.sequence, "  ");
        } else {
            console.error("Failed to generate submission package.");
            process.exit(1);
        }
    } catch (err) {
        console.error(`Error: ${err.message}`);
        if (process.env.DEBUG) {
            console.error(err.stack);
        }
        process.exit(1);
    }
}

/**
 * Print directory tree
 * @param {string} dirPath - Directory path
 * @param {string} indent - Indentation string
 */
function printDirectoryTree(dirPath, indent = "") {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    entries.forEach((entry, index) => {
        const isLast = index === entries.length - 1;
        const prefix = isLast ? "└── " : "├── ";
        const childIndent = isLast ? "    " : "│   ";

        console.log(`${indent}${prefix}${entry.name}`);

        if (entry.isDirectory()) {
            printDirectoryTree(
                path.join(dirPath, entry.name),
                indent + childIndent
            );
        }
    });
}

// Run main function
main();
