import React, { Suspense } from 'react';
import RegisterForm from '@/app/components/RegisterForm';

// Force dynamic rendering at the server level
export const dynamic = "force-dynamic";

export default function Register() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-gray-400 uppercase tracking-widest">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
