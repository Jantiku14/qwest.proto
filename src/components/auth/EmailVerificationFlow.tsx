import React, { useState, useEffect } from 'react';
import { useQwest } from '../../context/QwestContext';
import { Mail, CheckCircle2, RefreshCw, ArrowRight, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';

export const EmailVerificationFlow: React.FC = () => {
  const { authScreen, setAuthScreen, verificationEmail } = useQwest();
  const [cooldown, setCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = () => {
    if (cooldown > 0) return;
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setCooldown(60);
    }, 800);
  };

  const handleSimulateVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setAuthScreen('verify_email_2');
    }, 900);
  };

  const maskedEmail = verificationEmail.includes('@')
    ? `${verificationEmail[0]}***${verificationEmail.slice(verificationEmail.indexOf('@') - 1)}`
    : 'c***a@gmail.com';

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl border border-slate-100 my-auto">
      {/* PANEL 1: VERIFY EMAIL */}
      {authScreen === 'verify_email_1' && (
        <div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <Mail className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Verify Email Address
          </h2>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            We sent a verification link to your registered email address.
          </p>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl mb-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Target Email</p>
              <p className="text-sm font-bold text-slate-800 font-mono">{maskedEmail}</p>
            </div>
            <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">
              Pending
            </span>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleSimulateVerify}
              disabled={isVerifying}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Checking Email Status...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Simulate Clicking Verification Link</span>
                </>
              )}
            </button>

            <button
              onClick={handleResend}
              disabled={cooldown > 0 || isResending}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-xs transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
              <span>
                {cooldown > 0 ? `Resend email in ${cooldown}s` : 'Resend Verification Email'}
              </span>
            </button>
          </div>

          <p className="text-center text-[11px] text-slate-400 mt-6">
            Didn't receive email? Check spam folder or contact <span className="underline">support@qwest.ng</span>
          </p>
        </div>
      )}

      {/* PANEL 2: EMAIL VERIFIED */}
      {authScreen === 'verify_email_2' && (
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Email Verified!
          </h2>
          <p className="text-xs text-slate-500 mt-2 mb-6">
            Your email address has been successfully verified for QWEST workspace operations.
          </p>

          <button
            onClick={() => setAuthScreen('app')}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2"
          >
            <span>Enter QWEST Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
