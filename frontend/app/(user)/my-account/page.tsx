"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, Mail, Phone, MapPin, GraduationCap, 
  Briefcase, Banknote, Heart, Sparkles, 
  ShieldCheck, Camera, Edit3, Save, X, ChevronRight,
  Flower2
} from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  age: string | number;
  gender: string;
  phone: string;
  education: string;
  location: string;
  maritalStatus: string;
  job: string;
  salary: string;
  assets: string;
  description: string;
  profilePhoto: string;
  hasPaid: boolean;
  _id: string;
}

import { useToast } from '@/app/components/ToastProvider';

export default function MyAccount() {
  const { showToast } = useToast();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [interests, setInterests] = useState([]);
  const [discoverProfiles, setDiscoverProfiles] = useState([]);
  const [sentInterests, setSentInterests] = useState([]);
  const [hasSentInterests, setHasSentInterests] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    age: "",
    gender: "",
    phone: "",
    education: "",
    location: "",
    maritalStatus: "",
    job: "",
    salary: "",
    assets: "",
    description: "",
    profilePhoto: "",
    hasPaid: false,
    _id: ""
  });

  useEffect(() => {
    const token = localStorage.getItem('user_token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.replace('/login');
      return;
    }

    const loggedInUser = JSON.parse(userData);
    const userId = loggedInUser._id;
    const headers = { 'Authorization': `Bearer ${token}` };

    fetch(`${API_URL}/api/auth/me`, { headers })
      .then(res => {
        if (!res.ok) {
          localStorage.removeItem('user_token');
          localStorage.removeItem('user');
          router.replace('/login');
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setProfile(data);
          setLoading(false);
        }
      })
      .catch(err => console.error("Error fetching profile:", err));

    fetch(`${API_URL}/api/interests/received/${userId}`, { headers })
      .then(res => res.json())
      .then(data => setInterests(data))
      .catch(err => console.error("Error fetching interests:", err));
  }, []);

  useEffect(() => {
    if (profile._id) {
      const fetchDiscover = async () => {
        const token = localStorage.getItem('user_token');
        if (!token) return;
        const headers = { 'Authorization': `Bearer ${token}` };

        try {
          let query = '';
          if (profile.gender) {
            query = `?gender=${profile.gender === 'Male' ? 'Female' : 'Male'}`;
          }
          const res = await fetch(`${API_URL}/api/auth/profiles${query}`, { headers });
          const data = await res.json();
          const sentRes = await fetch(`${API_URL}/api/interests/sent/${profile._id}`, { headers });
          const sentInterestData = await sentRes.json();
          setSentInterests(sentInterestData);
          setHasSentInterests(sentInterestData.length > 0);
          const sentInterestIds = Array.isArray(sentInterestData) ? sentInterestData.map((i: any) => i.receiver._id) : [];
          const others = data.filter((u: any) => u._id !== profile._id && !sentInterestIds.includes(u._id)).slice(0, 4);
          setDiscoverProfiles(others);
        } catch (err) {
          console.error("Error discovery profiles:", err);
        }
      };
      fetchDiscover();
    }
  }, [profile._id, profile.gender]);

  const handleSave = async () => {
    const token = localStorage.getItem('user_token');
    try {
      const response = await fetch(`${API_URL}/api/auth/update/${profile._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile),
      });
      if (response.ok) {
        const updatedData = await response.json();
        setProfile(updatedData);
        localStorage.setItem('user', JSON.stringify(updatedData));
        setIsEditing(false);
        showToast("Profile updated successfully!");
      }
    } catch (err) {
      showToast("Failed to save changes.", 'error');
    }
  };

  const handlePhotoUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const formData = new FormData();
    formData.append('profilePhoto', e.target.files[0]);
    const token = localStorage.getItem('user_token');
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/auth/update-photo/${profile._id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        const updatedData = await res.json();
        setProfile(updatedData);
        localStorage.setItem('user', JSON.stringify(updatedData));
        showToast("Photo updated successfully!");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to update photo.", 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-[#9AD872] rounded-full animate-spin"></div>
        <p className="font-black text-[10px] uppercase tracking-[0.3em] text-gray-400">Syncing Dashboard</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-20">
      
      {/* 🏙️ Hero Stats Section */}
      <div className="bg-white border-b border-gray-100 py-12 px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                 <span className="h-[2px] w-8 bg-[#9AD872]"></span>
                 <p className="text-xs font-black tracking-[0.2em] text-[#9AD872] uppercase">Personal Workspace</p>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter italic">Welcome back.</h1>
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
              <StatItem label="Interests" value={interests.length} icon={<Heart size={14} className="text-pink-400" />} />
              <StatItem label="Likes Sent" value={sentInterests.length} icon={<Sparkles size={14} className="text-amber-400" />} />
              <StatItem label="Status" value={profile.hasPaid ? 'Premium' : 'Free'} highlight />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* --- LEFT COLUMN: IDENTITY CARD --- */}
          <div className="w-full lg:w-[380px] shrink-0">
             <div className="sticky top-28 space-y-6">
                <div className="bg-white rounded-[3rem] p-6 shadow-2xl shadow-gray-200/40 border border-gray-50 overflow-hidden relative">
                   {/* Background Decoration */}
                   <div className="absolute top-0 right-0 w-32 h-32 bg-[#9AD872]/5 rounded-full -mr-16 -mt-16"></div>
                   
                   <div className="relative group mb-8">
                      <div className="aspect-square rounded-[2.5rem] overflow-hidden bg-gray-100 border-4 border-white shadow-xl relative">
                        {profile.profilePhoto ? (
                          <img 
                            src={profile.profilePhoto.startsWith('http') ? profile.profilePhoto : `${API_URL}/${profile.profilePhoto}`} 
                            alt="Me"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl font-black text-gray-300">
                            {profile.name?.charAt(0)}
                          </div>
                        )}
                        <label className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                           <Camera className="text-white mb-2" size={24} />
                           <span className="text-[10px] font-black uppercase tracking-widest text-white">Update Photo</span>
                           <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpdate} />
                        </label>
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-[#9AD872] p-3 rounded-2xl shadow-lg border-4 border-white">
                         <ShieldCheck className="text-white" size={20} />
                      </div>
                   </div>

                   <div className="text-center">
                      <h2 className="text-3xl font-black text-gray-900 leading-tight">{profile.name}</h2>
                      <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest italic">{profile.job || "Profession Not Set"}</p>
                      
                      <div className="mt-8 pt-8 border-t border-gray-50 grid grid-cols-2 gap-4">
                         <div className="bg-gray-50/50 p-4 rounded-2xl">
                            <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-1">Age</p>
                            <p className="font-black text-gray-900">{profile.age} Yrs</p>
                         </div>
                         <div className="bg-gray-50/50 p-4 rounded-2xl">
                            <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-1">Location</p>
                            <p className="font-black text-gray-900 truncate">{profile.location || "N/A"}</p>
                         </div>
                      </div>
                   </div>
                </div>

                <button 
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className={`w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl ${isEditing ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-gray-900 text-white hover:bg-[#9AD872]'}`}
                >
                  {isEditing ? <><Save size={18} /> Finish Editing</> : <><Edit3 size={18} /> Modify Profile</>}
                </button>
                {isEditing && (
                  <button onClick={() => setIsEditing(false)} className="w-full text-center text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors">Discard Changes</button>
                )}
             </div>
          </div>

          {/* --- RIGHT COLUMN: FORMS & INTERESTS --- */}
          <div className="flex-1 space-y-12">
            
            {/* 📝 Profile Editor / Viewer */}
            <section className="bg-white rounded-[3.5rem] p-8 md:p-12 shadow-sm border border-gray-50">
               <h3 className="text-2xl font-black text-gray-900 mb-10 flex items-center gap-4">
                  <span className="w-1.5 h-8 bg-[#9AD872] rounded-full"></span>
                  Personal Details
               </h3>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                  <EditableField label="Full Name" value={profile.name} icon={<User size={16}/>} isEditing={isEditing} onChange={(val) => setProfile({...profile, name: val})} />
                  <EditableField label="Age" value={profile.age} icon={<Flower2 size={16}/>} isEditing={isEditing} type="number" onChange={(val) => setProfile({...profile, age: val})} />
                  <EditableField label="Email (Locked)" value={profile.email} icon={<Mail size={16}/>} isEditing={false} />
                  <EditableField label="Phone (Locked)" value={profile.phone} icon={<Phone size={16}/>} isEditing={false} />
                  <EditableField label="Education" value={profile.education} icon={<GraduationCap size={16}/>} isEditing={isEditing} onChange={(val) => setProfile({...profile, education: val})} />
                  <EditableField label="Location" value={profile.location} icon={<MapPin size={16}/>} isEditing={isEditing} onChange={(val) => setProfile({...profile, location: val})} />
                  <EditableField label="Profession" value={profile.job} icon={<Briefcase size={16}/>} isEditing={isEditing} onChange={(val) => setProfile({...profile, job: val})} />
                  <EditableField label="Annual Salary" value={profile.salary} icon={<Banknote size={16}/>} isEditing={isEditing} onChange={(val) => setProfile({...profile, salary: val})} />
                  
                  <div className="md:col-span-2">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 mb-2">Short Bio</p>
                    {isEditing ? (
                      <textarea 
                        className="w-full bg-gray-50/50 border-none rounded-3xl p-6 text-sm font-bold focus:ring-4 focus:ring-[#9AD872]/10 min-h-[120px]"
                        value={profile.description}
                        onChange={(e) => setProfile({...profile, description: e.target.value})}
                        placeholder="Tell others about yourself..."
                      />
                    ) : (
                      <p className="text-gray-600 font-bold text-sm bg-gray-50/30 p-6 rounded-3xl border border-gray-50 leading-relaxed italic">
                        "{profile.description || "No description provided yet. Click edit to add one!"}"
                      </p>
                    )}
                  </div>
               </div>
            </section>

            {/* ❤️ Interests Received */}
            <section className="bg-gray-900 rounded-[3.5rem] p-8 md:p-12 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#9AD872]/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
               
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-black flex items-center gap-4">
                     <span className="w-1.5 h-8 bg-pink-500 rounded-full"></span>
                     Interests Received
                  </h3>
                  <span className="bg-white/10 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest">{interests.length} Total</span>
               </div>

               {interests.length === 0 ? (
                 <div className="py-10 text-center opacity-40">
                    <Heart size={40} className="mx-auto mb-4" />
                    <p className="font-bold uppercase tracking-widest text-[10px]">No interests yet • Your soulmate is coming</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {interests.map((interest: any) => (
                      <div key={interest._id} className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-3xl flex items-center gap-4 hover:bg-white/10 transition-all group">
                         <div className="w-14 h-14 rounded-2xl overflow-hidden relative border border-white/10">
                            <img 
                              src={interest.sender.profilePhoto?.startsWith('http') ? interest.sender.profilePhoto : `${API_URL}/${interest.sender.profilePhoto}`} 
                              className={`w-full h-full object-cover ${!profile.hasPaid ? 'blur-md' : ''}`}
                              alt="Sender"
                            />
                            {!profile.hasPaid && <div className="absolute inset-0 bg-black/20 flex items-center justify-center"><Lock size={12}/></div>}
                         </div>
                         <div className="flex-1">
                            <p className="font-black text-sm">{interest.sender.name}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">{interest.sender.location}</p>
                         </div>
                         <a href={`/profile/${interest.sender._id}`} className="bg-white text-black p-3 rounded-xl hover:bg-[#9AD872] hover:text-white transition-all">
                            <ChevronRight size={18} />
                         </a>
                      </div>
                    ))}
                 </div>
               )}
            </section>

          </div>
        </div>

        {/* 🌟 Profiles You Liked (Visual Carousel Style) */}
        {hasSentInterests && (
           <section className="mt-20">
              <div className="flex justify-between items-end mb-10">
                 <div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter italic underline decoration-[#9AD872]/30">Profiles You Liked.</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mt-2">Recently interested • {sentInterests.length} Profiles</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                 {sentInterests.map((interest: any) => {
                   const user = interest.receiver;
                   if (!user) return null;
                   return (
                     <div key={user._id} className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-100 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500">
                        <img 
                           src={user.profilePhoto?.startsWith('http') ? user.profilePhoto : `${API_URL}/${user.profilePhoto}`} 
                           className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ${!profile.hasPaid ? 'blur-2xl grayscale' : ''}`}
                           alt="Liked"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity"></div>
                        
                        <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                           <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#9AD872] mb-1">{user.maritalStatus || "Single"}</p>
                              <h4 className="text-xl font-black mb-4">{user.name}, {user.age}</h4>
                              <div className="flex items-center gap-4">
                                 <a href={`/profile/${user._id}`} className="flex-1 bg-white text-black py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center hover:bg-[#9AD872] hover:text-white transition-all">Profile</a>
                                 <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                                    <Heart size={16} className="fill-current text-white" />
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                   );
                 })}
              </div>
           </section>
        )}

      </div>
    </div>
  );
}

// --- Helper Components ---

interface StatItemProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  highlight?: boolean;
}

function StatItem({ label, value, icon, highlight }: StatItemProps) {
  return (
    <div className={`p-4 md:p-6 rounded-[2rem] border ${highlight ? 'bg-black text-white border-black shadow-xl shadow-gray-200' : 'bg-gray-50 border-gray-100'} flex-1 md:w-40`}>
       <div className="flex justify-between items-center mb-1">
          <p className={`text-[9px] font-black uppercase tracking-widest ${highlight ? 'text-gray-400' : 'text-gray-400'}`}>{label}</p>
          {icon}
       </div>
       <p className="text-xl md:text-2xl font-black tracking-tight">{value}</p>
    </div>
  );
}

interface EditableFieldProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  isEditing: boolean;
  onChange?: (val: string) => void;
  type?: string;
}

function EditableField({ label, value, icon, isEditing, onChange, type = "text" }: EditableFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 ml-1">
         {icon}
         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</label>
      </div>
      {isEditing ? (
        <input 
          type={type}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-[#9AD872]/10 transition-all outline-none"
        />
      ) : (
        <div className="p-4 rounded-2xl border border-gray-50 bg-gray-50/20 font-black text-gray-800 text-sm">
           {value || "—"}
        </div>
      )}
    </div>
  );
}

function Lock({ size }: any) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
  );
}