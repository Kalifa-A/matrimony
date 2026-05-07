"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ToastProvider';

export default function ForgotPassword() {
  const { showToast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast(data.message, 'success');
        // Redirect to verify OTP page with email in query param
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
      } else {
        showToast(data.message || "Failed to send OTP", 'error');
      }
    } catch (err) {
      showToast("Something went wrong. Please try again.", 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-2xl border border-white/50 backdrop-blur-sm">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-[#9AD872]/10 rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-[#9AD872]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Forgot Password?</h2>
          <p className="mt-4 text-sm text-gray-500 leading-relaxed">
            Enter your registered email and we'll send you a 6-digit OTP to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="group">
            <label htmlFor="email-address" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 pl-1 transition-colors group-focus-within:text-[#9AD872]">
              Email Address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-5 py-4 border border-gray-200 rounded-2xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-4 focus:ring-[#9AD872]/20 focus:border-[#9AD872] transition-all bg-gray-50/50 hover:bg-gray-50"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-2xl text-white shadow-xl transition-all transform active:scale-[0.98] ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#9AD872] hover:bg-[#8bc764] hover:shadow-[#9AD872]/40'
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : "Send Reset OTP"}
            </button>
          </div>
        </form>

        <div className="text-center">
          <Link href="/login" className="text-sm font-bold text-[#9AD872] hover:text-[#8bc764] transition-colors inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
