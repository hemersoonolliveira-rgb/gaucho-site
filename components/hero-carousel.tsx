"use client";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

// Banners padrão — exibidos enquanto não há banners no banco
const defaultSlides = [
  {
    id: "1",
    title: "Construa seus sonhos com a Gaúcho",
    subtitle: "Mais de 38 mil itens em estoque para sua obra",
    cta: "Ver Produtos",
    href: "#produtos",
    imagem_url: null,
    cor_fundo: "#1E4FA8",
  },
  {
    id: "2",
    title: "Entrega em Rio Branco",
    subtitle: "Receba seus materiais direto na sua obra",
    cta: "Fazer Orçamento",
    href: "#produtos",
    imagem_url: null,
    cor_fundo: "#E8722A",
  },
  {
    id: "3",
    title: "Atendimento Especializado",
    subtitle: "Nossa equipe entende do assunto e te ajuda a escolher",
    cta: "Fale Conosco",
    href: "https://wa.me/5568923203049?text=Olá!%20Vim%20pelo%20site%20e%20preciso%20de%20ajuda",
    imagem_url: null,
    cor_fundo: "#14307A",
  },
];

type Slide = {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  imagem_url: string | null;
  cor_fundo: string;
};

export function HeroCarousel() {
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5500, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Carregar banners do Supabase
  useEffect(() => {
    async function loadBanners() {
      try {
        const { data } = await supabase
          .from("banners")
          .select("*")
          .eq("ativo", true)
          .order("ordem");
        if (data && data.length > 0) {
          setSlides(data);
        }
      } catch {
        // Usa slides padrão se tabela não existir ainda
      }
    }
    loadBanners();
  }, []);

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
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  return (
    <section className="relative overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {slides.map((slide, index) => (
          <div key={slide.id || index} className="flex-[0_0_100%] min-w-0">
            <div
              className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden"
              style={{ backgroundColor: slide.cor_fundo || "#1E4FA8" }}
            >
              {/* Imagem de fundo se existir */}
              {slide.imagem_url && (
                <>
                  <img
                    src={slide.imagem_url}
                    alt={slide.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50" />
                </>
              )}

              {/* Padrão decorativo quando não tem imagem */}
              {!slide.imagem_url && (
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(255,255,255,0.3)_0%,transparent_60%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(255,255,255,0.1)_0%,transparent_60%)]" />
                </div>
              )}

              {/* Conteúdo */}
              <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 text-balance leading-tight">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-xl text-white/85 mb-8 max-w-2xl mx-auto">
                  {slide.subtitle}
                </p>
                <a
                  href={slide.href}
                  className="inline-flex items-center gap-2 bg-[#E8722A] hover:bg-[#FF8B38] text-white font-bold text-lg px-8 py-4 rounded-lg transition-all hover:scale-105 shadow-lg"
                  target={slide.href.startsWith("http") ? "_blank" : undefined}
                  rel={slide.href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {slide.cta}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Setas */}
      <Button
        variant="ghost"
        size="icon"
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white h-11 w-11 rounded-full border border-white/20 backdrop-blur-sm"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white h-11 w-11 rounded-full border border-white/20 backdrop-blur-sm"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "h-2.5 rounded-full transition-all duration-300",
              selectedIndex === index
                ? "bg-[#E8722A] w-8"
                : "bg-white/50 hover:bg-white/80 w-2.5"
            )}
          />
        ))}
      </div>
    </section>
  );
}
