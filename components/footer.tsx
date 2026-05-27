"use client";

import { Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react";

const categories = [
  "Hidráulica",
  "Elétrica",
  "Ferramentas",
  "Tintas",
  "Argamassa",
  "EPI",
];

export function Footer() {
  return (
    <footer id="contato" className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">G</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">Gaúcho</h3>
                <p className="text-xs text-secondary-foreground/70">
                  Material de Construção
                </p>
              </div>
            </div>
            <p className="text-sm text-secondary-foreground/80 leading-relaxed">
              Sua loja de materiais de construção em Rio Branco/AC. Mais de 38
              mil itens em estoque para sua obra.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-lg mb-4">Categorias</h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat}>
                  <a
                    href="#produtos"
                    className="text-sm text-secondary-foreground/80 hover:text-accent transition-colors"
                  >
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-secondary-foreground/80">
                <MapPin className="h-4 w-4 text-accent" />
                Rio Branco, Acre
              </li>
              <li>
                <a
                  href="tel:+5568992320349"
                  className="flex items-center gap-2 text-sm text-secondary-foreground/80 hover:text-accent transition-colors"
                >
                  <Phone className="h-4 w-4 text-accent" />
                  (68) 9232-0349
                </a>
              </li>
              <li>
                <a
                  href="mailto:contato@gaucho.com.br"
                  className="flex items-center gap-2 text-sm text-secondary-foreground/80 hover:text-accent transition-colors"
                >
                  <Mail className="h-4 w-4 text-accent" />
                  contato@gaucho.com.br
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold text-lg mb-4">Redes Sociais</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-secondary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-secondary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-sm text-secondary-foreground/60">
            © {new Date().getFullYear()} Gaúcho Material de Construção. Todos os
            direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
