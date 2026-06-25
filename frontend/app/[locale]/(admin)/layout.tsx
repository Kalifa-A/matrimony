"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearAdminSession, getAdminToken } from '@/app/actions/adminAuthActions';
import { Toaster } from 'react-hot-toast';
import { NotificationProvider, useAdminNotification } from '@/app/components/NotificationProvider';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  React.useEffect(() => {
    const checkAuth = async () => {
      const token = await getAdminToken();
      setIsAuthenticated(!!token);
      
      if (!token && !pathname.endsWith('/admin/login')) {
        router.push('/admin/login');
      }
    };
    checkAuth();
  }, [pathname, router]);

  const handleSignOut = async () => {
    await clearAdminSession();
    setIsAuthenticated(false);
    router.push('/admin/login');
  };

  const navigationGroups = [
    {
      title: 'General',
      items: [
        { label: 'Dashboard', href: '/admin', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
      ]
    },
    {
      title: 'Management',
      items: [
        { label: 'Verifications', href: '/admin/verifications', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
        { label: 'Interests & Matches', href: '/admin/interests', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
        { label: 'Messages', href: '/admin/messages', icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z' },
      ]
    },
    {
      title: 'Account',
      items: [
        { label: 'Admin Profile', href: '/admin/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
      ]
    }
  ];

  const isLoginPage = pathname.endsWith('/admin/login');

  if (isLoginPage) {
    return <div className="min-h-screen bg-gray-900 font-sans tracking-tight">{children}</div>;
  }

  if (isAuthenticated === null || isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9AD872]"></div>
      </div>
    );
  }

  return (
    <NotificationProvider>
      <div className="flex min-h-screen bg-white font-sans tracking-tight">
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <Link href="/admin" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
              <img src="/favicon.png" alt="Al Fattah Logo" className="w-8 h-8 object-contain" />
              <div className="flex flex-col">
                <span className="text-base font-black text-gray-900 tracking-tight leading-none">
                  Al <span className="text-[#9AD872]">Fattah</span>
                </span>
                <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">
                  Admin Portal
                </span>
              </div>
            </Link>
            <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-gray-400 p-1 hover:bg-gray-50 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
            {navigationGroups.map((group) => (
              <div key={group.title} className="space-y-1.5">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 block">
                  {group.title}
                </span>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = item.href === '/admin'
                      ? (pathname === '/admin' || pathname.endsWith('/admin') || pathname.endsWith('/admin/'))
                      : pathname.includes(item.href);
                    return (
                      <SidebarLink 
                        key={item.href}
                        item={item}
                        isActive={isActive}
                        onClick={() => setIsMobileMenuOpen(false)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="p-6 border-t border-gray-100 bg-gray-50/40">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#9AD872] to-[#7cb756] text-white flex items-center justify-center font-black shadow-sm text-sm">
                AF
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-xs font-black text-gray-800 truncate">Al Fattah Admin</p>
                <p className="text-[10px] text-gray-400 font-bold truncate">admin@alfattah.com</p>
              </div>
            </div>
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-100 hover:border-red-200 text-red-500 font-bold text-xs hover:bg-red-50/50 active:bg-red-50 transition-all duration-200 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </aside>

        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <div className="flex-1 lg:ml-72 flex flex-col">
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
              <HeaderBell />
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

          <main className="p-4 sm:p-8">
            <div className="animate-in fade-in duration-500">
              {children}
            </div>
          </main>
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#333',
              border: '1px solid #e5e7eb',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            },
          }}
        />
      </div>
    </NotificationProvider>
  );
}

function SidebarLink({ item, isActive, onClick }: { item: any, isActive: boolean, onClick: () => void }) {
  const { unread } = useAdminNotification();
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`group flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
        isActive 
        ? 'bg-gradient-to-r from-[#9AD872]/15 to-[#9AD872]/5 text-[#9AD872] border-l-4 border-[#9AD872] pl-2 shadow-sm' 
        : 'text-gray-400 hover:bg-gray-50/80 hover:text-gray-700 hover:translate-x-1 border-l-4 border-transparent pl-3'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <div className="relative">
          <svg className="w-5 h-5 transition-transform group-hover:scale-105 duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
          </svg>
        </div>
        <span>{item.label}</span>
      </div>
      
      {item.label === 'Messages' && unread > 0 && (
        <span className="bg-red-500 text-white rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-black tracking-tighter shadow-sm">
          {unread}
        </span>
      )}
    </Link>
  );
}

function HeaderBell() {
  const { unread } = useAdminNotification();
  return (
    <Link href="/admin/messages" className="p-2 sm:p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-[#9AD872] transition-colors relative">
       {unread > 0 && (
         <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold ring-2 ring-white">
           {unread}
         </span>
       )}
       <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
    </Link>
  );
}