"use client";
import React from 'react';
import Link from 'next/link';

const HeartIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9AD872" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
);

const ShieldIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9AD872" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
);

const UserCheckIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9AD872" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
);

const MessageSquareIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9AD872" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
);

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[#FCFDFB]">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-[#f2faf0] to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
            Services for your <span className="text-[#9AD872]">Halal Journey.</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            We provide a secure, private, and values-based environment to help Tamil Muslims find their life partners.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ServiceCard 
              icon={<HeartIcon />} 
              title="Verified Matchmaking" 
              desc="Every profile undergoes a manual verification process to ensure authenticity and serious intent."
            />
            <ServiceCard 
              icon={<ShieldIcon />} 
              title="Privacy Protection" 
              desc="Full control over your photos and personal details. Your privacy is our highest priority."
            />
            <ServiceCard 
              icon={<UserCheckIcon />} 
              title="Halal Interaction" 
              desc="Designed to encourage respectful and Islamic communication between families."
            />
            <ServiceCard 
              icon={<MessageSquareIcon />} 
              title="Expert Guidance" 
              desc="Our relationship managers are here to assist you in finding the right match for your deen."
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-[#1a2e1a] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready to find your match?</h2>
          <Link href="/register" className="inline-block bg-[#9AD872] text-white px-10 py-4 rounded-2xl font-bold shadow-xl hover:bg-[#8bc764] transition-all">
            Get Started for Free
          </Link>
        </div>
      </section>
    </main>
  );
}

function ServiceCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-10 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
      <div className="mb-6 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-500 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}
