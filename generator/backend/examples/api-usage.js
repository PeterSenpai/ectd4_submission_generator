/**
 * Example: Using the eCTD Generator API
 * 
 * This example demonstrates how to interact with the REST API
 * using Node.js fetch or curl commands.
 */

const API_BASE_URL = 'http://localhost:3000/api';

// Example 1: Get default configuration
async function getDefaultConfig() {
    const response = await fetch(`${API_BASE_URL}/config/default`);
    const data = await response.json();
    console.log('Default Config:', data);
    return data.config;
}

// Example 2: Generate a custom configuration
async function generateConfig(manufacturer, productName) {
    const response = await fetch(`${API_BASE_URL}/config/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            manufacturer,
            productName,
            nda: '123456',
            sponsor: 'Example Pharmaceuticals Inc'
        })
    });
    const data = await response.json();
    console.log('Generated Config:', data.metadata);
    return data.config;
}

// Example 3: Validate a configuration
async function validateConfig(config) {
    const response = await fetch(`${API_BASE_URL}/config/validate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ config })
    });
    const data = await response.json();
    console.log('Validation Result:', data);
    return data.valid;
}

// Example 4: Generate submission with default config
async function generateDefaultSubmission(outputPath) {
    const response = await fetch(`${API_BASE_URL}/generate/default`, {
        method: 'POST'
    });
    
    if (response.ok) {
        const fs = require('fs');
        const buffer = await response.arrayBuffer();
        fs.writeFileSync(outputPath, Buffer.from(buffer));
        console.log(`Submission saved to: ${outputPath}`);
        return true;
    }
    return false;
}

// Example 5: Generate submission with custom config
async function generateCustomSubmission(config, outputPath) {
    const response = await fetch(`${API_BASE_URL}/generate/custom`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            config,
            options: {
                generatePDFs: true
            }
        })
    });
    
    if (response.ok) {
        const fs = require('fs');
        const buffer = await response.arrayBuffer();
        fs.writeFileSync(outputPath, Buffer.from(buffer));
        console.log(`Submission saved to: ${outputPath}`);
        return true;
    }
    return false;
}

// Main execution
async function main() {
    try {
        console.log('=== eCTD Generator API Examples ===\n');

        // Example 1: Get default config
        console.log('1. Getting default configuration...');
        const defaultConfig = await getDefaultConfig();
        console.log();

        // Example 2: Generate custom config
        console.log('2. Generating custom configuration...');
        const customConfig = await generateConfig(3, 2);
        console.log();

        // Example 3: Validate config
        console.log('3. Validating configuration...');
        const isValid = await validateConfig(customConfig);
        console.log(`   Valid: ${isValid}\n`);

        // Example 4: Generate default submission
        console.log('4. Generating submission with default config...');
        await generateDefaultSubmission('./output-default.zip');
        console.log();

        // Example 5: Generate custom submission
        console.log('5. Generating submission with custom config...');
        await generateCustomSubmission(customConfig, './output-custom.zip');
        console.log();

        console.log('=== All examples completed successfully! ===');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Run examples if executed directly
if (require.main === module) {
    main();
}

module.exports = {
    getDefaultConfig,
    generateConfig,
    validateConfig,
    generateDefaultSubmission,
    generateCustomSubmission
};
