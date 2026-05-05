import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Force dynamic rendering at the server level
export const dynamic = "force-dynamic";

// Import RegisterForm with SSR disabled to completely bypass prerendering issues
const RegisterForm = dynamic(() => import('@/app/components/RegisterForm'), { 
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center font-bold text-gray-400 uppercase tracking-widest">Loading...</div>
});

export default function Register() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-gray-400 uppercase tracking-widest">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
