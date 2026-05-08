"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Don't show footer on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-white border-t border-gray-100 pt-12 sm:pt-20 pb-8 sm:pb-10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-10 sm:mb-16">

          {/* 1. Brand Identity */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#9AD872] rounded-xl flex items-center justify-center text-white font-bold text-xl sm:text-2xl">A</div>
              <span className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Al <span className="text-[#9AD872]">Fattah</span>
              </span>
            </div>
            <p className="mt-4 sm:mt-6 text-gray-500 leading-relaxed text-sm">
              The most trusted Tamil Muslim matrimony platform. Helping you find your soulmate with dignity, privacy, and Islamic values.
            </p>
            <div className="flex gap-3 mt-5 sm:mt-8">
              <SocialIcon
                href="https://facebook.com/yourprofile"
                d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
              />
              <SocialIcon
                href="https://instagram.com/yourprofile"
                d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M2 9h4v12H2z M17.5 2h-11A4.5 4.5 0 0 0 2 6.5v11A4.5 4.5 0 0 0 6.5 22h11a4.5 4.5 0 0 0 4.5-4.5v-11A4.5 4.5 0 0 0 17.5 2z"
              />
              <SocialIcon
                href="https://wa.me/919876543210"
                d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
              />
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link href="/about" className="hover:text-[#9AD872] transition-colors">About Us</Link></li>
              <li><Link href="/services" className="hover:text-[#9AD872] transition-colors">Our Services</Link></li>
              <li><Link href="/success-stories" className="hover:text-[#9AD872] transition-colors">Success Stories</Link></li>
              <li><Link href="/blog" className="hover:text-[#9AD872] transition-colors">Matrimonial Tips</Link></li>
            </ul>
          </div>

          {/* 3. Support */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link href="/contact" className="hover:text-[#9AD872] transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-[#9AD872] transition-colors">Safety FAQ</Link></li>
              <li><Link href="/privacy" className="hover:text-[#9AD872] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#9AD872] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* 4. Contact Info */}
          <div className="bg-[#9AD872]/5 p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border border-[#9AD872]/10 col-span-2 md:col-span-1">
            <h4 className="font-bold text-gray-900 mb-3 sm:mb-4">Questions?</h4>
            <p className="text-sm text-gray-500 mb-4 sm:mb-6">Speak with our relationship managers today.</p>
            <Link href="tel:+91000000000" className="flex items-center gap-3 text-[#7db55a] font-bold">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              +91 8220121113
            </Link>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 sm:pt-10 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-6 text-center">
          <p className="text-gray-400 text-xs">
            © 2026 Al Fattah Matrimony. Built with ❤️ for the Tamil Muslim Community.
          </p>
          <div className="flex items-center gap-2 grayscale opacity-50">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Secure Payments via</span>
            <div className="flex gap-3 font-black text-gray-400 text-xs">UPI • VISA • STRIPE</div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ d, href }: { d: string; href: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-[#9AD872] hover:text-white hover:border-[#9AD872] hover:-translate-y-1 transition-all duration-300"
    >
      <svg
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={d} />
      </svg>
    </Link>
  );
}
