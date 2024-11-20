interface FilterBarProps {
    filterSource: string;
    setFilterSource: (source: string) => void;
    sortOrder: 'most' | 'least';
    setSortOrder: (order: 'most' | 'least') => void;
}

export default function FilterBar({
    filterSource,
    setFilterSource,
    sortOrder,
    setSortOrder,
}: FilterBarProps) {
    return (
        <div className="flex justify-between mb-4">
            <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="select select-bordered"
            >
                <option value="">All Sources</option>
                <option value="Webflow">Webflow</option>
                <option value="Shopify">Shopify</option>
                <option value="Azure">Azure</option>
            </select>
            <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'most' | 'least')}
                className="select select-bordered"
            >
                <option value="most">Most Voted</option>
                <option value="least">Least Voted</option>
            </select>
        </div>
    );
}
