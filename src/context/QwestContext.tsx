import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  AuthScreen,
  Order,
  OrderStatus,
  DeliveryStatus,
  Product,
  VendorProfile,
  RiderProfile,
} from '../types';
import {
  MOCK_USERS,
  MOCK_VENDORS,
  MOCK_RIDERS,
  MOCK_PRODUCTS,
  INITIAL_ORDERS,
} from '../data/mockData';

interface QwestContextType {
  // Auth state
  authUser: User | null;
  authScreen: AuthScreen;
  activeRole: UserRole;
  setAuthScreen: (screen: AuthScreen) => void;
  setActiveRole: (role: UserRole) => void;
  login: (identity: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: { name: string; email: string; phone: string; pass: string; role: UserRole }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;

  // Verification state
  verificationEmail: string;
  verificationPhone: string;
  setVerificationEmail: (email: string) => void;
  setVerificationPhone: (phone: string) => void;

  // Domain data state
  orders: Order[];
  products: Product[];
  vendors: VendorProfile[];
  riders: RiderProfile[];
  
  // Actions
  createOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'timeline' | 'deliveryPin'>) => Order;
  advanceOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  updateDeliveryStatus: (orderId: string, deliveryStatus: DeliveryStatus, riderId?: string) => void;
  assignRider: (orderId: string, riderId: string) => void;
  toggleRiderOnline: (riderId: string) => void;
  toggleVendorOpen: (vendorId: string) => void;
  toggleProductAvailability: (productId: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  resetToSampleData: () => void;

  // Simulated Network & State options
  simulateNetworkError: boolean;
  setSimulateNetworkError: (value: boolean) => void;
  isSimulatingDelay: boolean;
  
  // UI Tabs & Active view state
  vendorTab: 'home' | 'orders' | 'deliveries' | 'analytics' | 'profile';
  setVendorTab: (tab: 'home' | 'orders' | 'deliveries' | 'analytics' | 'profile') => void;
  riderTab: 'home' | 'deliveries' | 'earnings' | 'profile';
  setRiderTab: (tab: 'home' | 'deliveries' | 'earnings' | 'profile') => void;
  customerTab: 'discover' | 'orders' | 'profile';
  setCustomerTab: (tab: 'discover' | 'orders' | 'profile') => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  selectedVendorId: string | null;
  setSelectedVendorId: (id: string | null) => void;

  // Toast feedback
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const STORAGE_KEY_ORDERS = 'qwest_orders_v1';
const STORAGE_KEY_PRODUCTS = 'qwest_products_v1';
const STORAGE_KEY_AUTH = 'qwest_auth_v1';

const QwestContext = createContext<QwestContextType | undefined>(undefined);

export const QwestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_AUTH);
    return saved ? JSON.parse(saved) : MOCK_USERS.vendor;
  });
  
  const [authScreen, setAuthScreen] = useState<AuthScreen>('app');
  const [activeRole, setActiveRole] = useState<UserRole>(authUser?.role || 'vendor');

  const [verificationEmail, setVerificationEmail] = useState<string>('chioma.a@gmail.com');
  const [verificationPhone, setVerificationPhone] = useState<string>('+234 802 333 4455');

  // Load orders from localStorage or default
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Load products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    return saved ? JSON.parse(saved) : MOCK_PRODUCTS;
  });

  const [vendors, setVendors] = useState<VendorProfile[]>(MOCK_VENDORS);
  const [riders, setRiders] = useState<RiderProfile[]>(MOCK_RIDERS);

  // Simulation flags
  const [simulateNetworkError, setSimulateNetworkError] = useState(false);
  const [isSimulatingDelay, setIsSimulatingDelay] = useState(false);

  // Tab states
  const [vendorTab, setVendorTab] = useState<'home' | 'orders' | 'deliveries' | 'analytics' | 'profile'>('home');
  const [riderTab, setRiderTab] = useState<'home' | 'deliveries' | 'earnings' | 'profile'>('home');
  const [customerTab, setCustomerTab] = useState<'discover' | 'orders' | 'profile'>('discover');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>('v_101');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    if (authUser) {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(authUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    }
  }, [authUser]);

  // Auth Functions
  const login = async (identity: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsSimulatingDelay(true);
    await new Promise((res) => setTimeout(res, 800));
    setIsSimulatingDelay(false);

    if (simulateNetworkError) {
      return { success: false, error: 'Network connection failed. Please check your signal and retry.' };
    }

    if (!identity || !pass) {
      return { success: false, error: 'Please enter both email/phone and password.' };
    }

    if (pass.length < 6) {
      return { success: false, error: 'Invalid credentials. Password must be at least 6 characters.' };
    }

    // Determine role by identity keyword or default to vendor
    let matchedUser = MOCK_USERS.vendor;
    if (identity.toLowerCase().includes('rider') || identity.includes('tunde')) {
      matchedUser = MOCK_USERS.rider;
    } else if (identity.toLowerCase().includes('customer') || identity.includes('chioma')) {
      matchedUser = MOCK_USERS.customer;
    } else {
      matchedUser = {
        ...MOCK_USERS.vendor,
        email: identity.includes('@') ? identity : MOCK_USERS.vendor.email,
        phone: !identity.includes('@') ? identity : MOCK_USERS.vendor.phone,
      };
    }

    setAuthUser(matchedUser);
    setActiveRole(matchedUser.role);
    setAuthScreen('app');
    showToast(`Signed in successfully as ${matchedUser.name}`);
    return { success: true };
  };

  const signup = async (data: { name: string; email: string; phone: string; pass: string; role: UserRole }) => {
    setIsSimulatingDelay(true);
    await new Promise((res) => setTimeout(res, 900));
    setIsSimulatingDelay(false);

    if (simulateNetworkError) {
      return { success: false, error: 'Server error. Failed to create account, please try again.' };
    }

    if (!data.name || !data.email || !data.phone || !data.pass) {
      return { success: false, error: 'All fields are required.' };
    }

    const newUser: User = {
      id: `u_${Date.now().toString().slice(-4)}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      verifiedEmail: false,
      verifiedPhone: false,
      businessName: data.role === 'vendor' ? `${data.name}'s Business` : undefined,
      address: 'Ikeja / Yaba, Lagos',
      zone: 'Yaba / Surulere',
    };

    setAuthUser(newUser);
    setActiveRole(data.role);
    setVerificationEmail(data.email);
    setVerificationPhone(data.phone);

    // Direct to phone verification flow first
    setAuthScreen('verify_phone_1');
    showToast('Account created! Please verify your phone number.');
    return { success: true };
  };

  const logout = () => {
    setAuthUser(null);
    setAuthScreen('login');
    showToast('Signed out');
  };

  const switchDemoRole = (role: UserRole) => {
    setActiveRole(role);
    const demoUser = MOCK_USERS[role];
    setAuthUser(demoUser);
    setAuthScreen('app');
    if (role === 'vendor') setVendorTab('home');
    if (role === 'rider') setRiderTab('home');
    if (role === 'customer') setCustomerTab('discover');
    showToast(`Switched view to ${role.toUpperCase()} mode (${demoUser.name})`);
  };

  // Order Management Functions
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'timeline' | 'deliveryPin'>): Order => {
    const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder: Order = {
      ...orderData,
      id: `ord_${Date.now()}`,
      orderNumber: `QW-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deliveryPin: randomPin,
      status: 'new',
      deliveryStatus: 'unassigned',
      timeline: [
        { status: 'new', label: 'Order Placed', time: nowStr, done: true, current: true },
        { status: 'confirmed', label: 'Vendor Confirmed', time: '--:--', done: false },
        { status: 'preparing', label: 'Preparing Meal', time: '--:--', done: false },
        { status: 'ready', label: 'Ready for Pickup', time: '--:--', done: false },
        { status: 'out_for_delivery', label: 'Out for Delivery', time: '--:--', done: false },
        { status: 'completed', label: 'Delivered', time: '--:--', done: false },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    showToast(`Order ${newOrder.orderNumber} placed successfully!`);
    return newOrder;
  };

  const advanceOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;

        let nextDeliveryStatus = ord.deliveryStatus;
        let riderId = ord.riderId;
        let riderName = ord.riderName;
        let riderPhone = ord.riderPhone;

        // Auto assign default rider if moving to ready or out for delivery
        if ((newStatus === 'ready' || newStatus === 'out_for_delivery') && !riderId) {
          const defaultRider = riders[0];
          riderId = defaultRider.id;
          riderName = defaultRider.name;
          riderPhone = defaultRider.phone;
          nextDeliveryStatus = 'rider_assigned';
        }

        if (newStatus === 'out_for_delivery') {
          nextDeliveryStatus = 'in_transit';
        } else if (newStatus === 'completed') {
          nextDeliveryStatus = 'delivered';
        }

        const updatedTimeline = ord.timeline.map((step) => {
          if (step.status === newStatus) {
            return { ...step, done: true, current: true, time: nowStr };
          }
          if (step.current && step.status !== newStatus) {
            return { ...step, current: false };
          }
          return step;
        });

        return {
          ...ord,
          status: newStatus,
          deliveryStatus: nextDeliveryStatus,
          riderId,
          riderName,
          riderPhone,
          updatedAt: new Date().toISOString(),
          timeline: updatedTimeline,
        };
      })
    );

    const labels: Record<OrderStatus, string> = {
      new: 'New Order Received',
      confirmed: 'Order Confirmed by Vendor',
      preparing: 'Order is being Prepared',
      ready: 'Order Ready for Rider Pickup',
      out_for_delivery: 'Order Out for Delivery',
      completed: 'Order Marked Delivered & Completed',
      cancelled: 'Order Cancelled',
    };

    showToast(labels[newStatus] || `Order status updated to ${newStatus}`);
  };

  const updateDeliveryStatus = (orderId: string, deliveryStatus: DeliveryStatus, riderId?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        
        let newOrderStatus = ord.status;
        if (deliveryStatus === 'in_transit') newOrderStatus = 'out_for_delivery';
        if (deliveryStatus === 'delivered') newOrderStatus = 'completed';

        return {
          ...ord,
          deliveryStatus,
          status: newOrderStatus,
          riderId: riderId || ord.riderId || riders[0].id,
          riderName: ord.riderName || riders[0].name,
          riderPhone: ord.riderPhone || riders[0].phone,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    showToast(`Delivery status updated: ${deliveryStatus.replace('_', ' ').toUpperCase()}`);
  };

  const assignRider = (orderId: string, riderId: string) => {
    const rider = riders.find((r) => r.id === riderId) || riders[0];
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          riderId: rider.id,
          riderName: rider.name,
          riderPhone: rider.phone,
          deliveryStatus: 'rider_assigned',
        };
      })
    );
    showToast(`Assigned ${rider.name} to order.`);
  };

  const toggleRiderOnline = (riderId: string) => {
    setRiders((prev) =>
      prev.map((r) => (r.id === riderId ? { ...r, isOnline: !r.isOnline } : r))
    );
    showToast('Rider availability toggled');
  };

  const toggleVendorOpen = (vendorId: string) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, isOpen: !v.isOpen } : v))
    );
    showToast('Vendor store status updated');
  };

  const toggleProductAvailability = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, available: !p.available } : p))
    );
    showToast('Product availability updated');
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `p_${Date.now()}`,
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Added ${newProduct.name} to store menu`);
  };

  const resetToSampleData = () => {
    localStorage.removeItem(STORAGE_KEY_ORDERS);
    localStorage.removeItem(STORAGE_KEY_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setProducts(MOCK_PRODUCTS);
    showToast('Reset data to initial prototype state');
  };

  return (
    <QwestContext.Provider
      value={{
        authUser,
        authScreen,
        activeRole,
        setAuthScreen,
        setActiveRole,
        login,
        signup,
        logout,
        switchDemoRole,
        verificationEmail,
        verificationPhone,
        setVerificationEmail,
        setVerificationPhone,
        orders,
        products,
        vendors,
        riders,
        createOrder,
        advanceOrderStatus,
        updateDeliveryStatus,
        assignRider,
        toggleRiderOnline,
        toggleVendorOpen,
        toggleProductAvailability,
        addProduct,
        resetToSampleData,
        simulateNetworkError,
        setSimulateNetworkError,
        isSimulatingDelay,
        vendorTab,
        setVendorTab,
        riderTab,
        setRiderTab,
        customerTab,
        setCustomerTab,
        selectedOrderId,
        setSelectedOrderId,
        selectedVendorId,
        setSelectedVendorId,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </QwestContext.Provider>
  );
};

export const useQwest = () => {
  const context = useContext(QwestContext);
  if (!context) {
    throw new Error('useQwest must be used within a QwestProvider');
  }
  return context;
};
