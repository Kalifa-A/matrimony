"use client";
import React from 'react';
import Link from 'next/link';

// --- SVG Icons ---
const HeartIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9AD872" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
);

const ShieldIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9AD872" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
);

const StarIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9AD872" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);

const CheckCircle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9AD872" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);

export default function Home() {
  return (
    <main className="bg-[#FCFDFB] overflow-x-hidden">
      
      {/* 1. HERO SECTION (Video Background Intact) */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 z-0 opacity-10">
          <svg width="100%" height="100%"><pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#9AD872" /></pattern><rect width="100%" height="100%" fill="url(#pattern)" /></svg>
        </div>

        <div className="container mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
          <div className="text-left pt-8 lg:pt-0">
            <span className="bg-[#9AD872]/10 text-[#7db55a] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest">
              Trusted by 10k+ Families
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-gray-900 mt-4 sm:mt-6 leading-[1.1]">
              Find the <span className="text-[#9AD872]">Sukoon</span> <br />Your Heart Deserves.
            </h1>
            <p className="text-gray-600 text-base sm:text-lg mt-4 sm:mt-6 max-w-lg leading-relaxed">
              Al Fattah Nikkah simplifies the journey to completing half your deen with 100% privacy and verified Tamil Muslim profiles.
            </p>
            <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href="/register" className="bg-[#9AD872] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold shadow-xl shadow-[#9AD872]/40 hover:-translate-y-1 transition-all text-center">
                Start Free Registration
              </Link>
              <Link href="/about" className="bg-white text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold border border-gray-100 shadow-sm hover:bg-gray-50 transition-all text-center">
                How it Works
              </Link>
            </div>
          </div>

          {/* Video Container (Right Side) */}
          <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] mt-4 lg:mt-0">
            <div className="absolute inset-0 bg-[#9AD872] rounded-[2rem] sm:rounded-[4rem] rotate-3 opacity-20 animate-pulse"></div>
            <div className="absolute inset-0 bg-white border-2 border-gray-50 rounded-[2rem] sm:rounded-[4rem] overflow-hidden shadow-2xl">
              <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                <source src="wedding2.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="absolute -bottom-4 sm:-bottom-6 left-2 sm:-left-10 bg-white p-3 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-gray-50 flex items-center gap-3 sm:gap-4">
              <div className="bg-emerald-100 p-2 sm:p-3 rounded-xl sm:rounded-2xl">💍</div>
              <div>
                <p className="font-bold text-gray-900 text-sm sm:text-base">124 Matches</p>
                <p className="text-[10px] sm:text-xs text-gray-400">Successfully this month</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES SECTION */}
      <section className="py-12 sm:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-16 gap-3 sm:gap-6">
            <div className="max-w-xl">
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900">Our Nikkah Services</h2>
              <p className="text-gray-500 mt-2 sm:mt-4 text-sm sm:text-base">We combine technology with tradition to respect your family's values.</p>
            </div>
            <Link href="/services" className="text-[#9AD872] font-bold flex items-center gap-2 group text-sm sm:text-base">
              View all services <span className="group-hover:translate-x-2 transition-transform">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
            <ServiceCard icon={<HeartIcon />} title="Halal Matchmaking" desc="Verified profiles filtered by Deen, Education, and Location." />
            <ServiceCard icon={<ShieldIcon />} title="Privacy Guard" desc="Control who sees your photos and contact information." />
            <ServiceCard icon={<StarIcon />} title="Family Verified" desc="Manual verification of every profile to ensure zero fake accounts." />
          </div>
        </div>
      </section>

      {/* 3. BLESSED PATH SECTION (Uses Image: chatgpt.png) */}
      <section className="relative py-12 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-2 text-left">
            <span className="bg-[#9AD872]/10 text-[#7db55a] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 w-fit">
              <CheckCircle /> Verified Tamil Muslim Community
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-gray-900 mt-4 sm:mt-6 leading-tight">
              Walk the Blessed <span className="text-[#9AD872]">Path to Nikkah.</span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg mt-4 sm:mt-6 leading-relaxed">
              Find the perfect match who shares your deen and cultural values, verified by community trust.
            </p>
            <div className="mt-6 sm:mt-8">
              <Link href="/register" className="inline-block bg-[#9AD872] text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full font-bold shadow-lg hover:bg-[#8bc764] transition-all">
                Create Free Profile
              </Link>
            </div>
          </div>
          <div className="lg:col-span-3 relative h-[300px] sm:h-[450px] lg:h-[600px]">
            <div className="absolute inset-0 z-0 bg-[#9AD872] rounded-[2rem] sm:rounded-[4rem] rotate-3 opacity-15 blur-2xl scale-110"></div>
            <div className="absolute inset-0 z-10 bg-white border border-gray-100 rounded-[2rem] sm:rounded-[4rem] overflow-hidden shadow-2xl">
              <img src="chatgpt.png" alt="Couple walking" className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DIRECT CONNECTION SECTION (Uses Image: gemini.png) */}
      <section className="py-12 sm:py-24 relative bg-[#FCFDFB]">
        <div className="container mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-16 items-center">
          <div className="relative h-[300px] sm:h-[450px] md:h-[550px] order-2 md:order-1">
            <div className="absolute inset-0 z-0 bg-gray-100 rounded-[2rem] sm:rounded-[4rem] -rotate-3 opacity-80 blur-xl scale-105"></div>
            <div className="absolute inset-0 z-10 bg-white border border-gray-100 rounded-[2rem] sm:rounded-[4rem] overflow-hidden shadow-2xl">
              <img src="gemini.png" alt="Intimate couple" className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-4 sm:top-10 right-2 sm:-right-8 z-30 bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 flex items-center gap-2 sm:gap-4">
              <div className="bg-emerald-50/50 p-2 sm:p-3 rounded-full text-base sm:text-lg">❤️</div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-400">Interests Accepted</p>
                <p className="font-black text-lg sm:text-2xl text-emerald-900">2,145+</p>
              </div>
            </div>
          </div>
          <div className="text-left space-y-6 sm:space-y-8 order-1 md:order-2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-tight">
              A Direct Connection to your <span className="text-[#9AD872]">Destiny.</span>
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {["Pure & Halal Interactions", "Manual Community Screening", "Privacy Protection for Every Step", "Success Stories from Tamil Families"].map((text, i) => (
                <div key={i} className="flex items-center gap-3 sm:gap-4 text-gray-700">
                  <div className="bg-[#9AD872]/10 p-2 rounded-full flex-shrink-0"><CheckCircle /></div>
                  <span className="font-semibold text-sm sm:text-base">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. MEMBERSHIP PLANS SECTION */}
      <section className="py-12 sm:py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#9AD872]/10 rounded-full blur-3xl opacity-50"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Membership Plans</h2>
            <p className="text-gray-500 text-sm sm:text-base">Transparent pricing to help you find your perfect match.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12 max-w-5xl mx-auto items-center">
            {/* Starter */}
            <div className="bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all">
              <h3 className="text-base sm:text-lg font-bold text-gray-400 uppercase tracking-widest">Starter</h3>
              <p className="text-4xl sm:text-5xl font-black text-gray-900 mt-2">Free</p>
              <div className="space-y-3 sm:space-y-4 my-6 sm:my-8">
                <PlanFeature text="Create Detailed Profile" active={true} />
                <PlanFeature text="Browse Verified Members" active={true} />
                <PlanFeature text="View Contact Details" active={false} />
                <PlanFeature text="View Premium Profiles" active={false} />
              </div>
              <Link href="/register" className="block text-center py-3 sm:py-4 rounded-2xl border-2 border-gray-100 font-bold hover:border-[#9AD872] transition-all">Join Free</Link>
            </div>
            {/* Premium */}
            <div className="relative bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border-2 border-[#9AD872] shadow-2xl md:scale-105 mt-4 md:mt-0">
              <div className="absolute -top-4 sm:-top-5 left-1/2 -translate-x-1/2 bg-[#9AD872] text-white px-4 sm:px-6 py-1 rounded-full text-xs font-black">MOST BLESSED</div>
              <h3 className="text-base sm:text-lg font-bold text-[#7db55a] uppercase tracking-widest">Premium</h3>
              <p className="text-4xl sm:text-5xl font-black text-gray-900 mt-2">₹499</p>
              <div className="space-y-3 sm:space-y-4 my-6 sm:my-8">
                <PlanFeature text="Unlimited Profile Views" active={true} />
                <PlanFeature text="View Verified Phone Numbers" active={true} />
                <PlanFeature text="Halal Direct Chat Support" active={true} />
              </div>
              <Link href="/register?plan=premium" className="block text-center py-3 sm:py-4 rounded-2xl bg-[#9AD872] text-white font-bold shadow-lg hover:bg-[#8bc764]">Upgrade Now</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SUCCESS STORIES */}
      <section className="py-12 sm:py-24 bg-[#FCFDFB]">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-10 sm:mb-16">Blessed Unions</h2>
          <div className="bg-white p-6 sm:p-12 rounded-[2rem] sm:rounded-[4rem] shadow-sm border border-gray-50 max-w-3xl mx-auto relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#9AD872] p-4 rounded-2xl">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="white"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C20.1216 16 21.017 16.8954 21.017 18V21C21.017 22.1046 20.1216 23 19.017 23H16.017C14.9124 23 14.017 22.1046 14.017 21ZM14.017 21C14.017 14.462 16.542 9.25 21.017 7L19.517 4C14.017 7.5 11.017 12.5 11.017 19V21H14.017ZM3.017 21L3.017 18C3.017 16.8954 3.91243 16 5.017 16H8.017C9.12157 16 10.017 16.8954 10.017 18V21C10.017 22.1046 9.12157 23 8.017 23H5.017C3.91243 23 3.017 22.1046 3.017 21ZM3.017 21C3.017 14.462 5.542 9.25 10.017 7L8.517 4C3.017 7.5 0.017 12.5 0.017 19V21H3.017Z" /></svg>
            </div>
            <p className="text-2xl font-serif italic text-gray-700">
              "Finding a partner who shares the same cultural and religious values was hard until I found Al Fattah. Alhamdulillah, we are now happily married."
            </p>
            <div className="mt-8">
              <p className="font-bold text-gray-900">Dr. Irfan & Sameera</p>
              <p className="text-sm text-gray-400">Coimbatore, Tamil Nadu</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// --- Helper Components ---
function ServiceCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] bg-white border border-gray-100 hover:border-[#9AD872]/30 hover:shadow-2xl transition-all group flex sm:flex-col flex-row items-start gap-4 sm:gap-0">
      <div className="mb-0 sm:mb-6 group-hover:scale-110 transition-transform flex-shrink-0">{icon}</div>
      <div>
        <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-1 sm:mb-3">{title}</h3>
        <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function PlanFeature({ text, active }: { text: string, active: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${active ? 'text-gray-700' : 'text-gray-300'}`}>
      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${active ? 'bg-[#9AD872]/20' : 'bg-gray-100'}`}>
        {active ? (
          <svg className="w-3 h-3 text-[#7db55a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
        ) : (
          <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
        )}
      </div>
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}