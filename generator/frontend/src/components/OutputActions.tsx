import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Eye, Download, FileArchive, Loader2 } from "lucide-react";

interface OutputActionsProps {
    onPreview: () => void;
    onDownloadConfig: () => void;
    onGenerateZip: () => void;
    isGenerating: boolean;
    disabled?: boolean;
}

export function OutputActions({
    onPreview,
    onDownloadConfig,
    onGenerateZip,
    isGenerating,
    disabled,
}: OutputActionsProps) {
    return (
        <Card className="border-zinc-800 bg-zinc-950/50 sticky bottom-4">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg text-zinc-100">
                    Output Actions
                </CardTitle>
                <CardDescription className="text-zinc-400">
                    Preview your configuration or generate the submission
                    package
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-3">
                    <Button
                        variant="outline"
                        onClick={onPreview}
                        disabled={disabled}
                        className="border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                    >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview Config
                    </Button>

                    <Button
                        variant="outline"
                        onClick={onDownloadConfig}
                        disabled={disabled}
                        className="border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Download Config
                    </Button>

                    <Button
                        onClick={onGenerateZip}
                        disabled={disabled || isGenerating}
                        className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-lg shadow-emerald-500/25"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <FileArchive className="h-4 w-4 mr-2" />
                                Generate Submission ZIP
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
