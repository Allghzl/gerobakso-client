export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  is_available: boolean;
  category?: Category;
}

export interface Table {
  id: number;
  number: string;
  capacity: number;
  status: 'available' | 'occupied';
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  name: string;
  product?: Product;
}

export interface Order {
  id: number;
  customer_name: string;
  order_type: 'dine-in' | 'takeaway';
  table_id?: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  total_price: number;
  payment_method: 'cash' | 'qris';
  created_at: string;
  items: OrderItem[];
  table?: Table;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ApiResponse<T> {
  data: T;
}
