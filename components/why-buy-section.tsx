"use client";

import { Package, Headphones, BadgeDollarSign } from "lucide-react";

const benefits = [
  {
    icon: Package,
    title: "Estoque Robusto",
    description:
      "Mais de 38 mil itens disponíveis para sua obra. Encontre tudo o que precisa em um só lugar.",
  },
  {
    icon: Headphones,
    title: "Atendimento Direto",
    description:
      "Nossa equipe é especializada e está pronta para te ajudar a escolher os melhores materiais.",
  },
  {
    icon: BadgeDollarSign,
    title: "Preço Justo",
    description:
      "Trabalhamos com os melhores preços da região. Qualidade sem pesar no bolso.",
  },
];

export function WhyBuySection() {
  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
          Por que comprar na Gaúcho?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-muted hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
