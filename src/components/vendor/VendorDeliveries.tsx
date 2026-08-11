import React from 'react';
import { useQwest } from '../../context/QwestContext';
import { Truck, MapPin, Bike, Phone, Clock, Navigation, CheckCircle2 } from 'lucide-react';

export const VendorDeliveries: React.FC = () => {
  const { orders, riders } = useQwest();

  const activeDeliveries = orders.filter(
    (o) => o.status === 'out_for_delivery' || o.status === 'ready' || o.deliveryStatus === 'in_transit'
  );

  const completedDeliveries = orders.filter((o) => o.status === 'completed');

  return (
    <div className="space-y-5 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Dispatch & Delivery Tracking</h1>
        <p className="text-xs text-slate-500">Monitor riders carrying out active deliveries</p>
      </div>

      {/* Live Map Preview Simulation Card */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Lagos Logistics Radar
            </span>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-mono">
            {riders.filter((r) => r.isOnline).length} Riders Online
          </span>
        </div>

        {/* Simulated Map Graphical Visual */}
        <div className="h-36 bg-slate-800/80 rounded-xl relative border border-slate-700/50 flex items-center justify-center overflow-hidden">
          {/* Map Grid Grid Lines */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(#34d399 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />

          {/* Route SVG Path */}
          <svg className="absolute inset-0 w-full h-full stroke-emerald-500/60 fill-none" strokeWidth="3" strokeDasharray="4 4">
            <path d="M 40 80 Q 140 20 280 90" />
          </svg>

          {/* Vendor Pin */}
          <div className="absolute left-10 top-16 bg-emerald-600 text-white p-1.5 rounded-full shadow-lg border-2 border-white flex items-center justify-center">
            <MapPin className="w-4 h-4" />
          </div>

          {/* Rider Moving Pin */}
          <div className="absolute left-1/2 top-10 bg-amber-500 text-white p-2 rounded-full shadow-lg border-2 border-white flex items-center justify-center animate-bounce">
            <Bike className="w-4 h-4" />
          </div>

          {/* Customer Destination Pin */}
          <div className="absolute right-10 bottom-8 bg-blue-600 text-white p-1.5 rounded-full shadow-lg border-2 border-white flex items-center justify-center">
            <Navigation className="w-4 h-4" />
          </div>

          <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-slate-300 border border-slate-700">
            Route: Commercial Ave, Yaba ➔ Emerald Heights, Ikeja
          </div>
        </div>
      </div>

      {/* Active Dispatches */}
      <div>
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Active Dispatches ({activeDeliveries.length})
        </h2>

        {activeDeliveries.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-slate-100 text-center">
            <Truck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No Active Dispatches</p>
            <p className="text-xs text-slate-400 mt-0.5">Orders ready or out for delivery will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeDeliveries.map((ord) => (
              <div key={ord.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-50">
                  <div>
                    <span className="text-sm font-extrabold text-slate-900">{ord.orderNumber}</span>
                    <p className="text-xs text-slate-500">{ord.customerName} • {ord.deliveryZone}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-[10px] font-extrabold rounded-full uppercase">
                    {ord.deliveryStatus.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl text-xs">
                  <div className="flex items-center gap-2">
                    <Bike className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="font-bold text-slate-800">{ord.riderName || 'Rider Assigned'}</p>
                      <p className="text-[10px] text-slate-500">{ord.riderPhone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">ETA</p>
                    <p className="font-black text-slate-900">{ord.estimatedMinutes} Mins</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Dispatches */}
      <div>
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Completed Dispatches Today ({completedDeliveries.length})
        </h2>

        <div className="space-y-2">
          {completedDeliveries.map((ord) => (
            <div key={ord.id} className="p-3 bg-white border border-slate-100 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{ord.orderNumber} • {ord.customerName}</p>
                  <p className="text-[10px] text-slate-400">{ord.deliveryZone}</p>
                </div>
              </div>
              <p className="font-bold text-emerald-600">Delivered</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
