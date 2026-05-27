"use client";

import { Store, Truck, Package, Headphones } from "lucide-react";

const trustItems = [
  { icon: Store, label: "Loja Física" },
  { icon: Truck, label: "Entrega em Rio Branco" },
  { icon: Package, label: "+38mil itens em estoque" },
  { icon: Headphones, label: "Atendimento Direto" },
];

export function TrustBar() {
  return (
    <section className="bg-secondary py-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trustItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-center gap-2 text-secondary-foreground"
            >
              <item.icon className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
