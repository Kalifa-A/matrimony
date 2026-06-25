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
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-gray-950 via-slate-900 to-gray-900 text-white rounded-[2rem] p-6 sm:p-10 border border-gray-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#9AD872]/15 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9AD872]/15 border border-[#9AD872]/30 text-[#9AD872] text-[10px] font-black tracking-widest uppercase">
            Control Panel
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-white">
            Assalamu Alaikum, Admin
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-medium">
            Welcome to the Al Fattah Matrimony management console. Here is your dashboard overview.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3 rounded-2xl backdrop-blur-sm self-start md:self-auto">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
          <div className="text-left">
            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">System Status</p>
            <p className="text-xs font-bold text-white">Online & Operational</p>
          </div>
        </div>
      </div>

      {/* Alert for Pending Verifications */}
      {!loading && stats && stats.pendingVerifications > 0 && (
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-[2rem] p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-orange-500/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div className="text-left text-white">
              <h4 className="font-black uppercase tracking-wider text-xs">New Users Pending Verification</h4>
              <p className="text-xs text-white/90 font-medium">You have {stats.pendingVerifications} users waiting for call or payment verification.</p>
            </div>
          </div>
          <Link 
            href="/admin/verifications" 
            className="bg-white text-orange-600 px-6 py-3 rounded-2xl font-bold text-xs hover:bg-orange-50 transition-all shrink-0 shadow-sm"
          >
            Verify Now
          </Link>
        </div>
      )}

      {/* Quick Actions Shortcuts */}
      <div className="space-y-4">
        <h2 className="text-xs uppercase font-extrabold text-gray-400 tracking-widest text-left">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionCard 
            title="Verify Members" 
            desc="Review pending verifications"
            href="/admin/verifications"
            color="border-l-[#9AD872] hover:border-l-[#9AD872]/80"
            icon={<svg className="w-5 h-5 text-[#9AD872]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
          />
          <QuickActionCard 
            title="View Messages" 
            desc="Check client contact forms"
            href="/admin/messages"
            color="border-l-blue-500 hover:border-l-blue-600"
            icon={<svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>}
          />
          <QuickActionCard 
            title="Interests & Matches" 
            desc="See mutual user interactions"
            href="/admin/interests"
            color="border-l-rose-500 hover:border-l-rose-600"
            icon={<svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
          />
          <QuickActionCard 
            title="Admin Profile" 
            desc="Update account information"
            href="/admin/profile"
            color="border-l-purple-500 hover:border-l-purple-600"
            icon={<svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
          />
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="space-y-4">
        <h2 className="text-xs uppercase font-extrabold text-gray-400 tracking-widest text-left">Key Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatsCard 
            label="Total Users" 
            value={loading ? "..." : stats?.totalUsers.toLocaleString()} 
            theme="green"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
          />
          <StatsCard 
            label="Pending Verifications" 
            value={loading ? "..." : stats?.pendingVerifications} 
            warning={!!stats?.pendingVerifications && stats.pendingVerifications > 0} 
            theme="orange"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
          />
          <StatsCard 
            label="Total Interests" 
            value={loading ? "..." : stats?.totalInterests} 
            theme="rose"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
          />
          <StatsCard 
            label="Mutual Matches" 
            value={loading ? "..." : stats?.mutualMatches} 
            theme="pink"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
          />
          <StatsCard 
            label="Success Marriages" 
            value={loading ? "..." : stats?.successStories} 
            theme="purple"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.703 2.703 0 01-3 0 2.704 2.704 0 01-3 0 2.703 2.703 0 01-3 0 2.704 2.704 0 01-3 0 2.703 2.703 0 01-1.5-.454" /></svg>}
          />
          <StatsCard 
            label="New Messages" 
            value={loading ? "..." : stats?.unreadMessages} 
            warning={!!stats?.unreadMessages && stats.unreadMessages > 0}
            theme="blue"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>}
          />
          <StatsCard 
            label="Active Admins" 
            value={loading ? "..." : (stats?.activeAdmins ?? 0)} 
            theme="slate"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
          />
        </div>
      </div>

      {/* User Management Section Card */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-slate-100/40 overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="p-6 sm:p-8 border-b border-slate-100/80 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#9AD872]/15 text-[#5e9637] rounded-xl flex items-center justify-center border border-[#9AD872]/30 shadow-sm shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <div className="text-left">
              <h3 className="font-black text-gray-900 text-base uppercase tracking-tight leading-none">User Directory</h3>
              <p className="text-xs text-gray-400 font-medium mt-1">Verify community registrations and adjust user access</p>
            </div>
          </div>
          <Link 
            href="/admin/verifications" 
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#9AD872]/15 text-[#5e9637] hover:bg-[#9AD872]/25 rounded-2xl text-xs font-black tracking-tight transition-all border border-[#9AD872]/30 shadow-sm shadow-[#9AD872]/5 shrink-0"
          >
            <span>View All Verifications</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
        <div className="p-2 sm:p-4">
          <AdminUserTable simplifiedStatus={true} />
        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---

function QuickActionCard({ title, desc, href, icon, color }: any) {
  return (
    <Link 
      href={href} 
      className={`bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4 group border-l-4 ${color}`}
    >
      <div className="p-3 rounded-xl bg-gray-50 text-gray-500 group-hover:scale-110 transition-transform duration-300 shrink-0">
        {icon}
      </div>
      <div className="text-left">
        <h4 className="text-xs font-black text-gray-900 group-hover:text-[#9AD872] transition-colors">{title}</h4>
        <p className="text-[10px] text-gray-400 mt-0.5 font-medium leading-tight">{desc}</p>
      </div>
    </Link>
  );
}

function StatsCard({ label, value, warning, success, icon, theme }: any) {
  const colorClasses = {
    green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    pink: 'bg-pink-50 text-pink-600 border-pink-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    slate: 'bg-slate-50 text-slate-600 border-slate-100',
  }[theme as 'green'|'orange'|'rose'|'pink'|'purple'|'blue'|'slate'] || 'bg-gray-50 text-gray-500 border-gray-100';

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-between">
      <div className="space-y-1 text-left">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
        <h2 className={`text-3xl font-black ${warning ? 'text-orange-500' : success ? 'text-rose-500' : 'text-gray-900'}`}>{value}</h2>
      </div>
      <div className={`p-3 rounded-2xl border ${colorClasses} shadow-sm shrink-0`}>
        {icon}
      </div>
    </div>
  );
}