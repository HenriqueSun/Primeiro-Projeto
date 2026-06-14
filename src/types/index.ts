export type UserRole = "client" | "admin";

export type ProductCategory = "Bolos" | "Doces" | "Sobremesas" | "Salgados";

export type ProductStatus = "available" | "sold_out" | "inactive";

export type FeedbackCategory = "suggestion" | "complaint" | "compliment";

export type FeedbackStatus = "new" | "reviewing" | "resolved";

export type VoteStatus = "scheduled" | "active" | "closed";

export type ProductBadge = "promotion" | "best_seller" | "new" | "weekly";

export type NotificationType =
  | "promotion"
  | "product_available"
  | "vote_result"
  | "news"
  | "announcement";

export type CouponStatus = "active" | "scheduled" | "expired";

export type SocialPlatform = "instagram" | "whatsapp" | "facebook" | "tiktok";

export interface User {
  id: string;
  name: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  marketingConsent: boolean;
  lastActiveAt?: string;
  password?: string;
  preferences: {
    notifications: boolean;
    theme: "light" | "dark";
  };
}

export interface Admin extends User {
  role: "admin";
  permissions: string[];
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  shortDescription: string;
  fullDescription: string;
  ingredients: string[];
  price: number;
  imageUrl?: string;
  status: ProductStatus;
  badges: ProductBadge[];
  promotionLabel?: string;
  views: number;
  favoriteCount: number;
  featuredWeek: boolean;
  productOfDay: boolean;
  scheduledDay?: string;
  scheduledWeek?: {
    start: string;
    end: string;
  };
  createdAt: string;
}

export interface VoteOption {
  id: string;
  productName: string;
  votes: number;
  productId?: string;
}

export interface Vote {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: VoteStatus;
  options: VoteOption[];
  userVotedOptionId?: string;
  resultPublished: boolean;
}

export interface Feedback {
  id: string;
  userId: string;
  title: string;
  category: FeedbackCategory;
  message: string;
  status: FeedbackStatus;
  response?: string;
  createdAt: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  bannerUrl?: string;
  validUntil: string;
  productIds: string[];
  active: boolean;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  href?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface Settings {
  bakeryName: string;
  logoUrl?: string;
  phone: string;
  whatsappUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  customLinks: Array<{
    label: string;
    url: string;
  }>;
  address: string;
  openingHours: string;
  heroBanner: Banner;
  institutionalText: string;
}

export interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  status: CouponStatus;
}

export interface LoyaltyHistoryItem {
  id: string;
  description: string;
  points: number;
  createdAt: string;
}

export interface LoyaltyAccount {
  userId: string;
  points: number;
  nextReward: {
    title: string;
    requiredPoints: number;
  };
  benefits: string[];
  history: LoyaltyHistoryItem[];
}

export interface MarketingMetrics {
  whatsappClicks: number;
  instagramClicks: number;
  facebookClicks: number;
  tiktokClicks: number;
  shareClicks: number;
  favoriteAdds: number;
  productViews: Record<string, number>;
  engagementRate: number;
}

export interface DashboardKpis {
  totalProducts: number;
  activeProducts: number;
  totalVotes: number;
  receivedFeedbacks: number;
  topVotedProduct: string;
}

export interface RegisterDTO {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
  marketingConsent: boolean;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}
