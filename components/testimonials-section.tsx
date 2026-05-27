"use client";

import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "José Carlos",
    initials: "JC",
    role: "Empreiteiro",
    text: "Compro na Gaúcho há mais de 5 anos. Sempre encontro tudo que preciso e o atendimento é excelente. Recomendo demais!",
    rating: 5,
  },
  {
    name: "Maria Souza",
    initials: "MS",
    role: "Construtora",
    text: "A entrega é sempre no prazo e os preços são os melhores de Rio Branco. Minha obra não para graças à Gaúcho!",
    rating: 5,
  },
  {
    name: "Antônio Lima",
    initials: "AL",
    role: "Pedreiro Autônomo",
    text: "Equipe muito atenciosa, me ajudaram a escolher os materiais certos pro meu projeto. Preço justo e qualidade garantida.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
          O que nossos clientes dizem
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12 bg-secondary">
                  <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold">
                    {testimonial.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-accent text-accent"
                  />
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed">
                &quot;{testimonial.text}&quot;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
