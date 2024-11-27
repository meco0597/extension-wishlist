"use client";

import * as React from "react";
import { MultiSelect, type Option } from "./MultiSelect";
import { SOFTWARE_TAGS } from "@/lib/constants";

interface CategorySelectProps {
    selectedCategories: string[];
    onCategoriesChange: (categories: string[]) => void;
    placeholder?: string;
    maxCategories?: number;
}

export default function CategorySelect({
    selectedCategories,
    onCategoriesChange,
    placeholder = "Filter by categories",
    maxCategories = 4
}: CategorySelectProps) {
    const options: Option[] = React.useMemo(
        () => SOFTWARE_TAGS.map(category => ({ label: category, value: category })),
        []
    );

    return (
        <div className="w-full">
            <MultiSelect
                options={options}
                selected={selectedCategories}
                onChange={onCategoriesChange}
                placeholder={placeholder}
                maxCount={maxCategories}
            />
        </div>
    );
}