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
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";
import type { Product, Category } from "@/lib/products";
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

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const Icon = categoryIcons[product.category];

  const handleAdd = () => {
    addItem(product);
    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao orçamento.`,
    });
  };

  return (
    <div className="group bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-200">
      {/* Image area */}
      <div className="relative aspect-square bg-muted flex items-center justify-center">
        <Icon className="h-16 w-16 text-muted-foreground/50 group-hover:text-primary/50 transition-colors" />
        {product.promo && (
          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
            {product.promo}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
        <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        <p className="text-xl font-bold text-primary mt-2">
          R$ {product.price.toFixed(2).replace(".", ",")}
        </p>
        <Button
          onClick={handleAdd}
          className={cn(
            "w-full mt-3 bg-primary hover:bg-primary/90 text-primary-foreground"
          )}
        >
          <Plus className="h-4 w-4 mr-1" />
          Adicionar ao orçamento
        </Button>
      </div>
    </div>
  );
}
