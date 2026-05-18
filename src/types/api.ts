export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  is_available: boolean;
  category?: Category;
}

export interface Table {
  id: number;
  number: string;
  name?: string;
  status: 'available' | 'occupied';
}

export interface OrderItem {
  id?: number;
  product_id: number;
  quantity: number;
  price?: number;
  product?: {
    name: string;
  };
}

export type OrderStatus = 'pending' | 'preparing' | 'ready';

export interface Order {
  id: number;
  customer_name: string;
  type: 'dine_in' | 'takeaway';
  table_id: number | null;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  total: number;
  items: OrderItem[];
  created_at?: string;
}

export interface CreateOrderPayload {
  customer_name: string;
  type: 'dine_in' | 'takeaway';
  table_id: number | null;
  items: {
    product_id: number;
    quantity: number;
  }[];
}
