export type UserRole = 'vendor' | 'rider' | 'customer';

export type OrderStatus =
  | 'new'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled';

export type DeliveryStatus =
  | 'unassigned'
  | 'rider_assigned'
  | 'picked_up'
  | 'in_transit'
  | 'delivered';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  verifiedEmail: boolean;
  verifiedPhone: boolean;
  avatarUrl?: string;
  businessName?: string;
  address?: string;
  zone?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  options?: string;
  notes?: string;
}

export interface TimelineStep {
  status: OrderStatus;
  label: string;
  time: string;
  done: boolean;
  current?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  deliveryZone: string;
  vendorId: string;
  vendorName: string;
  vendorAddress: string;
  vendorPhone: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryFee: number;
  status: OrderStatus;
  deliveryStatus: DeliveryStatus;
  riderId?: string;
  riderName?: string;
  riderPhone?: string;
  createdAt: string;
  updatedAt: string;
  estimatedMinutes: number;
  deliveryInstructions?: string;
  deliveryPin: string;
  timeline: TimelineStep[];
  paymentMethod: 'card' | 'bank_transfer' | 'paystack';
  paymentStatus: 'paid' | 'pending';
}

export interface Product {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  available: boolean;
  prepMinutes: number;
  rating?: number;
}

export interface VendorProfile {
  id: string;
  businessName: string;
  ownerName: string;
  category: string;
  address: string;
  zone: string;
  phone: string;
  email: string;
  rating: number;
  reviewCount: number;
  totalOrders: number;
  isOpen: boolean;
  bannerUrl: string;
  logoUrl: string;
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

export interface RiderProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicleType: 'Motorcycle' | 'Bicycle' | 'Mini Van';
  vehiclePlate: string;
  zone: string;
  rating: number;
  totalDeliveries: number;
  todayEarnings: number;
  isOnline: boolean;
  currentOrderId?: string;
}

export type AuthScreen =
  | 'login'
  | 'signup'
  | 'forgot_password_1'
  | 'forgot_password_2'
  | 'forgot_password_3'
  | 'reset_password_1'
  | 'reset_password_2'
  | 'verify_email_1'
  | 'verify_email_2'
  | 'verify_phone_1'
  | 'verify_phone_2'
  | 'app';
