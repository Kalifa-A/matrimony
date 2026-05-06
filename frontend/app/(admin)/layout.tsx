"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearAdminSession } from '@/app/actions/adminAuthActions';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await clearAdminSession();
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  // Define your navigation links here
  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { label: 'Verifications', href: '/admin/verifications', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { label: 'Interests & Matches', href: '/admin/interests', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { label: 'Admin Profile', href: '/admin/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <div className="min-h-screen bg-gray-900">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="p-8 flex justify-between items-center">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#9AD872] rounded-lg"></div>
            <span className="text-xl font-black text-gray-900 tracking-tight">Fattah Admin</span>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${
                  isActive 
                  ? 'bg-[#9AD872] text-white shadow-lg shadow-[#9AD872]/20' 
                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-gray-50">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400 font-bold text-sm hover:bg-red-50 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 lg:ml-72 flex flex-col">
        
        {/* Top Header / Search Bar */}
        <header className="h-16 sm:h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:bg-gray-50 rounded-xl"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="relative w-48 sm:w-96 hidden md:block">
              <input 
                type="text" 
                placeholder="Search..."
                className="w-full bg-gray-50 border-none rounded-2xl py-2 sm:py-2.5 pl-10 sm:pl-11 pr-4 text-sm focus:ring-2 focus:ring-[#9AD872]/20 transition-all"
              />
              <svg className="absolute left-4 top-2.5 sm:top-3 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 sm:p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-[#9AD872] transition-colors relative">
               <div className="absolute top-2.5 right-3 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-red-500 rounded-full border-2 border-white"></div>
               <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </button>
            <div className="h-8 w-[1px] bg-gray-100 mx-1 sm:mx-2"></div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] sm:text-xs font-black text-gray-900">Admin Panel</p>
                <p className="text-[9px] sm:text-[10px] text-[#9AD872] font-bold">Online</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center font-bold text-[10px] sm:text-xs shadow-lg shadow-gray-200">
                AF
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="p-4 sm:p-8">
          <div className="animate-in fade-in duration-500">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}