"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
    CommandEmpty,
} from "@/components/ui/command";
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
    placeholder,
    maxTags = 4
}: TagSelectProps) {
    const [search, setSearch] = React.useState("");
    const [isOpen, setIsOpen] = React.useState(false);
    const [dropdownPosition, setDropdownPosition] = React.useState<"above" | "below">("below");
    const inputRef = React.useRef<HTMLInputElement>(null);
    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const [highlightedIndex, setHighlightedIndex] = React.useState(0);

    const filteredTags = React.useMemo(
        () =>
            SOFTWARE_TAGS.filter(
                (tag) =>
                    tag.toLowerCase().includes(search.toLowerCase()) &&
                    !selectedTags.includes(tag) &&
                    selectedTags.length < maxTags
            ),
        [search, selectedTags, maxTags]
    );

    const handleSelectTag = (tag: string) => {
        if (!selectedTags.includes(tag) && selectedTags.length < maxTags) {
            onTagsChange([...selectedTags, tag]);
        }
        setSearch("");
        setHighlightedIndex(0);
    };

    const handleRemoveTag = (tag: string) => {
        onTagsChange(selectedTags.filter((t) => t !== tag));
    };

    const handleKeyboardNavigation = (e: React.KeyboardEvent) => {
        if (filteredTags.length === 0) return;

        switch (e.key) {
            case "ArrowDown":
                setHighlightedIndex((prevIndex) => (prevIndex + 1) % filteredTags.length);
                break;
            case "ArrowUp":
                setHighlightedIndex((prevIndex) =>
                    (prevIndex - 1 + filteredTags.length) % filteredTags.length
                );
                break;
            case "Enter":
                e.preventDefault();
                handleSelectTag(filteredTags[highlightedIndex]);
                break;
            default:
                break;
        }
    };

    React.useEffect(() => {
        if (dropdownRef.current && inputRef.current) {
            const inputRect = inputRef.current.getBoundingClientRect();
            const dropdownRect = dropdownRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - inputRect.bottom;
            const spaceAbove = inputRect.top;

            if (dropdownRect.height > spaceBelow && spaceAbove > spaceBelow) {
                setDropdownPosition("above");
            } else {
                setDropdownPosition("below");
            }
        }
    }, [isOpen, filteredTags]);

    return (
        <div className="relative w-full">
            <div
                className="flex items-center gap-1 border rounded-md px-3 py-2 h-10 cursor-text bg-background hover:bg-accent hover:text-accent-foreground overflow-x-auto"
                onClick={() => inputRef.current?.focus()}
            >
                <div className="flex items-center gap-1 flex-nowrap">
                    {selectedTags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex-shrink-0 items-center gap-1 whitespace-nowrap">
                            {tag}
                            <button
                                type="button"
                                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleRemoveTag(tag);
                                }}
                            >
                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                            </button>
                        </Badge>
                    ))}
                    <input
                        ref={inputRef}
                        type="text"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
                        onKeyDown={handleKeyboardNavigation}
                        placeholder={selectedTags.length === 0
                            ? (placeholder || "Search tags...")
                            : selectedTags.length >= maxTags
                                ? "Max tags reached"
                                : ""}
                        className="flex-shrink min-w-[50px] bg-transparent border-0 outline-none text-sm p-0 placeholder:text-muted-foreground"
                        disabled={selectedTags.length >= maxTags}
                    />
                </div>
            </div>

            {isOpen && selectedTags.length < maxTags && (
                <div
                    ref={dropdownRef}
                    className={`absolute z-50 w-full mt-2 bg-popover border rounded-md shadow-md ${dropdownPosition === "above" ? "bottom-full mb-2" : "top-full"
                        }`}
                >
                    <Command className="max-h-64 overflow-y-auto">
                        <CommandList>
                            {filteredTags.length > 0 ? (
                                <CommandGroup>
                                    {filteredTags.map((tag, index) => (
                                        <CommandItem
                                            key={tag}
                                            onSelect={() => handleSelectTag(tag)}
                                            className={`cursor-pointer px-2 py-1.5 text-sm ${index === highlightedIndex
                                                    ? "bg-accent text-accent-foreground"
                                                    : "hover:bg-accent hover:text-accent-foreground"
                                                }`}
                                        >
                                            {tag}
                                            {index === highlightedIndex && (
                                                <span className="ml-2 text-xs text-muted-foreground">
                                                    Enter to add
                                                </span>
                                            )}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            ) : (
                                <CommandEmpty>No results found.</CommandEmpty>
                            )}
                        </CommandList>
                    </Command>
                </div>
            )}
        </div>
    );
}