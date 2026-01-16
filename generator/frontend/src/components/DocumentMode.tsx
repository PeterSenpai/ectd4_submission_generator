import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { DocumentItem } from "./DocumentItem";
import type { Document, Keyword, KeywordType } from "@/types/config";
import { Plus, Tags, FileText, Trash2 } from "lucide-react";

interface DocumentModeProps {
    documents: Document[];
    keywords: Keyword[];
    onDocumentsChange: (documents: Document[]) => void;
    onKeywordsChange: (keywords: Keyword[]) => void;
}

const KEYWORD_TYPE_OPTIONS: { value: KeywordType; label: string }[] = [
    { value: "manufacturer", label: "Manufacturer" },
    { value: "productName", label: "Product Name" },
    { value: "studyId", label: "Study ID" },
];

export function DocumentMode({
    documents,
    keywords,
    onDocumentsChange,
    onKeywordsChange,
}: DocumentModeProps) {
    const [newKeyword, setNewKeyword] = useState<{
        type: KeywordType;
        displayName: string;
    }>({
        type: "manufacturer",
        displayName: "",
    });

    const addDocument = () => {
        const newDoc: Document = {
            id: `doc_${Date.now()}`,
            module: "m3",
            type: "product_info",
            title: "",
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
        if (!newKeyword.displayName.trim()) return;

        const code = `${newKeyword.type.toUpperCase()}_${Date.now()}`;
        const keyword: Keyword = {
            type: newKeyword.type,
            code,
            codeSystem: `2.16.840.1.113883.9999.${newKeyword.type === "manufacturer" ? "2" : "1"}`,
            displayName: newKeyword.displayName.trim(),
        };
        onKeywordsChange([...keywords, keyword]);
        setNewKeyword({ ...newKeyword, displayName: "" });
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
                    <div className="flex gap-3">
                        <Select
                            value={newKeyword.type}
                            onValueChange={(value: KeywordType) =>
                                setNewKeyword({ ...newKeyword, type: value })
                            }
                        >
                            <SelectTrigger className="w-40 border-zinc-700 bg-zinc-900 text-zinc-100">
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
                        <Input
                            placeholder="Enter keyword name..."
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
                            className="flex-1 border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500"
                        />
                        <Button
                            onClick={addKeyword}
                            disabled={!newKeyword.displayName.trim()}
                            className="bg-violet-600 hover:bg-violet-500 text-white"
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                        </Button>
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
                                    <span className="text-xs text-zinc-500 mr-1">
                                        {keyword.type === "manufacturer"
                                            ? "MFG"
                                            : keyword.type === "productName"
                                              ? "PRD"
                                              : "STD"}
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
                        <ScrollArea className="h-[400px] pr-4">
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
                        </ScrollArea>
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
