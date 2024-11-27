"use client";

import * as React from "react";
import { MultiSelect, type Option } from "./MultiSelect";
import { EXTENSION_MARKETPLACES } from "@/lib/constants";

interface PlatformSelectProps {
    selectedPlatforms: string[];
    onPlatformsChange: (platforms: string[]) => void;
    placeholder?: string;
    maxPlatforms?: number;
}

export default function PlatformMultiSelect({
    selectedPlatforms,
    onPlatformsChange,
    placeholder = "Filter by platforms",
    maxPlatforms = 4
}: PlatformSelectProps) {
    const options: Option[] = React.useMemo(
        () => EXTENSION_MARKETPLACES.map(platform => ({ label: platform, value: platform })),
        []
    );

    return (
        <div className="w-full">
            <MultiSelect
                options={options}
                selected={selectedPlatforms}
                onChange={onPlatformsChange}
                placeholder={placeholder}
                maxCount={maxPlatforms}
            />
        </div>
    );
}