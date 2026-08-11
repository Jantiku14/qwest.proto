import React from 'react';
import { QwestProvider, useQwest } from './context/QwestContext';
import { DemoRoleSwitcherHeader, VendorBottomNav, RiderBottomNav, CustomerBottomNav } from './components/common/NavigationBars';
import { LoginForm } from './components/auth/LoginForm';
import { SignUpForm } from './components/auth/SignUpForm';
import { ForgotPasswordFlow } from './components/auth/ForgotPasswordFlow';
import { ResetPasswordFlow } from './components/auth/ResetPasswordFlow';
import { EmailVerificationFlow } from './components/auth/EmailVerificationFlow';
import { PhoneVerificationFlow } from './components/auth/PhoneVerificationFlow';

import { VendorDashboard } from './components/vendor/VendorDashboard';
import { VendorOrders } from './components/vendor/VendorOrders';
import { VendorDeliveries } from './components/vendor/VendorDeliveries';
import { VendorAnalytics } from './components/vendor/VendorAnalytics';
import { VendorProfile } from './components/vendor/VendorProfile';

import { RiderDashboard } from './components/rider/RiderDashboard';
import { RiderDeliveries } from './components/rider/RiderDeliveries';
import { RiderEarnings } from './components/rider/RiderEarnings';

import { CustomerDiscover } from './components/customer/CustomerDiscover';
import { CustomerOrderTracking } from './components/customer/CustomerOrderTracking';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    authScreen,
    activeRole,
    vendorTab,
    riderTab,
    customerTab,
    toastMessage,
    authUser,
    logout,
  } = useQwest();

  // Render Auth screens
  if (authScreen !== 'app') {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-center p-4">
        {authScreen === 'login' && <LoginForm />}
        {authScreen === 'signup' && <SignUpForm />}
        {authScreen.startsWith('forgot_password') && <ForgotPasswordFlow />}
        {authScreen.startsWith('reset_password') && <ResetPasswordFlow />}
        {authScreen.startsWith('verify_email') && <EmailVerificationFlow />}
        {authScreen.startsWith('verify_phone') && <PhoneVerificationFlow />}
      </div>
    );
  }

  // Render Role-based Dashboards
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-16">
      <main className="max-w-md mx-auto min-h-screen bg-slate-50 border-x border-slate-200/80 p-4 relative shadow-sm">
        {/* VENDOR MODE VIEWS */}
        {activeRole === 'vendor' && (
          <>
            {vendorTab === 'home' && <VendorDashboard />}
            {vendorTab === 'orders' && <VendorOrders />}
            {vendorTab === 'deliveries' && <VendorDeliveries />}
            {vendorTab === 'analytics' && <VendorAnalytics />}
            {vendorTab === 'profile' && <VendorProfile />}
            <VendorBottomNav />
          </>
        )}

        {/* RIDER MODE VIEWS */}
        {activeRole === 'rider' && (
          <>
            {riderTab === 'home' && <RiderDashboard />}
            {riderTab === 'deliveries' && <RiderDeliveries />}
            {riderTab === 'earnings' && <RiderEarnings />}
            {riderTab === 'profile' && (
              <div className="space-y-4 pb-20">
                <div className="bg-white p-5 rounded-2xl border border-slate-100">
                  <h1 className="text-lg font-bold text-slate-900">{authUser?.name}</h1>
                  <p className="text-xs text-slate-500">{authUser?.email} • {authUser?.phone}</p>
                </div>
                <button onClick={logout} className="w-full py-3 bg-red-50 text-red-700 text-xs font-bold rounded-2xl">
                  Sign Out
                </button>
              </div>
            )}
            <RiderBottomNav />
          </>
        )}

        {/* CUSTOMER MODE VIEWS */}
        {activeRole === 'customer' && (
          <>
            {customerTab === 'discover' && <CustomerDiscover />}
            {customerTab === 'orders' && <CustomerOrderTracking />}
            {customerTab === 'profile' && (
              <div className="space-y-4 pb-20">
                <div className="bg-white p-5 rounded-2xl border border-slate-100">
                  <h1 className="text-lg font-bold text-slate-900">{authUser?.name || 'Chioma Adebayo'}</h1>
                  <p className="text-xs text-slate-500">{authUser?.email} • {authUser?.phone}</p>
                  <p className="text-xs text-slate-400 mt-2">Saved Address: Flat 4B, Emerald Heights, Commercial Ave, Yaba, Lagos</p>
                </div>
                <button onClick={logout} className="w-full py-3 bg-red-50 text-red-700 text-xs font-bold rounded-2xl">
                  Sign Out
                </button>
              </div>
            )}
            <CustomerBottomNav />
          </>
        )}
      </main>

      {/* Global Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-bold z-50 flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <QwestProvider>
      <DemoRoleSwitcherHeader />
      <MainContent />
    </QwestProvider>
  );
}
