import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function handler(request: NextRequest, { params }: { params: { path: string[] } }) {
  const cookieStore = await cookies();
  const path = params.path.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  const targetUrl = `${BACKEND_URL}/api/${path}${searchParams ? `?${searchParams}` : ''}`;

  // Read the token from the Vercel-domain cookie
  const userToken = cookieStore.get('user_token')?.value;
  const adminToken = cookieStore.get('admin_token')?.value;
  const token = adminToken || userToken;

  const headers: HeadersInit = {};

  // Forward content-type if present (but not for FormData)
  const contentType = request.headers.get('content-type');
  if (contentType && !contentType.includes('multipart/form-data')) {
    headers['Content-Type'] = contentType;
  }

  // Attach JWT as Authorization header to bypass cross-domain cookie issue
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let body: BodyInit | null = null;
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    if (contentType?.includes('multipart/form-data')) {
      body = await request.blob();
    } else {
      body = await request.text();
    }
  }

  try {
    const backendRes = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: body || undefined,
    });

    const responseContentType = backendRes.headers.get('content-type') || '';
    let responseBody: BodyInit;

    if (responseContentType.includes('application/json')) {
      const json = await backendRes.json();
      responseBody = JSON.stringify(json);
    } else {
      responseBody = await backendRes.blob();
    }

    return new NextResponse(responseBody, {
      status: backendRes.status,
      headers: {
        'Content-Type': responseContentType || 'application/json',
      },
    });
  } catch (err) {
    console.error('Proxy error:', err);
    return NextResponse.json({ message: 'Proxy connection failed' }, { status: 502 });
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
