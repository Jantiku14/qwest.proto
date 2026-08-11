import React, { useState } from 'react';
import { useQwest } from '../../context/QwestContext';
import { OrderStatus } from '../../types';
import { VendorOrderDetails } from './VendorOrderDetails';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Phone,
  MapPin,
  ChevronRight,
  ArrowRight,
  Filter,
  X,
} from 'lucide-react';

export const VendorOrders: React.FC = () => {
  const { orders, advanceOrderStatus, selectedOrderId, setSelectedOrderId } = useQwest();
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'all'>('all');

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  if (selectedOrder) {
    return <VendorOrderDetails order={selectedOrder} onBack={() => setSelectedOrderId(null)} />;
  }

  const filteredOrders = orders.filter((o) => {
    if (activeFilter === 'all') return true;
    return o.status === activeFilter;
  });

  const categories: { key: OrderStatus | 'all'; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: orders.length },
    { key: 'new', label: 'New', count: orders.filter((o) => o.status === 'new').length },
    { key: 'confirmed', label: 'Confirmed', count: orders.filter((o) => o.status === 'confirmed').length },
    { key: 'preparing', label: 'Preparing', count: orders.filter((o) => o.status === 'preparing').length },
    { key: 'ready', label: 'Ready', count: orders.filter((o) => o.status === 'ready').length },
    { key: 'out_for_delivery', label: 'In Delivery', count: orders.filter((o) => o.status === 'out_for_delivery').length },
    { key: 'completed', label: 'Completed', count: orders.filter((o) => o.status === 'completed').length },
    { key: 'cancelled', label: 'Cancelled', count: orders.filter((o) => o.status === 'cancelled').length },
  ];

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Order Lifecycle</h1>
          <p className="text-xs text-slate-500">Manage and advance order states</p>
        </div>
        <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
          {orders.length} Total
        </span>
      </div>

      {/* Filter Tabs Horizontal Scroll */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveFilter(cat.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeFilter === cat.key
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>{cat.label}</span>
            <span
              className={`px-1.5 py-0.2 text-[10px] rounded-full ${
                activeFilter === cat.key ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="p-10 bg-white rounded-2xl border border-slate-100 text-center my-6">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No orders found</h3>
          <p className="text-xs text-slate-400 mt-1">There are no orders matching the "{activeFilter}" filter status.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-slate-300 transition"
            >
              {/* Order Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900">{ord.orderNumber}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        ord.status === 'new'
                          ? 'bg-amber-100 text-amber-800 animate-pulse'
                          : ord.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.status === 'preparing'
                          ? 'bg-blue-100 text-blue-800'
                          : ord.status === 'ready'
                          ? 'bg-purple-100 text-purple-800'
                          : ord.status === 'out_for_delivery'
                          ? 'bg-indigo-100 text-indigo-800'
                          : ord.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {ord.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Customer: <span className="font-semibold text-slate-800">{ord.customerName}</span>
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">₦{ord.totalAmount.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              {/* Items Summary */}
              <div className="py-2.5">
                <p className="text-xs text-slate-700 font-medium">
                  {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(' + ')}
                </p>
                {ord.deliveryInstructions && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 px-2 py-1 rounded-lg mt-1 inline-block">
                    Note: {ord.deliveryInstructions}
                  </p>
                )}
              </div>

              {/* Lifecycle Actions */}
              <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                <button
                  onClick={() => setSelectedOrderId(ord.id)}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 underline"
                >
                  View Details & Receipt
                </button>

                {/* State advancing buttons */}
                <div className="flex items-center gap-2">
                  {ord.status === 'new' && (
                    <button
                      onClick={() => advanceOrderStatus(ord.id, 'confirmed')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
                    >
                      Accept Order
                    </button>
                  )}
                  {ord.status === 'confirmed' && (
                    <button
                      onClick={() => advanceOrderStatus(ord.id, 'preparing')}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
                    >
                      Mark Preparing
                    </button>
                  )}
                  {ord.status === 'preparing' && (
                    <button
                      onClick={() => advanceOrderStatus(ord.id, 'ready')}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
                    >
                      Mark Ready
                    </button>
                  )}
                  {ord.status === 'ready' && (
                    <button
                      onClick={() => advanceOrderStatus(ord.id, 'out_for_delivery')}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
                    >
                      Dispatch Rider
                    </button>
                  )}
                  {ord.status === 'out_for_delivery' && (
                    <button
                      onClick={() => advanceOrderStatus(ord.id, 'completed')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
