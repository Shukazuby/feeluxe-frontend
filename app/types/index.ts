export interface Product {
  _id?: string; // MongoDB ID from backend
  id?: string; // Fallback ID
  name: string;
  price?: number;
  amount?: number; // Backend uses 'amount' as primary price field
  image?: string; // Frontend format
  imageurl?: string; // Backend format
  category?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Helper to get product ID (handles both _id and id)
export const getProductId = (product: Product): string => {
  return product._id || product.id || '';
};

// Helper to get product price (handles both price and amount)
export const getProductPrice = (product: Product): number => {
  return product.price ?? product.amount ?? 0;
};

// Helper to get product image URL
export const getProductImage = (product: Product): string => {
  return product.image || product.imageurl || '/placeholder-image.jpg';
};

export interface NavigationLink {
  href: string;
  label: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'delivered' | 'shipped' | 'pending';
  product: Product;
  quantity: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
