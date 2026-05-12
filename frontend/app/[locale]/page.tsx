"use client";
import React from 'react';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

// --- SVG Icons ---
const HeartIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9AD872" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
);

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9AD872" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
);

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9AD872" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9AD872" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);

export default function Home() {
  const t = useTranslations('Home');

  return (
    <main className="bg-[#FCFDFB] overflow-x-hidden">

      {/* 1. HERO SECTION - Soft Mint Gradient */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-[#f2faf0] via-white to-white">
        <div className="absolute inset-0 z-0 opacity-10">
          <svg width="100%" height="100%"><pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#9AD872" /></pattern><rect width="100%" height="100%" fill="url(#pattern)" /></svg>
        </div>

        <div className="container mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
          <div className="text-left pt-8 lg:pt-0">
            <span className="bg-[#9AD872]/10 text-[#7db55a] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest flex items-center gap-2 w-fit border border-[#9AD872]/20 shadow-sm shadow-[#9AD872]/5">
              <CheckCircle className="w-3.5 h-3.5" />
              {t('hero.trusted')}
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-gray-900 mt-4 sm:mt-6 leading-[1.1]">
              {t.rich('hero.heading', {
                sukoon: (chunks) => <span className="text-[#9AD872]">{chunks}</span>,
                highlight: (chunks) => <span className="text-[#9AD872]">{chunks}</span>
              })}
            </h1>
            <p className="text-gray-600 text-base sm:text-lg mt-4 sm:mt-6 max-w-lg leading-relaxed">
              {t('hero.description')}
            </p>
            <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href="/register" className="bg-[#9AD872] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold shadow-xl shadow-[#9AD872]/40 hover:-translate-y-1 transition-all text-center">
                {t('hero.register')}
              </Link>
              <Link href="/about" className="bg-white text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold border border-gray-100 shadow-sm hover:bg-gray-50 transition-all text-center">
                {t('hero.howItWorks')}
              </Link>
            </div>
          </div>

          {/* Video Container (Right Side) */}
          <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] mt-4 lg:mt-0">
            <div className="absolute inset-0 bg-[#9AD872] rounded-[2rem] sm:rounded-[4rem] rotate-3 opacity-20 animate-pulse"></div>
            <div className="absolute inset-0 bg-white border-2 border-gray-50 rounded-[2rem] sm:rounded-[4rem] overflow-hidden shadow-2xl">
              <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                <source src="/wedding2.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="absolute -bottom-4 sm:-bottom-6 left-2 sm:-left-10 bg-white p-3 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-gray-50 flex items-center gap-3 sm:gap-4">
              <div className="bg-emerald-100 p-2 sm:p-3 rounded-xl sm:rounded-2xl">💍</div>
              <div>
                <p className="font-bold text-gray-900 text-sm sm:text-base">{t('hero.matches')}</p>
                <p className="text-[10px] sm:text-xs text-gray-400">{t('hero.successThisMonth')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES SECTION - Soft Mint Gradient with Decorative Accent */}
      <section className="py-12 sm:py-24 relative bg-gradient-to-br from-[#e8f7f1] via-[#f0fff8] to-[#e8f7f1]">
        {/* Subtle floating mint circle */}
        <div className="absolute -top-20 -right-10 w-48 h-48 bg-[#9AD872]/10 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-16 gap-3 sm:gap-6">
            <div className="max-w-xl">
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900">{t('services.heading')}</h2>
              <p className="text-gray-600 mt-2 sm:mt-4 text-sm sm:text-base">{t('services.description')}</p>
            </div>
            <Link href="/services" className="text-[#9AD872] font-bold flex items-center gap-2 group text-sm sm:text-base">
              {t('services.viewAll')} <span className="group-hover:translate-x-2 transition-transform">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
            <ServiceCard icon={<HeartIcon />} title={t('services.halal.title')} desc={t('services.halal.desc')} />
            <ServiceCard icon={<ShieldIcon />} title={t('services.privacy.title')} desc={t('services.privacy.desc')} />
            <ServiceCard icon={<StarIcon />} title={t('services.verified.title')} desc={t('services.verified.desc')} />
          </div>
        </div>
      </section>

      {/* 3. BLESSED PATH SECTION - Pure White */}
      <section className="relative py-12 sm:py-24 bg-gradient-to-r from-[#f9fbf9] via-[#ffffff] to-[#f9fbf9]">
        {/* Decorative floating circles */}
        <div className="absolute -top-16 -left-10 w-48 h-48 bg-[#9AD872]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-12 w-56 h-56 bg-[#9AD872]/5 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-2 text-left">
            <span className="bg-[#9AD872]/10 text-[#7db55a] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 w-fit border border-[#9AD872]/20 shadow-sm shadow-[#9AD872]/5">
              <CheckCircle className="w-3.5 h-3.5" /> {t('blessedPath.badge')}
            </span>
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-gray-900 mt-4 sm:mt-6 leading-tight">
              {t.rich('blessedPath.heading', {
                sukoon: (chunks) => <span className="text-[#9AD872]">{chunks}</span>,
                highlight: (chunks) => <span className="text-[#9AD872]">{chunks}</span>
              })}
            </h1>
            <p className="text-gray-600 text-base sm:text-lg mt-4 sm:mt-6 leading-relaxed">
              {t('blessedPath.description')}
            </p>
            <div className="mt-6 sm:mt-8">
              <Link href="/register" className="inline-block bg-[#9AD872] text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full font-bold shadow-lg hover:bg-[#8bc764] transition-all">
                {t('blessedPath.button')}
              </Link>
            </div>
          </div>
          <div className="lg:col-span-3 relative h-[300px] sm:h-[450px] lg:h-[600px]">
            {/* Subtle tinted overlay behind image */}
            <div className="absolute inset-0 bg-[#9AD872]/5 rounded-[2rem] sm:rounded-[4rem] rotate-3 blur-2xl"></div>
            <div className="absolute inset-0 bg-white border border-gray-100 rounded-[2rem] sm:rounded-[4rem] overflow-hidden shadow-2xl">
              <img src="/chatgpt.png" alt="Couple walking" className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DIRECT CONNECTION SECTION - Deepest Dark Green */}
      <section className="py-12 sm:py-24 relative bg-[#0a140a]">
        <div className="container mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-16 items-center">
          <div className="relative h-[300px] sm:h-[450px] md:h-[550px] order-2 md:order-1">
            <div className="absolute inset-0 z-0 bg-gray-100 rounded-[2rem] sm:rounded-[4rem] -rotate-3 opacity-80 blur-xl scale-105"></div>
            <div className="absolute inset-0 z-10 bg-white border border-gray-100 rounded-[2rem] sm:rounded-[4rem] overflow-hidden shadow-2xl">
              <img src="/gemini.png" alt="Intimate couple" className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-4 sm:top-10 right-2 sm:-right-8 z-30 bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 flex items-center gap-2 sm:gap-4">
              <div className="bg-emerald-50/50 p-2 sm:p-3 rounded-full text-base sm:text-lg">❤️</div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-400">{t('directConnection.accepted')}</p>
                <p className="font-black text-lg sm:text-2xl text-emerald-900">2,145+</p>
              </div>
            </div>
          </div>
          <div className="text-left space-y-6 sm:space-y-8 order-1 md:order-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
              {t.rich('directConnection.heading', {
                sukoon: (chunks) => <span className="text-[#9AD872]">{chunks}</span>,
                highlight: (chunks) => <span className="text-[#9AD872]">{chunks}</span>
              })}
            </h1> 
            <div className="space-y-3 sm:space-y-4">
              {[
                t('directConnection.features.halal'),
                t('directConnection.features.screening'),
                t('directConnection.features.privacy'),
                t('directConnection.features.stories')
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 sm:gap-4 text-gray-300">
                  <div className="bg-[#9AD872] p-1.5 rounded-full flex-shrink-0"><CheckCircle className="text-white w-4 h-4" /></div>
                  <span className="font-semibold text-sm sm:text-base">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. MEMBERSHIP PLANS SECTION - Premium Gold & Clean White */}
      <section className="py-12 sm:py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#9AD872]/5 rounded-full blur-3xl opacity-50"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">{t('membership.heading')}</h2>
            <p className="text-gray-500 text-sm sm:text-base">{t('membership.description')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12 max-w-5xl mx-auto items-center">
            {/* Starter Card - Calm & Clean */}
            <div className="bg-[#f9fbf9] p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9AD872" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-500 uppercase tracking-widest">{t('membership.starter.title')}</h3>
              </div>
              
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-black text-gray-900">{t('membership.starter.price')}</span>
                <span className="text-gray-400 font-medium text-sm">{t('membership.starter.duration')}</span>
              </div>

              <div className="space-y-3 sm:space-y-4 my-6 sm:my-8">
                <PlanFeature text={t('membership.starter.features.profile')} active={true} />
                <PlanFeature text={t('membership.starter.features.browse')} active={true} />
                <PlanFeature text={t('membership.starter.features.interest')} active={true} />
                <PlanFeature text={t('membership.starter.features.contact')} active={false} />
              </div>
              
              <Link href="/register" className="block text-center py-3 sm:py-4 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-white hover:border-[#9AD872] hover:text-[#9AD872] transition-all">
                {t('membership.starter.button')}
              </Link>
            </div>
            
            {/* Premium Gold Card with Glow Effect */}
            <div className="relative group md:scale-105 mt-4 md:mt-0">
              {/* Background Glow Animation */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] rounded-[2rem] sm:rounded-[3rem] blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500 animate-pulse"></div>
              
              <div className="relative p-[2px] rounded-[2rem] sm:rounded-[3rem] bg-gradient-to-br from-[#BF953F] via-[#FCF6BA] to-[#B38728] shadow-[0_0_40px_-10px_rgba(191,149,63,0.3)] transition-all duration-500 hover:shadow-[0_0_60px_-5px_rgba(191,149,63,0.5)]">
                <div className="bg-white p-6 sm:p-10 rounded-[calc(2rem-2px)] sm:rounded-[calc(3rem-2px)] relative overflow-hidden h-full">
                  {/* Decorative Gold Elements */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FCF6BA] opacity-30 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#BF953F] opacity-10 rounded-full blur-3xl"></div>

                  <div className="absolute -top-4 sm:-top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#BF953F] to-[#B38728] text-white px-5 sm:px-8 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg whitespace-nowrap">
                    {t('membership.premium.badge')}
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-base sm:text-lg font-black text-[#B38728] uppercase tracking-widest flex items-center gap-2">
                      {t('membership.premium.title')} <span className="w-2 h-2 rounded-full bg-[#B38728] animate-pulse"></span>
                    </h3>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-4xl sm:text-5xl font-black text-gray-900">{t('membership.premium.price')}</span>
                      <span className="text-gray-400 font-bold text-sm">{t('membership.premium.duration')}</span>
                    </div>
                    
                    <div className="space-y-3 sm:space-y-4 my-6 sm:my-8">
                      <PlanFeature text={t('membership.premium.features.views')} active={true} premium={true} />
                      <PlanFeature text={t('membership.premium.features.phone')} active={true} premium={true} />
                      <PlanFeature text={t('membership.premium.features.chat')} active={true} premium={true} />
                      <PlanFeature text={t('membership.premium.features.priority')} active={true} premium={true} />
                    </div>
                    
                    <Link href="/register?plan=premium" className="block text-center py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-[#BF953F] via-[#D4AF37] to-[#B38728] text-white font-black shadow-xl shadow-[#BF953F]/30 hover:opacity-90 transition-all active:scale-95">
                      {t('membership.premium.button')}
                    </Link>
                    <p className="text-[10px] text-center text-gray-400 mt-3 font-bold uppercase tracking-widest">{t('membership.premium.secure')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SUCCESS STORIES - Soft Greenish Mist */}
      <section className="py-12 sm:py-24 bg-[#f4f8f4] relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
           <svg width="100%" height="100%"><pattern id="success-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="#9AD872" opacity="0.2" /></pattern><rect width="100%" height="100%" fill="url(#success-pattern)" /></svg>
        </div>
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-10 sm:mb-16">{t('successStories.heading')}</h2>
          <div className="bg-white p-6 sm:p-12 rounded-[2rem] sm:rounded-[4rem] shadow-sm border border-gray-50 max-w-3xl mx-auto relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#9AD872] p-4 rounded-2xl">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="white"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C20.1216 16 21.017 16.8954 21.017 18V21C21.017 22.1046 20.1216 23 19.017 23H16.017C14.9124 23 14.017 22.1046 14.017 21ZM14.017 21C14.017 14.462 16.542 9.25 21.017 7L19.517 4C14.017 7.5 11.017 12.5 11.017 19V21H14.017ZM3.017 21L3.017 18C3.017 16.8954 3.91243 16 5.017 16H8.017C9.12157 16 10.017 16.8954 10.017 18V21C10.017 22.1046 9.12157 23 8.017 23H5.017C3.91243 23 3.017 22.1046 3.017 21ZM3.017 21C3.017 14.462 5.542 9.25 10.017 7L8.517 4C3.017 7.5 0.017 12.5 0.017 19V21H3.017Z" /></svg>
            </div>
            <p className="text-2xl font-serif italic text-gray-700">
              "{t('successStories.quote')}"
            </p>
            <div className="mt-8">
              <p className="font-bold text-gray-900">{t('successStories.couple')}</p>
              <p className="text-sm text-gray-400">{t('successStories.location')}</p>
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

function PlanFeature({ text, active, premium }: { text: string, active: boolean, premium?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${active ? 'text-gray-700 font-semibold' : 'text-gray-300'}`}>
      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
        active 
          ? (premium ? 'bg-[#FCF6BA]' : 'bg-[#9AD872]/20') 
          : 'bg-gray-100'
      }`}>
        {active ? (
          <svg className={`w-3 h-3 ${premium ? 'text-[#B38728]' : 'text-[#7db55a]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </div>
      <span className="text-sm">{text}</span>
    </div>
  );
}