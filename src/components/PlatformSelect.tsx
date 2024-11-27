import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EXTENSION_MARKETPLACES } from "@/lib/constants";

interface PlatformSelectProps {
    value: string;
    onValueChange: (value: string) => void;
}

export default function PlatformSelect({ value, onValueChange }: PlatformSelectProps) {
    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger>
                <SelectValue placeholder="Select Platform" />
            </SelectTrigger>
            <SelectContent>
                {EXTENSION_MARKETPLACES.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}