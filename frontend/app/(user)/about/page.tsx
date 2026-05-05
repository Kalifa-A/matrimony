"use client";
import React from "react";
import { Heart, ShieldCheck, Users, Globe, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function About() {
  const stats = [
    { label: "Successful Matches", value: "2,000+" },
    { label: "Active Profiles", value: "15,000+" },
    { label: "Cities Covered", value: "50+" },
    { label: "Trust Score", value: "99%" },
  ];

  return (
    <main className="w-full min-h-screen bg-[#FCFDFB]">
      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <svg width="100%" height="100%">
            <pattern id="about-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#9AD872" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#about-pattern)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <span className="bg-[#9AD872]/10 text-[#7db55a] px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest mb-6 inline-block">
                Our Story & Vision
              </span>
              <h1 className="text-4xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
                Connecting Hearts with <span className="text-[#9AD872]">Trust.</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-xl leading-relaxed mb-8">
                Al Fattah Matrimony was founded on the principles of Islamic ethics and community trust. 
                We simplify the journey of finding "half your deen" while ensuring 100% privacy for every member.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register" className="bg-[#9AD872] text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-[#9AD872]/40 hover:-translate-y-1 transition-all">
                  Get Started Free
                </Link>
              </div>
            </div>

            {/* Hero Image Container */}
            <div className="relative h-[400px] lg:h-[550px]">
              <div className="absolute inset-0 bg-[#9AD872] rounded-[3rem] rotate-3 opacity-20 blur-2xl"></div>
              <div className="absolute inset-0 bg-white border-2 border-gray-50 rounded-[3rem] overflow-hidden shadow-2xl">
                {/* Using the generated hero image */}
                <img 
                  src="/chatgpt.png" 
                  alt="Islamic Partnership" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="py-12 -mt-16 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-50 text-center transform hover:-translate-y-2 transition-all">
                <p className="text-4xl font-black text-gray-900 mb-1">{stat.value}</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. DETAILED SECTIONS WITH IMAGES */}
      <section className="py-24 space-y-24">
        {/* Mission - Image Right */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <span className="text-[#9AD872] font-black uppercase tracking-widest text-sm mb-4 block">Our Mission</span>
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">Preserving Values in a Digital Age</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                In a world of fast-paced connections, Al Fattah Matrimony stands for depth and sincerity. 
                We believe that finding a life partner is a sacred journey that requires patience, 
                respect, and a commitment to shared values.
              </p>
              <ul className="space-y-4">
                {[
                  "Manual profile screening by community experts",
                  "Strict adherence to Islamic matrimonial ethics",
                  "Support for family-involved matchmaking"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                    <CheckCircle className="text-[#9AD872]" size={20} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 lg:order-2 relative h-[350px] md:h-[500px]">
              <div className="absolute inset-0 bg-gray-100 rounded-[3rem] -rotate-3"></div>
              <img src="/ab1.png" alt="Our Mission" className="absolute inset-0 w-full h-full object-cover rounded-[3rem] shadow-2xl relative z-10" />
            </div>
          </div>
        </div>

        {/* Community - Image Left */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-[350px] md:h-[500px]">
              <div className="absolute inset-0 bg-[#9AD872]/10 rounded-[3rem] rotate-3"></div>
              <img src="/ab2.png" alt="Our Community" className="absolute inset-0 w-full h-full object-cover rounded-[3rem] shadow-2xl relative z-10" />
            </div>
            <div>
              <span className="text-[#9AD872] font-black uppercase tracking-widest text-sm mb-4 block">Our Community</span>
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">A Trusted Space for Tamil Muslims</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                We are more than just a website; we are a community-driven initiative. 
                Our platform is specifically tailored to the cultural and linguistic nuances 
                of the Tamil Muslim community worldwide, ensuring you feel at home while searching for your partner.
              </p>
            </div>
          </div>
        </div>

        {/* Vision - Image Right */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <span className="text-[#9AD872] font-black uppercase tracking-widest text-sm mb-4 block">Our Vision</span>
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">The Future of Halal Matchmaking</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Our vision is to become the most trusted global platform for Halal matchmaking, 
                leveraging modern technology while staying rooted in our timeless traditions. 
                We aim to make the path to Nikkah accessible, safe, and blessed for everyone.
              </p>
            </div>
            <div className="order-1 lg:order-2 relative h-[350px] md:h-[500px]">
              <div className="absolute inset-0 bg-gray-100 rounded-[3rem] -rotate-3"></div>
              <img src="/ab3.png" alt="Our Vision" className="absolute inset-0 w-full h-full object-cover rounded-[3rem] shadow-2xl relative z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE VALUES */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">Built on Foundation of Trust</h2>
          <p className="text-gray-500">We prioritize the values that matter most to our community.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <ValueCard 
            icon={<ShieldCheck className="text-[#9AD872]" size={32} />}
            title="Halal Verification"
            desc="Every single profile is manually reviewed by our community team to ensure authenticity and serious intent."
          />
          <ValueCard 
            icon={<Globe className="text-[#9AD872]" size={32} />}
            title="Privacy First"
            desc="You have complete control over your visibility. Choose who can see your photos and contact details."
          />
          <ValueCard 
            icon={<Users className="text-[#9AD872]" size={32} />}
            title="Tamil Muslim Focus"
            desc="A dedicated space for the Tamil Muslim community, respecting our unique cultural and traditional nuances."
          />
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="py-24 container mx-auto px-4">
        <div className="bg-gray-900 rounded-[3rem] p-10 md:p-20 text-center text-white relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="bg-[#9AD872]/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart className="text-[#9AD872] fill-[#9AD872]" size={40} />
            </div>
            <h2 className="text-3xl md:text-6xl font-black mb-8 leading-tight">Start Your Blessed Journey Today</h2>
            <p className="text-gray-400 text-lg mb-12">
              Join thousands of families who have found their perfect match through our platform. 
              Your privacy is our amanah.
            </p>
            <Link href="/register" className="inline-block bg-[#9AD872] text-white px-12 py-5 rounded-2xl font-bold shadow-2xl shadow-[#9AD872]/30 hover:bg-[#8bc764] transition-all">
              Create Your Free Profile
            </Link>
          </div>
          
          {/* Background Decorative Element */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#9AD872]/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#9AD872]/5 rounded-full -ml-32 -mb-32 blur-2xl"></div>
        </div>
      </section>
    </main>
  );
}

function ValueCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 hover:border-[#9AD872]/30 transition-all group">
      <div className="bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}
