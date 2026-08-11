import React from 'react';
import { useQwest } from '../../context/QwestContext';
import { DollarSign, TrendingUp, CreditCard, ArrowDownRight, CheckCircle2 } from 'lucide-react';

export const RiderEarnings: React.FC = () => {
  const { riders } = useQwest();
  const currentRider = riders[0];

  return (
    <div className="space-y-5 pb-20">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Rider Wallet & Payouts</h1>
        <p className="text-xs text-slate-500">Track delivery fees and instant bank withdrawals</p>
      </div>

      {/* Main Balance Card */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl space-y-4">
        <div>
          <p className="text-xs text-slate-400 font-medium">Available Wallet Balance</p>
          <p className="text-3xl font-black mt-1">₦{currentRider.todayEarnings.toLocaleString()}</p>
        </div>

        <button
          onClick={() => alert('Payout request submitted! Funds dispatched via Paystack / GTBank.')}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition"
        >
          Instant Withdrawal to GTBank (0123***789)
        </button>
      </div>

      {/* Earnings Breakdown */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3 text-xs">
        <h2 className="font-bold text-slate-500 uppercase tracking-wider">Today's Payout Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between py-1 border-b border-slate-50">
            <span className="text-slate-600">Base Delivery Fees (12 trips)</span>
            <span className="font-bold text-slate-900">₦14,400</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-50">
            <span className="text-slate-600">Customer Tips</span>
            <span className="font-bold text-slate-900">₦3,100</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-50">
            <span className="text-slate-600">Peak Surge Bonus (Yaba Zone)</span>
            <span className="font-bold text-slate-900">₦1,000</span>
          </div>
          <div className="flex justify-between py-1 text-sm font-black text-slate-900 pt-1">
            <span>Total Earnings</span>
            <span className="text-emerald-600">₦{currentRider.todayEarnings.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
