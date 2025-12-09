export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  isNew?: boolean;
}

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
