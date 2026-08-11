import React from 'react';
import { useQwest } from '../../context/QwestContext';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  Truck,
  ArrowRight,
  Plus,
  BarChart3,
  Store,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  RotateCcw,
} from 'lucide-react';

export const VendorDashboard: React.FC = () => {
  const {
    orders,
    vendors,
    products,
    authUser,
    setVendorTab,
    setSelectedOrderId,
    advanceOrderStatus,
    toggleVendorOpen,
  } = useQwest();

  const currentVendor = vendors.find((v) => v.id === authUser?.id) || vendors[0];

  // Vendor relevant orders
  const vendorOrders = orders.filter((o) => o.vendorId === currentVendor.id || true);

  // Metrics calculations
  const todaySales = vendorOrders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const activeOrders = vendorOrders.filter(
    (o) => o.status === 'new' || o.status === 'confirmed' || o.status === 'preparing' || o.status === 'ready'
  );

  const newOrders = vendorOrders.filter((o) => o.status === 'new');
  const inDelivery = vendorOrders.filter((o) => o.status === 'out_for_delivery');

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner & Operating Status */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Vendor Dashboard</span>
            </div>
            <h1 className="text-xl font-black tracking-tight">{currentVendor.businessName}</h1>
            <p className="text-xs text-slate-400 mt-0.5">{currentVendor.address}</p>
          </div>

          {/* Store Open/Close Toggle */}
          <button
            onClick={() => toggleVendorOpen(currentVendor.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
              currentVendor.isOpen
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${currentVendor.isOpen ? 'bg-emerald-400' : 'bg-red-400'}`} />
            <span>{currentVendor.isOpen ? 'Store Open' : 'Store Closed'}</span>
          </button>
        </div>

        {/* Decorative background shape */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-600/10 rounded-full blur-2xl" />
      </div>

      {/* Action Needed Highlight Banner */}
      {newOrders.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold animate-bounce">
              {newOrders.length}
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900">New Order Awaiting Action!</p>
              <p className="text-xs text-amber-700">Accept orders promptly to guarantee fast delivery.</p>
            </div>
          </div>
          <button
            onClick={() => setVendorTab('orders')}
            className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1"
          >
            <span>Review</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Today's Sales */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today's Sales</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">
            ₦{todaySales.toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">
            +18% vs yesterday
          </p>
        </div>

        {/* Active Orders */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Orders</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{activeOrders.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">
            {newOrders.length} awaiting response
          </p>
        </div>

        {/* Deliveries in Progress */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Delivery</span>
            <Truck className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{inDelivery.length}</p>
          <p className="text-[11px] text-blue-600 font-medium mt-1">Riders on route</p>
        </div>

        {/* Total Orders Today */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{vendorOrders.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">98.4% fulfillment rate</p>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div>
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Operational Quick Actions
        </h2>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setVendorTab('orders')}
            className="p-3 bg-white border border-slate-100 hover:border-emerald-200 rounded-xl text-center shadow-sm transition group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 block">All Orders</span>
          </button>

          <button
            onClick={() => setVendorTab('deliveries')}
            className="p-3 bg-white border border-slate-100 hover:border-emerald-200 rounded-xl text-center shadow-sm transition group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 block">Deliveries</span>
          </button>

          <button
            onClick={() => setVendorTab('analytics')}
            className="p-3 bg-white border border-slate-100 hover:border-emerald-200 rounded-xl text-center shadow-sm transition group"
          >
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 mx-auto flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 block">Analytics</span>
          </button>
        </div>
      </div>

      {/* Recent Orders List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900">Recent Orders</h2>
          <button
            onClick={() => setVendorTab('orders')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {vendorOrders.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-slate-100 text-center">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No Orders Yet</p>
            <p className="text-xs text-slate-400 mt-0.5">When customers place orders, they will appear here in real-time.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {vendorOrders.slice(0, 4).map((ord) => (
              <div
                key={ord.id}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-slate-300 transition"
              >
                <div className="flex items-start justify-between pb-3 border-b border-slate-50">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-900">{ord.orderNumber}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.status === 'new'
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : ord.status === 'preparing'
                            ? 'bg-blue-100 text-blue-800'
                            : ord.status === 'out_for_delivery'
                            ? 'bg-purple-100 text-purple-800'
                            : ord.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {ord.status.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{ord.customerName} • {ord.deliveryZone}</p>
                  </div>
                  <p className="text-sm font-extrabold text-slate-900">
                    ₦{ord.totalAmount.toLocaleString()}
                  </p>
                </div>

                <div className="py-2">
                  <p className="text-xs text-slate-700 font-medium line-clamp-1">
                    {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-50">
                  <button
                    onClick={() => {
                      setSelectedOrderId(ord.id);
                      setVendorTab('orders');
                    }}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    View Details
                  </button>

                  {/* Fast Action Button */}
                  {ord.status === 'new' && (
                    <button
                      onClick={() => advanceOrderStatus(ord.id, 'confirmed')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
                    >
                      Accept Order
                    </button>
                  )}
                  {ord.status === 'confirmed' && (
                    <button
                      onClick={() => advanceOrderStatus(ord.id, 'preparing')}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
                    >
                      Start Preparing
                    </button>
                  )}
                  {ord.status === 'preparing' && (
                    <button
                      onClick={() => advanceOrderStatus(ord.id, 'ready')}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
                    >
                      Mark Ready
                    </button>
                  )}
                  {ord.status === 'ready' && (
                    <button
                      onClick={() => advanceOrderStatus(ord.id, 'out_for_delivery')}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition"
                    >
                      Dispatch Rider
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
