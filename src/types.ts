export interface User {
  id: string;
  fullName: string;
  mobile: string;
  email: string;
  address: string;
  passwordHash: string;
  createdAt: string;
  avatarUrl?: string;
  state?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number; // e.g., 10 for 10%
  rating: number;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  stockCount: number;
  category: string;
  brand: string;
  imageUrl: string;
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  orderDate: string;
  items: OrderItem[];
  amount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  orderStatus: 'Successful' | 'Pending' | 'Cancelled' | 'Returned';
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface SearchHistory {
  id: string;
  userId: string;
  keyword: string;
  timestamp: string;
  ipAddress: string;
  device: string;
  browser: string;
  category?: string;
}

export interface ClickEvent {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  category: string;
  buttonClicked: string;
  timestamp: string;
  pageUrl: string;
  ipAddress: string;
  device: string;
  browser: string;
}

export interface CartAnalyticsEvent {
  id: string;
  eventType: 'Add' | 'Remove' | 'Increase' | 'Decrease' | 'Clear';
  productId?: string;
  timestamp: string;
}

export interface UserEvent {
  id: string;
  userId: string;
  eventType: 'Login' | 'Logout' | 'PageVisit';
  pageUrl?: string;
  duration?: number; // session duration in seconds
  timestamp: string;
  device: string;
  browser: string;
}
