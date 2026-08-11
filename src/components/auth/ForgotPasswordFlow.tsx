import React, { useState } from 'react';
import { useQwest } from '../../context/QwestContext';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, RefreshCw, KeyRound, Loader2 } from 'lucide-react';

export const ForgotPasswordFlow: React.FC = () => {
  const { authScreen, setAuthScreen } = useQwest();
  const [identity, setIdentity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [maskedContact, setMaskedContact] = useState('');

  const maskContact = (val: string) => {
    if (val.includes('@')) {
      const [name, domain] = val.split('@');
      return `${name[0]}***${name.slice(-1)}@${domain}`;
    }
    return `+234 ${val.slice(0, 3)} *** ${val.slice(-4)}`;
  };

  const handleSendInstructions = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);

      // Simulate failure scenario if user inputs "fail@qwest.ng"
      if (identity.toLowerCase().includes('fail')) {
        setAuthScreen('forgot_password_3');
      } else {
        setMaskedContact(maskContact(identity));
        setAuthScreen('forgot_password_2');
      }
    }, 800);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl border border-slate-100 my-auto">
      {/* PANEL 1: FORGOT PASSWORD INPUT */}
      {authScreen === 'forgot_password_1' && (
        <div>
          <button
            onClick={() => setAuthScreen('login')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sign In</span>
          </button>

          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <KeyRound className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Forgot Password
          </h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Enter your email address or phone number and we’ll send you password recovery instructions.
          </p>

          <form onSubmit={handleSendInstructions} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email or Phone Number
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                  placeholder="e.g. chioma@gmail.com or 08023334455"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Instructions...</span>
                </>
              ) : (
                <>
                  <span>Send Recovery Link</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400">
              Tip: Type <code className="bg-slate-100 px-1 py-0.5 rounded text-red-600 font-mono">fail@qwest.ng</code> to test Recovery Failed state.
            </p>
          </div>
        </div>
      )}

      {/* PANEL 2: RESET INSTRUCTIONS SENT */}
      {authScreen === 'forgot_password_2' && (
        <div className="text-center py-2">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Reset Instructions Sent
          </h2>
          <p className="text-xs text-slate-500 mt-2 px-2">
            We have dispatched password reset instructions to:
          </p>

          <div className="my-4 py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl inline-block text-sm font-bold text-slate-800 font-mono">
            {maskedContact || 'c***a@gmail.com'}
          </div>

          <p className="text-xs text-slate-500 mb-6 px-4">
            Please check your inbox or SMS messages and follow the link to complete your password reset.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => setAuthScreen('reset_password_1')}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
            >
              <span>Proceed to Set New Password</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setAuthScreen('forgot_password_1')}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-xs transition"
            >
              Resend to a different contact
            </button>
          </div>
        </div>
      )}

      {/* PANEL 3: RECOVERY FAILED */}
      {authScreen === 'forgot_password_3' && (
        <div className="text-center py-2">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Account Recovery Failed
          </h2>
          <p className="text-xs text-slate-500 mt-2 px-2">
            We could not locate an active QWEST account matching the provided details or the rate limit for reset attempts was exceeded.
          </p>

          <div className="my-5 p-4 bg-red-50/60 border border-red-200 rounded-xl text-left space-y-2">
            <p className="text-xs font-bold text-red-900">Recommended Recovery Steps:</p>
            <ul className="text-xs text-red-700 space-y-1 list-disc list-inside">
              <li>Verify phone number or email spelling</li>
              <li>Check if you registered under a different role account</li>
              <li>Contact QWEST Support at <span className="underline">help@qwest.ng</span></li>
            </ul>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setAuthScreen('forgot_password_1')}
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Recovery Again</span>
            </button>

            <button
              onClick={() => setAuthScreen('login')}
              className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              Return to Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
