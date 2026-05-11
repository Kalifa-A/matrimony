"use client";
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useTranslations } from 'next-intl';

function ContactForm() {
  const t = useTranslations('Contact.form');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(t('success'));
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(t('error'));
      }
    } catch (err) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">{t('name')}</label>
          <input 
            type="text" 
            placeholder="John Doe" 
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#9AD872] transition-all" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">{t('email')}</label>
          <input 
            type="email" 
            placeholder="john@example.com" 
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#9AD872] transition-all" 
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 ml-1">{t('subject')}</label>
        <input 
          type="text" 
          placeholder="How can we help?" 
          required
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#9AD872] transition-all" 
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 ml-1">{t('message')}</label>
        <textarea 
          rows={4} 
          placeholder="Your message here..." 
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-[#9AD872] transition-all resize-none"
        ></textarea>
      </div>
      <button 
        type="submit"
        disabled={loading}
        className="w-full bg-[#9AD872] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#9AD872]/20 hover:bg-[#8bc764] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <>
            <span>{t('submit')}</span>
            <Send size={18} />
          </>
        )}
      </button>
    </form>
  );
}

export default function ContactPage() {
  const t = useTranslations('Contact');

  return (
    <main className="min-h-screen bg-[#FCFDFB]">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-[#f2faf0] to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#9AD872]/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="bg-[#9AD872]/10 text-[#7db55a] px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest mb-6 inline-block">
            {t('badge')}
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
            {t.rich('title', {
                  sukoon: (chunks) => <span className="text-[#9AD872]">{chunks}</span>,
                })}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            {t('description')}
          </p>
        </div>
      </section>

      {/* Contact Info Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ContactCard 
              icon={<Mail size={24} />} 
              title={t('cards.email.title')} 
              value="alfattahnikkah@gmail.com" 
              sub={t('cards.email.sub')}
              color="bg-emerald-50 text-emerald-600"
            />
            <ContactCard 
              icon={<Phone size={24} />} 
              title={t('cards.call.title')} 
              value="+91 8220121113" 
              sub={t('cards.call.sub')}
              color="bg-blue-50 text-blue-600"
            />
            <ContactCard 
              icon={<MapPin size={24} />} 
              title={t('cards.office.title')} 
              value="Trichy, Tamil Nadu" 
              sub={t('cards.office.sub')}
              color="bg-rose-50 text-rose-600"
            />
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-50 overflow-hidden flex flex-col md:flex-row">
            {/* Left: Branding/Info */}
            <div className="md:w-2/5 bg-[#1a2e1a] p-12 text-white relative">
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-6">{t('form.heading')}</h2>
                <p className="text-gray-400 mb-10">{t('form.sub')}</p>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><MessageSquare size={20} /></div>
                    <span className="font-medium">{t('features.chat')}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><Send size={20} /></div>
                    <span className="font-medium">{t('features.support')}</span>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#9AD872]/20 to-transparent"></div>
            </div>

            {/* Right: Actual Form */}
            <div className="md:w-3/5 p-12 bg-white">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ContactCard({ icon, title, value, sub, color }: { icon: React.ReactNode, title: string, value: string, sub: string, color: string }) {
  return (
    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all text-center">
      <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
        {icon}
      </div>
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">{title}</h3>
      <p className="text-xl font-black text-gray-900 mb-1">{value}</p>
      <p className="text-xs text-gray-500 font-medium">{sub}</p>
    </div>
  );
}
