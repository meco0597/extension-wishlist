"use client";

import * as React from "react";
import { MultiSelect, type Option } from "./MultiSelect";
import { SOFTWARE_TAGS } from "@/lib/constants";

interface TagSelectProps {
    selectedTags: string[];
    onTagsChange: (tags: string[]) => void;
    placeholder?: string;
    maxTags?: number;
}

export default function TagSelect({
    selectedTags,
    onTagsChange,
    placeholder = "Filter by tags",
    maxTags = 4
}: TagSelectProps) {
    const options: Option[] = React.useMemo(
        () => SOFTWARE_TAGS.map(tag => ({ label: tag, value: tag })),
        []
    );

    return (
        <div className="w-full">
            <MultiSelect
                options={options}
                selected={selectedTags}
                onChange={onTagsChange}
                placeholder={placeholder}
                maxCount={maxTags}
            />
        </div>
    );
}