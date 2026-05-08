"use client";
import React from 'react';
import Link from 'next/link';

export default function SuccessStoriesPage() {
  const stories = [
    {
      couple: "Dr. Irfan & Sameera",
      location: "Coimbatore, Tamil Nadu",
      quote: "Finding a partner who shares the same cultural and religious values was hard until I found Al Fattah. Alhamdulillah, we are now happily married.",
      date: "October 2025"
    },
    {
      couple: "Rizwan & Ayesha",
      location: "Chennai, Tamil Nadu",
      quote: "The manual verification gave us peace of mind. We felt safe throughout the process of getting to know each other's families.",
      date: "January 2026"
    },
    {
      couple: "Faisal & Nilofar",
      location: "Madurai, Tamil Nadu",
      quote: "The interface is so clean and easy to use. It really helped us focus on what matters - our shared values and vision for the future.",
      date: "March 2026"
    }
  ];

  return (
    <main className="min-h-screen bg-[#FCFDFB]">
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-[#f2faf0] to-white">
        <div className="container mx-auto px-4 text-center">
          <span className="bg-[#9AD872]/10 text-[#7db55a] px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest mb-6 inline-block">
            Alhamdulillah
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
            Blessed <span className="text-[#9AD872]">Unions.</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Real stories from real couples who found their soulmates on Al Fattah Matrimony.
          </p>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {stories.map((story, i) => (
              <div key={i} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#9AD872]/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                <div className="text-[#9AD872] mb-6">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C20.1216 16 21.017 16.8954 21.017 18V21C21.017 22.1046 20.1216 23 19.017 23H16.017C14.9124 23 14.017 22.1046 14.017 21ZM14.017 21C14.017 14.462 16.542 9.25 21.017 7L19.517 4C14.017 7.5 11.017 12.5 11.017 19V21H14.017ZM3.017 21L3.017 18C3.017 16.8954 3.91243 16 5.017 16H8.017C9.12157 16 10.017 16.8954 10.017 18V21C10.017 22.1046 9.12157 23 8.017 23H5.017C3.91243 23 3.017 22.1046 3.017 21ZM3.017 21C3.017 14.462 5.542 9.25 10.017 7L8.517 4C3.017 7.5 0.017 12.5 0.017 19V21H3.017Z" /></svg>
                </div>
                <p className="text-xl font-serif italic text-gray-700 mb-8">"{story.quote}"</p>
                <div>
                  <h4 className="font-bold text-gray-900">{story.couple}</h4>
                  <p className="text-sm text-gray-400">{story.location}</p>
                  <p className="text-xs text-[#9AD872] mt-2 font-bold uppercase tracking-tighter">{story.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-[#9AD872] p-12 rounded-[4rem] text-white max-w-4xl mx-auto shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">Start your own story today</h2>
            <p className="mb-8 opacity-90">Join thousands of Tamil Muslim families who trust Al Fattah.</p>
            <Link href="/register" className="inline-block bg-white text-[#9AD872] px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-all">
              Register Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
