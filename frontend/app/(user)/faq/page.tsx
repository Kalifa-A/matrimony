"use client";
import React, { useState } from 'react';

export default function FAQPage() {
  const faqs = [
    {
      question: "Is Al Fattah Matrimony free to use?",
      answer: "Yes, basic registration and profile creation are free. You can browse profiles and express interest. However, premium features like viewing phone numbers and direct chat require a small membership fee."
    },
    {
      question: "How do you verify profiles?",
      answer: "We have a dedicated team that manually reviews every profile. We check social media presence, government ID (when provided), and contact details to ensure zero fake accounts."
    },
    {
      question: "Is my data private?",
      answer: "Absolutely. We use industry-standard encryption and never sell your data to third parties. You can also control who sees your photos and personal details through your privacy settings."
    },
    {
      question: "How do I contact potential matches?",
      answer: "Once you find a profile you like, you can send an interest. If they accept, and you have a premium membership, you can view their contact details or start a chat."
    }
  ];

  return (
    <main className="min-h-screen bg-[#FCFDFB]">
      <section className="pt-32 pb-20 bg-gradient-to-b from-[#f2faf0] to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
            Safety <span className="text-[#9AD872]">FAQ.</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about using Al Fattah Matrimony safely and effectively.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-gray-50 transition-all"
      >
        <span className="font-bold text-gray-900">{question}</span>
        <span className={`text-[#9AD872] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
           <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M19 9l-7 7-7-7"></path></svg>
        </span>
      </button>
      {isOpen && (
        <div className="px-8 pb-6 text-gray-500 text-sm leading-relaxed animate-in slide-in-from-top-2 duration-300">
          {answer}
        </div>
      )}
    </div>
  );
}
