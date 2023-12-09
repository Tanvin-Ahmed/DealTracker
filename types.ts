export type PriceHistoryItem = {
  price: number;
};

export type User = {
  _id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Product = {
  _id?: string;
  url: string;
  currency: string;
  image: string;
  title: string;
  currentPrice: number;
  originalPrice: number;
  priceHistory: PriceHistoryItem[] | [];
  highestPrice: number;
  lowestPrice: number;
  averagePrice: number;
  discountRate: number;
  description: string;
  category: string;
  reviewsCount: number;
  stars: number;
  isOutOfStock: Boolean;
  user: String;
  track: boolean;
  favorite: boolean;
};

export type ScrapedProduct = {
  url: string;
  currency: string;
  image: string;
  title: string;
  currentPrice: number;
  originalPrice: number;
  priceHistory: { price: number }[];
  discountRate: number;
  category: string;
  reviewsCount: number;
  stars: number;
  isOutOfStock: boolean;
  description: string;
  lowestPrice: number;
  highestPrice: number;
  averagePrice: number;
  user?: string;
};

export type NotificationType =
  | "WELCOME"
  | "CHANGE_OF_STOCK"
  | "LOWEST_PRICE"
  | "THRESHOLD_MET"
  | "UNTRACK";

export type EmailContent = {
  subject: string;
  body: string;
};

export type EmailProductInfo = {
  title: string;
  url: string;
  image: string;
};
