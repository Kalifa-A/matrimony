"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Flower2, Heart, Sparkles } from "lucide-react"; // Floral/Love icons
import { clearUserSession } from "@/app/actions/userAuthActions";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [user, setUser] = useState<{ name: string; _id?: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  if (pathname?.startsWith("/admin")) return null;

  useEffect(() => {
    const checkAuth = async () => {
      // Use the 'user' object in localStorage as a quick client-side hint
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
    // Listen for changes in other tabs
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [pathname]);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

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
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm overflow-hidden">
      {/* Subtle Background Petals (Visual decoration) */}
      <div className="absolute top-0 left-1/4 w-4 h-4 bg-[#9AD872]/10 rounded-full blur-sm animate-pulse"></div>
      <div className="absolute bottom-2 right-1/3 w-3 h-3 bg-pink-100 rounded-full blur-sm animate-bounce duration-[3000ms]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 sm:h-20 items-center">

          {/* Logo with Floral Icon */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="relative">
               <Flower2 className="text-[#9AD872] absolute -top-2 -left-2 opacity-40 rotate-12" size={16} />
               <Link href="/" className="text-xl sm:text-2xl font-black tracking-tight flex items-center">
                 <span className="text-[#9AD872]">AL</span>
                 <span className="text-gray-900 ml-1">FATTAH</span>
               </Link>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="group flex items-center gap-1 text-gray-600 hover:text-[#9AD872] font-semibold transition-all">
              <span>Home</span>
            </Link>
            <Link href="/search" className="group flex items-center gap-1 text-gray-600 hover:text-[#9AD872] font-semibold transition-all">
              <Heart size={14} className="opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all text-pink-400" />
              <span>Find Partners</span>
            </Link>

            {isLoggedIn === null ? (
              <div className="w-20 h-8 bg-gray-100 animate-pulse rounded-full"></div>
            ) : !isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-gray-600 font-bold hover:text-[#9AD872]">Login</Link>
                <Link href="/register" className="relative group bg-[#9AD872] text-white px-7 py-2.5 rounded-full font-black shadow-lg shadow-[#9AD872]/20 hover:shadow-xl transition-all flex items-center gap-2">
                  <span>Register Free</span>
                  <Sparkles size={16} className="animate-pulse" />
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/payment" className="text-gray-500 font-bold hover:text-[#9AD872] flex items-center gap-1">
                  <Flower2 size={14} /> Upgrade
                </Link>
                <Link href="/my-account" className="flex items-center gap-2 bg-gray-50 border border-[#9AD872]/20 px-4 py-2 rounded-2xl hover:bg-[#9AD872]/5 transition-all">
                  <div className="w-8 h-8 bg-[#9AD872] rounded-full flex items-center justify-center text-white font-bold shadow-md relative">
                    {userInitial}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-400 border-2 border-white rounded-full"></div>
                  </div>
                  <span className="text-sm font-black text-gray-700">{user?.name}</span>
                </Link>
                <button onClick={handleLogout} className="text-sm font-bold text-gray-400 hover:text-red-500 transition-colors">Logout</button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-2xl hover:bg-gray-100 transition-colors"
          >
            {menuOpen ? (
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-[#9AD872] rounded-full animate-ping"></div>
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-2xl rounded-b-[2rem] animate-in slide-in-from-top duration-300">
          <div className="px-4 py-6 space-y-2">
            <Link href="/" className="flex items-center justify-between px-5 py-4 rounded-2xl text-gray-700 font-bold hover:bg-[#9AD872]/10 transition-colors">
              Home <Flower2 size={18} className="text-[#9AD872] opacity-40" />
            </Link>
            <Link href="/search" className="flex items-center justify-between px-5 py-4 rounded-2xl text-gray-700 font-bold hover:bg-[#9AD872]/10 transition-colors">
              Find Partners <Heart size={18} className="text-pink-300" />
            </Link>
            <Link href="/payment" className="flex items-center justify-between px-5 py-4 rounded-2xl text-gray-700 font-bold hover:bg-[#9AD872]/10 transition-colors">
              Upgrade <Sparkles size={18} className="text-[#9AD872]" />
            </Link>
            {isLoggedIn === null ? (
              <div className="w-20 h-8 bg-gray-100 animate-pulse rounded-full mx-auto mt-4"></div>
            ) : !isLoggedIn ? (
              <div className="pt-2 space-y-3">
                <Link href="/login" className="flex items-center justify-center px-5 py-3 rounded-2xl text-gray-600 font-bold border border-gray-100">Login</Link>
                <Link href="/register" className="flex items-center justify-center bg-[#9AD872] text-white px-5 py-4 rounded-2xl font-black shadow-lg shadow-[#9AD872]/20 transition-all group mx-auto w-full max-w-[200px]">
                  <span>Register Free</span>
                  <Sparkles size={18} className="ml-2 animate-pulse" />
                </Link>
              </div>
            ) : (
              <div className="pt-4 space-y-3">
                <Link href="/my-account" className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-10 h-10 bg-[#9AD872] rounded-full flex items-center justify-center text-white text-lg font-black shadow-md">
                    {userInitial}
                  </div>
                  <div>
                    <p className="font-black text-gray-800 text-sm">{user?.name}</p>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">My Profile</p>
                  </div>
                </Link>
                <button onClick={handleLogout} className="w-full text-center py-4 rounded-2xl bg-gray-50 text-gray-400 font-bold">Logout</button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}