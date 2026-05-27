"use client";

import { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./product-card";
import { products, type Category } from "@/lib/products";
import { cn } from "@/lib/utils";

interface ProductsSectionProps {
  searchQuery: string;
  selectedCategory: Category | null;
  onSelectCategory: (category: Category | null) => void;
}

export function ProductsSection({
  searchQuery,
  selectedCategory,
  onSelectCategory,
}: ProductsSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState<"todos" | "destaques">("destaques");

  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by featured
    if (filter === "destaques" && !searchQuery && !selectedCategory) {
      result = result.filter((p) => p.featured);
    }

    return result;
  }, [searchQuery, selectedCategory, filter]);

  const displayedProducts = showAll
    ? filteredProducts
    : filteredProducts.slice(0, 8);

  const uniqueCategories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))];
    return cats;
  }, []);

  return (
    <section id="produtos" className="py-12 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-6">
          Nossos Produtos
        </h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFilter("todos");
              onSelectCategory(null);
            }}
            className={cn(
              filter === "todos" && !selectedCategory
                ? "bg-primary text-primary-foreground border-primary"
                : ""
            )}
          >
            Todos
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFilter("destaques");
              onSelectCategory(null);
            }}
            className={cn(
              filter === "destaques" && !selectedCategory
                ? "bg-primary text-primary-foreground border-primary"
                : ""
            )}
          >
            Destaques
          </Button>
          {uniqueCategories.map((cat) => (
            <Button
              key={cat}
              variant="outline"
              size="sm"
              onClick={() => {
                setFilter("todos");
                onSelectCategory(cat);
              }}
              className={cn(
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : ""
              )}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Show more */}
        {filteredProducts.length > 8 && !showAll && (
          <div className="text-center mt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowAll(true)}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Ver todos os produtos
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhum produto encontrado. Tente outra busca.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
