"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <section className="py-6 bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex gap-2 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar produtos..."
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
          <Button className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground">
            Buscar
          </Button>
        </div>
      </div>
    </section>
  );
}
