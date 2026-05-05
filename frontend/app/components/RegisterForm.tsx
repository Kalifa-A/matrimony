"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, } from 'next/navigation';
import { useToast } from '@/app/components/ToastProvider';
import { setUserSession } from '@/app/actions/userAuthActions';

export default function RegisterForm() {
  const { showToast } = useToast();
  const router = useRouter();

  // UI States
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [plan, setPlan] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setPlan(params.get("plan"));
    }
  }, []);

  // Safely get API URL with fallback for build time
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Form State Object
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    maritalStatus: 'Single',
    education: 'Nil',
    salary: 'Nil',
    assets: 'Nil',
    description: '',
    gender: 'Male',
    phone: '',
    location: '',
    email: '',
    job: 'Nil',
    password: '',
    confirmPassword: ''
  });

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  // Helper to update state dynamically
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Revoke old URL before creating a new one
      if (selectedImage) URL.revokeObjectURL(selectedImage);
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return showToast("Passwords do not match!", 'error');
    }
    if (formData.password.length < 8) {
      return showToast("Password must be at least 8 characters long.", 'error');
    }
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharRegex.test(formData.password)) {
      return showToast("Password must contain at least one special character.", 'error');
    }
    setLoading(true);
    try {
      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        // Don't send confirmPassword to backend - only password is needed
        if (key !== 'confirmPassword') {
          dataToSend.append(key, value);
        }
      });
      if (selectedFile) {
        dataToSend.append('profilePhoto', selectedFile);
      }
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        body: dataToSend,
        credentials: 'include',
      });
      const result = await response.json();
      if (response.ok) {
        // Set local cookie for middleware support
        if (result.token) {
          await setUserSession(result.token);
        }
        
        showToast("Success! Bismillah, your profile is created.");
        if (plan === 'premium') {
          window.location.href = '/payment';
        } else {
          window.location.href = '/login';
        }
      } else {
        showToast(result.message || "Registration failed", 'error');
      }
    } catch (err) {
      console.error("Network Error:", err);
      showToast("Server connection failed. Is your backend running?", 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-3 sm:px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

        {/* Header */}
        <div className="bg-[#9AD872] p-5 sm:p-8 text-center text-white">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Create Your Profile</h1>
          <p className="text-white/80 mt-1 sm:mt-2 text-sm sm:text-base">Bismillah. Join the Matrimony community.</p>
        </div>

        <form onSubmit={handleRegister} className="p-4 sm:p-8 space-y-6 sm:space-y-8">

          {/* Photo Section */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-2xl border-4 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50 group-hover:border-[#9AD872] transition-colors">
                {selectedImage ? (
                  <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Upload Photo</p>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              {selectedImage && (
                <button
                  type="button"
                  onClick={() => { setSelectedImage(null); setSelectedFile(null); }}
                  className="absolute -top-3 -right-3 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-5 sm:gap-y-6">
            {/* Section 1: Personal */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 border-l-4 border-[#9AD872] pl-3">Personal Details</h3>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-600">Full Name</label>
                <input name="name" type="text" value={formData.name} onChange={handleChange} required className="input-field" placeholder="Full Name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-600">Age</label>
                  <input name="age" type="number" value={formData.age} onChange={handleChange} required className="input-field" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-600">Status</label>
                  <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="input-field">
                    <option>Single</option>
                    <option>Divorced</option>
                    <option>Widowed</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-600">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="input-field">
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Professional */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 border-l-4 border-[#9AD872] pl-3">Professional</h3>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-600">Education</label>
                <input name="education" type="text" value={formData.education} onChange={handleChange} required className="input-field" placeholder="M.B.B.S, B.E, etc." />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-600">Job</label>
                <input name="job" type="text" value={formData.job} onChange={handleChange} required className="input-field" placeholder="Software Engineer" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-600">Monthly Salary</label>
                <input name="salary" type="text" value={formData.salary} onChange={handleChange} required className="input-field" placeholder="₹70,000" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-600">Assets</label>
                <input name="assets" type="text" value={formData.assets} onChange={handleChange} required className="input-field" placeholder="Land, Gold, etc." />
              </div>

            </div>
          </div>

          {/* Contact & Bio */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-l-4 border-[#9AD872] pl-3">Contact & Bio</h3>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="input-field" placeholder="Tell us about yourself..." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="phone" type="tel" value={formData.phone} onChange={handleChange} required className="input-field" placeholder="Phone Number" />
              <input name="location" type="text" value={formData.location} onChange={handleChange} required className="input-field" placeholder="City/District" />
            </div>
          </div>

          {/* Account Details */}
          <div className="pt-6 border-t border-gray-100 space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-l-4 border-[#9AD872] pl-3">Account</h3>
            <input name="email" type="email" value={formData.email} onChange={handleChange} required className="input-field" placeholder="Email Address" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="password" type="password" value={formData.password} onChange={handleChange} required className="input-field" placeholder="Password" />
              <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required className="input-field" placeholder="Confirm Password" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 sm:py-4 rounded-xl text-white font-bold text-base sm:text-lg shadow-lg transition-all transform active:scale-95 ${loading ? 'bg-gray-400' : 'bg-[#9AD872] hover:bg-[#8bc764] hover:shadow-[#9AD872]/40'}`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>

      <style jsx>{`
        .input-field {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          outline: none;
          transition: all 0.2s;
        }
        .input-field:focus {
          border-color: #9AD872;
          box-shadow: 0 0 0 2px rgba(154, 216, 114, 0.2);
        }
      `}</style>
    </div>
  );
}
