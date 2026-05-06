"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Heart, MapPin, GraduationCap, Lock, Flower2, Search, Briefcase, IndianRupee, Users } from 'lucide-react';

interface Profile {
  _id: string;
  name: string;
  age: number;
  education: string;
  location: string;
  profilePhoto?: string;
  maritalStatus: string;
  job: string;
  salary: string;
}

export default function SearchResultsContent() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  if (!searchParams) return null; // Safety check for prerendering

  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [city, setCity] = useState('All Cities');
  const [gender, setGender] = useState('All Genders');
  const [maritalStatus, setMaritalStatus] = useState('Any Status');
  const [education, setEducation] = useState('All Education');
  const [salary, setSalary] = useState('Any Salary');
  const [job, setJob] = useState('');

  const [hasPaid, setHasPaid] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const fetchProfiles = async () => {
    setLoading(true);
    const token = localStorage.getItem('user_token');
    try {
      const query = new URLSearchParams({
        minAge: ageMin,
        maxAge: ageMax,
        location: city !== 'All Cities' ? city : '',
        gender: gender !== 'All Genders' ? gender : '',
        maritalStatus: maritalStatus !== 'Any Status' ? maritalStatus : '',
        education: education !== 'All Education' ? education : '',
        salary: salary !== 'Any Salary' ? salary : '',
        job: job,
      }).toString();

      const fetchHeaders: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};
      const response = await fetch(`${API_URL}/api/auth/profiles?${query}`, {
        headers: fetchHeaders,
        credentials: 'include'
      });
      const data = await response.json();
      
      if (response.ok) {
        const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        if (userData) {
          const loggedInUser = JSON.parse(userData);
          const currentId = loggedInUser._id || loggedInUser.id;
          setProfiles(data.filter((p: any) => p._id !== currentId));
        } else {
          setProfiles(data);
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('user_token');
    const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (!token || !userData) {
      router.replace('/login');
      return;
    }

    fetchProfiles();

    const loggedInUser = JSON.parse(userData);
    const userId = loggedInUser._id;
    fetch(`${API_URL}/api/auth/me`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) {
          localStorage.removeItem('user_token');
          localStorage.removeItem('user');
          router.replace('/login');
          return null;
        }
        return res.json();
      })
      .then(data => { if (data) setHasPaid(data.hasPaid); })
      .catch(err => console.error('Error checking payment status:', err));
  }, []);

return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      <section className="pt-24 pb-10 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-gray-900 mb-6">
            Find Your <span className="text-[#9AD872] italic">Soul</span>.
          </h1>
          <div className="inline-flex items-center gap-2 bg-white border border-gray-100 px-6 py-2 rounded-full shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9AD872] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#9AD872]"></span>
            </span>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">{profiles.length} curated profiles online</p>
          </div>
        </div>
      </section>

      <section className="sticky top-6 z-50 px-4 mb-16">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-2xl border border-white rounded-[2.5rem] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              
              <div className="bg-gray-50/50 rounded-2xl px-4 py-2 border border-transparent focus-within:bg-white focus-within:border-[#9AD872]/30 transition-all">
                <label className="block text-[9px] font-black uppercase text-gray-400 mb-1">Age Range</label>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="Min" value={ageMin} onChange={(e) => setAgeMin(e.target.value)} className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-bold" />
                  <span className="text-gray-300">-</span>
                  <input type="number" placeholder="Max" value={ageMax} onChange={(e) => setAgeMax(e.target.value)} className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-bold" />
                </div>
              </div>

              <div className="bg-gray-50/50 rounded-2xl px-4 py-2 border border-transparent focus-within:bg-white focus-within:border-[#9AD872]/30 transition-all">
                <label className="block text-[9px] font-black uppercase text-gray-400 mb-1">Location</label>
                <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-bold cursor-pointer">
                  <option>All Cities</option>
                  <option>Chennai</option>
                  <option>Madurai</option>
                </select>
              </div>

              <div className="bg-gray-50/50 rounded-2xl px-4 py-2 border border-transparent focus-within:bg-white focus-within:border-[#9AD872]/30 transition-all">
                <label className="block text-[9px] font-black uppercase text-gray-400 mb-1">Marital Status</label>
                <select value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)} className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-bold cursor-pointer">
                  <option>Any Status</option>
                  <option>Single</option>
                  <option>Divorced</option>
                </select>
              </div>

              <div className="bg-gray-50/50 rounded-2xl px-4 py-2 border border-transparent focus-within:bg-white focus-within:border-[#9AD872]/30 transition-all">
                <label className="block text-[9px] font-black uppercase text-gray-400 mb-1">Education</label>
                <select value={education} onChange={(e) => setEducation(e.target.value)} className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-bold cursor-pointer">
                  <option>All Education</option>
                  <option>Master's</option>
                  <option>Bachelor's</option>
                </select>
              </div>

              <button 
                onClick={fetchProfiles}
                className="bg-[#9AD872] hover:bg-[#8bc963] text-white rounded-2xl font-black text-xs uppercase tracking-tighter shadow-lg shadow-[#9AD872]/30 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 px-6 py-4 lg:py-0"
              >
                {loading ? "..." : "Search Matches"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {profiles.map((user) => (
            <div key={user._id} className="group relative bg-white rounded-[3rem] p-3 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem]">
                <img 
                  src={user.profilePhoto ? (user.profilePhoto.startsWith('http') ? user.profilePhoto : `${API_URL}/${user.profilePhoto}`) : '/placeholder.jpg'} 
                  alt={user.name}
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${!hasPaid ? 'blur-2xl scale-110' : ''}`}
                />
                <div className="absolute top-5 left-5">
                  <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                    {user.maritalStatus}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80"></div>
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  {!hasPaid ? (
                    <div className="text-center mb-auto mt-auto">
                       <Link href="/payment" className="inline-flex items-center gap-2 bg-[#9AD872] text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">
                        <Lock size={12} /> Unlock Profile
                      </Link>
                    </div>
                  ) : null}
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black text-white leading-none">
                      {user.name}, <span className="font-medium text-[#9AD872]">{user.age}</span>
                    </h2>
                    <p className="text-white/70 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2">
                      <MapPin size={12} className="text-[#9AD872]" /> {user.location}
                    </p>
                  </div>
                  <div className="max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 group-hover:mt-4 transition-all duration-500 flex flex-wrap gap-2">
                    <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-bold text-white border border-white/10">
                      {user.education}
                    </div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <Link href={`/profile/${user._id}`} className="flex-1 bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center hover:bg-[#9AD872] hover:text-white transition-all">
                      View Story
                    </Link>
                    <button className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-white hover:bg-rose-500 transition-all">
                      <Heart size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {!loading && profiles.length === 0 && (
          <div className="text-center py-40">
            <Flower2 size={40} className="mx-auto text-gray-100 mb-6" />
            <h3 className="text-2xl font-black text-gray-200 uppercase tracking-widest">No Matches Found</h3>
            <p className="text-gray-400 text-sm mt-2 font-medium">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </main>
    </div>
  );
}
