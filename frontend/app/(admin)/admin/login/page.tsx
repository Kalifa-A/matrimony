"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useToast } from '@/app/components/ToastProvider';

export default function AdminLogin() {
  const { showToast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      
      if (res.ok) {
        if (data.token) {
          localStorage.setItem('admin_token', data.token);
        }

        showToast('Access Granted. Welcome, Admin.');
        router.push('/admin');
      } else {
        showToast(data.message || 'Login failed', 'error');
      }
    } catch (err) {
      console.error('Login error:', err);
      showToast('Network Error. Is your backend running?', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#9AD872]/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl border border-white/10 z-10">
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-[#9AD872] to-emerald-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-[#9AD872]/20">
            <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7z" /></svg>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">System Admin</h1>
          <p className="text-sm text-gray-400 mt-2">Authorized personnel only.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9AD872]/50 focus:border-[#9AD872] transition-all"
              placeholder="admin"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9AD872]/50 focus:border-[#9AD872] transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 mt-4 rounded-2xl text-gray-900 font-black text-lg shadow-lg transition-all transform active:scale-95 ${loading ? 'bg-gray-500 cursor-wait' : 'bg-[#9AD872] hover:bg-[#8bc764] hover:shadow-[#9AD872]/20'}`}
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
      </div>
    </div>
  );
}