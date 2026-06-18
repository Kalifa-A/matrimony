"use client";

import React, { useState, useEffect } from "react";
import { Link } from "@/navigation";
import { getSeoData, PageSeo } from "@/lib/seo";
import { Heart, ShieldCheck, Users, Globe, ArrowRight, AlertCircle, Sparkles } from "lucide-react";

interface SeoLandingProps {
  pageKey: string;
}

export default function SeoLanding({ pageKey }: SeoLandingProps) {
  const [data, setData] = useState<PageSeo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const seoData = await getSeoData(pageKey);
        if (seoData) {
          setData(seoData);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [pageKey]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFDFB]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#9AD872] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Secure Environment...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFDFB] px-4">
        <div className="max-w-md w-full text-center p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-xl">
          <AlertCircle className="text-red-500 mx-auto mb-6" size={48} />
          <h2 className="text-2xl font-black text-gray-900 mb-2">Content Unavailable</h2>
          <p className="text-gray-500 mb-8">We encountered an issue loading the requested matrimonial information. Please try again or return home.</p>
          <Link href="/" className="inline-block bg-[#9AD872] text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-[#9AD872]/20 hover:-translate-y-0.5 transition-all">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // Helper to dynamically render Markdown body to clean JSX
  const renderMarkdown = (mdText: string) => {
    const lines = mdText.split("\n");
    return lines.map((line, idx) => {
      const trimmed = line.trim();

      if (trimmed.startsWith("## ")) {
        return (
          <h2 key={idx} className="text-2xl md:text-3.5xl font-black text-gray-900 mt-12 mb-6 leading-tight">
            {trimmed.replace("## ", "")}
          </h2>
        );
      }

      if (trimmed.startsWith("### ")) {
        return (
          <h3 key={idx} className="text-xl md:text-2.5xl font-bold text-gray-900 mt-8 mb-4 leading-tight">
            {trimmed.replace("### ", "")}
          </h3>
        );
      }

      if (trimmed.startsWith("* **") || trimmed.startsWith("- **")) {
        const cleanText = trimmed.replace(/^[*+-]\s+\*\*/, "").replace(/\*\*/, "");
        const parts = cleanText.split(":");
        return (
          <div key={idx} className="flex gap-3 text-gray-600 leading-relaxed mb-3">
            <span className="text-[#9AD872] font-black">•</span>
            <span>
              <strong>{parts[0]}:</strong>
              {parts.slice(1).join(":")}
            </span>
          </div>
        );
      }

      if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
        const cleanText = trimmed.replace(/^[*+-]\s+/, "");
        return (
          <div key={idx} className="flex gap-3 text-gray-600 leading-relaxed mb-3">
            <span className="text-[#9AD872] font-black">•</span>
            <span>{cleanText}</span>
          </div>
        );
      }

      // Render custom text with markdown links [text](url) -> standard links
      if (trimmed.includes("[") && trimmed.includes("](") && trimmed.includes(")")) {
        // Simple parser to extract link
        const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let match;
        const elements: React.ReactNode[] = [];
        let lastIdx = 0;

        while ((match = regex.exec(trimmed)) !== null) {
          const text = match[1];
          const url = match[2];
          const matchIndex = match.index;

          // add plain text before link
          if (matchIndex > lastIdx) {
            elements.push(<span key={`txt-${lastIdx}`}>{trimmed.substring(lastIdx, matchIndex)}</span>);
          }

          // add Link element
          elements.push(
            <Link key={`lnk-${matchIndex}`} href={url} className="text-[#9AD872] font-bold underline hover:text-[#8bc764] transition-colors mx-1">
              {text}
            </Link>
          );

          lastIdx = regex.lastIndex;
        }

        if (lastIdx < trimmed.length) {
          elements.push(<span key={`txt-${lastIdx}`}>{trimmed.substring(lastIdx)}</span>);
        }

        // Check if this is a CTA line (e.g. [Create Free Account](/register) | [Browse Profiles](/search))
        const isCtaLine = trimmed.includes("|") && elements.length > 0;
        if (isCtaLine) {
          return null; // Skip drawing inline markdown CTA buttons, since we render premium customized CTA cards below
        }

        return (
          <p key={idx} className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
            {elements}
          </p>
        );
      }

      if (trimmed === "") {
        return <div key={idx} className="h-4"></div>;
      }

      return (
        <p key={idx} className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
          {trimmed}
        </p>
      );
    });
  };

  // Predefine CTA mappings based on pageKey
  const getCtaConfig = () => {
    switch (pageKey) {
      case "bride_search":
        return {
          primaryText: "Search Brides",
          primaryUrl: "/search?gender=female",
          secondaryText: "Create Free Account",
          secondaryUrl: "/register"
        };
      case "groom_search":
        return {
          primaryText: "Search Grooms",
          primaryUrl: "/search?gender=male",
          secondaryText: "Create Free Account",
          secondaryUrl: "/register"
        };
      case "second_marriage":
        return {
          primaryText: "Browse Profiles",
          primaryUrl: "/search",
          secondaryText: "Register for Second Marriage",
          secondaryUrl: "/register"
        };
      case "tamil_nadu":
        return {
          primaryText: "Search TN Profiles",
          primaryUrl: "/search",
          secondaryText: "Create Free Account",
          secondaryUrl: "/register"
        };
      case "dubai":
        return {
          primaryText: "Search Dubai Profiles",
          primaryUrl: "/search",
          secondaryText: "Register Now",
          secondaryUrl: "/register"
        };
      default:
        return {
          primaryText: "Browse Profiles",
          primaryUrl: "/search",
          secondaryText: "Create Free Account",
          secondaryUrl: "/register"
        };
    }
  };

  const cta = getCtaConfig();

  return (
    <main className="w-full min-h-screen bg-[#FCFDFB]">
      {/* Dynamic JSON-LD FAQ Schema injection */}
      {data.faq_schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data.faq_schema) }}
        />
      )}

      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-20 overflow-hidden bg-gradient-to-br from-[#f2faf0] via-white to-white">
        <div className="absolute inset-0 z-0 opacity-10">
          <svg width="100%" height="100%">
            <pattern id="seo-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#9AD872" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#seo-grid)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10 max-w-5xl text-center">
          <span className="bg-[#9AD872]/10 text-[#7db55a] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-flex items-center gap-2 border border-[#9AD872]/20 shadow-sm shadow-[#9AD872]/5">
            <Sparkles size={14} /> 100% Halal Verified Matrimony
          </span>
          <h1 className="text-4xl md:text-6.5xl font-black text-gray-900 mb-6 leading-[1.15]">
            {data.h1}
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed mb-10">
            {data.seo_description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={cta.primaryUrl} className="bg-[#9AD872] text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-[#9AD872]/40 hover:-translate-y-0.5 transition-all text-center flex items-center justify-center gap-2">
              {cta.primaryText} <ArrowRight size={18} />
            </Link>
            <Link href={cta.secondaryUrl} className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold border border-gray-100 shadow-sm hover:bg-gray-50 transition-all text-center">
              {cta.secondaryText}
            </Link>
          </div>
        </div>
      </section>

      {/* 2. BODY CONTENT SECTION */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none text-gray-700">
            {renderMarkdown(data.content)}
          </div>
        </div>
      </section>

      {/* 3. CORE VALUES DIVIDER */}
      <section className="py-16 bg-[#f9fbf9] border-y border-gray-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 flex gap-4 items-start shadow-sm">
              <div className="bg-[#9AD872]/10 p-3 rounded-2xl text-[#9AD872] flex-shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg mb-1">100% Manual Vetting</h4>
                <p className="text-sm text-gray-400 leading-relaxed">Every account is fully checked by admins to avoid spam and fake profiles.</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 flex gap-4 items-start shadow-sm">
              <div className="bg-[#9AD872]/10 p-3 rounded-2xl text-[#9AD872] flex-shrink-0">
                <Globe size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg mb-1">Global Matrimony</h4>
                <p className="text-sm text-gray-400 leading-relaxed">Connect with verified brides and grooms globally, including GCC/Dubai.</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 flex gap-4 items-start shadow-sm">
              <div className="bg-[#9AD872]/10 p-3 rounded-2xl text-[#9AD872] flex-shrink-0">
                <Users size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg mb-1">Family Inclusions</h4>
                <p className="text-sm text-gray-400 leading-relaxed">We support parental involvement to facilitate a sharia-compliant union.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAQ ACCORDION SECTION */}
      {data.faqs && data.faqs.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-gray-900">Frequently Asked Questions</h2>
              <p className="text-gray-400 mt-2">Answers to common queries about our matrimonial matching.</p>
            </div>
            <div className="space-y-4">
              {data.faqs.map((faq, i) => (
                <FaqAccordionItem key={i} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. CALL TO ACTION CARD */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-gray-900 rounded-[3rem] p-10 md:p-16 text-center text-white relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="bg-[#9AD872]/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="text-[#9AD872] fill-[#9AD872]" size={32} />
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">Begin Your Halal Search Today</h2>
              <p className="text-gray-400 text-base md:text-lg mb-10 leading-relaxed">
                Connect with serious, practicing Tamil Muslims seeking marriage alliances. 
                Protect your modesty with custom privacy controls.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register" className="bg-[#9AD872] text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-[#9AD872]/30 hover:bg-[#8bc764] transition-all">
                  Create Free Account
                </Link>
                <Link href={cta.primaryUrl} className="bg-transparent text-white border border-gray-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all">
                  {cta.primaryText}
                </Link>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#9AD872]/5 rounded-full -mr-40 -mt-40 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#9AD872]/5 rounded-full -ml-30 -mb-30 blur-2xl"></div>
          </div>
        </div>
      </section>
    </main>
  );
}

function FaqAccordionItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:border-gray-200 transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-gray-50/50 transition-all"
      >
        <span className="font-bold text-gray-900 text-base md:text-lg leading-tight">{question}</span>
        <span className={`text-[#9AD872] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path d="M19 9l-7 7-7-7"></path>
          </svg>
        </span>
      </button>
      {isOpen && (
        <div className="px-8 pb-6 text-gray-500 text-sm md:text-base leading-relaxed border-t border-gray-50/20 pt-4 animate-in slide-in-from-top-2 duration-300">
          {answer}
        </div>
      )}
    </div>
  );
}
