import React from 'react';
import { useQwest } from '../../context/QwestContext';
import { UserRole } from '../../types';
import {
  Home,
  ShoppingBag,
  Truck,
  BarChart3,
  User,
  Bike,
  Compass,
  RotateCcw,
  WifiOff,
  LogOut,
  Layers,
  KeyRound,
  ShieldAlert,
} from 'lucide-react';

export const DemoRoleSwitcherHeader: React.FC = () => {
  const {
    activeRole,
    switchDemoRole,
    authScreen,
    setAuthScreen,
    resetToSampleData,
    simulateNetworkError,
    setSimulateNetworkError,
    authUser,
    logout,
  } = useQwest();

  return (
    <div className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs px-3 py-2 sticky top-0 z-50 shadow-md">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Role Quick Switcher Buttons */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1 hidden sm:inline">
            Role:
          </span>

          <button
            onClick={() => switchDemoRole('vendor')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
              activeRole === 'vendor' && authScreen === 'app'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Vendor
          </button>

          <button
            onClick={() => switchDemoRole('rider')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
              activeRole === 'rider' && authScreen === 'app'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Rider
          </button>

          <button
            onClick={() => switchDemoRole('customer')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
              activeRole === 'customer' && authScreen === 'app'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Customer
          </button>

          <button
            onClick={() => setAuthScreen('login')}
            className={`px-2 py-1 rounded-lg font-bold text-[11px] transition ${
              authScreen !== 'app'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Open Auth Flows (Sign in, Sign up, OTP, Verification)"
          >
            Auth Flow
          </button>
        </div>

        {/* Prototype Tools Dropdown / Options */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSimulateNetworkError(!simulateNetworkError)}
            className={`p-1.5 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
              simulateNetworkError
                ? 'bg-red-500/20 border border-red-500/40 text-red-400'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Toggle network error state simulation"
          >
            <WifiOff className="w-3 h-3" />
            <span className="hidden xs:inline">{simulateNetworkError ? 'Net Err ON' : 'Net OK'}</span>
          </button>

          <button
            onClick={resetToSampleData}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition"
            title="Reset to sample orders"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const VendorBottomNav: React.FC = () => {
  const { vendorTab, setVendorTab, setSelectedOrderId } = useQwest();

  const handleTabClick = (tab: any) => {
    setSelectedOrderId(null);
    setVendorTab(tab);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 py-2 px-3 z-40 max-w-md mx-auto shadow-lg">
      <div className="flex justify-around items-center">
        <button
          onClick={() => handleTabClick('home')}
          className={`flex flex-col items-center gap-1 transition ${
            vendorTab === 'home' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold">Home</span>
        </button>

        <button
          onClick={() => handleTabClick('orders')}
          className={`flex flex-col items-center gap-1 transition ${
            vendorTab === 'orders' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] font-bold">Orders</span>
        </button>

        <button
          onClick={() => handleTabClick('deliveries')}
          className={`flex flex-col items-center gap-1 transition ${
            vendorTab === 'deliveries' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Truck className="w-5 h-5" />
          <span className="text-[10px] font-bold">Deliveries</span>
        </button>

        <button
          onClick={() => handleTabClick('analytics')}
          className={`flex flex-col items-center gap-1 transition ${
            vendorTab === 'analytics' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px] font-bold">Analytics</span>
        </button>

        <button
          onClick={() => handleTabClick('profile')}
          className={`flex flex-col items-center gap-1 transition ${
            vendorTab === 'profile' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold">Store</span>
        </button>
      </div>
    </div>
  );
};

export const RiderBottomNav: React.FC = () => {
  const { riderTab, setRiderTab, setSelectedOrderId } = useQwest();

  const handleTabClick = (tab: any) => {
    setSelectedOrderId(null);
    setRiderTab(tab);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 py-2 px-3 z-40 max-w-md mx-auto shadow-lg">
      <div className="flex justify-around items-center">
        <button
          onClick={() => handleTabClick('home')}
          className={`flex flex-col items-center gap-1 transition ${
            riderTab === 'home' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold">Home</span>
        </button>

        <button
          onClick={() => handleTabClick('deliveries')}
          className={`flex flex-col items-center gap-1 transition ${
            riderTab === 'deliveries' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Truck className="w-5 h-5" />
          <span className="text-[10px] font-bold">Deliveries</span>
        </button>

        <button
          onClick={() => handleTabClick('earnings')}
          className={`flex flex-col items-center gap-1 transition ${
            riderTab === 'earnings' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px] font-bold">Earnings</span>
        </button>

        <button
          onClick={() => handleTabClick('profile')}
          className={`flex flex-col items-center gap-1 transition ${
            riderTab === 'profile' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </div>
    </div>
  );
};

export const CustomerBottomNav: React.FC = () => {
  const { customerTab, setCustomerTab, setSelectedOrderId } = useQwest();

  const handleTabClick = (tab: any) => {
    setSelectedOrderId(null);
    setCustomerTab(tab);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 py-2 px-3 z-40 max-w-md mx-auto shadow-lg">
      <div className="flex justify-around items-center">
        <button
          onClick={() => handleTabClick('discover')}
          className={`flex flex-col items-center gap-1 transition ${
            customerTab === 'discover' ? 'text-purple-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-bold">Discover</span>
        </button>

        <button
          onClick={() => handleTabClick('orders')}
          className={`flex flex-col items-center gap-1 transition ${
            customerTab === 'orders' ? 'text-purple-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] font-bold">Orders</span>
        </button>

        <button
          onClick={() => handleTabClick('profile')}
          className={`flex flex-col items-center gap-1 transition ${
            customerTab === 'profile' ? 'text-purple-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold">Account</span>
        </button>
      </div>
    </div>
  );
};
