import React, { useState, useRef, useEffect } from 'react';
import { useQwest } from '../../context/QwestContext';
import { Smartphone, CheckCircle2, ArrowRight, RefreshCw, Loader2, AlertCircle, Edit2 } from 'lucide-react';

export const PhoneVerificationFlow: React.FC = () => {
  const { authScreen, setAuthScreen, verificationPhone, setVerificationPhone } = useQwest();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [cooldown, setCooldown] = useState(45);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [newPhoneInput, setNewPhoneInput] = useState(verificationPhone);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleChangeOtp = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setErrorMsg(null);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    setErrorMsg(null);

    if (code.length < 6) {
      setErrorMsg('Please enter the full 6-digit OTP code.');
      return;
    }

    // Simulate invalid code if code is "000000"
    if (code === '000000') {
      setErrorMsg('Invalid OTP code. Please check SMS or click Resend Code.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAuthScreen('verify_phone_2');
    }, 800);
  };

  const handleResendCode = () => {
    if (cooldown > 0) return;
    setOtp(['', '', '', '', '', '']);
    setErrorMsg(null);
    setCooldown(45);
  };

  const handleSavePhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPhoneInput.trim()) {
      setVerificationPhone(newPhoneInput);
      setIsEditingPhone(false);
      setCooldown(45);
    }
  };

  const maskedPhone = verificationPhone.startsWith('+234')
    ? `${verificationPhone.slice(0, 8)} *** ${verificationPhone.slice(-4)}`
    : `+234 ${verificationPhone.slice(0, 3)} *** ${verificationPhone.slice(-4)}`;

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl border border-slate-100 my-auto">
      {/* PANEL 1: VERIFY PHONE */}
      {authScreen === 'verify_phone_1' && (
        <div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <Smartphone className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Verify Phone Number
          </h2>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Enter the 6-digit OTP code sent via SMS to your Nigerian phone number.
          </p>

          {/* Masked Phone Banner or Edit Modal */}
          {isEditingPhone ? (
            <form onSubmit={handleSavePhone} className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Update Phone Number</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPhoneInput}
                  onChange={(e) => setNewPhoneInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 font-mono"
                />
                <button type="submit" className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg">
                  Save
                </button>
              </div>
            </form>
          ) : (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl mb-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Mobile Number</p>
                <p className="text-sm font-bold text-slate-800 font-mono">{maskedPhone}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingPhone(true)}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                <span>Change</span>
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleVerifyOtp} className="space-y-6">
            {/* 6-Digit OTP Inputs */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
                6-Digit Security Code
              </label>
              <div className="flex justify-between gap-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChangeOtp(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-11 h-13 text-center text-xl font-bold font-mono bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
                  />
                ))}
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
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <span>Verify Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Resend OTP */}
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={cooldown > 0}
              className="text-xs text-slate-600 hover:text-slate-900 font-semibold disabled:text-slate-400 inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>
                {cooldown > 0 ? `Resend SMS code in ${cooldown}s` : 'Resend Code'}
              </span>
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400">
              Demo tip: Any 6 digits work! Enter <code className="text-red-500 font-mono">000000</code> to test invalid code state.
            </p>
          </div>
        </div>
      )}

      {/* PANEL 2: PHONE VERIFIED */}
      {authScreen === 'verify_phone_2' && (
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Phone Number Verified!
          </h2>
          <p className="text-xs text-slate-500 mt-2 mb-6 px-2">
            Your Nigerian phone number has been linked to your QWEST account. You are ready to manage operations.
          </p>

          <button
            onClick={() => setAuthScreen('app')}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
