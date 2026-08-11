import React, { useState } from 'react';
import { useQwest } from '../../context/QwestContext';
import { VendorProfile, Product, OrderItem } from '../../types';
import {
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Check,
} from 'lucide-react';

interface Props {
  vendor: VendorProfile;
  onBack: () => void;
}

export const CustomerVendorView: React.FC<Props> = ({ vendor, onBack }) => {
  const { products, createOrder, setSelectedOrderId, setCustomerTab } = useQwest();
  const vendorProducts = products.filter((p) => p.vendorId === vendor.id);

  // Cart state
  const [cart, setCart] = useState<Record<string, number>>({});
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('Flat 4B, Emerald Heights, Commercial Ave, Yaba, Lagos');
  const [deliveryPhone, setDeliveryPhone] = useState('+234 802 333 4455');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'card' | 'bank_transfer'>('paystack');

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      const current = prev[productId] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: next };
    });
  };

  const cartItemIds = Object.keys(cart);
  const cartItemsCount = (Object.values(cart) as number[]).reduce((a: number, b: number) => a + b, 0);

  const cartOrderItems: OrderItem[] = cartItemIds.map((id) => {
    const prod = products.find((p) => p.id === id)!;
    return {
      id: prod.id,
      name: prod.name,
      price: prod.price,
      quantity: cart[id],
    };
  });

  const subtotal = cartOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 1200;
  const grandTotal = subtotal + deliveryFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartOrderItems.length === 0) return;

    const newOrder = createOrder({
      customerId: 'c_301',
      customerName: 'Chioma Adebayo',
      customerPhone: deliveryPhone,
      customerAddress: deliveryAddress,
      deliveryZone: vendor.zone,
      vendorId: vendor.id,
      vendorName: vendor.businessName,
      vendorAddress: vendor.address,
      vendorPhone: vendor.phone,
      items: cartOrderItems,
      totalAmount: grandTotal,
      deliveryFee: deliveryFee,
      status: 'new',
      deliveryStatus: 'unassigned',
      estimatedMinutes: 25,
      deliveryInstructions: deliveryNote || 'Ring bell on arrival',
      paymentMethod,
      paymentStatus: 'paid',
    });

    setShowCheckoutModal(false);
    setSelectedOrderId(newOrder.id);
    setCustomerTab('orders');
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Top Nav */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Vendors</span>
      </button>

      {/* Vendor Header Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-32 relative">
          <img src={vendor.bannerUrl} alt={vendor.businessName} className="w-full h-full object-cover" />
        </div>

        <div className="p-4 flex items-start gap-3">
          <img
            src={vendor.logoUrl}
            alt={vendor.businessName}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-white -mt-8 shadow-md shrink-0"
          />
          <div>
            <h1 className="text-lg font-black text-slate-900">{vendor.businessName}</h1>
            <p className="text-xs text-slate-500">{vendor.category} • {vendor.zone}</p>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{vendor.rating}</span>
              </span>
              <span>•</span>
              <span>{vendor.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Store Menu */}
      <div>
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Menu & Fresh Offerings
        </h2>

        <div className="space-y-3">
          {vendorProducts.map((p) => {
            const qty = cart[p.id] || 0;
            return (
              <div key={p.id} className="p-3.5 bg-white rounded-2xl border border-slate-100 shadow-sm flex gap-3">
                <img src={p.imageUrl} alt={p.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-900">{p.name}</h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{p.description}</p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-black text-emerald-600">₦{p.price.toLocaleString()}</span>

                    {/* Quantity Controls */}
                    {qty > 0 ? (
                      <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(p.id, -1)}
                          className="w-6 h-6 rounded bg-white text-slate-700 font-bold flex items-center justify-center shadow-sm"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-extrabold text-slate-900 w-4 text-center">{qty}</span>
                        <button
                          onClick={() => updateQuantity(p.id, 1)}
                          className="w-6 h-6 rounded bg-emerald-600 text-white font-bold flex items-center justify-center shadow-sm"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => updateQuantity(p.id, 1)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Cart Bar */}
      {cartItemsCount > 0 && (
        <div className="fixed bottom-16 left-0 right-0 p-4 max-w-md mx-auto z-40">
          <button
            onClick={() => setShowCheckoutModal(true)}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-xl flex items-center justify-between transition"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white/20 text-white text-xs font-bold flex items-center justify-center">
                {cartItemsCount}
              </span>
              <span className="text-xs font-extrabold">View Cart Order</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-black">₦{grandTotal.toLocaleString()}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Checkout Drawer / Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="bg-white rounded-t-3xl p-5 w-full max-w-md max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Confirm Order & Delivery</h3>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-800"
              >
                Close
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
              {/* Order Items */}
              <div className="space-y-2 bg-slate-50 p-3 rounded-xl">
                <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Order Items</p>
                {cartOrderItems.map((item) => (
                  <div key={item.id} className="flex justify-between font-medium text-slate-800">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="font-bold">₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  Delivery Address (Lagos / Abuja)
                </label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              {/* Delivery Phone */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="text"
                  value={deliveryPhone}
                  onChange={(e) => setDeliveryPhone(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              {/* Special Note */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  placeholder="e.g. Ring bell or leave at security gate"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paystack')}
                    className={`p-2 rounded-xl border text-center font-bold text-[11px] ${
                      paymentMethod === 'paystack'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Paystack
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2 rounded-xl border text-center font-bold text-[11px] ${
                      paymentMethod === 'card'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Debit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-2 rounded-xl border text-center font-bold text-[11px] ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Transfer
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="pt-2 border-t border-slate-100 space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Logistics Delivery Fee</span>
                  <span>₦{deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-1">
                  <span>Total Amount</span>
                  <span className="text-emerald-600">₦{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-lg transition"
              >
                Place Order (₦{grandTotal.toLocaleString()})
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
