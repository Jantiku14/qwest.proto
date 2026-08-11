import React, { useState } from 'react';
import { useQwest } from '../../context/QwestContext';
import { Order } from '../../types';
import {
  ArrowLeft,
  Phone,
  MapPin,
  Bike,
  CheckCircle2,
  Navigation,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface Props {
  order: Order;
  onBack: () => void;
}

export const RiderActiveDelivery: React.FC<Props> = ({ order, onBack }) => {
  const { updateDeliveryStatus, advanceOrderStatus } = useQwest();
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);

  const handleArrivedVendor = () => {
    updateDeliveryStatus(order.id, 'rider_assigned');
  };

  const handlePickedUp = () => {
    updateDeliveryStatus(order.id, 'picked_up');
    advanceOrderStatus(order.id, 'out_for_delivery');
  };

  const handleInTransit = () => {
    updateDeliveryStatus(order.id, 'in_transit');
  };

  const handleConfirmDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);

    // Verify PIN or allow bypass for prototype test
    if (enteredPin && enteredPin !== order.deliveryPin && enteredPin !== '1234') {
      setPinError(`Incorrect PIN. Customer PIN is ${order.deliveryPin} (or use 1234)`);
      return;
    }

    updateDeliveryStatus(order.id, 'delivered');
    advanceOrderStatus(order.id, 'completed');
    onBack();
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Rider Hub</span>
        </button>

        <span className="text-xs font-mono font-bold text-slate-400">Order: {order.orderNumber}</span>
      </div>

      {/* Task Summary Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold rounded-full uppercase">
            {order.deliveryStatus.replace('_', ' ')}
          </span>
          <p className="text-xs font-extrabold text-emerald-400">Fee: ₦{order.deliveryFee.toLocaleString()}</p>
        </div>

        <div>
          <h1 className="text-lg font-black">{order.vendorName}</h1>
          <p className="text-xs text-slate-400 mt-0.5">Pickup: {order.vendorAddress}</p>
        </div>
      </div>

      {/* Step 1: Pickup Location */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            1. Pickup from Vendor
          </h2>
          <a
            href={`tel:${order.vendorPhone}`}
            className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold flex items-center gap-1"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Vendor</span>
          </a>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
          <p className="font-bold text-slate-900">{order.vendorName}</p>
          <p className="text-slate-500">{order.vendorAddress}</p>
        </div>

        {order.deliveryStatus === 'unassigned' || order.deliveryStatus === 'rider_assigned' ? (
          <button
            onClick={handlePickedUp}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm Order Picked Up</span>
          </button>
        ) : (
          <div className="p-2 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Order Picked Up from Vendor</span>
          </div>
        )}
      </div>

      {/* Step 2: Customer Delivery Location */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            2. Deliver to Customer
          </h2>
          <a
            href={`tel:${order.customerPhone}`}
            className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold flex items-center gap-1"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Customer</span>
          </a>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
          <p className="font-bold text-slate-900">{order.customerName}</p>
          <p className="text-slate-500">{order.customerAddress}</p>
          {order.deliveryInstructions && (
            <p className="text-amber-800 font-medium pt-1 border-t border-slate-200/60 mt-1">
              Instructions: "{order.deliveryInstructions}"
            </p>
          )}
        </div>

        {/* Deliver PIN Form */}
        <form onSubmit={handleConfirmDelivery} className="p-4 bg-slate-900 text-white rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Enter Customer Delivery PIN
            </label>
            <span className="text-[10px] text-emerald-400 font-mono">Demo PIN: {order.deliveryPin}</span>
          </div>

          {pinError && (
            <div className="p-2 bg-red-500/20 text-red-300 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{pinError}</span>
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              maxLength={4}
              value={enteredPin}
              onChange={(e) => setEnteredPin(e.target.value)}
              placeholder="e.g. 4829"
              className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 text-center font-mono text-lg font-bold rounded-xl focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition"
            >
              Complete Delivery
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
