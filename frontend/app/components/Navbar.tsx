"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Flower2, Heart, Sparkles, X, Menu, User, LogOut, ChevronRight } from "lucide-react"; 
import { clearUserSession } from "@/app/actions/userAuthActions";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [user, setUser] = useState<{ name: string; _id?: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  if (pathname?.startsWith("/admin")) return null;

  useEffect(() => {
    const checkAuth = async () => {
      const userHint = localStorage.getItem('user');
      if (!userHint) {
        setIsLoggedIn(false);
        setUser(null);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          credentials: 'include'
        });
        if (res.ok) {
          const data = await res.json();
          setIsLoggedIn(true);
          setUser(data);
        } else {
          localStorage.removeItem('user_token');
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (e) {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [pathname, API_URL]);

  // Close menu on navigation
  useEffect(() => { 
    setMenuOpen(false); 
  }, [pathname]);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    await clearUserSession();
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setMenuOpen(false);
    router.push("/login");
  };

  const userInitial = user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <nav ref={navRef} className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-[100] shadow-sm">
      {/* Subtle Background Petals (Visual decoration) */}
      <div className="absolute top-0 left-1/4 w-4 h-4 bg-[#9AD872]/10 rounded-full blur-sm animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-2 right-1/3 w-3 h-3 bg-pink-100 rounded-full blur-sm animate-bounce duration-[3000ms] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between h-16 sm:h-20 items-center">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="relative group">
               <Flower2 className="text-[#9AD872] absolute -top-3 -left-3 opacity-40 group-hover:rotate-45 transition-transform duration-500" size={20} />
               <Link href="/" className="text-xl sm:text-2xl font-black tracking-tight flex items-center">
                 <span className="text-[#9AD872]">AL</span>
                 <span className="text-gray-900 ml-1">FATTAH</span>
               </Link>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="group text-sm font-bold text-gray-600 hover:text-[#9AD872] transition-colors relative py-1">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#9AD872] transition-all group-hover:w-full"></span>
            </Link>
            <Link href="/about" className="group text-sm font-bold text-gray-600 hover:text-[#9AD872] transition-colors relative py-1">
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#9AD872] transition-all group-hover:w-full"></span>
            </Link>
            <Link href="/contact" className="group text-sm font-bold text-gray-600 hover:text-[#9AD872] transition-colors relative py-1">
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#9AD872] transition-all group-hover:w-full"></span>
            </Link>
            
            <Link href="/search" className="group flex items-center gap-1.5 text-sm font-bold text-gray-600 hover:text-[#9AD872] transition-all">
              <Heart size={14} className="text-pink-400 group-hover:scale-125 transition-transform" />
              <span>Find Partners</span>
            </Link>

            {isLoggedIn === null ? (
              <div className="w-24 h-9 bg-gray-100 animate-pulse rounded-full"></div>
            ) : !isLoggedIn ? (
              <div className="flex items-center gap-6">
                <Link href="/login" className="text-sm font-bold text-gray-600 hover:text-[#9AD872] transition-colors">Login</Link>
                <Link href="/register" className="bg-[#9AD872] text-white px-6 py-2.5 rounded-full font-black shadow-lg shadow-[#9AD872]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2">
                  <span>Register Free</span>
                  <Sparkles size={16} className="animate-pulse" />
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/payment" className="bg-gradient-to-r from-[#BF953F] to-[#B38728] text-white px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-wider shadow-lg shadow-[#BF953F]/20 hover:scale-105 transition-all flex items-center gap-1.5">
                  <Sparkles size={12} className="animate-pulse" /> Upgrade to Gold
                </Link>
                <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
                <Link href="/my-account" className="flex items-center gap-3 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full hover:bg-white hover:border-[#9AD872]/30 transition-all shadow-sm group">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#9AD872] to-[#88c55f] rounded-full flex items-center justify-center text-white font-bold shadow-sm relative overflow-hidden">
                    <span className="relative z-10">{userInitial}</span>
                    <div className="absolute inset-0 bg-white/20 group-hover:scale-150 transition-transform duration-500"></div>
                  </div>
                  <span className="text-xs font-black text-gray-700 max-w-[100px] truncate">{user?.name}</span>
                </Link>
                <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-gray-600 hover:text-[#9AD872] transition-colors"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-md z-[90] transition-opacity duration-300 md:hidden ${
          menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile Drawer */}
      <div className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-[95] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden flex flex-col ${
        menuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Top Header inside Drawer */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
           <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Navigation</span>
           <button onClick={() => setMenuOpen(false)} className="p-2 bg-gray-50 rounded-full">
             <X size={20} className="text-gray-500" />
           </button>
        </div>

        <div className="px-6 py-4 flex-1 overflow-y-auto">
          {/* User Profile Card */}
          {isLoggedIn && user ? (
            <div 
              className="mb-8 p-5 bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-100 shadow-sm transition-all duration-500 delay-100"
              style={{ opacity: menuOpen ? 1 : 0, transform: menuOpen ? 'translateY(0)' : 'translateY(20px)' }}
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 bg-gradient-to-br from-[#9AD872] to-[#88c55f] rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-[#9AD872]/20">
                  {userInitial}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-gray-900 text-base leading-tight truncate">{user.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="flex h-2 w-2 rounded-full bg-[#9AD872] animate-pulse"></span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Online Profile</span>
                  </div>
                </div>
              </div>
              <Link 
                href="/my-account" 
                className="flex items-center justify-between w-full py-3 px-4 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black active:scale-95 transition-all shadow-lg"
              >
                <span>Manage Profile</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          ) : (
             <div 
               className="mb-8 p-6 bg-[#9AD872]/5 rounded-3xl border border-[#9AD872]/10 text-center transition-all duration-500 delay-100"
               style={{ opacity: menuOpen ? 1 : 0, transform: menuOpen ? 'translateY(0)' : 'translateY(20px)' }}
             >
                <div className="w-12 h-12 bg-[#9AD872]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="text-[#9AD872]" size={24} />
                </div>
                <p className="text-sm font-black text-gray-800">Find Your Soulmate</p>
                <p className="text-[10px] text-gray-500 mt-1 font-medium">Join 10,000+ verified members today</p>
             </div>
          )}

          {/* Navigation Links */}
          <div className="space-y-1.5">
            {[
              { name: "Home", href: "/", icon: Flower2 },
              { name: "Find Partners", href: "/search", icon: Heart, color: "text-pink-500" },
              { name: "Membership Plans", href: "/payment", icon: Sparkles, color: "text-[#B38728]" },
              { name: "About Al Fattah", href: "/about", icon: User },
              { name: "Help & Support", href: "/contact", icon: Menu },
            ].map((item, idx) => (
              <Link 
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between p-4 rounded-2xl font-bold text-sm transition-all active:scale-[0.98] ${
                  pathname === item.href ? 'bg-[#9AD872]/10 text-[#9AD872]' : 'text-gray-600 hover:bg-gray-50'
                }`}
                style={{ 
                  opacity: menuOpen ? 1 : 0, 
                  transform: menuOpen ? 'translateX(0)' : 'translateX(10px)',
                  transition: `all 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + idx * 0.05}s`
                }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${pathname === item.href ? 'bg-[#9AD872] text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-[#9AD872]/20'}`}>
                    <item.icon size={20} className={pathname === item.href ? "text-white" : (item.color || "text-[#9AD872]")} />
                  </div>
                  <span className="tracking-tight">{item.name}</span>
                </div>
                <ChevronRight size={16} className={`transition-transform ${pathname === item.href ? 'text-[#9AD872]' : 'text-gray-300'}`} />
              </Link>
            ))}
          </div>

          {/* Auth Actions for Logged Out */}
          {!isLoggedIn && (
            <div 
              className="mt-8 space-y-3 transition-all duration-500 delay-[400ms]"
              style={{ opacity: menuOpen ? 1 : 0, transform: menuOpen ? 'translateY(0)' : 'translateY(20px)' }}
            >
              <Link 
                href="/register" 
                className="flex items-center justify-center gap-2 w-full py-4 bg-[#9AD872] text-white rounded-2xl font-black shadow-lg shadow-[#9AD872]/30 active:scale-95 transition-all"
              >
                Create Free Account <Sparkles size={18} />
              </Link>
              <Link 
                href="/login" 
                className="flex items-center justify-center w-full py-4 bg-white text-gray-700 rounded-2xl font-bold border border-gray-200 active:bg-gray-50 transition-all"
              >
                Login
              </Link>
            </div>
          )}
        </div>

        {/* Logout at Bottom */}
        {isLoggedIn && (
          <div 
            className="p-6 bg-gray-50/50 transition-all duration-500 delay-[500ms]"
            style={{ opacity: menuOpen ? 1 : 0, transform: menuOpen ? 'translateY(0)' : 'translateY(20px)' }}
          >
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center gap-3 w-full py-4 bg-white text-red-500 border border-red-100 rounded-2xl font-bold active:scale-95 transition-all shadow-sm hover:bg-red-50"
            >
              <LogOut size={20} />
              Logout from Account
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
