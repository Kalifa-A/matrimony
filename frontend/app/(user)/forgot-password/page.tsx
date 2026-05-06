"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/app/components/ToastProvider';

export default function ForgotPassword() {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // For now, we simulate a success since the backend might not have this route yet
    setTimeout(() => {
      showToast("If an account exists with this email, you will receive reset instructions.", 'info');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Forgot Password?</h2>
          <p className="mt-4 text-sm text-gray-500">
            Enter your email and we'll send you instructions to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email-address" className="block text-sm font-bold text-gray-700 mb-2 pl-1">
              Email Address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#9AD872] focus:border-[#9AD872] transition-all sm:text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-xl text-white shadow-lg transition-all transform active:scale-95 ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#9AD872] hover:bg-[#8bc764] hover:shadow-[#9AD872]/40'
              }`}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </div>
        </form>

        <div className="text-center">
          <Link href="/login" className="text-sm font-bold text-[#9AD872] hover:text-[#8bc764] transition-colors">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
