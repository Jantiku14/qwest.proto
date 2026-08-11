import React, { useState } from 'react';
import { useQwest } from '../../context/QwestContext';
import { UserRole } from '../../types';
import { Store, Bike, ShoppingBag, User, Mail, Phone, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export const SignUpForm: React.FC = () => {
  const { signup, setAuthScreen, isSimulatingDelay } = useQwest();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('vendor');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Valid email address is required.';
    if (!phone.trim()) newErrors.phone = 'Nigerian phone number is required.';
    if (!password) newErrors.password = 'Password is required.';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters.';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) return;

    const res = await signup({
      name: fullName,
      email,
      phone,
      pass: password,
      role: selectedRole,
    });

    if (!res.success && res.error) {
      setErrorMessage(res.error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl border border-slate-100 my-auto">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-xl tracking-wider shadow-lg shadow-emerald-600/30 mb-2">
          Q
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Create QWEST Account
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Join the home business ecosystem in Nigeria
        </p>
      </div>

      {errorMessage && (
        <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role Selection Cards */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Select Your Operating Role
          </label>
          <div className="grid grid-cols-3 gap-2">
            {/* Vendor */}
            <button
              type="button"
              onClick={() => setSelectedRole('vendor')}
              className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                selectedRole === 'vendor'
                  ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 ring-2 ring-emerald-600/20 shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <Store className={`w-5 h-5 ${selectedRole === 'vendor' ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span className="text-xs font-bold block">Vendor</span>
            </button>

            {/* Rider */}
            <button
              type="button"
              onClick={() => setSelectedRole('rider')}
              className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                selectedRole === 'rider'
                  ? 'border-blue-600 bg-blue-50/60 text-blue-900 ring-2 ring-blue-600/20 shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <Bike className={`w-5 h-5 ${selectedRole === 'rider' ? 'text-blue-600' : 'text-slate-400'}`} />
              <span className="text-xs font-bold block">Rider</span>
            </button>

            {/* Customer */}
            <button
              type="button"
              onClick={() => setSelectedRole('customer')}
              className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                selectedRole === 'customer'
                  ? 'border-purple-600 bg-purple-50/60 text-purple-900 ring-2 ring-purple-600/20 shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <ShoppingBag className={`w-5 h-5 ${selectedRole === 'customer' ? 'text-purple-600' : 'text-slate-400'}`} />
              <span className="text-xs font-bold block">Customer</span>
            </button>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Chioma Adebayo"
              className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 border ${
                errors.fullName ? 'border-red-500' : 'border-slate-200'
              } rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
            />
          </div>
          {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="chioma@example.ng"
              className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 border ${
                errors.email ? 'border-red-500' : 'border-slate-200'
              } rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
            />
          </div>
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Phone Number <span className="text-slate-400 font-normal">(Nigerian format)</span>
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+234 803 123 4567"
              className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 border ${
                errors.phone ? 'border-red-500' : 'border-slate-200'
              } rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
            />
          </div>
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
        </div>

        {/* Passwords */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 chars"
                className={`w-full pl-9 pr-2 py-2.5 bg-slate-50 border ${
                  errors.password ? 'border-red-500' : 'border-slate-200'
                } rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
              />
            </div>
            {errors.password && <p className="text-[10px] text-red-500 mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className={`w-full pl-9 pr-2 py-2.5 bg-slate-50 border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-slate-200'
                } rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-[10px] text-red-500 mt-1">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSimulatingDelay}
          className="w-full mt-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isSimulatingDelay ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Continue to Verification</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-slate-500 mt-5">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => setAuthScreen('login')}
          className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
        >
          Sign In
        </button>
      </p>
    </div>
  );
};
