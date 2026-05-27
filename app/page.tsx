"use client";

import { useState } from "react";
import { Topbar } from "@/components/topbar";
import { Header } from "@/components/header";
import { HeroCarousel } from "@/components/hero-carousel";
import { TrustBar } from "@/components/trust-bar";
import { SearchBar } from "@/components/search-bar";
import { CategoriesSection } from "@/components/categories-section";
import { ProductsSection } from "@/components/products-section";
import { CTABanner } from "@/components/cta-banner";
import { WhyBuySection } from "@/components/why-buy-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { LocationSection } from "@/components/location-section";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { CartProvider } from "@/lib/cart-context";
import { Toaster } from "@/components/ui/toaster";
import type { Category } from "@/lib/products";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Topbar />
        <Header />
        <main>
          <HeroCarousel />
          <TrustBar />
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <CategoriesSection
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <ProductsSection
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <CTABanner />
          <WhyBuySection />
          <TestimonialsSection />
          <LocationSection />
        </main>
        <Footer />
        <CartDrawer />
        <WhatsAppButton />
        <Toaster />
      </div>
    </CartProvider>
  );
}
