import React, { useState } from 'react';
import { useQwest } from '../../context/QwestContext';
import { Mail, Lock, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const { login, setAuthScreen, isSimulatingDelay, simulateNetworkError } = useQwest();
  const [identity, setIdentity] = useState('mama.nkechi@qwest.ng');
  const [password, setPassword] = useState('password123');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ identity?: string; password?: string }>({});

  const validate = () => {
    const errors: { identity?: string; password?: string } = {};
    if (!identity.trim()) {
      errors.identity = 'Email address or phone number is required.';
    }
    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) return;

    const res = await login(identity, password);
    if (!res.success && res.error) {
      setErrorMessage(res.error);
    }
  };

  const handleQuickFill = (email: string, roleLabel: string) => {
    setIdentity(email);
    setPassword('password123');
    setErrorMessage(null);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl border border-slate-100 my-auto">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-600 text-white font-black text-2xl tracking-wider shadow-lg shadow-emerald-600/30 mb-3">
          Q
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Welcome back to QWEST
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          The operating system for Nigerian home businesses
        </p>
      </div>

      {/* Network Error Banner if active */}
      {simulateNetworkError && (
        <div className="mb-6 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Simulated network instability enabled. Submissions will test error state.</span>
        </div>
      )}

      {/* Global Error State */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Sign In Failed</p>
            <p className="text-xs text-red-600 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email or Phone Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Email address or Phone number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={identity}
              onChange={(e) => {
                setIdentity(e.target.value);
                setFieldErrors((prev) => ({ ...prev, identity: undefined }));
              }}
              placeholder="e.g. 08031234567 or vendor@qwest.ng"
              className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${
                fieldErrors.identity ? 'border-red-500 bg-red-50/20' : 'border-slate-200 focus:border-emerald-600'
              } rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition`}
            />
          </div>
          {fieldErrors.identity && (
            <p className="text-xs text-red-500 mt-1 font-medium">{fieldErrors.identity}</p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Password
            </label>
            <button
              type="button"
              onClick={() => setAuthScreen('forgot_password_1')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFieldErrors((prev) => ({ ...prev, password: undefined }));
              }}
              placeholder="••••••••"
              className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${
                fieldErrors.password ? 'border-red-500 bg-red-50/20' : 'border-slate-200 focus:border-emerald-600'
              } rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition`}
            />
          </div>
          {fieldErrors.password && (
            <p className="text-xs text-red-500 mt-1 font-medium">{fieldErrors.password}</p>
          )}
        </div>

        {/* Submit Button with Loading State */}
        <button
          type="submit"
          disabled={isSimulatingDelay}
          className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-xl text-sm shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSimulatingDelay ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-slate-400 font-medium">Or continue with</span>
        </div>
      </div>

      {/* Social / Google Sign In */}
      <button
        type="button"
        onClick={() => {
          setIdentity('mama.nkechi@qwest.ng');
          login('mama.nkechi@qwest.ng', 'password123');
        }}
        className="w-full py-3 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-xl text-sm transition flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Sign in with Google</span>
      </button>

      {/* Quick Demo Pre-fills */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">
          Quick Demo Credentials
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickFill('mama.nkechi@qwest.ng', 'Vendor')}
            className="py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-200 transition text-center truncate"
          >
            Vendor
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('tunde.raji@qwest.ng', 'Rider')}
            className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-semibold rounded-lg border border-blue-200 transition text-center truncate"
          >
            Rider
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('chioma.a@gmail.com', 'Customer')}
            className="py-1.5 px-2 bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-semibold rounded-lg border border-purple-200 transition text-center truncate"
          >
            Customer
          </button>
        </div>
      </div>

      {/* Sign Up Link */}
      <p className="text-center text-xs text-slate-500 mt-6">
        Don't have a QWEST account?{' '}
        <button
          type="button"
          onClick={() => setAuthScreen('signup')}
          className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
        >
          Create account
        </button>
      </p>
    </div>
  );
};
