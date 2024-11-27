"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CategorySelect from "./CategorySelect";
import PlatformMultiSelect from "./PlatformMultiSelect";

interface FilterBarProps {
    filterPlatforms: string[];
    setFilterPlatform: (platform: string[]) => void;
    sortOrder: 'most' | 'newest';
    setSortOrder: (order: 'most' | 'newest') => void;
    filterCategories: string[];
    setFilterCategories: (categories: string[]) => void;
}

export default function FilterBar({
    filterPlatforms,
    setFilterPlatform,
    sortOrder,
    setSortOrder,
    filterCategories,
    setFilterCategories
}: FilterBarProps) {
    return (
        <div className="flex gap-4 mb-6 sm:flex-row max-w-3xl">

            <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as 'most' | 'newest')}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="most">Most Popular</SelectItem>
                </SelectContent>
            </Select>

            <PlatformMultiSelect
                selectedPlatforms={filterPlatforms}
                onPlatformsChange={setFilterPlatform}
                placeholder="Filter by Platform"
                maxPlatforms={4}
            />

            <CategorySelect
                selectedCategories={filterCategories}
                onCategoriesChange={setFilterCategories}
                placeholder="Filter by categories"
                maxCategories={4}
            />
        </div>
    );
}