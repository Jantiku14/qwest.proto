import React from 'react';
import { useQwest } from '../../context/QwestContext';
import {
  Bike,
  Power,
  TrendingUp,
  Truck,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { RiderActiveDelivery } from './RiderActiveDelivery';

export const RiderDashboard: React.FC = () => {
  const { riders, orders, toggleRiderOnline, setRiderTab, selectedOrderId, setSelectedOrderId } = useQwest();

  const currentRider = riders[0]; // Tunde Raji

  // Find active delivery assigned to this rider
  const activeDelivery = orders.find(
    (o) =>
      (o.riderId === currentRider.id || o.status === 'ready' || o.status === 'out_for_delivery') &&
      o.status !== 'completed' &&
      o.status !== 'cancelled'
  );

  const completedToday = orders.filter((o) => o.status === 'completed');

  if (selectedOrderId && activeDelivery && selectedOrderId === activeDelivery.id) {
    return <RiderActiveDelivery order={activeDelivery} onBack={() => setSelectedOrderId(null)} />;
  }

  return (
    <div className="space-y-5 pb-20">
      {/* Top Banner & Online Toggle */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-full text-xs font-semibold mb-2">
              <Bike className="w-3.5 h-3.5" />
              <span>Rider Operating Hub</span>
            </div>
            <h1 className="text-xl font-black tracking-tight">{currentRider.name}</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentRider.vehicleType} • {currentRider.vehiclePlate} ({currentRider.zone})
            </p>
          </div>

          <button
            onClick={() => toggleRiderOnline(currentRider.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
              currentRider.isOnline
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{currentRider.isOnline ? 'ONLINE' : 'OFFLINE'}</span>
          </button>
        </div>

        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-600/10 rounded-full blur-2xl" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today's Earnings</p>
          <p className="text-2xl font-black text-slate-900 mt-1">₦{currentRider.todayEarnings.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-600 font-bold mt-1">Ready for Instant Withdrawal</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed Trips</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{completedToday.length}</p>
          <p className="text-[11px] text-blue-600 font-bold mt-1">Rating: {currentRider.rating} ★</p>
        </div>
      </div>

      {/* Active Assigned Delivery Banner */}
      {activeDelivery ? (
        <div className="bg-emerald-600 text-white p-5 rounded-2xl shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 bg-white/20 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
              Active Delivery Task
            </span>
            <span className="text-xs font-mono font-bold text-emerald-100">{activeDelivery.orderNumber}</span>
          </div>

          <div>
            <h2 className="text-lg font-black">{activeDelivery.vendorName}</h2>
            <p className="text-xs text-emerald-100 mt-0.5">➔ {activeDelivery.customerAddress}</p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-emerald-500/40">
            <div>
              <p className="text-[10px] text-emerald-200">Payout</p>
              <p className="text-sm font-extrabold">₦{activeDelivery.deliveryFee.toLocaleString()}</p>
            </div>

            <button
              onClick={() => setSelectedOrderId(activeDelivery.id)}
              className="px-4 py-2 bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <span>Open Delivery Route</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 bg-white rounded-2xl border border-slate-100 text-center">
          <Bike className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-800">No Active Deliveries Assigned</p>
          <p className="text-xs text-slate-400 mt-0.5">Stay online in Yaba / Surulere zone to receive pickup alerts.</p>
        </div>
      )}

      {/* Recent Activity List */}
      <div>
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Completed Today ({completedToday.length})
        </h2>
        <div className="space-y-2">
          {completedToday.map((ord) => (
            <div key={ord.id} className="p-3 bg-white border border-slate-100 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">{ord.vendorName}</p>
                  <p className="text-[10px] text-slate-400">{ord.customerAddress}</p>
                </div>
              </div>
              <p className="font-extrabold text-slate-900">+₦{ord.deliveryFee.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
