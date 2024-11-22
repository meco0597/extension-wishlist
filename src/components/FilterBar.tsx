"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TagSelect from "./TagSelect";

interface FilterBarProps {
    filterSource: string;
    setFilterSource: (source: string) => void;
    sortOrder: 'most' | 'newest';
    setSortOrder: (order: 'most' | 'newest') => void;
    filterTags: string[];
    setFilterTags: (tags: string[]) => void;
}

export default function FilterBar({
    filterSource,
    setFilterSource,
    sortOrder,
    setSortOrder,
    filterTags,
    setFilterTags
}: FilterBarProps) {
    return (
        <div className="flex gap-4 mb-6 max-w-3xl">
            <Select value={filterSource} onValueChange={setFilterSource}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by source" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value='All'>All Sources</SelectItem>
                    <SelectItem value="Webflow">Webflow</SelectItem>
                    <SelectItem value="Shopify">Shopify</SelectItem>
                    <SelectItem value="Azure">Azure</SelectItem>
                </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as 'most' | 'newest')}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="most">Most Popular</SelectItem>
                </SelectContent>
            </Select>

            <TagSelect
                selectedTags={filterTags}
                onTagsChange={setFilterTags}
                placeholder="Filter by tags"
                maxTags={4}
            />
        </div>
    );
}