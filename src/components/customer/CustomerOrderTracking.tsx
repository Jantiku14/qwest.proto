import React from 'react';
import { useQwest } from '../../context/QwestContext';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Phone,
  MapPin,
  Bike,
  Shield,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

export const CustomerOrderTracking: React.FC = () => {
  const { orders, selectedOrderId, setSelectedOrderId } = useQwest();

  const customerOrders = orders.filter((o) => o.customerId === 'c_301' || true);
  const selectedOrder = customerOrders.find((o) => o.id === selectedOrderId) || customerOrders[0];

  return (
    <div className="space-y-5 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Your QWEST Orders</h1>
        <p className="text-xs text-slate-500">Live order lifecycle and rider tracking</p>
      </div>

      {selectedOrder ? (
        <div className="space-y-4">
          {/* Main Status Hero Card */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold rounded-full uppercase">
                {selectedOrder.status.replace(/_/g, ' ')}
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">{selectedOrder.orderNumber}</span>
            </div>

            <div>
              <h2 className="text-xl font-black">{selectedOrder.vendorName}</h2>
              <p className="text-xs text-slate-400 mt-0.5">Estimated Arrival: {selectedOrder.estimatedMinutes} Mins</p>
            </div>

            {/* Delivery Security PIN Badge */}
            <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Security Delivery PIN</p>
                <p className="text-xs text-slate-300">Give this code to the rider upon delivery</p>
              </div>
              <span className="text-xl font-mono font-black text-emerald-400 tracking-widest bg-slate-900 px-3 py-1 rounded-lg border border-emerald-500/30">
                {selectedOrder.deliveryPin}
              </span>
            </div>
          </div>

          {/* Assigned Rider Info Card */}
          {selectedOrder.riderName && (
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Bike className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{selectedOrder.riderName}</p>
                  <p className="text-[10px] text-slate-500">Logistics Delivery Specialist</p>
                </div>
              </div>

              <a
                href={`tel:${selectedOrder.riderPhone}`}
                className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call</span>
              </a>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Live Order Lifecycle Progress
            </h2>
            <div className="space-y-3">
              {selectedOrder.timeline.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      step.done ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-300'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className={`font-bold ${step.done ? 'text-slate-900' : 'text-slate-400'}`}>
                      {step.label}
                    </p>
                    <p className="text-[10px] text-slate-400">{step.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 bg-white rounded-2xl border border-slate-100 text-center">
          <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-800">No active orders</p>
          <p className="text-xs text-slate-400 mt-0.5">Visit the Discover tab to place an order.</p>
        </div>
      )}

      {/* Orders Selector List */}
      <div>
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          All Orders ({customerOrders.length})
        </h2>
        <div className="space-y-2">
          {customerOrders.map((ord) => (
            <div
              key={ord.id}
              onClick={() => setSelectedOrderId(ord.id)}
              className={`p-3 bg-white border rounded-xl flex items-center justify-between text-xs cursor-pointer transition ${
                selectedOrder?.id === ord.id ? 'border-emerald-600 ring-2 ring-emerald-500/20' : 'border-slate-100'
              }`}
            >
              <div>
                <p className="font-bold text-slate-900">{ord.orderNumber} • {ord.vendorName}</p>
                <p className="text-[10px] font-bold text-emerald-700">₦{ord.totalAmount.toLocaleString()}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
