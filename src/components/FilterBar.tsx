"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FilterBarProps {
    filterSource: string;
    setFilterSource: (source: string) => void;
    sortOrder: 'most' | 'least' | 'newest';
    setSortOrder: (order: 'most' | 'least' | 'newest') => void;
}

export default function FilterBar({
    filterSource,
    setFilterSource,
    sortOrder,
    setSortOrder,
}: FilterBarProps) {
    return (
        <div className="flex gap-4 mb-6">
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

            <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as 'most' | 'least')}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by votes" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="most">Most Voted</SelectItem>
                    <SelectItem value="least">Least Voted</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}