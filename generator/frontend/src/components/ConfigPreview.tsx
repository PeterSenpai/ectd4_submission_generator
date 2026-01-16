import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import type { EctdConfig } from "@/types/config";
import { Copy, Download, Check } from "lucide-react";
import { useState } from "react";
import { downloadJson } from "@/lib/api";

interface ConfigPreviewProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    config: EctdConfig | null;
}

export function ConfigPreview({
    open,
    onOpenChange,
    config,
}: ConfigPreviewProps) {
    const [copied, setCopied] = useState(false);

    if (!config) return null;

    const jsonString = JSON.stringify(config, null, 2);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(jsonString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const filename = `ectd-config-${config.application.number || "draft"}.json`;
        downloadJson(config, filename);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl w-[90vw] max-h-[85vh] border-zinc-800 bg-zinc-950 flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-zinc-100">
                        Configuration Preview
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Review the generated eCTD configuration before
                        generating your submission
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 min-h-0 rounded-lg border border-zinc-800 bg-zinc-900/50 overflow-auto">
                    <pre className="p-4 text-sm text-emerald-400 whitespace-pre font-mono">
                        {jsonString}
                    </pre>
                </div>

                <DialogFooter className="gap-2 sm:gap-0 pt-4">
                    <Button
                        variant="outline"
                        onClick={handleCopy}
                        className="border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                    >
                        {copied ? (
                            <>
                                <Check className="h-4 w-4 mr-2 text-emerald-500" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy to Clipboard
                            </>
                        )}
                    </Button>
                    <Button
                        onClick={handleDownload}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Download JSON
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
