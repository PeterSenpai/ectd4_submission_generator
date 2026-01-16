import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetadataForm } from "@/components/MetadataForm";
import { KeywordMode } from "@/components/KeywordMode";
import { DocumentMode } from "@/components/DocumentMode";
import { OutputActions } from "@/components/OutputActions";
import { ConfigPreview } from "@/components/ConfigPreview";
import {
    generateConfig,
    generateCustomSubmission,
    downloadBlob,
    downloadJson,
} from "@/lib/api";
import type {
    MetadataState,
    KeywordSettings,
    Document,
    Keyword,
    EctdConfig,
} from "@/types/config";
import { FileCode2, Tags, FileText, AlertCircle } from "lucide-react";

function App() {
    // Metadata state
    const [metadata, setMetadata] = useState<MetadataState>({
        nda: "999888",
        sponsor: "Sample Pharmaceuticals Inc",
        title: "Original Application",
    });

    // Keyword mode state
    const [keywordSettings, setKeywordSettings] = useState<KeywordSettings>({
        manufacturer: { enabled: true, count: 3 },
        productName: { enabled: true, count: 3 },
        study: { enabled: false, count: 1 },
        generateDocuments: true,
    });

    // Document mode state
    const [documents, setDocuments] = useState<Document[]>([]);
    const [keywords, setKeywords] = useState<Keyword[]>([]);

    // Active tab
    const [activeTab, setActiveTab] = useState("keyword");

    // UI state
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewConfig, setPreviewConfig] = useState<EctdConfig | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Build config based on active mode
    const buildConfig = async (): Promise<EctdConfig> => {
        if (activeTab === "keyword") {
            // Use the API to generate config from keyword settings
            const params = {
                manufacturer: keywordSettings.manufacturer.enabled
                    ? keywordSettings.manufacturer.count
                    : 0,
                productName: keywordSettings.productName.enabled
                    ? keywordSettings.productName.count
                    : 0,
                nda: metadata.nda || "999888",
                sponsor: metadata.sponsor || "Sample Pharmaceuticals Inc",
            };

            const response = await generateConfig(params);

            // Add study keywords if enabled
            if (keywordSettings.study.enabled) {
                const studyKeywords: Keyword[] = [];
                const studyDocs: Document[] = [];

                for (let i = 1; i <= keywordSettings.study.count; i++) {
                    const code = `STUDY_${String(i).padStart(3, "0")}`;
                    studyKeywords.push({
                        type: "studyId",
                        code,
                        codeSystem: "2.16.840.1.113883.9999.1",
                        displayName: `Clinical Study ${code}`,
                    });

                    if (keywordSettings.generateDocuments) {
                        studyDocs.push({
                            module: "m5",
                            type: "bioavailability",
                            title: `Bioavailability Study Report - ${code}`,
                            keywordRefs: [code],
                        });
                    }
                }

                response.config.keywords = [
                    ...(response.config.keywords || []),
                    ...studyKeywords,
                ];

                if (keywordSettings.generateDocuments) {
                    response.config.documents = [
                        ...response.config.documents,
                        ...studyDocs,
                    ];
                }
            }

            // Update title if provided
            if (metadata.title) {
                response.config.submission.title = metadata.title;
            }

            return response.config;
        } else {
            // Document mode - build config from manual inputs
            const config: EctdConfig = {
                application: {
                    type: "NDA",
                    number: metadata.nda || "999888",
                    sponsor: metadata.sponsor || "Sample Pharmaceuticals Inc",
                },
                submission: {
                    type: "original",
                    sequenceNumber: 1,
                    title: metadata.title || "Original Application",
                },
                contacts: {
                    regulatory: {
                        firstName: "Jane",
                        lastName: "Smith",
                        email: "regulatory@pharma.com",
                        phone: "+1(555)123-4567",
                        organization:
                            metadata.sponsor || "Sample Pharmaceuticals Inc",
                    },
                    technical: {
                        firstName: "John",
                        lastName: "Doe",
                        email: "technical@pharma.com",
                        phone: "+1(555)987-6543",
                        organization:
                            metadata.sponsor || "Sample Pharmaceuticals Inc",
                    },
                },
                documents: [
                    // Always include required m1 documents
                    {
                        module: "m1",
                        type: "356h",
                        title: "Form FDA 356h",
                    },
                    {
                        module: "m1",
                        type: "cover",
                        title: "Cover Letter",
                    },
                    // Add user-defined documents
                    ...documents,
                ],
                keywords: keywords,
            };
            return config;
        }
    };

    // Handle preview
    const handlePreview = async () => {
        setError(null);
        try {
            const config = await buildConfig();
            setPreviewConfig(config);
            setPreviewOpen(true);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to build config"
            );
        }
    };

    // Handle download config
    const handleDownloadConfig = async () => {
        setError(null);
        try {
            const config = await buildConfig();
            const filename = `ectd-config-${config.application.number}.json`;
            downloadJson(config, filename);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to build config"
            );
        }
    };

    // Handle generate ZIP
    const handleGenerateZip = async () => {
        setError(null);
        setIsGenerating(true);
        try {
            const config = await buildConfig();
            const blob = await generateCustomSubmission(config);
            const filename = `${config.application.number}_seq${config.submission.sequenceNumber}.zip`;
            downloadBlob(blob, filename);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to generate submission"
            );
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            {/* Header */}
            <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500">
                            <FileCode2 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold tracking-tight">
                                eCTD 4.0 Submission Generator
                            </h1>
                            <p className="text-sm text-zinc-500">
                                Generate compliant FDA submission packages
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-6 space-y-6">
                {/* Error Display */}
                {error && (
                    <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                {/* Metadata Form */}
                <MetadataForm metadata={metadata} onChange={setMetadata} />

                {/* Mode Tabs */}
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="space-y-4"
                >
                    <TabsList className="bg-zinc-900 border border-zinc-800 p-1">
                        <TabsTrigger
                            value="keyword"
                            className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 text-zinc-400"
                        >
                            <Tags className="h-4 w-4 mr-2" />
                            Keyword Mode
                        </TabsTrigger>
                        <TabsTrigger
                            value="document"
                            className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 text-zinc-400"
                        >
                            <FileText className="h-4 w-4 mr-2" />
                            Document Mode
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="keyword" className="mt-4">
                        <KeywordMode
                            settings={keywordSettings}
                            onChange={setKeywordSettings}
                        />
                    </TabsContent>

                    <TabsContent value="document" className="mt-4">
                        <DocumentMode
                            documents={documents}
                            keywords={keywords}
                            onDocumentsChange={setDocuments}
                            onKeywordsChange={setKeywords}
                        />
                    </TabsContent>
                </Tabs>

                {/* Output Actions */}
                <OutputActions
                    onPreview={handlePreview}
                    onDownloadConfig={handleDownloadConfig}
                    onGenerateZip={handleGenerateZip}
                    isGenerating={isGenerating}
                />
            </main>

            {/* Config Preview Modal */}
            <ConfigPreview
                open={previewOpen}
                onOpenChange={setPreviewOpen}
                config={previewConfig}
            />
        </div>
    );
}

export default App;
