import React from 'react';
import { useQwest } from '../../context/QwestContext';
import { Bike, CheckCircle2, Clock, MapPin, ChevronRight } from 'lucide-react';

export const RiderDeliveries: React.FC = () => {
  const { orders, setSelectedOrderId } = useQwest();

  const activeDeliveries = orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled');
  const completedDeliveries = orders.filter((o) => o.status === 'completed');

  return (
    <div className="space-y-5 pb-20">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Rider Delivery Queue</h1>
        <p className="text-xs text-slate-500">Manage pickup and drop-off assignments</p>
      </div>

      {/* Active Deliveries */}
      <div>
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Active Jobs ({activeDeliveries.length})
        </h2>
        <div className="space-y-3">
          {activeDeliveries.map((ord) => (
            <div
              key={ord.id}
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3 hover:border-slate-300 transition cursor-pointer"
              onClick={() => setSelectedOrderId(ord.id)}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-50">
                <span className="text-sm font-black text-slate-900">{ord.orderNumber}</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full uppercase">
                  {ord.deliveryStatus.replace('_', ' ')}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <p className="font-bold text-slate-900">Pickup: {ord.vendorName}</p>
                <p className="text-slate-500">Drop-off: {ord.customerAddress}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                <p className="text-xs font-extrabold text-emerald-600">Payout: ₦{ord.deliveryFee.toLocaleString()}</p>
                <button className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <span>Open Route</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed History */}
      <div>
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Trip History ({completedDeliveries.length})
        </h2>
        <div className="space-y-2">
          {completedDeliveries.map((ord) => (
            <div key={ord.id} className="p-3 bg-white border border-slate-100 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <div>
                  <p className="font-bold text-slate-900">{ord.vendorName} ➔ {ord.customerName}</p>
                  <p className="text-[10px] text-slate-400">{new Date(ord.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              <p className="font-bold text-slate-900">+₦{ord.deliveryFee.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
