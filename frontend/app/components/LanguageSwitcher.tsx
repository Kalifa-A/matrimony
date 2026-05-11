"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/navigation';
import { Globe } from 'lucide-react';
import { useTransition } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const toggleLanguage = () => {
    const nextLocale = locale === 'en' ? 'ta' : 'en';
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <button
      onClick={toggleLanguage}
      disabled={isPending}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-[#9AD872]/10 text-gray-600 hover:text-[#9AD872] transition-all font-bold text-sm border border-gray-200 hover:border-[#9AD872]/30 disabled:opacity-50"
      title={`Switch to ${locale === 'en' ? 'Tamil' : 'English'}`}
    >
      <Globe size={16} />
      <span className="uppercase">{locale}</span>
    </button>
  );
}
