"use client";

import { MapPin, Clock, Phone, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LocationSection() {
  const handleDirections = () => {
    window.open(
      "https://www.google.com/maps/search/Gaúcho+Material+de+Construção+Rio+Branco+AC",
      "_blank"
    );
  };

  return (
    <section id="localizacao" className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
          Nossa Localização
        </h2>
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Info */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shrink-0">
                <MapPin className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Endereço</h3>
                <p className="text-muted-foreground">
                  Rio Branco, Acre
                  <br />
                  Brasil
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shrink-0">
                <Clock className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Horário de Funcionamento
                </h3>
                <p className="text-muted-foreground">
                  Segunda a Sexta: 7h às 18h
                  <br />
                  Sábado: 7h às 13h
                  <br />
                  Domingo: Fechado
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shrink-0">
                <Phone className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Telefone</h3>
                <a
                  href="tel:+5568992320349"
                  className="text-primary hover:underline font-medium"
                >
                  (68) 9232-0349
                </a>
              </div>
            </div>

            <Button
              onClick={handleDirections}
              size="lg"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Navigation className="h-5 w-5 mr-2" />
              Como chegar
            </Button>
          </div>

          {/* Map placeholder */}
          <div className="bg-muted rounded-xl overflow-hidden h-[300px] lg:h-[400px] flex items-center justify-center border border-border">
            <div className="text-center p-8">
              <MapPin className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">
                Mapa do Google Maps
                <br />
                <span className="text-sm">Rio Branco, Acre</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
