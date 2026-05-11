"use client";
import React, { useState, useEffect } from 'react';
import { getAdminProfile, updateAdminProfile, AdminProfile } from '@/app/actions/adminActions';

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getAdminProfile();
        setProfile(data);
        setUsername(data.username);
        setEmail(data.email);
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (password && password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setUpdating(true);
    try {
      const updateData: any = { username, email };
      if (password) updateData.password = password;

      await updateAdminProfile(updateData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9AD872]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Admin Profile</h1>
        <p className="text-gray-500 text-sm">Manage your administrative credentials and security settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm text-center">
            <div className="w-24 h-24 bg-gray-900 rounded-[2rem] mx-auto flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-gray-200 mb-4">
              {profile?.username?.[0].toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{profile?.username}</h2>
            <p className="text-xs font-bold text-[#9AD872] uppercase tracking-widest mt-1">{profile?.role}</p>
            
            <div className="mt-8 pt-8 border-t border-gray-50 text-left space-y-4">
               <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
                  <p className="text-sm font-bold text-gray-700">{profile?.email}</p>
               </div>
               <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Account Created</p>
                  <p className="text-sm font-bold text-gray-700">{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</p>
               </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-6 sm:p-10 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {message && (
                <div className={`p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                   {message.type === 'success' ? (
                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                   ) : (
                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                   )}
                   {message.text}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Username</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl py-3 px-5 text-sm focus:ring-2 focus:ring-[#9AD872]/20 transition-all font-bold text-gray-700"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl py-3 px-5 text-sm focus:ring-2 focus:ring-[#9AD872]/20 transition-all font-bold text-gray-700"
                    required
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50 space-y-6">
                <p className="text-sm font-bold text-gray-900">Change Password <span className="text-gray-400 font-medium">(Leave blank to keep current)</span></p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">New Password</label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border-none rounded-2xl py-3 px-5 text-sm focus:ring-2 focus:ring-[#9AD872]/20 transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Confirm New Password</label>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border-none rounded-2xl py-3 px-5 text-sm focus:ring-2 focus:ring-[#9AD872]/20 transition-all font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  type="submit"
                  disabled={updating}
                  className="w-full sm:w-auto px-10 py-4 bg-[#9AD872] text-white rounded-2xl font-black shadow-lg shadow-[#9AD872]/20 hover:bg-[#8bc963] transition-all disabled:opacity-50"
                >
                  {updating ? 'Saving Changes...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}