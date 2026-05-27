"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const slides = [
  {
    title: "Construa seus sonhos com a Gaúcho",
    subtitle: "Mais de 38 mil itens em estoque para sua obra",
    cta: "Ver Produtos",
    href: "#produtos",
  },
  {
    title: "Entrega em Rio Branco",
    subtitle: "Receba seus materiais direto na sua obra",
    cta: "Fazer Orçamento",
    href: "#produtos",
  },
  {
    title: "Atendimento Especializado",
    subtitle: "Nossa equipe entende do assunto e te ajuda a escolher",
    cta: "Fale Conosco",
    href: "#contato",
  },
];

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <section className="relative overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {slides.map((slide, index) => (
          <div key={index} className="flex-[0_0_100%] min-w-0">
            <div className="relative h-[400px] md:h-[480px] bg-secondary flex items-center justify-center">
              {/* Overlay pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 to-transparent" />
              </div>
              
              {/* Content */}
              <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-secondary-foreground mb-4 text-balance">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-xl text-secondary-foreground/80 mb-8">
                  {slide.subtitle}
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8"
                >
                  <a href={slide.href}>{slide.cta}</a>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <Button
        variant="ghost"
        size="icon"
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card text-foreground h-10 w-10 rounded-full"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card text-foreground h-10 w-10 rounded-full"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all",
              selectedIndex === index
                ? "bg-primary w-8"
                : "bg-card/60 hover:bg-card"
            )}
          />
        ))}
      </div>
    </section>
  );
}
