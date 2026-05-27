"use client";

import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "5568992320349";

export function WhatsAppButton() {
  const handleClick = () => {
    const message = encodeURIComponent(
      "Olá! Gostaria de saber mais sobre os produtos da Gaúcho Material de Construção."
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-pulse-whatsapp"
      aria-label="Falar pelo WhatsApp"
    >
      <MessageCircle className="h-7 w-7 text-white" />
    </button>
  );
}
