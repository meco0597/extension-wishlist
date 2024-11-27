"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export interface Option {
    label: string;
    value: string;
}

interface MultiSelectProps {
    options: Option[];
    selected: string[];
    onChange: (values: string[]) => void;
    placeholder?: string;
    maxCount?: number;
    className?: string;
}

export function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = "Select options...",
    maxCount = 4,
    className,
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false);

    const selectedOptions = options.filter((option) => selected.includes(option.value));

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div
                    role="combobox"
                    aria-expanded={open}
                    className={`flex items-center gap-1 border rounded-md px-3 py-2 h-9 cursor-pointer bg-background hover:bg-accent hover:text-accent-foreground overflow-x-auto ${className}`}
                >
                    <div className="flex items-center gap-1 flex-nowrap">
                        {selectedOptions.length === 0 && (
                            <span className="text-muted-foreground text-sm">{placeholder}</span>
                        )}
                        {selectedOptions.map((option) => (
                            <Badge
                                key={option.value}
                                variant="secondary"
                                className="flex-shrink-0 items-center gap-1 whitespace-nowrap"
                            >
                                {option.label}
                                <button
                                    type="button"
                                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onChange(selected.filter((value) => value !== option.value));
                                    }}
                                >
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command>
                    <CommandList>

                        <CommandInput placeholder="Search... (Max 4)" className="h-9" />
                        <CommandEmpty>No options found.</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-auto">
                            {options.map((option) => {
                                const isSelected = selected.includes(option.value);
                                return (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() => {
                                            if (isSelected) {
                                                onChange(selected.filter((value) => value !== option.value));
                                            } else if (selected.length < maxCount) {
                                                onChange([...selected, option.value]);
                                            }
                                        }}
                                    >
                                        <div
                                            className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border ${isSelected ? "bg-primary border-primary" : "opacity-50"
                                                }`}
                                        >
                                            {isSelected && (
                                                <Check className="h-3 w-3 text-primary-foreground" />
                                            )}
                                        </div>
                                        {option.label}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover >
    );
}