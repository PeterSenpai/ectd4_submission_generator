/**
 * Configuration Generator Module
 * Provides programmatic API for generating submission configurations
 */

/**
 * Generate manufacturer keywords
 * @param {number} count - Number of manufacturers to generate
 * @returns {Array} Array of manufacturer keyword objects
 */
function generateManufacturers(count) {
    const manufacturers = [];
    const sites = [
        { city: "Boston", state: "MA" },
        { city: "San Diego", state: "CA" },
        { city: "Miami", state: "FL" },
        { city: "Chicago", state: "IL" },
        { city: "Seattle", state: "WA" },
        { city: "Denver", state: "CO" },
        { city: "Atlanta", state: "GA" },
        { city: "Phoenix", state: "AZ" },
        { city: "Portland", state: "OR" },
        { city: "Orlando", state: "FL" },
        { city: "Philadelphia", state: "PA" },
        { city: "New York", state: "NY" },
        { city: "Minneapolis", state: "MN" },
        { city: "Detroit", state: "MI" },
        { city: "Los Angeles", state: "CA" },
        { city: "San Francisco", state: "CA" },
        { city: "Austin", state: "TX" },
        { city: "Cincinnati", state: "OH" },
        { city: "Salt Lake City", state: "UT" },
        { city: "Houston", state: "TX" },
        { city: "Dallas", state: "TX" },
        { city: "Charlotte", state: "NC" },
        { city: "Indianapolis", state: "IN" },
        { city: "Columbus", state: "OH" },
        { city: "San Antonio", state: "TX" },
        { city: "Nashville", state: "TN" },
        { city: "Baltimore", state: "MD" },
        { city: "Milwaukee", state: "WI" },
        { city: "Kansas City", state: "MO" },
        { city: "Raleigh", state: "NC" }
    ];

    const prefixes = [
        "Acme", "BioPharma", "Coastal", "Delta", "Evergreen",
        "Frontier", "Global Med", "Horizon", "Innovative", "Jupiter",
        "Keystone", "Liberty", "Midwest", "Northern", "Oceanic",
        "Pacific", "Quantum", "Riverside", "Summit", "Titan",
        "Universal", "Victory", "Westside", "Xcelerate", "Zenith",
        "Alpha", "Beta", "Gamma", "Epsilon", "Omega"
    ];

    const suffixes = [
        "Pharmaceutical Manufacturing",
        "BioSciences",
        "Pharma Labs",
        "Drug Industries",
        "Pharmaceuticals",
        "Drug Manufacturing",
        "BioTech",
        "Pharma Corp",
        "BioManufacturing",
        "Drug Works"
    ];

    for (let i = 0; i < count; i++) {
        const code = `MANU_${String(i + 1).padStart(3, '0')}`;
        const prefix = prefixes[i % prefixes.length];
        const suffix = suffixes[Math.floor(i / prefixes.length) % suffixes.length];
        const site = sites[i % sites.length];
        
        manufacturers.push({
            type: "manufacturer",
            code: code,
            codeSystem: "2.16.840.1.113883.9999.2",
            displayName: `${prefix} ${suffix} - ${site.city} Site`
        });
    }

    return manufacturers;
}

/**
 * Generate product name keywords
 * @param {number} count - Number of products to generate
 * @returns {Array} Array of product keyword objects
 */
function generateProducts(count) {
    const products = [];
    const drugNames = [
        { name: "Adalimumab", strength: "40mg/0.8mL", form: "Injectable Solution" },
        { name: "Bevacizumab", strength: "25mg/mL", form: "Injection" },
        { name: "Cetuximab", strength: "2mg/mL", form: "Infusion Solution" },
        { name: "Denosumab", strength: "60mg/mL", form: "Subcutaneous Injection" },
        { name: "Etanercept", strength: "50mg/mL", form: "Prefilled Syringe" },
        { name: "Filgrastim", strength: "300mcg/0.5mL", form: "Injectable" },
        { name: "Golimumab", strength: "50mg/0.5mL", form: "Autoinjector" },
        { name: "Trastuzumab", strength: "150mg", form: "Lyophilized Powder" },
        { name: "Infliximab", strength: "100mg", form: "Vial for IV Infusion" },
        { name: "Sitagliptin", strength: "100mg", form: "Tablets" },
        { name: "Pembrolizumab", strength: "100mg/4mL", form: "IV Solution" },
        { name: "Ranibizumab", strength: "10mg/mL", form: "Intravitreal Injection" },
        { name: "Metformin", strength: "1000mg", form: "Extended Release Tablets" },
        { name: "Pegfilgrastim", strength: "6mg/0.6mL", form: "Prefilled Syringe" },
        { name: "Nivolumab", strength: "10mg/mL", form: "Injection" },
        { name: "Prolia", strength: "60mg/mL", form: "Single-use Prefilled Syringe" },
        { name: "Remicade", strength: "100mg", form: "Powder for Injection" },
        { name: "Ustekinumab", strength: "45mg/0.5mL", form: "Subcutaneous Solution" },
        { name: "Dulaglutide", strength: "1.5mg/0.5mL", form: "Single-dose Pen" },
        { name: "Rivaroxaban", strength: "20mg", form: "Film-coated Tablets" },
        { name: "Apixaban", strength: "5mg", form: "Film-coated Tablets" },
        { name: "Empagliflozin", strength: "25mg", form: "Film-coated Tablets" },
        { name: "Liraglutide", strength: "6mg/mL", form: "Injection Pen" },
        { name: "Semaglutide", strength: "1mg/0.5mL", form: "Prefilled Pen" },
        { name: "Dapagliflozin", strength: "10mg", form: "Film-coated Tablets" },
        { name: "Canagliflozin", strength: "300mg", form: "Film-coated Tablets" },
        { name: "Atorvastatin", strength: "80mg", form: "Film-coated Tablets" },
        { name: "Rosuvastatin", strength: "40mg", form: "Film-coated Tablets" },
        { name: "Evolocumab", strength: "140mg/mL", form: "Autoinjector" },
        { name: "Alirocumab", strength: "150mg/mL", form: "Prefilled Pen" }
    ];

    const productTypes = [
        "Standard", "Extended Release", "Delayed Release", "Modified Release",
        "Immediate Release", "Controlled Release", "Sustained Release",
        "Long-Acting", "Short-Acting", "Rapid-Acting"
    ];

    for (let i = 0; i < count; i++) {
        const code = `PROD_${String(i + 1).padStart(3, '0')}`;
        const drug = drugNames[i % drugNames.length];
        
        let displayName;
        if (i < drugNames.length) {
            displayName = `${drug.name} ${drug.strength} ${drug.form}`;
        } else {
            const typeIndex = Math.floor(i / drugNames.length);
            const productType = productTypes[typeIndex % productTypes.length];
            displayName = `${drug.name} ${drug.strength} ${drug.form} (${productType})`;
        }
        
        products.push({
            type: "productName",
            code: code,
            codeSystem: "2.16.840.1.113883.9999.1",
            displayName: displayName
        });
    }

    return products;
}

/**
 * Generate documents that reference the keywords
 * @param {number} numManufacturers - Number of manufacturers
 * @param {number} numProducts - Number of products
 * @returns {Array} Array of document objects
 */
function generateDocuments(numManufacturers, numProducts) {
    const documents = [];
    const maxPairs = Math.max(numManufacturers, numProducts);

    // Generate pairs of documents (formulation + stability) for each product
    for (let i = 0; i < maxPairs; i++) {
        const manuCode = `MANU_${String((i % numManufacturers) + 1).padStart(3, '0')}`;
        const prodCode = `PROD_${String((i % numProducts) + 1).padStart(3, '0')}`;
        const suffix = String.fromCharCode(65 + (i % 26)); // A, B, C, etc.
        
        // Formulation data document
        documents.push({
            module: "m3",
            type: "product_info",
            title: `Drug Product ${suffix} - Formulation Data`,
            keywordRefs: [manuCode, prodCode]
        });

        // Stability data document
        documents.push({
            module: "m3",
            type: "drug_product",
            title: `Drug Product ${suffix} - Stability Data`,
            keywordRefs: [manuCode, prodCode]
        });
    }

    return documents;
}

/**
 * Generate a complete configuration
 * @param {object} params - Generation parameters
 * @param {number} params.manufacturer - Number of manufacturers
 * @param {number} params.productName - Number of products
 * @param {string} params.nda - NDA number (optional)
 * @param {string} params.sponsor - Sponsor name (optional)
 * @returns {object} Complete configuration object
 */
function generateConfiguration(params) {
    const {
        manufacturer = 10,
        productName = 10,
        nda = "999888",
        sponsor = "Global Pharmaceuticals Inc"
    } = params;

    // Generate keywords
    const manufacturers = generateManufacturers(manufacturer);
    const products = generateProducts(productName);

    // Generate documents
    const documents = generateDocuments(manufacturer, productName);

    // Build configuration
    const config = {
        application: {
            type: "NDA",
            number: nda,
            sponsor: sponsor
        },
        submission: {
            type: "original",
            sequenceNumber: 1,
            title: "Generated Submission with Multiple Keywords"
        },
        contacts: {
            regulatory: {
                firstName: "Jane",
                lastName: "Smith",
                email: "jane.smith@global.com",
                phone: "+1(555)123-4567",
                organization: sponsor
            },
            technical: {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@global.com",
                phone: "+1(555)987-6543",
                organization: sponsor
            }
        },
        documents: [
            { module: "m1", type: "356h", title: "Form FDA 356h" },
            { module: "m1", type: "cover", title: "Cover Letter" },
            ...documents
        ],
        keywords: [
            ...manufacturers,
            ...products
        ]
    };

    return config;
}

module.exports = {
    generateConfiguration,
    generateManufacturers,
    generateProducts,
    generateDocuments
};
