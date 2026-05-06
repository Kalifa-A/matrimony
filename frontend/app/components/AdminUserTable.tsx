'use client';

import React, { useState, useEffect, useTransition } from 'react';
import {
  getAllUsers,
  approveUser,
  revokeUser,
  togglePaymentStatus,
  deleteUser,
  type AdminUser,
} from '@/app/actions/adminActions';

import { useToast } from '@/app/components/ToastProvider';

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
export default function AdminUserTable() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

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

  // ── Action handlers ────────────────────────────────────
  const handleApproveToggle = (user: AdminUser) => {
    setActionInProgress(user._id + '-approve');
    startTransition(async () => {
      try {
        if (user.isApproved) {
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
              ? { ...u, isApproved: !u.isApproved }
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

  // ── Stats ──────────────────────────────────────────────
  const totalUsers = users.length;
  const pendingApproval = users.filter((u) => !u.isApproved).length;
  const paidUsers = users.filter((u) => u.hasPaid).length;

  return (
    <section className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">User Management</h2>
          <p className="text-xs sm:text-sm text-gray-500">
            View registered users and manage account access.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className="bg-blue-50 text-blue-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-bold">
            {totalUsers} Total Users
          </span>
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
                <tr className="bg-gray-50/80">
                  <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    User
                  </th>
                  <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Phone
                  </th>
                  <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Registered
                  </th>
                  <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    {/* User Info */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9AD872] to-emerald-400 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                          {user.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {user.location || 'No location'} • {user.gender || '—'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="p-4">
                      <span className="font-mono text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded-lg">
                        {user.phone || '—'}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="p-4 text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {user.isApproved ? (
                          <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg text-[10px] font-bold uppercase">Verified</span>
                        ) : (
                          <span className="bg-orange-50 text-orange-600 px-2 py-1 rounded-lg text-[10px] font-bold uppercase">Pending Call</span>
                        )}
                        {user.hasPaid ? (
                          <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-[10px] font-bold uppercase">Paid</span>
                        ) : (
                          <span className="bg-gray-100 text-gray-400 px-2 py-1 rounded-lg text-[10px] font-bold uppercase">Unpaid</span>
                        )}
                      </div>
                    </td>

                    {/* Delete */}
                    <td className="p-4 text-center">
                      {deleteConfirm === user._id ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleDelete(user._id)}
                            disabled={actionInProgress === user._id + '-delete'}
                            className="text-[10px] font-black uppercase bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-all disabled:opacity-50"
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
                          className="p-2.5 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-500 transition-all"
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
