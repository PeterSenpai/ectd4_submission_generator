import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Document, DocumentModule, DocumentType, Keyword } from "@/types/config";
import { Trash2, GripVertical } from "lucide-react";

const MODULE_OPTIONS: { value: DocumentModule; label: string }[] = [
    { value: "m1", label: "Module 1 - Administrative" },
    { value: "m2", label: "Module 2 - Summaries" },
    { value: "m3", label: "Module 3 - Quality" },
    { value: "m4", label: "Module 4 - Nonclinical" },
    { value: "m5", label: "Module 5 - Clinical" },
];

const DOCUMENT_TYPE_OPTIONS: { value: DocumentType; label: string }[] = [
    { value: "356h", label: "Form FDA 356h" },
    { value: "cover", label: "Cover Letter" },
    { value: "product_info", label: "Product Information" },
    { value: "bioavailability", label: "Bioavailability Study" },
    { value: "clinical_summary", label: "Clinical Summary" },
    { value: "nonclinical_summary", label: "Nonclinical Summary" },
    { value: "quality_summary", label: "Quality Summary" },
    { value: "study_report", label: "Study Report" },
];

interface DocumentItemProps {
    document: Document;
    index: number;
    availableKeywords: Keyword[];
    onChange: (document: Document) => void;
    onRemove: () => void;
}

export function DocumentItem({
    document,
    index,
    availableKeywords,
    onChange,
    onRemove,
}: DocumentItemProps) {
    const handleFieldChange = <K extends keyof Document>(
        field: K,
        value: Document[K]
    ) => {
        onChange({ ...document, [field]: value });
    };

    const toggleKeyword = (keywordCode: string) => {
        const currentRefs = document.keywordRefs || [];
        const newRefs = currentRefs.includes(keywordCode)
            ? currentRefs.filter((k) => k !== keywordCode)
            : [...currentRefs, keywordCode];
        handleFieldChange("keywordRefs", newRefs);
    };

    return (
        <Card className="border-zinc-800 bg-zinc-900/50">
            <CardContent className="p-4">
                <div className="flex gap-4">
                    <div className="flex items-center text-zinc-600">
                        <GripVertical className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-zinc-400">
                                Document #{index + 1}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onRemove}
                                className="h-8 w-8 p-0 text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label className="text-zinc-400">
                                    Document Title
                                </Label>
                                <Input
                                    value={document.title}
                                    onChange={(e) =>
                                        handleFieldChange("title", e.target.value)
                                    }
                                    placeholder="Enter document title"
                                    className="border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-zinc-400">Module</Label>
                                <Select
                                    value={document.module}
                                    onValueChange={(value: DocumentModule) =>
                                        handleFieldChange("module", value)
                                    }
                                >
                                    <SelectTrigger className="border-zinc-700 bg-zinc-800 text-zinc-100">
                                        <SelectValue placeholder="Select module" />
                                    </SelectTrigger>
                                    <SelectContent className="border-zinc-700 bg-zinc-800">
                                        {MODULE_OPTIONS.map((option) => (
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

                            <div className="space-y-2">
                                <Label className="text-zinc-400">
                                    Document Type
                                </Label>
                                <Select
                                    value={document.type}
                                    onValueChange={(value: DocumentType) =>
                                        handleFieldChange("type", value)
                                    }
                                >
                                    <SelectTrigger className="border-zinc-700 bg-zinc-800 text-zinc-100">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent className="border-zinc-700 bg-zinc-800">
                                        {DOCUMENT_TYPE_OPTIONS.map((option) => (
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
                        </div>

                        {availableKeywords.length > 0 && (
                            <div className="space-y-2">
                                <Label className="text-zinc-400">
                                    Associated Keywords
                                </Label>
                                <div className="flex flex-wrap gap-2">
                                    {availableKeywords.map((keyword) => {
                                        const isSelected =
                                            document.keywordRefs?.includes(
                                                keyword.code
                                            );
                                        return (
                                            <Badge
                                                key={keyword.code}
                                                variant={
                                                    isSelected
                                                        ? "default"
                                                        : "outline"
                                                }
                                                className={`cursor-pointer transition-colors ${
                                                    isSelected
                                                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/30"
                                                        : "border-zinc-600 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300"
                                                }`}
                                                onClick={() =>
                                                    toggleKeyword(keyword.code)
                                                }
                                            >
                                                {keyword.displayName}
                                            </Badge>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
