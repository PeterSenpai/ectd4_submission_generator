import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { KeywordSettings } from "@/types/config";
import { Factory, Package, FlaskConical, FileStack } from "lucide-react";

interface KeywordModeProps {
    settings: KeywordSettings;
    onChange: (settings: KeywordSettings) => void;
}

interface KeywordRowProps {
    icon: React.ReactNode;
    label: string;
    description: string;
    enabled: boolean;
    count: number;
    onEnabledChange: (enabled: boolean) => void;
    onCountChange: (count: number) => void;
}

function KeywordRow({
    icon,
    label,
    description,
    enabled,
    count,
    onEnabledChange,
    onCountChange,
}: KeywordRowProps) {
    return (
        <div className="flex items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800/50 text-emerald-500">
                    {icon}
                </div>
                <div>
                    <Label className="text-base font-medium text-zinc-100">
                        {label}
                    </Label>
                    <p className="text-sm text-zinc-500">{description}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Label
                        htmlFor={`${label}-count`}
                        className="text-sm text-zinc-400"
                    >
                        Count:
                    </Label>
                    <Input
                        id={`${label}-count`}
                        type="number"
                        min={1}
                        max={1000}
                        value={count}
                        onChange={(e) =>
                            onCountChange(
                                Math.max(
                                    1,
                                    Math.min(1000, parseInt(e.target.value) || 1)
                                )
                            )
                        }
                        disabled={!enabled}
                        className="w-20 border-zinc-700 bg-zinc-900 text-center text-zinc-100 disabled:opacity-50"
                    />
                </div>
                <Switch
                    checked={enabled}
                    onCheckedChange={onEnabledChange}
                    className="data-[state=checked]:bg-emerald-500"
                />
            </div>
        </div>
    );
}

export function KeywordMode({ settings, onChange }: KeywordModeProps) {
    const updateSetting = (
        key: "manufacturer" | "productName" | "study",
        field: "enabled" | "count",
        value: boolean | number
    ) => {
        onChange({
            ...settings,
            [key]: {
                ...settings[key],
                [field]: value,
            },
        });
    };

    return (
        <Card className="border-zinc-800 bg-zinc-950/50">
            <CardHeader>
                <CardTitle className="text-xl text-zinc-100">
                    Keyword Configuration
                </CardTitle>
                <CardDescription className="text-zinc-400">
                    Select which types of keywords to generate and specify the
                    quantity for each type
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <KeywordRow
                    icon={<Factory className="h-5 w-5" />}
                    label="Manufacturer"
                    description="Manufacturing site identifiers"
                    enabled={settings.manufacturer.enabled}
                    count={settings.manufacturer.count}
                    onEnabledChange={(enabled) =>
                        updateSetting("manufacturer", "enabled", enabled)
                    }
                    onCountChange={(count) =>
                        updateSetting("manufacturer", "count", count)
                    }
                />

                <Separator className="bg-zinc-800" />

                <KeywordRow
                    icon={<Package className="h-5 w-5" />}
                    label="Product Name"
                    description="Drug product identifiers"
                    enabled={settings.productName.enabled}
                    count={settings.productName.count}
                    onEnabledChange={(enabled) =>
                        updateSetting("productName", "enabled", enabled)
                    }
                    onCountChange={(count) =>
                        updateSetting("productName", "count", count)
                    }
                />

                <Separator className="bg-zinc-800" />

                <KeywordRow
                    icon={<FlaskConical className="h-5 w-5" />}
                    label="Study ID"
                    description="Clinical study identifiers"
                    enabled={settings.study.enabled}
                    count={settings.study.count}
                    onEnabledChange={(enabled) =>
                        updateSetting("study", "enabled", enabled)
                    }
                    onCountChange={(count) =>
                        updateSetting("study", "count", count)
                    }
                />

                <Separator className="bg-zinc-800" />

                <div className="flex items-center gap-3 pt-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800/50 text-amber-500">
                        <FileStack className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                        <Label className="text-base font-medium text-zinc-100">
                            Auto-generate Documents
                        </Label>
                        <p className="text-sm text-zinc-500">
                            Create corresponding Module 3 documents for each
                            keyword
                        </p>
                    </div>
                    <Checkbox
                        checked={settings.generateDocuments}
                        onCheckedChange={(checked) =>
                            onChange({
                                ...settings,
                                generateDocuments: checked === true,
                            })
                        }
                        className="h-5 w-5 border-zinc-600 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                    />
                </div>
            </CardContent>
        </Card>
    );
}
