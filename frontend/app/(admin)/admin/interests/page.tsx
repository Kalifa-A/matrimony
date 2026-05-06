"use client";
import React, { useState, useEffect } from 'react';
import { getAllInterests, marryUsers, unmarryUsers, getDashboardStats } from '@/app/actions/adminActions';
import Image from 'next/image';
import { useToast } from '@/app/components/ToastProvider';

export interface AdminInterest {
  _id: string;
  sender: {
    _id: string;
    name: string;
    phone: string;
    email: string;
    gender: string;
    profilePhoto?: string;
    isMarried: boolean;
  };
  receiver: {
    _id: string;
    name: string;
    phone: string;
    email: string;
    gender: string;
    profilePhoto?: string;
    isMarried: boolean;
  };
  isMutual: boolean;
  createdAt: string;
}

export default function AdminInterests() {
  const { showToast } = useToast();
  const [interests, setInterests] = useState<AdminInterest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'mutual'>('all');
  const [stats, setStats] = useState<any>(null);

  const fetchInterests = async () => {
    setLoading(true);
    try {
      const data = await getAllInterests();
      setInterests(data);
      
      const statsData = await getDashboardStats();
      setStats(statsData);
    } catch (err) {
      console.error("Failed to load interests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterests();
  }, []);

  const handleMarry = async (husbandId: string, wifeId: string) => {
    try {
      await marryUsers(husbandId, wifeId);
      showToast("Congratulations! Couple marked as married.");
      fetchInterests();
    } catch (err) {
      showToast("Failed to mark couple as married.", "error");
    }
  };

  const handleUnmarry = async (husbandId: string, wifeId: string) => {
    try {
      await unmarryUsers(husbandId, wifeId);
      showToast("Marriage status undone.");
      fetchInterests();
    } catch (err) {
      showToast("Failed to undo marriage status.", "error");
    }
  };

  const filteredInterests = filter === 'mutual' 
    ? interests.filter(i => i.isMutual)
    : interests;

  const mutualMatches = interests.filter(i => i.isMutual && !i.sender.isMarried && !i.receiver.isMarried).length / 2;
  const marriagesCount = stats?.successStories || 0;

  return (
    <section className="space-y-8 p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">Interests & Matches</h2>
          <p className="text-sm sm:text-base text-gray-500 mt-1">Monitor user interactions and successful matches.</p>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm self-start sm:self-auto">
          <button 
            onClick={() => setFilter('all')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === 'all' ? 'bg-[#9AD872] text-white shadow-md shadow-[#9AD872]/20' : 'text-gray-400 hover:text-gray-600'}`}
          >
            All Interests
          </button>
          <button 
            onClick={() => setFilter('mutual')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === 'mutual' ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Mutual Matches
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
           <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
           </div>
           <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Interests</p>
              <p className="text-2xl font-black text-gray-900">{interests.length}</p>
           </div>
        </div>
        
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
           <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
           </div>
           <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Successful Matches</p>
              <p className="text-2xl font-black text-rose-500">{mutualMatches + marriagesCount} Successes</p>
           </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
           <div className="w-14 h-14 bg-[#9AD872]/10 rounded-2xl flex items-center justify-center text-[#9AD872]">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
           </div>
           <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Conversion Rate</p>
              <p className="text-2xl font-black text-gray-900">
                {interests.length > 0 ? Math.round((interests.filter(i => i.isMutual).length / interests.length) * 100) : 0}%
              </p>
           </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9AD872]"></div>
        </div>
      ) : filteredInterests.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
           <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
           </div>
           <h3 className="text-xl font-bold text-gray-900">No interactions yet</h3>
           <p className="text-gray-500 mt-2">Users haven't started sending interests to each other.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredInterests.map((interest) => (
            <InterestRow key={interest._id} interest={interest} onMarry={handleMarry} onUnmarry={handleUnmarry} />
          ))}
        </div>
      )}
    </section>
  );
}

function InterestRow({ interest, onMarry, onUnmarry }: { interest: AdminInterest; onMarry: (h: string, w: string) => void; onUnmarry: (h: string, w: string) => void }) {
  const [processing, setProcessing] = useState(false);
  const isMarried = interest.sender.isMarried || interest.receiver.isMarried;

  const handleMarryClick = async () => {
    setProcessing(true);
    const husbandId = interest.sender.gender === 'Male' ? interest.sender._id : interest.receiver._id;
    const wifeId = interest.sender.gender === 'Female' ? interest.sender._id : interest.receiver._id;
    await onMarry(husbandId, wifeId);
    setProcessing(false);
  };

  const handleUnmarryClick = async () => {
    if (!window.confirm("Are you sure you want to undo this marriage status?")) return;
    setProcessing(true);
    const husbandId = interest.sender.gender === 'Male' ? interest.sender._id : interest.receiver._id;
    const wifeId = interest.sender.gender === 'Female' ? interest.sender._id : interest.receiver._id;
    await onUnmarry(husbandId, wifeId);
    setProcessing(false);
  };

  return (
    <div className={`bg-white rounded-[2rem] border p-6 sm:p-8 transition-all ${interest.isMutual ? 'border-rose-100 shadow-lg shadow-rose-500/5 ring-1 ring-rose-50' : 'border-gray-100 shadow-sm hover:shadow-md'}`}>
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left gap-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 py-1 bg-gray-50 rounded-full">Sender</p>
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm">
               {interest.sender.profilePhoto ? (
                 <Image src={interest.sender.profilePhoto} alt={interest.sender.name} fill className="object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white font-black text-xl">
                    {interest.sender.name[0]}
                 </div>
               )}
            </div>
            <div>
              <h4 className="font-black text-gray-900 text-lg leading-tight">{interest.sender.name}</h4>
              <p className="text-sm text-gray-500 font-medium">{interest.sender.gender}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                 <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg">{interest.sender.phone}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 min-w-[200px]">
           {interest.isMutual ? (
             <div className="flex flex-col items-center gap-4">
                <div className="flex flex-col items-center animate-in zoom-in duration-500">
                  <div className="bg-rose-500 text-white p-3 rounded-2xl shadow-lg shadow-rose-500/30">
                     <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                  </div>
                  <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mt-2">Mutual Match</p>
                </div>
                
                {isMarried ? (
                  <button 
                    onClick={handleUnmarryClick}
                    disabled={processing}
                    className="bg-red-50 text-red-600 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all shadow-sm disabled:opacity-50"
                  >
                    {processing ? 'Undoing...' : 'Undo Marriage'}
                  </button>
                ) : (
                  <button 
                    onClick={handleMarryClick}
                    disabled={processing}
                    className="bg-gray-900 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#9AD872] transition-all shadow-xl shadow-gray-200 disabled:opacity-50"
                  >
                    {processing ? 'Saving...' : 'Mark as Married'}
                  </button>
                )}
             </div>
           ) : (
             <div className="flex flex-col items-center opacity-40">
                <div className="bg-gray-100 text-gray-400 p-3 rounded-2xl">
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4-4m4-4H3" /></svg>
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">Sent Interest</p>
             </div>
           )}
           <p className="text-[10px] text-gray-400 font-bold mt-1 text-center">
             {new Date(interest.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
           </p>
        </div>

        <div className="flex-1 flex flex-col items-center sm:items-end text-center sm:text-right gap-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 py-1 bg-gray-50 rounded-full">Receiver</p>
          <div className="flex flex-row-reverse items-center gap-4 text-right">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm">
               {interest.receiver.profilePhoto ? (
                 <Image src={interest.receiver.profilePhoto} alt={interest.receiver.name} fill className="object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white font-black text-xl">
                    {interest.receiver.name[0]}
                 </div>
               )}
            </div>
            <div>
              <h4 className="font-black text-gray-900 text-lg leading-tight">{interest.receiver.name}</h4>
              <p className="text-sm text-gray-500 font-medium">{interest.receiver.gender}</p>
              <div className="mt-2 flex flex-wrap flex-row-reverse gap-2">
                 <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg">{interest.receiver.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
