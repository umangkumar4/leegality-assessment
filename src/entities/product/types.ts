export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  thumbnail: string;
  images: string[];
  availabilityStatus?: string;
  returnPolicy?: string;
  warrantyInformation?: string;
  shippingInformation?: string;
  reviews?: Review[];
  tags?: string[];
  sku?: string;
  weight?: number;
  dimensions?: { width: number; height: number; depth: number };
  minimumOrderQuantity?: number;
  meta?: { createdAt?: string; updatedAt?: string; barcode?: string; qrCode?: string };
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}
