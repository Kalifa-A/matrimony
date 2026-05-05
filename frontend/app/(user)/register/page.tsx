import React, { Suspense } from 'react';
import NextDynamic from 'next/dynamic';

// Force dynamic rendering at the server level
export const dynamic = "force-dynamic";

// Import RegisterForm with SSR disabled to completely bypass prerendering issues
const RegisterForm = NextDynamic(() => import('../../components/RegisterForm'), { 
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center font-bold text-gray-400 uppercase tracking-widest">Loading...</div>
});

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-gray-400 uppercase tracking-widest">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}