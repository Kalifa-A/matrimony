import React, { Suspense } from 'react';
import NextDynamic from 'next/dynamic';

export const dynamic = "force-dynamic";

export default function SearchPage() {
  const SearchResultsContent = NextDynamic(() => import('../../components/SearchResults'), { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center text-[#9AD872] font-black uppercase tracking-widest">
        Finding Matches...
      </div>
    )
  });

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-[#9AD872] font-black uppercase tracking-widest">
        Finding Matches...
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}