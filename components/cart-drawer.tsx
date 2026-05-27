"use client";

import { useState } from "react";
import { X, Plus, Minus, Trash2, Send } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";

const WHATSAPP_NUMBER = "5568992320349";

export function CartDrawer() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    totalPrice,
    isOpen,
    setIsOpen,
  } = useCart();
  const { toast } = useToast();
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  const handleSendWhatsApp = () => {
    if (items.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao orçamento antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    if (!customerName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe seu nome.",
        variant: "destructive",
      });
      return;
    }

    const itemsList = items
      .map(
        (item) =>
          `• ${item.quantity}x ${item.product.name} - R$ ${(
            item.product.price * item.quantity
          )
            .toFixed(2)
            .replace(".", ",")}`
      )
      .join("\n");

    const message = `*ORÇAMENTO - GAÚCHO MATERIAL DE CONSTRUÇÃO*\n\n*Cliente:* ${customerName}\n${
      customerAddress ? `*Endereço:* ${customerAddress}\n` : ""
    }\n*Itens do Orçamento:*\n${itemsList}\n\n*TOTAL ESTIMADO: R$ ${totalPrice
      .toFixed(2)
      .replace(".", ",")}*\n\nAguardo retorno!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`,
      "_blank"
    );

    toast({
      title: "Orçamento enviado!",
      description: "Aguarde nosso retorno pelo WhatsApp.",
    });

    clearCart();
    setCustomerName("");
    setCustomerAddress("");
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">Meu Orçamento</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-auto py-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Seu orçamento está vazio.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Adicione produtos para continuar.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 p-3 bg-muted rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground line-clamp-2">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.product.category}
                    </p>
                    <p className="text-primary font-bold mt-1">
                      R${" "}
                      {(item.product.price * item.quantity)
                        .toFixed(2)
                        .replace(".", ",")}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-1 bg-card rounded-md border">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t pt-4 space-y-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="name">Seu Nome *</Label>
                <Input
                  id="name"
                  placeholder="Digite seu nome"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="address">Endereço (opcional)</Label>
                <Input
                  id="address"
                  placeholder="Digite seu endereço"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <Separator />

            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Estimado:</span>
              <span className="text-primary">
                R$ {totalPrice.toFixed(2).replace(".", ",")}
              </span>
            </div>

            <Button
              onClick={handleSendWhatsApp}
              size="lg"
              className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white"
            >
              <Send className="h-5 w-5 mr-2" />
              Enviar pelo WhatsApp
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
