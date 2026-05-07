"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/app/components/ToastProvider';
import Link from 'next/link';

function VerifyOTPContent() {
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!email) {
      router.push('/forgot-password');
    }
  }, [email, router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value !== "") {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (otp[index] === "" && index > 0) {
        const prev = (e.currentTarget.previousSibling as HTMLInputElement);
        if (prev) prev.focus();
      }
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      showToast("Please enter the complete 6-digit OTP", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpValue }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast(data.message, 'success');
        router.push(`/reset-password?email=${encodeURIComponent(email)}&otp=${otpValue}`);
      } else {
        showToast(data.message || "Invalid OTP", 'error');
      }
    } catch (err) {
      showToast("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    setResendLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("New OTP sent to your email", 'success');
        setCountdown(60);
        setCanResend(false);
      } else {
        showToast(data.message || "Failed to resend OTP", 'error');
      }
    } catch (err) {
      showToast("Something went wrong", "error");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-2xl border border-white/50 backdrop-blur-sm">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-[#9AD872]/10 rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-[#9AD872]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Verify OTP</h2>
          <p className="mt-4 text-sm text-gray-500 leading-relaxed">
            We've sent a 6-digit code to <span className="font-bold text-gray-900">{email}</span>. Enter it below to verify.
          </p>
        </div>

        <form className="mt-8 space-y-8" onSubmit={handleVerify}>
          <div className="flex justify-between gap-2">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={(e) => e.target.select()}
                className="w-full h-14 text-center text-2xl font-bold border-2 border-gray-100 rounded-xl focus:border-[#9AD872] focus:ring-4 focus:ring-[#9AD872]/20 focus:outline-none transition-all bg-gray-50/50"
              />
            ))}
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-2xl text-white shadow-xl transition-all transform active:scale-[0.98] ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#9AD872] hover:bg-[#8bc764] hover:shadow-[#9AD872]/40'
              }`}
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend || resendLoading}
                  className={`font-bold transition-colors ${
                    canResend ? 'text-[#9AD872] hover:text-[#8bc764]' : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {resendLoading ? "Sending..." : canResend ? "Resend OTP" : `Resend in ${countdown}s`}
                </button>
              </p>
            </div>
          </div>
        </form>

        <div className="text-center">
          <Link href="/forgot-password" title="Go back to forgot password" className="text-sm font-bold text-gray-400 hover:text-[#9AD872] transition-colors inline-flex items-center gap-2">
            Change Email
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOTP() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <VerifyOTPContent />
    </Suspense>
  );
}
