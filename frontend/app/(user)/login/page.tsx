"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


import { useToast } from '@/app/components/ToastProvider';

export default function Login() {
  const { showToast } = useToast();
  const router = useRouter();
  
  // States
  const [email, setEmail] = useState(''); // Using email as it's more standard than username
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Automatically handle cookies
      });

      const data = await response.json();
      console.log("User login response:", data);
      
      if (response.ok) {
        // Token is now set automatically by the backend via HttpOnly Set-Cookie header
        // BUT for cross-domain middleware (Vercel + Render), we also set a local cookie
        if (data.token) {
          document.cookie = `user_token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax; Secure`;
          console.log("Cookie set attempt:", document.cookie);
        }
        
        // Save user basic info to localStorage for UI profile display
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        showToast("Welcome back!");
        // Use window.location.href for full reload to ensure middleware sees the cookie
        window.location.href = '/'; 
      } else {
        showToast(data.message || "Invalid credentials", 'error');
      }
    } catch (err) {
      console.error("Login error:", err);
      showToast("Failed to connect to the server.", 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-3 sm:px-4 py-8 sm:py-12">
      <div className="max-w-md w-full space-y-6 sm:space-y-8 bg-white p-6 sm:p-10 rounded-2xl shadow-xl border border-gray-100">
        
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-[#9AD872] rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8-0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Login to your TN Muslim Matrimony account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-[#9AD872] focus:border-[#9AD872] focus:z-10 sm:text-sm"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-[#9AD872] focus:border-[#9AD872] focus:z-10 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#9AD872] focus:ring-[#9AD872] border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link href="/forgot-password" title='forgot password' className="font-medium text-[#9AD872] hover:text-[#8bc764]">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white shadow-md transition-all transform active:scale-95 ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#9AD872] hover:bg-[#8bc764] hover:scale-[1.01]'
              }`}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="font-bold text-[#9AD872] hover:text-[#8bc764]">
              Register for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}