import React, { useState } from 'react';
import { useQwest } from '../../context/QwestContext';
import { Search, Star, Clock, MapPin, Store, ChevronRight, ShoppingBag } from 'lucide-react';
import { CustomerVendorView } from './CustomerVendorView';

export const CustomerDiscover: React.FC = () => {
  const { vendors, selectedVendorId, setSelectedVendorId } = useQwest();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Nigerian Kitchen', 'Bakery & Dessert', 'Grills & Suya', 'Drinks'];

  const selectedVendor = vendors.find((v) => v.id === selectedVendorId);

  if (selectedVendorId && selectedVendor) {
    return <CustomerVendorView vendor={selectedVendor} onBack={() => setSelectedVendorId(null)} />;
  }

  const filteredVendors = vendors.filter((v) => {
    const matchesCategory = activeCategory === 'All' || v.category === activeCategory;
    const matchesSearch = v.businessName.toLowerCase().includes(searchQuery.toLowerCase()) || v.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-5 pb-20">
      {/* Search Header */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl space-y-3">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full text-xs font-semibold mb-2">
            <span>Verified Local Home Businesses</span>
          </div>
          <h1 className="text-xl font-black tracking-tight">Order Fresh in Lagos</h1>
          <p className="text-xs text-slate-400 mt-0.5">Directly supporting Nigerian artisanal kitchen & bakery vendors</p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Jollof, Suya, Cakes, Zobo..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 text-white placeholder-slate-400 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeCategory === cat
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Vendor Storefronts List */}
      <div>
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Popular Home Vendors ({filteredVendors.length})
        </h2>

        <div className="space-y-4">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor.id}
              onClick={() => setSelectedVendorId(vendor.id)}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer group"
            >
              <div className="h-32 relative overflow-hidden">
                <img
                  src={vendor.bannerUrl}
                  alt={vendor.businessName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-lg text-white text-[10px] font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>{vendor.rating} ({vendor.reviewCount})</span>
                </div>
              </div>

              <div className="p-4 flex items-start gap-3">
                <img
                  src={vendor.logoUrl}
                  alt={vendor.businessName}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="flex-1">
                  <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-emerald-600 transition">
                    {vendor.businessName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{vendor.category} • {vendor.zone}</p>
                  
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      <span>15-25 min</span>
                    </span>
                    <span>•</span>
                    <span>Delivery: ₦1,200</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
