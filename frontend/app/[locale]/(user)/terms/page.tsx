"use client";
import React from 'react';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#FCFDFB]">
      <section className="pt-32 pb-20 bg-gradient-to-b from-[#f2faf0] to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Terms of <span className="text-[#9AD872]">Service.</span>
          </h1>
          <p className="text-gray-400 text-sm">Last updated: May 8, 2026</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white p-10 md:p-16 rounded-[3rem] border border-gray-100 shadow-sm prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Eligibility</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              By using Al Fattah Matrimony, you represent that you are of legal marriageable age (18 for women, 21 for men in India) and are looking for a life partner for yourself or a family member.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">2. User Conduct</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Users must provide accurate information and respect other members. Any form of harassment, fraud, or misuse of the platform will lead to immediate account termination.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Membership & Payments</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Premium memberships are non-refundable. We reserve the right to change our pricing at any time.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Disclaimer</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              While we verify profiles, we recommend that users and families perform their own due diligence before making any decisions.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
