"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminUserTable from '@/app/components/AdminUserTable';
import { getDashboardStats, AdminStats } from '@/app/actions/adminActions';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to load admin stats:", err);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [router]);

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-4 sm:p-8">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-10 gap-4 sm:gap-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Assalamu Alaikum, Admin</h1>
            <p className="text-xs sm:text-sm text-gray-500">Here is what's happening today.</p>
          </div>
          <div className="flex items-center gap-4 self-end sm:self-auto">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#9AD872] flex items-center justify-center text-white font-bold text-sm sm:text-base">A</div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
          <StatsCard 
            label="Total Users" 
            value={loading ? "..." : stats?.totalUsers.toLocaleString()} 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
          />
          <StatsCard 
            label="Pending Verifications" 
            value={loading ? "..." : stats?.pendingVerifications} 
            warning={!!stats?.pendingVerifications && stats.pendingVerifications > 0} 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
          />
          <StatsCard 
            label="Total Interests" 
            value={loading ? "..." : stats?.totalInterests} 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
          />
          <StatsCard 
            label="Mutual Matches" 
            value={loading ? "..." : stats?.mutualMatches} 
            success 
            icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>}
          />
          <StatsCard 
            label="Total Marriages" 
            value={loading ? "..." : stats?.successStories} 
            success
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.703 2.703 0 01-3 0 2.704 2.704 0 01-3 0 2.703 2.703 0 01-3 0 2.704 2.704 0 01-3 0 2.703 2.703 0 01-1.5-.454M21 12.046c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.703 2.703 0 01-3 0 2.704 2.704 0 01-3 0 2.703 2.703 0 01-3 0 2.704 2.704 0 01-3 0 2.703 2.703 0 01-1.5-.454M21 8.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.703 2.703 0 01-3 0 2.704 2.704 0 01-3 0 2.703 2.703 0 01-3 0 2.704 2.704 0 01-3 0 2.703 2.703 0 01-1.5-.454" /></svg>}
          />
          <StatsCard 
            label="New Messages" 
            value={loading ? "..." : stats?.unreadMessages} 
            warning={!!stats?.unreadMessages && stats.unreadMessages > 0}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>}
          />
        </div>

        {/* Alert for Pending Verifications */}
        {!loading && stats && stats.pendingVerifications > 0 && (
          <div className="mb-8 bg-orange-50 border border-orange-100 rounded-[2rem] p-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div>
                <h4 className="font-black text-orange-900 uppercase tracking-tight">New Users Pending Verification</h4>
                <p className="text-sm text-orange-700/80">You have {stats.pendingVerifications} users waiting for call or payment verification.</p>
              </div>
            </div>
            <Link 
              href="/admin/verifications" 
              className="bg-orange-500 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
            >
              Verify Now
            </Link>
          </div>
        )}

        {/* User Management Table */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">User Management</h3>
            <Link href="/admin/verifications" className="text-xs font-bold text-[#9AD872] hover:underline">View All Verifications</Link>
          </div>
          <AdminUserTable simplifiedStatus={true} />
        </div>
      </main>
    </div>
  );
}

// --- Helper Components ---

function StatsCard({ label, value, warning, success, icon }: any) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-xl ${warning ? 'bg-orange-50 text-orange-500' : success ? 'bg-rose-50 text-rose-500' : 'bg-gray-50 text-gray-400'}`}>
          {icon}
        </div>
      </div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
      <div className="flex items-baseline gap-3 mt-1">
        <h2 className={`text-3xl font-black ${warning ? 'text-orange-500' : success ? 'text-rose-500' : 'text-gray-900'}`}>{value}</h2>
      </div>
    </div>
  );
}