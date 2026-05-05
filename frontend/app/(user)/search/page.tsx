import React, { Suspense } from 'react';
import SearchResultsContent from '@/app/components/SearchResults';

// Force dynamic rendering at the server level
export const dynamic = "force-dynamic";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#9AD872] font-black uppercase tracking-widest">Finding Matches...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}