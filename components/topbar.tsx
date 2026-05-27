"use client";

import { MapPin, Clock, Phone } from "lucide-react";

export function Topbar() {
  return (
    <div className="bg-secondary text-secondary-foreground text-sm py-2">
      <div className="container mx-auto px-4 flex flex-wrap items-center justify-center gap-4 md:justify-between">
        <div className="flex items-center gap-6 flex-wrap justify-center">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            Rio Branco/AC
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            Seg-Sex 7h-18h · Sáb 7h-13h
          </span>
        </div>
        <a
          href="tel:+5568992320349"
          className="flex items-center gap-1.5 hover:text-accent transition-colors font-medium"
        >
          <Phone className="h-3.5 w-3.5" />
          (68) 9232-0349
        </a>
      </div>
    </div>
  );
}
