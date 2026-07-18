"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  Heart, MapPin, GraduationCap, Briefcase, 
  Award, Info, ShieldCheck, Lock, Sparkles, Phone, Mail
} from 'lucide-react';
import { Link, useRouter } from '@/navigation';
import { useToast } from '@/app/components/ToastProvider';
import { useTranslations } from 'next-intl';

// Define the User Type for TypeScript safety
interface UserProfile {
  name: string;
  age: number;
  gender: string;
  education: string;
  salary: string;
  assets: string;
  description: string;
  phone: string;
  location: string;
  job: string;
  email: string;
  profilePhoto?: string;
  maritalStatus?: string;
  complexion?: string;
  height?: string;
  childrenCount?: number | string;
  community?: string;
}

export default function ProfileDetails() {
  const t = useTranslations('Profile');
  const { showToast } = useToast();
  const { id } = useParams(); // Gets the ID from the URL
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [interestSent, setInterestSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (id === 'my-account') {
          setProfile(null);
          setLoading(false);
          return;
        }

        // 1. Fetch Profile Details
        const profileRes = await fetch(`${API_URL}/api/auth/profile/${id}`, { credentials: 'include' });
        const profileData = await profileRes.json();
        if (profileRes.ok) {
          setProfile(profileData);
        }

        // 2. Check current user's payment status and if interest already sent
        const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        if (userData) {
          const loggedInUser = JSON.parse(userData);
          
          // Check payment status
          const meRes = await fetch(`${API_URL}/api/auth/me`, { credentials: 'include' });
          const meData = await meRes.json();
          if (meRes.ok) setHasPaid(meData.hasPaid);

          // Check interest status
          const interestRes = await fetch(`${API_URL}/api/interests/check/${loggedInUser._id}/${id}`, { credentials: 'include' });
          const interestData = await interestRes.json();
          if (interestData.sent) setInterestSent(true);
        }

      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProfileData();
  }, [id, API_URL]);

  const handleSendInterest = async () => {
    const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (!userData) {
      showToast("Please login to send interest", 'error');
      router.push('/login');
      return;
    }

    const loggedInUser = JSON.parse(userData);
    setSending(true);

    try {
      const res = await fetch(`${API_URL}/api/interests/send`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          senderId: loggedInUser._id,
          receiverId: id
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setInterestSent(true);
        showToast("Interest sent successfully!");
      } else {
        showToast(data.message || "Failed to send interest", 'error');
      }
    } catch (err) {
      console.error(err);
      showToast("Something went wrong", 'error');
    } finally {
      setSending(false);
    }
  };

  const handleUndoInterest = async () => {
    const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (!userData) return;

    const loggedInUser = JSON.parse(userData);
    setSending(true);

    try {
      const res = await fetch(`${API_URL}/api/interests/undo/${loggedInUser._id}/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await res.json();
      if (res.ok) {
        setInterestSent(false);
        showToast("Interest undone successfully!");
      } else {
        showToast(data.message || "Failed to undo interest", 'error');
      }
    } catch (err) {
      console.error(err);
      showToast("Something went wrong", 'error');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[#9AD872] font-bold">{t('loading')}</div>;
  
  if (id === 'my-account') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <p className="text-gray-700 text-lg">{t('sessionUpdate')}</p>
        <button 
          onClick={() => {
            localStorage.clear();
            router.push('/login');
          }}
          className="bg-[#9AD872] text-white px-6 py-2 rounded-xl font-bold"
        >
          {t('loginAgain')}
        </button>
      </div>
    );
  }

  if (!profile) return <div className="min-h-screen flex items-center justify-center">{t('notFound')}</div>;

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-20">
      <div className="max-w-7xl mx-auto pt-24 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- LEFT COLUMN: FLOATING IDENTITY CARD --- */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white rounded-[3rem] p-4 shadow-2xl shadow-gray-200/50 border border-gray-50 overflow-hidden">
                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-6 group flex items-center justify-center">
                  {profile.profilePhoto ? (
                    <>
                      <img 
                        src={profile.profilePhoto.startsWith('http') ? profile.profilePhoto : `${API_URL}/${profile.profilePhoto}`} 
                        alt={profile.name}
                        className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ${!hasPaid ? 'blur-3xl scale-110 grayscale' : ''}`}
                      />
                      {!hasPaid && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
                          <button 
                            onClick={() => router.push('/payment')}
                            className="bg-white text-gray-900 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
                          >
                            <Lock size={14} /> {t('unlockGallery')}
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg shadow-gray-200/50 mb-4 text-gray-400 group-hover:scale-110 transition-transform duration-500">
                        <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-white/80 border border-gray-100/50 px-4 py-2 rounded-full shadow-sm">
                        Photo Not Uploaded
                      </span>
                    </div>
                  )}
                </div>

                <div className="px-4 pb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-3xl font-black text-gray-900 tracking-tight">{profile.name}, {profile.age}</h1>
                      <div className="flex items-center gap-2 text-[#9AD872] mt-1">
                        <Sparkles size={14} />
                        <span className="text-sm font-bold uppercase tracking-widest">{profile.maritalStatus}</span>
                      </div>
                    </div>
                    <button 
                      onClick={interestSent ? handleUndoInterest : handleSendInterest}
                      disabled={sending}
                      className={`p-4 rounded-2xl transition-all ${interestSent ? 'bg-red-50 text-red-500 shadow-inner' : 'bg-[#9AD872]/10 text-[#9AD872] hover:bg-[#9AD872] hover:text-white'}`}
                    >
                      <Heart size={24} className={interestSent ? "fill-current" : ""} />
                    </button>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-3 text-gray-500">
                      <MapPin size={18} className="text-gray-300" />
                      <span className="text-sm font-medium">{profile.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-500">
                      <GraduationCap size={18} className="text-gray-300" />
                      <span className="text-sm font-medium">{profile.education}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Action Button for Mobile Sticky */}
              <button 
                onClick={interestSent ? handleUndoInterest : handleSendInterest}
                className={`w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl ${interestSent ? 'bg-red-100 text-red-400' : 'bg-gray-900 text-white hover:bg-[#9AD872]'}`}
              >
                {sending ? t('processing') : interestSent ? t('undoInterest') : t('sendInterest')}
              </button>
            </div>
          </div>

          {/* --- RIGHT COLUMN: DETAILED INFO --- */}
          <div className="flex-1 space-y-8">
            
            {/* ABOUT SECTION */}
            <section className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-gray-50 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Info size={120} />
               </div>
               <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                 <span className="w-1.5 h-8 bg-[#9AD872] rounded-full"></span>
                 {t('personalStory')}
               </h2>
               <p className="text-gray-600 text-lg leading-relaxed italic">
                 "{profile.description || "I am a person who values family and traditional roots while embracing modern professional growth. Seeking a partner who understands mutual respect and shared dreams."}"
               </p>
            </section>

            {/* INFO GRIDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Professional Box */}
              <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-gray-50">
                <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3">
                  <Briefcase className="text-[#9AD872]" size={20} />
                  {t('career')}
                </h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{t('role')}</p>
                    <p className="text-gray-800 font-bold">{profile.education}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{t('income')}</p>
                    <p className="text-gray-800 font-bold">{profile.salary || t('disclosedOnRequest')}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{t('assets')}</p>
                    <p className="text-gray-800 font-bold">{profile.assets || "Own House / Property"}</p>
                  </div>
                </div>
              </div>

              {/* Lifestyle Box */}
              <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-gray-50">
                <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3">
                  <Award className="text-[#9AD872]" size={20} />
                  {t('lifestyle')}
                </h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{t('complexionHeight')}</p>
                    <p className="text-gray-800 font-bold">{profile.complexion || "Fair"} • {profile.height || "5'6\""}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{t('nativePlace')}</p>
                    <p className="text-gray-800 font-bold">{profile.location}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Community</p>
                    <p className="text-gray-800 font-bold">{profile.community || "Tamil Muslim"}</p>
                  </div>
                  {profile.maritalStatus === 'Widowed' && (
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{t('childrenCount')}</p>
                      <p className="text-gray-800 font-bold">{profile.childrenCount ?? 0}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CONTACT CARD: PREMIUM GLASSMORPHISM */}
            <section className="relative rounded-[3rem] p-10 overflow-hidden bg-gray-900 text-white">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#9AD872]/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div>
                  <h2 className="text-3xl font-black mb-2 tracking-tight">{t('directContact')}</h2>
                  <p className="text-gray-400 text-sm font-medium">{t('contactSub')}</p>
                </div>

                <div className="w-full md:w-auto space-y-4">
                  {hasPaid ? (
                    <div className="space-y-3">
                      <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl flex items-center gap-4 border border-white/10">
                        <Phone size={20} className="text-[#9AD872]" />
                        <span className="font-bold tracking-widest">{profile.phone}</span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl flex items-center gap-4 border border-white/10">
                        <Mail size={20} className="text-[#9AD872]" />
                        <span className="font-bold text-sm">{profile.email}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 text-center">
                      <div className="flex justify-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-red-400 animate-ping"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#9AD872]">{t('premiumAccessOnly')}</span>
                      </div>
                      <p className="text-xs text-gray-400 mb-6 px-4">{t('subscribeToView')}</p>
                      <button 
                        onClick={() => router.push('/payment')}
                        className="w-full bg-[#9AD872] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-[#9AD872]/20 transition-all"
                      >
                        {t('upgradeNow')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}