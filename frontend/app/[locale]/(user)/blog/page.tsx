"use client";
import React from 'react';
import Link from 'next/link';

export default function BlogPage() {
  const posts = [
    {
      title: "How to Create a Standout Matrimony Profile",
      excerpt: "Your profile is the first impression. Learn how to highlight your values and personality effectively.",
      category: "Tips",
      date: "May 1, 2026"
    },
    {
      title: "Understanding Halal Matchmaking in the Modern World",
      excerpt: "Technology can be a blessing when used with the right intentions. Discover how we balance both.",
      category: "Perspective",
      date: "April 25, 2026"
    },
    {
      title: "Questions to Ask Your Potential Life Partner",
      excerpt: "Important conversations to have before making a decision. Focus on Deen, family, and future goals.",
      category: "Advice",
      date: "April 15, 2026"
    }
  ];

  return (
    <main className="min-h-screen bg-[#FCFDFB]">
      <section className="pt-32 pb-20 bg-gradient-to-b from-[#f2faf0] to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
            Matrimonial <span className="text-[#9AD872]">Tips.</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Expert advice and insights to help you navigate your journey to Nikkah with confidence.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <div key={i} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col">
                <div className="h-48 bg-[#9AD872]/10 flex items-center justify-center">
                   <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#9AD872" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-[#9AD872] uppercase tracking-widest">{post.category}</span>
                    <span className="text-xs text-gray-400">{post.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{post.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">{post.excerpt}</p>
                  <div className="mt-auto">
                    <button className="text-[#9AD872] font-bold text-sm hover:underline">Read More →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
