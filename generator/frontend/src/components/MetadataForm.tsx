import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { MetadataState } from "@/types/config";
import { FileText } from "lucide-react";

interface MetadataFormProps {
    metadata: MetadataState;
    onChange: (metadata: MetadataState) => void;
}

export function MetadataForm({ metadata, onChange }: MetadataFormProps) {
    const handleChange = (field: keyof MetadataState, value: string) => {
        onChange({ ...metadata, [field]: value });
    };

    return (
        <Card className="border-zinc-800 bg-zinc-950/50">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-emerald-500" />
                    <CardTitle className="text-lg text-zinc-100">
                        Application Metadata
                    </CardTitle>
                </div>
                <CardDescription className="text-zinc-400">
                    Basic information about your eCTD submission
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                    <Label htmlFor="nda" className="text-zinc-300">
                        NDA Number
                    </Label>
                    <Input
                        id="nda"
                        placeholder="e.g., 123456"
                        value={metadata.nda}
                        onChange={(e) => handleChange("nda", e.target.value)}
                        className="border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="sponsor" className="text-zinc-300">
                        Sponsor Name
                    </Label>
                    <Input
                        id="sponsor"
                        placeholder="e.g., Pharma Corp Inc"
                        value={metadata.sponsor}
                        onChange={(e) =>
                            handleChange("sponsor", e.target.value)
                        }
                        className="border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="title" className="text-zinc-300">
                        Submission Title
                    </Label>
                    <Input
                        id="title"
                        placeholder="e.g., Original Application"
                        value={metadata.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        className="border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                    />
                </div>
            </CardContent>
        </Card>
    );
}
