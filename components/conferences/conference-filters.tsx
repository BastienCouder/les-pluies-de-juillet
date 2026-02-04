"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X, Search } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

export function ConferenceFilters() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

    useEffect(() => {
        setSearchTerm(searchParams.get("search") || "");
    }, [searchParams]);

    const createQueryString = useCallback(
        (name: string, value: string | null) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value && value !== "all") {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            if (name !== "page") {
                params.set("page", "1");
            }
            return params.toString();
        },
        [searchParams]
    );

    const handleThemeChange = (value: string) => {
        router.push(pathname + "?" + createQueryString("theme", value));
    };

    const handleDateChange = (dates: string[]) => {
        const value = dates.length > 0 ? dates.join(",") : null;
        router.push(pathname + "?" + createQueryString("date", value));
    };

    const debouncedSearch = useDebouncedCallback((value: string) => {
        router.push(pathname + "?" + createQueryString("search", value));
    }, 300);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        debouncedSearch(value);
    };

    const resetFilters = () => {
        router.push(pathname);
    };

    const currentTheme = searchParams.get("theme") || "all";
    const currentDateParam = searchParams.get("date");
    const currentDates = currentDateParam ? currentDateParam.split(",") : [];

    const themes = [
        "Écologie & Habitat",
        "Biodiversité",
        "Numérique Responsable",
        "Engagement",
        "Musique",
        "Atelier"
    ];

    const dates = [
        { label: "VEN 17", value: "2026-07-17" },
        { label: "SAM 18", value: "2026-07-18" },
        { label: "DIM 19", value: "2026-07-19" },
    ];

    return (
        <div className="flex flex-col gap-8 mb-12 w-full max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 items-end">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                        <Input
                            placeholder="RECHERCHER UNE CONFÉRENCE..."
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="w-full min-w-[300px] border-2 border-accent text-lg py-5 pl-12 pr-4"
                        />
                    </div>
                <div className="flex flex-col gap-3 items-center md:items-start w-full md:w-auto">
                    <span className="text-xs font-bold uppercase tracking-widest text-foreground">Filtrer par date</span>
                    <div className="flex flex-wrap gap-2 justify-center">
                        <Button
                            variant={currentDates.length === 0 ? "default" : "outline"}
                            onClick={() => handleDateChange([])}
                            className={cn(currentDates.length === 0 ? "rounded-none bg-accent border-2 cursor-pointer border-secondary" : "")}
                        >
                            Tous
                        </Button>

                        <ToggleGroup type="multiple" value={currentDates} onValueChange={handleDateChange}>
                            {dates.map((d) => (
                                <ToggleGroupItem
                                    key={d.value}
                                    value={d.value}
                                    aria-label={d.label}
                                    className="rounded-none bg-secondary border-2 cursor-pointer border-accent px-5 py-2 h-auto text-sm font-bold uppercase tracking-wide border-2 
                                    data-[state=on]:bg-accent data-[state=on]:text-foreground data-[state=on]:border-accent
                                    hover:bg-secondary/5 hover:border-accent hover:text-accent whitespace-nowrap"
                                >
                                    {d.label}
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>
                    </div>
                </div>

                <div className="flex flex-col gap-3 w-full md:w-[300px]">
                    <span className="text-xs font-bold uppercase tracking-widest text-foreground text-center md:text-left">Filtrer par thème</span>
                    <Select value={currentTheme} onValueChange={handleThemeChange}>
                        <SelectTrigger className="w-full rounded-none cursor-pointer bg-secondary border-3 text-sm border-accent px-4 py-1.5 uppercase font-display font-bold tracking-wider hover:opacity-90 transition-all duration-300 hover:bg-accent hover:border-secondary rounded-none text-black cursor-pointer">
                            <SelectValue placeholder="TOUS LES THÈMES" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px] bg-secondary border-3 border-accent rounded-none">
                            <SelectItem value="all" className="uppercase font-bold text-xs tracking-wider">Tous les thèmes</SelectItem>
                            {themes.map((theme) => (
                                <SelectItem key={theme} value={theme} className="uppercase font-medium text-xs tracking-wide">
                                    {theme}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {(currentTheme !== "all" || currentDates.length > 0 || searchTerm) && (
                <div className="flex justify-center -mt-4">
                    <Button
                        variant="ghost"
                        onClick={resetFilters}
                        className="cursor-pointer border-2 border-accent text-foreground hover:bg-destructive/10 rounded-none px-6 gap-2 text-xs font-bold uppercase tracking-widest transition-colors"
                    >
                        <X size={14} /> Effacer les filtres
                    </Button>
                </div>
            )}
        </div>
    );
}