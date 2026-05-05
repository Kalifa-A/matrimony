import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { token, type } = await request.json();

  if (!token || !type) {
    return NextResponse.json({ error: 'Missing token or type' }, { status: 400 });
  }

  const cookieName = type === 'admin' ? 'admin_token' : 'user_token';
  const maxAge = type === 'admin' ? 60 * 60 : 60 * 60 * 24 * 7; // 1hr for admin, 7 days for users

  const response = NextResponse.json({ success: true });

  response.cookies.set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  });

  return response;
}

export async function DELETE(request: NextRequest) {
  const { type } = await request.json();
  const cookieName = type === 'admin' ? 'admin_token' : 'user_token';

  const response = NextResponse.json({ success: true });
  response.cookies.delete(cookieName);
  return response;
}
