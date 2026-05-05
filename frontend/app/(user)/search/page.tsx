import React, { Suspense } from 'react';
import NextDynamic from 'next/dynamic';

// Force dynamic rendering at the server level
export const dynamic = "force-dynamic";

// Import SearchResultsContent with SSR disabled to completely bypass prerendering issues
const SearchResultsContent = NextDynamic(() => import('@/app/components/SearchResults'), { 
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center text-[#9AD872] font-black uppercase tracking-widest">Finding Matches...</div>
});

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#9AD872] font-black uppercase tracking-widest">Finding Matches...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}