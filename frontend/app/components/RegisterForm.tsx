"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from '@/navigation';
import { useToast } from '@/app/components/ToastProvider';
import { useTranslations } from 'next-intl';

export default function RegisterForm() {
  const t = useTranslations('register');
  const { showToast } = useToast();
  const router = useRouter();

  // UI States
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [step, setStep] = useState<number>(1); // 1: Personal, 2: Professional, 3: Account

  // Location Suggestion States (Pincode API)
  const [pincodeSuggestions, setPincodeSuggestions] = useState<any[]>([]);
  const [fetchingPincode, setFetchingPincode] = useState(false);
  const [showPincodeSuggestions, setShowPincodeSuggestions] = useState(false);

  // Form data (shared across steps)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    maritalStatus: 'Single',
    gender: 'Male',
    // professional
    education: '',
    job: '',
    salary: '',
    assets: '',
    // contact & bio
    description: '',
    phone: '',
    location: '',
    // account
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Plan param from URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setPlan(params.get('plan'));
    }
  }, []);

  // Image URL cleanup
  useEffect(() => {
    return () => {
      if (selectedImage) URL.revokeObjectURL(selectedImage);
    };
  }, [selectedImage]);

  // Click outside handler for location suggestions picker
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const container = document.getElementById('location-picker-container');
      if (container && !container.contains(e.target as Node)) {
        setShowPincodeSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Helpers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'location') {
      // If user typed a 6-digit code, fetch suggestions from Postal Pincode API
      if (/^\d{6}$/.test(value)) {
        setFetchingPincode(true);
        setShowPincodeSuggestions(true);
        fetch(`https://api.postalpincode.in/pincode/${value}`)
          .then(res => res.json())
          .then(data => {
            if (data && data[0] && data[0].Status === 'Success') {
              setPincodeSuggestions(data[0].PostOffice || []);
            } else {
              setPincodeSuggestions([]);
            }
          })
          .catch(err => {
            console.error('Error fetching pincode details:', err);
            setPincodeSuggestions([]);
          })
          .finally(() => {
            setFetchingPincode(false);
          });
      } else {
        // If not a 6-digit code, hide suggestions if it doesn't look like we're typing a pincode
        if (!/^\d+$/.test(value)) {
          setShowPincodeSuggestions(false);
        }
      }
    }
  };

  const handleLocationFocus = () => {
    const value = formData.location;
    if (/^\d{6}$/.test(value)) {
      setShowPincodeSuggestions(true);
      if (pincodeSuggestions.length === 0) {
        setFetchingPincode(true);
        fetch(`https://api.postalpincode.in/pincode/${value}`)
          .then(res => res.json())
          .then(data => {
            if (data && data[0] && data[0].Status === 'Success') {
              setPincodeSuggestions(data[0].PostOffice || []);
            }
          })
          .catch(err => console.error(err))
          .finally(() => setFetchingPincode(false));
      }
    }
  };

  const handleSelectPincodeVillage = (postOffice: any) => {
    const fullLocation = `${postOffice.Name}, ${postOffice.District}, ${postOffice.State}`;
    setFormData({ ...formData, location: fullLocation });
    setShowPincodeSuggestions(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (selectedImage) URL.revokeObjectURL(selectedImage);
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const validateStep = (): boolean => {
    if (step === 1) {
      return !!formData.name && !!formData.age && !!formData.gender;
    }
    if (step === 2) {
      return !!formData.education && !!formData.job && !!formData.salary && !!formData.assets;
    }
    if (step === 3) {
      return (
        !!formData.email &&
        !!formData.password &&
        formData.password === formData.confirmPassword &&
        formData.password.length >= 8 &&
        /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
      );
    }
    return false;
  };

  const nextStep = () => {
    if (validateStep()) setStep(step + 1);
    else showToast('Please fill all required fields correctly before proceeding.', 'error');
  };

  const prevStep = () => setStep(step - 1);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'confirmPassword') dataToSend.append(key, value as string);
      });
      if (selectedFile) dataToSend.append('profilePhoto', selectedFile);

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        credentials: 'include',
        body: dataToSend,
      });
      const result = await response.json();
      if (response.ok) {
        showToast('Success! Bismillah, your profile is created.');
        if (plan === 'premium') router.push('/payment');
        else router.push('/login');
      } else {
        showToast(result.message || 'Registration failed', 'error');
      }
    } catch (err) {
      console.error('Network Error:', err);
      showToast('Server connection failed. Is your backend running?', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Styled Focus Rings depending on active plan context
  const primaryFocusRing = plan === 'premium' 
    ? 'focus:border-[#D4AF37] focus:ring-[#D4AF37]/20' 
    : 'focus:border-[#9AD872] focus:ring-[#9AD872]/20';

  // Input Field Class Generator
  const inputClass = `w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl outline-none text-gray-800 placeholder-gray-400 transition-all duration-200 focus:bg-white focus:shadow-sm ${primaryFocusRing}`;

  // Step-by-step Header and Icon bar
  const ProgressBar = () => (
    <div className="relative flex justify-between max-w-md mx-auto mb-10">
      {/* Background Track Line */}
      <div className="absolute top-5 left-4 right-4 h-0.5 bg-gray-100 -z-10" />
      
      {/* Active Track Line Fill */}
      <div 
        className={`absolute top-5 left-4 h-0.5 transition-all duration-500 ease-out -z-10 ${plan === 'premium' ? 'bg-[#D4AF37]' : 'bg-[#9AD872]'}`}
        style={{ width: `${((step - 1) / 2) * 92}%` }}
      />

      {[1, 2, 3].map((i) => {
        const isCompleted = step > i;
        const isActive = step === i;
        
        let stepColorClass = 'border-gray-200 bg-white text-gray-400';
        if (isCompleted || isActive) {
          stepColorClass = plan === 'premium' 
            ? 'border-[#D4AF37] bg-[#D4AF37] text-white shadow-md shadow-[#D4AF37]/20' 
            : 'border-[#9AD872] bg-[#9AD872] text-white shadow-md shadow-[#9AD872]/20';
        }
        if (isActive && !isCompleted) {
          stepColorClass = plan === 'premium'
            ? 'border-[#D4AF37] bg-white text-[#B38728] ring-4 ring-[#BF953F]/10 font-bold'
            : 'border-[#9AD872] bg-white text-[#8bc664] ring-4 ring-[#9AD872]/10 font-bold';
        }

        return (
          <div key={i} className="flex flex-col items-center flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${stepColorClass}`}>
              {isCompleted ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 111.414-1.414L8.414 12.172l7.879-7.879a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <span className="text-sm font-medium">{i}</span>
              )}
            </div>
            <span className={`mt-2.5 text-xs tracking-wide uppercase font-semibold transition-colors duration-300 ${isActive ? 'text-gray-800 font-bold' : 'text-gray-400'}`}>
              {i === 1 ? 'Personal' : i === 2 ? 'Professional' : 'Account'}
            </span>
          </div>
        );
      })}
    </div>
  );

  const renderStep = () => {
    const accentLine = plan === 'premium' ? 'border-[#D4AF37]' : 'border-[#9AD872]';

    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-fadeIn">
            {/* Photo Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <div className={`w-32 h-32 sm:w-36 sm:h-36 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50/50 transition-all duration-200 group-hover:border-current ${plan === 'premium' ? 'text-[#D4AF37]' : 'text-[#9AD872]'}`}>
                  {selectedImage ? (
                    <img src={selectedImage} alt="Preview" className="w-full h-full object-cover animate-scaleIn" />
                  ) : (
                    <div className="text-center p-4 flex flex-col items-center gap-1.5">
                      <svg className="w-6 h-6 text-gray-400 group-hover:text-current transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-[11px] text-gray-400 font-bold tracking-wider uppercase group-hover:text-gray-600 transition-colors">{t('image')}</p>
                    </div>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                {selectedImage && (
                  <button
                    type="button"
                    onClick={() => { setSelectedImage(null); setSelectedFile(null); }}
                    className="absolute -top-2.5 -right-2.5 bg-red-500 text-white p-1.5 rounded-xl hover:bg-red-600 shadow-md transition-colors z-20"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Personal Details */}
            <div className="space-y-5">
              <h3 className={`text-base font-bold uppercase tracking-wider text-gray-800 border-l-4 ${accentLine} pl-3`}>Personal Details</h3>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">{t('name')}</label>
                <input name="name" type="text" value={formData.name} onChange={handleChange} required className={inputClass} placeholder={t('name')} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">{t('age')}</label>
                  <input name="age" type="number" value={formData.age} onChange={handleChange} required className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Gender</label>
                  <div className="relative">
                    <select name="gender" value={formData.gender} onChange={handleChange} className={`${inputClass} appearance-none pr-10`}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-5 animate-fadeIn">
            <h3 className={`text-base font-bold uppercase tracking-wider text-gray-800 border-l-4 ${accentLine} pl-3`}>Professional Profile</h3>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">{t('education')}</label>
              <input name="education" type="text" value={formData.education} onChange={handleChange} required className={inputClass} placeholder="M.B.B.S, B.E, etc." />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">{t('occupation')}</label>
              <input name="job" type="text" value={formData.job} onChange={handleChange} required className={inputClass} placeholder="Software Engineer" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">{t('salary')}</label>
              <input name="salary" type="text" value={formData.salary} onChange={handleChange} required className={inputClass} placeholder="₹70,000" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Assets</label>
              <input name="assets" type="text" value={formData.assets} onChange={handleChange} required className={inputClass} placeholder="Land, Gold, etc." />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-5">
              <h3 className={`text-base font-bold uppercase tracking-wider text-gray-800 border-l-4 ${accentLine} pl-3`}>Contact & Bio</h3>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">About Me</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className={`${inputClass} resize-none`} placeholder={t('bio')} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Phone Number</label>
                  <input name="phone" type="tel" value={formData.phone} onChange={handleChange} required className={inputClass} placeholder={t('phone')} />
                </div>
                <div className="space-y-1.5 relative" id="location-picker-container">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Location / Pincode</label>
                  <div className="relative">
                    <input 
                      name="location" 
                      type="text" 
                      value={formData.location} 
                      onChange={handleChange} 
                      onFocus={handleLocationFocus}
                      required 
                      className={inputClass} 
                      placeholder="Enter 6-digit Pincode (e.g. 621108)"
                      autoComplete="off"
                    />
                    {formData.location && (
                      <button 
                        type="button" 
                        onClick={() => {
                          setFormData({ ...formData, location: '' });
                          setPincodeSuggestions([]);
                          setShowPincodeSuggestions(false);
                        }} 
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                        title="Clear Location"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Suggestions Dropdown */}
                  {showPincodeSuggestions && (
                    <div className="absolute left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="p-2">
                        <div className="px-3 py-1.5 text-[10px] font-black uppercase text-gray-400 tracking-wider">
                          Select Village / Post Office
                        </div>
                        {fetchingPincode ? (
                          <div className="px-3 py-3 text-xs text-gray-500 flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4 text-[#9AD872]" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Searching villages for pincode...
                          </div>
                        ) : pincodeSuggestions.length === 0 ? (
                          <div className="px-3 py-3 text-xs text-gray-400 italic">No villages found. Type a 6-digit Pincode.</div>
                        ) : (
                          pincodeSuggestions.map((postOffice, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSelectPincodeVillage(postOffice)}
                              className="w-full text-left px-3 py-2.5 hover:bg-gray-50 rounded-xl text-sm font-semibold text-gray-700 transition-colors flex items-center justify-between group"
                            >
                              <div className="flex flex-col">
                                <span className="font-bold text-gray-800">{postOffice.Name}</span>
                                <span className="text-[10px] text-gray-400 font-semibold">{postOffice.District}, {postOffice.State}</span>
                              </div>
                              <svg className="w-4 h-4 text-gray-300 group-hover:text-[#9AD872] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 space-y-5">
              <h3 className={`text-base font-bold uppercase tracking-wider text-gray-800 border-l-4 ${accentLine} pl-3`}>Account Security</h3>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Email Address</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} required className={inputClass} placeholder={t('email')} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Password</label>
                  <input name="password" type="password" value={formData.password} onChange={handleChange} required className={inputClass} placeholder={t('password')} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Confirm Password</label>
                  <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required className={inputClass} placeholder={t('passwordConfirm')} />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen py-8 sm:py-16 px-4 transition-colors duration-500 ${plan === 'premium' ? 'bg-gradient-to-b from-[#BF953F]/5 to-transparent' : 'bg-gradient-to-b from-[#9AD872]/5 to-transparent'}`}>
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl shadow-gray-100/70 border border-gray-100/80 overflow-hidden">
        
        {/* Header Hero Area */}
        <div className={`p-6 sm:p-10 text-center text-white relative overflow-hidden transition-all duration-500 ${plan === 'premium' ? 'bg-gradient-to-br from-[#AA7C11] via-[#D4AF37] to-[#B38728]' : 'bg-gradient-to-br from-[#9AD872] to-[#7CB356]'}`}>
          {/* Subtle elegant design accents */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
          
          {plan === 'premium' && (
            <div className="inline-flex items-center gap-1.5 mb-3 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-yellow-100 border border-white/10 shadow-sm animate-pulse">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              Gold Path
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-sm">
            {plan === 'premium' ? 'Premium Registration' : 'Create Your Profile'}
          </h1>
          <p className="text-white/95 mt-2 text-xs sm:text-sm max-w-sm mx-auto font-medium leading-relaxed">
            {plan === 'premium' ? 'Bismillah. You are one step away from the Gold tier.' : 'Bismillah. Join the Matrimony community.'}
          </p>
        </div>

        {/* Content Body */}
        <form onSubmit={handleRegister} className="p-6 sm:p-10 space-y-8">
          <ProgressBar />
          
          <div className="min-h-[280px]">
            {renderStep()}
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between gap-4 pt-6 border-t border-gray-50">
            {step > 1 && (
              <button 
                type="button" 
                onClick={prevStep} 
                className="px-5 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 text-sm"
              >
                Back
              </button>
            )}
            
            {step < 3 ? (
              <button 
                type="button" 
                onClick={nextStep} 
                className={`ml-auto px-6 py-3 text-white font-bold rounded-xl shadow-md transition-all duration-150 text-sm active:scale-98 ${
                  plan === 'premium' 
                    ? 'bg-[#B38728] hover:bg-[#AA7C11] shadow-[#B38728]/10' 
                    : 'bg-[#9AD872] hover:bg-[#8bc664] shadow-[#9AD872]/10'
                }`}
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 sm:py-4 rounded-xl text-white font-bold text-base shadow-lg transition-all duration-200 transform active:scale-[0.99] flex items-center justify-center ${
                  loading
                    ? 'bg-gray-300 cursor-not-allowed shadow-none'
                    : plan === 'premium'
                    ? 'bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#B38728] hover:shadow-xl hover:shadow-[#BF953F]/20'
                    : 'bg-gradient-to-r from-[#9AD872] to-[#8bc664] hover:shadow-xl hover:shadow-[#9AD872]/20'
                }`}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : plan === 'premium' ? (
                  `${t('submit')} — ₹499`
                ) : (
                  t('submit')
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Embedded micro-animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { transform: scale(0.97); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-scaleIn { animation: scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}