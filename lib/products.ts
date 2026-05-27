export type Category =
  | "Hidráulica"
  | "Elétrica"
  | "Ferramentas"
  | "Tintas"
  | "Argamassa"
  | "EPI"
  | "Ferragens"
  | "Cobertura"
  | "Construção Pesada"
  | "Acessórios";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  featured: boolean;
  promo?: string;
}

export const categories: { name: Category; count: number }[] = [
  { name: "Hidráulica", count: 12 },
  { name: "Elétrica", count: 10 },
  { name: "Ferramentas", count: 14 },
  { name: "Tintas", count: 8 },
  { name: "Argamassa", count: 9 },
  { name: "EPI", count: 8 },
  { name: "Ferragens", count: 6 },
  { name: "Cobertura", count: 5 },
  { name: "Construção Pesada", count: 7 },
  { name: "Acessórios", count: 6 },
];

export const products: Product[] = [
  // Destaques
  { id: "1", name: "Caixa D'Água 1000L", price: 450, category: "Hidráulica", featured: true, promo: "Mais Vendido" },
  { id: "2", name: "Caixa D'Água 500L", price: 350, category: "Hidráulica", featured: true },
  { id: "3", name: "Carrinho de Mão Tramontina 65L", price: 460, category: "Ferramentas", featured: true, promo: "Premium" },
  { id: "4", name: "Carrinho Maestro 45L", price: 150, category: "Ferramentas", featured: true },
  { id: "5", name: "Telha Eternit Ondulada", price: 27, category: "Cobertura", featured: true },
  { id: "6", name: "Aditivo Plastificante 18L", price: 280, category: "Argamassa", featured: true },
  { id: "7", name: "Manta Líquida Viapol 18L", price: 258, category: "Cobertura", featured: true, promo: "Destaque" },
  { id: "8", name: "Argamassa AC2 20kg", price: 30, category: "Argamassa", featured: true },

  // Hidráulica
  { id: "9", name: "Tubo Soldável 50mm", price: 99.90, category: "Hidráulica", featured: false },
  { id: "10", name: "Tubo Esgoto 40mm 6m", price: 29, category: "Hidráulica", featured: false },
  { id: "11", name: "Tubo PVC Irrigação 100mm", price: 185, category: "Hidráulica", featured: false },
  { id: "12", name: "Registro Pressão Metal 3/4", price: 59.90, category: "Hidráulica", featured: false },
  { id: "13", name: "Registro Gaveta Base", price: 59, category: "Hidráulica", featured: false },
  { id: "14", name: "Sifão Universal Astra", price: 8, category: "Hidráulica", featured: false },
  { id: "15", name: "Torneira Pia Longa", price: 12.50, category: "Hidráulica", featured: false },
  { id: "16", name: "Caixa Sifonada 150x185", price: 85, category: "Hidráulica", featured: false },
  { id: "17", name: "Joelho 90° PVC 50mm", price: 4.50, category: "Hidráulica", featured: false },
  { id: "18", name: "Tê PVC 50mm", price: 6.90, category: "Hidráulica", featured: false },

  // Elétrica
  { id: "19", name: "Plugue Macho 2P+T 20A WEG", price: 7, category: "Elétrica", featured: false },
  { id: "20", name: "Tomada 2P+T 10A Aria", price: 9, category: "Elétrica", featured: false },
  { id: "21", name: "Lâmpada LED E27 50W", price: 22, category: "Elétrica", featured: false },
  { id: "22", name: "Eletroduto Corrugado 32mm", price: 79, category: "Elétrica", featured: false },
  { id: "23", name: "Disjuntor Bifásico 50A", price: 35, category: "Elétrica", featured: false },
  { id: "24", name: "Caixa Luz 4x2 Tramontina", price: 3, category: "Elétrica", featured: false },
  { id: "25", name: "Cabo Paralelo 2x1,5mm metro", price: 2.50, category: "Elétrica", featured: false },
  { id: "26", name: "Interruptor Simples", price: 12, category: "Elétrica", featured: false },
  { id: "27", name: "Fita Isolante 20m", price: 8.50, category: "Elétrica", featured: false },
  { id: "28", name: "Extensão 10m 3 Tomadas", price: 45, category: "Elétrica", featured: false },

  // Ferramentas
  { id: "29", name: "Disco Serra Circular 180mm", price: 35, category: "Ferramentas", featured: false },
  { id: "30", name: "Alicate Universal 8\"", price: 35, category: "Ferramentas", featured: false },
  { id: "31", name: "Trena 5m Lufkin", price: 30, category: "Ferramentas", featured: false },
  { id: "32", name: "Broca Mourão 1/2x400mm", price: 45.50, category: "Ferramentas", featured: false },
  { id: "33", name: "Martelo nº25 Collins", price: 25, category: "Ferramentas", featured: false },
  { id: "34", name: "Marreta 6kg Tenece", price: 213, category: "Ferramentas", featured: false },
  { id: "35", name: "Régua Pedreiro 3m", price: 57, category: "Ferramentas", featured: false },
  { id: "36", name: "Colher Pedreiro nº9", price: 25, category: "Ferramentas", featured: false },
  { id: "37", name: "Chave de Fenda 1/4x6", price: 15, category: "Ferramentas", featured: false },
  { id: "38", name: "Chave Phillips 3/16x4", price: 14, category: "Ferramentas", featured: false },
  { id: "39", name: "Serrote 20\"", price: 42, category: "Ferramentas", featured: false },
  { id: "40", name: "Nível de Alumínio 60cm", price: 65, category: "Ferramentas", featured: false },

  // Tintas
  { id: "41", name: "Tinta Látex Branca 18L", price: 189, category: "Tintas", featured: false },
  { id: "42", name: "Tinta Acrílica Premium 18L", price: 320, category: "Tintas", featured: false },
  { id: "43", name: "Massa Corrida 25kg", price: 65, category: "Tintas", featured: false },
  { id: "44", name: "Selador Acrílico 18L", price: 145, category: "Tintas", featured: false },
  { id: "45", name: "Rolo de Lã 23cm", price: 28, category: "Tintas", featured: false },
  { id: "46", name: "Bandeja para Pintura", price: 15, category: "Tintas", featured: false },
  { id: "47", name: "Lixa d'água 220", price: 2.50, category: "Tintas", featured: false },
  { id: "48", name: "Pincel 2\"", price: 12, category: "Tintas", featured: false },

  // Argamassa
  { id: "49", name: "Argamassa AC1 20kg", price: 15.90, category: "Argamassa", featured: false },
  { id: "50", name: "Argamassa AC3 20kg", price: 35, category: "Argamassa", featured: false },
  { id: "51", name: "Areia Lavada 20kg", price: 10, category: "Argamassa", featured: false },
  { id: "52", name: "Massa Pronta Rebocar", price: 17, category: "Argamassa", featured: false },
  { id: "53", name: "Brita 0 20kg", price: 15, category: "Argamassa", featured: false },
  { id: "54", name: "Cimento CP2 50kg", price: 38, category: "Argamassa", featured: false },
  { id: "55", name: "Cal Hidratada 20kg", price: 22, category: "Argamassa", featured: false },
  { id: "56", name: "Rejunte Flexível 1kg", price: 18, category: "Argamassa", featured: false },
  { id: "57", name: "Impermeabilizante 18L", price: 195, category: "Argamassa", featured: false },

  // EPI
  { id: "58", name: "Capacete Segurança", price: 18, category: "EPI", featured: false },
  { id: "59", name: "Bota Couro nº40", price: 48, category: "EPI", featured: false },
  { id: "60", name: "Luva Malha Preta", price: 5, category: "EPI", featured: false },
  { id: "61", name: "Óculos Proteção", price: 9, category: "EPI", featured: false },
  { id: "62", name: "Máscara PFF2", price: 3, category: "EPI", featured: false },
  { id: "63", name: "Luva Raspa", price: 17.90, category: "EPI", featured: false },
  { id: "64", name: "Protetor Auricular", price: 8, category: "EPI", featured: false },
  { id: "65", name: "Cinto Segurança", price: 85, category: "EPI", featured: false },

  // Ferragens
  { id: "66", name: "Cadeado 50mm", price: 56.50, category: "Ferragens", featured: false },
  { id: "67", name: "Fechadura Aliança", price: 51.48, category: "Ferragens", featured: false },
  { id: "68", name: "Prego 22x45 kg", price: 12.50, category: "Ferragens", featured: false },
  { id: "69", name: "Dobradiça 3\" par", price: 8, category: "Ferragens", featured: false },
  { id: "70", name: "Parafuso Philips 4x40 c/100", price: 18, category: "Ferragens", featured: false },
  { id: "71", name: "Bucha 8mm c/100", price: 25, category: "Ferragens", featured: false },

  // Cobertura
  { id: "72", name: "Telha Eternit", price: 27, category: "Cobertura", featured: false },
  { id: "73", name: "Parafuso Telheiro c/100", price: 52.90, category: "Cobertura", featured: false },
  { id: "74", name: "Telha Colonial Cerâmica", price: 3.50, category: "Cobertura", featured: false },
  { id: "75", name: "Calha PVC 3m", price: 45, category: "Cobertura", featured: false },
  { id: "76", name: "Rufo Galvanizado 2m", price: 38, category: "Cobertura", featured: false },

  // Construção Pesada
  { id: "77", name: "Vergalhão CA50 8mm 12m", price: 42, category: "Construção Pesada", featured: false },
  { id: "78", name: "Arame Recozido kg", price: 15, category: "Construção Pesada", featured: false },
  { id: "79", name: "Tijolo 6 Furos milheiro", price: 580, category: "Construção Pesada", featured: false },
  { id: "80", name: "Bloco Concreto 14x19x39", price: 3.80, category: "Construção Pesada", featured: false },
  { id: "81", name: "Laje Pré-Moldada m²", price: 85, category: "Construção Pesada", featured: false },
  { id: "82", name: "Forma Metálica Pilar", price: 320, category: "Construção Pesada", featured: false },
  { id: "83", name: "Escora Metálica 3m", price: 145, category: "Construção Pesada", featured: false },

  // Acessórios
  { id: "84", name: "Mangueira Jardim 30m", price: 89, category: "Acessórios", featured: false },
  { id: "85", name: "Esguicho Multifunção", price: 35, category: "Acessórios", featured: false },
  { id: "86", name: "Balde Plástico 12L", price: 12, category: "Acessórios", featured: false },
  { id: "87", name: "Lona Plástica 4x3m", price: 28, category: "Acessórios", featured: false },
  { id: "88", name: "Fita Veda Rosca 18mm", price: 6.50, category: "Acessórios", featured: false },
  { id: "89", name: "Adesivo PVC 175g", price: 22, category: "Acessórios", featured: false },
];

export const getCategoryIcon = (category: Category): string => {
  const icons: Record<Category, string> = {
    "Hidráulica": "droplet",
    "Elétrica": "zap",
    "Ferramentas": "wrench",
    "Tintas": "paintbrush",
    "Argamassa": "layers",
    "EPI": "hard-hat",
    "Ferragens": "lock",
    "Cobertura": "home",
    "Construção Pesada": "building",
    "Acessórios": "package",
  };
  return icons[category];
};
