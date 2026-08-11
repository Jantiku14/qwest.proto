import React, { useState } from 'react';
import { useQwest } from '../../context/QwestContext';
import { Lock, Check, X, CheckCircle2, ArrowRight, Shield, Loader2 } from 'lucide-react';

export const ResetPasswordFlow: React.FC = () => {
  const { authScreen, setAuthScreen } = useQwest();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Requirements logic
  const reqs = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[^A-Za-z0-9]/.test(newPassword),
  };

  const metCount = Object.values(reqs).filter(Boolean).length;
  const strengthLabel = metCount <= 1 ? 'Weak' : metCount <= 3 ? 'Moderate' : 'Strong';
  const strengthColor = metCount <= 1 ? 'bg-red-500' : metCount <= 3 ? 'bg-amber-500' : 'bg-emerald-500';

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (metCount < 3) {
      setErrorMsg('Please satisfy at least 3 password strength requirements.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAuthScreen('reset_password_2');
    }, 800);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl border border-slate-100 my-auto">
      {/* PANEL 1: CREATE NEW PASSWORD */}
      {authScreen === 'reset_password_1' && (
        <div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <Shield className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Create New Password
          </h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Ensure your new password meets the security requirements for QWEST account access.
          </p>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-4">
            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            {/* Strength Meter */}
            {newPassword && (
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-500">Password strength:</span>
                  <span className={`font-bold ${metCount <= 1 ? 'text-red-500' : metCount <= 3 ? 'text-amber-500' : 'text-emerald-600'}`}>
                    {strengthLabel}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${strengthColor} transition-all duration-300`}
                    style={{ width: `${(metCount / 4) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            {/* Password Requirements Checklist */}
            <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
              <p className="text-xs font-bold text-slate-700">Security Requirements:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className={`flex items-center gap-1.5 ${reqs.length ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                  {reqs.length ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  <span>At least 8 characters</span>
                </div>
                <div className={`flex items-center gap-1.5 ${reqs.uppercase ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                  {reqs.uppercase ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  <span>Uppercase letter</span>
                </div>
                <div className={`flex items-center gap-1.5 ${reqs.number ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                  {reqs.number ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  <span>One number</span>
                </div>
                <div className={`flex items-center gap-1.5 ${reqs.special ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                  {reqs.special ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  <span>Special character</span>
                </div>
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
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <span>Reset Password</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* PANEL 2: PASSWORD UPDATED CONFIRMATION */}
      {authScreen === 'reset_password_2' && (
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Password Updated
          </h2>
          <p className="text-xs text-slate-500 mt-2 px-2 mb-6">
            Your QWEST account password has been updated successfully. You can now sign in with your new credentials.
          </p>

          <button
            onClick={() => setAuthScreen('login')}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
          >
            <span>Back to Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
