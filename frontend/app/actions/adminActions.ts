export interface AdminStats {
  totalUsers: number;
  pendingUsers: number;
  activeUsers: number;
  paidUsers: number;
  totalInterests: number;
  successStories: number;
  pendingVerifications: number;
  mutualMatches: number;
}

export interface AdminProfile {
  _id: string;
  username: string;
  email: string;
  role?: string;
  createdAt?: string;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  age: number;
  profession: string;
  location: string;
  isApproved: boolean;
  hasPaid: boolean;
  profilePhoto?: string;
  isMarried?: boolean;
  createdAt?: string;
}

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

function getAuthHeader(): HeadersInit {
  // Authorization header is now secondary to httpOnly cookies
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('admin_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export async function getAllUsers(phone?: string) {
  const url = new URL(`${API}/api/admin/users`);
  if (phone) url.searchParams.append('phone', phone);

  const res = await fetch(url.toString(), {
    headers: {
      ...getAuthHeader(),
    },
    credentials: 'include'
  });

  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function approveUser(userId: string) {
  const res = await fetch(`${API}/api/admin/approve/${userId}`, {
    method: 'POST',
    headers: { ...getAuthHeader() },
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Failed to approve user');
  return res.json();
}

export async function revokeUser(userId: string) {
  const res = await fetch(`${API}/api/admin/revoke/${userId}`, {
    method: 'POST',
    headers: { ...getAuthHeader() },
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Failed to revoke user');
  return res.json();
}

export async function togglePaymentStatus(userId: string) {
  const res = await fetch(`${API}/api/admin/payment/${userId}`, {
    method: 'POST',
    headers: { ...getAuthHeader() },
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Failed to update payment status');
  return res.json();
}

export async function deleteUser(userId: string) {
  const res = await fetch(`${API}/api/admin/user/${userId}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Failed to delete user');
  return res.json();
}

export async function getAllInterests() {
  const res = await fetch(`${API}/api/admin/interests`, {
    headers: { ...getAuthHeader() },
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Failed to fetch interests');
  return res.json();
}

export async function getDashboardStats() {
  const res = await fetch(`${API}/api/admin/stats`, {
    headers: { ...getAuthHeader() },
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Failed to fetch dashboard stats');
  return res.json();
}

export async function getAdminProfile() {
  const res = await fetch(`${API}/api/admin/profile`, {
    headers: { ...getAuthHeader() },
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Failed to fetch admin profile');
  return res.json();
}

export async function updateAdminProfile(data: any) {
  const res = await fetch(`${API}/api/admin/profile`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeader() 
    },
    credentials: 'include',
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
}

export async function marryUsers(user1Id: string, user2Id: string) {
  const res = await fetch(`${API}/api/admin/marry`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeader() 
    },
    body: JSON.stringify({ user1Id, user2Id })
  });
  if (!res.ok) throw new Error('Failed to marry users');
  return res.json();
}

export async function unmarryUsers(user1Id: string, user2Id: string) {
  const res = await fetch(`${API}/api/admin/unmarry`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeader() 
    },
    body: JSON.stringify({ user1Id, user2Id })
  });
  if (!res.ok) throw new Error('Failed to unmarry users');
  return res.json();
}
