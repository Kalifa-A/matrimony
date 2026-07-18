'use client';

import React, { useState, useEffect, useTransition } from 'react';
import {
  getAllUsers,
  approveUser,
  revokeUser,
  togglePaymentStatus,
  deleteUser,
  createOfflineUser,
  type AdminUser,
} from '@/app/actions/adminActions';

import { useToast } from '@/app/components/ToastProvider';

/* ───────────────────── Detail Field (Modal) ───────────────────── */
function DetailField({ 
  label, 
  value, 
  isMono = false 
}: { 
  label: string; 
  value?: string | number | null; 
  isMono?: boolean;
}) {
  return (
    <div className="bg-gray-50/50 border border-gray-100 p-3.5 rounded-2xl">
      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-0.5">{label}</span>
      <span className={`text-sm font-bold text-gray-800 ${isMono ? 'font-mono' : ''}`}>
        {value || '—'}
      </span>
    </div>
  );
}

/* ───────────────────── Toggle Switch ───────────────────── */
function Toggle({
  enabled,
  onToggle,
  pending,
  colorOn = 'bg-[#9AD872]',
  colorOff = 'bg-gray-300',
}: {
  enabled: boolean;
  onToggle: () => void;
  pending: boolean;
  colorOn?: string;
  colorOff?: string;
}) {
  return (
    <button
      onClick={onToggle}
      disabled={pending}
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
        enabled ? colorOn : colorOff
      } ${pending ? 'opacity-50 cursor-wait' : ''}`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out mt-1 ${
          enabled ? 'translate-x-6 ml-[1px]' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

/* ───────────────────── Main Table ──────────────────────── */
export default function AdminUserTable({ 
  onlyVerified = false, 
  simplifiedStatus = false 
}: { 
  onlyVerified?: boolean;
  simplifiedStatus?: boolean;
}) {
  const { showToast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [selectedUserForBiodata, setSelectedUserForBiodata] = useState<AdminUser | null>(null);

  // Location Suggestion States (Pincode API) for Offline Registration Form
  const [pincodeSuggestions, setPincodeSuggestions] = useState<any[]>([]);
  const [fetchingPincode, setFetchingPincode] = useState(false);
  const [showPincodeSuggestions, setShowPincodeSuggestions] = useState(false);

  // ── Add Profile State ──────────────────────────────────
  const [showAddModal, setShowAddModal] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    gender: 'Male',
    age: '',
    maritalStatus: 'Single',
    location: '',
    job: '',
    education: '',
    salary: '',
    assets: '',
    description: '',
    height: '',
    childrenCount: '',
  });
  const [formPhoto, setFormPhoto] = useState<File | null>(null);
  const [formPhotoPreview, setFormPhotoPreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleAddProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name) {
      setFormError('Name is required');
      return;
    }
    if (formState.age && (isNaN(Number(formState.age)) || Number(formState.age) < 18)) {
      setFormError('Age must be a valid number >= 18');
      return;
    }

    setActionInProgress('add-profile');
    setFormError(null);

    try {
      const formData = new FormData();
      formData.append('name', formState.name);
      formData.append('phone', formState.phone);
      formData.append('gender', formState.gender);
      if (formState.age) formData.append('age', formState.age);
      formData.append('maritalStatus', formState.maritalStatus);
      formData.append('location', formState.location);
      formData.append('job', formState.job);
      formData.append('education', formState.education);
      formData.append('salary', formState.salary);
      formData.append('assets', formState.assets);
      formData.append('description', formState.description);
      if (formState.height) formData.append('height', formState.height);
      if (formState.maritalStatus === 'Widowed' && formState.childrenCount) {
        formData.append('childrenCount', formState.childrenCount);
      }
      if (formPhoto) {
        formData.append('profilePhoto', formPhoto);
      }

      await createOfflineUser(formData);
      showToast('Profile created successfully', 'success');
      
      // Reset form state
      setFormState({
        name: '',
        phone: '',
        gender: 'Male',
        age: '',
        maritalStatus: 'Single',
        location: '',
        job: '',
        education: '',
        salary: '',
        assets: '',
        description: '',
        height: '',
        childrenCount: '',
      });
      setPincodeSuggestions([]);
      setShowPincodeSuggestions(false);
      setFormPhoto(null);
      setFormPhotoPreview(null);
      setShowAddModal(false);

      // Refresh list
      fetchUsers();
    } catch (err: unknown) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : 'Failed to create offline profile';
      setFormError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setActionInProgress(null);
    }
  };

  // ── Fetch Users ────────────────────────────────────────
  const fetchUsers = async (phone?: string) => {
    setLoading(true);
    try {
      const data = await getAllUsers(phone || undefined);
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ── Debounced phone search ─────────────────────────────
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchUsers(search);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  // Click outside handler for admin location suggestions picker
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const container = document.getElementById('admin-location-picker-container');
      if (container && !container.contains(e.target as Node)) {
        setShowPincodeSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormState(prev => ({ ...prev, location: value }));

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
      if (!/^\d+$/.test(value)) {
        setShowPincodeSuggestions(false);
      }
    }
  };

  const handleLocationFocus = () => {
    const value = formState.location;
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
    setFormState(prev => ({ ...prev, location: fullLocation }));
    setShowPincodeSuggestions(false);
  };

  // ── Action handlers ────────────────────────────────────
  const handleApproveToggle = (user: AdminUser) => {
    setActionInProgress(user._id + '-approve');
    startTransition(async () => {
      try {
        if (user.isAdminApproved) {
          await revokeUser(user._id);
          showToast(`Approval revoked for ${user.name}`);
        } else {
          await approveUser(user._id);
          showToast(`User ${user.name} approved successfully!`);
        }
        // Refresh
        setUsers((prev) =>
          prev.map((u) =>
            u._id === user._id
              ? { ...u, isAdminApproved: !u.isAdminApproved }
              : u
          )
        );
      } catch (err) {
        console.error(err);
        showToast('Action failed. Please try again.', 'error');
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
        showToast(`Payment status updated for ${user.name}: ${newStatus ? 'Paid' : 'Unpaid'}`);
        setUsers((prev) =>
          prev.map((u) =>
            u._id === user._id ? { ...u, hasPaid: !u.hasPaid } : u
          )
        );
      } catch (err) {
        console.error(err);
        showToast('Action failed. Please try again.', 'error');
      } finally {
        setActionInProgress(null);
      }
    });
  };

  const handleDelete = (userId: string) => {
    setActionInProgress(userId + '-delete');
    startTransition(async () => {
      try {
        await deleteUser(userId);
        showToast('User deleted successfully.');
        setUsers((prev) => prev.filter((u) => u._id !== userId));
        setDeleteConfirm(null);
      } catch (err) {
        console.error(err);
        showToast('Delete failed. Please try again.', 'error');
      } finally {
        setActionInProgress(null);
      }
    });
  };

  // ── Format date ────────────────────────────────────────
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // ── Stats & Filtering ─────────────────────────────────────
  const displayedUsers = onlyVerified ? users.filter(u => u.isAdminApproved && u.hasPaid) : users;
  const totalUsers = displayedUsers.length;
  // const pendingApproval = displayedUsers.filter((u) => !u.isAdminApproved).length;
  // const paidUsers = displayedUsers.filter((u) => u.hasPaid).length;

  return (
    <section className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">{onlyVerified ? 'Verified Members' : 'User Management'}</h2>
          <p className="text-xs sm:text-sm text-gray-500">
            {onlyVerified ? 'View and manage fully verified community members.' : 'View registered users and manage account access.'}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <span className="bg-blue-50 text-blue-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-bold">
            {totalUsers} {onlyVerified ? 'Verified' : 'Total'} Users
          </span>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-[#9AD872] hover:bg-[#8bc964] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-bold transition-all shadow-sm shadow-[#9AD872]/20 cursor-pointer border-none"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Profile
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-full sm:max-w-md">
        <svg
          className="absolute left-4 top-3 sm:top-3.5 text-gray-400 w-4 sm:w-5 h-4 sm:h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search phone number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl sm:rounded-2xl py-2.5 sm:py-3 pl-11 sm:pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#9AD872]/30 focus:border-[#9AD872] transition-all outline-none"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-4 top-2.5 sm:top-3.5 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Table container */}
      <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#9AD872]" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2M9 7a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
            <p className="font-bold">No users found</p>
            <p className="text-sm mt-1">
              {search ? 'Try a different phone number' : 'No registrations yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
                    User Details
                  </th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
                    Registered Date
                  </th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
                    Account Status
                  </th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {displayedUsers.map((user) => {
                  const avatarGradient = user.gender === 'Male' 
                    ? 'from-blue-400 to-indigo-500 shadow-blue-500/10' 
                    : user.gender === 'Female' 
                    ? 'from-pink-400 to-rose-500 shadow-rose-500/10' 
                    : 'from-[#9AD872] to-emerald-500 shadow-[#9AD872]/10';

                  return (
                    <tr
                      key={user._id}
                      className="hover:bg-slate-50/40 transition-colors"
                    >
                      {/* User Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm`}>
                            {user.name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <p 
                              onClick={() => setSelectedUserForBiodata(user)}
                              className="font-bold text-gray-900 text-sm hover:text-[#9AD872] cursor-pointer transition-colors"
                              title="Click to view full biodata"
                            >
                              {user.name}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              {user.isOfflineProfile && (
                                <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                                  Offline Profile
                                </span>
                              )}
                              {user.gender && (
                                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                                  user.gender === 'Male' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'
                                }`}>
                                  {user.gender}
                                </span>
                              )}
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 text-slate-500 rounded-lg text-[9px] font-extrabold border border-slate-100">
                                <svg className="w-2.5 h-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                {user.location || '—'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl w-fit">
                          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                          {user.phone || '—'}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-xs">
                        <div className="flex items-center gap-1.5 text-gray-500 font-bold">
                          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          {formatDate(user.createdAt)}
                        </div>
                        {user.createdAt && (
                          <div className="text-[10px] text-gray-400 font-medium ml-5 mt-0.5">
                            {new Date(user.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4">
                        {simplifiedStatus ? (
                          user.isAdminApproved && user.hasPaid ? (
                            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl border border-emerald-100 w-fit">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4" /></svg>
                              <span className="text-[10px] font-black uppercase tracking-wider">Verified</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-xl border border-orange-100 w-fit">
                              <svg className="w-3.5 h-3.5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              <span className="text-[10px] font-black uppercase tracking-wider">Pending</span>
                            </div>
                          )
                        ) : onlyVerified ? (
                          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl border border-emerald-100 w-fit">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4" /></svg>
                            <span className="text-[10px] font-black uppercase tracking-wider">Verified</span>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2 max-w-[140px]">
                            <div className="flex items-center justify-between gap-3 bg-slate-50/50 p-2 rounded-2xl border border-slate-100/80">
                              <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">Verify</span>
                              <Toggle 
                                enabled={user.isAdminApproved} 
                                onToggle={() => handleApproveToggle(user)} 
                                pending={actionInProgress === user._id + '-approve'} 
                              />
                            </div>
                            <div className="flex items-center justify-between gap-3 bg-slate-50/50 p-2 rounded-2xl border border-slate-100/80">
                              <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">Payment</span>
                              <Toggle 
                                enabled={user.hasPaid} 
                                onToggle={() => handlePaymentToggle(user)} 
                                pending={actionInProgress === user._id + '-payment'} 
                                colorOn="bg-blue-500"
                              />
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* View Biodata Button */}
                          <button
                            onClick={() => setSelectedUserForBiodata(user)}
                            className="p-2.5 rounded-xl bg-[#9AD872]/15 text-[#5e9637] hover:bg-[#9AD872]/25 hover:text-[#4a772b] hover:scale-105 active:scale-95 transition-all shadow-sm shadow-[#9AD872]/5"
                            title="View Biodata"
                          >
                            <svg
                              width="16"
                              height="16"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              strokeWidth="2.5"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>

                          {deleteConfirm === user._id ? (
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleDelete(user._id)}
                                disabled={actionInProgress === user._id + '-delete'}
                                className="text-[10px] font-black uppercase bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 hover:scale-105 active:scale-95 transition-all shadow-sm shadow-red-500/10 disabled:opacity-50"
                              >
                                {actionInProgress === user._id + '-delete'
                                  ? 'Deleting…'
                                  : 'Confirm'}
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="text-[10px] font-black uppercase bg-gray-100 text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-all"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(user._id)}
                              className="p-2.5 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-500 hover:scale-105 active:scale-95 transition-all shadow-sm shadow-red-100"
                              title="Delete user"
                            >
                              <svg
                                width="16"
                                height="16"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                              >
                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ───────────────────── BIODATA MODAL ───────────────────── */}
      {selectedUserForBiodata && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm print:hidden animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-100 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 sm:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-gray-900">Member Biodata</h3>
                <p className="text-xs text-gray-500">View complete profile details for printing or PDF export.</p>
              </div>
              <button 
                onClick={() => setSelectedUserForBiodata(null)}
                className="p-2 rounded-xl bg-white hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all border border-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
              
              {/* Profile Card Summary */}
              <div className="flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-br from-[#9AD872]/10 to-emerald-500/5 p-6 rounded-3xl border border-[#9AD872]/20">
                {selectedUserForBiodata.profilePhoto ? (
                  <img
                    src={selectedUserForBiodata.profilePhoto}
                    alt={selectedUserForBiodata.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-2xl shadow-md border-2 border-white"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-[#9AD872] to-emerald-400 flex items-center justify-center text-white text-3xl font-extrabold shadow-md">
                    {selectedUserForBiodata.name?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
                
                <div className="text-center sm:text-left space-y-1.5 flex-1">
                  <h4 className="text-xl sm:text-2xl font-black text-gray-900">{selectedUserForBiodata.name}</h4>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    <span className="bg-white border border-gray-100 text-gray-600 px-3 py-1 rounded-xl text-xs font-bold">
                      {selectedUserForBiodata.age || '—'} Yrs • {selectedUserForBiodata.gender}
                    </span>
                    <span className="bg-white border border-gray-100 text-gray-600 px-3 py-1 rounded-xl text-xs font-bold">
                      {selectedUserForBiodata.maritalStatus || 'Single'}
                    </span>
                    <span className="bg-white border border-gray-100 text-gray-600 px-3 py-1 rounded-xl text-xs font-bold">
                      {selectedUserForBiodata.location || '—'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-medium">Joined {formatDate(selectedUserForBiodata.createdAt)}</p>
                </div>
              </div>

              {/* Personal Details Section */}
              <div className="space-y-4">
                <h5 className="text-xs uppercase font-extrabold text-[#5e9637] tracking-widest border-b border-gray-100 pb-2">Personal & Family Background</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DetailField label="Marital Status" value={selectedUserForBiodata.maritalStatus} />
                  <DetailField label="Current Location" value={selectedUserForBiodata.location} />
                  <DetailField label="Gender" value={selectedUserForBiodata.gender} />
                  <DetailField label="Age" value={selectedUserForBiodata.age ? `${selectedUserForBiodata.age} Years` : null} />
                  <DetailField label="Height" value={selectedUserForBiodata.height} />
                  {selectedUserForBiodata.maritalStatus === 'Widowed' && (
                    <DetailField label="Children Count" value={selectedUserForBiodata.childrenCount} />
                  )}
                </div>
              </div>

              {/* Education & Career Details Section */}
              <div className="space-y-4">
                <h5 className="text-xs uppercase font-extrabold text-[#5e9637] tracking-widest border-b border-gray-100 pb-2">Education & Professional Details</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DetailField label="Education Qualification" value={selectedUserForBiodata.education} />
                  <DetailField label="Occupation / Job" value={selectedUserForBiodata.job || selectedUserForBiodata.profession} />
                  <DetailField label="Monthly/Annual Income" value={selectedUserForBiodata.salary} />
                  <DetailField label="Assets & Property" value={selectedUserForBiodata.assets} />
                </div>
              </div>

              {/* Contact Details Section */}
              <div className="space-y-4">
                <h5 className="text-xs uppercase font-extrabold text-[#5e9637] tracking-widest border-b border-gray-100 pb-2">Contact Details</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DetailField label="Phone / Mobile" value={selectedUserForBiodata.phone} isMono={true} />
                  <DetailField 
                    label="Email Address" 
                    value={selectedUserForBiodata.isOfflineProfile ? "Admin Managed (No Login)" : selectedUserForBiodata.email} 
                  />
                </div>
              </div>

              {/* About description */}
              {selectedUserForBiodata.description && (
                <div className="space-y-3">
                  <h5 className="text-xs uppercase font-extrabold text-[#5e9637] tracking-widest border-b border-gray-100 pb-2">About / Partner expectations</h5>
                  <p className="text-sm text-gray-600 leading-relaxed italic bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                    &ldquo;{selectedUserForBiodata.description}&rdquo;
                  </p>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <button
                onClick={() => setSelectedUserForBiodata(null)}
                className="px-6 py-3 rounded-2xl bg-white text-gray-600 font-bold text-sm hover:bg-gray-100 border border-gray-200 transition-all"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-3 rounded-2xl bg-[#9AD872] hover:bg-[#8bc964] text-white font-bold text-sm flex items-center gap-2 transition-all shadow-md shadow-[#9AD872]/20"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────── PRINTABLE BIODATA SHEET ───────────────────── */}
      {selectedUserForBiodata && (
        <div id="printable-biodata" className="hidden print:block absolute inset-0 bg-white text-black p-8 z-[9999] w-full font-sans">
          <div className="max-w-3xl mx-auto border-4 border-double border-gray-300 p-8 rounded-2xl bg-white">
            
            {/* Header Banner */}
            <div className="text-center border-b-2 border-gray-200 pb-6 mb-6">
              <h1 className="text-3xl font-extrabold text-[#528033] tracking-wide uppercase">Al Fattah Matrimony</h1>
              <p className="text-[10px] text-gray-400 font-bold tracking-widest mt-1 uppercase">COMMUNITY MUSLIM MATRIMONY BIODATA</p>
            </div>

            {/* Profile Content Grid */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              
              {/* Info Column (Left 2 cols) */}
              <div className="col-span-2 space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Full Name</span>
                  <p className="text-2xl font-black text-gray-900 leading-tight">{selectedUserForBiodata.name}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Age</span>
                    <p className="font-semibold text-gray-800">{selectedUserForBiodata.age || '—'} Years</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Gender</span>
                    <p className="font-semibold text-gray-800">{selectedUserForBiodata.gender || '—'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Marital Status</span>
                    <p className="font-semibold text-gray-800">{selectedUserForBiodata.maritalStatus || '—'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Location</span>
                    <p className="font-semibold text-gray-800">{selectedUserForBiodata.location || '—'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Height</span>
                    <p className="font-semibold text-gray-800">{selectedUserForBiodata.height || '—'}</p>
                  </div>
                  {selectedUserForBiodata.maritalStatus === 'Widowed' && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Children Count</span>
                      <p className="font-semibold text-gray-800">{selectedUserForBiodata.childrenCount ?? '0'}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Photo Column (Right 1 col) */}
              <div className="flex flex-col items-center justify-start">
                {selectedUserForBiodata.profilePhoto ? (
                  <img
                    src={selectedUserForBiodata.profilePhoto}
                    alt={selectedUserForBiodata.name}
                    className="w-32 h-40 object-cover rounded-xl border border-gray-200"
                  />
                ) : (
                  <div className="w-32 h-40 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center text-center p-2 text-gray-300">
                    <svg className="w-10 h-10 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    <span className="text-[10px] font-semibold uppercase">No Photo</span>
                  </div>
                )}
              </div>

            </div>

            {/* Section: Professional Details */}
            <div className="mb-6">
              <h3 className="text-xs uppercase font-extrabold text-[#528033] tracking-widest border-b border-gray-100 pb-1.5 mb-3">Professional & Financial Details</h3>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Education</span>
                  <span className="text-gray-800 font-medium">{selectedUserForBiodata.education || '—'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Occupation / Job</span>
                  <span className="text-gray-800 font-medium">{selectedUserForBiodata.job || selectedUserForBiodata.profession || '—'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Monthly/Annual Income</span>
                  <span className="text-gray-800 font-medium">{selectedUserForBiodata.salary || '—'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Assets Details</span>
                  <span className="text-gray-800 font-medium">{selectedUserForBiodata.assets || '—'}</span>
                </div>
              </div>
            </div>

            {/* Section: Contact Details */}
            <div className="mb-6">
              <h3 className="text-xs uppercase font-extrabold text-[#528033] tracking-widest border-b border-gray-100 pb-1.5 mb-3">Contact Information</h3>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Mobile / Phone</span>
                  <span className="text-gray-800 font-medium font-mono">{selectedUserForBiodata.phone || '—'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Email Address</span>
                  <span className="text-gray-800 font-medium">
                    {selectedUserForBiodata.isOfflineProfile ? "Admin Managed (No Login)" : selectedUserForBiodata.email || '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* Section: About / Description */}
            {selectedUserForBiodata.description && (
              <div className="mb-6">
                <h3 className="text-xs uppercase font-extrabold text-[#528033] tracking-widest border-b border-gray-100 pb-1.5 mb-2">About / Partner Expectations</h3>
                <p className="text-sm text-gray-600 leading-relaxed italic bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  &ldquo;{selectedUserForBiodata.description}&rdquo;
                </p>
              </div>
            )}

            {/* Footer stamp */}
            <div className="mt-12 text-center text-[10px] text-gray-400 font-medium border-t border-gray-100 pt-4">
              Generated on {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} • Al Fattah Matrimony System
            </div>

          </div>
        </div>
      )}

      {/* ───────────────────── ADD OFFLINE PROFILE MODAL ───────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-100 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 sm:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-gray-900">Add Offline Profile</h3>
                <p className="text-xs text-gray-500">Create a matrimonial profile managed directly by the admin.</p>
              </div>
              <button 
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setFormError(null);
                }}
                className="p-2 rounded-xl bg-white hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all border border-gray-100 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAddProfile} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
              {formError && (
                <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>{formError}</span>
                </div>
              )}

              {/* Photo Upload Row */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-gray-50/50 border border-gray-100 rounded-3xl">
                <div className="relative group shrink-0">
                  {formPhotoPreview ? (
                    <img 
                      src={formPhotoPreview} 
                      alt="Preview" 
                      className="w-24 h-24 object-cover rounded-2xl border-2 border-white shadow-md"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#9AD872] to-emerald-400 flex items-center justify-center text-white text-3xl font-extrabold shadow-md">
                      📸
                    </div>
                  )}
                </div>
                <div className="space-y-1 text-center sm:text-left flex-1">
                  <h4 className="text-sm font-bold text-gray-800">Profile Photo</h4>
                  <p className="text-xs text-gray-400">Upload a portrait image (JPG, PNG, WebP). Max 5MB.</p>
                  <div className="pt-2">
                    <label className="inline-block px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs rounded-xl cursor-pointer shadow-sm transition-all">
                      Choose Photo
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                              setFormError('File size exceeds 5MB limit.');
                              return;
                            }
                            setFormPhoto(file);
                            setFormPhotoPreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </label>
                    {formPhoto && (
                      <button 
                        type="button"
                        onClick={() => {
                          setFormPhoto(null);
                          setFormPhotoPreview(null);
                        }}
                        className="ml-3 text-xs text-red-500 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-extrabold text-gray-500 tracking-wider block">Full Name *</label>
                  <input 
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({...formState, name: e.target.value})}
                    placeholder="Enter name"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-[#9AD872]/30 focus:border-[#9AD872] outline-none transition-all"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-extrabold text-gray-500 tracking-wider block">Phone / Mobile</label>
                  <input 
                    type="text"
                    value={formState.phone}
                    onChange={(e) => setFormState({...formState, phone: e.target.value})}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-[#9AD872]/30 focus:border-[#9AD872] outline-none transition-all"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-extrabold text-gray-500 tracking-wider block">Gender</label>
                  <select 
                    value={formState.gender}
                    onChange={(e) => setFormState({...formState, gender: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-[#9AD872]/30 focus:border-[#9AD872] outline-none transition-all"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {/* Age */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-extrabold text-gray-500 tracking-wider block">Age</label>
                  <input 
                    type="number"
                    min="18"
                    max="100"
                    value={formState.age}
                    onChange={(e) => setFormState({...formState, age: e.target.value})}
                    placeholder="e.g. 25"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-[#9AD872]/30 focus:border-[#9AD872] outline-none transition-all"
                  />
                </div>

                {/* Marital Status */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-extrabold text-gray-500 tracking-wider block">Marital Status</label>
                  <select 
                    value={formState.maritalStatus}
                    onChange={(e) => setFormState({...formState, maritalStatus: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-[#9AD872]/30 focus:border-[#9AD872] outline-none transition-all"
                  >
                    <option value="Single">Single</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>

                {/* Children Count (shown only if Widowed) */}
                {formState.maritalStatus === 'Widowed' && (
                  <div className="space-y-1.5 animate-fadeIn">
                    <label className="text-xs uppercase font-extrabold text-gray-500 tracking-wider block">Children Count</label>
                    <input 
                      type="number"
                      min="0"
                      max="20"
                      value={formState.childrenCount}
                      onChange={(e) => setFormState({...formState, childrenCount: e.target.value})}
                      placeholder="e.g. 2"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-[#9AD872]/30 focus:border-[#9AD872] outline-none transition-all"
                    />
                  </div>
                )}

                {/* Height */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-extrabold text-gray-500 tracking-wider block">Height</label>
                  <input 
                    type="text"
                    value={formState.height}
                    onChange={(e) => setFormState({...formState, height: e.target.value})}
                    placeholder="e.g. 5'6&quot; or 168 cm"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-[#9AD872]/30 focus:border-[#9AD872] outline-none transition-all"
                  />
                </div>

                {/* Location */}
                <div className="space-y-1.5 relative" id="admin-location-picker-container">
                  <label className="text-xs uppercase font-extrabold text-gray-500 tracking-wider block">Current Location / Pincode</label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={formState.location}
                      onChange={handleLocationChange}
                      onFocus={handleLocationFocus}
                      placeholder="Enter 6-digit Pincode (e.g. 621108)"
                      autoComplete="off"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-[#9AD872]/30 focus:border-[#9AD872] outline-none transition-all"
                    />
                    {formState.location && (
                      <button 
                        type="button" 
                        onClick={() => {
                          setFormState({ ...formState, location: '' });
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

                {/* Job */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-extrabold text-gray-500 tracking-wider block">Occupation / Job</label>
                  <input 
                    type="text"
                    value={formState.job}
                    onChange={(e) => setFormState({...formState, job: e.target.value})}
                    placeholder="e.g. Software Engineer"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-[#9AD872]/30 focus:border-[#9AD872] outline-none transition-all"
                  />
                </div>

                {/* Education */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-extrabold text-gray-500 tracking-wider block">Education</label>
                  <input 
                    type="text"
                    value={formState.education}
                    onChange={(e) => setFormState({...formState, education: e.target.value})}
                    placeholder="e.g. B.Tech IT"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-[#9AD872]/30 focus:border-[#9AD872] outline-none transition-all"
                  />
                </div>

                {/* Income */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-extrabold text-gray-500 tracking-wider block">Monthly/Annual Income</label>
                  <input 
                    type="text"
                    value={formState.salary}
                    onChange={(e) => setFormState({...formState, salary: e.target.value})}
                    placeholder="e.g. ₹50,000 / Month"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-[#9AD872]/30 focus:border-[#9AD872] outline-none transition-all"
                  />
                </div>

                {/* Assets */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-extrabold text-gray-500 tracking-wider block">Assets Details</label>
                  <input 
                    type="text"
                    value={formState.assets}
                    onChange={(e) => setFormState({...formState, assets: e.target.value})}
                    placeholder="e.g. House, 2 acres land"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-[#9AD872]/30 focus:border-[#9AD872] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs uppercase font-extrabold text-gray-500 tracking-wider block">About / Partner Expectations</label>
                <textarea 
                  value={formState.description}
                  onChange={(e) => setFormState({...formState, description: e.target.value})}
                  placeholder="Tell us about the user's family, religious values, or partner preferences..."
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-[#9AD872]/30 focus:border-[#9AD872] outline-none transition-all resize-none"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 font-sans">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormError(null);
                  }}
                  className="px-6 py-3 rounded-2xl bg-white text-gray-600 font-bold text-sm hover:bg-gray-100 border border-gray-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionInProgress === 'add-profile'}
                  className="px-6 py-3 rounded-2xl bg-[#9AD872] hover:bg-[#8bc964] text-white font-bold text-sm transition-all shadow-md shadow-[#9AD872]/20 disabled:opacity-50 disabled:cursor-wait flex items-center gap-2 cursor-pointer border-none"
                >
                  {actionInProgress === 'add-profile' ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable CSS style tag overrides */}
      {selectedUserForBiodata && (
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-biodata, #printable-biodata * {
              visibility: visible;
            }
            #printable-biodata {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              background: white;
            }
          }
        `}} />
      )}
    </section>
  );
}
