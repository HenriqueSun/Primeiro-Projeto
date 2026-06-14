import type {
  Banner,
  Coupon,
  DashboardKpis,
  Feedback,
  LoyaltyAccount,
  MarketingMetrics,
  MediaAsset,
  Notification,
  Product,
  Promotion,
  Settings,
  User,
  Vote,
} from "@/types";

export const users: User[] = [
  {
    id: "client-1",
    name: "Cliente Dona Lu",
    fullName: "Cliente Dona Lu",
    email: "cliente@doceria.com",
    phone: "(11) 99999-1111",
    avatar: "",
    role: "client",
    createdAt: "2026-06-01",
    marketingConsent: true,
    lastActiveAt: "2026-06-14",
    password: "123456",
    preferences: {
      notifications: true,
      theme: "light",
    },
  },
  {
    id: "admin-1",
    name: "Admin Dona Lu",
    fullName: "Admin Dona Lu",
    email: "admin@doceria.com",
    phone: "(11) 99999-2222",
    avatar: "",
    role: "admin",
    createdAt: "2026-05-20",
    marketingConsent: false,
    lastActiveAt: "2026-06-14",
    password: "123456",
    preferences: {
      notifications: true,
      theme: "light",
    },
  },
];

export const mediaAssets: MediaAsset[] = [
  {
    id: "media-1",
    name: "Bolo de Festa Dona Lu",
    url: "/IMG/Bolodefesta.png",
    type: "image/png",
    usage: "product",
    createdAt: "2026-06-01",
    uploadedBy: "admin-1",
  },
  {
    id: "media-2",
    name: "Bolo de Pote",
    url: "/IMG/Bolodepote.png",
    type: "image/png",
    usage: "product",
    createdAt: "2026-06-02",
    uploadedBy: "admin-1",
  },
  {
    id: "media-3",
    name: "Brigadeiro Tradicional",
    url: "/IMG/brigadeiro.png",
    type: "image/png",
    usage: "product",
    createdAt: "2026-06-03",
    uploadedBy: "admin-1",
  },
  {
    id: "media-4",
    name: "Beijinho",
    url: "/IMG/bejinho.png",
    type: "image/png",
    usage: "product",
    createdAt: "2026-06-03",
    uploadedBy: "admin-1",
  },
  {
    id: "media-5",
    name: "Pudim da Casa",
    url: "/IMG/pudim.png",
    type: "image/png",
    usage: "product",
    createdAt: "2026-06-04",
    uploadedBy: "admin-1",
  },
];

export const products: Product[] = [
  {
    id: "p-1",
    name: "Bolo de Festa Dona Lu",
    category: "Bolos",
    shortDescription: "Massa fofinha com recheio artesanal para celebrações.",
    fullDescription:
      "Bolo personalizado com massa de baunilha ou chocolate, recheio cremoso e acabamento artesanal.",
    ingredients: ["Farinha", "Ovos", "Leite", "Chocolate", "Creme especial"],
    price: 89.9,
    imageUrl: "/IMG/Bolodefesta.png",
    status: "available",
    badges: ["best_seller", "weekly"],
    promotionLabel: "Mais vendido",
    views: 348,
    favoriteCount: 76,
    featuredWeek: true,
    productOfDay: false,
    createdAt: "2026-06-01",
  },
  {
    id: "p-2",
    name: "Bolo de Pote",
    category: "Bolos",
    shortDescription: "Camadas cremosas em porção individual.",
    fullDescription:
      "Sobremesa gelada com massa macia, recheio generoso e cobertura finalizada no pote.",
    ingredients: ["Massa de bolo", "Leite condensado", "Chocolate", "Creme"],
    price: 14.9,
    imageUrl: "/IMG/Bolodepote.png",
    status: "available",
    badges: ["promotion", "new"],
    promotionLabel: "Combo com 10% off",
    views: 284,
    favoriteCount: 61,
    featuredWeek: false,
    productOfDay: true,
    scheduledDay: "2026-06-14",
    createdAt: "2026-06-02",
  },
  {
    id: "p-3",
    name: "Brigadeiro Tradicional",
    category: "Doces",
    shortDescription: "Clássico brasileiro com granulado belga.",
    fullDescription:
      "Brigadeiro enrolado à mão com chocolate selecionado e textura cremosa.",
    ingredients: ["Leite condensado", "Chocolate", "Manteiga", "Granulado"],
    price: 4.5,
    imageUrl: "/IMG/brigadeiro.png",
    status: "available",
    badges: ["best_seller", "weekly"],
    promotionLabel: "Leve 12 pague 10",
    views: 512,
    favoriteCount: 118,
    featuredWeek: true,
    productOfDay: false,
    createdAt: "2026-06-03",
  },
  {
    id: "p-4",
    name: "Beijinho",
    category: "Doces",
    shortDescription: "Docinho de coco com sabor de festa.",
    fullDescription:
      "Beijinho artesanal feito com coco ralado e finalização delicada.",
    ingredients: ["Leite condensado", "Coco", "Manteiga", "Açúcar cristal"],
    price: 4.5,
    imageUrl: "/IMG/bejinho.png",
    status: "available",
    badges: ["new"],
    views: 176,
    favoriteCount: 34,
    featuredWeek: false,
    productOfDay: false,
    createdAt: "2026-06-03",
  },
  {
    id: "p-5",
    name: "Pudim da Casa",
    category: "Sobremesas",
    shortDescription: "Pudim cremoso com calda de caramelo.",
    fullDescription:
      "Pudim tradicional com textura lisa, calda artesanal e preparo caseiro.",
    ingredients: ["Leite", "Ovos", "Leite condensado", "Açúcar"],
    price: 12.9,
    imageUrl: "/IMG/pudim.png",
    status: "sold_out",
    badges: ["weekly"],
    views: 229,
    favoriteCount: 47,
    featuredWeek: true,
    productOfDay: false,
    createdAt: "2026-06-04",
  },
  {
    id: "p-6",
    name: "Coxinha Cremosa",
    category: "Salgados",
    shortDescription: "Massa leve com recheio de frango bem temperado.",
    fullDescription:
      "Coxinha frita sob encomenda, com massa macia e recheio cremoso.",
    ingredients: ["Frango", "Farinha", "Caldo", "Requeijão"],
    price: 7.9,
    imageUrl: "/IMG/coxinha.png",
    status: "available",
    badges: ["promotion"],
    promotionLabel: "Especial do dia",
    views: 301,
    favoriteCount: 58,
    featuredWeek: false,
    productOfDay: true,
    scheduledDay: "2026-06-14",
    createdAt: "2026-06-05",
  },
];

export const votes: Vote[] = [
  {
    id: "v-1",
    title: "Produto especial de julho",
    description:
      "Escolha o doce que deve entrar como edição especial no próximo mês.",
    startDate: "2026-06-10",
    endDate: "2026-06-30",
    status: "active",
    resultPublished: false,
    options: [
      { id: "vo-1", productName: "Brigadeiro Pistache", votes: 42 },
      { id: "vo-2", productName: "Cheesecake de Morango", votes: 36 },
      { id: "vo-3", productName: "Torta de Limão", votes: 29 },
    ],
  },
];

export const feedbacks: Feedback[] = [
  {
    id: "f-1",
    userId: "client-1",
    title: "Mais opções sem lactose",
    category: "suggestion",
    message: "Seria ótimo ter bolos pequenos sem lactose no cardápio.",
    status: "reviewing",
    createdAt: "2026-06-12",
  },
  {
    id: "f-2",
    userId: "client-1",
    title: "Atendimento excelente",
    category: "compliment",
    message: "A encomenda chegou perfeita e muito caprichada.",
    status: "resolved",
    response: "Muito obrigada pelo carinho!",
    createdAt: "2026-06-11",
  },
];

export const promotions: Promotion[] = [
  {
    id: "promo-1",
    title: "Semana dos Bolos Caseiros",
    description: "10% off nos bolos de café da manhã até domingo.",
    validUntil: "2026-06-21",
    productIds: ["p-1", "p-2"],
    active: true,
  },
];

export const notifications: Notification[] = [
  {
    id: "n-1",
    type: "vote_result",
    title: "Nova votação disponível",
    message: "Vote no próximo produto especial da doceria.",
    read: false,
    createdAt: "2026-06-14",
  },
  {
    id: "n-2",
    type: "promotion",
    title: "Produto do dia",
    message: "Bolo de pote com preço especial hoje.",
    read: true,
    createdAt: "2026-06-13",
  },
  {
    id: "n-3",
    type: "product_available",
    title: "Produto voltou ao estoque",
    message: "O Cheesecake de Morango voltou ao estoque para encomendas.",
    read: false,
    createdAt: "2026-06-14",
    href: "/cliente/cardapio",
  },
  {
    id: "n-4",
    type: "announcement",
    title: "Horário especial",
    message: "Neste feriado atenderemos das 9h às 13h.",
    read: true,
    createdAt: "2026-06-10",
  },
];

export const settings: Settings = {
  bakeryName: "Doceria Dona Lu",
  logoUrl: "/IMG/Logo-Doceria.png",
  phone: "(11) 98633-7175",
  whatsappUrl: "https://api.whatsapp.com/send?phone=5511986337175",
  instagramUrl: "https://www.instagram.com/doceriadonaluoficial",
  facebookUrl: "https://www.facebook.com/doceriadonalu",
  tiktokUrl: "https://www.tiktok.com/@doceriadonalu",
  customLinks: [
    { label: "Encomendas", url: "https://api.whatsapp.com/send?phone=5511986337175" },
    { label: "Localização", url: "https://www.google.com.br/maps" },
  ],
  address: "Rua João Batista da Silva, 65",
  openingHours: "Segunda a sábado, das 9h às 18h",
  institutionalText:
    "A Doceria Dona Lu transforma momentos simples em memórias doces com receitas artesanais, cuidado familiar e sabor de casa.",
  heroBanner: {
    id: "banner-1",
    title: "Celebre os momentos doces da vida",
    subtitle:
      "Promoções da semana, produtos artesanais e encomendas feitas com carinho.",
    ctaLabel: "Ver cardápio",
    ctaHref: "/cliente/cardapio",
  },
};

export const banners: Banner[] = [
  settings.heroBanner,
  {
    id: "banner-2",
    title: "Produtos do dia",
    subtitle: "Escolhas fresquinhas selecionadas pela Dona Lu.",
    ctaLabel: "Conferir",
    ctaHref: "/cliente",
  },
  {
    id: "banner-3",
    title: "Brownies com 15% off",
    subtitle: "Promoção relâmpago para pedidos pelo WhatsApp hoje.",
    ctaLabel: "Fale conosco",
    ctaHref: settings.whatsappUrl,
  },
  {
    id: "banner-4",
    title: "Festival de Brigadeiros",
    subtitle: "Monte sua caixa personalizada com sabores favoritos.",
    ctaLabel: "Ver doces",
    ctaHref: "/cliente/cardapio",
  },
];

export const coupons: Coupon[] = [
  {
    id: "c-1",
    code: "DONA10",
    title: "Primeira encomenda",
    description: "Ganhe desconto em bolos e doces para sua primeira encomenda.",
    discount: "10%",
    validUntil: "2026-06-30",
    status: "active",
  },
  {
    id: "c-2",
    code: "FESTA15",
    title: "Kit festa",
    description: "Desconto especial em pedidos com doces e salgados.",
    discount: "15%",
    validUntil: "2026-07-15",
    status: "active",
  },
];

export const loyaltyAccount: LoyaltyAccount = {
  userId: "client-1",
  points: 320,
  nextReward: {
    title: "Caixa com 6 brigadeiros grátis",
    requiredPoints: 500,
  },
  benefits: ["Descontos exclusivos", "Produtos grátis", "Brindes em datas especiais", "Cupons antecipados"],
  history: [
    {
      id: "lh-1",
      description: "Compra simulada de bolo de pote",
      points: 42,
      createdAt: "2026-06-12",
    },
    {
      id: "lh-2",
      description: "Bônus por votar em produto",
      points: 20,
      createdAt: "2026-06-10",
    },
  ],
};

export const marketingMetrics: MarketingMetrics = {
  whatsappClicks: 146,
  instagramClicks: 91,
  facebookClicks: 34,
  tiktokClicks: 27,
  shareClicks: 58,
  favoriteAdds: 112,
  productViews: products.reduce<Record<string, number>>((acc, product) => {
    acc[product.id] = product.views;
    return acc;
  }, {}),
  engagementRate: 18.7,
};

export const dashboardKpis: DashboardKpis = {
  totalProducts: products.length,
  activeProducts: products.filter((product) => product.status === "available").length,
  totalVotes: votes.flatMap((vote) => vote.options).reduce((sum, option) => sum + option.votes, 0),
  receivedFeedbacks: feedbacks.length,
  topVotedProduct: "Brigadeiro Pistache",
};
