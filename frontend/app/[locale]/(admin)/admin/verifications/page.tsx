"use client";
import React, { useState, useEffect, useTransition } from 'react';
import { getAllUsers, approveUser, revokeUser, togglePaymentStatus, deleteUser, AdminUser } from '@/app/actions/adminActions';
import { useToast } from '@/app/components/ToastProvider';

export default function UserVerification() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'pending' | 'pending-call' | 'pending-payment' | 'verified'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApproveToggle = (user: AdminUser) => {
    setActionInProgress(user._id + '-approve');
    startTransition(async () => {
      try {
        if (user.isAdminApproved) {
          await revokeUser(user._id);
          showToast(`Call verification revoked for ${user.name}`);
        } else {
          await approveUser(user._id);
          showToast(`${user.name}'s call verified successfully!`);
        }
        setUsers(prev => prev.map(u => u._id === user._id ? { ...u, isAdminApproved: !u.isAdminApproved } : u));
      } catch (err) {
        showToast("Failed to update status.", 'error');
      } finally {
        setActionInProgress(null);
      }
    });
  };

  const handlePaymentToggle = (user: AdminUser) => {
    setActionInProgress(user._id + '-payment');
    startTransition(async () => {
      try {
        await togglePaymentStatus(user._id);
        const newStatus = !user.hasPaid;
        showToast(`Payment ${newStatus ? 'verified' : 'revoked'} for ${user.name}`);
        setUsers(prev => prev.map(u => u._id === user._id ? { ...u, hasPaid: !u.hasPaid } : u));
      } catch (err) {
        showToast("Failed to update payment status.", 'error');
      } finally {
        setActionInProgress(null);
      }
    });
  };

  const handleDeleteUser = (user: AdminUser) => {
    if (!window.confirm(`Are you sure you want to PERMANENTLY delete ${user.name}? This action cannot be undone.`)) {
      return;
    }
    
    setActionInProgress(user._id + '-delete');
    startTransition(async () => {
      try {
        await deleteUser(user._id);
        showToast(`User ${user.name} deleted successfully`, 'success');
        setUsers(prev => prev.filter(u => u._id !== user._id));
      } catch (err: any) {
        showToast(err.message || "Failed to delete user.", 'error');
      } finally {
        setActionInProgress(null);
      }
    });
  };

  // Filter computation
  const filteredUsers = users.filter((user) => {
    // 1. Search Query filter
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      const nameMatch = user.name?.toLowerCase().includes(query);
      const phoneMatch = user.phone?.toLowerCase().includes(query);
      const emailMatch = user.email?.toLowerCase().includes(query);
      const locationMatch = user.location?.toLowerCase().includes(query);
      if (!nameMatch && !phoneMatch && !emailMatch && !locationMatch) {
        return false;
      }
    }

    // 2. Tab Filter
    if (tab === 'pending') {
      return !user.isAdminApproved || !user.hasPaid;
    }
    if (tab === 'pending-call') {
      return !user.isAdminApproved;
    }
    if (tab === 'pending-payment') {
      return !user.hasPaid;
    }
    if (tab === 'verified') {
      return user.isAdminApproved && user.hasPaid;
    }
    return true;
  });

  // Category counts
  const countPendingAll = users.filter(u => !u.isAdminApproved || !u.hasPaid).length;
  const countPendingCall = users.filter(u => !u.isAdminApproved).length;
  const countPendingPayment = users.filter(u => !u.hasPaid).length;
  const countVerified = users.filter(u => u.isAdminApproved && u.hasPaid).length;

  return (
    <section className="space-y-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Verifications Center</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage user call verifications and subscription payment confirmations.</p>
        </div>
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="Search by name, phone, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-[#9AD872]/20 focus:border-[#9AD872] transition-all"
          />
          <svg className="absolute left-4 top-3.5 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex gap-2 overflow-x-auto pb-1 border-b border-gray-100 scrollbar-none">
        <TabButton 
          active={tab === 'pending'} 
          onClick={() => setTab('pending')}
          label="All Pending"
          count={countPendingAll}
          colorClass="bg-amber-100 text-amber-700"
        />
        <TabButton 
          active={tab === 'pending-call'} 
          onClick={() => setTab('pending-call')}
          label="Call Pending"
          count={countPendingCall}
          colorClass="bg-orange-100 text-orange-700"
        />
        <TabButton 
          active={tab === 'pending-payment'} 
          onClick={() => setTab('pending-payment')}
          label="Payment Pending"
          count={countPendingPayment}
          colorClass="bg-blue-100 text-blue-700"
        />
        <TabButton 
          active={tab === 'verified'} 
          onClick={() => setTab('verified')}
          label="Fully Verified"
          count={countVerified}
          colorClass="bg-emerald-100 text-emerald-700"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9AD872]"></div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
           <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
           </div>
           <h3 className="text-lg font-bold text-gray-900">No users found</h3>
           <p className="text-gray-500 mt-1 text-sm">We couldn't find any users matching your query or selected filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 animate-in fade-in duration-300">
          {filteredUsers.map((user) => (
            <VerificationCard 
              key={user._id}
              user={user}
              onApprove={() => handleApproveToggle(user)}
              onPayment={() => handlePaymentToggle(user)}
              onDelete={() => handleDeleteUser(user)}
              isApproving={actionInProgress === user._id + '-approve'}
              isPaying={actionInProgress === user._id + '-payment'}
              isDeleting={actionInProgress === user._id + '-delete'}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function TabButton({ active, onClick, label, count, colorClass }: { active: boolean, onClick: () => void, label: string, count: number, colorClass: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-sm transition-all duration-200 shrink-0 ${
        active 
        ? 'border-[#9AD872] text-[#9AD872]' 
        : 'border-transparent text-gray-400 hover:text-gray-600'
      }`}
    >
      <span>{label}</span>
      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${colorClass}`}>
        {count}
      </span>
    </button>
  );
}

function VerificationCard({ user, onApprove, onPayment, onDelete, isApproving, isPaying, isDeleting }: any) {
  // Border accent matching user status
  let borderAccent = 'border-l-orange-500';
  if (user.isAdminApproved && !user.hasPaid) {
    borderAccent = 'border-l-blue-500';
  } else if (user.isAdminApproved && user.hasPaid) {
    borderAccent = 'border-l-emerald-500';
  }

  // Avatar monogram gradients matching gender representation
  let avatarGradient = 'from-[#9AD872] to-emerald-500';
  if (user.gender === 'male' || user.gender === 'Male') {
    avatarGradient = 'from-blue-400 to-indigo-500';
  } else if (user.gender === 'female' || user.gender === 'Female') {
    avatarGradient = 'from-pink-400 to-rose-500';
  }

  // Date formatting helper
  const dateFormatted = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) : null;

  return (
    <div className={`bg-white rounded-3xl border border-gray-100 border-l-4 ${borderAccent} p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden`}>
      {user.isAdminApproved && user.hasPaid && (
        <div className="absolute top-0 right-0 px-4 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-bl-2xl tracking-wider">
           Fully Verified
        </div>
      )}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
        
        {/* User Info Details */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 items-center">
          <div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2.5">User Details</p>
            <div className="flex items-center gap-3.5">
               <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${avatarGradient} flex items-center justify-center text-white font-black shadow-sm text-base shrink-0`}>
                  {user.name?.[0]?.toUpperCase()}
               </div>
               <div className="min-w-0">
                  <p className="font-black text-gray-900 text-base leading-tight truncate">{user.name}</p>
                  <p className="text-[11px] text-gray-500 mt-1 capitalize font-bold flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${user.gender === 'male' || user.gender === 'Male' ? 'bg-blue-400' : 'bg-pink-400'}`}></span>
                    {user.gender} • {user.location}
                  </p>
               </div>
            </div>
          </div>

          <div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2.5">Contact Info</p>
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 text-gray-700 font-mono text-xs font-black bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {user.phone}
              </span>
              <p className="text-xs text-gray-500 truncate flex items-center gap-1.5 pl-1 mt-0.5">
                <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {user.email}
              </p>
            </div>
          </div>

          <div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2.5">Call Verification</p>
            {user.isAdminApproved ? (
               <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-xs font-bold shadow-sm">
                 <svg className="w-4 h-4 shrink-0 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                 </svg>
                 Call Verified
               </span>
            ) : (
               <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-700 border border-orange-100 rounded-full text-xs font-bold shadow-sm animate-pulse">
                 <svg className="w-4 h-4 shrink-0 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                 Pending Call
               </span>
            )}
            {dateFormatted && (
              <p className="text-[10px] text-gray-400 mt-1.5 flex items-center gap-1.5 pl-1 font-bold">
                <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Registered {dateFormatted}
              </p>
            )}
          </div>

          <div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2.5">Payment Status</p>
            {user.hasPaid ? (
               <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-bold shadow-sm">
                 <svg className="w-4 h-4 shrink-0 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                 </svg>
                 Paid Account
               </span>
            ) : (
               <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-500 border border-slate-100 rounded-full text-xs font-bold shadow-sm">
                 <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                 Unpaid Account
               </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap w-full lg:w-auto border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-50">
          <button 
            onClick={onApprove}
            disabled={isApproving}
            className={`flex-1 lg:flex-none px-5 py-2.5 rounded-xl font-bold transition-all text-xs disabled:opacity-50 flex items-center justify-center gap-1.5 min-w-[110px] ${
              user.isAdminApproved 
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' 
              : 'bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/10 active:scale-95 duration-200'
            }`}
          >
            {isApproving ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : user.isAdminApproved ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                Revoke Call
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Verify Call
              </>
            )}
          </button>
          
          <button 
            onClick={onPayment}
            disabled={isPaying || isDeleting}
            className={`flex-1 lg:flex-none px-5 py-2.5 rounded-xl font-bold transition-all text-xs disabled:opacity-50 flex items-center justify-center gap-1.5 min-w-[125px] ${
              user.hasPaid 
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' 
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/10 active:scale-95 duration-200'
            }`}
          >
            {isPaying ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : user.hasPaid ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                Revoke Pay
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Verify Pay
              </>
            )}
          </button>
          
          <button 
            onClick={onDelete}
            disabled={isDeleting || isApproving || isPaying}
            className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 flex items-center justify-center shrink-0 duration-200 active:scale-90"
            title="Delete User"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}