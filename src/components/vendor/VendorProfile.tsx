import React, { useState } from 'react';
import { useQwest } from '../../context/QwestContext';
import { Store, Plus, Power, CreditCard, ShieldCheck, Tag, Trash2, CheckCircle2 } from 'lucide-react';

export const VendorProfile: React.FC = () => {
  const { vendors, products, authUser, toggleVendorOpen, toggleProductAvailability, addProduct, logout } = useQwest();

  const currentVendor = vendors.find((v) => v.id === authUser?.id) || vendors[0];
  const vendorProducts = products.filter((p) => p.vendorId === currentVendor.id);

  // Add Item Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('3500');
  const [newCategory, setNewCategory] = useState('Main Dishes');

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPrice) return;

    addProduct({
      vendorId: currentVendor.id,
      name: newName,
      description: newDesc || 'Delicious freshly prepared homemade treat.',
      price: Number(newPrice),
      category: newCategory,
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80',
      available: true,
      prepMinutes: 15,
      rating: 5.0,
    });

    setNewName('');
    setNewDesc('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Business Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <img
            src={currentVendor.logoUrl}
            alt={currentVendor.businessName}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/30"
          />
          <div>
            <h1 className="text-lg font-extrabold text-slate-900">{currentVendor.businessName}</h1>
            <p className="text-xs text-slate-500">{currentVendor.category} • {currentVendor.zone}</p>
            <p className="text-xs text-slate-400 mt-0.5">{currentVendor.address}</p>
          </div>
        </div>

        {/* Store Open/Close Button */}
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
          <div className="flex items-center gap-2">
            <Power className={`w-4 h-4 ${currentVendor.isOpen ? 'text-emerald-600' : 'text-red-500'}`} />
            <div>
              <p className="text-xs font-bold text-slate-800">
                Store Status: {currentVendor.isOpen ? 'OPEN FOR ORDERS' : 'STORE CLOSED'}
              </p>
              <p className="text-[10px] text-slate-400">Toggle whether customers can place new orders.</p>
            </div>
          </div>
          <button
            onClick={() => toggleVendorOpen(currentVendor.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition text-white ${
              currentVendor.isOpen ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {currentVendor.isOpen ? 'Close Store' : 'Open Store'}
          </button>
        </div>
      </div>

      {/* Bank Settlement Account */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>Bank Settlement Account</span>
          </h2>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
            Verified
          </span>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
          <p className="text-slate-500">Bank Name: <span className="font-bold text-slate-900">{currentVendor.bankAccount?.bankName}</span></p>
          <p className="text-slate-500">Account No: <span className="font-mono font-bold text-slate-900">{currentVendor.bankAccount?.accountNumber}</span></p>
          <p className="text-slate-500">Account Name: <span className="font-bold text-slate-900">{currentVendor.bankAccount?.accountName}</span></p>
        </div>
      </div>

      {/* Menu / Inventory Management */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Menu Items & Inventory ({vendorProducts.length})
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>

        <div className="space-y-2">
          {vendorProducts.map((p) => (
            <div key={p.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                <div>
                  <p className="font-bold text-slate-900">{p.name}</p>
                  <p className="text-[10px] text-emerald-700 font-bold">₦{p.price.toLocaleString()}</p>
                </div>
              </div>

              {/* In Stock Toggle */}
              <button
                onClick={() => toggleProductAvailability(p.id)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                  p.available
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
              >
                {p.available ? 'In Stock' : 'Sold Out'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sign Out Button */}
      <button
        onClick={logout}
        className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-2xl transition border border-red-200"
      >
        Sign Out of QWEST
      </button>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Add New Menu Item</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Item Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Suya Platter with Chips"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Price (₦)</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="4500"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Main Dishes">Main Dishes</option>
                  <option value="Grills & Sides">Grills & Sides</option>
                  <option value="Drinks">Drinks</option>
                  <option value="Bakery">Bakery</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-md"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
