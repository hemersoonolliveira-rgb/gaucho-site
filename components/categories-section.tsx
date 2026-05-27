"use client";

import {
  Droplet,
  Zap,
  Wrench,
  Paintbrush,
  Layers,
  HardHat,
  Lock,
  Home,
  Building,
  Package,
} from "lucide-react";
import { categories, type Category } from "@/lib/products";
import { cn } from "@/lib/utils";

const categoryIcons: Record<Category, React.ElementType> = {
  "Hidráulica": Droplet,
  "Elétrica": Zap,
  "Ferramentas": Wrench,
  "Tintas": Paintbrush,
  "Argamassa": Layers,
  "EPI": HardHat,
  "Ferragens": Lock,
  "Cobertura": Home,
  "Construção Pesada": Building,
  "Acessórios": Package,
};

interface CategoriesSectionProps {
  selectedCategory: Category | null;
  onSelectCategory: (category: Category | null) => void;
}

export function CategoriesSection({
  selectedCategory,
  onSelectCategory,
}: CategoriesSectionProps) {
  return (
    <section id="categorias" className="py-12 bg-card">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
          Categorias
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((category) => {
            const Icon = categoryIcons[category.name];
            const isSelected = selectedCategory === category.name;
            return (
              <button
                key={category.name}
                onClick={() =>
                  onSelectCategory(isSelected ? null : category.name)
                }
                className={cn(
                  "group flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all duration-200",
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-transparent bg-muted hover:border-primary/50 hover:bg-muted/80"
                )}
              >
                <div
                  className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center transition-colors",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground group-hover:bg-primary group-hover:text-primary-foreground"
                  )}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-sm text-foreground">
                    {category.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {category.count} produtos
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
