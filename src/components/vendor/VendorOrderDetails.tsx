import React from 'react';
import { useQwest } from '../../context/QwestContext';
import { Order } from '../../types';
import {
  ArrowLeft,
  Phone,
  MapPin,
  Clock,
  User,
  CheckCircle2,
  Bike,
  ShieldAlert,
  Printer,
  ChevronRight,
} from 'lucide-react';

interface Props {
  order: Order;
  onBack: () => void;
}

export const VendorOrderDetails: React.FC<Props> = ({ order, onBack }) => {
  const { advanceOrderStatus, riders, assignRider } = useQwest();

  return (
    <div className="space-y-5 pb-20">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Orders</span>
        </button>

        <span className="text-xs font-mono font-bold text-slate-400">ID: {order.id}</span>
      </div>

      {/* Order Main Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h1 className="text-xl font-black text-slate-900">{order.orderNumber}</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-emerald-100 text-emerald-800">
            {order.status.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Action Stage Buttons */}
        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl">
          <p className="text-xs font-bold text-slate-700">Advance Stage:</p>
          <div className="flex gap-2">
            {order.status === 'new' && (
              <button
                onClick={() => advanceOrderStatus(order.id, 'confirmed')}
                className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg"
              >
                1. Accept
              </button>
            )}
            {order.status === 'confirmed' && (
              <button
                onClick={() => advanceOrderStatus(order.id, 'preparing')}
                className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg"
              >
                2. Prepare
              </button>
            )}
            {order.status === 'preparing' && (
              <button
                onClick={() => advanceOrderStatus(order.id, 'ready')}
                className="px-3 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-lg"
              >
                3. Ready
              </button>
            )}
            {order.status === 'ready' && (
              <button
                onClick={() => advanceOrderStatus(order.id, 'out_for_delivery')}
                className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg"
              >
                4. Dispatch
              </button>
            )}
            {order.status === 'out_for_delivery' && (
              <button
                onClick={() => advanceOrderStatus(order.id, 'completed')}
                className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg"
              >
                5. Delivered
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Customer Information Card */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Customer & Delivery Address
        </h2>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{order.customerName}</p>
              <p className="text-xs text-slate-500">{order.customerPhone}</p>
            </div>
          </div>

          <a
            href={`tel:${order.customerPhone}`}
            className="p-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl transition flex items-center gap-1 text-xs font-bold"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call</span>
          </a>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{order.customerAddress}</span>
          </div>
          {order.deliveryInstructions && (
            <p className="text-amber-800 font-medium pt-1 border-t border-slate-200/60 mt-1">
              Instructions: "{order.deliveryInstructions}"
            </p>
          )}
        </div>
      </div>

      {/* Order Itemized Summary */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Itemized Order Summary
        </h2>
        <div className="divide-y divide-slate-100">
          {order.items.map((item) => (
            <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded bg-slate-100 text-slate-800 font-extrabold flex items-center justify-center text-[10px]">
                  {item.quantity}x
                </span>
                <div>
                  <p className="font-bold text-slate-900">{item.name}</p>
                  {item.options && <p className="text-[10px] text-slate-400">{item.options}</p>}
                </div>
              </div>
              <p className="font-bold text-slate-900">₦{(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span>₦{(order.totalAmount - order.deliveryFee).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Delivery Fee ({order.deliveryZone})</span>
            <span>₦{order.deliveryFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
            <span>Total Paid ({order.paymentMethod.toUpperCase()})</span>
            <span className="text-emerald-600">₦{order.totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Assigned Rider & Delivery PIN */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Assigned Logistics Rider
          </h2>
          <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-mono font-bold text-slate-600">
            PIN: {order.deliveryPin}
          </span>
        </div>

        {order.riderName ? (
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Bike className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">{order.riderName}</p>
                <p className="text-[10px] text-slate-500">{order.riderPhone}</p>
              </div>
            </div>
            <a
              href={`tel:${order.riderPhone}`}
              className="p-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-bold"
            >
              Call Rider
            </a>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-slate-500">Select an available QWEST network rider:</p>
            <div className="grid grid-cols-2 gap-2">
              {riders.map((r) => (
                <button
                  key={r.id}
                  onClick={() => assignRider(order.id, r.id)}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left text-xs transition"
                >
                  <p className="font-bold text-slate-900">{r.name}</p>
                  <p className="text-[10px] text-slate-500">{r.zone} • {r.vehicleType}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Visual Timeline */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Order Progression History
        </h2>
        <div className="space-y-3">
          {order.timeline.map((step, idx) => (
            <div key={idx} className="flex items-start gap-3 text-xs">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  step.done
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-300'
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
  );
};
