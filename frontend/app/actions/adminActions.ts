'use server';
import { cookies } from 'next/headers';

/**
 * adminActions.ts
 *
 * Server Actions for Al Fattah Admin Panel.
 * These run exclusively on the server — the ADMIN_SECRET env var is never
 * sent to the browser. All mutations talk directly to the Express/MongoDB
 * backend via the secured /api/admin/* routes.
 */

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

async function getAdminHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Cookie': `admin_token=${token}` } : {})
  };
}

// ── Types ─────────────────────────────────────────────────────────────────

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  age?: number;
  gender?: string;
  location?: string;
  education?: string;
  profilePhoto?: string;
  isAdminApproved: boolean;
  hasPaid: boolean;
  registrationDate?: string;
  createdAt?: string;
}

export interface AdminInterest {
  _id: string;
  sender: {
    _id: string;
    name: string;
    phone: string;
    email: string;
    gender: string;
    profilePhoto?: string;
    isMarried?: boolean;
  };
  receiver: {
    _id: string;
    name: string;
    phone: string;
    email: string;
    gender: string;
    profilePhoto?: string;
    isMarried?: boolean;
  };
  status: string;
  isMutual: boolean;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  pendingVerifications: number;
  totalInterests: number;
  mutualMatches: number;
  successStories: number;
}

export interface AdminProfile {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

// ── getAllUsers ────────────────────────────────────────────────────────────

/**
 * Fetch all users from the database.
 * Pass `phone` to search by phone number (partial match).
 */
export async function getAllUsers(phone?: string): Promise<AdminUser[]> {
  const url = new URL(`${API}/api/admin/users`);
  if (phone) url.searchParams.set('phone', phone);

  const res = await fetch(url.toString(), {
    headers: await getAdminHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

// ── approveUser ───────────────────────────────────────────────────────────

/**
 * Sets isAdminApproved = true for a user.
 * Approved profiles become visible in the discovery / search page.
 */
export async function approveUser(userId: string): Promise<AdminUser> {
  const res = await fetch(`${API}/api/admin/approve/${userId}`, {
    method: 'PATCH',
    headers: await getAdminHeaders(),
  });

  if (!res.ok) throw new Error('Failed to approve user');
  const data = await res.json();
  return data.user;
}

// ── revokeUser ────────────────────────────────────────────────────────────

/**
 * Sets isAdminApproved = false — hides the profile from discovery.
 */
export async function revokeUser(userId: string): Promise<AdminUser> {
  const res = await fetch(`${API}/api/admin/revoke/${userId}`, {
    method: 'PATCH',
    headers: await getAdminHeaders(),
  });

  if (!res.ok) throw new Error('Failed to revoke user');
  const data = await res.json();
  return data.user;
}

// ── togglePaymentStatus ───────────────────────────────────────────────────

/**
 * Toggles hasPaid for a user.
 * When hasPaid is true, that user can see phone numbers of other profiles.
 */
export async function togglePaymentStatus(userId: string): Promise<AdminUser> {
  const res = await fetch(`${API}/api/admin/payment/${userId}`, {
    method: 'PATCH',
    headers: await getAdminHeaders(),
  });

  if (!res.ok) throw new Error('Failed to toggle payment status');
  const data = await res.json();
  return data.user;
}

// ── deleteUser ────────────────────────────────────────────────────────────

/**
 * Permanently deletes a user account (for fake / abusive accounts).
 */
export async function deleteUser(userId: string): Promise<void> {
  const res = await fetch(`${API}/api/admin/user/${userId}`, {
    method: 'DELETE',
    headers: await getAdminHeaders(),
  });

  if (!res.ok) throw new Error('Failed to delete user');
}

// ── getAllInterests ────────────────────────────────────────────────────────
/**
 * Fetch all interests and matches for the admin.
 */
export async function getAllInterests(): Promise<AdminInterest[]> {
  const res = await fetch(`${API}/api/admin/interests`, {
    headers: await getAdminHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch interests');
  return res.json();
}

// ── getAdminDashboardStats ────────────────────────────────────────────────
/**
 * Fetch overview statistics for the admin dashboard.
 */
export async function getAdminDashboardStats(): Promise<AdminStats> {
  const res = await fetch(`${API}/api/admin/stats`, {
    headers: await getAdminHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch dashboard stats');
  return res.json();
}

// ── getAdminProfile ───────────────────────────────────────────────────────
/**
 * Fetch the current admin's profile information.
 */
export async function getAdminProfile(): Promise<AdminProfile> {
  const res = await fetch(`${API}/api/admin/profile`, {
    headers: await getAdminHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch admin profile');
  return res.json();
}

// ── updateAdminProfile ────────────────────────────────────────────────────
/**
 * Update the admin's profile information (username, email, and/or password).
 */
export async function updateAdminProfile(data: { username?: string; email?: string; password?: string }): Promise<{ message: string }> {
  const res = await fetch(`${API}/api/admin/profile`, {
    method: 'PATCH',
    headers: await getAdminHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Failed to update admin profile');
  return res.json();
}

// ── adminSignOut ─────────────────────────────────────────────────────────
/**
 * Sign out the admin by clearing the admin_token cookie.
 */
export async function adminSignOut() {
  (await cookies()).delete('admin_token');
}

// ── markAsMarried ─────────────────────────────────────────────────────────
/**
 * Mark a pair of users as married and create a success story.
 */
export async function markAsMarried(husbandId: string, wifeId: string): Promise<{ message: string }> {
  const res = await fetch(`${API}/api/admin/marry`, {
    method: 'PATCH',
    headers: await getAdminHeaders(),
    body: JSON.stringify({ husbandId, wifeId }),
  });

  if (!res.ok) throw new Error('Failed to mark as married');
  return res.json();
}

// ── unmarkAsMarried ───────────────────────────────────────────────────────
/**
 * Undo marriage status for a pair of users.
 */
export async function unmarkAsMarried(husbandId: string, wifeId: string): Promise<{ message: string }> {
  const res = await fetch(`${API}/api/admin/unmarry`, {
    method: 'DELETE',
    headers: await getAdminHeaders(),
    body: JSON.stringify({ husbandId, wifeId }),
  });

  if (!res.ok) throw new Error('Failed to undo marriage status');
  return res.json();
}
