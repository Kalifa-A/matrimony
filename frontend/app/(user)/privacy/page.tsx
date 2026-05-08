"use client";
import React from 'react';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#FCFDFB]">
      <section className="pt-32 pb-20 bg-gradient-to-b from-[#f2faf0] to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Privacy <span className="text-[#9AD872]">Policy.</span>
          </h1>
          <p className="text-gray-400 text-sm">Last updated: May 8, 2026</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white p-10 md:p-16 rounded-[3rem] border border-gray-100 shadow-sm prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Information We Collect</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              To provide our services, we collect information you provide directly to us when you create an account, such as your name, email address, phone number, and profile details including religious and cultural preferences.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">2. How We Use Your Information</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              We use the information to connect you with potential matches, verify account authenticity, and improve our services. Your contact information is never shared without your explicit consent (e.g., when you accept an interest).
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Data Security</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              We implement industry-standard security measures to protect your personal data from unauthorized access, disclosure, or alteration.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Your Controls</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              You can update your profile, change your privacy settings, or delete your account at any time through the "My Account" section.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
