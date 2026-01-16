import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DocumentItem } from "./DocumentItem";
import type { Document, Keyword, KeywordType } from "@/types/config";
import { Plus, Tags, FileText, Trash2 } from "lucide-react";

interface DocumentModeProps {
    documents: Document[];
    keywords: Keyword[];
    onDocumentsChange: (documents: Document[]) => void;
    onKeywordsChange: (keywords: Keyword[]) => void;
}

const KEYWORD_TYPE_OPTIONS: { value: KeywordType; label: string; prefix: string }[] = [
    { value: "manufacturer", label: "Manufacturer", prefix: "MANU" },
    { value: "productName", label: "Product Name", prefix: "PROD" },
    { value: "studyId", label: "Study ID", prefix: "STUDY" },
];

const DOCUMENT_TYPE_TITLES: Record<string, string> = {
    "356h": "Form FDA 356h",
    "cover": "Cover Letter",
    "product_info": "Product Information",
    "bioavailability": "Bioavailability Study Report",
    "clinical_summary": "Clinical Summary",
    "nonclinical_summary": "Nonclinical Summary",
    "quality_summary": "Quality Summary",
    "study_report": "Study Report",
};

const MODULE_LABELS: Record<string, string> = {
    "m1": "M1",
    "m2": "M2",
    "m3": "M3",
    "m4": "M4",
    "m5": "M5",
};

// Generate a unique counter for each keyword type
let keywordCounters: Record<KeywordType, number> = {
    manufacturer: 1,
    productName: 1,
    studyId: 1,
};

export function DocumentMode({
    documents,
    keywords,
    onDocumentsChange,
    onKeywordsChange,
}: DocumentModeProps) {
    const getNextKeywordDefaults = (type: KeywordType) => {
        const option = KEYWORD_TYPE_OPTIONS.find(o => o.value === type)!;
        const count = keywordCounters[type];
        const code = `${option.prefix}_${String(count).padStart(3, "0")}`;
        const displayName = type === "manufacturer" 
            ? `Manufacturing Site ${count}`
            : type === "productName"
            ? `Drug Product ${count}`
            : `Clinical Study ${count}`;
        return { code, displayName };
    };

    const [newKeyword, setNewKeyword] = useState<{
        type: KeywordType;
        code: string;
        displayName: string;
    }>(() => {
        const defaults = getNextKeywordDefaults("manufacturer");
        return {
            type: "manufacturer",
            ...defaults,
        };
    });

    // Update defaults when type changes
    const handleTypeChange = (type: KeywordType) => {
        const defaults = getNextKeywordDefaults(type);
        setNewKeyword({
            type,
            ...defaults,
        });
    };

    const addDocument = () => {
        const module = "m3";
        const type = "product_info";
        const newDoc: Document = {
            id: `doc_${Date.now()}`,
            module,
            type,
            title: `[title] [${MODULE_LABELS[module]}] ${DOCUMENT_TYPE_TITLES[type]}`,
            keywordRefs: [],
        };
        onDocumentsChange([...documents, newDoc]);
    };

    const updateDocument = (index: number, document: Document) => {
        const updated = [...documents];
        updated[index] = document;
        onDocumentsChange(updated);
    };

    const removeDocument = (index: number) => {
        onDocumentsChange(documents.filter((_, i) => i !== index));
    };

    const addKeyword = () => {
        if (!newKeyword.code.trim() || !newKeyword.displayName.trim()) return;

        // Check if code already exists
        if (keywords.some(k => k.code === newKeyword.code.trim())) {
            alert("Keyword code already exists. Please use a unique code.");
            return;
        }

        const keyword: Keyword = {
            type: newKeyword.type,
            code: newKeyword.code.trim(),
            codeSystem: `2.16.840.1.113883.9999.${newKeyword.type === "manufacturer" ? "2" : "1"}`,
            displayName: newKeyword.displayName.trim(),
        };
        onKeywordsChange([...keywords, keyword]);
        
        // Increment counter and reset form with new defaults
        keywordCounters[newKeyword.type]++;
        const defaults = getNextKeywordDefaults(newKeyword.type);
        setNewKeyword({
            type: newKeyword.type,
            ...defaults,
        });
    };

    const removeKeyword = (code: string) => {
        onKeywordsChange(keywords.filter((k) => k.code !== code));
        // Also remove keyword refs from documents
        onDocumentsChange(
            documents.map((doc) => ({
                ...doc,
                keywordRefs: doc.keywordRefs?.filter((ref) => ref !== code),
            }))
        );
    };

    return (
        <div className="space-y-6">
            {/* Keywords Section */}
            <Card className="border-zinc-800 bg-zinc-950/50">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Tags className="h-5 w-5 text-violet-500" />
                        <CardTitle className="text-lg text-zinc-100">
                            Keywords
                        </CardTitle>
                    </div>
                    <CardDescription className="text-zinc-400">
                        Define custom keywords that can be associated with
                        documents
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Add Keyword Form */}
                    <div className="grid gap-3 sm:grid-cols-[140px_1fr_1fr_auto]">
                        <div className="space-y-1">
                            <Label className="text-xs text-zinc-500">Type</Label>
                            <Select
                                value={newKeyword.type}
                                onValueChange={(value: KeywordType) => handleTypeChange(value)}
                            >
                                <SelectTrigger className="border-zinc-700 bg-zinc-900 text-zinc-100">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="border-zinc-700 bg-zinc-800">
                                    {KEYWORD_TYPE_OPTIONS.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                            className="text-zinc-100 focus:bg-zinc-700"
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-zinc-500">Code</Label>
                            <Input
                                placeholder="e.g., MANU_001"
                                value={newKeyword.code}
                                onChange={(e) =>
                                    setNewKeyword({
                                        ...newKeyword,
                                        code: e.target.value,
                                    })
                                }
                                className="border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500 font-mono"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-zinc-500">Display Name</Label>
                            <Input
                                placeholder="e.g., Manufacturing Site 1"
                                value={newKeyword.displayName}
                                onChange={(e) =>
                                    setNewKeyword({
                                        ...newKeyword,
                                        displayName: e.target.value,
                                    })
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") addKeyword();
                                }}
                                className="border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-zinc-500 invisible">Add</Label>
                            <Button
                                onClick={addKeyword}
                                disabled={!newKeyword.code.trim() || !newKeyword.displayName.trim()}
                                className="bg-violet-600 hover:bg-violet-500 text-white w-full"
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Add
                            </Button>
                        </div>
                    </div>

                    {/* Keywords List */}
                    {keywords.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {keywords.map((keyword) => (
                                <Badge
                                    key={keyword.code}
                                    variant="secondary"
                                    className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 group pr-1"
                                >
                                    <span className="text-xs text-zinc-500 mr-1 font-mono">
                                        {keyword.code}
                                    </span>
                                    {keyword.displayName}
                                    <button
                                        onClick={() =>
                                            removeKeyword(keyword.code)
                                        }
                                        className="ml-1 p-1 rounded hover:bg-red-500/20 text-zinc-500 hover:text-red-400"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    )}

                    {keywords.length === 0 && (
                        <p className="text-sm text-zinc-500 italic">
                            No keywords defined yet. Add keywords above to
                            associate them with documents.
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Documents Section */}
            <Card className="border-zinc-800 bg-zinc-950/50">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-cyan-500" />
                            <CardTitle className="text-lg text-zinc-100">
                                Documents
                            </CardTitle>
                            <Badge
                                variant="secondary"
                                className="bg-zinc-800 text-zinc-400"
                            >
                                {documents.length}
                            </Badge>
                        </div>
                        <Button
                            onClick={addDocument}
                            className="bg-cyan-600 hover:bg-cyan-500 text-white"
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Document
                        </Button>
                    </div>
                    <CardDescription className="text-zinc-400">
                        Define documents and their module placements
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {documents.length > 0 ? (
                        <div className="space-y-3">
                            {documents.map((doc, index) => (
                                <DocumentItem
                                    key={doc.id || index}
                                    document={doc}
                                    index={index}
                                    availableKeywords={keywords}
                                    onChange={(updated) =>
                                        updateDocument(index, updated)
                                    }
                                    onRemove={() => removeDocument(index)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                            <FileText className="h-12 w-12 mb-3 opacity-50" />
                            <p className="text-lg font-medium">
                                No documents yet
                            </p>
                            <p className="text-sm">
                                Click "Add Document" to create your first
                                document
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
