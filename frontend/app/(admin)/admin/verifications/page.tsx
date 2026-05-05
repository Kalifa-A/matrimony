"use client";
import React, { useState, useEffect, useTransition } from 'react';
import { getAllUsers, approveUser, revokeUser, togglePaymentStatus, AdminUser } from '@/app/actions/adminActions';
import { useToast } from '@/app/components/ToastProvider';

export default function UserVerification() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
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

  const filteredUsers = showAll ? users : users.filter(u => !u.isAdminApproved || !u.hasPaid);

  return (
    <section className="space-y-8 p-4 sm:p-8">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 sm:gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Verifications Center</h2>
          <p className="text-xs sm:text-sm text-gray-500">Manage call verifications and payment confirmations.</p>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div 
              onClick={() => setShowAll(!showAll)}
              className={`w-10 h-5 rounded-full transition-all relative ${showAll ? 'bg-[#9AD872]' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${showAll ? 'right-1' : 'left-1'}`}></div>
            </div>
            <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Show Verified Users</span>
          </label>
          <span className="bg-orange-100 text-orange-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-bold shadow-sm">
            {users.filter(u => !u.isAdminApproved || !u.hasPaid).length} Pending
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9AD872]"></div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
           <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
           </div>
           <h3 className="text-xl font-bold text-gray-900">All caught up!</h3>
           <p className="text-gray-500 mt-2">No users are currently pending verification.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredUsers.map((user) => (
            <VerificationCard 
              key={user._id}
              user={user}
              onApprove={() => handleApproveToggle(user)}
              onPayment={() => handlePaymentToggle(user)}
              isApproving={actionInProgress === user._id + '-approve'}
              isPaying={actionInProgress === user._id + '-payment'}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function VerificationCard({ user, onApprove, onPayment, isApproving, isPaying }: any) {
  return (
    <div className="bg-white rounded-2xl sm:rounded-[2.5rem] border border-gray-100 p-5 sm:p-8 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
      {user.isAdminApproved && user.hasPaid && (
        <div className="absolute top-0 right-0 px-4 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-bl-2xl">
           Fully Verified
        </div>
      )}
      <div className="flex flex-col lg:flex-row justify-between gap-6 sm:gap-8">
        
        {/* User Info Details */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div>
            <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">User Details</p>
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9AD872] to-emerald-400 flex items-center justify-center text-white font-bold shadow-sm">
                  {user.name?.[0]}
               </div>
               <div>
                  <p className="font-bold text-gray-900 text-sm sm:text-base leading-tight">{user.name}</p>
                  <p className="text-[10px] text-gray-500">{user.location}</p>
               </div>
            </div>
          </div>
          <div>
            <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Contact Info</p>
            <p className="text-gray-900 font-mono text-xs sm:text-sm font-bold bg-gray-50 px-2 py-1 rounded-lg inline-block">{user.phone}</p>
            <p className="text-[10px] text-gray-400 mt-1">{user.email}</p>
          </div>
          <div>
            <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Call Verification</p>
            {user.isAdminApproved ? (
               <span className="text-emerald-500 font-bold text-xs sm:text-sm flex items-center gap-1">
                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg>
                 Verified
               </span>
            ) : (
               <span className="text-orange-500 font-bold text-xs sm:text-sm flex items-center gap-1">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                 Pending Call
               </span>
            )}
          </div>
          <div>
            <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Payment Status</p>
            {user.hasPaid ? (
               <span className="text-blue-500 font-bold text-xs sm:text-sm flex items-center gap-1">
                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg>
                 Paid Member
               </span>
            ) : (
               <span className="text-gray-400 font-bold text-xs sm:text-sm flex items-center gap-1">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                 Not Paid
               </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-wrap sm:flex-nowrap">
          <button 
            onClick={onApprove}
            disabled={isApproving}
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold transition-all text-xs sm:text-sm disabled:opacity-50 ${user.isAdminApproved ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/20'}`}
          >
            {isApproving ? 'Updating...' : user.isAdminApproved ? 'Revoke Call' : 'Verify Call'}
          </button>
          <button 
            onClick={onPayment}
            disabled={isPaying}
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold transition-all text-xs sm:text-sm disabled:opacity-50 ${user.hasPaid ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'}`}
          >
            {isPaying ? 'Updating...' : user.hasPaid ? 'Revoke Payment' : 'Verify Payment'}
          </button>
        </div>
      </div>
    </div>
  );
}