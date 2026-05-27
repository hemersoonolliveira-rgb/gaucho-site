"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WHATSAPP_NUMBER = "5568992320349";

export function CTABanner() {
  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      "Olá! Gostaria de saber mais sobre os produtos da Gaúcho Material de Construção."
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  return (
    <section className="py-12 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
          Não encontrou o que procura?
        </h2>
        <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
          Entre em contato conosco pelo WhatsApp. Nossa equipe está pronta para
          te ajudar!
        </p>
        <Button
          onClick={handleWhatsApp}
          size="lg"
          className="bg-card text-foreground hover:bg-card/90"
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          Falar pelo WhatsApp
        </Button>
      </div>
    </section>
  );
}
