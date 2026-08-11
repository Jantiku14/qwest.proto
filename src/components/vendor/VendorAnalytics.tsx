import React from 'react';
import { useQwest } from '../../context/QwestContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Award, Clock, DollarSign, ArrowUpRight } from 'lucide-react';

export const VendorAnalytics: React.FC = () => {
  const { orders } = useQwest();

  // Weekly Revenue mock data
  const revenueData = [
    { day: 'Mon', sales: 42000 },
    { day: 'Tue', sales: 58000 },
    { day: 'Wed', sales: 65000 },
    { day: 'Thu', sales: 52000 },
    { day: 'Fri', sales: 88000 },
    { day: 'Sat', sales: 112000 },
    { day: 'Sun', sales: 94000 },
  ];

  // Peak Order Hours mock data
  const peakHoursData = [
    { hour: '11 AM', orders: 12 },
    { hour: '1 PM', orders: 34 },
    { hour: '3 PM', orders: 18 },
    { hour: '6 PM', orders: 42 },
    { hour: '8 PM', orders: 28 },
  ];

  return (
    <div className="space-y-5 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Business Intelligence</h1>
        <p className="text-xs text-slate-500">Track revenue growth, popular items, and peak demand</p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs text-slate-400 font-medium">Weekly Revenue</p>
          <p className="text-2xl font-black text-slate-900 mt-1">₦511,000</p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+24% growth</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs text-slate-400 font-medium">Avg Prep Time</p>
          <p className="text-2xl font-black text-slate-900 mt-1">14.2 Mins</p>
          <p className="text-[11px] text-emerald-600 font-bold mt-1">3 Mins faster than avg</p>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Revenue Trend (This Week)</h2>
            <p className="text-sm font-black text-slate-900">Total: ₦511,000</p>
          </div>
          <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-1 rounded-full">
            7 Days
          </span>
        </div>

        <div className="h-44 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis hide />
              <Tooltip
                formatter={(value: any) => [`₦${Number(value).toLocaleString()}`, 'Sales']}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="sales" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Peak Order Hours Bar Chart */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Peak Order Hours</h2>
        <div className="h-36 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={peakHoursData}>
              <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis hide />
              <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '11px' }} />
              <Bar dataKey="orders" fill="#0f172a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Best-Selling Products */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Best-Sellers</h2>
        <div className="space-y-2 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-[10px]">#1</span>
              <div>
                <p className="font-bold text-slate-900">Smokey Party Jollof & Chicken</p>
                <p className="text-[10px] text-slate-400">248 orders this month</p>
              </div>
            </div>
            <p className="font-black text-slate-900">₦1,116,000</p>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px]">#2</span>
              <div>
                <p className="font-bold text-slate-900">Spicy Goat Meat Asun Platter</p>
                <p className="text-[10px] text-slate-400">182 orders this month</p>
              </div>
            </div>
            <p className="font-black text-slate-900">₦1,092,000</p>
          </div>
        </div>
      </div>
    </div>
  );
};
